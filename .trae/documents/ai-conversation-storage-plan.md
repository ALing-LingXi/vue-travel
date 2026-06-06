# AI 对话记录存储功能实现计划

## 一、需求概述

实现 AI 对话记录的持久化存储，支持多个对话会话管理，类似 ChatGPT 的对话列表功能。

**用户选择**：
- ✅ 后端数据库存储（SQLite + Prisma）
- ✅ 支持多个对话会话

## 二、现状分析

### 已有基础
1. ✅ 数据库表已创建：`Conversation`（对话会话）和 `Message`（消息记录）
   - `Conversation` 表：id, userId, title, createdAt, updatedAt
   - `Message` 表：id, conversationId, role, content, createdAt

2. ✅ 用户认证系统已完善：
   - 前端使用传智 API 进行登录注册
   - 用户信息存储在 localStorage（包含 id、username、token）
   - `/chart` 页面已配置需要登录

3. ❌ 后端未使用数据库：
   - 缺少 `schema.prisma` 文件
   - `chat()` 方法未保存对话记录

4. ❌ 前端未持久化：
   - `messages` 数组仅在内存中
   - 刷新页面后对话丢失

## 三、实现方案

### 3.1 后端实现（Backend）

#### 3.1.1 创建 Prisma Schema
**文件**：`Backend/prisma/schema.prisma`

**内容**：
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Conversation {
  id        String    @id @default(uuid())
  userId    String
  title     String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  Message[]

  @@index([userId])
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  role           String       // 'user' 或 'ai'
  content        String
  createdAt      DateTime     @default(now())
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@index([conversationId])
}
```

**原因**：
- 使用 UUID 作为主键，便于前端传递
- `userId` 用于关联用户
- `title` 用于显示对话标题
- `onDelete: Cascade` 确保删除对话时同时删除消息

#### 3.1.2 创建对话管理服务
**文件**：`Backend/src/services/conversationService.js`

**功能**：
- 创建新对话
- 获取用户所有对话列表
- 获取单个对话的所有消息
- 删除对话
- 重命名对话
- 保存消息到对话

**实现要点**：
- 使用 Prisma Client 操作数据库
- 根据 `userId` 隔离不同用户的对话
- 自动生成对话标题（取第一条消息的前 20 个字符）

#### 3.1.3 修改聊天服务
**文件**：`Backend/src/services/traelService.js`

**修改内容**：
- `chat()` 方法新增参数：`userId`、`conversationId`（可选）
- 如果 `conversationId` 为空，创建新对话
- 保存用户消息和 AI 回复到数据库
- 返回 `conversationId` 给前端

#### 3.1.4 添加对话管理 API
**文件**：`Backend/src/routes/conversation.js`

**接口列表**：
1. `POST /api/conversation/create` - 创建新对话
2. `GET /api/conversation/list` - 获取对话列表
3. `GET /api/conversation/:id/messages` - 获取对话消息
4. `DELETE /api/conversation/:id` - 删除对话
5. `PUT /api/conversation/:id/rename` - 重命名对话

**请求参数**：
- 所有接口都需要 `userId` 参数（从请求体或查询参数获取）

#### 3.1.5 修改聊天 API
**文件**：`Backend/src/routes/travel.js`

**修改内容**：
- `/chat` 接口新增参数：`userId`、`conversationId`（可选）
- 调用 `conversationService` 保存消息
- 返回 `conversationId` 给前端（通过 SSE 的特殊消息类型）

### 3.2 前端实现（Frontend）

#### 3.2.1 创建对话列表页面
**文件**：`vue-ai-frontend-travel/src/views/ConversationListView.vue`

**功能**：
- 显示用户所有对话列表
- 点击对话跳转到聊天页面并加载历史消息
- 新建对话按钮
- 删除对话功能
- 重命名对话功能

**UI 设计**：
- 左侧对话列表（类似 ChatGPT）
- 右侧聊天区域（复用 ChartView）
- 或者独立页面，点击对话跳转到 ChartView

#### 3.2.2 修改聊天页面
**文件**：`vue-ai-frontend-travel/src/views/ChartView.vue`

**修改内容**：
1. 支持从路由参数加载历史对话：`/chart?conversationId=xxx`
2. 修改 `fetchAIMessage()` 方法：
   - 发送请求时携带 `userId` 和 `conversationId`
   - 接收 SSE 消息时处理 `conversationId`（首次创建对话时）
3. 添加"新建对话"按钮
4. 添加"返回对话列表"按钮

#### 3.2.3 创建对话管理 API 封装
**文件**：`vue-ai-frontend-travel/src/utils/conversation.ts`

**功能**：
- 封装所有对话管理 API 调用
- 使用 `request` 实例（自有后端）
- 定义 TypeScript 接口类型

**接口定义**：
```typescript
interface Conversation {
  id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
}

interface Message {
  id: string
  conversationId: string
  role: 'user' | 'ai'
  content: string
  createdAt: string
}
```

#### 3.2.4 更新路由配置
**文件**：`vue-ai-frontend-travel/src/router/index.ts`

**修改内容**：
- 添加对话列表页面路由：`/conversations`
- 修改聊天页面路由，支持 `conversationId` 参数

## 四、技术决策

### 4.1 数据库选择
**决策**：使用 SQLite + Prisma
**原因**：
- 项目已使用 SQLite（dev.db 已存在）
- Prisma 提供类型安全的数据库操作
- 轻量级，适合中小型项目

### 4.2 用户身份识别
**决策**：使用前端传递的 `userId`
**原因**：
- 后端未实现 JWT 认证中间件
- 前端已有用户信息（localStorage）
- 快速实现，后续可升级为 JWT

### 4.3 对话标题生成
**决策**：取第一条用户消息的前 20 个字符
**原因**：
- 简单有效
- 用户可以后续重命名
- 避免额外的 AI 调用

### 4.4 SSE 消息格式扩展
**决策**：在现有 SSE 消息格式基础上新增 `conversationId` 类型
**原因**：
- 兼容现有流式响应逻辑
- 前端可以实时获取新创建的对话 ID

**消息格式**：
```json
// 现有格式
{ "type": "chunk", "data": "..." }
{ "type": "end" }

// 新增格式
{ "type": "conversationId", "data": "uuid-xxx" }
```

## 五、实现步骤

### 阶段一：后端数据库层（优先级 P0）
1. 创建 `schema.prisma` 文件
2. 运行 `prisma generate` 生成客户端
3. 创建 `conversationService.js` 服务
4. 编写单元测试验证数据库操作

### 阶段二：后端 API 层（优先级 P0）
1. 创建 `conversation.js` 路由
2. 修改 `travel.js` 路由的 `/chat` 接口
3. 修改 `traelService.js` 的 `chat()` 方法
4. 在 `index.js` 中注册新路由
5. 测试所有 API 接口

### 阶段三：前端 API 封装（优先级 P1）
1. 创建 `conversation.ts` 工具文件
2. 定义 TypeScript 接口类型
3. 封装所有 API 调用方法
4. 测试 API 调用

### 阶段四：前端页面开发（优先级 P1）
1. 创建 `ConversationListView.vue` 页面
2. 修改 `ChartView.vue` 支持历史对话加载
3. 更新路由配置
4. 测试完整流程

### 阶段五：优化与测试（优先级 P2）
1. 添加错误处理和边界情况
2. 优化 UI 交互体验
3. 添加加载状态和空状态
4. 编写集成测试

## 六、验证方案

### 6.1 功能验证
- [ ] 创建新对话成功，返回 conversationId
- [ ] 发送消息后，消息保存到数据库
- [ ] 刷新页面后，对话列表正确显示
- [ ] 点击历史对话，消息正确加载
- [ ] 删除对话后，对话和消息都被删除
- [ ] 重命名对话后，标题正确更新

### 6.2 数据验证
- [ ] 数据库表结构正确
- [ ] 外键关联正确
- [ ] 索引创建成功
- [ ] 数据查询性能良好

### 6.3 接口验证
- [ ] 所有 API 返回格式统一
- [ ] 错误处理友好
- [ ] 参数验证完整
- [ ] SSE 流式响应正常

### 6.4 前端验证
- [ ] 对话列表正确渲染
- [ ] 历史消息正确显示
- [ ] 新建对话功能正常
- [ ] 删除对话功能正常
- [ ] 重命名对话功能正常
- [ ] 路由跳转正常

## 七、风险与应对

### 7.1 数据库迁移风险
**风险**：已有 dev.db 数据库，可能存在冲突
**应对**：使用 `prisma migrate dev` 而非 `prisma migrate reset`，保留现有数据

### 7.2 用户身份验证风险
**风险**：前端传递的 `userId` 可能被伪造
**应对**：
- 短期：信任前端传递的 `userId`（演示项目）
- 长期：实现 JWT 认证中间件

### 7.3 SSE 消息格式兼容性风险
**风险**：修改 SSE 消息格式可能影响现有功能
**应对**：
- 保持向后兼容，现有消息格式不变
- 新增消息类型，前端选择性处理

### 7.4 性能风险
**风险**：对话消息过多时，加载速度慢
**应对**：
- 实现消息分页加载
- 限制单次加载消息数量（如最新 50 条）

## 八、后续优化方向

1. **消息分页加载**：支持加载更早的历史消息
2. **对话搜索**：支持按关键词搜索对话内容
3. **对话导出**：支持导出对话为 Markdown 或 PDF
4. **消息编辑**：支持编辑已发送的消息
5. **消息删除**：支持删除单条消息
6. **JWT 认证**：实现后端 JWT 认证中间件，提升安全性
7. **WebSocket 升级**：将 SSE 升级为 WebSocket，支持双向通信

## 九、时间估算

- 阶段一（后端数据库层）：2-3 小时
- 阶段二（后端 API 层）：2-3 小时
- 阶段三（前端 API 封装）：1 小时
- 阶段四（前端页面开发）：3-4 小时
- 阶段五（优化与测试）：2 小时

**总计**：10-13 小时

## 十、依赖关系

```
阶段一（数据库） → 阶段二（后端 API） → 阶段三（前端 API） → 阶段四（前端页面） → 阶段五（优化）
```

各阶段需按顺序执行，不可并行。

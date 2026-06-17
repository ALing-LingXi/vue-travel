# 希希出行 - AI 智能旅游规划平台

> 基于 Vue 3 + TypeScript + Express 5 + LangChain 的全栈 AI 旅游规划平台

[![Vue](https://img.shields.io/badge/Vue-3.5-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.2-green.svg)](https://expressjs.com/)
[![LangChain](https://img.shields.io/badge/LangChain-1.4-orange.svg)](https://js.langchain.com/)

---

## 项目简介

希希出行是一个智能旅游规划平台，用户只需输入目的地城市、预算和旅行天数，AI 就能自动生成结构化的行程计划，包括每日上午/下午/晚上的景点安排、预算明细、温馨提示和注意事项。同时支持与 AI 实时流式对话，获取更多旅游建议。

---

## 功能特性

### 核心功能

- **智能行程规划** - AI 自动生成结构化行程（每日安排 + 预算明细 + 温馨提示）
- **AI 流式对话** - 实时流式聊天，AI 逐字回复，体验接近 ChatGPT
- **对话历史管理** - 对话列表、重命名、删除、历史消息加载
- **天气查询** - 三级行政区划搜索（省/市/区县），实时天气展示
- **用户认证** - 登录/注册、Token 持久化、路由守卫、401 自动登出

### 技术亮点

- **SSE 流式通信** - 全链路流式响应（LLM → Express SSE → 前端 ReadableStream）
- **双 Axios 实例** - 自有后端与第三方 API 认证逻辑隔离
- **结构化 Prompt** - JSON Schema 约束 + 三层正则兜底解析
- **请求取消机制** - CancelToken + debounce 防止内存泄漏
- **Rate Limit 限流** - 防止 API 恶意调用
- **Winston 日志** - 按天轮转，请求耗时记录

---

## 技术栈

### 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5 | 渐进式 JavaScript 框架 |
| TypeScript | 6.0 | 类型安全 |
| Vant | 4.9 | 移动端 UI 组件库 |
| Vue Router | 4.6 | 路由管理 |
| Axios | 1.16 | HTTP 请求库 |
| Vite | 8.0 | 构建工具 |
| ESLint + Prettier | - | 代码规范 |

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| Express | 5.2 | Node.js Web 框架 |
| LangChain | 1.4 | LLM 应用开发框架 |
| Prisma | 5.22 | ORM 数据库工具 |
| SQLite | - | 轻量级数据库 |
| Winston | 3.19 | 日志系统 |
| express-rate-limit | 8.5 | API 限流 |

### 外部服务

- **传智播客 API** - 用户认证、天气查询、地区搜索
- **SiliconFlow / DeepSeek** - LLM 大模型服务

---

## 项目结构

```
ai旅游项目/
├── vue-ai-frontend-travel/     # 前端项目
│   ├── src/
│   │   ├── components/         # 公共组件
│   │   ├── componets/          # 业务组件
│   │   ├── views/              # 页面视图
│   │   ├── router/             # 路由配置
│   │   ├── utils/              # 工具函数
│   │   └── style/              # 全局样式
│   ├── package.json
│   └── vite.config.ts
│
├── Backend/                    # 后端项目
│   ├── src/
│   │   ├── routes/             # 路由层
│   │   ├── services/           # 服务层
│   │   ├── middleware/         # 中间件
│   │   └── utils/              # 工具函数
│   ├── prisma/
│   │   ├── schema.prisma       # 数据库模型
│   │   └── dev.db              # SQLite 数据库
│   └── package.json
│
└── README.md
```

---

## 快速开始

### 环境要求

- Node.js >= 20.19.0
- pnpm >= 10.33.2

### 前端启动

```bash
# 进入前端目录
cd vue-ai-frontend-travel

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

前端默认运行在 `http://localhost:5173`

### 后端启动

```bash
# 进入后端目录
cd Backend

# 安装依赖
pnpm install

# 初始化数据库
npx prisma migrate dev

# 创建 .env 文件（参考下方配置）
# ...

# 启动服务器
node src/index.js
```

后端默认运行在 `http://localhost:4000`

### 环境变量配置

在 `Backend/.env` 文件中配置：

```env
# 服务端口
PORT=4000

# LLM 服务商配置
MODEL_PROVIDER=SiliconFlow

# SiliconFlow 配置
SiliconFlow_API_KEY=your_api_key
SiliconFlow_BASE_URL=https://api.siliconflow.cn/v1
SiliconFlow_MODEL=deepseek-ai/DeepSeek-V3

# DeepSeek 配置（备用）
DeepSeek_API_KEY=your_api_key
DeepSeek_BASE_URL=https://api.deepseek.com/v1
DeepSeek_MODEL=deepseek-chat

# 日志级别
LOG_LEVEL=info
```

---

## API 接口

### 旅游规划

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/travel/recommend` | POST | AI 行程推荐 |
| `/api/travel/chat` | POST | AI 流式对话（SSE） |

### 对话管理

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/conversation/create` | POST | 创建新对话 |
| `/api/conversation/list` | GET | 获取对话列表 |
| `/api/conversation/:id/messages` | GET | 获取对话消息 |
| `/api/conversation/:id` | DELETE | 删除对话 |
| `/api/conversation/:id/rename` | PUT | 重命名对话 |

### 其他

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/heartbeat` | GET | 心跳检测 |

---

## 页面截图

### 首页
用户输入城市、预算、天数，一键生成行程规划

### 行程详情页
展示每日上午/下午/晚上安排、预算明细、天气信息、温馨提示

### AI 对话页
实时流式对话，支持对话历史管理

### 天气查询页
三级行政区划搜索，实时天气展示

---

## 项目亮点详解

### 1. SSE 流式通信全链路

**问题**：LLM 生成响应需要数十秒，传统"请求-等待"模式用户体验差。

**方案**：
- 后端封装 `createStreamResponse` 工具函数，统一 SSE 协议头
- 路由层 try/catch/finally 三段式确保连接安全关闭
- 前端 `fetchStream` 基于 ReadableStream 消费 SSE 事件流

**效果**：用户输入后即时看到 AI 逐字回复，交互体验接近 ChatGPT。

### 2. 结构化 Prompt 工程

**问题**：LLM 输出是非结构化文本，直接 JSON.parse 极易失败。

**方案**：
- Prompt 层嵌入完整 JSON Schema 约束输出格式
- 解析层三层正则兜底：` ```json ``` ` → ` ``` ``` ` → 裸 `{...}`

**效果**：LLM 返回任意格式均能可靠解析，前端正确渲染行程数据。

### 3. 双 Axios 实例架构

**问题**：项目对接自有后端和第三方 API，认证逻辑易耦合。

**方案**：
- 创建两个独立 Axios 实例，各自配置 baseURL 和拦截器
- 第三方 API 自动注入 Bearer Token，统一 401 处理

**效果**：API 层职责清晰，新增接口零重复代码。

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 作者

**林希**

- GitHub: [@ALing-LingXi](https://github.com/ALing-LingXi)

---

## 致谢

- [Vue.js](https://vuejs.org/)
- [Vant UI](https://vant-ui.github.io/vant/)
- [LangChain.js](https://js.langchain.com/)
- [Prisma](https://www.prisma.io/)
- [SiliconFlow](https://siliconflow.cn/)
# 面试亮点功能增强 - 实现计划

## [ ] Task 1: 数据库 Schema 设计与迁移
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 设计 Favorite 表结构（id, userId, itineraryData, createdAt, updatedAt）
  - 设计 UserPreference 表结构（id, userId, preferences, createdAt, updatedAt）
  - 设计 ItineraryHistory 表结构（id, userId, queryData, createdAt）
  - 使用 Prisma 创建迁移文件
- **Acceptance Criteria Addressed**: 数据库持久化升级
- **Test Requirements**:
  - `programmatic` TR-1.1: 数据库表创建成功
  - `programmatic` TR-1.2: 迁移文件生成正确
- **Notes**: 参考已有的 Conversation 和 Message 表设计

## [ ] Task 2: 收藏服务数据库迁移
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 重构 `favoriteService.js`，使用 Prisma 操作数据库
  - 实现 addFavorite 数据库操作
  - 实现 removeFavorite 数据库操作
  - 实现 getFavorites 数据库操作
  - 实现 isFavorite 数据库操作
  - 实现 clearFavorites 数据库操作
- **Acceptance Criteria Addressed**: 收藏数据持久化
- **Test Requirements**:
  - `programmatic` TR-2.1: 收藏数据保存到数据库
  - `programmatic` TR-2.2: 服务重启后收藏数据仍可查询
  - `programmatic` TR-2.3: 所有收藏接口功能正常
- **Notes**: 保持 API 接口不变，只修改内部实现

## [ ] Task 3: 用户偏好服务数据库迁移
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 重构 `userPreferenceService.js`，使用 Prisma 操作数据库
  - 实现 recordQuery 数据库操作
  - 实现 updatePreferences 数据库操作
  - 实现 getPreferences 数据库操作
  - 实现 getHistory 数据库操作
  - 实现 clearHistory 数据库操作
- **Acceptance Criteria Addressed**: 用户偏好持久化
- **Test Requirements**:
  - `programmatic` TR-3.1: 查询记录保存到数据库
  - `programmatic` TR-3.2: 用户偏好正确更新
  - `programmatic` TR-3.3: 服务重启后偏好数据仍可查询
- **Notes**: 保持 API 接口不变，只修改内部实现

## [ ] Task 4: 行程历史记录功能
- **Priority**: P1
- **Depends On**: Task 1
- **Description**:
  - 创建 ItineraryHistory 服务
  - 实现保存行程历史接口
  - 实现查询行程历史接口
  - 实现删除行程历史接口
  - 在行程推荐成功后自动保存历史
- **Acceptance Criteria Addressed**: 数据库持久化升级
- **Test Requirements**:
  - `programmatic` TR-4.1: 行程历史保存成功
  - `programmatic` TR-4.2: 行程历史查询正常
  - `programmatic` TR-4.3: 行程历史删除正常
- **Notes**: 可作为用户偏好学习的补充数据源

## [ ] Task 5: 高德地图 API 集成
- **Priority**: P1
- **Depends On**: None
- **Description**:
  - 注册高德地图开发者账号
  - 创建地图服务 `mapService.js`
  - 实现地理编码接口（地址转坐标）
  - 实现逆地理编码接口（坐标转地址）
  - 实现路线规划接口
  - 实现 POI 搜索接口
- **Acceptance Criteria Addressed**: 地图集成
- **Test Requirements**:
  - `programmatic` TR-5.1: 地理编码接口调用成功
  - `programmatic` TR-5.2: 路线规划接口调用成功
  - `programmatic` TR-5.3: POI 搜索接口调用成功
- **Notes**: 需要申请高德地图 API Key

## [ ] Task 6: 地图组件开发（前端）
- **Priority**: P1
- **Depends On**: Task 5
- **Description**:
  - 创建 MapComponent.vue 组件
  - 集成高德地图 JS SDK
  - 实现景点标记功能
  - 实现路线绘制功能
  - 实现地图交互（缩放、拖拽、点击）
- **Acceptance Criteria Addressed**: 景点定位、路线规划
- **Test Requirements**:
  - `human-judgment` TR-6.1: 地图正确显示景点位置
  - `human-judgment` TR-6.2: 路线正确绘制
  - `human-judgment` TR-6.3: 地图交互流畅
- **Notes**: 使用高德地图 Vue 组件库或原生 JS SDK

## [ ] Task 7: 地图集成到行程详情页
- **Priority**: P1
- **Depends On**: Task 6
- **Description**:
  - 在详情页添加地图展示区域
  - 解析行程中的景点名称
  - 调用地理编码接口获取景点坐标
  - 在地图上标记所有景点
  - 添加"查看路线"按钮
- **Acceptance Criteria Addressed**: 景点定位、路线规划
- **Test Requirements**:
  - `human-judgment` TR-7.1: 详情页地图正确显示
  - `human-judgment` TR-7.2: 景点标记位置准确
  - `human-judgment` TR-7.3: 路线规划功能正常
- **Notes**: 需要处理景点名称解析失败的情况

## [ ] Task 8: AI 图片生成服务
- **Priority**: P2
- **Depends On**: None
- **Description**:
  - 创建图片生成服务 `imageService.js`
  - 集成 Stable Diffusion API（如 SiliconFlow、Replicate）
  - 实现生成旅游海报接口
  - 实现生成行程卡片接口
  - 设计 Prompt 模板
- **Acceptance Criteria Addressed**: AI 图片生成
- **Test Requirements**:
  - `programmatic` TR-8.1: 图片生成接口调用成功
  - `programmatic` TR-8.2: 生成的图片符合预期
  - `programmatic` TR-8.3: Prompt 模板正确生成
- **Notes**: 可使用免费的 Stable Diffusion API

## [ ] Task 9: 图片生成功能集成（前端）
- **Priority**: P2
- **Depends On**: Task 8
- **Description**:
  - 在详情页添加"生成海报"按钮
  - 实现海报生成和预览功能
  - 实现海报下载功能
  - 实现行程卡片自动生成
  - 添加加载状态和错误处理
- **Acceptance Criteria Addressed**: 生成旅游海报、生成行程卡片
- **Test Requirements**:
  - `human-judgment` TR-9.1: 海报生成按钮正常工作
  - `human-judgment` TR-9.2: 海报预览正确显示
  - `human-judgment` TR-9.3: 海报下载功能正常
- **Notes**: 可考虑添加海报模板选择功能

## [ ] Task 10: 后端单元测试框架搭建
- **Priority**: P1
- **Depends On**: None
- **Description**:
  - 安装 Vitest 测试框架
  - 配置测试环境
  - 创建测试工具函数
  - 配置测试覆盖率报告
  - 添加测试脚本到 package.json
- **Acceptance Criteria Addressed**: 单元测试体系
- **Test Requirements**:
  - `programmatic` TR-10.1: 测试框架配置成功
  - `programmatic` TR-10.2: 测试脚本运行正常
  - `programmatic` TR-10.3: 覆盖率报告生成正常
- **Notes**: 使用 Vitest 替代 Jest，更快的测试速度

## [ ] Task 11: 后端核心服务测试
- **Priority**: P1
- **Depends On**: Task 10
- **Description**:
  - 编写 favoriteService 测试用例
  - 编写 userPreferenceService 测试用例
  - 编写 traelService 测试用例
  - 编写 mapService 测试用例（Mock API）
  - 编写 imageService 测试用例（Mock API）
- **Acceptance Criteria Addressed**: 后端 API 测试
- **Test Requirements**:
  - `programmatic` TR-11.1: 所有测试用例通过
  - `programmatic` TR-11.2: 核心服务覆盖率 > 80%
  - `programmatic` TR-11.3: 边界情况测试覆盖
- **Notes**: 使用 Mock 隔离外部依赖

## [ ] Task 12: 后端 API 集成测试
- **Priority**: P1
- **Depends On**: Task 10
- **Description**:
  - 编写收藏 API 集成测试
  - 编写偏好 API 集成测试
  - 编写行程推荐 API 集成测试
  - 编写地图 API 集成测试
  - 编写图片生成 API 集成测试
- **Acceptance Criteria Addressed**: 后端 API 测试
- **Test Requirements**:
  - `programmatic` TR-12.1: 所有 API 测试通过
  - `programmatic` TR-12.2: API 覆盖率 > 70%
  - `programmatic` TR-12.3: 错误处理测试覆盖
- **Notes**: 使用 supertest 进行 HTTP 测试

## [ ] Task 13: 前端单元测试框架搭建
- **Priority**: P2
- **Depends On**: None
- **Description**:
  - 安装 Vitest + Vue Test Utils
  - 配置测试环境
  - 创建测试工具函数
  - 配置测试覆盖率报告
  - 添加测试脚本到 package.json
- **Acceptance Criteria Addressed**: 单元测试体系
- **Test Requirements**:
  - `programmatic` TR-13.1: 测试框架配置成功
  - `programmatic` TR-13.2: 测试脚本运行正常
  - `programmatic` TR-13.3: 覆盖率报告生成正常
- **Notes**: 使用 @vue/test-utils 进行组件测试

## [ ] Task 14: 前端核心组件测试
- **Priority**: P2
- **Depends On**: Task 13
- **Description**:
  - 编写 SpotItem 组件测试
  - 编写 BudgetTable 组件测试
  - 编写 ChatBubble 组件测试
  - 编写 WeatherCard 组件测试
  - 编写 MapComponent 组件测试
- **Acceptance Criteria Addressed**: 前端组件测试
- **Test Requirements**:
  - `programmatic` TR-14.1: 所有组件测试通过
  - `programmatic` TR-14.2: 核心组件覆盖率 > 60%
  - `programmatic` TR-14.3: Props 和事件测试覆盖
- **Notes**: 使用 Mock 隔离外部依赖

## [ ] Task 15: Sentry 集成（后端）
- **Priority**: P2
- **Depends On**: None
- **Description**:
  - 注册 Sentry 账号
  - 安装 @sentry/node
  - 配置 Sentry 初始化
  - 集成到 Express 错误处理中间件
  - 配置性能监控
- **Acceptance Criteria Addressed**: 错误追踪、性能监控
- **Test Requirements**:
  - `programmatic` TR-15.1: Sentry 初始化成功
  - `programmatic` TR-15.2: 错误自动上报
  - `programmatic` TR-15.3: 性能数据收集正常
- **Notes**: 配置环境变量区分开发和生产环境

## [ ] Task 16: Sentry 集成（前端）
- **Priority**: P2
- **Depends On**: None
- **Description**:
  - 安装 @sentry/vue
  - 配置 Sentry 初始化
  - 集成到 Vue 错误处理
  - 配置性能监控
  - 配置用户反馈
- **Acceptance Criteria Addressed**: 错误追踪、性能监控
- **Test Requirements**:
  - `programmatic` TR-16.1: Sentry 初始化成功
  - `programmatic` TR-16.2: 错误自动上报
  - `programmatic` TR-16.3: 性能数据收集正常
- **Notes**: 配置 source map 上传

## Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 6] depends on [Task 5]
- [Task 7] depends on [Task 6]
- [Task 9] depends on [Task 8]
- [Task 11] depends on [Task 10]
- [Task 12] depends on [Task 10]
- [Task 14] depends on [Task 13]

## Implementation Strategy
1. **第一阶段（P0）**：数据库持久化升级（Task 1-3）
   - 这是基础功能，优先完成
   - 可以显著提升项目稳定性

2. **第二阶段（P1）**：地图集成和测试体系（Task 4-7, 10-12）
   - 地图功能可以并行开发
   - 测试体系可以并行搭建

3. **第三阶段（P2）**：AI 图片生成和监控（Task 8-9, 13-16）
   - 图片生成是锦上添花的功能
   - 监控系统可以最后集成

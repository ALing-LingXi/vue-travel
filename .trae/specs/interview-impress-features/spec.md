# 面试亮点功能增强 - 产品需求文档

## Why
当前项目已具备 AI 行程推荐、流式聊天、用户认证等核心功能，但存在数据持久化不完善（收藏和偏好仅内存存储）、缺少测试覆盖、缺少高级可视化等短板。通过添加数据库持久化、地图集成、AI 图片生成、单元测试等功能，可以显著提升项目的技术深度和面试竞争力。

## What Changes
- **数据库持久化升级**：将收藏、用户偏好、行程历史从内存存储迁移到 SQLite，展示数据库设计和 ORM 使用能力
- **地图集成**：接入高德地图 API，实现景点定位和路线规划，展示第三方 API 集成能力
- **AI 图片生成**：使用 Stable Diffusion API 生成旅游海报和行程卡片，展示多模态 AI 应用能力
- **单元测试体系**：使用 Vitest 建立完整的测试体系，展示测试驱动开发能力
- **性能监控**：集成 Sentry 进行错误追踪和性能监控，展示工程化能力

## Impact
- **Affected specs**: 数据持久化、地图服务、AI 服务、测试体系、监控体系
- **Affected code**:
  - Backend: `services/favoriteService.js`、`services/userPreferenceService.js`、新增 `services/mapService.js`、新增 `services/imageService.js`
  - Backend: 新增 Prisma schema（Favorite、UserPreference、ItineraryHistory）
  - Backend: 新增测试文件 `**/*.test.js`
  - Frontend: 新增地图组件、图片生成组件

## ADDED Requirements

### Requirement: 数据库持久化升级
系统 SHALL 将用户收藏、偏好设置、行程历史持久化到 SQLite 数据库，确保服务重启后数据不丢失。

#### Scenario: 收藏数据持久化
- **WHEN** 用户收藏一个行程
- **THEN** 收藏数据保存到数据库，服务重启后仍可查询

#### Scenario: 用户偏好持久化
- **WHEN** 用户进行多次行程查询
- **THEN** 用户偏好数据保存到数据库，用于优化后续推荐

### Requirement: 地图集成
系统 SHALL 集成高德地图 API，在行程详情页展示景点位置和路线规划。

#### Scenario: 景点定位
- **WHEN** 用户查看行程详情
- **THEN** 地图组件展示所有景点位置标记

#### Scenario: 路线规划
- **WHEN** 用户点击"查看路线"按钮
- **THEN** 地图展示从第一个景点到最后一个景点的推荐路线

### Requirement: AI 图片生成
系统 SHALL 使用 AI 生成旅游海报和行程卡片，提升用户体验。

#### Scenario: 生成旅游海报
- **WHEN** 用户点击"生成海报"按钮
- **THEN** 系统调用 Stable Diffusion API 生成包含目的地特色的旅游海报

#### Scenario: 生成行程卡片
- **WHEN** 行程规划完成
- **THEN** 系统自动生成包含行程概览的精美卡片图片

### Requirement: 单元测试体系
系统 SHALL 建立完整的单元测试体系，覆盖核心业务逻辑。

#### Scenario: 后端 API 测试
- **WHEN** 运行测试命令
- **THEN** 所有 API 接口测试通过，覆盖率 > 70%

#### Scenario: 前端组件测试
- **WHEN** 运行测试命令
- **THEN** 核心组件测试通过，覆盖率 > 60%

### Requirement: 性能监控
系统 SHALL 集成 Sentry 进行错误追踪和性能监控。

#### Scenario: 错误追踪
- **WHEN** 系统发生运行时错误
- **THEN** 错误信息自动上报到 Sentry，包含完整的错误堆栈和用户上下文

#### Scenario: 性能监控
- **WHEN** API 响应时间超过阈值
- **THEN** 性能告警自动发送到 Sentry

## MODIFIED Requirements

### Requirement: 收藏管理服务
系统 SHALL 使用 Prisma 操作数据库进行收藏管理，替代原有的内存存储方式。

**原有实现**：使用 JavaScript 对象存储收藏数据
**修改后**：使用 Prisma ORM 操作 SQLite 数据库

### Requirement: 用户偏好服务
系统 SHALL 使用 Prisma 操作数据库进行偏好管理，替代原有的内存存储方式。

**原有实现**：使用 JavaScript 对象存储用户偏好
**修改后**：使用 Prisma ORM 操作 SQLite 数据库

## REMOVED Requirements
无移除的需求。

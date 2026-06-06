# AI旅游助手后端功能增强 - 产品需求文档

## Overview
- **Summary**: 基于当前 Express + LangChain 架构的 AI 旅游推荐后端，进行功能扩展和性能优化，提升项目亮点和用户体验。
- **Purpose**: 通过添加实用功能和优化架构，使项目更具竞争力和实用性。
- **Target Users**: 旅游爱好者、开发者、项目展示

## Goals
- 添加热门旅游城市推荐功能
- 实现行程收藏与管理功能
- 增加用户偏好学习机制
- 优化 API 响应性能
- 添加完整的错误处理和日志系统

## Non-Goals (Out of Scope)
- 完整的支付系统
- 第三方 OAuth 登录
- 移动端原生应用开发
- 大规模分布式部署

## Background & Context
当前后端实现了：
- 基于 AI 的旅游行程推荐（城市、预算、天数）
- 流式聊天接口
- 支持 SiliconFlow 和 DeepSeek 双模型切换

## Functional Requirements
- **FR-1**: 热门城市推荐 - 根据季节、热度推荐热门旅游城市
- **FR-2**: 行程收藏系统 - 用户可收藏、管理推荐行程
- **FR-3**: 用户偏好学习 - 基于历史记录优化推荐结果
- **FR-4**: 天气集成 - 获取目的地天气信息辅助推荐
- **FR-5**: 景点搜索 - 支持景点名称搜索和详情查询

## Non-Functional Requirements
- **NFR-1**: API 响应时间 < 200ms（非AI生成请求）
- **NFR-2**: 日志记录完整，支持问题追溯
- **NFR-3**: 错误处理友好，返回统一格式错误信息
- **NFR-4**: 支持请求限流，防止 API 滥用

## Constraints
- **Technical**: Node.js 18+, Express 5.x, LangChain
- **Business**: 使用免费/开源 AI 模型
- **Dependencies**: 依赖外部天气 API、景点数据

## Assumptions
- 用户已登录且有唯一标识（creator字段）
- 支持 localStorage 存储用户偏好
- 后端可访问外部天气 API

## Acceptance Criteria

### AC-1: 热门城市推荐
- **Given**: 用户访问热门城市接口
- **When**: 传入季节参数（可选）
- **Then**: 返回按热度排序的城市列表及推荐理由
- **Verification**: `programmatic`

### AC-2: 行程收藏
- **Given**: 用户已登录
- **When**: 调用收藏/取消收藏接口
- **Then**: 收藏状态正确切换，数据持久化
- **Verification**: `programmatic`

### AC-3: 用户偏好学习
- **Given**: 用户有历史查询记录
- **When**: 发起新的推荐请求
- **Then**: 推荐结果体现用户偏好（如预算、偏好类型）
- **Verification**: `human-judgment`

### AC-4: 统一错误处理
- **Given**: 请求参数错误或服务异常
- **When**: 发起 API 请求
- **Then**: 返回统一格式错误响应，包含错误码和提示信息
- **Verification**: `programmatic`

### AC-5: 请求限流
- **Given**: 短时间内大量请求
- **When**: 超过限流阈值
- **Then**: 返回 429 状态码，提示稍后重试
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要接入真实景点数据库？
- [ ] 是否需要支持多语言？
- [ ] 是否需要添加评论/评分系统？
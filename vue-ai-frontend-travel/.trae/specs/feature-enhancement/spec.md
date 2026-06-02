# 智能旅游助手 - 功能扩展 PRD

## Overview
- **Summary**: 为现有的智能旅游助手应用添加多个增强功能，包括用户注册/登录、行程收藏、历史记录、数据持久化、天气查询和行程分享等功能，提升用户体验和项目含金量。
- **Purpose**: 通过添加实用功能，增强应用的实用性和用户粘性，使项目更具商业价值。
- **Target Users**: 旅游爱好者、出行规划者

## Goals
- [ ] 实现用户注册/登录功能
- [ ] 实现行程收藏功能，用户可收藏喜欢的行程规划
- [ ] 实现历史记录功能，保存用户的行程规划历史
- [ ] 实现数据持久化，使用 localStorage 存储用户数据
- [ ] 实现天气查询功能，显示目的地天气信息
- [ ] 实现行程分享功能，支持分享到社交平台
- [ ] 实现个人信息管理功能

## Non-Goals (Out of Scope)
- [ ] 支付功能
- [ ] 第三方地图集成
- [ ] 多语言支持

## Background & Context
当前项目是一个基于 Vue3 + Vant 的智能旅游规划应用，已具备：
- 首页行程规划表单
- 行程详情展示
- AI 聊天助手
- 个人中心

新增后端接口支持：
- Base URL: `https://hmajax.itheima.net`
- 认证模块（注册/登录）
- 天气预报模块（城市搜索/天气详情）
- 个人信息模块（头像/信息管理）

## Functional Requirements
- **FR-1**: 用户可以注册账号
- **FR-2**: 用户可以登录/退出账号
- **FR-3**: 用户可以收藏/取消收藏行程规划
- **FR-4**: 用户可以查看历史行程记录
- **FR-5**: 用户数据自动持久化到本地存储
- **FR-6**: 用户可以查看目的地天气信息
- **FR-7**: 用户可以分享行程到社交平台
- **FR-8**: 用户可以修改个人信息和头像

## Non-Functional Requirements
- **NFR-1**: 数据持久化应使用 localStorage，不依赖后端
- **NFR-2**: 天气查询使用后端接口 `/api/weather/city` 和 `/api/weather`
- **NFR-3**: 分享功能使用 Web Share API 或复制链接
- **NFR-4**: 用户认证使用 JWT Token

## Constraints
- **Technical**: Vue3 + Vant + TypeScript
- **Business**: 后端接口已提供，需要前端对接
- **Dependencies**: 后端 API (`https://hmajax.itheima.net`)

## Assumptions
- [ ] 用户使用现代浏览器（支持 Web Share API）
- [ ] 用户同意本地存储数据
- [ ] 后端接口正常运行

## Acceptance Criteria

### AC-1: 用户注册功能
- **Given**: 用户在注册页面
- **When**: 用户填写正确的用户名和密码并提交
- **Then**: 用户注册成功，返回用户信息
- **Verification**: `programmatic`

### AC-2: 用户登录功能
- **Given**: 用户在登录页面
- **When**: 用户填写正确的用户名和密码并提交
- **Then**: 用户登录成功，Token 存储到本地
- **Verification**: `programmatic`

### AC-3: 行程收藏功能
- **Given**: 用户在行程详情页
- **When**: 用户点击收藏按钮
- **Then**: 行程被添加到收藏列表，按钮状态变为已收藏
- **Verification**: `programmatic`

### AC-4: 取消收藏功能
- **Given**: 用户在行程详情页，且该行程已被收藏
- **When**: 用户点击已收藏按钮
- **Then**: 行程从收藏列表移除，按钮状态变为未收藏
- **Verification**: `programmatic`

### AC-5: 收藏列表展示
- **Given**: 用户在个人中心页面
- **When**: 用户点击"我的收藏"
- **Then**: 显示用户收藏的所有行程列表
- **Verification**: `human-judgment`

### AC-6: 历史记录功能
- **Given**: 用户完成一次行程规划
- **When**: 行程数据返回成功
- **Then**: 行程自动保存到历史记录
- **Verification**: `programmatic`

### AC-7: 历史记录展示
- **Given**: 用户在个人中心页面
- **When**: 用户点击"历史记录"
- **Then**: 显示用户的行程规划历史列表
- **Verification**: `human-judgment`

### AC-8: 天气查询功能
- **Given**: 用户在行程详情页
- **When**: 页面加载完成
- **Then**: 显示目的地当前天气信息（温度、天气状况、PM2.5等）
- **Verification**: `human-judgment`

### AC-9: 行程分享功能
- **Given**: 用户在行程详情页
- **When**: 用户点击分享按钮
- **Then**: 弹出分享选项，支持复制链接或分享到社交平台
- **Verification**: `human-judgment`

### AC-10: 个人信息修改功能
- **Given**: 用户在个人信息页面
- **When**: 用户修改个人信息并提交
- **Then**: 个人信息更新成功
- **Verification**: `human-judgment`

## Open Questions
- [ ] 分享功能是否需要生成图片？

## API 接口文档

### 认证模块

#### 1. 注册账号
- **接口地址**: `/api/register`
- **请求方式**: POST
- **Content-Type**: application/json
- **请求参数**:
  | 参数名 | 类型 | 是否必需 | 规范/限制 | 示例 |
  |--------|------|----------|-----------|------|
  | username | string | 是 | 中英文和数字组成，最少 8 位 | "黑马no1hello" |
  | password | string | 是 | 最少 6 位 | "123456" |
- **返回响应** (200 OK):
```json
{
  "code": 10000,
  "message": "注册成功",
  "data": {
    "id": 37,
    "account": "黑马no1hello"
  }
}
```

#### 2. 用户登录
- **接口地址**: `/api/login`
- **请求方式**: POST
- **Content-Type**: application/json
- **请求参数**:
  | 参数名 | 类型 | 是否必需 | 规范/限制 | 示例 |
  |--------|------|----------|-----------|------|
  | username | string | 是 | 最少 8 位，中英文和数字组成 | "黑马no1hello" |
  | password | string | 是 | 最少 6 位 | "123456" |
- **返回响应** (200 OK):
```json
{
  "code": 10000,
  "message": "登录成功",
  "data": {
    "username": "黑马no1hello"
  }
}
```

### 天气预报模块

#### 1. 获取城市信息（关键字搜索）
- **接口地址**: `/api/weather/city`
- **请求方式**: GET
- **请求参数**:
  | 参数名 | 类型 | 是否必需 | 说明 | 示例 |
  |--------|------|----------|------|------|
  | city | string | 是 | 城市名字信息关键字 | "北" |
- **返回响应** (200 OK):
```json
{
  "code": 10000,
  "message": "查询成功",
  "data": [
    { "code": "110100", "name": "北京市 - 北京" },
    { "code": "810301", "name": "北区 - 香港特别行政区" }
  ]
}
```

#### 2. 获取天气预报详情
- **接口地址**: `/api/weather`
- **请求方式**: GET
- **请求参数**:
  | 参数名 | 类型 | 是否必需 | 说明 | 示例 |
  |--------|------|----------|------|------|
  | city | string | 是 | 城市行政编码 | "110100" |
- **返回响应** (200 OK):
```json
{
  "code": 10000,
  "message": "查询天气成功",
  "data": {
    "date": "2023-02-12",
    "area": "北京市",
    "temperature": "3",
    "weather": "霾",
    "windPower": "1级",
    "windDirection": "东风",
    "psPm25Level": "中度",
    "psPm25": "172",
    "todayWeather": {
      "humidity": "69.0",
      "sunriseTime": "07:12",
      "sunsetTime": "17:46",
      "ultraviolet": "最弱",
      "weather": "雨夹雪",
      "temDay": "3",
      "temNight": "-5"
    },
    "dayForecast": [...]
  }
}
```

### 个人信息模块

#### 1. 获取个人信息
- **接口地址**: `/api/settings`
- **请求方式**: GET
- **请求参数**:
  | 参数名 | 类型 | 是否必需 | 说明 | 示例 |
  |--------|------|----------|------|------|
  | creator | string | 是 | 个人独特的外号 | "老李" |

#### 2. 修改个人头像
- **接口地址**: `/api/avatar`
- **请求方式**: PUT
- **Content-Type**: multipart/form-data

#### 3. 修改个人信息
- **接口地址**: `/api/settings`
- **请求方式**: PUT
- **Content-Type**: application/json

### 业务状态码说明
| 状态码 | 说明 | HTTP 状态码 |
|--------|------|-------------|
| 10000 | 成功 | 200 |
| 10001 | 无账号/密码 | 400 |
| 10002 | 密码位数不够 | 400 |
| 10003 | 用户名位数不够 | 400 |
| 10004 | 用户名/密码未携带 | 400 |
| 10005 | 用户名被占用 | 400 |

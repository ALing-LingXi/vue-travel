# API 接口文档

---

## 一、自有后端 API（Express）

**Base URL**: `http://localhost:4000/api/travel`

### 1.1 旅游推荐接口

**POST** `/recommend`

生成结构化旅游行程计划。

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| city | string | 是 | 目的地城市名称 |
| budget | number | 是 | 总预算（元），最小 100 |
| days | number | 是 | 旅行天数，范围 1-30 |

**请求示例**：

```json
{
  "city": "北京",
  "budget": 3000,
  "days": 3
}
```

**响应示例**：

```json
{
  "success": true,
  "result": {
    "city": "北京",
    "days": 3,
    "totalBudget": 3000,
    "dailyItinerary": [
      {
        "day": 1,
        "date": "第1天",
        "morning": {
          "spot": "故宫博物院",
          "duration": "3小时",
          "ticket": "60元",
          "transportation": "地铁1号线天安门东站",
          "description": "世界上现存规模最大的宫殿型建筑..."
        },
        "afternoon": { ... },
        "evening": { ... }
      }
    ],
    "budgetBreakdown": {
      "accommodation": 1200,
      "food": 800,
      "transportation": 300,
      "tickets": 500,
      "other": 200
    },
    "tips": ["建议提前预约故宫门票", ...],
    "warnings": ["避开节假日高峰期", ...]
  }
}
```

**错误响应**：

```json
{
  "success": false,
  "message": "缺少city,budget,days参数"
}
```

---

### 1.2 流式聊天接口

**POST** `/chat`

AI 流式对话，返回 SSE 事件流。

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| message | string | 是 | 用户消息内容 |

**请求示例**：

```json
{
  "message": "北京有哪些必去的景点？"
}
```

**响应格式**：SSE（Server-Sent Events）

**响应头**：

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
X-Accel-Buffering: no
```

**事件流格式**：

```
data: {"type":"chunk","data":"北京"}
data: {"type":"chunk","data":"有"}
data: {"type":"chunk","data":"很多"}
...
data: {"type":"end"}
```

**事件类型**：

| type | 说明 |
|------|------|
| chunk | 文本片段，data 字段为内容 |
| end | 流传输结束 |
| error | 发生错误，data 字段为错误信息 |

---

### 1.3 心跳检测接口

**GET** `/heartbeat`

检测服务器运行状态。

**响应示例**：

```json
{
  "message": "服务器正常运行",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 二、第三方 API（传智播客）

**Base URL**: `https://hmajax.itheima.net`

### 2.1 用户注册

**POST** `/api/register`

注册新用户账号。

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名，中英文和数字组成，最少 8 位 |
| password | string | 是 | 密码，最少 6 位 |

**请求示例**：

```json
{
  "username": "testuser123",
  "password": "123456"
}
```

**响应示例**：

```json
{
  "code": 10000,
  "message": "注册成功",
  "data": {
    "username": "testuser123",
    "id": 12345
  }
}
```

---

### 2.2 用户登录

**POST** `/api/login`

用户登录，获取 Token。

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**请求示例**：

```json
{
  "username": "testuser123",
  "password": "123456"
}
```

**响应示例**：

```json
{
  "code": 10000,
  "message": "登录成功",
  "data": {
    "id": 12345,
    "account": "testuser123",
    "username": "testuser123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

---

### 2.3 搜索城市

**GET** `/api/weather/city`

根据关键字搜索城市，获取城市编码。

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| city | string | 是 | 城市关键字 |

**请求示例**：

```
GET /api/weather/city?city=北京
```

**响应示例**：

```json
{
  "code": 10000,
  "message": "获取成功",
  "data": [
    { "code": "110100", "name": "北京市" },
    { "code": "110101", "name": "东城区" },
    { "code": "110102", "name": "西城区" }
  ]
}
```

---

### 2.4 获取天气

**GET** `/api/weather`

根据城市编码获取天气详情。

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| city | string | 是 | 城市编码 |

**请求示例**：

```
GET /api/weather?city=110100
```

**响应示例**：

```json
{
  "code": 10000,
  "message": "获取成功",
  "data": {
    "date": "2024-01-15",
    "dateShort": "1月15日",
    "dateLunar": "腊月初五",
    "area": "北京市",
    "temperature": "5",
    "weather": "晴",
    "weatherImg": "qing",
    "windDirection": "北风",
    "windPower": "3级",
    "psPm25": "35",
    "psPm25Level": "良",
    "todayWeather": {
      "humidity": "45",
      "sunriseTime": "07:35",
      "sunsetTime": "17:20",
      "ultraviolet": "中等",
      "weather": "晴",
      "temDay": "8",
      "temNight": "-2"
    },
    "dayForecast": [
      {
        "date": "2024-01-15",
        "dateFormat": "今天",
        "weather": "晴",
        "temDay": "8",
        "temNight": "-2",
        "windDirection": "北风",
        "windPower": "3级"
      },
      ...
    ]
  }
}
```

---

### 2.5 获取省份列表

**GET** `/api/province`

获取所有省份名称列表。

**响应示例**：

```json
{
  "code": 10000,
  "message": "获取成功",
  "data": {
    "list": ["北京市", "天津市", "河北省", "山西省", ...]
  }
}
```

---

### 2.6 获取城市列表

**GET** `/api/city`

根据省份名称获取城市列表。

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pname | string | 是 | 省份名称 |

**请求示例**：

```
GET /api/city?pname=广东省
```

**响应示例**：

```json
{
  "code": 10000,
  "message": "获取成功",
  "data": {
    "list": ["广州市", "深圳市", "珠海市", "佛山市", ...]
  }
}
```

---

### 2.7 获取区县列表

**GET** `/api/area`

根据省份和城市名称获取区县列表。

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pname | string | 是 | 省份名称 |
| cname | string | 是 | 城市名称 |

**请求示例**：

```
GET /api/area?pname=广东省&cname=广州市
```

**响应示例**：

```json
{
  "code": 10000,
  "message": "获取成功",
  "data": {
    "list": ["天河区", "越秀区", "海珠区", "荔湾区", ...]
  }
}
```

---

### 2.8 获取个人信息

**GET** `/api/settings`

获取用户个人信息。

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| creator | string | 是 | 用户名 |

**请求头**：

```
Authorization: Bearer <token>
```

**请求示例**：

```
GET /api/settings?creator=testuser123
```

**响应示例**：

```json
{
  "code": 10000,
  "message": "获取成功",
  "data": {
    "avatar": "https://example.com/avatar.jpg",
    "nickname": "测试用户",
    "email": "test@example.com",
    "gender": 0,
    "desc": "这是我的个人简介"
  }
}
```

---

### 2.9 修改个人信息

**PUT** `/api/settings`

修改用户个人信息。

**请求头**：

```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| creator | string | 是 | 用户名 |
| nickname | string | 是 | 昵称 |
| email | string | 是 | 邮箱 |
| gender | number | 是 | 性别，0-男，1-女 |
| desc | string | 是 | 个人简介 |

**请求示例**：

```json
{
  "creator": "testuser123",
  "nickname": "新昵称",
  "email": "newemail@example.com",
  "gender": 0,
  "desc": "新的个人简介"
}
```

**响应示例**：

```json
{
  "code": 10000,
  "message": "修改成功",
  "data": {
    "avatar": "https://example.com/avatar.jpg",
    "nickname": "新昵称",
    "email": "newemail@example.com",
    "gender": 0,
    "desc": "新的个人简介"
  }
}
```

---

### 2.10 修改头像

**PUT** `/api/avatar`

上传并修改用户头像。

**请求头**：

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| avatar | File | 是 | 头像图片文件 |
| creator | string | 是 | 用户名 |

**响应示例**：

```json
{
  "code": 10000,
  "message": "上传成功",
  "data": {
    "avatar": "https://example.com/new-avatar.jpg"
  }
}
```

---

## 三、错误码说明

### 3.1 传智 API 错误码

| 错误码 | 说明 |
|--------|------|
| 10000 | 成功 |
| 10001 | 参数错误 |
| 10002 | 用户名已存在 |
| 10003 | 用户名或密码错误 |
| 10004 | Token 无效或已过期 |
| 10005 | 权限不足 |

### 3.2 HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，Token 无效或过期 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 四、前端 API 模块映射

| 模块文件 | 对应 API | 说明 |
|----------|---------|------|
| `request.ts` | 自有后端 | LLM 推荐、聊天、心跳 |
| `itheima-api.ts` | 传智 API | 基础配置、Token 注入、错误处理 |
| `auth.ts` | 传智 API | 注册、登录、用户信息存储 |
| `weather.ts` | 传智 API | 城市搜索、天气查询 |
| `location.ts` | 传智 API | 省份、城市、区县三级联动 |
| `profile.ts` | 传智 API | 个人信息获取、修改、头像上传 |

---

## 五、环境变量配置

### 5.1 后端 `.env` 文件

```env
# 服务端口
PORT=4000

# LLM 服务商配置
MODEL_PROVIDER=SiliconFlow

# SiliconFlow 配置
SiliconFlow_API_KEY=sk-xxxxxxxx
SiliconFlow_BASE_URL=https://api.siliconflow.cn/v1
SiliconFlow_MODEL=Qwen/Qwen2.5-7B-Instruct

# DeepSeek 配置（备用）
DeepSeek_API_KEY=sk-xxxxxxxx
DeepSeek_BASE_URL=https://api.deepseek.com/v1
DeepSeek_MODEL=deepseek-chat
```

### 5.2 前端配置

前端 API Base URL 硬编码在以下文件：

| 文件 | Base URL |
|------|----------|
| `request.ts` | `http://localhost:4000/api/travel` |
| `itheima-api.ts` | `https://hmajax.itheima.net` |

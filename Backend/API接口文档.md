# AI旅游助手API文档

## 基础信息

### 后端服务

- **基础URL**: `http://localhost:4000/api`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **限流策略**: 已启用API限流保护

### 黑马接口服务

- **基础URL**: `https://hmajax.itheima.net`
- **数据格式**: JSON
- **认证方式**: Bearer Token（部分接口需要）

## 通用响应格式

### 后端服务响应格式

```json
{
  "success": true|false,
  "data": {},
  "message": "提示信息"
}
```

### 黑马接口响应格式

```json
{
  "code": 10000,
  "message": "操作成功",
  "data": {}
}
```

---

# 一、后端服务接口

## 1. 旅游推荐接口

### 1.1 获取旅游推荐

**POST** `/api/travel/recommend`

根据城市、预算和天数生成个性化旅游推荐。

**请求参数**：

```json
{
  "city": "北京",
  "budget": 3000,
  "days": 3
}
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| city | string | 是 | 目标城市名称 |
| budget | number | 是 | 预算金额（元），最低100元 |
| days | number | 是 | 旅行天数，范围1-30天 |

**成功响应**：

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
          "spot": "故宫",
          "duration": "3小时",
          "ticket": "60元",
          "transportation": "地铁1号线天安门东站",
          "description": "世界上现存规模最大的宫殿型建筑"
        },
        "afternoon": {
          "spot": "天坛",
          "duration": "2小时",
          "ticket": "15元",
          "transportation": "地铁5号线天坛东门站",
          "description": "明清两代皇帝祭天的场所"
        },
        "evening": {
          "spot": "王府井步行街",
          "duration": "2小时",
          "ticket": "免费",
          "transportation": "地铁1号线王府井站",
          "description": "北京最著名的商业街"
        }
      }
    ],
    "budgetBreakdown": {
      "accommodation": 1200,
      "food": 600,
      "transportation": 300,
      "tickets": 500,
      "other": 400
    },
    "tips": ["建议提前在官网预约故宫门票"],
    "warnings": ["北京早晚高峰交通拥堵，建议错峰出行"]
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

### 1.2 AI聊天助手（流式响应）

**POST** `/api/travel/chat`

与AI助手进行对话，支持流式响应。

**请求参数**：

```json
{
  "message": "我想去北京旅游，有什么推荐吗？"
}
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| message | string | 是 | 用户消息内容 |

**响应格式**：流式响应（SSE），每个数据块格式：

```
data: {"type":"chunk","data":"部分回复内容"}

data: {"type":"end"}
```

---

## 2. 系统接口

### 2.1 心跳检测

**GET** `/api/heartbeat`

检测服务器运行状态。

**成功响应**：

```json
{
  "message": "服务器正常运行",
  "timestamp": "2026-06-05T10:30:00.000Z"
}
```

---

# 二、黑马接口服务

## 1. 用户认证接口

### 1.1 用户注册

**POST** `/api/register`

注册新用户账号。

**请求参数**：

```json
{
  "username": "testuser123",
  "password": "123456"
}
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名，中英文和数字组成，最少8位 |
| password | string | 是 | 密码，最少6位 |

**成功响应**：

```json
{
  "code": 10000,
  "message": "注册成功",
  "data": {
    "username": "testuser123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.2 用户登录

**POST** `/api/login`

用户登录获取Token。

**请求参数**：

```json
{
  "username": "testuser123",
  "password": "123456"
}
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**成功响应**：

```json
{
  "code": 10000,
  "message": "登录成功",
  "data": {
    "username": "testuser123",
    "id": 1,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2. 用户信息接口

### 2.1 获取个人信息

**GET** `/api/settings`

获取用户个人设置信息。

**请求头**：

```
Authorization: Bearer <token>
```

**查询参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| creator | string | 是 | 用户标识 |

**成功响应**：

```json
{
  "code": 10000,
  "message": "获取成功",
  "data": {
    "avatar": "https://example.com/avatar.jpg",
    "nickname": "旅行者",
    "email": "user@example.com",
    "gender": 1,
    "desc": "热爱旅行"
  }
}
```

---

### 2.2 修改个人信息

**PUT** `/api/settings`

修改用户个人设置信息。

**请求头**：

```
Authorization: Bearer <token>
```

**请求参数**：

```json
{
  "creator": "testuser123",
  "nickname": "旅行达人",
  "email": "newemail@example.com",
  "gender": 1,
  "desc": "环游世界是我的梦想"
}
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| creator | string | 是 | 用户标识 |
| nickname | string | 否 | 昵称 |
| email | string | 否 | 邮箱 |
| gender | number | 否 | 性别，0-女，1-男 |
| desc | string | 否 | 个人简介 |

**成功响应**：

```json
{
  "code": 10000,
  "message": "修改成功",
  "data": {
    "nickname": "旅行达人",
    "email": "newemail@example.com",
    "gender": 1,
    "desc": "环游世界是我的梦想"
  }
}
```

---

### 2.3 修改头像

**PUT** `/api/avatar`

上传并修改用户头像。

**请求头**：

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求参数**（FormData）：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| avatar | File | 是 | 头像图片文件 |
| creator | string | 是 | 用户标识 |

**成功响应**：

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

## 3. 地区接口

### 3.1 获取省份列表

**GET** `/api/province`

获取中国所有省份列表。

**成功响应**：

```json
{
  "code": 10000,
  "message": "获取成功",
  "list": ["北京市", "天津市", "河北省", "山西省", "内蒙古自治区", "..."]
}
```

---

### 3.2 获取城市列表

**GET** `/api/city`

根据省份获取城市列表。

**查询参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pname | string | 是 | 省份名称 |

**成功响应**：

```json
{
  "code": 10000,
  "message": "获取成功",
  "list": ["北京市", "东城区", "西城区", "朝阳区", "海淀区", "..."]
}
```

---

### 3.3 获取区县列表

**GET** `/api/area`

根据省份和城市获取区县列表。

**查询参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pname | string | 是 | 省份名称 |
| cname | string | 是 | 城市名称 |

**成功响应**：

```json
{
  "code": 10000,
  "message": "获取成功",
  "list": ["东城区", "西城区", "朝阳区", "丰台区", "石景山区", "..."]
}
```

---

## 4. 天气接口

### 4.1 搜索城市

**GET** `/api/weather/city`

根据关键字搜索城市，获取城市编码。

**查询参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| city | string | 是 | 城市关键字 |

**成功响应**：

```json
[
  {
    "code": "101010100",
    "name": "北京 - 北京"
  },
  {
    "code": "101010300",
    "name": "北京 - 海淀"
  }
]
```

---

### 4.2 获取天气预报

**GET** `/api/weather`

根据城市编码获取详细天气预报。

**查询参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| city | string | 是 | 城市编码 |

**成功响应**：

```json
{
  "code": 10000,
  "message": "获取成功",
  "data": {
    "date": "2026-06-05",
    "area": "北京",
    "dateShort": "06月05日",
    "dateLunar": "五月初十",
    "temperature": "25",
    "weather": "晴",
    "weatherImg": "qing",
    "windPower": "3级",
    "windDirection": "东南风",
    "psPm25": "35",
    "psPm25Level": "优",
    "todayWeather": {
      "humidity": "45%",
      "sunriseTime": "04:48",
      "sunsetTime": "19:36",
      "ultraviolet": "中等",
      "weather": "晴",
      "temDay": "28",
      "temNight": "18"
    },
    "dayForecast": [
      {
        "date": "2026-06-05",
        "temDay": "28",
        "temNight": "18",
        "weather": "晴",
        "windPower": "3级",
        "windDirection": "东南风"
      }
    ]
  }
}
```

---

# 三、错误码说明

## 后端服务错误码

| HTTP状态码 | 说明                     |
| ---------- | ------------------------ |
| 200        | 请求成功                 |
| 400        | 请求参数错误             |
| 404        | 资源未找到               |
| 429        | 请求过于频繁（触发限流） |
| 500        | 服务器内部错误           |

## 黑马接口错误码

| code  | 说明              |
| ----- | ----------------- |
| 10000 | 操作成功          |
| 10001 | 用户名已存在      |
| 10002 | 用户名或密码错误  |
| 10003 | Token无效或已过期 |
| 10004 | 参数错误          |

---

# 四、使用示例

## JavaScript/Node.js 示例

### 后端服务调用

```javascript
// 获取旅游推荐
async function getRecommendation() {
  const response = await fetch("http://localhost:4000/api/travel/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      city: "北京",
      budget: 3000,
      days: 3,
    }),
  });
  const data = await response.json();
  console.log(data);
}

// 流式聊天
async function chat() {
  const response = await fetch("http://localhost:4000/api/travel/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "我想去北京旅游" }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((line) => line.trim());

    for (const line of lines) {
      if (line.startsWith("data:")) {
        const jsonStr = line.replace(/^data:\s*/, "");
        const data = JSON.parse(jsonStr);

        if (data.type === "chunk") {
          console.log(data.data);
        } else if (data.type === "end") {
          console.log("对话结束");
        }
      }
    }
  }
}
```

### 黑马接口调用

```javascript
// 用户登录
async function login(username, password) {
  const response = await fetch("https://hmajax.itheima.net/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  return data;
}

// 获取天气
async function getWeather(cityCode) {
  const response = await fetch(
    `https://hmajax.itheima.net/api/weather?city=${cityCode}`,
  );
  const data = await response.json();
  return data;
}

// 获取省份列表
async function getProvinces() {
  const response = await fetch("https://hmajax.itheima.net/api/province");
  const data = await response.json();
  return data.list;
}
```

---

# 五、注意事项

1. **限流保护**：后端API已启用限流保护，推荐接口每分钟最多20次请求，聊天接口每分钟最多10次请求
2. **流式响应**：聊天接口使用SSE流式响应，需要特殊处理
3. **Token认证**：黑马接口的用户信息相关接口需要在请求头携带Token
4. **跨域支持**：后端已启用CORS，支持跨域请求

---

**文档版本**: v3.0
**更新日期**: 2026-06-05
**维护团队**: AI旅游助手开发团队

import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
dotenv.config();
// 调用LLM模型
class TravelService {
  constructor() {
    this.llm = null;
    this.initLLM();
  }
  initLLM() {
    // 初始化LLM模型
    let apikey, baseurl, model;
    const provider = process.env.MODEL_PROVIDER;
    if (provider === "SiliconFlow") {
      apikey = process.env.SiliconFlow_API_KEY;
      baseurl = process.env.SiliconFlow_BASE_URL;
      model = process.env.SiliconFlow_MODEL;
    } else if (provider === "DeepSeek") {
      apikey = process.env.DeepSeek_API_KEY;
      baseurl = process.env.DeepSeek_BASE_URL;
      model = process.env.DeepSeek_MODEL;
    }
    this.llm = new ChatOpenAI({
      // 必须赋值给 this.llm，否则实例丢失
      apiKey: apikey, // apiKey 在顶层，不在 configuration 内
      configuration: { baseURL: baseurl }, // baseURL 放在 configuration 内
      model,
      temperature: 0.7,
      streaming: true,
    });
  }
  async recommend(city, budget, days) {
    if (budget < 100 || days < 0 || days > 30) {
      throw new Error("预算不足或者天数错误");
    }
    // 这边如果大于30天可能会接受一个超长字符串，这边是一个问题。
    try {
      const message = this.getTravelPrompt(city, budget, days);
      const response = await this.llm.invoke(message);
      const fullResponse = response.content || "";
      // fullResponse.match(/```json\n([\s\S]*?)\n```/) ||
      //   fullResponse.match(/```\n([\s\S]*?)\n```/) ||
      //   fullResponse.match(/\{[\s\S]*\}/);
      // console.log(response);
      // const jsonResult = JSON.parse(fullResponse);
      const match =
        fullResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
        fullResponse.match(/```\s*([\s\S]*?)\s*```/) ||
        fullResponse.match(/\{[\s\S]*\}/);

      if (!match) {
        throw new Error("大模型未能返回结构化的计划数据");
      }

      // 3. 提取干净的字符串并进行解析
      try {
        const jsonString = match[1] ? match[1].trim() : match[0].trim();
        const jsonResult = JSON.parse(jsonString);
        return jsonResult;
      } catch (parseErr) {
        console.error("【解析失败】大模型原始返回文本如下：\n", fullResponse);
        throw new Error(`解析 JSON 数据失败: ${parseErr.message}`);
      }
    } catch (err) {
      throw err;
    }
  }
  async chat(message, streamCallback) {
    try {
      const messages = [
        new SystemMessage("你是一个专业的旅游规划师，负责为用户定制旅游计划。"),
        new HumanMessage(message),
      ];
      // 2. 这里的 await 很关键，确保正确获取流式迭代器
      const stream = await this.llm.stream(messages);
      let fullResponse = "";
      for await (const chunk of stream) {
        const content = chunk.content || "";
        // 3. 移除原先的 content.trim() == '' 过滤
        // 只要 content 有内容（包括换行和空格），就吐给前端
        if (content) {
          fullResponse += content;
          if (streamCallback) {
            streamCallback(content); // 实时把哪怕是一个空格或换行发出去
          }
        }
      }
      // 4. 流正常结束后，如果需要通知外部，可以传一个特定标识或者不传
      // 更好的做法是交给外层 Express 路由的 finally 块去执行 streamResponse.end()
      if (streamCallback) {
        streamCallback(null);
      }
      return { success: true, reply: fullResponse };
    } catch (err) {
      console.error("流式聊天出错：", err);
      throw err;
    }
  }

  getTravelPrompt(city, budget, days) {
    return [
      new HumanMessage({
        content: `你是一位精通预算控制的专业旅游规划师。请严格按照以下要求，为我定制一份旅游计划：
【基本信息】
- 目的地城市：${city}
- 总预算：${budget} 元
- 旅行天数：${days} 天

【定制要求】
1. 行程规划：每天行程需精确划分到上午、下午、晚上，路线设计要顺路、避免折返。
2. 景点介绍：每个景点需要提供详细的特色介绍与游览建议。
3. 交通建议：明确每段行程之间最推荐、最具性价比的交通方式。
4. 预算分配：合理拆分住宿、餐饮、交通、门票等各项费用，确保总和不超过给定的总预算 ${budget} 元。
5. 注意事项：包含当地的旅行Tips、防坑指南或需要提前预约的声明。

【输出格式要求】
请不要输出任何解释性的寒暄或引言，必须严格、完整地返回以下标准的 JSON 格式数据：

{
  "success": true,
  "city": "${city}",
  "days": ${days},
  "totalBudget": ${budget},
  "dailyItinerary": [
    {
      "day": 1,
      "date": "第1天",
      "morning": {
        "spot": "景点名称",
        "duration": "游览时长",
        "ticket": "门票价格或免费",
        "transportation": "交通方式及建议",
        "description": "此处填写景点的详细介绍与游览亮点"
      },
      "afternoon": {
        "spot": "景点名称",
        "duration": "游览时长",
        "ticket": "门票价格或免费",
        "transportation": "交通方式及建议",
        "description": "此处填写景点的详细介绍与游览亮点"
      },
      "evening": {
        "spot": "活动或夜景名称",
        "duration": "活动时长",
        "ticket": "费用或免费",
        "transportation": "交通方式及建议",
        "description": "此处填写活动的详细介绍或夜间游玩建议"
      }
    }
  ],
  "budgetBreakdown": {
    "accommodation": 预计住宿总费用（数字）,
    "food": 预计餐饮总费用（数字）,
    "transportation": 预计市内交通总费用（数字）,
    "tickets": 预计门票总费用（数字）,
    "other": 备用或其他总费用（数字）
  },
  "tips": [
    "高性价比美食或省钱建议提示1",
    "最佳游玩季节或出行建议提示2",
    "需要提前预约的景点提示3"
  ],
  "warnings": [
    "当地防坑避雷注意事项1",
    "安全或交通堵塞注意事项2"
  ]
}

注意：
1. 请根据实际的 ${days} 天数，在 \`dailyItinerary\` 数组中生成对应数量的每日行程对象（Day 1 到 Day ${days}）。
2. 请确保 JSON 格式绝对正确，键名与数据类型与示例保持一致，所有字符串数据不要包含换行符。`,
      }),
    ];
  }
}
export default TravelService;

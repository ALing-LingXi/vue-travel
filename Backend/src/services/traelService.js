import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import path from "path";
import { fileURLToPath } from "url";
import { conversationService } from "./conversationService.js";

// 获取当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载 .env 文件（指定路径）
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
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
    console.log("🔍 MODEL_PROVIDER:", provider);

    if (provider === "SiliconFlow") {
      apikey = process.env.SiliconFlow_API_KEY;
      baseurl = process.env.SiliconFlow_BASE_URL;
      model = process.env.SiliconFlow_MODEL;
      console.log("✅ 使用 SiliconFlow 模型:", model);
    } else if (provider === "DeepSeek") {
      apikey = process.env.DeepSeek_API_KEY;
      baseurl = process.env.DeepSeek_BASE_URL;
      model = process.env.DeepSeek_MODEL;
      console.log("✅ 使用 DeepSeek 模型:", model);
    } else {
      console.error("❌ 未知的 MODEL_PROVIDER:", provider);
    }

    if (!apikey) {
      console.error("❌ API Key 未配置！");
    }

    this.llm = new ChatOpenAI({
      apiKey: apikey,
      configuration: { baseURL: baseurl },
      model,
      temperature: 0.1,
      streaming: true,
      timeout: 120000,
      maxTokens: 2500,
    });
  }
  async recommend(city, budget, days) {
    if (budget < 100 || days < 0 || days > 30) {
      throw new Error("预算不足或者天数错误");
    }

    const startTime = Date.now();
    console.log(`\n========== 开始生成行程 ==========`);
    console.log(`城市: ${city}, 预算: ${budget}, 天数: ${days}`);

    try {
      const message = this.getTravelPrompt(city, budget, days);
      console.log(`提示词长度: ${JSON.stringify(message).length} 字符`);

      const response = await this.llm.invoke(message);
      const fullResponse = response.content || "";

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`LLM 响应耗时: ${elapsed} 秒`);
      console.log(`响应长度: ${fullResponse.length} 字符`);

      // 如果响应为空或太短，打印完整响应
      if (fullResponse.length < 100) {
        console.error(`❌ 响应内容异常短，完整响应:\n${fullResponse}`);
        throw new Error("大模型返回内容为空或过短，请重试");
      }

      // 三层正则匹配
      const match =
        fullResponse.match(/```json\n([\s\S]*?)\n```/) ||
        fullResponse.match(/```\n([\s\S]*?)\n```/) ||
        fullResponse.match(/\{[\s\S]*\}/);

      if (!match) {
        console.error(
          ` 未匹配到 JSON，原始响应前 1000 字符:\n${fullResponse.substring(0, 1000)}`,
        );
        throw new Error("大模型未能返回结构化的计划数据，请重试");
      }

      const jsonString = match[1] ? match[1].trim() : match[0].trim();

      let jsonResult;
      try {
        jsonResult = JSON.parse(jsonString);
      } catch (parseErr) {
        console.error(`JSON 解析失败: ${parseErr.message}`);
        console.error(`问题 JSON 前 500 字符: ${jsonString.substring(0, 500)}`);
        throw new Error("AI 返回的数据格式有误，请重试");
      }

      if (
        !jsonResult.dailyItinerary ||
        !Array.isArray(jsonResult.dailyItinerary)
      ) {
        throw new Error("返回数据缺少 dailyItinerary 字段");
      }

      return jsonResult;
    } catch (err) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`❌ 请求失败 (耗时 ${elapsed} 秒):`, err.message);
      throw err;
    }
  }
  async chat(message, userId, conversationId, streamCallback) {
    let currentConversationId = conversationId;
    let isNewConversation = false;

    try {
      // 如果没有 conversationId，创建新对话
      if (!currentConversationId) {
        const result = await conversationService.createConversation(
          userId,
          "新对话",
        );
        if (result.success) {
          currentConversationId = result.data.id;
          isNewConversation = true;
        } else {
          throw new Error("创建对话失败");
        }
      }

      // 保存用户消息
      await conversationService.saveMessage(
        currentConversationId,
        "user",
        message,
      );

      // 如果是新对话，生成标题
      if (isNewConversation) {
        await conversationService.generateTitle(currentConversationId, message);
      }

      const messages = [
        new SystemMessage("你是一个专业的旅游规划师，负责为用户定制旅游计划。"),
        new HumanMessage(message),
      ];

      const stream = await this.llm.stream(messages);
      let fullResponse = "";
      let lastSentLength = 0;
      let lastChunk = "";

      for await (const chunk of stream) {
        let content = "";
        if (typeof chunk.content === "string") {
          content = chunk.content;
        } else if (typeof chunk === "string") {
          content = chunk;
        } else if (Array.isArray(chunk.content)) {
          content = chunk.content
            .map((c) => (typeof c === "string" ? c : c.text || ""))
            .join("");
        } else if (chunk?.content) {
          content = String(chunk.content);
        }

        if (content) {
          content = this.cleanChunk(content);

          if (content === lastChunk) {
            continue;
          }
          lastChunk = content;

          fullResponse += content;

          const newContent = fullResponse.slice(lastSentLength);

          if (newContent && streamCallback) {
            // 如果是新对话，第一次回调时传递 conversationId
            if (isNewConversation && lastSentLength === 0) {
              streamCallback(newContent, currentConversationId);
            } else {
              streamCallback(newContent);
            }
            lastSentLength = fullResponse.length;
          }
        }
      }

      // 保存 AI 回复
      await conversationService.saveMessage(
        currentConversationId,
        "ai",
        fullResponse,
      );

      return {
        success: true,
        reply: fullResponse,
        conversationId: currentConversationId,
      };
    } catch (err) {
      console.error("流式聊天出错：", err);
      throw err;
    }
  }

  cleanChunk(content) {
    if (!content) return content;

    content = content.replace(/[\r\n]+/g, "\n").trim();

    content = content.replace(/(\s)\1{2,}/g, "$1");

    const pattern = /(.{2,})\1{2,}/g;
    content = content.replace(pattern, "$1");

    return content;
  }

  getTravelPrompt(city, budget, days) {
    return [
      new SystemMessage(
        "你是一个专业的旅游规划师，擅长根据用户的需求生成详细的旅行行程。请始终以标准 JSON 格式返回结果，不要添加任何额外的文字说明。",
      ),
      new HumanMessage(`请为以下旅行需求生成详细的旅游规划：

- 目的地城市：${city}
- 预算：${budget}元
- 旅行天数：${days}天

请以JSON格式输出，结构如下：
{
  "success": true,
  "city": "城市名",
  "days": 天数,
  "totalBudget": 总预算,
  "dailyItinerary": [
    {
      "day": 1,
      "date": "第1天",
      "morning": {
        "spot": "景点名称",
        "duration": "游览时长",
        "ticket": "门票价格",
        "transportation": "交通方式",
        "description": "景点介绍"
      },
      "afternoon": {
        "spot": "景点名称",
        "duration": "游览时长",
        "ticket": "门票价格",
        "transportation": "交通方式",
        "description": "景点介绍"
      },
      "evening": {
        "spot": "活动名称",
        "duration": "活动时长",
        "ticket": "费用",
        "transportation": "交通方式",
        "description": "活动介绍"
      }
    }
  ],
  "budgetBreakdown": {
    "accommodation": 住宿费用,
    "food": 餐饮费用,
    "transportation": 交通费用,
    "tickets": 门票费用,
    "other": 其他费用
  },
  "tips": ["提示1", "提示2", "提示3"],
  "warnings": ["注意事项1", "注意事项2"]
}

请确保JSON格式正确，可以被解析。只返回JSON，不要有其他文字。`),
    ];
  }
}
export default TravelService;

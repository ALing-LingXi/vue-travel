import express from "express";
import TravelService from "../services/traelService.js";
import { createStreamResponse } from "../utils/createStreamResponse.js";
import { travelApiLimiter, chatApiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
const travelService = new TravelService();
router.post("/recommend", travelApiLimiter, async (req, res) => {
  const { city, budget, days } = req.body;

  console.log(
    `\n📥 收到推荐请求: city=${city}, budget=${budget}, days=${days}`,
  );

  if (!city || !budget || !days) {
    console.log(`❌ 参数校验失败`);
    return res
      .status(400)
      .json({ success: false, message: "缺少city,budget,days参数" });
  }

  try {
    const result = await travelService.recommend(city, budget, days);
    console.log(`✅ 推荐成功，返回结果`);
    res.json({ success: true, result });
  } catch (err) {
    console.error(`❌ 推荐失败:`, err.message);
    res
      .status(500)
      .json({ success: false, message: err.message || "服务器内部错误" });
  }
});

router.post("/chat", chatApiLimiter, async (req, res) => {
  const { message, userId, conversationId } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: "缺少message参数" });
  }

  if (!userId) {
    return res.status(400).json({ success: false, message: "缺少userId参数" });
  }

  // 1. 初始化流式响应
  const streamResponse = createStreamResponse(res);

  try {
    // 2. 调用大模型聊天，并在回调中发送格式化后的字符串
    await travelService.chat(message, userId, conversationId, (chunk, newConversationId) => {
      // 如果有新创建的对话ID，先发送给前端
      if (newConversationId && !res.writableEnded) {
        streamResponse.send(JSON.stringify({ type: "conversationId", data: newConversationId }));
      }

      // 只有当大模型真正蹦出字来，且当前网络通道还没关闭时才发送
      if (chunk && !res.writableEnded) {
        // 关键点：必须用 JSON.stringify 转成纯文本字符串！
        streamResponse.send(JSON.stringify({ type: "chunk", data: chunk }));
      }
    });

    // 3. 大模型全部吐完字后，安全地发送结束标记
    if (!res.writableEnded) {
      streamResponse.send(JSON.stringify({ type: "end" }));
    }
  } catch (err) {
    console.error("路由捕获到聊天流异常:", err);
    if (!res.writableEnded) {
      streamResponse.error(err);
    }
  } finally {
    // 4. 无论成功还是失败，最后统一、安全地关闭流连接
    if (!res.writableEnded) {
      streamResponse.end();
    }
  }
});

export default router;

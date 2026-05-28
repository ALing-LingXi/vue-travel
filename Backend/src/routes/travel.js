import express from "express";
import travelService from "../services/traelService.js";
import { createStreamResponse } from "../utils/createStreamResponse.js";
const router = express.Router();

router.post("/recommend", async (req, res) => {
 const {city,budget,days} = req.body;
 if(!city||!budget||!days){
  return res.status(404).json({success:false,message:"缺少city,budget,days参数"})
 }
 try{
  const result = await travelService.recommend(city,budget,days);
  res.json({success:true,result});
 }catch(err){
  res.status(500).json({success:false,message:err.message});
 }
});

router.post("/chat", async (req, res) => {
  if (!req.body.message) {
    return res.status(404).json({ success: false, message: "缺少message参数" });
  }

  // 1. 初始化流式响应
  const streamResponse = createStreamResponse(res);

  try {
    // 2. 调用大模型聊天，并在回调中发送格式化后的字符串
    await travelService.chat(req.body.message, (chunk) => {
      // 只有当大模型真正蹦出字来，且当前网络通道还没关闭时才发送
      if (chunk && !res.writableEnded) {
        // 关键点：必须用 JSON.stringify 转成纯文本字符串！
        streamResponse.send(JSON.stringify({ type: 'chunk', data: chunk }));
      }
    });

    // 3. 大模型全部吐完字后，安全地发送结束标记
    if (!res.writableEnded) {
      streamResponse.send(JSON.stringify({ type: 'end' }));
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
import express from "express";
import { conversationService } from "../services/conversationService.js";

const router = express.Router();

// 创建新对话
router.post("/create", async (req, res) => {
  const { userId, title } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "缺少userId参数" });
  }

  const result = await conversationService.createConversation(userId, title);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 获取对话列表
router.get("/list", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: "缺少userId参数" });
  }

  const result = await conversationService.getConversations(userId);
  res.json(result);
});

// 获取对话消息
router.get("/:id/messages", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: "缺少userId参数" });
  }

  const result = await conversationService.getMessages(id, userId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 删除对话
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "缺少userId参数" });
  }

  const result = await conversationService.deleteConversation(id, userId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 重命名对话
router.put("/:id/rename", async (req, res) => {
  const { id } = req.params;
  const { userId, title } = req.body;

  if (!userId || !title) {
    return res.status(400).json({ success: false, message: "缺少userId或title参数" });
  }

  const result = await conversationService.renameConversation(id, userId, title);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

export default router;

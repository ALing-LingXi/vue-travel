import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ConversationService {
  // 创建新对话
  async createConversation(userId, title = '新对话') {
    try {
      const conversation = await prisma.conversation.create({
        data: {
          userId,
          title,
        },
      });
      return { success: true, data: conversation };
    } catch (error) {
      console.error('创建对话失败:', error);
      return { success: false, message: '创建对话失败' };
    }
  }

  // 获取用户所有对话列表
  async getConversations(userId) {
    try {
      const conversations = await prisma.conversation.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: { messages: true },
          },
        },
      });
      return { success: true, data: conversations };
    } catch (error) {
      console.error('获取对话列表失败:', error);
      return { success: false, message: '获取对话列表失败' };
    }
  }

  // 获取单个对话的所有消息
  async getMessages(conversationId, userId) {
    try {
      // 验证对话是否属于该用户
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, userId },
      });

      if (!conversation) {
        return { success: false, message: '对话不存在或无权访问' };
      }

      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
      });

      return { success: true, data: { conversation, messages } };
    } catch (error) {
      console.error('获取消息失败:', error);
      return { success: false, message: '获取消息失败' };
    }
  }

  // 删除对话
  async deleteConversation(conversationId, userId) {
    try {
      // 验证对话是否属于该用户
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, userId },
      });

      if (!conversation) {
        return { success: false, message: '对话不存在或无权访问' };
      }

      await prisma.conversation.delete({
        where: { id: conversationId },
      });

      return { success: true, message: '删除对话成功' };
    } catch (error) {
      console.error('删除对话失败:', error);
      return { success: false, message: '删除对话失败' };
    }
  }

  // 重命名对话
  async renameConversation(conversationId, userId, newTitle) {
    try {
      // 验证对话是否属于该用户
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, userId },
      });

      if (!conversation) {
        return { success: false, message: '对话不存在或无权访问' };
      }

      const updated = await prisma.conversation.update({
        where: { id: conversationId },
        data: { title: newTitle },
      });

      return { success: true, data: updated };
    } catch (error) {
      console.error('重命名对话失败:', error);
      return { success: false, message: '重命名对话失败' };
    }
  }

  // 保存消息到对话
  async saveMessage(conversationId, role, content) {
    try {
      const message = await prisma.message.create({
        data: {
          conversationId,
          role,
          content,
        },
      });

      // 更新对话的 updatedAt 时间
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return { success: true, data: message };
    } catch (error) {
      console.error('保存消息失败:', error);
      return { success: false, message: '保存消息失败' };
    }
  }

  // 自动生成对话标题（取第一条用户消息的前20个字符）
  async generateTitle(conversationId, firstMessage) {
    const title = firstMessage.substring(0, 20) + (firstMessage.length > 20 ? '...' : '');
    try {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { title },
      });
      return { success: true };
    } catch (error) {
      console.error('生成标题失败:', error);
      return { success: false };
    }
  }
}

export const conversationService = new ConversationService();
export default ConversationService;

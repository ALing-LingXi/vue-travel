import request from './request'

// 对话接口类型定义
export interface Conversation {
  id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
  _count?: {
    messages: number
  }
}

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'ai'
  content: string
  createdAt: string
}

export interface ConversationWithMessages {
  conversation: Conversation
  messages: Message[]
}

/**
 * 创建新对话
 * @param userId 用户ID
 * @param title 对话标题（可选）
 */
export async function createConversation(userId: string, title?: string): Promise<Conversation> {
  const result = (await request.post('/api/conversation/create', {
    userId,
    title,
  })) as any
  return result.data
}

/**
 * 获取用户所有对话列表
 * @param userId 用户ID
 */
export async function getConversations(userId: string): Promise<Conversation[]> {
  const result = (await request.get('/api/conversation/list', {
    params: { userId },
  })) as any
  return result.data
}

/**
 * 获取对话的所有消息
 * @param conversationId 对话ID
 * @param userId 用户ID
 */
export async function getMessages(conversationId: string, userId: string): Promise<ConversationWithMessages> {
  const result = (await request.get(`/api/conversation/${conversationId}/messages`, {
    params: { userId },
  })) as any
  return result.data
}

/**
 * 删除对话
 * @param conversationId 对话ID
 * @param userId 用户ID
 */
export async function deleteConversation(conversationId: string, userId: string): Promise<void> {
  await request.delete(`/api/conversation/${conversationId}`, {
    data: { userId },
  })
}

/**
 * 重命名对话
 * @param conversationId 对话ID
 * @param userId 用户ID
 * @param title 新标题
 */
export async function renameConversation(conversationId: string, userId: string, title: string): Promise<Conversation> {
  const result = (await request.put(`/api/conversation/${conversationId}/rename`, {
    userId,
    title,
  })) as any
  return result.data
}

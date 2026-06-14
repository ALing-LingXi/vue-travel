<template>
  <div class="page-container conversation-list-page">
    <div class="page-header">
      <van-nav-bar title="对话记录" left-text="返回" left-arrow @click-left="onBack">
        <template #right>
          <van-icon name="plus" size="18" @click="createNewConversation" />
        </template>
      </van-nav-bar>
    </div>

    <div class="page-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div v-if="conversations.length === 0 && !loading" class="empty-state">
          <van-empty description="暂无对话记录">
            <van-button type="primary" size="small" @click="createNewConversation">
              开始新对话
            </van-button>
          </van-empty>
        </div>

        <van-list v-else v-model:loading="loading" :finished="finished" @load="loadConversations">
          <van-swipe-cell v-for="conversation in conversations" :key="conversation.id">
            <van-cell :title="conversation.title" :label="formatDate(conversation.updatedAt)" is-link
              @click="openConversation(conversation.id)">
              <template #value>
                <van-tag v-if="conversation._count" type="primary" size="medium">
                  {{ conversation._count.messages }} 条消息
                </van-tag>
              </template>
            </van-cell>
            <template #right>
              <van-button square type="danger" text="删除" @click="confirmDelete(conversation)" />
              <van-button square type="primary" text="重命名" @click="showRenameDialog(conversation)" />
            </template>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 重命名对话框 -->
    <van-dialog v-model:show="renameDialogVisible" title="重命名对话" show-cancel-button @confirm="handleRename">
      <van-field v-model="newTitle" placeholder="请输入新标题" :rules="[{ required: true, message: '请输入标题' }]" />
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { getConversations, deleteConversation, renameConversation } from '@/utils/conversation'
import { getUserInfo } from '@/utils/auth'
import type { Conversation } from '@/utils/conversation'

const router = useRouter()
const conversations = ref<Conversation[]>([])
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(true) // 一次性加载所有对话

const renameDialogVisible = ref(false)
const newTitle = ref('')
const currentConversation = ref<Conversation | null>(null)

// 获取用户ID（使用 username 作为唯一标识）
const getUserId = () => {
  const userInfo = getUserInfo()
  if (!userInfo) {
    showToast('请先登录')
    router.push('/auth')
    return null
  }
  // 优先使用 id，如果没有则使用 username
  const userId = userInfo.id || userInfo.username
  if (!userId) {
    showToast('用户信息不完整，请重新登录')
    router.push('/auth')
    return null
  }
  return String(userId)
}

// 加载对话列表
const loadConversations = async () => {
  const userId = getUserId()
  if (!userId) return

  try {
    loading.value = true
    const data = await getConversations(userId)
    conversations.value = data
  } catch (error: any) {
    showToast(error.message || '加载失败')
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loadConversations()
}

// 创建新对话
const createNewConversation = () => {
  router.push('/chart')
}

// 打开对话
const openConversation = (conversationId: string) => {
  router.push(`/chart?conversationId=${conversationId}`)
}

// 确认删除
const confirmDelete = async (conversation: Conversation) => {
  try {
    await showConfirmDialog({
      title: '删除对话',
      message: `确定要删除"${conversation.title}"吗？删除后无法恢复。`,
    })

    const userId = getUserId()
    if (!userId) return

    await deleteConversation(conversation.id, userId)
    showToast('删除成功')
    conversations.value = conversations.value.filter(c => c.id !== conversation.id)
  } catch (error: any) {
    if (error.message !== 'cancel') {
      showToast(error.message || '删除失败')
    }
  }
}

// 显示重命名对话框
const showRenameDialog = (conversation: Conversation) => {
  currentConversation.value = conversation
  newTitle.value = conversation.title
  renameDialogVisible.value = true
}

// 处理重命名
const handleRename = async () => {
  if (!newTitle.value.trim()) {
    showToast('请输入标题')
    return
  }

  const userId = getUserId()
  if (!userId || !currentConversation.value) return

  try {
    const updated = await renameConversation(
      currentConversation.value.id,
      userId,
      newTitle.value.trim()
    )

    // 更新列表中的对话
    const index = conversations.value.findIndex(c => c.id === currentConversation.value!.id)
    if (index !== -1) {
      conversations.value[index] = { ...conversations.value[index], title: updated.title }
    }

    showToast('重命名成功')
  } catch (error: any) {
    showToast(error.message || '重命名失败')
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 一天内显示相对时间
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    if (hours < 1) {
      const minutes = Math.floor(diff / (60 * 1000))
      return minutes < 1 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  }

  // 一周内显示天数
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days}天前`
  }

  // 其他显示具体日期
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 返回
const onBack = () => {
  router.back()
}

onMounted(() => {
  loadConversations()
})
</script>

<style scoped>
.conversation-list-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f7f8fa;
}

.page-content {
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}

.van-swipe-cell {
  margin-bottom: 8px;
}
</style>

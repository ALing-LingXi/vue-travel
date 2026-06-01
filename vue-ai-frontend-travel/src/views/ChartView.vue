<template>
  <div class="page-container chat-page">
    <div class="page-header">
      <van-nav-bar title="AI旅游助手" left-text="返回" left-arrow @click-left="onBack" />
    </div>

    <div class="page-content chat-container">
      <div v-if="messages.length === 0" class="chat-empty">
        <van-empty description="开始和AI旅游助手对话吧!" />
        <div class="quick-questions">
          <div class="quick-title">常见问题</div>
          <van-tag class="quick-tag" mark plain v-for="(question, index) in questions" :key="index"
            @click="onClickTag(question)">
            {{ question }}
          </van-tag>
        </div>
      </div>

      <div v-else class="message-list">
        <ChatBubble v-for="msg in messages" :key="msg.id" :message="msg" />

        <div class="streaming-indicator" v-if="isStreaming">
          <van-loading type="spinner" size="16px" />
          <span>AI 正在思考中...</span>
        </div>
      </div>
    </div>

    <div class="chat-input-area">
      <van-field v-model="msg" center :disabled="isStreaming" clearable placeholder="请输入问题" @keyup.enter="send">
        <template #button>
          <van-button size="small" type="primary" :disabled="!msg.trim().length || isStreaming" @click="send">
            发送
          </van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, nextTick, onMounted } from 'vue'
import { fetchStream } from '@/utils/request'
import { showToast } from 'vant'
// 注意：检查你的组件路径拼写是否为 componets，规范建议改为 components
import ChatBubble from '@/componets/ChatBubble.vue'
const route = useRoute()
onMounted(() => {
  if (!route.query.city) return
  msg.value = `我想了解${route.query.city}的旅游信息`
})
interface MessageItem {
  id: number
  role: 'user' | 'ai'
  content: string
  timestamp: number // 统一使用时间戳，方便子组件格式化
}

const router = useRouter()
const isStreaming = ref(false)
const msg = ref('')
const messages = ref<MessageItem[]>([])

const questions = ref([
  '北京有哪些必去的景点？',
  '上海美食推荐',
  '成都三日游攻略',
  '如何选择旅行保险？'
])

const onBack = () => {
  router.back()
  msg.value = ''
}

// 自动滚动到聊天底部
const scrollToBottom = async () => {
  await nextTick()
  const container = document.querySelector('.chat-container')
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

// 封装添加消息的方法
const addUserMessage = (content: string) => {
  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: content,
    timestamp: Date.now()
  })
  scrollToBottom()
}

// 点击标签直接发送
const onClickTag = (question: string) => {
  if (isStreaming.value) return
  addUserMessage(question)
  fetchAIMessage(question)
}

const send = () => {
  const message = msg.value.trim()
  if (!message || isStreaming.value) return

  addUserMessage(message)
  msg.value = '' // 清空输入框

  // 必须把当前发送的内容传给请求方法
  fetchAIMessage(message)
}

const fetchAIMessage = async (userPrompt: string) => {
  isStreaming.value = true

  // 预先放入一条空白的 AI 回复气泡
  messages.value.push({
    id: Date.now() + 1,
    role: 'ai',
    content: "",
    timestamp: Date.now()
  })
  scrollToBottom()

  // 后端接口期望接收 message 参数
  const payload = {
    message: userPrompt
  }

  fetchStream(
    "/chat",
    payload,
    (chunk) => {
      // 收到文本碎片
      const lastMsg = messages.value[messages.value.length - 1]
      if (lastMsg && lastMsg.role === 'ai') {
        lastMsg.content += chunk
        scrollToBottom()
      }
    },
    () => {
      // 流传输完成
      isStreaming.value = false
    },
    (err) => {
      // 错误处理
      const lastMsg = messages.value[messages.value.length - 1]
      if (lastMsg && lastMsg.role === 'ai') {
        lastMsg.content = `抱歉，AI发生错误: ${err.message || err}`
      }
      isStreaming.value = false
      showToast("AI处理失败")
    }
  )
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f7f8fa;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  /* 留出底部输入框的高度，防止遮挡最后一句话 */
  padding-bottom: 80px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}

.quick-questions {
  margin-top: 24px;
  width: 100%;
  padding: 0 32px;
  box-sizing: border-box;
}

.quick-title {
  font-size: 14px;
  color: #969799;
  margin-bottom: 12px;
  text-align: center;
}

.quick-tag {
  margin: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.streaming-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: #969799;
  font-size: 13px;
  align-self: flex-start;
}

.chat-input-area {
  position: fixed;
  bottom: 0;
  /* 配合 h5 或者是打包装包，注意安全区域 */
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 16px (12px + constant(safe-area-inset-bottom));
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  max-width: 750px;
  margin: 0 auto;
  z-index: 99;
}

.chat-input-area :deep(.van-field) {
  background: #f7f8fa;
  border-radius: 22px;
  padding: 6px 12px;
}
</style>

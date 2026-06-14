<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showTabbar = computed(() => {
  const hiddenPaths = ['/auth', '/chart']
  return !hiddenPaths.includes(route.path)
})

onMounted(() => {
  const token = import.meta.env.VITE_COZE_TOKEN

  const initCoze = () => {
    if (!(window as any).CozeWebSDK) return

    // 防止重复初始化
    if (document.getElementById('coze-chat-mounted')) return

    new (window as any).CozeWebSDK.WebChatClient({
      config: {
        bot_id: '7648251615123947558',
        isIframe: false
      },

      componentProps: {
        title: 'AI旅游助手'
      },

      auth: {
        type: 'token',
        token,

        onRefreshToken() {
          return token
        }
      },

      ui: {
        asMobile: false,
        elStyles: {
          'chat-trigger-btn': {
            position: 'fixed',
            right: '20px',
            bottom: '120px', // 避开底部 TabBar
            zIndex: '99999'
          }
        }
      }
    })

    const flag = document.createElement('div')
    flag.id = 'coze-chat-mounted'
    flag.style.display = 'none'
    document.body.appendChild(flag)
  }

  if ((window as any).CozeWebSDK) {
    initCoze()
  } else {
    const script = document.createElement('script')

    script.src =
      'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.19/libs/cn/index.js'

    script.onload = initCoze

    document.body.appendChild(script)
  }
})
</script>

<template>
  <div class="app-container">
    <router-view />

    <van-tabbar
      v-if="showTabbar"
      route
    >
      <van-tabbar-item
        name="home"
        icon="home-o"
        to="/"
      >
        首页
      </van-tabbar-item>

      <van-tabbar-item
        name="chat"
        icon="chat-o"
        to="/chart"
      >
        聊天
      </van-tabbar-item>

      <van-tabbar-item
        name="profile"
        icon="manager-o"
        to="/profile"
      >
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
}
</style>

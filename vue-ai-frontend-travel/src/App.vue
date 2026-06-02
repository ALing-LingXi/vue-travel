<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showTabbar = computed(() => {
  return route.path !== '/auth'
})
</script>

<template>
  <div class="app-container">
    <router-view></router-view>
    <van-tabbar v-if="showTabbar" route>
      <van-tabbar-item name="home" icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item name="chat" icon="chat-o" to="/chart">聊天</van-tabbar-item>
      <van-tabbar-item name="profile" icon="manager-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped></style>

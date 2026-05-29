<script setup lang="ts"></script>

<template>
  <div class="app-container">
    <router-view></router-view>
<van-tabbar  route>
  <van-tabbar-item name="home" icon="home-o" to="/">标签</van-tabbar-item>
  <van-tabbar-item name="chat-o" icon="chat-o" to="/chart">标签</van-tabbar-item>
  <van-tabbar-item name="my" icon="manager-o" to="/profile">标签</van-tabbar-item>
</van-tabbar>

  </div>
</template>

<style scoped></style>

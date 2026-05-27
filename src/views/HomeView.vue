<template>
  <div class="page-container">
    <div class="page-header">
      <van-nav-bar title="首页" />
    </div>
    <div class="page-content">
      <van-notice-bar left-icon="info-o" text="出行旅游就来希希出行" style="margin-bottom: 16px;" />
      <div class="card search-card">
        <div class="search-title">规划你的行程</div>
      </div>
      <div class="card"></div>
      <div class="card"></div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.page-container {
  height: 2000px;
}

.search-card {
  margin-bottom: 16px;
  font-weight: bold;
}
</style>

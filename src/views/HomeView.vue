<template>
  <div class="page-container">
    <div class="page-header">
      <van-nav-bar title="首页" />
    </div>
    <div class="page-content">
      <van-notice-bar left-icon="info-o" text="出行旅游就来希希出行" style="margin-bottom: 16px;" />
      <div class="card search-card">
        <div class="search-title">规划你的行程</div>
        <van-field is-link readonly v-model="formDate.city" label="目的地" placeholder="请选择城市"
         @click="showCityPicker = true" />
      </div>
      <div class="card">
        <van-field v-model="formDate.budget" label="预算" placeholder="请输入预算" type="number" />
      </div>
      <div class="card">
        <van-field v-model="formDate.days" label="天数" placeholder="请输入天数" type="digit" />
      </div>
      <van-button type="primary" round size="large" :loading="isloading" @click="handleSubmit">开始规划</van-button>
    </div>
  <van-popup v-model:show="showCityPicker" round position="bottom">
  <van-picker
    title="请选择城市"
    :columns="cityColumns"
    @confirm="handleCityConfirm"
    @cancel="showCityPicker = false"
  />
</van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
// const allCity =['北京','上海','广州','深圳','成都','重庆','西安','西安']
// const formDate = ref('')
const formDate = reactive({
  city: '',
  budget: undefined,
  days: undefined
})
const isloading = ref(false)
const handleSubmit = async()=>{
  isloading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  isloading.value = false
}
const showCityPicker = ref(false)
const allCities = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆',
  '南京', '武汉', '苏州', '长沙', '天津', '郑州', '济南', '青岛',
  '大连', '沈阳', '哈尔滨', '长春', '福州', '厦门', '南昌', '合肥',
  '昆明', '贵阳', '南宁', '桂林', '海口', '三亚', '丽江', '大理',
  '西安', '兰州', '乌鲁木齐', '拉萨', '呼和浩特', '太原', '石家庄'
]
const cityColumns = allCities.map(city => ({
  text: city,value:city
}))
const handleCityConfirm = ({selectedValues}:{selectedValues: string[]}) => {
  // 处理用户选择的城市兜底情况
  formDate.city = selectedValues[0] || ''
  showCityPicker.value = false
}
</script>

<style scoped>
.page-container {
  height: 2000px;
}

.search-card {
  margin-bottom: 16px;
  font-weight: bold;
}

.search-title {
  margin-bottom: 16px;
}
.card {
  background-color: #f7f8fa;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>

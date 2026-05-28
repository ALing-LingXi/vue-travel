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
          @click="showCityPicker = true" style="background-color: #f7f8fa; border-radius: 8px; margin-bottom: 16px;" />
        <van-field v-model="formDate.budget" label="预算" placeholder="请输入预算" type="number"
          style="background-color: #f7f8fa; border-radius: 8px; margin-bottom: 16px;" />
        <van-field v-model="formDate.days" label="天数" placeholder="请输入天数" type="digit"
          style="background-color: #f7f8fa; border-radius: 8px; margin-bottom: 16px;" />
        <van-button type="primary" round size="large" :loading="isloading" @click="handleSubmit">开始规划</van-button>
      </div>
      <div class="card" quick-actions>
        <div class="search-title">快捷栏</div>
        <van-grid gutter="12" column-num="2">
          <van-grid-item @click="transition('/chart')" icon="chat-o" text="标签" />
          <van-grid-item @click="transition('/profile')" icon="user-o" text="用户" />
        </van-grid>
      </div>
      <div class="card popular-destinations">
        <div class="search-title">热门城市</div>
        <van-grid>
          <van-grid-item @click="selectCity(city)" v-for="(city, index) in hotCity" :key="index">
            <div class="city-tag" :class="{'active':formDate.city===city }">{{ city }}</div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <van-popup v-model:show="showCityPicker" round position="bottom">
      <van-picker title="请选择城市" :columns="cityColumns" @confirm="handleCityConfirm" @cancel="showCityPicker = false" />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
// const allCity =['北京','上海','广州','深圳','成都','重庆','西安','西安']
// const formDate = ref('')
const formDate = reactive({
  city: '',
  budget: undefined,
  days: undefined
})
const isloading = ref(false)
const handleSubmit = async () => {
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
const hotCity = ['北京', '上海', '广州', '深圳', '成都', '重庆', '西安', '杭州']
const cityColumns = allCities.map(city => ({
  text: city, value: city
}))
const handleCityConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  // 处理用户选择的城市兜底情况
  formDate.city = selectedValues[0] || ''
  showCityPicker.value = false
}
const router = useRouter()
function transition(path: string) {
  router.push(path)
}
function selectCity(city: string) {
  formDate.city = city
}
</script>

<style scoped>
.page-container {
  height: 2000px;
}

/* .search-card {
  margin-bottom: 16px;
  font-weight: bold;
} */

.search-title {
  margin-bottom: 16px;
  margin-bottom: 16px;
  font-weight: bold;
}

.popular-destinations .city-tag {
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 14px;
  color: #666;
  background: #f7f8fa;
  transition: all 0.3s;
  cursor: pointer;
}

.popular-destinations .city-tag.active {
  background-color: #007AFF;
  color: #fff;
}
</style>

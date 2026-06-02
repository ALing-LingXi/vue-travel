<template>
  <div class="page-container">
    <div class="page-header">
      <van-nav-bar title="首页" />
    </div>
    <div class="page-content">
      <van-notice-bar left-icon="info-o" text="出行旅游就来希希出行" style="margin-bottom: 16px;" />

      <!-- 天气卡片 -->
      <WeatherCard v-if="weatherData" :city-name="selectedCityName" :weather-data="weatherData" />

      <div class="card search-card">
        <div class="search-title">规划你的行程</div>

        <!-- 城市搜索 -->
        <van-field v-model="citySearchKeyword" is-link readonly label="目的地" placeholder="请搜索城市"
          @click="showCitySearch = true" style="background-color: #f7f8fa; border-radius: 8px; margin-bottom: 16px;" />

        <van-field v-model="formDate.budget" label="预算" placeholder="请输入预算" type="number"
          style="background-color: #f7f8fa; border-radius: 8px; margin-bottom: 16px;" />
        <van-field v-model="formDate.days" label="天数" placeholder="请输入天数" type="digit"
          style="background-color: #f7f8fa; border-radius: 8px; margin-bottom: 16px;" />
        <van-button type="primary" round size="large" :loading="isloading" @click="handleSubmit">开始规划</van-button>
      </div>

      <div class="card quick-actions">
        <div class="search-title">快捷栏</div>
        <van-grid gutter="12" column-num="3">
          <van-grid-item @click="transition('/chart')" icon="chat-o" text="AI助手" />
          <van-grid-item @click="transition('/weather')" icon="search" text="天气查询" />
          <van-grid-item @click="transition('/profile')" icon="user-o" text="个人中心" />
        </van-grid>
      </div>
      <div class="card popular-destinations">
        <div class="search-title">热门城市</div>
        <van-grid>
          <van-grid-item @click="selectCity(city)" v-for="(city, index) in hotCity" :key="index">
            <div class="city-tag" :class="{ 'active': formDate.city === city }">{{ city }}</div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>

    <!-- 城市搜索弹窗 -->
    <van-popup v-model:show="showCitySearch" round position="bottom" style="height: 60%;">
      <div class="city-search-popup">
        <van-search v-model="citySearchInput" placeholder="请输入城市名称" show-action @search="handleCitySearch"
          @cancel="showCitySearch = false" />
        <div class="search-results" v-if="citySearchResults.length">
          <van-cell-group>
            <van-cell v-for="city in citySearchResults" :key="city.code" :title="city.name" is-link
              @click="handleSelectCity(city)" />
          </van-cell-group>
        </div>
        <van-empty v-else description="请输入城市名称搜索" />
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { searchCity, getWeather, type CityInfo, type WeatherData } from '@/utils/weather'
import WeatherCard from '@/components/WeatherCard.vue'

const router = useRouter()

const formDate = reactive({
  city: '',
  cityCode: '',
  budget: undefined as number | undefined,
  days: undefined as number | undefined
})

const isloading = ref(false)
const showCitySearch = ref(false)
const citySearchInput = ref('')
const citySearchKeyword = ref('')
const citySearchResults = ref<CityInfo[]>([])
const selectedCityName = ref('')
const weatherData = ref<WeatherData | null>(null)

// 热门城市
const hotCity = ['北京', '上海', '广州', '深圳', '成都', '重庆', '西安', '杭州']

// 城市搜索
const handleCitySearch = async () => {
  if (!citySearchInput.value.trim()) {
    showToast('请输入城市名称')
    return
  }

  try {
    const results = await searchCity(citySearchInput.value.trim())
    citySearchResults.value = results
  } catch (err) {
    showToast('搜索失败，请重试')
    console.error('城市搜索失败:', err)
  }
}

// 选择城市
const handleSelectCity = async (city: CityInfo) => {
  const cityName = city.name.split(' - ')[0] || ''
  formDate.city = cityName
  formDate.cityCode = city.code
  citySearchKeyword.value = city.name
  selectedCityName.value = cityName
  showCitySearch.value = false

  // 获取天气
  try {
    const weather = await getWeather(city.code)
    weatherData.value = weather
  } catch (err) {
    console.error('获取天气失败:', err)
  }
}

// 选择热门城市
const selectCity = async (city: string) => {
  formDate.city = city
  citySearchKeyword.value = city

  try {
    const results = await searchCity(city)
    const firstResult = results[0]
    if (firstResult) {
      formDate.cityCode = firstResult.code
      const cityName = firstResult.name.split(' - ')[0] || ''
      selectedCityName.value = cityName

      const weather = await getWeather(firstResult.code)
      weatherData.value = weather
    }
  } catch (err) {
    console.error('获取城市信息失败:', err)
  }
}

// 提交表单
const handleSubmit = async () => {
  isloading.value = true
  if (!formDate.city) {
    showToast('请选择城市');
    isloading.value = false
    return
  }
  if (!formDate.budget) {
    showToast('请输入预算')
    isloading.value = false
    return
  }
  if (formDate.budget < 100) {
    showToast('预算不能低于100元')
    isloading.value = false
    return
  }
  if (!formDate.days) {
    showToast('请输入天数')
    isloading.value = false
    return
  }
  if (formDate.days < 1 || formDate.days > 30) {
    showToast("天数不能低于1天或高于30天")
    isloading.value = false
    return
  }

  router.push({
    path: "/detail",
    query: {
      city: formDate.city,
      budget: formDate.budget,
      days: formDate.days
    }
  })
}

// 页面跳转
function transition(path: string) {
  router.push(path)
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.page-content {
  padding-bottom: 60px;
}

.card {
  background: #fff;
  border-radius: 12px;
  margin: 12px 16px;
  padding: 16px;
}

.search-title {
  font-size: 16px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 16px;
}

.city-search-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-results {
  flex: 1;
  overflow-y: auto;
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

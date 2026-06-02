<template>
  <div class="page-container">
    <div class="page-header">
      <van-nav-bar left-arrow @click="onBack" :title="(formDate?.city || '') + '行程详情'" />
    </div>
    <div class="page-content">
      <div v-if="isloading" class="loading-container">
        <van-loading size="48px" type="spinner">
          正在生成旅游规划...
        </van-loading>
      </div>

      <div v-else-if="errorMsg">
        <van-empty :description="errorMsg">
          <van-button type="primary" @click="getRecomend">重试</van-button>
        </van-empty>
      </div>

      <template v-else-if="tripData && tripData.dailyItinerary && tripData.dailyItinerary.length > 0">

        <div class="card overview-card">
          <div class="trip-header">
            <h2>{{ tripData?.city }} · {{ tripData?.days }}天行程</h2>
            <div class="trip-budget">预算：{{ tripData?.totalBudget }}元</div>
          </div>
        </div>

        <div class="card weather-card" v-if="weatherData">
          <div class="section-title">
            📊 今日天气
          </div>
          <div class="weather-content">
            <div class="weather-main">
              <div class="weather-icon">{{ getWeatherIcon(weatherData?.weather || '') }}</div>
              <div class="weather-info">
                <div class="weather-temp">{{ weatherData?.temperature }}°C</div>
                <div class="weather-desc">{{ weatherData?.weather }}</div>
              </div>
            </div>
            <div class="weather-details">
              <div class="detail-item">
                <span class="detail-label">湿度</span>
                <span class="detail-value">{{ weatherData?.todayWeather?.humidity }}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">PM2.5</span>
                <span class="detail-value">{{ weatherData?.psPm25 }} μg/m³</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">空气质量</span>
                <span class="detail-value">{{ weatherData?.psPm25Level }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">风向</span>
                <span class="detail-value">{{ weatherData?.windDirection }} {{ weatherData?.windPower }}</span>
              </div>
            </div>
            <div class="weather-update">更新时间：{{ weatherData?.date }}</div>
          </div>
        </div>

        <van-collapse v-model="activeDays">
          <van-collapse-item v-for="(day, index) in tripData.dailyItinerary" :key="index" :title="`第${index + 1}天`"
            :name="index">
            <div class="day-schedule">
              <div class="schedule-section" v-if="day?.morning">
                <div class="section-label morning">上午</div>
                <SpotItem :data="day.morning" />
              </div>

              <div class="schedule-section" v-if="day?.afternoon">
                <div class="section-label afternoon">下午</div>
                <SpotItem :data="day.afternoon" />
              </div>

              <div class="schedule-section" v-if="day?.evening">
                <div class="section-label evening">晚上</div>
                <SpotItem :data="day.evening" />
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>

        <div class="card budget-card" v-if="tripData?.budgetBreakdown">
          <div class="section-title">
            预算明细
          </div>
          <BudgetTable :data="tripData.budgetBreakdown" :total="tripData?.totalBudget || 0" />
        </div>

        <div class="card tips-card" v-if="tripData?.tips && tripData.tips.length">
          <div class="section-title">
            温馨提示
          </div>
          <ul class="tips-list">
            <li v-for="(tip, index) in tripData.tips" :key="index">{{ tip }}</li>
          </ul>
        </div>

        <div class="card warnings-card" v-if="tripData?.warnings && tripData.warnings.length">
          <div class="section-title">
            注意事项
          </div>
          <ul class="warnings-list">
            <li v-for="(warning, index) in tripData.warnings" :key="index">{{ warning }}</li>
          </ul>
        </div>

        <div class="detail-footer" v-if="tripData?.dailyItinerary && tripData.dailyItinerary.length > 0">
          <van-button type="primary" size="large" @click="toChat" round>聊天</van-button>
        </div>
      </template>

      <div v-else>
        <van-empty description="暂无行程数据" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showNotify } from 'vant'
import request from '@/utils/request'
import { debounce } from 'lodash-es'
import SpotItem from '@/componets/SpotItem.vue'
import BudgetTable from '@/componets/BudgetTable.vue'
import { searchCity, getWeather, type WeatherData } from '@/utils/weather'

// 【优化】细化后端返回的行程数据接口，让 TS 了解其内部可能有 undefined 的属性
interface TripDataStructure {
  city?: string
  days?: number
  totalBudget?: number
  dailyItinerary: any[]
  budgetBreakdown?: any
  tips?: string[]
  warnings?: string[]
}

interface RecommendResponse {
  success?: boolean
  result?: TripDataStructure
  error?: string
}

const route = useRoute()
const router = useRouter()

const isloading = ref(true)
const errorMsg = ref('')

const activeDays = ref<number[]>([0])

// 天气状态允许为 null
const weatherData = ref<WeatherData | null>(null)
const weatherLoading = ref(false)

let currentRequest: any = null

const formDate = reactive({
  city: '',
  budget: 0,
  days: 0
})

// 【优化与修复】通过接口类型约束，同时给定完美的初始值，从根本上杜绝模板在挂载初期的 undefined 报错
const tripData = ref<TripDataStructure>({
  city: '',
  days: 0,
  totalBudget: 0,
  dailyItinerary: [],
  tips: [],
  warnings: []
})

onMounted(async () => {
  formDate.city = String(route.query?.city ?? "")
  formDate.budget = Number(route.query?.budget ?? 0)
  formDate.days = Number(route.query?.days ?? 0)

  if (!formDate.city || !formDate.budget || !formDate.days) {
    showNotify('请输入城市、预算和天数')
    isloading.value = false
    return
  }
  getRecomend()
  fetchWeather()
})

const fetchWeather = async () => {
  if (!formDate.city) return

  try {
    weatherLoading.value = true
    const cities = await searchCity(formDate.city)
    // 【安全防护】全面检查数组及属性是否存在
    if (cities && cities.length > 0 && cities[0]?.code) {
      const weather = await getWeather(cities[0].code)
      weatherData.value = weather || null
    }
  } catch (err) {
    console.error('获取天气失败:', err)
  } finally {
    weatherLoading.value = false
  }
}

const getWeatherIcon = (weather: string): string => {
  // 【安全防护】兜底字符串判空
  if (!weather) return '🌤️'
  if (weather.includes('晴')) return '☀️'
  if (weather.includes('云')) return '☁️'
  if (weather.includes('雨')) return '🌧️'
  if (weather.includes('雪')) return '❄️'
  if (weather.includes('雷')) return '⛈️'
  if (weather.includes('雾')) return '🌫️'
  return '🌤️'
}

const toChat = () => {
  router.push({
    path: '/chart', query: {
      scene: 'detail',
      city: formDate.city
    }
  })
}

const fetchRecommend = async () => {
  try {
    errorMsg.value = ''
    isloading.value = true

    const res = await (currentRequest = request.post('/recommend', {
      city: formDate.city,
      budget: formDate.budget,
      days: formDate.days,
    }, { timeout: 300000 })) as RecommendResponse

    console.log('拦截器处理后的响应数据 res:', res)

    if (res && res.success !== false) {
      // 【安全防护】即使接口返回的 result 是空，也通过默认值结构锁死 dailyItinerary 数组
      tripData.value = res.result || { dailyItinerary: [] }
    } else {
      errorMsg.value = res?.error ?? '获取推荐失败'
    }
  } catch (err: any) {
    if (err.message !== '请求已被取消') {
      errorMsg.value = err.message || '网络请求异常，请稍后重试'
      console.error('请求出错:', err)
    }
  } finally {
    currentRequest = null
    isloading.value = false
  }
}

const getRecomend = debounce(fetchRecommend, 300)

const onBack = () => {
  if (currentRequest && typeof currentRequest.cancel === 'function') {
    currentRequest.cancel()
  }
  router.back()
}
</script>
<style scoped>
.page-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.page-content {
  padding-bottom: 140px;
}

.card {
  background: #fff;
  border-radius: 12px;
  margin: 12px 16px;
  padding: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;
}

.overview-card {
  margin-bottom: 16px;
}

.weather-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.weather-card .section-title {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
}

.weather-content {
  padding: 8px 0;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.weather-icon {
  font-size: 48px;
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.weather-temp {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.weather-desc {
  font-size: 14px;
  opacity: 0.8;
  margin-top: 4px;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 12px;
  opacity: 0.7;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
}

.weather-update {
  font-size: 12px;
  opacity: 0.6;
  text-align: right;
}

.trip-collapse {
  margin-bottom: 16px;
}

.budget-card,
.tips-card,
.warnings-card {
  margin-bottom: 16px;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trip-header h2 {
  font-size: 20px;
  color: #323233;
  margin: 0;
}

.trip-budget {
  font-size: 16px;
  color: #ee0a24;
  font-weight: 600;
}

.day-schedule {
  padding: 8px 0;
}

.schedule-section {
  margin-bottom: 16px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 8px;
}

.section-label.morning {
  background: #fff7e6;
  color: #fa8c16;
}

.section-label.afternoon {
  background: #e6f7ff;
  color: #1890ff;
}

.section-label.evening {
  background: #f6ffed;
  color: #52c41a;
}

.detail-footer {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  max-width: 750px;
  margin: 0 auto;
  z-index: 99;
}

.error-card {
  text-align: center;
  padding: 40px 16px;
}

.warnings-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li,
.warnings-list li {
  padding: 8px 0;
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #f5f5f5;
}

.tips-list li:last-child,
.warnings-list li:last-child {
  border-bottom: none;
}
</style>

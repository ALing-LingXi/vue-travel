<template>
  <div class="page-container">
    <van-nav-bar title="天气查询" left-arrow @click="onBack" />

    <div class="page-content">
      <div class="search-section">
        <van-search v-model="searchKeyword" placeholder="输入省份/城市/区县" @update:model-value="handleInput"
          @focus="handleFocus" @blur="handleBlur" class="search-city" />

        <div class="search-list" :class="{ show: showSearchList && searchResults.length }">
          <van-cell-group>
            <van-cell v-for="item in searchResults" :key="item.code" @click="selectLocation(item)">
              <template #icon>
                <van-icon :name="getIconName(item.level)" class="location-icon" />
              </template>
              <template #title>
                <div class="location-title">{{ item.name }}</div>
                <div class="location-full" v-if="item.fullName !== item.name">{{ item.fullName }}</div>
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </div>

      <div class="weather-section" v-if="weatherData">
        <WeatherCard :city-name="selectedCityName" :weather-data="weatherData" />

        <div class="action-buttons">
          <van-button type="primary" plain round @click="handleClear">
            查询其他城市
          </van-button>
        </div>
      </div>

      <div class="hot-cities" v-if="!weatherData">
        <div class="section-title">热门城市</div>
        <van-grid :column-num="4" :gutter="12">
          <van-grid-item v-for="city in hotCities" :key="city.code">
            <div class="city-item" @click="quickSearch(city)">{{ city.name }}</div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { searchCity, getWeather, type CityInfo, type WeatherData } from '@/utils/weather'
import WeatherCard from '@/components/WeatherCard.vue'

interface SearchResult extends CityInfo {
  fullName: string
  level: 'province' | 'city' | 'area'
}

const router = useRouter()

const searchKeyword = ref('')
const searchResults = ref<SearchResult[]>([])
const weatherData = ref<WeatherData | null>(null)
const selectedCityName = ref('')
const showSearchList = ref(false)
let searchTimer: ReturnType<typeof setTimeout> | null = null

const hotCities = [
  { name: '北京', code: '110100' },
  { name: '上海', code: '310100' },
  { name: '广州', code: '440100' },
  { name: '深圳', code: '440300' },
  { name: '成都', code: '510100' },
  { name: '杭州', code: '330100' },
  { name: '西安', code: '610100' },
  { name: '重庆', code: '500100' },
]

const getIconName = (level: string) => {
  const icons: Record<string, string> = {
    province: 'cluster',
    city: 'location',
    area: 'sign'
  }
  return icons[level] || 'location'
}

const handleInput = () => {
  if (searchTimer) clearTimeout(searchTimer)

  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    showSearchList.value = false
    return
  }

  searchTimer = setTimeout(async () => {
    try {
      const results = await searchCity(searchKeyword.value.trim())
      searchResults.value = results.map(item => ({
        ...item,
        fullName: item.name,
        level: item.name.includes('省') ? 'province' :
          item.name.includes('区') || item.name.includes('县') ? 'area' : 'city'
      }))
      showSearchList.value = true
    } catch (err) {
      console.error('搜索失败:', err)
      searchResults.value = []
    }
  }, 300)
}

const handleFocus = () => {
  if (searchKeyword.value.trim() && searchResults.value.length > 0) {
    showSearchList.value = true
  }
}

const handleBlur = () => {
  setTimeout(() => {
    showSearchList.value = false
  }, 300)
}

const selectLocation = async (item: SearchResult) => {
  try {
    const cityName = item.name.split(' - ')[0] || item.name
    selectedCityName.value = cityName
    weatherData.value = await getWeather(item.code)
    searchKeyword.value = cityName
    showSearchList.value = false
    searchResults.value = []
  } catch (err) {
    showToast('获取天气失败，请重试')
    console.error('获取天气失败:', err)
  }
}

const quickSearch = async (city: { name: string; code: string }) => {
  try {
    selectedCityName.value = city.name
    weatherData.value = await getWeather(city.code)
    searchKeyword.value = city.name
  } catch (err) {
    showToast('获取天气失败')
    console.error('获取天气失败:', err)
  }
}

const handleClear = () => {
  searchKeyword.value = ''
  searchResults.value = []
  weatherData.value = null
  showSearchList.value = false
}

const onBack = () => {
  router.back()
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

.search-section {
  position: relative;
  background: #fff;
  padding: 12px 0;
}

.search-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 100;
}

.search-list.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.location-icon {
  margin-right: 8px;
  color: #1989fa;
}

.location-title {
  font-size: 15px;
  color: #323233;
}

.location-full {
  font-size: 12px;
  color: #969799;
  margin-top: 2px;
}

.weather-section {
  padding: 0 16px;
}

.action-buttons {
  margin-top: 16px;
  text-align: center;
}

.hot-cities {
  margin: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 12px;
}

.city-item {
  padding: 12px 8px;
  background: #fff;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: #323233;
  cursor: pointer;
  transition: all 0.3s;
}

.city-item:hover {
  background: #f0f0f0;
}
</style>

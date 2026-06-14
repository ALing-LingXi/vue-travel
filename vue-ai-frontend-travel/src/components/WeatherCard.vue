<template>
  <div class="weather-card">
    <div class="weather-header">
      <van-icon name="location" class="location-icon" />
      <span class="city-name">{{ cityName }}</span>
      <span class="date">{{ weatherData?.dateShort }}</span>
    </div>

    <div class="weather-main">
      <div class="temperature">
        <span class="temp-value">{{ weatherData?.temperature }}</span>
        <span class="temp-unit">°C</span>
      </div>
      <div class="weather-info">
        <div class="weather-desc">{{ weatherData?.weather }}</div>
        <div class="wind">{{ weatherData?.windDirection }} {{ weatherData?.windPower }}</div>
      </div>
    </div>

    <div class="weather-details">
      <div class="detail-item">
        <van-icon name="water" />
        <span>湿度 {{ weatherData?.todayWeather?.humidity }}%</span>
      </div>
      <div class="detail-item">
        <van-icon name="sunrise" />
        <span>日出 {{ weatherData?.todayWeather?.sunriseTime }}</span>
      </div>
      <div class="detail-item">
        <van-icon name="sunset" />
        <span>日落 {{ weatherData?.todayWeather?.sunsetTime }}</span>
      </div>
      <div class="detail-item pm25" :class="pm25Class">
        <van-icon name="warning" />
        <span>PM2.5 {{ weatherData?.psPm25 }} ({{ weatherData?.psPm25Level }})</span>
      </div>
    </div>

    <div class="forecast" v-if="weatherData?.dayForecast?.length">
      <div class="forecast-title">未来天气</div>
      <div class="forecast-list">
        <div 
          v-for="(day, index) in weatherData.dayForecast" 
          :key="index" 
          class="forecast-item"
        >
          <div class="forecast-date">{{ day.dateFormat || day.date }}</div>
          <div class="forecast-weather">{{ day.weather }}</div>
          <div class="forecast-temp">
            <span class="temp-high">{{ day.temDay }}°</span>
            <span class="temp-low">{{ day.temNight }}°</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherData } from '@/utils/weather'

const props = defineProps<{
  cityName: string
  weatherData: WeatherData | null
}>()

const pm25Class = computed(() => {
  const level = props.weatherData?.psPm25Level
  if (level === '优' || level === '良') return 'level-good'
  if (level === '轻度' || level === '中度') return 'level-medium'
  return 'level-bad'
})
</script>

<style scoped>
.weather-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  color: white;
  margin: 12px 16px;
}

.weather-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.location-icon {
  font-size: 16px;
}

.city-name {
  font-size: 16px;
  font-weight: 500;
}

.date {
  margin-left: auto;
  font-size: 14px;
  opacity: 0.8;
}

.weather-main {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.temperature {
  display: flex;
  align-items: flex-start;
}

.temp-value {
  font-size: 48px;
  font-weight: 300;
  line-height: 1;
}

.temp-unit {
  font-size: 20px;
  margin-top: 8px;
}

.weather-info {
  padding-top: 8px;
}

.weather-desc {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
}

.wind {
  font-size: 14px;
  opacity: 0.8;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.detail-item.pm25.level-good {
  color: #a8e6cf;
}

.detail-item.pm25.level-medium {
  color: #ffd3b6;
}

.detail-item.pm25.level-bad {
  color: #ff6b6b;
}

.forecast {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
}

.forecast-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  opacity: 0.9;
}

.forecast-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.forecast-item {
  flex-shrink: 0;
  text-align: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-width: 70px;
}

.forecast-date {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.forecast-weather {
  font-size: 14px;
  margin-bottom: 4px;
}

.forecast-temp {
  font-size: 12px;
}

.temp-high {
  margin-right: 4px;
}

.temp-low {
  opacity: 0.7;
}
</style>

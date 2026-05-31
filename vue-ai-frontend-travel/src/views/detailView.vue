<template>
  <div class="page-container">
    <div class="page-header">
      <van-nav-bar left-arrow @click="onBack" :title="formDate.city + '行程详情'" />
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
            <h2>{{ tripData.city }} · {{ tripData.days }}天行程</h2>
            <div class="trip-budget">预算：{{ tripData.totalBudget }}元</div>
          </div>
        </div>
        <van-collapse v-model="activeDays">
          <van-collapse-item v-for="(day, index) in tripData.dailyItinerary" :key="index" :title="`第${index + 1}天`"
            :name="index">
            <div class="day-schedule">
              <div class="schedule-section">
                <div class="section-label morning">上午</div>
                <SpotItem :data="day.morning" />
              </div>

              <div class="schedule-section">
                <div class="section-label afternoon">下午</div>
                <SpotItem :data="day.afternoon" />
              </div>

              <div class="schedule-section">
                <div class="section-label evening">晚上</div>
                <SpotItem :data="day.evening" />
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>

        <!-- v-if="collapse" -->
        <div class="card budget-card" v-if="tripData.budgetBreakdown">
          <div class="section-title">
            预算明细
          </div>
          <BudgetTable :data="tripData.budgetBreakdown" :total="tripData.totalBudget" />
        </div>

        <div class="card tips-card" v-if="tripData.tips && tripData.tips.length">
          <div class="section-title">
            温馨提示
          </div>
          <ul class="tips-list">
            <li v-for="(tip, index) in tripData.tips" :key="index">{{ tip }}</li>
          </ul>
        </div>

        <div class="card warnings-card" v-if="tripData.warnings && tripData.warnings.length">
          <div class="section-title">
            注意事项
          </div>
          <ul class="warnings-list">
            <li v-for="(warning, index) in tripData.warnings" :key="index">{{ warning }}</li>
          </ul>
        </div>

        <div class="detail-footer" v-if="tripData.dailyItinerary && tripData.dailyItinerary.length > 0">
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

interface RecommendResponse {
  success?: boolean
  result?: {
    dailyItinerary: any[]
    [key: string]: any
  }
  error?: string
}

const route = useRoute()
const router = useRouter()

const isloading = ref(true)
const errorMsg = ref('')

// 【修复 1】定义折叠面板所需的双向绑定变量，默认展开第一天 [0]
const activeDays = ref<number[]>([0])

const formDate = reactive({
  city: '',
  budget: 0,
  days: 0
})

// 【优化】初始化具体的结构，避免 template 报 undefined 错误
const tripData = ref<{ dailyItinerary: any[];[key: string]: any }>({ dailyItinerary: [] })

onMounted(async () => {
  formDate.city = String(route.query.city ?? "")
  formDate.budget = Number(route.query.budget ?? "")
  formDate.days = Number(route.query.days ?? "")

  if (!formDate.city || !formDate.budget || !formDate.days) {
    showNotify('请输入城市、预算和天数')
    isloading.value = false
    return
  }
  getRecomend()
})

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

    // 发送请求，此时 res 是业务层对象（内含 success 和 data 属性）
    const res = await request.post('/recommend', {
      city: formDate.city,
      budget: formDate.budget,
      days: formDate.days,
    }) as RecommendResponse

    console.log('拦截器处理后的响应数据 res:', res)

    // 【修复 2】结合你的拦截器，正确拆解数据层次
    if (res && res.success !== false) {
      tripData.value = res.result || { dailyItinerary: [] }
    } else {
      errorMsg.value = res?.error ?? ''
    }
  } catch (err: any) {
    // 捕获 HTTP 错误或拦截器 reject 的错误
    errorMsg.value = err.message || '网络请求异常，请稍后重试'
    console.error('请求出错:', err)
  } finally {
    isloading.value = false
  }
}

// 【优化】防抖改为 300ms（2000ms 太长会导致页面加载极度滞后，误以为卡死）
const getRecomend = debounce(fetchRecommend, 300)

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

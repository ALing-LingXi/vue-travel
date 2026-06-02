import axios from 'axios'
import { showNotify, showFailToast } from 'vant'
import { getToken, handleTokenExpired } from './auth'
import router from '@/router'

const itheimaApi = axios.create({
  baseURL: 'https://hmajax.itheima.net',
  timeout: 30000,
})

itheimaApi.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

itheimaApi.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data
    if (code === 10000 || (code === undefined && data !== undefined)) {
      return data
    }
    showNotify(message || '请求失败')
    return Promise.reject(new Error(message || 'Error'))
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        handleTokenExpired()
        showFailToast('登录已过期，请重新登录')
        router.push('/auth')
        return Promise.reject(error)
      }

      showNotify(data?.message || error.message || '请求失败')
    } else {
      showNotify('网络错误，请稍后重试')
    }
    return Promise.reject(error)
  },
)

export default itheimaApi

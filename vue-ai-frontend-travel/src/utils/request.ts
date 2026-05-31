import axios from "axios";
import { showNotify } from 'vant'
const request = axios.create({
  baseURL: 'http://localhost:4000/api/travel',
  timeout:  60000,
})
request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
request.interceptors.response.use(
  response => {
    if(response.status === 200){
      return response.data
    }
    showNotify(response.data.message || '请求失败')
    return Promise.reject(new Error(response.data.message || 'Error'));
  },
  error => {
    return Promise.reject(error)
  }
)
request.get = (url, config) => {
  return request({
    method: 'get',
    url,
    ...config
  })
}
request.post = (url, data) => {
  return request({
    method: 'post',
    url,
    data
  })
}
export default request

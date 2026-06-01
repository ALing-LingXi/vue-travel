import axios from 'axios'
import { showNotify } from 'vant'
const request = axios.create({
  baseURL: 'http://localhost:4000/api/travel',
  timeout: 60000,
})
request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data
    }
    showNotify(response.data.message || '请求失败')
    return Promise.reject(new Error(response.data.message || 'Error'))
  },
  (error) => {
    return Promise.reject(error)
  },
)
request.get = (url, config) => {
  return request({
    method: 'get',
    url,
    ...config,
  })
}
request.post = (url, data, config = {}) => {
  const source = axios.CancelToken.source()
  const cancel = () => source.cancel('请求已被取消')

  const promise = request({
    method: 'post',
    url,
    data,
    cancelToken: source.token,
    ...config,
  }) as any

  promise.cancel = cancel
  return promise
}

export default request

// 1. 统一全局基准路径为 localhost
const BASE_URL = 'http://localhost:4000/api/travel'

export function fetchStream(
  url: string,
  data: any,
  onChunk: (data: string) => void,
  onComplete: () => void,
  onError: (err: any) => void,
) {
  const controller = new AbortController()

  const runFetch = async () => {
    try {
      // 2. 这里严格使用统一的 BASE_URL，不要再手动写死 127.0.0.1
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP 错误! 状态码: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法读取响应流（Response body is null）')
      }

      const decoder = new TextDecoder()
      let isCompleted = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          if (!isCompleted) {
            isCompleted = true
            onComplete()
          }
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter((line) => line.trim())

        for (const line of lines) {
          try {
            if (line.startsWith('data:')) {
              const jsonStr = line.replace(/^data:\s*/, '')

              if (jsonStr.trim() === '[DONE]') {
                if (!isCompleted) {
                  isCompleted = true
                  onComplete()
                }
                break
              }

              // 修复：尝试解析 JSON，如果失败则作为普通文本处理
              try {
                const JSONData = JSON.parse(jsonStr)
                if (JSONData.type === 'chunk') {
                  onChunk(JSONData.data)
                } else if (JSONData.done) {
                  if (!isCompleted) {
                    isCompleted = true
                    onComplete()
                  }
                } else if (JSONData.error) {
                  onError(JSONData.error)
                }
              } catch {
                // 如果不是有效 JSON，检查是否是结束标记
                if (jsonStr.trim() === '"end"' || jsonStr.trim() === 'end') {
                  if (!isCompleted) {
                    isCompleted = true
                    onComplete()
                  }
                } else {
                  // 否则直接将内容作为文本片段传递
                  onChunk(jsonStr)
                }
              }
            }
          } catch (error: any) {
            onError(new Error(`JSON 解析失败: ${error.message}`))
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('流式请求已被用户主动取消')
      } else {
        onError(error)
      }
    }
  }

  runFetch()

  return () => {
    controller.abort()
  }
}
// export async function fetchStream(url, data, onChunk, onComplete, onError) {
//   const controller = new AbortController()
//   try {
//     const response = await fetch(`http://127.01.01:4000/api/travel${url}`, {
//       method: 'post',
//       body: JSON.stringify(data),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       signal: controller.signal,
//     })
//     const reader = response.body?.getReader()
//     const decoder = new TextDecoder()
//     while (true) {
//       const { done, value } = await reader.read()
//       if (done) {
//         onComplete()
//         break
//       }
//       const chunk = decoder.decode(value, { stream: true })
//       const lines = chunk.split('\n').filter((line) => line.trim())
//       for (const line of lines) {
//         console.log(line)
//         try {
//           if (line.startsWith('data:')) {
//             const jsonStr = line.substring(6)
//             const JSONData = JSON.parse(jsonStr)
//             if (JSONData.type === 'chunk') {
//               onChunk(JSONData.data)
//             } else if (JSONData.done) {
//               onComplete()
//             } else if (JSONData.error) {
//               onError(JSONData.error)
//             }
//           }
//         } catch (error) {
//           onError(error)
//         }
//       }
//     }
//   } catch (error) {
//     onError(error)
//   }
// }

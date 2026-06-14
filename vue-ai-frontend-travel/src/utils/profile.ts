import itheimaApi from './itheima-api'

// 个人信息类型
export interface ProfileData {
  avatar?: string
  nickname?: string
  email?: string
  gender?: 0 | 1
  desc?: string
}

// 本地缓存键名
const PROFILE_CACHE_KEY = 'travel_profile_cache'

/**
 * 获取缓存的个人信息
 */
export function getCachedProfile(creator: string): ProfileData | null {
  try {
    const cacheStr = localStorage.getItem(PROFILE_CACHE_KEY)
    if (!cacheStr) return null
    const cache = JSON.parse(cacheStr)
    // 检查是否是当前用户的数据
    if (cache.creator === creator && cache.data) {
      return cache.data
    }
    return null
  } catch (e) {
    console.log(e);

    return null
  }
}

/**
 * 保存个人信息到本地缓存
 */
export function saveCachedProfile(creator: string, data: ProfileData): void {
  try {
    localStorage.setItem(
      PROFILE_CACHE_KEY,
      JSON.stringify({
        creator,
        data,
        timestamp: Date.now(),
      }),
    )
  } catch (e) {
    console.error('缓存个人信息失败:', e)
  }
}

/**
 * 清除个人信息缓存
 */
export function clearCachedProfile(): void {
  localStorage.removeItem(PROFILE_CACHE_KEY)
}

/**
 * 获取个人信息
 * @param creator 用户外号
 */
export async function getProfile(creator: string): Promise<ProfileData> {
  const result = (await itheimaApi.get('/api/settings', {
    params: { creator },
  })) as any
  return result
}

/**
 * 修改个人信息
 * @param data 个人信息数据
 */
export async function updateProfile(data: {
  creator: string
  nickname: string
  email: string
  gender: 0 | 1
  desc: string
}): Promise<ProfileData> {
  const result = (await itheimaApi.put('/api/settings', data)) as any
  return result
}

/**
 * 修改个人头像
 * @param file 头像文件
 * @param creator 用户外号
 */
export async function updateAvatar(file: File, creator: string): Promise<{ avatar: string }> {
  const formData = new FormData()
  formData.append('avatar', file)
  formData.append('creator', creator)

  const result = (await itheimaApi.put('/api/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })) as any
  return result
}

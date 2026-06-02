import itheimaApi from './itheima-api'

// 个人信息类型
export interface ProfileData {
  avatar?: string
  nickname?: string
  email?: string
  gender?: 0 | 1
  desc?: string
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

import itheimaApi from './itheima-api'

// 用户信息类型
export interface UserInfo {
  username?: string
  id?: number
  account?: string
  token?: string
  avatar?: string
  desc?: string
  email?: string
  gender?: 0 | 1
}

// localStorage 存储键名
const STORAGE_KEYS = {
  USER_INFO: 'travel_user_info',
  TOKEN: 'travel_token',
  IS_LOGGED_IN: 'travel_is_logged_in',
}

/**
 * 注册接口
 * @param username 用户名（中英文和数字组成，最少 8 位）
 * @param password 密码（最少 6 位）
 */
export async function register(username: string, password: string): Promise<UserInfo> {
  const result = (await itheimaApi.post('/api/register', {
    username,
    password,
  })) as any
  return result
}

/**
 * 登录接口
 * @param username 用户名（中英文和数字组成，最少 8 位）
 * @param password 密码（最少 6 位）
 */
export async function login(username: string, password: string): Promise<UserInfo> {
  const result = (await itheimaApi.post('/api/login', {
    username,
    password,
  })) as any

  if (result) {
    const token = result.token || `token_${Date.now()}`
    const userData = { ...result, token }
    saveUserInfo(userData)
    saveToken(token)
  }

  return result
}

/**
 * 保存用户信息到 localStorage
 */
export function saveUserInfo(userInfo: UserInfo): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true')
  } catch (e) {
    console.error('保存用户信息失败:', e)
  }
}

/**
 * 从 localStorage 读取用户信息
 */
export function getUserInfo(): UserInfo | null {
  try {
    const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO)
    return userInfoStr ? JSON.parse(userInfoStr) : null
  } catch (e) {
    console.error('读取用户信息失败:', e)
    return null
  }
}

/**
 * 保存 token
 */
export function saveToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true')
  } catch (e) {
    console.error('保存token失败:', e)
  }
}

/**
 * 获取 token
 */
export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

/**
 * 检查用户是否已登录
 */
export function isLoggedIn(): boolean {
  return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true' && !!getToken()
}

/**
 * 登出
 */
export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_INFO)
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN)
}

/**
 * 处理 token 过期
 */
export function handleTokenExpired(): void {
  logout()
}

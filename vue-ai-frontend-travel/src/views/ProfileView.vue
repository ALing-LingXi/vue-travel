<template>
  <div class="profile-container">
    <van-nav-bar title="我的" left-text="" />

    <!-- 用户信息区域 -->
    <div class="user-info">
      <van-image :src="userAvatar" round fit="cover" class="avatar" />
      <div class="user-details">
        <h2 class="user-name">{{ displayName }}</h2>
        <p class="user-desc">
          {{ userDesc || (isLoggedIn ? '欢迎回来！' : '欢迎使用智能旅游助手') }}
        </p>
      </div>
    </div>

    <!-- 登录/登出按钮 -->
    <div class="auth-btn-section" v-if="!isLoggedIn">
      <van-button type="primary" round size="large" @click="goLogin">登录 / 注册</van-button>
    </div>
    <div class="logout-section" v-else>
      <van-button type="danger" plain round size="large" @click="handleLogout" class="logout-btn">
        <van-icon name="arrow-left" /> 退出登录
      </van-button>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <h3 class="menu-title">我的服务</h3>
      <van-cell-group>
        <van-cell title="我的收藏" is-link :icon="'star-o'" @click="showToast('功能开发中')" />
        <van-cell title="历史记录" is-link :icon="'history'" @click="showToast('功能开发中')" />
        <van-cell title="设置" is-link :icon="'settings'" @click="goSettings" />
      </van-cell-group>
    </div>

    <!-- 关于我们 -->
    <div class="menu-section">
      <h3 class="menu-title">关于</h3>
      <van-cell-group>
        <van-cell title="关于我们" is-link @click="showAboutDialog" />
        <van-cell title="版本信息" value="v1.0.0" />
      </van-cell-group>
    </div>

    <!-- 关于我们对话框 -->
    <van-dialog v-model:show="aboutDialogVisible" title="关于我们" show-cancel-button>
      <div class="about-content">
        <p>智能旅游助手 v1.0.0</p>
        <p class="mt-2">基于 AI 技术的智能旅游规划平台</p>
        <p class="mt-2">为您提供个性化的旅游行程推荐和实时旅游咨询服务</p>
        <p class="mt-4 text-center">© 2024 智能旅游助手</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { isLoggedIn as checkIsLoggedIn, getUserInfo, logout } from '@/utils/auth'
import { getProfile, getCachedProfile, saveCachedProfile, clearCachedProfile } from '@/utils/profile'

const router = useRouter()

const defaultAvatar = 'https://img.yzcdn.cn/vant/cat.jpeg'
const userInfo = ref<any>(null)
const userAvatar = ref(defaultAvatar)
const userDesc = ref('')

const aboutDialogVisible = ref(false)

const isLoggedIn = computed(() => checkIsLoggedIn())

const displayName = computed(() => {
  if (userInfo.value) {
    return userInfo.value.username || userInfo.value.account || '用户'
  }
  return '游客'
})

const loadUserInfo = async () => {
  userInfo.value = getUserInfo()
  if (userInfo.value) {
    // 先使用本地存储的头像和描述
    userAvatar.value = userInfo.value.avatar || defaultAvatar
    userDesc.value = userInfo.value.desc || ''

    const creator = userInfo.value.username || userInfo.value.account
    if (creator) {
      // 优先从本地缓存读取，立即显示
      const cachedProfile = getCachedProfile(creator)
      if (cachedProfile) {
        userAvatar.value = cachedProfile.avatar || userAvatar.value
        userDesc.value = cachedProfile.desc || userDesc.value
      }

      // 后台请求最新数据并更新缓存
      try {
        const profile = await getProfile(creator)
        if (profile) {
          userAvatar.value = profile.avatar || userAvatar.value
          userDesc.value = profile.desc || userDesc.value
          // 保存到本地缓存
          saveCachedProfile(creator, profile)
        }
      } catch (err) {
        console.log('获取远程个人信息失败', err)
      }
    }
  }
}

onMounted(loadUserInfo)

const showAboutDialog = () => {
  aboutDialogVisible.value = true
}

const goLogin = () => {
  router.push('/auth')
}

const goSettings = () => {
  router.push('/settings')
}

const handleLogout = () => {
  logout()
  clearCachedProfile()
  userInfo.value = null
  userAvatar.value = defaultAvatar
  userDesc.value = ''
  showToast('已退出登录')
  router.push('/auth')
}
</script>

<style scoped>
.profile-container {
  padding-bottom: 50px;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #1989fa 0%, #36cbcb 100%);
  color: white;
}

.avatar {
  width: 80px;
  height: 80px;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.user-details {
  margin-left: 20px;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}

.user-desc {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.auth-btn-section {
  padding: 16px;
}

.logout-section {
  padding: 16px;
}

.logout-btn {
  border-width: 1px;
  border-color: #ee0a24;
  color: #ee0a24;
  font-weight: 500;
}

.menu-section {
  margin-top: 15px;
  background-color: white;
  border-radius: 12px;
  margin: 15px 10px 0;
  overflow: hidden;
}

.menu-title {
  font-size: 14px;
  color: #646566;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.about-content {
  text-align: center;
  line-height: 1.6;
}

.mt-2 {
  margin-top: 8px;
}

.mt-4 {
  margin-top: 16px;
}

.text-center {
  text-align: center;
}
</style>

<template>
  <div class="auth-container">
    <div class="auth-header">
      <div class="logo-wrapper">
        <svg class="logo-icon" viewBox="0 0 1024 1024" width="48" height="48">
          <path
            d="M855.529472 430.700544l-97.599488-39.602176-61.452288-122.76736c-3.61472-3.960832-7.22944-7.921664-7.22944-11.880448-3.61472-3.960832-3.61472-3.960832-7.22944-7.921664-25.30304-27.721728-61.452288-31.68256-93.984768-15.84128l-169.895936 63.363072c-14.460928 3.960832-25.305088 19.802112-28.919808 35.641344l-14.45888 146.528256c-3.61472 23.760896 14.45888 47.52384 36.1472 51.484672l3.61472 0c21.68832 0 39.763968-15.84128 39.763968-39.604224l10.84416-114.845696 65.067008-23.760896c-10.84416 27.721728-21.68832 55.443456-28.919808 75.24352-14.45888 35.641344-14.45888 83.165184 3.61472 122.76736l-112.060416 285.136896c-10.84416 27.721728 0 63.36512 25.305088 75.245568 10.84416-3.960832 18.0736 0 25.30304 0 21.68832 0 39.763968-11.880448 46.99136-35.641344l83.140608-205.932544c50.608128 99.006464 108.443648 213.854208 108.443648 217.812992 10.84416 19.802112 28.919808 31.68256 46.99136 31.68256 7.22944 0 18.0736-3.960832 25.305088-7.919616 25.30304-15.84128 36.1472-51.482624 21.68832-79.204352-3.61472-7.921664-90.372096-186.13248-148.207616-293.05856l50.608128-122.76736 18.0736 35.641344c3.61472 11.880448 14.460928 15.84128 21.68832 19.802112l112.060416 47.52384c3.61472 0 10.84416 3.960832 14.45888 3.960832 18.0736 0 32.53248-11.880448 39.763968-31.68256C888.061952 466.343936 877.217792 438.622208 855.529472 430.700544L855.529472 430.700544z"
            fill="#1989fa" />
          <path
            d="M666.546176 209.184768c46.682112 0 85.583872-38.90176 85.583872-85.583872 0-46.682112-38.90176-85.583872-85.583872-85.583872s-85.583872 38.90176-85.583872 85.583872C580.962304 170.283008 619.864064 209.184768 666.546176 209.184768L666.546176 209.184768z"
            fill="#1989fa" />
          <path
            d="M473.99936 606.181376l-21.561344-8.173568c13.586432-44.457984-8.280064-87.097344-48.846848-102.475776-40.566784-15.378432-85.202944 2.050048-104.501248 44.345344l-21.465088-8.136704c-19.902464-7.544832-43.016192 0.13312-50.76992 20.588544l-45.119488 119.023616c-7.753728 20.455424 2.740224 46.065664 22.642688 53.610496l196.374528 74.440704c19.902464 7.544832 41.795584-5.787648 49.549312-26.24512l45.119488-119.023616C503.175168 633.679872 493.901824 613.726208 473.99936 606.181376L473.99936 606.181376 473.99936 606.181376zM245.68832 722.581504l-15.347712-5.818368 61.2864-161.675264 15.347712 5.818368L245.68832 722.581504 245.68832 722.581504zM397.611008 511.305728c32.104448 12.169216 50.122752 44.32896 39.479296 80.883712l-122.652672-46.495744C330.698752 511.270912 365.508608 499.136512 397.611008 511.305728L397.611008 511.305728 397.611008 511.305728zM383.807488 774.938624l-15.347712-5.818368 61.2864-161.675264 15.347712 5.818368L383.807488 774.938624L383.807488 774.938624z"
            fill="#1989fa" />
        </svg>
      </div>
      <h1>希希出行</h1>
      <p>智能旅游助手</p>
    </div>

    <van-tabs v-model:active="activeTab" class="auth-tabs">
      <van-tab title="登录">
        <div class="form-wrapper">
          <van-form ref="loginFormRef" @submit="handleLogin">
            <van-cell-group inset>
              <van-field v-model="loginForm.username" name="username" label="用户名" placeholder="请输入用户名"
                :rules="[{ required: true, message: '请输入用户名' }]" />
              <van-field v-model="loginForm.password" type="password" name="password" label="密码" placeholder="请输入密码"
                :rules="[{ required: true, message: '请输入密码' }]" />
            </van-cell-group>

            <div class="form-hint">
              <p>用户名需为中英文和数字组成，最少8位</p>
            </div>

            <van-button type="primary" round size="large" native-type="submit" :loading="loginLoading" class="auth-btn">
              登录
            </van-button>
          </van-form>
        </div>
      </van-tab>

      <van-tab title="注册">
        <div class="form-wrapper">
          <van-form ref="registerFormRef" @submit="handleRegister">
            <van-cell-group inset>
              <van-field v-model="registerForm.username" name="username" label="用户名" placeholder="请输入用户名"
                :rules="[{ required: true, message: '请输入用户名' }]" />
              <van-field v-model="registerForm.password" type="password" name="password" label="密码" placeholder="请输入密码"
                :rules="[{ required: true, message: '请输入密码' }]" />
              <van-field v-model="registerForm.confirmPassword" type="password" name="confirmPassword" label="确认密码"
                placeholder="请再次输入密码" :rules="[{ required: true, message: '请输入确认密码' }]" />
            </van-cell-group>

            <div class="form-hint">
              <p>用户名需为中英文和数字组成，最少8位</p>
              <p>密码需为最少6位</p>
            </div>

            <van-button type="primary" round size="large" native-type="submit" :loading="registerLoading"
              class="auth-btn">
              注册
            </van-button>
          </van-form>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { login, register } from '@/utils/auth'

const router = useRouter()

const activeTab = ref(0)
const loginLoading = ref(false)
const registerLoading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

const loginFormRef = ref()
const registerFormRef = ref()

function validateUsername(username: string): boolean {
  const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
  return username.length >= 8 && usernameRegex.test(username)
}

function validatePassword(password: string): boolean {
  return password.length >= 6
}

async function handleLogin() {
  try {
    await loginFormRef.value?.validate()

    if (!validateUsername(loginForm.username)) {
      showToast('用户名格式不正确，最少8位')
      return
    }
    if (!validatePassword(loginForm.password)) {
      showToast('密码最少6位')
      return
    }

    loginLoading.value = true
    await login(loginForm.username, loginForm.password)
    showSuccessToast('登录成功')
    router.replace('/')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loginLoading.value = false
  }
}

async function handleRegister() {
  try {
    await registerFormRef.value?.validate()

    if (!validateUsername(registerForm.username)) {
      showToast('用户名格式不正确，最少8位')
      return
    }
    if (!validatePassword(registerForm.password)) {
      showToast('密码最少6位')
      return
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      showToast('两次密码输入不一致')
      return
    }

    registerLoading.value = true
    await register(registerForm.username, registerForm.password)
    showSuccessToast('注册成功，请登录')
    activeTab.value = 0
    loginForm.username = registerForm.username
    loginForm.password = registerForm.password
    registerForm.username = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    registerLoading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 40px;
}

.auth-header {
  text-align: center;
  padding: 50px 20px 30px;
  background: linear-gradient(135deg, #1989fa 0%, #36cbcb 100%);
}

.logo-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #fff;
  border-radius: 50%;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo-icon {
  display: block;
}

.auth-header h1 {
  font-size: 26px;
  color: #fff;
  margin: 0 0 6px 0;
  font-weight: 600;
}

.auth-header p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.auth-tabs {
  background: #fff;
}

.auth-tabs :deep(.van-tabs__nav) {
  background: #fff;
}

.auth-tabs :deep(.van-tab) {
  font-size: 15px;
  color: #646566;
  flex: none;
  padding: 0 30px;
}

.auth-tabs :deep(.van-tab--active) {
  color: #1989fa;
  font-weight: 500;
}

.auth-tabs :deep(.van-tabs__line) {
  background: #1989fa;
  width: 20px;
}

.auth-tabs :deep(.van-tabs__wrap) {
  justify-content: center;
}

.form-wrapper {
  padding: 16px;
  background: #f7f8fa;
  min-height: calc(100vh - 220px);
}

.form-wrapper :deep(.van-cell-group--inset) {
  margin: 0;
  border-radius: 12px;
}

.form-hint {
  padding: 12px 16px 20px;
}

.form-hint p {
  font-size: 12px;
  color: #969799;
  margin: 4px 0;
}

.auth-btn {
  margin-top: 8px;
}
</style>

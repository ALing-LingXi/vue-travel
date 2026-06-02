<template>
  <div class="settings-container">
    <van-nav-bar title="个人信息" left-arrow @click="onBack" />

    <!-- 用户头像 -->
    <div class="card">
      <div class="section-title">头像设置</div>
      <div class="avatar-section">
        <van-image :src="userForm.avatar" round fit="cover" class="avatar" />
        <van-uploader :after-read="onAvatarUpload" :max-count="1">
          <van-button type="primary" size="small" :loading="uploadingAvatar">
            更换头像
          </van-button>
        </van-uploader>
      </div>
    </div>

    <!-- 基本信息 -->
    <div class="card">
      <van-cell-group inset>
        <van-field v-model="userForm.nickname" label="昵称" placeholder="请输入昵称" :disabled="isSubmitting" />
        <van-field v-model="userForm.email" label="邮箱" placeholder="请输入邮箱" type="email" :disabled="isSubmitting" />
        <van-field name="gender" label="性别">
          <template #input>
            <van-radio-group v-model="userForm.gender" direction="horizontal">
              <van-radio :name="0">男</van-radio>
              <van-radio :name="1">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-model="userForm.desc" label="简介" type="textarea" placeholder="请输入个人简介" rows="2" autosize
          :disabled="isSubmitting" />
      </van-cell-group>
    </div>

    <!-- 账号信息 -->
    <div class="card">
      <van-cell-group inset>
        <van-cell title="账号" :value="userForm.account" />
        <van-cell title="用户ID" :value="userForm.id" />
      </van-cell-group>
    </div>

    <!-- 保存按钮 -->
    <div class="save-section">
      <van-button type="primary" size="large" round :loading="isSubmitting" @click="saveSettings"
        :disabled="!hasChanges">
        保存修改
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getUserInfo, saveUserInfo } from '@/utils/auth'
import { getProfile, updateProfile, updateAvatar } from '@/utils/profile'

const router = useRouter()

// 表单数据
const userForm = reactive({
  id: '',
  account: '',
  nickname: '',
  email: '',
  gender: 0 as 0 | 1,
  desc: '',
  avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
})

// 原始数据（用于检测变化）
const originalForm = reactive({
  nickname: '',
  email: '',
  gender: 0 as 0 | 1,
  desc: '',
  avatar: '',
})

// 状态
const isSubmitting = ref(false)
const uploadingAvatar = ref(false)

// 获取 creator（用户外号）
const getCreator = () => {
  const info = getUserInfo()
  return info?.username || info?.account || ''
}

// 检测是否有修改
const hasChanges = computed(() => {
  return (
    userForm.nickname !== originalForm.nickname ||
    userForm.email !== originalForm.email ||
    userForm.gender !== originalForm.gender ||
    userForm.desc !== originalForm.desc ||
    userForm.avatar !== originalForm.avatar
  )
})

// 生命周期
onMounted(async () => {
  const info = getUserInfo()
  if (info) {
    userForm.id = String(info.id || '')
    userForm.account = info.account || ''
    userForm.nickname = info.username || ''

    const creator = getCreator()
    if (creator) {
      try {
        const profile = await getProfile(creator)
        if (profile) {
          userForm.nickname = profile.nickname || userForm.nickname
          userForm.email = profile.email || ''
          userForm.gender = profile.gender ?? 0
          userForm.desc = profile.desc || ''
          userForm.avatar = profile.avatar || userForm.avatar
        }
      } catch (err) {
        console.log('获取远程个人信息失败，使用本地数据', err)
      }
    }

    originalForm.nickname = userForm.nickname
    originalForm.email = userForm.email
    originalForm.gender = userForm.gender
    originalForm.desc = userForm.desc
    originalForm.avatar = userForm.avatar
  }
})

// 返回
const onBack = () => {
  router.back()
}

// 头像上传
const onAvatarUpload = async (file: any) => {
  const creator = getCreator()
  if (!creator) {
    showToast('用户信息异常，请重新登录')
    return
  }

  uploadingAvatar.value = true
  try {
    const result = await updateAvatar(file.file, creator)
    userForm.avatar = result.avatar
    showToast('头像上传成功')
  } catch (err) {
    showToast('头像上传失败')
    console.error('头像上传失败:', err)
  } finally {
    uploadingAvatar.value = false
  }
}

// 保存设置
const saveSettings = async () => {
  if (!hasChanges.value) return

  const creator = getCreator()
  if (!creator) {
    showToast('用户信息异常，请重新登录')
    return
  }

  if (!userForm.nickname.trim()) {
    showToast('请输入昵称')
    return
  }
  if (!userForm.email.trim()) {
    showToast('请输入邮箱')
    return
  }

  isSubmitting.value = true

  try {
    await updateProfile({
      creator,
      nickname: userForm.nickname,
      email: userForm.email,
      gender: userForm.gender,
      desc: userForm.desc,
    })

    // 更新本地存储
    const info = getUserInfo()
    if (info) {
      saveUserInfo({
        ...info,
        username: userForm.nickname,
        avatar: userForm.avatar,
        desc: userForm.desc,
        email: userForm.email,
        gender: userForm.gender,
      })
    }

    // 更新原始数据
    originalForm.nickname = userForm.nickname
    originalForm.email = userForm.email
    originalForm.gender = userForm.gender
    originalForm.desc = userForm.desc
    originalForm.avatar = userForm.avatar

    showToast('保存成功')
  } catch (err) {
    showToast('保存失败，请重试')
    console.error('保存设置失败:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.settings-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 100px;
}

.card {
  background: #fff;
  border-radius: 12px;
  margin: 12px 16px;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 16px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border: 2px solid #eee;
}

.save-section {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  max-width: 750px;
  margin: 0 auto;
}

.save-section .van-button {
  width: 100%;
}
</style>

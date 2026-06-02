import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn } from '@/utils/auth'

const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/auth',
    component: () => import('@/views/AuthView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/chart',
    component: () => import('@/views/ChartView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/detail',
    component: () => import('@/views/detailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/weather',
    component: () => import('@/views/WeatherView.vue'),
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const isAuthPage = to.path === '/auth'

  if (requiresAuth) {
    if (isLoggedIn()) {
      next()
    } else {
      next('/auth')
    }
  } else if (isAuthPage) {
    if (isLoggedIn()) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

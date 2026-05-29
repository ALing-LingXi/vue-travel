import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/chart',
    component: () => import('@/views/ChartView.vue'),
  },
  {
    path: '/profile',
    component: () => import('@/views/ProfileView.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router

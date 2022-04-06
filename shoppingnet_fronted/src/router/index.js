import { createRouter, createWebHistory } from 'vue-router'
import login from '../components/content/login.vue'

const routes = [
  {path: '/',redirect:'/login'},
  {path: '/login',component:login}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

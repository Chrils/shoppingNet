import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/content/login.vue'

Vue.use(Router)

const routes = [
  {path: '/',redirect:'/login'},
  {path: '/login',component:login}
]

export default new Router({
	routes: routes
})


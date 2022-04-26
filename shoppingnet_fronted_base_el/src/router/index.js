import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {path: '/',redirect:'/login'},
  {path: '/login',component:()=>import('../views/admin/login.vue')},
  {
      path: '/home',
      component:()=>import('../views/admin/home.vue'),
      redirect: '/welcome',
      children:[
          {path: '/welcome',component:()=>import('../views/admin/welcome.vue')},
          {path: '/user/list',component:()=>import('../views/admin/user/userList.vue')},
          {path: '/rights/list',component:()=>import('../views/admin/power/rights.vue')},
          {path: '/roles/list',component:()=>import('../views/admin/power/roles.vue')},
          {path: '/goods/categories',component:()=>import('../views/admin/goods/Cate.vue')},
          {path: '/goods/params',component:()=>import('../views/admin/goods/Params')},
          {path: '/goods/list',component:()=>import('../views/admin/goods/Goods.vue')},
          {path: '/goods/add',component:()=>import('../views/admin/goods/Add.vue')},
          {path: '/goods/edit',component:()=>import('../views/admin/goods/Edit.vue')},
      ]},
]

const router = new Router({
    routes: routes,
    mode: 'history'
})

/**
 * 挂载路由守卫
 * @param to 跳转路由
 * @param from 上一个路由
 * @param next 执行跳转
 *          next() 不做任何操作
 *          next('/login') 强制跳转到登录页面
 */
router.beforeEach(((to, from, next) => {
    if (to.path === '/login') {
        return next()
    }
    if (sessionStorage.getItem('token')) {
        return next()
    }
    next('/login')
}))

export default router


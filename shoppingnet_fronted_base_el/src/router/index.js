import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {path: '/',redirect:'/mall'},
  {path: '/login',component:()=>import('../views/admin/login.vue')},
  {
      path: '/home',
      component:()=>import('../views/admin/home.vue'),
      redirect: '/data/stat',
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
          {path: '/order/list',component:()=>import('../views/admin/order/order.vue')},
          {path: '/order/detail/:order_no',component:()=>import('../views/admin/order/detail.vue')},
          {path: '/data/stat',component:()=>import('../views/admin/data/stat.vue')},
      ]
  },
  {
      path: '/mall',
      component:()=>import('../views/client/Mall.vue'),
      redirect: '/mall/index',
      children:[
          {path: '/mall/index',component:()=>import('../views/client/mall/index.vue')},
          {path: '/mall/goods/:goods_id',component:()=>import('../views/client/mall/goods.vue')},
          {path: '/mall/cart',component:()=>import('../views/user/mall/cart.vue')},
          {path: '/mall/order',component:()=>import('../views/user/mall/order.vue')},
          {path: '/mall/order/detail/:order_no',component:()=>import('../views/user/mall/orderDetail.vue')},
          {path: '/mall/order/pay/:order_no',component:()=>import('../views/user/mall/pay.vue')},
          {path: '/mall/profile',component:()=>import('../views/user/mall/profile.vue')},
          {path: '/mall/search',component:()=>import('../views/client/mall/search.vue')},
      ]
  }
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
    if (to.path === '/login' || to.path === '/mall/index' || to.path === '/mall/goods' || to.path === '/mall/cart' || to.path === '/mall/order' || to.path === '/mall/order/detail/:order_no' || to.path === '/mall/order/pay/:order_no' || to.path === '/mall/profile' || to.path === '/mall/search') {
        return next()
    }
    if (sessionStorage.getItem('token')) {
        return next()
    }
    next('/login')
}))

export default router


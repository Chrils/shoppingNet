import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/base.css'

Vue.use(Element)

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

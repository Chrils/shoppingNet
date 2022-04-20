import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/base.css'
import axios from "axios";
import TreeTable from 'vue-table-with-tree-grid';

axios.defaults.baseURL = 'http://localhost:9999/';
// 为每次请求添加请求头，防止跨域问题
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});

Vue.use(Element)
Vue.component('tree-table',TreeTable)
Vue.prototype.$http = axios;

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

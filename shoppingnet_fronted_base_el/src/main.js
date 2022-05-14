import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/base.css'
import axios from "axios";
import TreeTable from 'vue-table-with-tree-grid';
import moment from "moment";
import VueQuillEditor from "vue-quill-editor";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//导入nprogress插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = 'http://localhost:9999/';
// 为每次请求添加请求头，防止跨域问题
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});

axios.interceptors.response.use(config => {
  NProgress.done()
  return config;
});

Vue.use(Element)
Vue.use(VueQuillEditor)
Vue.component('tree-table',TreeTable)
Vue.prototype.$http = axios;
Vue.prototype.$moment = moment;
Vue.$refresh = () => {
  window.location.reload()
}

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

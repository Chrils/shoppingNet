import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/base.css'
import axios from "axios";

axios.defaults.baseURL = 'http://127.0.0.1:9999/';

Vue.use(Element)
Vue.prototype.$http = axios;

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

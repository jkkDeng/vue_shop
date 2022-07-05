import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
import api from './request/api.js'
import ZkTable from 'vue-table-with-tree-grid'
/* import axios from 'axios'

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 通过axios请求拦截器 添加token 保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须 return
  return config;
}, err => {
  // 对请求错误做些什么
  return Promise.reject(err);
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, err => {
  // 对响应错误做点什么
  return Promise.reject(err);
});

Vue.prototype.$http = axios */

Vue.prototype.$api = api

// 阻止你显示显示生产模式的消息
Vue.config.productionTip = false

Vue.component('zk-table',ZkTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


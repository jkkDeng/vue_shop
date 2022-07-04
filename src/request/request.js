// 对axios封装

import axios from 'axios'

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

// 整体导出
export default axios
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import axiosHttp from './http'
import axios from 'axios'
// import VueAxios from 'vue-axios'
import router from './router/index'
import 'jquery'
import qs from 'qs'
import Zuche from './Zuche'
import '@/assets/css/reset.css'

//请求数据库链接
import {urls} from './js/Url';
import {orderUrls} from './js/orderUrl';
import store from "./store/store";

// Vue.use(VueAxios,axios);
Vue.use(qs);

Vue.config.productionTip = false;

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.$axios = axios;

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = false;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.baseURL = 'http://localhost:8080'; //本地环境
axios.defaults.baseURL = 'http://new.api.db.glchuxingwang.com';  //测试环境

// http request 拦截器
// let root = process.env.BASE_API;
axios.interceptors.request.use(
  config => {
    // config.url = root + config.url;
    if (store.state.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = 'token ${store.state.token}'
    }
    return config
  },
  err => {
    return Promise.reject(err)
  },
);

Vue.mixin({
  data: function () {
    return {
      urls: urls,  //将请求的链接全局混合进 vue 的实例中
      orderUrls: orderUrls
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // axiosHttp,
  router,
  components: { Zuche },
  template: '<Zuche/>'
})

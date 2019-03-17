/**
 * Created by superman on 17/2/16.
 * http配置
 */

import axios from 'axios'
import store from './store/store'
// import * as types from './store/types'
import router from './router'

router.beforeEach((to, from, next) => { //路由加载前
  let userName = sessionStorage.getItem('u-n');
  const token = store.state.token ? store.state.token : window.localStorage.getItem('token');  //获取本地存储的token
  if (to.meta.requireAuth) {
    if (token || userName === '' || userName ===undefined || userName === null) {
      next();
    }else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}   //将跳转的路由path作为参数，登录成功后跳转到该路
      })
    }
  }else {
    next();
  }
});
router.afterEach((to, from) => { //路由加载后

});
 你先别改，这边配置应该 没错，我检 查一下nginx服务器转发有没有问题
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.baseURL = 'http://localhost:8080'; //本地环境

// var baseURL = 'http://192.168.36.11:8098';  //测试环境   你写改回去原来的域 名，我看一下
var baseURL = 'http://new.api.db.glchuxingwang.com';  //测试环境

axios.defaults.baseURL_sales=baseURL+'/sales';//销售子系统
axios.defaults.baseURL_system=baseURL+'/system'; //系统设置模块
axios.defaults.baseURL_product=baseURL+'/driver'; //司机子系统
axios.defaults.baseURL_customer=baseURL+'/customer'; //客户子系统
axios.defaults.baseURL_financial=baseURL+'/financial'; //结算子系统
axios.defaults.baseURL_vehicle=baseURL+'/vehicle'; //车辆子系统

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = 'token ${store.state.token}'
    }
    return config
  },
  err => {
    return Promise.reject(err)
  },
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    response.headers = {
      'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
    };
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          store.commit(types.LOGOUT)

          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.path !== '/login' &&
            router.replace({
              path: '/login',
              query: { redirect: router.currentRoute.fullPath },
            })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  },
)

export default axios

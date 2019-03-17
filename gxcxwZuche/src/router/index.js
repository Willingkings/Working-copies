import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/store.js'

Vue.use(VueRouter);

//导入子页面组件
import Indexd from '../ivews/index'
import Driver from '../ivews/driver'
import Cooperation from '../ivews/cooperation'
import About from '../ivews/about'
import Interface from '../ivews/interface/interface'
//登陆/注册
// import Register from './ivews/register'
import Login from '../ivews/logins/login'
import LoginEmployee from '../ivews/logins/login-employee'
import Regist from '../ivews/logins/regist'
//忘记密码
import Password from '../ivews/logins/password'
//用车页面
import CarIndex from '../ivews/carsteps/carIndex'
import OneDayCar from '../ivews/carsteps/oneDayCar'
import MultiDayCar from '../ivews/carsteps/multiDayCar'
import OneWayCar from '../ivews/carsteps/oneWayCar'
import ReturmWayCar from '../ivews/carsteps/returmWayCar'
//申请审核
import ApplyDriver from '../ivews/apply/applyDriver'
import ApplyCooperation from '../ivews/apply/applyCooperation'
//新闻资讯
import NewList from '../ivews/newList/newList'
//订单中心
import Order from '../ivews/order/order'
import Information from '../ivews/order/information'
import MyOrder from '../ivews/order/myOrder'
import AccountSettings from '../ivews/order/accountSettings'
import MyAccount from '../ivews/order/myAccount'
import MyNews from '../ivews/order/myNews'
import Commonly from '../ivews/order/commonly'
import HelpCenter from '../ivews/order/helpCenter'
import Feedback from '../ivews/order/feedback'
//订单详情
import OrderDalies from '../ivews/order/orderDalies'
//定金支付
import PayCode from '../ivews/payCode'

const routes = [ //路由地址
  { path: '/', name: 'indexZhu', component: resolve => require(['@/ivews/index'], resolve), meta: { isUseCache: false } },
  // { path: '/register', component: Register },
  { path: '/carIndex', component: CarIndex, redirect: '/carIndex/carTypes',
    children: [
      { path: 'oneDayCar', component: OneDayCar, meta:{requireAuth: true} },
      { path: 'multiDayCar', component: MultiDayCar, meta:{requireAuth: true} },
      { path: 'oneWayCar', component: OneWayCar, meta:{requireAuth: true} },
      { path: 'returmWayCar', component: ReturmWayCar, meta:{requireAuth: true} }
    ]
  },
  { path: '/login', component: Login },
  { path: '/login/password', component: Password },
  { path: '/loginEmployee', component: LoginEmployee },
  { path: '/regist', component: Regist },
  { path: '/driver', component: Driver },
  { path: '/driver/applyDriver', component: ApplyDriver, meta:{requireAuth: true} },
  { path: '/cooperation', component: Cooperation },
  { path: '/cooperation/applyCooperation', component: ApplyCooperation, meta:{requireAuth: true} },
  { path: '/newList', component: NewList, redirect: '/newList/newest',
    children: [
      { path: 'newest', name: 'newest', component: resolve => require(['@/ivews/newList/newest'], resolve), meta: { isUseCache: false } },
      { path: 'newest/dalies', name: 'newestDalies', component: resolve => require(['@/ivews/newList/newestDalies'], resolve) },
      { path: 'travel', component: resolve => require(['@/ivews/newList/travel'], resolve) },
      { path: 'company', component: resolve => require(['@/ivews/newList/company'], resolve) }
    ]
  },
  { path: '/about', component: About },
  { path: '/interface', component: Interface, redirect: '/interface/index',
    children: [
      { path: 'index', component: resolve => require(['@/ivews/interface/index'], resolve) },
      { path: 'zhinan', component: resolve => require(['@/ivews/interface/zhinan'], resolve) },
      { path: 'apiShouce', component: resolve => require(['@/ivews/interface/apiShouce'], resolve) },
      { path: 'question', component: resolve => require(['@/ivews/interface/question'], resolve) },
      { path: 'contact', component: resolve => require(['@/ivews/interface/contact'], resolve) },
      { path: 'website', component: resolve => require(['@/ivews/interface/website'], resolve) },
    ]
  },
  { path: '/order', name: 'order', component: Order, redirect: '/order/myOrder',
    children: [
      { path: 'information', component: Information },
      { path: 'myOrder', name: 'myOrder', component: resolve => require(['@/ivews/order/myOrder'], resolve), meta: { isUseCache: false } },
      { path: 'myOrder/dalies', name: 'orderDalies', component: resolve => require(['@/ivews/order/orderDalies'], resolve) },
      { path: 'accountSettings', component: AccountSettings },
      { path: 'myAccount', component: MyAccount },
      { path: 'myNews', component: MyNews, meta:{requireAuth: true} },
      { path: 'commonly', component: Commonly },
      { path: 'helpCenter', component: HelpCenter },
      { path: 'feedback', component: Feedback, meta:{requireAuth: true} }
    ]
  },
  { path: '/payCode', component: PayCode }
];

// 页面刷新时，重新赋值token
if (window.sessionStorage.getItem('token')) {
    store.commit("SET_TOKEN", window.sessionStorage.getItem('token'))
}

const router = new VueRouter({ //路由实例
  mode: "history",
  linkActiveClass: 'active',
  routes
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(r => r.meta.requireAuth)) { // 判断该路由是否需要登录权限
    if(sessionStorage.getItem("isLogin")) { // 通过vuex state获取当前的token是否存在
      next();
    }else{
      next({
        path: '/',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }else{
    next();
  }
});

export default router;

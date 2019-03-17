<template>
  <div id="app">
    <!-- 头部导航 -->
    <header class="header" :class="{ 'header-fixed' : headerFixed }">
      <div class="logoMenuBox">
        <div class="logo">
          <router-link :to="{path: '/'}">
            <img class="logoZhu" src="../src/assets/images/chuxingwang-logo.png" alt="">
          </router-link>
          <img class="logoTable" src="../src/assets/images/chuxingwan-label.png" alt="">
        </div>
        <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select=""
                 active-text-color="#FE4A54" :router="true" @select="handleSelect">
          <el-menu-item index="/">首页</el-menu-item>
          <el-submenu index="/carIndex" class="iconfont">
            <template slot="title">
              <span>配驾租车</span>
            </template>
            <el-menu-item index="/carIndex/oneDayCar">单日用车</el-menu-item>
            <el-menu-item index="/carIndex/multiDayCar">多日用车</el-menu-item>
            <el-menu-item index="/carIndex/oneWayCar">单程用车</el-menu-item>
            <el-menu-item index="/carIndex/returmWayCar">往返用车</el-menu-item>
          </el-submenu>
          <!--<el-menu-item index="3">商务专车</el-menu-item>-->
          <!--<el-menu-item index="/login">企业服务</el-menu-item>-->
          <el-menu-item index="/driver">司机招募</el-menu-item>
          <el-menu-item index="/cooperation">加盟合作</el-menu-item>
          <el-menu-item index="/newList">新闻资讯</el-menu-item>
          <el-menu-item index="/about">关于我们</el-menu-item>
          <el-menu-item index="/interface">开发接口</el-menu-item>
        </el-menu>
        <div class="head-btn-group">
          <el-dropdown trigger="click" @command="userCommand" v-if="userName">
            <span class="el-dropdown-link">{{userName}}<i
              class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown" class="ulIndex">
              <el-dropdown-item command="/order/information">个人资料</el-dropdown-item>
              <el-dropdown-item command="/order/myOrder">我的订单</el-dropdown-item>
              <el-dropdown-item command="/order/myNews">我的消息</el-dropdown-item>
              <el-dropdown-item command="/order/accountSettings">账号设置</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span v-if="userName" @click="logOut">退出</span>
          <span v-if="!userName" class="border" @click="login">登录</span>
          <span v-if="!userName" class="red" @click="registerClick">注册</span>
        </div>
      </div>
    </header>
    <div v-show="headerFixed" style="position: relative;height: 74px;width: 100%;"></div>

    <keep-alive>
      <router-view v-if="isRouterAlive"/>
    </keep-alive>

    <v-login v-show="isShowLogin" @on-loginClose="closeLogin" @on-handLogin="handLogin" @on-tologin="tologin" @on-toEmploye="toEmloye" @on-toRegist="toRegist"
    ></v-login>
  </div>
</template>

<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import loginIndex from "@/components/loginIndex"
import store from '@/store/store.js'

Vue.use(ElementUI);

export default {
  name: 'Zuche',
  components: {
    'v-login': loginIndex
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true,
      isLogin: false,
      headerFixed: true,
      isShowLogin: false,
      userName: sessionStorage.getItem('memberName'),
      loginName: sessionStorage.getItem('loginName'),
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
        this.userName = sessionStorage.getItem('memberName');
        this.loginName = sessionStorage.getItem('loginName');
      })
    },
    handleSelect() {
      this.isShowLogin = false;
    },
    login: function() {
      this.isShowLogin = !this.isShowLogin;
    },
    closeLogin: function() {
      this.isShowLogin = false;
      this.userName = sessionStorage.getItem('memberName');
    },
    handLogin: function() {
      this.isShowLogin = false;
    },
    tologin: function() {
      this.isShowLogin = false;
    },
    toEmloye() {
      this.isShowLogin = false;
    },
    toRegist() {
      this.isShowLogin = false;
    },
    //跳转到注册页
    registerClick: function() {
      this.isShowLogin = false;
      this.$router.push({ path: '/regist' });
    },
    //登陆后头部右边显示个人信息
    userCommand: function(command) {
      this.$router.replace(command);
    },
    //登出清除cookies
    logOut() {
      let flag = true;
      if (flag) {
        this.userName = '';
        this.$router.push('/');
        store.commit('logout',false);
        window.sessionStorage.removeItem('memberName', '');
        window.sessionStorage.removeItem('memberId', '');
        window.sessionStorage.removeItem('userType', '');
        window.sessionStorage.removeItem('loginName', '');
        window.sessionStorage.removeItem('token', '');
        this.$message.success('退出成功');
      }
    },
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Arial", "Microsoft YaHei";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
header{
  z-index: 1000;
  transition: all 0.5s ease;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
}
header.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
.logoMenuBox {
  width: 1300px;
  margin: 0 auto;
  height: 74px;
  .el-menu--horizontal{
  float: left;
  border: none;
}
  .el-menu--horizontal>.el-menu-item,.el-menu--horizontal>.el-submenu .el-submenu__title{
    height: 74px;
    line-height: 84px;
    font-size: 15px;
    margin: 0 16px;
    padding: 0;
    color: #1B2B3B;
    border-top: 2px solid transparent;
    border-bottom: none !important;
  }
  .el-menu--horizontal>.el-menu-item.is-active,.el-menu--horizontal>.el-submenu.is-active .el-submenu__title{
    border-top: 2px solid #FE4A54;
    border-bottom: none !important;
  }
  .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
  .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,.el-menu--horizontal>.el-submenu
  .el-submenu__title:hover {
    color: #FE4A54;
    border-top: 2px solid #FE4A54;
    border-bottom: none !important;
  }
  .el-menu--horizontal>.el-submenu .el-submenu__title a {
    color: #1B2B3B;
  }
  .el-menu--horizontal>.el-submenu .el-submenu__title:hover a {
    color: #FE4A54;
  }
  .el-submenu__title i{
    display: none;
  }
  .el-submenu__title::before{
    content: '\e62e';
    font-size: 23px;
    height: 0;
    line-height: 2.2;
    display: block;
    text-align: center;
  }
}
.logo {
  float: left;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: left;
  -ms-flex-pack: left;
  justify-content: left;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.head-btn-group {
  height: 74px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .el-dropdown {
    font-size: 16px;
    span {
      width: 120px;
      color: #FE4A54;
      .el-icon--right {
        background: #FE4A54;
        color: #fff;
      }
    }
  }
  .el-dropdown:focus {
    outline-width: 0;
  }
  span {
    display: inline-block;
    width: 120px;
    padding: 8px 0;
    margin: 9px 0 0 16px;
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
  }
  span.border {
    border: 2px solid #FE4A54;
  }
  span.red {
    border: 2px solid #FE4A54;
    background: #FE4A54;
    color: #fff;
  }
}
ul.ulIndex .el-dropdown-menu__item:focus, ul.ulIndex .el-dropdown-menu__item:not(.is-disabled):hover {
  color: #FE4A54;
  background-color: #f7f2f2;
}
//分步样式
.step {
  .el-step__icon {
    width: 36px;
    height: 36px;
  }
  .el-step.is-horizontal .el-step__line {
    top: 17px;
  }
  .el-step__head.is-finish {
    color: #fff;
    border-color: #FE4A54;
  }
  .el-step__icon.is-text {
    background-color: #FE4A54;
  }
  .el-step__title.is-finish {
    color: #333;
    margin-top: 20px;
    font-size: 20px;
  }
  .el-step__head.is-process, .el-step__head.is-wait {
    color: #fff;
    border-color: #999;
    .el-step__icon.is-text {
      background-color: #999;
    }
  }
  .el-step__title.is-process, .el-step__title.is-wait {
    color: #999;
    font-size: 20px;
    margin-top: 20px;
    font-weight: normal;
  }
}
@media only screen and (max-width: 1200px){
  .logoMenuBox {
    height: 60px;
    .logoZhu {
      height: 30px;
    }
    .logoTable {
      height: 60px;
    }
  }
  .logoMenuBox .el-menu--horizontal > .el-menu-item, .logoMenuBox .el-menu--horizontal > .el-submenu
  .el-submenu__title {
    height: 60px;
    line-height: 66px;
  }
  .logoMenuBox .el-submenu__title::before {
    line-height: 1.4;
  }
  .head-btn-group {
    height: 60px;
    span {
      margin: 5px 0 0 10px;
    }
  }
}
</style>

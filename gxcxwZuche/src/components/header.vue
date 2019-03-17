<template>
  <div>
    <!-- 头部导航 -->
    <header class="header" :class="{ 'header-fixed' : headerFixed }">
      <div class="logoMenuBox">
        <div class="logo">
          <img src="../../src/assets/images/chuxingwang-logo.png" alt="">
          <img src="../../src/assets/images/chuxingwan-label.png" alt="">
        </div>
        <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="" active-text-color="#FE4A54" :router="true" menu-trigger="click">
          <el-menu-item index="/">首页</el-menu-item>
          <el-submenu index="/carIndex" class="iconfont">
            <template slot="title">配驾租车</template>
            <el-menu-item index="/carIndex/oneDayCar">单日用车</el-menu-item>
            <el-menu-item index="/carIndex/multiDayCar">多日用车</el-menu-item>
            <el-menu-item index="/carIndex/oneWayCar">单程用车</el-menu-item>
            <el-menu-item index="/carIndex/returmWayCar">返程用车</el-menu-item>
          </el-submenu>
          <!--<el-menu-item index="3">商务专车</el-menu-item>-->
          <el-menu-item index="/login">企业服务</el-menu-item>
          <el-menu-item index="/driver">司机招募</el-menu-item>
          <el-menu-item index="/cooperation">加盟合作</el-menu-item>
          <el-menu-item index="/about">关于我们</el-menu-item>
          <el-menu-item index="/interface">开发接口</el-menu-item>
        </el-menu>
        <div class="head-btn-group">
          <el-dropdown trigger="click" @command="userCommand" v-if="userName">
            <span class="el-dropdown-link">{{userName}}<i
              class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
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

    <v-login v-show="isShowLogin" @on-loginClose="closeLogin">
      <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm">
        <div class="phone">
          <label for="">手机号</label>
          <el-form-item prop="phoneNum">
            <select name="" id="">
              <option value="86">中国+86</option>
              <option value="8600">中国+8600</option>
            </select>
            <el-input name="phoneNum" type="text" v-model="loginForm.phoneNum" autoComplete="on"></el-input>
          </el-form-item>
        </div>
        <div class="code">
          <label for="">验证码</label>
          <el-form-item prop="verifyNum">
            <el-input name="verifyNum" type="text" v-model="loginForm.verifyNum" oninput="if(value.length>6)value=value.slice(0,6)" autoComplete="on"></el-input>
          </el-form-item>
          <input @click="sendSmsCode" class="submit-confirm" type="button" v-model="btnContent" v-bind="{'disabled':disabled}">
        </div>
        <button class="loginBtn" @click.stop.prevent="tologin(loginForm)">登录</button>
        <el-form-item prop="loginRead" class="read">
          <el-radio name="loginRead" class="redRadio" v-model="loginForm.loginRead" value="loginRead"> 点击登录，即表示您同意 <span style="color:#FE4A54">《用户协议》</span></el-radio>
        </el-form-item>
      </el-form>
    </v-login>
  </div>
</template>

<script>
  import loginIndex from "@/components/loginIndex"
  import md5 from 'js-md5'
  import store from '@/store/store.js'

  export default {
    components: {
      'v-login': loginIndex
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value.trim().length<1) {
          callback(new Error('用户名不能为空'))
        } else {
          callback()
        }
      };
      const validateVerifyNum = (rule, value, callback) => {
        if (value.trim().length<1) {
          callback(new Error('验证码不能为空'))
        } else {
          callback()
        }
      };
      return {
        isLogin: false,
        headerFixed: true,
        isShowLogin: false,
        userName: sessionStorage.getItem('memberName'),
        loginForm: {
          phoneNum: "", //输入手机号
          verifyNum: "", //验证码
          loginRead: true
        },
        loginRules: {
          phoneNum: [{required: true, trigger: 'blur', validator: validateUsername}],
          verifyNum: [{required: true, trigger: 'blur', validator: validateVerifyNum}],
        },
        btnContent: "获取验证码", //获取验证码按钮内文字
        time: 0, //发送验证码间隔时间
        disabled: false, //按钮状态

      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      login: function() {
        this.isShowLogin = !this.isShowLogin;
      },
      closeLogin: function() {
        this.isShowLogin = false;
      },
      //跳转到注册页
      registerClick: function() {
        this.$router.push({ path: '/regist' });
      },
      //登陆后头部右边显示个人信息
      userCommand: function(command) {
        this.$router.replace(command);
      },
      //验证码校验
      sendSmsCode() {
        let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/; //手机号正则验证
        let phoneNum = this.loginForm.phoneNum;
        if(!phoneNum) { //未输入手机号
          this.$message.error('请输入手机号码');
          return;
        }
        if(!reg.test(phoneNum)) { //手机号不合法
          this.$message.error('您输入的手机号码不合法，请重新输入');
        }
        this.time = 60;
        this.timer();
        this.getCode(phoneNum);
      },
      //获取验证码
      getCode(mobileNo) {
        //获取验证码请求  用一下这个看看能不能调过去
        var qs = require('qs');
        this.axios.post('http://test.api.member.glchuxingwang.com/common/sms/send',qs.stringify({
          mobileNo: mobileNo,
          type: Number(6),
          version: '1',
          platform: '1',
          sign: md5(md5(mobileNo + 'glcxw2017@ugiant2017@!~#*'))
        })).then((response) => {
          console.log(response.body);
        }).catch(error => {
          console.log('请求失败：' + error);
        });
        // $.ajax({
        //   url: "http://192.168.0.101:16800/common/sms/send",
        //   dataType: 'json',
        //   type: 'get',
        //   data: {
        //     mobileNo: mobileNo,
        //     type: 6,  // 1 是注册  6 是验证码登录
        //     version: '1', // 两个都不能为空
        //     platform: 'db',
        //     sign: md5(md5(mobileNo + "glcxw2017@ugiant2017@!~#*"))
        //   },
        //   success: function (response){
        //     console.log(response.body);
        //   }
        // });
      },
      //短信60s重新获取验证码
      timer() {
        if(this.time > 0) {
          this.time --;
          this.btnContent = this.time + "s后重新获取";
          this.disabled = true;
          let timer = setTimeout(this.timer, 1000);
        } else if(this.time == 0) {
          this.btnContent = "获取验证码";
          clearTimeout(timer);
          this.disabled = false;
        }
      },
      // 验证成功跳转到登入界面
      tologin(loginForm) {
        this.$refs.loginForm.validate(valid => {
          if (valid && !this.loginForm.loginRead) {
            var qs = require('qs');
            let _this = this;
            this.axios.post('http://192.168.36.11:8098/api/v1/user/login',qs.stringify({
                loginName: this.loginForm.phoneNum,
                loginType: Number(2),
                code: this.loginForm.verifyNum
              })
            ).then(function (response) {
              let res = response.data;
              // console.log(json);
              if (res.code == '200') {
                _this.isShowLogin = false;
                _this.$message.success('登录成功');
                store.commit('isLogin',true);
                store.commit('newUserName', res.data.memberName);
                store.commit('GetPhone', res.data.loginName);
                store.commit('newMemberId', res.data.memberId);
                store.commit('SET_USERTYPE', res.data.userType);
                store.commit('SET_TOKEN', res.data.token);
                _this.userName = res.data.memberName;
                _this.$router.push('/order');
              }else {
                if (res.message == '验证码未填写') {
                  _this.$message.error('必需输入手机号或验证码');
                }else if (res.message == '验证码错误') {
                  _this.$message.error('登录失败,手机号或验证码错误');
                }
              }
            }).catch(function (err) {
              _this.$message.error('登录失败，错误: '+ err);
            })
          } else {
            return false
          }
        })
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
          window.sessionStorage.removeItem('loginName', '');
          window.sessionStorage.removeItem('token', '');
        }
      },
    }
  }
</script>

<style lang="scss">
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
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,.el-menu--horizontal>.el-submenu .el-submenu__title:hover {
      color: #FE4A54;
      border-top: 2px solid #FE4A54;
      border-bottom: none !important;
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
        width: 106px;
        color: #FE4A54;
        .el-icon--right {
          background: #FE4A54;
          color: #fff;
        }
      }
    }
    span {
      display: inline-block;
      width: 120px;
      padding: 8px 0;
      margin: 9px 0 0 16px;
      border-radius: 2px;
      text-align: center;
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
  ul .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
    color: #FE4A54;
    background-color: #f7f2f2;
  }
</style>

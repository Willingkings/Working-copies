<template>
    <div class="loginHeiPic clearfix">
        <div class="loginWid">
            <div class="loginbox">
                <div class="cont">
                    <h1 class="loginText">登录</h1>
                    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
                           id="login">
                        <el-form-item prop="phoneNum">
                            <el-input type="text" v-model="loginForm.phoneNum" autoComplete="on"
                                      placeholder="请输入用户名或手机号码"/>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <div class="auto">
                            <el-checkbox class="redCheck"> 30天内自动登录 </el-checkbox>
                            <router-link :to="{path:'/login/password'}" class="col">忘记密码</router-link>
                        </div>
                        <el-form-item class="btn">
                            <el-button type="primary" style="width:100%;" :loading="loading"
                                       @click.native.prevent="handleLogin(loginForm)">立即登陆</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="footTxt">
                        <router-link :to="{path: '/loginEmployee'}">员工加入企业</router-link>
                        <span class="xian"></span>
                        <router-link :to="{path: '/regist'}">申请企业账户</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from '@/store/store.js'
import { validatePhone, validatePass } from "../../js/validate";

export default {
  inject: ['reload'], //注入依赖
  data() {
    return {
      loginForm: {
        phoneNum: '',
        password: ''
      },
      loginRules: {
        phoneNum: [{ required: true, trigger: 'change', validator: validatePhone }],
        password: [{ required: true, trigger: 'change', validator: validatePass }]
      },
      loading: false
    }
  },
  methods: {
    // 验证成功跳转到登入界面
    handleLogin(loginForm) {
      let _this = this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let _this = this;
          let url = 'http://new.api.db.glchuxingwang.com/customer/api/v1/user/login';
          $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data: {
              loginName: this.loginForm.phoneNum,
              password: this.loginForm.password,
              loginType: Number(1)
            },
            success: function (response) {
              let res = response;
              if (res.code == '200') {
                _this.$message.success('登录成功!');
                store.commit('isLogin',true);
                store.commit('newUserName', res.data.memberName);
                store.commit('GetPhone', res.data.loginName);
                store.commit('newMemberId', res.data.memberId);
                store.commit('SET_USERTYPE', res.data.userType);
                store.commit('SET_TOKEN', res.data.token);
                _this.$router.push('/');
                _this.reload();
              } else {
                _this.$message.error('登录失败，输入密码错误');
              }
            },
            error: function (error) {
              _this.$message.error('登录失败，错误: '+ error);
            }
          })
        } else {
          console.log('error submit!!');
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.loginHeiPic {
    position: fixed;
    width: 100%;
    height: 100%;
    background: url('../../assets/images/loginbg.png') no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
    margin-top: -74px;
}
.loginWid {
    width: 1300px;
    margin: 0 auto;
    position: relative;
}
.loginbox {
    width: 500px;
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -46%);
    transform: translate(-50%, -46%);
    .cont {
        width: 400px;
        padding: 16px 0;
        margin: 0 auto;
        input {
            width: 100%;
            border: 1px solid #ebebeb;
            border-radius: 20px;
            color: #999;
            padding: 10px 20px;
            box-sizing: border-box;
        }
        .loginText {
            font-size: 30px;
            text-align: center;
            padding: 10px 0 20px;
        }
        .auto {
            color: #999;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
        }
        .btn button {
            width: 100%;
            border: 1px solid #ff2b35;
            background: #ff2b35;
            font-size: 16px;
            color: #fff;
            border-radius: 20px;
            padding: 10px 20px;
            margin: 10px 0;
        }
    }
    .col {
        color: #ff2b35;
    }
    .footTxt {
        margin: 24px 0 14px;
        text-align: center;
        line-height: 1.4;
        a {
            color: #999;
            padding-bottom: 2px;
            border-bottom: 1px solid #777;
        }
        .xian {
            width: 1px;
            height: 26px;
            background: #BDBDBD;
            margin: -6px 20px;
            display: inline-block;
        }
    }
}
</style>

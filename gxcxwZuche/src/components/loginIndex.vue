<template>
    <transition name="login-fade">
        <div class="loginCent" @click="loginClose">
            <div class="content" @click.stop>
                <div class="headText clearfix">
                    <span v-for="(item, index) in loginTabs" :class="{active: index === tabIndex}" @click="toggleTabs(index)">{{item}}</span>
                </div>
                <div class="body">
                  <div v-show="tabIndex === 0" class="cont">
                    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm">
                      <el-form-item prop="phoneNum">
                        <el-input type="text" v-model="loginForm.phoneNum" autoComplete="on" placeholder="请输入用户名或手机号码"/>
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
                      <b @click="toEmploye">员工加入企业</b>
                      <span class="xian"></span>
                      <b @click="toRegist">申请企业账户</b>
                    </div>
                  </div>

                  <div v-show="tabIndex=== 1">
                    <el-form autoComplete="on" :model="codeForm" :rules="codeRules" ref="codeForm" label-position="left">
                      <el-form-item label="手机号" class="phone">
                        <el-form-item prop="phoneNum">
                          <el-select v-model="codeForm.blNum" placeholder="中国+86">
                            <el-option label="中国+86" value="86"></el-option>
                            <el-option label="中国+8600" value="8600"></el-option>
                          </el-select>
                          <el-input name="phoneNum" type="text" v-model="codeForm.phoneNum" autoComplete="on"></el-input>
                        </el-form-item>
                      </el-form-item>
                      <el-form-item label="验证码" class="code">
                        <el-form-item prop="verifyNum" class="codeChild">
                          <el-input name="verifyNum" type="text" v-model="codeForm.verifyNum" oninput="if(value.length>6)value=value.slice(0,6)" autoComplete="on"></el-input>
                        </el-form-item>
                        <input @click="sendSmsCode" class="submit-confirms" ref="code" type="button"
                               v-model="btnContent"
                               v-bind="{'disabled':disabled}">
                      </el-form-item>
                      <button class="loginBtn" @click.stop.prevent="tologin(codeForm)">登录</button>
                      <el-form-item prop="loginRead" class="read">
                        <el-checkbox class="redCheck" v-model="codeForm.loginRead" value="loginRead"></el-checkbox>
                        点击登录，即表示您同意 <a href="#" style="color:#FE4A54">《用户协议》</a>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import store from '@/store/store.js'
import md5 from 'js-md5'
import { validatePhone, validatePass, validateVerifyNum } from "../js/validate";

export default {
  inject: ['reload'], //注入依赖
  data() {
    return {
      show: false,
      loginTabs: ["账号密码登录", "手机号码登录"],
      tabIndex: 0,
      loginForm: {
        phoneNum: '',
        password: ''
      },
      loginRules: {
        phoneNum: [{ required: true, trigger: 'change', validator: validatePhone }],
        password: [{ required: true, trigger: 'change', validator: validatePass }]
      },
      loading: false,
      codeForm: {
        blNum: "",
        phoneNum: "", //输入手机号
        verifyNum: "", //验证码
        loginRead: false
      },
      codeRules: {
        phoneNum: [{ required: true, trigger: 'change', validator: validatePhone }],
        verifyNum: [{ required: true, trigger: 'change', validator: validateVerifyNum }],
      },
      btnContent: "获取验证码", //获取验证码按钮内文字
      time: 0, //发送验证码间隔时间
      disabled: false, //按钮状态
    }
  },
  methods: {
    toEmploye() {
      this.$router.push({
        path: '/loginEmployee'
      });
      this.$emit('on-toEmploye');
    },
    toRegist() {
      this.$router.push({
        path: '/regist'
      });
      this.$emit('on-toRegist');
    },
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
                _this.$emit('on-handLogin');
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
    },
    loginClose: function() {
      this.$emit('on-loginClose');
    },
    toggleTabs(index) {
      this.tabIndex = index;
    },
    //验证码校验
    sendSmsCode() {
      let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/; //手机号正则验证
      let phoneNum = this.codeForm.phoneNum;
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
      let _this = this;
      $.ajax({
        type: 'post',
        url: 'http://test.api.member.glchuxingwang.com/common/sms/send',
        dataType: 'json',
        data: {
          mobileNo: mobileNo,
          type: Number(6),  // 验证码登录为 6
          version: '1',   // 两个都不能为空
          platform: '1',
          sign: md5(md5(mobileNo + 'glcxw2017@ugiant2017@!~#*'))
        },
        success: function (response) {
          let res = response;
          console.log(res);
          if (res.msg === '发送成功') {
            _this.$message.success('发送成功');
          } else if (res.msg === '发送失败') {
            _this.$message.error('发送失败');
          } else if (res.msg === '该手机号码已经注册！') {
            _this.$message.error('该手机号码已经注册！')
          }
        },
        // error: function (error) {
        //   _this.$message.error('请求失败：' + error);
        // }
      })
    },
    //短信60s重新获取验证码
    timer() {
      if(this.time > 0) {
        this.time --;
        this.btnContent = this.time + "s后重新获取";
        this.$refs.code.style.color = '#999';
        this.$refs.code.style.background = '#ddd';
        this.$refs.code.style.border = '1px solid #ddd';
        this.disabled = true;
        setTimeout(this.timer, 1000);
      } else {
        this.btnContent = "获取验证码";
        this.$refs.code.style.color = '#DE5C56';
        this.$refs.code.style.background = '#fff';
        this.$refs.code.style.border = '1px solid #DE5C56';
        clearTimeout(this.timer);
        this.disabled = false;
      }
    },
    // 验证成功跳转到登入界面
    tologin(codeForm) {
      this.$refs.codeForm.validate(valid => {
        if (valid && this.codeForm.loginRead) {
          let _this = this;
          let url = 'http://new.api.db.glchuxingwang.com/customer/api/v1/user/login';
          $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data: {
              loginName: this.codeForm.phoneNum,
              loginType: Number(2),
              code: this.codeForm.verifyNum
            },
            success: function (response) {
              let res = response;
              if (res.code == '200') {
                _this.$message.success('登录成功');
                store.commit('isLogin',true);
                store.commit('newUserName', res.data.memberName);
                store.commit('GetPhone', res.data.loginName);
                store.commit('newMemberId', res.data.memberId);
                store.commit('SET_USERTYPE', res.data.userType);
                store.commit('SET_TOKEN', res.data.token);
                store.commit('newUserHead','memberHead');
                _this.userName = res.data.memberName;
                // _this.$router.push('/order');
                _this.$emit('on-tologin');
                _this.reload();
              }else {
                if (res.message == '验证码未填写') {
                  _this.$message.error('必需输入手机号或验证码');
                }else if (res.message == '验证码错误') {
                  _this.$message.error('登录失败,手机号或验证码错误');
                }
              }
            },
            error: function (error) {
              _this.$message.error('登录失败，错误: '+ err);
            }
          })
        } else {
          return false
        }
      });
      if (!this.codeForm.loginRead) {
        this.$message.error('阅读完成，请点击登录！')
      }
    },
  }
}
</script>

<style lang="scss">
.login-fade-enter, .login-fade-leave-active {
    opacity: 0;
}
.login-fade-enter-active, .login-fade-leave-active {
    transition: opacity .5s ease;
}
.loginCent {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, .5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .content {
    width: 525px;
    background: #fff;
    border-radius: 8px;
    .headText {
      font-size: 24px;
      color: #999;
      padding: 18px;
      span {
        width: 50%;
        display: inline-block;
        text-align: center;
      }
      span.active {
        color: #333;
      }
    }
    .body {
      padding: 18px;
      width: 83%;
      margin: 0 auto;
      label {
        display: inline-block;
        font-size: 18px;
      }
      label.redCheck {
        width: 20px;
      }
      /*.phone select {*/
        /*width: 130px;*/
        /*padding: 10px 20px;*/
        /*font-size: 14px;*/
        /*border-radius: 22px;*/
        /*// background: url('../src/assets/images/xiala@2x.png') no-repeat transparent 90% center;*/
        /*-webkit-appearance: none;*/
        /*-moz-appearance: none;*/
      /*}*/
      .phone .el-select input {
        width: 130px;
        padding: 10px 20px;
      }
      .phone .el-select {
        margin-right: 9px;
      }
      .phone .el-select, .phone .el-input, .codeChild {
        float: left;
        width: inherit;
      }
      .phone input, .code input, .codeTxt input {
        display: inline-block;
        /*border: 1px solid #ADADAD;*/
        border-radius: 0;
        color: #666;
        padding: 10px 20px;
        box-sizing: border-box;
        line-height: 1.2;
      }
      .phone input, .code input {
        width: 230px;
        border-radius: 22px;
      }
      .phone .el-form-item__error {
        padding-left: 66px;
      }
      .codeTxt {
        margin-left: 64px;
        input {
          width: 122px;
          float: left;
        }
        .erreoTxt {
          color: #FE4A54;
        }
        #verification {
          margin-left: 20px;
        }
        .captcha > span {
          color: #999;
          cursor: pointer;
          font-size: 15px;
          height: 40px;
          line-height: 40px;
        }
        .codeError {
          display: none;
        }
      }
      .code .submit-confirms {
        width: 130px;
        float: left;
        margin-left: 9px;
        background: #fff;
        color: #DE5C56;
        border: 1px solid #DE5C56;
        text-align: center;
        cursor: pointer;
      }
      .loginBtn {
        margin-top: 20px;
        width: 100%;
        font-size: 18px;
        padding: 8px 0;
        border-radius: 22px;
        text-align: center;
        color: #fff;
        background: #FE4A54;
        box-sizing: border-box;
        border: none;
        cursor: pointer;
      }
      .read {
        color: #333;
        font-size: 13px;
        text-align: center;
      }
    }
    .cont {
      width: 420px;
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
        padding: 11px 20px;
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
      b {
        color: #999;
        padding-bottom: 2px;
        border-bottom: 1px solid #777;
        font-weight: normal;
        cursor: pointer;
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
}
</style>

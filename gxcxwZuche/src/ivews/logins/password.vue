<template>
    <div class="loginHeiPic clearfix">
        <div class="loginWid">
            <div class="loginPassword">
                <div class="cont">
                    <h1 class="loginText">忘记密码</h1>
                    <el-form :model="passForm" :rules="rules" ref="passForm" class="formW">
                      <el-form-item prop="phone">
                        <el-input type="text" v-model="passForm.phone" placeholder="请输入手机号码"></el-input>
                      </el-form-item>
                      <div class="codeTwo">
                        <el-form-item prop="codeNum">
                          <el-input name="codeNum" type="text" v-model="passForm.codeNum" oninput="if(value.length>6)value=value.slice(0,6)" autoComplete="on" placeholder="请输入验证码"></el-input>
                        </el-form-item>
                        <input @click="sendSmsCode" class="submit-confirm" ref="code" type="button" v-model="btnContent"
                               v-bind="{'disabled':disabled}">
                      </div>
                      <el-form-item prop="newPassword">
                        <el-input type="password" v-model="passForm.newPassword" placeholder="请输入6-16位的新密码"></el-input>
                      </el-form-item>
                      <el-form-item prop="checknewpass">
                        <el-input type="password" v-model="passForm.checknewpass" placeholder="请再次输入新密码"></el-input>
                      </el-form-item>
                        <div class="btn">
                            <el-button @click="passSubmit(passForm)">确认</el-button>
                        </div>
                    </el-form>
                    <div class="footLogin"><router-link :to="{ path: '/login' }">立即登录</router-link></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import md5 from 'js-md5'
import { DES3 } from '@/js/3des'
import { validatePhone, validateVerifyNum } from "../../js/validate";

export default {
    data() {
      /*****检验两次密码是否一致***/
      const validatePass = (rule, value, callback) => {
        const reg = /^[a-zA-Z0-9]{6,16}$/;
        if (!value) {
          callback(new Error('密码不能为空'));
        }else {
          if (!reg.test(value)) {
            callback(new Error('密码不能含有非法字符，长度在6~16之间'));
          }
          if (this.passForm.checknewpass !== '') {
            this.$refs.passForm.validateField('checknewpass');
          }
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value.trim().length < 6 || value.trim().length > 16) {
          callback(new Error('请再次输入密码'));
        }else if (value !== this.passForm.newPassword) {
          callback(new Error('两次输入密码不一致！'));
        }else {
          callback();
        }
      };
        return {
          passForm: {
            phone: '',
            codeNum: '',
            newPassword: '',
            checknewpass: ''
          },
          rules: {
            phone: [{ required: true, trigger: 'change', validator: validatePhone }],
            codeNum: [{ required: true, trigger: 'change', validator: validateVerifyNum }],
            newPassword: [{ trigger: 'change', validator: validatePass }],
            checknewpass: [{ trigger: 'change', validator: validatePass2 }]
          },
          btnContent: "获取验证码", //获取验证码按钮内文字
          time: 0, //发送验证码间隔时间
          disabled: false, //按钮状态
            // identifyCodes: '1234567890',
            // identifyCode: '',
        }
    },
    methods: {
      //验证码校验
      sendSmsCode() {
        let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/; //手机号正则验证
        let phone = this.passForm.phone;
        if(!phone) { //未输入手机号
          this.$message.error('请输入手机号码');
          return;
        }
        if (!reg.test(phone)) {
          this.$message.error('您输入的手机号码不合法，请重新输入');
        }
        this.time = 60;
        this.timer();
        this.getCode(phone);
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
      //获取验证码
      getCode(mobileNo) {
        let _this = this;
        $.ajax({
          type: 'post',
          url: 'http://test.api.member.glchuxingwang.com/common/sms/send',
          dataType: 'json',
          data: {
            mobileNo: mobileNo,
            type: Number(2),  // 验证码重置密码为 2
            version: '1',
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
      passSubmit(passForm) {
        // const _key = 'lightintek@1234567890.com';
        // const _password = DES3.encrypt(this.passForm.newPassword, _key);
        // const _checkNewPass = DES3.encrypt(this.passForm.checknewpass, _key);
        // console.log(_password);
        this.$refs.passForm.validate(valid => {
          if (valid) {
            let _this = this;
            $.ajax({
              type: 'post',
              url: 'http://new.api.db.glchuxingwang.com/customer/api/v1/user/resetPasswordByCode',
              dataType: 'json',
              data: {
                loginName: this.passForm.phone,
                newPassword: this.passForm.newPassword,
                surePassword: this.passForm.checknewpass,
                code: this.passForm.codeNum,
                type: Number(2)
              },
              success: function (response) {
                let res = response;
                if (res.code == '200') {
                  _this.$message.success('修改密码成功');
                }else {
                  _this.$message.error('修改密码失败，验证码错误');
                }
              },
              error: function (error) {
                _this.$message.error('修改密码失败，错误: '+ error);
              }
            })
          }else {
            return false
          }
        });
      },
        // 生成一个随机数
        // randomNum (min, max) {
        //     return Math.floor(Math.random() * (max - min) + min);
        // },
        // refreshCode () {
        //     this.identifyCode = '';
        //     this.makeCode(this.identifyCodes, 4);
        // },
        // makeCode (o, l) {
        //     for (let i = 0; i < l; i++) {
        //         this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
        //     }
        // }
    },
    mounted () {
        // this.identifyCode = '';
        // this.makeCode(this.identifyCodes, 4);
    }
}
</script>

<style lang="scss">
.submit-confirm {
  margin-bottom: 22px;
}
.loginHeiPic {
    height: 100%;
    background: url('../../assets/images/loginbg.png') no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
    margin-top: -74px;
    position: fixed;
    width: 100%;
}
.loginWid {
    width: 1300px;
    margin: 0 auto;
    position: relative;
}
.loginPassword {
    width: 900px;
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -46%);
    transform: translate(-50%, -46%);
    .cont {
        width: 80%;
        margin: 0 auto;
        padding: 16px 40px;
        .codeTwo {
          .el-form-item {
            width: 50%;
            float: left;
            padding-right: 5%;
          }
          .submit-confirm {
            width: 45%;
            cursor: pointer;
          }
        }
        .loginText {
            font-size: 30px;
            text-align: center;
            padding: 10px 0 20px;
        }
        p {
            color: #999;
            text-align: center;
            padding: 0 0 20px;
        }
        .formW {
            width: 400px;
            margin: 20px auto;
        }
        .codeImg {
            margin-bottom: 20px;
            margin-left: 8px;
            align-items: center;
            display: flex;
            span {
                color: #999;
                margin-left: 8px;
                cursor: pointer;
            }
        }
        input {
            width: 100%;
            border: 1px solid #ebebeb;
            border-radius: 20px;
            color: #999;
            padding: 10px 20px;
            box-sizing: border-box;
        }
        input[type=button] {
          background: #fff;
          color: #DE5C56;
          border: 1px solid #DE5C56;
          padding: 8px 20px;
        }
        .code {
           input {
                width: 248px;
                margin-right: 7px;
            }
            button {
                width: 140px;
                border: 1px solid #ff2b35;
                color: #ff2b35;
                background: #fff;
                border-radius: 20px;
                padding: 10px 20px;
                box-sizing: border-box;
            }
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
}
.footLogin {
    margin-top: -10px;
    margin-bottom: 30px;
    text-align: center;
    a {
        color: #FE4A54;
        padding-bottom: 2px;
        border-bottom: 1px solid #FE4A54;
    }
}
</style>

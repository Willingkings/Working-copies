<template>
    <div class="loginHeiPic clearfix">
        <div class="loginWid">
            <div class="loginEmployee">
                <div class="cont">
                    <h1 class="loginText">员工加入企业</h1>
                    <p>通过绑定企业邮箱帮您找到您所在的企业，仅支持已添加绑定邮箱功能的企业</p>
                    <el-form :model="yeeForm" :rules="rules" ref="yeeForm" class="formW">
                        <el-form-item prop="companyName">
                          <el-input type="text" v-model="yeeForm.companyName" placeholder="请输入企业名称"></el-input>
                        </el-form-item>
                        <el-form-item prop="emali">
                          <el-input type="text" v-model="yeeForm.emali" placeholder="请输入企业邮箱"></el-input>
                        </el-form-item>
                        <el-form-item class="btn">
                            <el-button @click="yeeSubmit(yeeForm)">立即申请</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

      <v-login v-show="isShowLogin" @on-loginClose="closeLogin" @on-handLogin="handLogin" @on-tologin="tologin" @on-toEmploye="toEmloye" @on-toRegist="toRegist"></v-login>
    </div>
</template>

<script>
import loginIndex from "@/components/loginIndex"
import store from '@/store/store.js'
import md5 from 'js-md5'
import { validatePhone, validateVerifyNum, validateChinese, validateEMailQy } from "../../js/validate";

export default {
    inject: ['reload'], //注入依赖
    components: {
      'v-login': loginIndex
    },
    data() {
        return {
          yeeForm: {
            companyName: '',
            emali: ''
          },
          rules: {
            companyName: [{required: true, trigger: 'change', validator: validateChinese }],
            emali: [{required: true, trigger: 'change', validator: validateEMailQy }]
          },
          isShowLogin: false,
        }
    },
    methods: {
      closeLogin: function () {
        this.isShowLogin = false;
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
      yeeSubmit(yeeForm) {
        let _this = this;
        this.$refs.yeeForm.validate(valid => {
          if (valid) {
            if (window.sessionStorage.getItem('token') == null) {
              this.isShowLogin = !this.isShowLogin;
            }else {
              $.ajax({
                url: "http://new.api.db.glchuxingwang.com/sales/order/companyEmployee",
                dataType: 'json',
                type: 'get',
                dataType: 'json',
                data: {
                  companyName: this.yeeForm.companyName,
                  memberId: sessionStorage.getItem('memberId'),
                  token: sessionStorage.getItem('token')
                },
                success: function (response){
                  let res = response;
                  if (res.msg == '该客户已经有加入该企业了') {
                    _this.$message.success('该客户已经有加入该企业了');
                  }else {
                    _this.$message.error('您输入的企业名称不存在或已停用');
                  }
                }
              });
            }
          }else {
            return false
          }
        });
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
.loginEmployee {
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
        input {
            width: 100%;
            border: 1px solid #ebebeb;
            border-radius: 20px;
            color: #999;
            padding: 10px 20px;
            box-sizing: border-box;
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
@media only screen and (max-width: 1200px){
  .loginEmployee {
    width: 760px;
    padding: 5px 0 0;
  }
}
</style>

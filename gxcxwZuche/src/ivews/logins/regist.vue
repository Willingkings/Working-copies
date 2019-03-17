<template>
    <div class="registerHeiPic clearfix">
        <div class="registerWid">
            <div class="registerbox">
                <div class="cont">
                    <div class="tabs clearfix">
                        <span v-for="(item, index) in tabsParam" :class="{active: index === nowIndex}" @click="toggleTabs(index)">{{item}}</span>
                    </div>
                    <el-form autoComplete="on" :model="registForm" :rules="registRules" ref="registForm" id="registerGR" v-show="nowIndex === 0">
                        <div class="dashed">账户信息</div>
                        <el-form-item prop="name">
                            <el-input name="name" type="text" v-model="registForm.name" autoComplete="on" placeholder="请输入联系人名称"/>
                        </el-form-item>
                        <el-form-item prop="phone">
                            <el-input name="phone" type="text" v-model="registForm.phone" autoComplete="on" placeholder="请输入联系人手机"/>
                        </el-form-item>
                      <div class="codeTwo">
                        <el-form-item prop="codeNum">
                          <el-input name="codeNum" type="text" v-model="registForm.codeNum" oninput="if(value.length>6)value=value.slice(0,6)" autoComplete="on" placeholder="请输入验证码"></el-input>
                        </el-form-item>
                        <input @click="sendSmsCode" class="submit-confirm" ref="code" type="button" v-model="btnContent"
                               v-bind="{'disabled':disabled}">
                        <div class="clear"></div>
                      </div>
                      <el-form-item class="btn">
                          <el-button type="primary" style="width:100%;" @click.native.prevent="handleRegist(registForm)">立即注册</el-button>
                      </el-form-item>
                    </el-form>
                    <el-form autoComplete="on" :model="registFormQy" :rules="registRulesQy" ref="registFormQy" id="registerQY"  v-show="nowIndex ===1">
                        <div class="dashed">账户信息</div>
                        <el-form-item prop="name">
                            <el-input name="name" type="text" v-model="registFormQy.name" autoComplete="on"
                                  placeholder="请输入联系人名称"/>
                        </el-form-item>
                        <el-form-item prop="phone">
                            <el-input name="name" type="text" v-model="registFormQy.phone" autoComplete="on"
                                    placeholder="请输入联系人手机"/>
                        </el-form-item>
                        <div class="codeTwo">
                          <el-form-item prop="codeNum">
                            <el-input name="codeNum" type="text" v-model="registFormQy.codeNum" oninput="if(value.length>6)value=value.slice(0,6)" autoComplete="on" placeholder="请输入验证码"></el-input>
                          </el-form-item>
                          <input @click="sendSmsCodeQy" class="submit-confirm" ref="codeQy" type="button"
                                 v-model="btnContentQy" v-bind="{'disabled':disabledQy}">
                          <div class="clear"></div>
                        </div>
                        <div class="dashed">企业信息</div>
                        <el-form-item prop="email">
                            <el-input name="email" type="text" v-model="registFormQy.email" autoComplete="on"
                                      placeholder="请输入企业邮箱"></el-input>
                        </el-form-item>
                        <el-form-item prop="qiyeName">
                            <el-input name="qiyeName" type="text" v-model="registFormQy.qiyeName" autoComplete="on"
                                    placeholder="请输入企业名称"></el-input>
                        </el-form-item>
                        <el-form-item prop="racode">
                            <el-input name="racode" type="text" v-model="registFormQy.racode" autoComplete="on"
                                    placeholder="请输入注册机构代码"></el-input>
                        </el-form-item>
                        <el-form-item class="btn">
                            <el-button type="primary" style="width:100%;" @click.native.prevent="qiyeRegist(registFormQy)">立即注册</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import md5 from 'js-md5'
import { validateUsername, validatePhone, validateVerifyNum, validateEMailQy, validateChinese, validateRecode } from
    "../../js/validate";

export default {
    data() {
        return {
            tabsParam: ["个人账户","企业账户"],
            nowIndex: 0,
            isShow: false,
            codeQY: '',
            registForm: {
              name: '',
              phone: '',
              codeNum: ''
            },
            registRules: {
              name: [{ required: true, trigger: 'change', validator: validateUsername }],
              phone: [{ required: true, trigger: 'change', validator: validatePhone }],
              codeNum: [{ required: true, trigger: 'change', validator: validateVerifyNum }]
            },
            btnContent: "获取验证码", //获取验证码按钮内文字
            time: 0, //发送验证码间隔时间
            disabled: false, //按钮状态
            btnContentQy: "获取验证码", //获取验证码按钮内文字
            timeQy: 0, //发送验证码间隔时间
            disabledQy: false, //按钮状态
            registFormQy: {
              name: '',
              phone: '',
              codeNum: '',
              email: '',
              qiyeName: '',
              racode: ''
            },
            registRulesQy: {
              name: [{ required: true, trigger: 'change', validator: validateUsername }],
              phone: [{ required: true, trigger: 'change', validator: validatePhone }],
              codeNum: [{ required: true, trigger: 'change', validator: validateVerifyNum }],
              email: [{ required: true, trigger: 'change', validator: validateEMailQy }],
              qiyeName: [{ required: true, trigger: 'change', validator: validateChinese }],
              racode: [{ required: true, trigger: 'change', validator: validateRecode }],
            },
        }
    },
    methods: {
        toggleTabs(index) {
            this.nowIndex = index;
        },
        wathChildPicmaQY(vals) {
            this.codeQY = vals;
        },
        checkValues(val) {
          console.log(val);
        },
      //个人验证码之前手机号校验
      sendSmsCode() {
        let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/; //手机号正则验证
        let newPhone = this.registForm.phone;
        if(!newPhone) { //未输入手机号
          this.$message.error('请输入手机号码');
          return;
        }
        if (!reg.test(newPhone)) {
          this.$message.error('您输入的手机号码不合法，请重新输入');
        }
        this.time = 60;
        this.timer();
        this.getCode(newPhone);
      },
      //企业验证码之前手机号校验
      sendSmsCodeQy() {
        let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/; //手机号正则验证
        let newPhone = this.registFormQy.phone;
        if(!newPhone) { //未输入手机号
          this.$message.error('请输入手机号码');
          return;
        }
        if (!reg.test(newPhone)) {
          this.$message.error('您输入的手机号码不合法，请重新输入');
        }
        this.timeQy = 60;
        this.timerQy();
        this.getCode(newPhone);
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
      //短信60s重新获取验证码
      timerQy() {
        if(this.timeQy > 0) {
          this.timeQy --;
          this.btnContentQy = this.timeQy + "s后重新获取";
          this.$refs.codeQy.style.color = '#999';
          this.$refs.codeQy.style.background = '#ddd';
          this.$refs.codeQy.style.border = '1px solid #ddd';
          this.disabledQy = true;
          setTimeout(this.timerQy, 1000);
        } else {
          this.btnContentQy = "获取验证码";
          this.$refs.codeQy.style.color = '#DE5C56';
          this.$refs.codeQy.style.background = '#fff';
          this.$refs.codeQy.style.border = '1px solid #DE5C56';
          clearTimeout(this.timerQy);
          this.disabledQy = false;
        }
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
            type: Number(10),   //大巴注册验证码为 10   个人和企业
            version: '1',
            platform: '1',
            sign: md5(md5(mobileNo + 'glcxw2017@ugiant2017@!~#*'))
          },
          success: function (response) {
            let res = response;
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
      //个人注册
      handleRegist(registForm) {
        let _this = this;
        let url = 'http://new.api.db.glchuxingwang.com/customer/api/v1/user/register';
        this.$refs.registForm.validate(valid => {
          if (valid) {
            $.ajax({
              type: 'post',
              url: url,
              data: {
                contacts: this.registForm.name,
                loginName: this.registForm.phone,
                code: this.registForm.codeNum,
                registerType: Number(2),   //注册类型  短信验证码为 2
                type: Number(3)   //个人账户为 3
              },
              success: function (response) {
                let res = response;
                if (res.code == '200') {
                  _this.$message.success('注册成功');
                } else if (res.message == '您的手机已经注册过了！！！') {
                  _this.$message.error('您的手机已经注册过了！！！');
                } else if (res.message == '您已经注册了企业用户') {
                  _this.$message.error('您已经注册了企业用户');
                }else {
                  if (res.message == '验证码有误!') {
                    _this.$message.error('注册失败,验证码错误');
                  }
                }
              },
              error: function (error) {
                _this.$message.error('注册失败，错误: '+ err);
              }
            })
          } else {
            console.log('error submit!!');
            return false
          }
        })
      },
      //企业注册
      qiyeRegist(registFormQy) {
        let _this = this;
        let url = 'http://new.api.db.glchuxingwang.com/customer/api/v1/user/register';
        this.$refs.registFormQy.validate(valid => {
          if (valid) {
            $.ajax({
              type: 'post',
              url: url,
              data: {
                contacts: this.registFormQy.name,
                loginName: this.registFormQy.phone,
                code: this.registFormQy.codeNum,
                companyMail: this.registFormQy.email,
                companyName: this.registFormQy.qiyeName,
                raCode: this.registFormQy.racode,
                registerType: Number(2),  //注册类型  短信验证码为 2
                type: Number(25)    //企业账户为 25
              },
              success: function (response) {
                let res = response;
                if (res.code == '200') {
                  _this.$message.success('注册成功');
                } else if (res.message == '您的手机已经注册过了！！！') {
                  _this.$message.error('您的手机已经注册过了！！！');
                } if (res.message == '您已经注册了企业用户') {
                  _this.$message.error('您已经注册了企业用户');
                }else {
                  if (res.message == '验证码有误!') {
                    _this.$message.error('注册失败,验证码错误');
                  }
                }
              },
              error: function (error) {
                _this.$message.error('注册失败，错误: '+ err);
              }
            })
          } else {
            console.log('error submit!!');
            return false
          }
        })
      }
    },
}
</script>

<style lang="scss">
.registerHeiPic {
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
.registerWid {
    width: 1300px;
    margin: 0 auto;
    position: relative;
}
.registerbox {
    width: 900px;
    background: #fff;
    position: fixed;
    padding: 10px 0 30px;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -46%);
    transform: translate(-50%, -46%);
    .cont {
        width: 400px;
        margin: 0 auto;
        padding: 16px 0;
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
        .tabs span {
            font-size: 30px;
            display: inline-block;
            width: 50%;
            text-align: center;
            padding: 10px 0 20px;
            color: #7E7E7E;
            cursor: pointer;
        }
        .tabs span.active {
            color: #FE4A54;
        }
        .codeImg {
            margin-bottom: 20px;
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
            margin: 20px 0;
        }
    }
    .footTxt {
        margin: 24px 0 10px;
        text-align: center;
    }
}
.dashed {
    text-align: center;
    color: #333;
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0 20px;
}
.dashed::before {
    content: "";
    border: 1px dashed #ADADAD;
    width: 130px;
    display: inline-block;
    margin-right: 20px;
    vertical-align: middle;
}
.dashed::after {
    content: "";
    border: 1px dashed #ADADAD;
    width: 130px;
    display: inline-block;
    margin-left: 20px;
    vertical-align: middle;
}
@media only screen and (max-width: 1200px){
  .registerbox {
    width: 760px;
    padding: 5px 0 0;
    top: 51%;
  }
  .registerbox .cont{
    padding: 10px 0;
  }
  .registerbox .cont .tabs span {
    font-size: 24px;
    padding: 5px 0 10px;
  }
  .registerbox .cont .el-form-item {
    margin-bottom: 20px;
    input {
      height: 36px;
      line-height: 36px;
    }
  }
  .registerbox .cont .btn button {
    margin: 10px 0 0;
  }
  .dashed {
    margin: 8px 0 15px;
  }
}
</style>

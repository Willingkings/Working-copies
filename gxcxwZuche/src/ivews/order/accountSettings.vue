<template>
    <div class="accountSettings clearfix">
        <ul class="tabs clearfix">
            <li v-for="(item, index) in tabsParam" :class="{active: index == nowIndex}" @click="toggleTabs(index)">{{item}}</li>
        </ul>
        <div v-show="nowIndex === 0">
          <div class="phoneNum">
            <el-form :model="replaceForm" :rules="phoneRules" ref="replaceForm" id="phone">
              <el-form-item prop="newPhone">
                <el-input type="text" v-model="replaceForm.newPhone" placeholder="请输入新手机号"></el-input>
              </el-form-item>
              <el-form-item class="code clearfix" prop="verifyNum">
                <el-input type="text" v-model="replaceForm.verifyNum" placeholder="请输入验证码"></el-input>
                <input @click="sendSmsCode" class="submit-confirm" ref="code" type="button" v-model="btnContent"
                       v-bind="{'disabled':disabled}">
              </el-form-item>
            </el-form>
            <p style="color: #fe4a54;">不允许绑定已注册过的手机号码</p>
            <div class="confirm">
              <el-button @click="replaceSumist(replaceForm)">确认</el-button>
            </div>
          </div>
        </div>
        <div v-show="nowIndex === 1">
          <div class="password">
            <el-form :model="modifyForm" :rules="passRules" ref="modifyForm" id="password">
              <el-form-item prop="oldPassword">
                <el-input type="password" v-model="modifyForm.oldPassword" placeholder="请输入当前密码"></el-input>
              </el-form-item>
              <el-form-item prop="newPassword">
                <el-input type="password" v-model="modifyForm.newPassword" placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item prop="checknewpass">
                <el-input type="password" v-model="modifyForm.checknewpass" placeholder="请输入确认新密码"></el-input>
              </el-form-item>
              <div class="confirm">
                <el-button type="primary" @click="passSubmit(modifyForm)">确认</el-button>
              </div>
            </el-form>
          </div>
        </div>
    </div>
</template>

<script>
  import md5 from 'js-md5'
  import { validatePhone, validateVerifyNum, validatePass } from "../../js/validate";

  export default {
    data() {
      /*****检验两次密码是否一致***/
        const validatenewPass = (rule, value, callback) => {
          const reg = /^[a-zA-Z0-9]{6,16}$/;
          if (!value) {
            callback(new Error('新密码不能为空'));
          }else {
            if (!reg.test(value)) {
              callback(new Error('密码不能含有非法字符，长度在6~16之间'));
            }
            if (this.modifyForm.checknewpass !== '') {
              this.$refs.modifyForm.validateField('checknewpass');
            }
            callback();
          }
        };
        const validatenewPass2 = (rule, value, callback) => {
          if (value.trim().length < 6 || value.trim().length > 16) {
            callback(new Error('请再次输入密码'));
          }else if (value !== this.modifyForm.newPassword) {
            callback(new Error('两次输入密码不一致！'));
          }else {
            callback();
          }
        };
        return {
            tabsParam: ["更换手机","修改密码"],
            nowIndex: 0,
            isShow: false,
            phoneNum: sessionStorage.getItem('loginName'),
            replaceForm: {
              newPhone: '',
              verifyNum: '', //验证码
            },
            phoneRules: {
              newPhone: [{required: true, trigger: 'change', validator: validatePhone }],
              verifyNum: [{required: true, trigger: 'change', validator: validateVerifyNum }]
            },
            modifyForm: {
              oldPassword: '',
              newPassword: '',
              checknewpass: ''
            },
            passRules: {
              oldPassword: [{required: true, trigger: 'change', validator: validatePass }],
              newPassword: [{trigger: 'change', validator: validatenewPass }],
              checknewpass: [{trigger: 'change', validator: validatenewPass2 }]
            },
            btnContent: "获取验证码", //获取验证码按钮内文字
            time: 0, //发送验证码间隔时间
            disabled: false, //按钮状态
        }
    },
    methods: {
        //验证码校验
        sendSmsCode() {
          let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/; //手机号正则验证
          let newPhone = this.replaceForm.newPhone;
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
      //获取验证码
        getCode(mobileNo) {
          let _this = this;
          $.ajax({
            type: 'post',
            url: 'http://test.api.member.glchuxingwang.com/common/sms/send',
            dataType: 'json',
            data: {
              mobileNo: mobileNo,
              type: Number(9),
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
            }
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
        //确认更换新的手机号
        replaceSumist(replaceForm) {
          this.$refs.replaceForm.validate(valid => {
            if (valid) {
              let _this = this;
              let url = 'http://new.api.db.glchuxingwang.com/customer/api/v1/user/updateMobile';
              $.ajax({
                type: 'post',
                url: url,
                dataType: 'json',
                data: {
                  code: this.replaceForm.verifyNum,
                  memberId: sessionStorage.getItem('memberId'),
                  mobile: this.replaceForm.newPhone,
                  type: Number(9)
                },
                success: function (response) {
                  let res = response;
                  console.log(res);
                  if (res.code == '200') {
                    _this.$message.success('更换手机号成功');
                  } else {
                    _this.$message.error('更换手机号失败');
                  }
                },
                error: function (error) {
                  _this.$message.error('错误：' + error);
                }
              })
            }
          })
        },
        //确认更换新的密码
        passSubmit(modifyForm) {
          this.$refs.modifyForm.validate(valid => {
            if (valid) {
              let _this = this;
              let url = 'http://new.api.db.glchuxingwang.com/customer/api/v1/user/resetPassword';
              $.ajax({
                type: 'post',
                url: url,
                dataType: 'json',
                data: {
                  loginName: this.phoneNum,
                  password: this.modifyForm.oldPassword,
                  newPassword: this.modifyForm.newPassword,
                  surePassword: this.modifyForm.checknewpass
                },
                success: function (response) {
                  let res = response;
                  if (res.code == '200') {
                    _this.$message.success('密码成功');
                  } else {
                    _this.$message.error('用户名用大小写字母和数字组成，4-25位');
                  }
                },
                error: function (error) {
                  _this.$message.error('密码错误：' + error);
                }
              })
            }else {
              return false
            }
          });
        },
        toggleTabs(index) {
            this.nowIndex = index;
        }
    }
}
</script>

<style lang="scss">
.accountSettings {
    background-color: #fff;
    padding: 30px;
}
.tabs li {
    float: left;
    font-size: 18px;
    margin: 10px 20px 40px;
    cursor: pointer;
}
.tabs li.active {
    font-size: 20px;
    font-weight: bold;
}
  //更换手机
.phoneNum {
  input {
    display: block;
    width: 240px;
    border: 1px solid #e3e3e3;
    background-color: #efeef4;
    padding: 6px 12px;
    border-radius: 8px;
    box-sizing: border-box;
  }
  .code {
    margin: 10px 0 20px;
    input {
      width: 130px;
      float: left;
      margin: 0 6px 0 0;
    }
    .el-input {
      width: auto;
      float: left;
    }
    .submit-confirm {
      border: 1px solid #fe4a54;
      background-color: #fff;
      color: #fe4a54;
      padding: 9px 16px;
      border-radius: 20px;
      cursor: pointer;
    }
  }
}
  //修改密码
.password input {
  display: block;
  width: 240px;
  border: 1px solid #e3e3e3;
  background-color: #efeef4;
  padding: 6px 12px;
  border-radius: 8px;
  box-sizing: border-box;
}
.accountSettings .confirm button {
  width: 130px;
  background-color: #fe4a54;
  color: #fff;
  padding: 10px 20px;
  border: 1px solid #ff2b35;
  font-size: 18px;
  border-radius: 20px;
  margin: 30px 0;
  cursor: pointer;
}
</style>

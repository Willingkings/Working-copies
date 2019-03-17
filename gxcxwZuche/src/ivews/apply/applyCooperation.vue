<template>
    <div class="applyCooHeiPic clearfix">
        <div class="applyCooWid">
            <div class="applyCooperation">
                <div class="cont">
                    <h1 class="loginText">申请加盟</h1>
                    <div class="slideBtn">
                        <span v-for="(item, index) in tabsName" :class="{active: applyIndex == index}" @click="applyToggleTabs(index)">{{item}}</span>
                    </div>
                    <el-form class="formW" :model="applyOneForm" :rules="oneRules" ref="applyOneForm" v-show="applyIndex == 0">
                      <el-form-item prop="name">
                        <el-input type="text" v-model="applyOneForm.name" placeholder="请输入联系人名称"></el-input>
                      </el-form-item>
                      <el-form-item prop="phone">
                        <el-input type="text" v-model="applyOneForm.phone" placeholder="请输入联系电话"></el-input>
                      </el-form-item>
                      <el-form-item class="btn">
                          <el-button @click.native.prevent="applyOneSumbit(applyOneForm)">立即申请</el-button>
                      </el-form-item>
                    </el-form>

                    <el-form class="formW" :model="applyTowForm" :rules="twoRules" ref="applyTowForm"
                             v-show="applyIndex == 1">
                      <el-form-item prop="name">
                        <el-input type="text" v-model="applyTowForm.name" placeholder="请输入联系人名称"></el-input>
                      </el-form-item>
                      <el-form-item prop="phone">
                        <el-input type="text" v-model="applyTowForm.phone" placeholder="请输入联系电话"></el-input>
                      </el-form-item>
                      <el-form-item class="btn">
                        <el-button @click.native.prevent="applyTowSumbit(applyTowForm)">立即申请</el-button>
                      </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { validatePhone } from "../../js/validate";

export default {
    data() {
        return {
            applyIndex: 0,
            tabsName: ['旅游大巴', '商务专车'],
            applyOneForm: {
              applyType: '旅游大巴',
              name: '',
              phone: ''
            },
            oneRules: {
              name: [{ required: true, trigger: 'change', message: '请输入联系人名称' }],
              phone: [{ required: true, trigger: 'change', validator: validatePhone }]
            },
            applyTowForm: {
              applyType: '商务专车',
              name: '',
              phone: ''
            },
            twoRules: {
              name: [{ required: true, trigger: 'change', message: '请输入联系人名称' }],
              phone: [{ required: true, trigger: 'change', validator: validatePhone }]
            }
        }
    },
    methods: {
        applyToggleTabs: function(index) {
            this.applyIndex = index;
        },
        applyOneSumbit(applyOneForm) {
          this.$refs.applyOneForm.validate(valid => {
            if (valid) {
              let _this = this;
              $.ajax({
                type: 'post',
                url: 'http://new.api.db.glchuxingwang.com/customer/customer/applyJoin',
                data: {
                  applyType: this.applyOneForm.applyType,
                  name: this.applyOneForm.name,
                  phone: this.applyOneForm.phone,
                  memberId: sessionStorage.getItem('memberId'),
                  token: sessionStorage.getItem('token')
                },
                success: function (response) {
                  let res = response;
                  console.log(res);
                  if (res.msg == '申请成功') {
                    _this.$message.success('申请加盟成功');
                  }else {
                    _this.$message.error('申请加盟失败');
                  }
                }
              })
            } else {
              return false;
            }
          });
        },
        applyTowSumbit(applyTowForm) {
          this.$refs.applyTowForm.validate(valid => {
            if (valid) {
              let _this = this;
              $.ajax({
                type: 'post',
                url: 'http://new.api.db.glchuxingwang.com/customer/customer/applyJoin',
                data: {
                  applyType: this.applyTowForm.applyType,
                  name: this.applyTowForm.name,
                  phone: this.applyTowForm.phone,
                  memberId: sessionStorage.getItem('memberId'),
                  token: sessionStorage.getItem('token')
                },
                success: function (response) {
                  let res = response;
                  if (res.msg == '申请成功') {
                    _this.$message.success('申请加盟成功');
                  }else {
                    _this.$message.error('申请加盟失败');
                  }
                }
              })
            }else {
              return false;
            }
          });
        }
    }
}
</script>

<style lang="scss">
.applyCooHeiPic {
    position: fixed;
    width: 100%;
    height: 100%;
    background: url('../../assets/images/cooperationPic.png') no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
    margin-top: -74px;
}
.applyCooWid {
    width: 1300px;
    margin: 0 auto;
    position: relative;
}
.applyCooperation {
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
.slideBtn {
    width: 394px;
    height: 50px;
    line-height: 50px;
    background: #EFEEF4;
    margin: 20px auto 30px;
    border-radius: 25px;
    padding: 3px;
    span {
        width: 50%;
        text-align: center;
        float: left;
        color: #999;
        font-size: 18px;
    }
    span.active {
        background: #FE4A54;
        border-radius: 25px;
        color: #fff;
    }
}
@media only screen and (max-width: 1200px){
  .applyCooperation {
    width: 760px;
    padding: 5px 0 0;
  }
}
</style>

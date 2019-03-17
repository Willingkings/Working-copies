<template>
  <div class="captcha">
    <el-input type="text" v-on:blur="checkLpicma" :placeholder="placeholder" v-model="picLyanzhengma"></el-input>
    <div class="codeError disappear"></div>
    <input type="button" id="verification" v-model="checkCode"/>
    <span @click="createCode">看不清，换一张</span>
  </div>
</template>

<script>
let code = '';
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checkCode: '',
      picLyanzhengma: ''
    }
  },
  created() {
    this.createCode();
  },
  methods: {
    //图片验证码
    createCode() {
      //先清空验证码的输入
      this.code = '';
      this.checkCode = '';
      //验证码的长度
      let codeLength = 4;
      //随机数
      let random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
      for(let i = 0; i < codeLength; i++){
        //取得随机数的索引(0~35)
        let index = Math.floor(Math.random()*36);
        //根据索引取得随机数加到code止
        this.code += random[index];
      }
      //把code值赋给验证码
      this.checkCode = this.code;
    },
    checkLpicma() {
      //验证所输入验证码是否一致，不区分大小写
      this.picLyanzhengma.toUpperCase(); //取得输入的验证码并转化为大写
      if(this.picLyanzhengma == '') {
        $('.codeError').text('请输入验证码');
        $('.codeError').removeClass('disappear');
      } else if(this.picLyanzhengma.toUpperCase() != this.checkCode) {
        $('.codeError').text('验证码输入错误');
        $('.codeError').removeClass('disappear');
        this.createCode(); //刷新验证码
        this.picLyanzhengma = '';
      } else {
        // 输入正确时
        $('.codeError').removeClass('disappear');
        $('.codeError').text('');
        return true;
      }
      this.$emit('childPicma', this.picLyanzhengma);
    }
  }
}
</script>

<style lang="scss">
#verification{
  border-radius: 12px;
  width:100px;
  letter-spacing:5px;
  margin-left: 30px;
  margin-bottom: 0;
  height: 40px;
  transform: translate(-15px,0);
}
.captcha{
  width: 100%;
  text-align: justify;
}
</style>

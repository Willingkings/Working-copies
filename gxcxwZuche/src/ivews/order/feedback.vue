<template>
    <div class="feedback">
        <div class="infoBg">
            <b>反馈建议</b>
        </div>
        <!--<div class="infoCon">-->
          <!--<ul>-->
            <!--<li>2132131322222222222222222222222222222222222222222222222222222222222222222222222222222222222</li>-->
          <!--</ul>-->
        <!--</div>-->
        <div class="infoCon">
            <div class="head"><b>留言评论</b></div>
            <div class="infoText">
              <el-form ref="liuyanForm" :model="liuyanForm" :rules="rules">
                <el-form-item prop="desc">
                  <el-input type="textarea" :rows="10" v-model="liuyanForm.desc"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button class="btn" type="primary" @click="onSubmit(liuyanForm)">提交</el-button>
                  <el-button class="btnRed" @click="resetForm(liuyanForm)">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    const validateDesc = (rule, value, callback) => {
      if (value.trim().length<50) {
        callback(new Error('请留言评论至少50个字'))
      } else {
        callback()
      }
    };
    return {
      liuyanForm: {
        desc: ''
      },
      rules: {
        desc: [{ required: true, trigger: 'blur', validator: validateDesc }]
      }
    }
  },
  methods: {
    onSubmit(liuyanForm) {
      this.$refs.liuyanForm.validate(valid => {
        if (valid) {
          let _this = this;
          $.ajax({
            type: 'post',
            url: 'http://new.api.db.glchuxingwang.com/customer/customer/addleaveMessage',
            dataType: 'json',
            data: {
              message: this.liuyanForm.desc,
              memberId: sessionStorage.getItem('memberId')
            },
            success: function (response) {
              let res = response;
              if (res.success == true) {
                _this.$message.success('留言成功!');
              }
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(liuyanForm) {
      this.$refs.liuyanForm.resetFields();
    }
  }
}
</script>

<style lang="scss">
.infoBg, .infoCon {
    background-color: #fff;
    width: 100%;
    padding: 10px 20px;
    margin-bottom: 30px;
}
.infoBg {
    b {
        font-size: 18px;
    }
    span {
        color: #8c8c8c;
        float: right;
    }
}
.infoCon {
    .head {
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
    }
    .infoText {
      .btn {
        background: #ff2b35;
        border: 1px solid #ff2b35;
      }
      .btnRed:active {
        color: #ff2b35;
        border-color: #ff2b35;
        outline: 0;
      }
      .btnRed:focus, .btnRed:hover {
        color: #ff2b35;
        border-color: #f7666d;
        background-color: #fff0f0;
      }
    }
}
</style>


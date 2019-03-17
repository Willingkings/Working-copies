<template>
    <div class="applyHeiPic clearfix">
        <div class="applyWid">
            <div class="applyDriver">
                <div class="cont">
                    <h1 class="loginText">申请成为司机</h1>
                    <el-form class="formW" :model="driverForm" :rules="driverRules" ref="driverForm" label-width="94px">
                        <el-form-item label="真实姓名" prop="driverName">
                          <el-input type="text" v-model="driverForm.driverName" placeholder="请输入真实姓名"></el-input>
                        </el-form-item>

                        <el-form-item label="身份证号码" prop="idCardNum">
                          <el-input type="text" v-model="driverForm.idCardNum" placeholder="请输入身份证号码"></el-input>
                        </el-form-item>

                        <el-form-item label="上传身份证" class="upload-img-form" prop="idCard_Z" v-bind:prop="'idCard_F'">
                          <el-button @click="addUploadCard" class="uploadBtn">请上传身份证正反面
                            <i class="iconfont">&#xe638;</i></el-button>
                          <span style="height: 41px;" v-if="cardUploadShow" v-for="(item, index) in datas_upload_card.slice(0,2)" :key="index">
                            <el-input type="text" v-model="driverForm.idCard_Z" class="textInp" style="display: none;"></el-input>
                            <el-upload v-if="index == 0" class="avatar-uploader" :disabled="disabledCard_Z" action="" name = 'file' :show-file-list="false" :before-upload="beforeUploadCard_Z">
                              <img v-if="driverForm.idCard_Z" :src="driverForm.idCard_Z" class="avatar">
                              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                              <span class="driverUpload-hover" v-if="driverForm.idCard_Z">
                                <span class="upload-list-preview" @click="cardUploadPreview_Z">
                                  <i class="el-icon-zoom-in"></i>
                                </span>
                                <span class="upload-list-delete" @click="cardUploadDelete_Z">
                                  <i class="el-icon-delete"></i>
                                </span>
                              </span>
                            </el-upload>
                            <el-input type="text" v-model="driverForm.idCard_F" class="textInp" style="display: none;"></el-input>
                            <el-upload v-if="index == 1" class="avatar-uploader" :disabled="disabledCard_F" action=""
                                       name = 'file'
                                       :show-file-list="false"
                                       :before-upload="beforeUploadCard_F">
                              <img v-if="driverForm.idCard_F" :src="driverForm.idCard_F" class="avatar">
                              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                              <span class="driverUpload-hover" v-if="driverForm.idCard_F">
                                <span class="upload-list-preview" @click="cardUploadPreview_F">
                                  <i class="el-icon-zoom-in"></i>
                                </span>
                                <span class="upload-list-delete" @click="cardUploadDelete_F">
                                  <i class="el-icon-delete"></i>
                                </span>
                              </span>
                            </el-upload>
                          </span>
                        </el-form-item>

                        <el-form-item class="upload-img-form" label="上传驾驶证" :prop="'idDriver_Z' && 'idDriver_F'">
                          <el-button @click="addUploadDriver" class="uploadBtn">请上传驾驶证正反面
                            <i class="iconfont">&#xe638;</i></el-button>
                          <span style="height: 41px;" v-if="driverUploadShow" v-for="(item, index) in
                          datas_upload_driver.slice(0,2)" :key="index">
                            <el-input type="text" v-model="driverForm.idDriver_Z" class="textInp"
                                      style="display: none;"></el-input>
                            <el-upload v-if="index == 0" class="avatar-uploader" :disabled="disabledDriver_Z" action=""
                                       name = 'file'
                                       :show-file-list="false"
                                       :before-upload="beforeUploadDriver_Z">
                              <img v-if="driverForm.idDriver_Z" :src="driverForm.idDriver_Z" class="avatar">
                              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                              <span class="driverUpload-hover" v-if="driverForm.idDriver_Z">
                                <span class="upload-list-preview" @click="driverUploadPreview_Z">
                                  <i class="el-icon-zoom-in"></i>
                                </span>
                                <span class="upload-list-delete" @click="driverUploadDelete_Z">
                                  <i class="el-icon-delete"></i>
                                </span>
                              </span>
                            </el-upload>
                            <el-input type="text" v-model="driverForm.idDriver_F" class="textInp" style="display: none;"></el-input>
                            <el-upload v-if="index == 1" class="avatar-uploader" :disabled="disabledDriver_F" action=""
                                       name = 'file'
                                       :show-file-list="false"
                                       :before-upload="beforeUploadDriver_F">
                              <img v-if="driverForm.idDriver_F" :src="driverForm.idDriver_F" class="avatar">
                              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                              <span class="driverUpload-hover" v-if="driverForm.idDriver_F">
                                <span class="upload-list-preview" @click="driverUploadPreview_F">
                                  <i class="el-icon-zoom-in"></i>
                                </span>
                                <span class="upload-list-delete" @click="driverUploadDelete_F">
                                  <i class="el-icon-delete"></i>
                                </span>
                              </span>
                            </el-upload>
                          </span>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="mobile">
                          <el-input type="text" v-model="driverForm.mobile" placeholder="请输入联系电话"></el-input>
                        </el-form-item>
                        <el-form-item class="btn">
                            <el-button type="primary" @click="driverIdSubitm(driverForm)">提交审核</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <el-dialog id="dialog" :visible.sync="dialogCard_Z">
          <img width="100%" :src="driverForm.idCard_Z" alt="">
        </el-dialog>
        <el-dialog id="dialog" :visible.sync="dialogCard_F">
          <img width="100%" :src="driverForm.idCard_F" alt="">
        </el-dialog>
        <el-dialog id="dialog" :visible.sync="dialogDriver_Z">
          <img width="100%" :src="driverForm.idDriver_Z" alt="">
        </el-dialog>
        <el-dialog id="dialog" :visible.sync="dialogDriver_F">
          <img width="100%" :src="driverForm.idDriver_F" alt="">
        </el-dialog>
    </div>
</template>

<script>
import { validateCardName, validateIdNo, validateUpload, validatePhone } from "../../js/validate";

export default {
    data() {
        return {
          driverForm: {  // 这里要异步请求上传图片接口了
            driverName: '',
            idCardNum: '',
            idCard_Z: '',
            idCard_F: '',
            idDriver_Z: '',
            idDriver_F: '',
            mobile: '',
          },
          driverRules: {
            driverName: [{ trigger: 'change', validator: validateCardName }],
            idCardNum: [{ trigger: 'change', validator: validateIdNo }],
            idCard_Z: [{ trigger: 'change', validator: validateUpload }],
            idCard_F: [{ trigger: 'change', validator: validateUpload }],
            idDriver_Z: [{ trigger: 'change', validator: validateUpload }],
            idDriver_F: [{ trigger: 'change', validator: validateUpload }],
            mobile: [{ trigger: 'change', validator: validatePhone }]
          },
          datas_upload_card: [{name: '', url: ''}],
          datas_upload_driver: [{name: '', url: ''}],
          //身份证用判断
          cardUploadShow: false,
          disabledCard_Z: false,
          disabledCard_F: false,
          dialogCard_Z: false,
          dialogCard_F: false,
          //驾驶证用判断
          driverUploadShow: false,
          disabledDriver_Z: false,
          disabledDriver_F: false,
          dialogDriver_Z: false,
          dialogDriver_F: false,
        }
    },
    methods: {
      //提交上传信息
      driverIdSubitm(driverForm) {
        this.$refs.driverForm.validate(valid  => {
          if (valid) {
            let _this = this;
            $.ajax({
              type: 'post',
              url: 'http://new.api.db.glchuxingwang.com/driver/api/v1/driver/add',
              dataType: 'json',
              data: {
                name: this.driverForm.driverName,
                idCard: this.driverForm.idCardNum,
                mobile: this.driverForm.mobile,
                identityCardFront: this.driverForm.idCard_Z,
                identityCardBack: this.driverForm.idCard_F,
                driverLicenseFront: this.driverForm.idDriver_Z,
                driverLicenseBack: this.driverForm.idDriver_F
              },
              success: function (response) {
                console.log(response);
                let res = response;
                if (res.code == '200') {
                  _this.$message.success('提交审核成功');
                }
              }
            })
          }
        })
      },
      //点击按钮生成身份证图片上传框
      addUploadCard() {
        if (!this.cardUploadShow) {
          this.cardUploadShow = true;
        }else {
          this.datas_upload_card.push({name: '', url: ''});
          if (this.datas_upload_card[2]) {
            this.$message.error('上传限制选择两张！！！');
          }
        }
      },
      //上传照片前的校验
      beforeUploadCard_Z(file) {
        // const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpg';
        const isJPEG = file.type === 'image/jpeg';
        const isLt10M = file.size / 1024 / 1024 < 1;
        if (!isJPG && !isJPEG) {
          this.$message.error('上传头像图片只能是PNG和JPG格式!')
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
        }
        if ((isJPG || isJPEG) && isLt10M) {
          let fd = new FormData();
          let url = 'http://new.api.db.glchuxingwang.com/driver';
          fd.append('file', file);
          var _that = this;
          $.ajax({
            type: 'post',
            url: url + '/api/v1/file/upload',
            data: fd,
            // async: false,
            cache: false,//上传文件无需缓存
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false,
            success: function (res) {
              _that.driverForm.idCard_Z = url + res.filePath;
              _that.disabledCard_Z = true;
              _that.$message.success('上传成功');
            }
          })
        }
        return isLt10M &&  isJPG && isJPEG;
      },
      beforeUploadCard_F(file) {
        // const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpg';
        const isJPEG = file.type === 'image/jpeg';
        const isLt10M = file.size / 1024 / 1024 < 1;
        if (!isJPG && !isJPEG) {
          this.$message.error('上传头像图片只能是PNG和JPG格式!')
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
        }
        if ((isJPG || isJPEG) && isLt10M) {
          let fd = new FormData();
          let url = 'http://new.api.db.glchuxingwang.com/driver';
          fd.append('file', file);
          var _that = this;
          $.ajax({
            type: 'post',
            url: url + '/api/v1/file/upload',
            data: fd,
            // async: false,
            cache: false,//上传文件无需缓存
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false,
            success: function (res) {
              _that.driverForm.idCard_F = url + res.filePath;
              _that.disabledCard_F = true;
              _that.$message.success('上传成功');
            }
          })
        }
        return isLt10M &&  isJPG && isJPEG;
      },
      //上传图片放大效果
      cardUploadPreview_Z() {
        this.dialogCard_Z = true;
      },
      cardUploadPreview_F() {
        this.dialogCard_F = true;
      },
      //身份证图片删除，重新上传
      cardUploadDelete_Z() {
        this.driverForm.idCard_Z = '';
        this.disabledCard_Z = false;
      },
      cardUploadDelete_F() {
        this.driverForm.idCard_F = '';
        this.disabledCard_F = false;
      },

      //点击按钮生成驾驶证图片上传框
      addUploadDriver() {
        if (!this.driverUploadShow) {
          this.driverUploadShow = true;
        }else {
          this.datas_upload_driver.push({name: '', url: ''});
          if (this.datas_upload_driver[2]) {
            this.$message.error('上传限制选择两张！！！');
          }
        }
      },
      //上传照片前的校验
      beforeUploadDriver_Z(file) {
        // const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpg';
        const isJPEG = file.type === 'image/jpeg';
        const isLt10M = file.size / 1024 / 1024 < 1;
        if (!isJPG && !isJPEG) {
          this.$message.error('上传头像图片只能是PNG和JPG格式!')
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
        }
        if ((isJPG || isJPEG) && isLt10M) {
          let fd = new FormData();
          let url = 'http://new.api.db.glchuxingwang.com/driver';
          fd.append('file', file);
          var _that = this;
          $.ajax({
            type: 'post',
            url: url + '/api/v1/file/upload',
            data: fd,
            // async: false,
            cache: false,//上传文件无需缓存
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false,
            success: function (res) {
              _that.driverForm.idDriver_Z = url + res.filePath;
              _that.disabledDriver_Z = true;
              _that.$message.success('上传成功');
            }
          })
        }
        return isLt10M &&  isJPG && isJPEG;
      },
      beforeUploadDriver_F(file) {
        // const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpg';
        const isJPEG = file.type === 'image/jpeg';
        const isLt10M = file.size / 1024 / 1024 < 1;
        if (!isJPG && !isJPEG) {
          this.$message.error('上传头像图片只能是PNG和JPG格式!')
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
        }
        if ((isJPG || isJPEG) && isLt10M) {
          let fd = new FormData();
          let url = 'http://new.api.db.glchuxingwang.com/driver';
          fd.append('file', file);
          var _that = this;
          $.ajax({
            type: 'post',
            url: url + '/api/v1/file/upload',
            data: fd,
            // async: false,
            cache: false,//上传文件无需缓存
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false,
            success: function (res) {
              _that.driverForm.idDriver_F = url + res.filePath;
              _that.disabledDriver_F = true;
              _that.$message.success('上传成功');
            }
          })
        }
        return isLt10M &&  isJPG && isJPEG;
      },
      //上传图片放大效果
      driverUploadPreview_Z() {
        this.dialogDriver_Z = true;
      },
      driverUploadPreview_F() {
        this.dialogDriver_F = true;
      },
      //驾驶证图片删除，重新上传
      driverUploadDelete_Z() {
        this.driverForm.idDriver_Z = '';
        this.disabledDriver_Z = false;
      },
      driverUploadDelete_F() {
        this.driverForm.idDriver_F = '';
        this.disabledDriver_F = false;
      }
    }
}
</script>

<style lang="scss">
  /*上传图片样式*/
.applyHeiPic {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('../../assets/images/driverbg.png') no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
    margin-top: -74px;
}
.applyWid {
    width: 1300px;
    margin: 0 auto;
    position: relative;
}
.applyDriver {
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
            width: 495px;
            margin: 20px auto;
            color: #333;
        }
        .uploadBtn {
          width: 400px;  //246px
          border: 1px solid #ebebeb;
          color: #c0c4cc;
          height: 40px;
          border-radius: 20px;
          text-align: left;
          i {
            float: right;
            font-size: 20px;
            color: #999;
          }
        }
      .uploadBtn.el-button:focus, .uploadBtn.el-button:hover {
          background-color: #fff;
        }
        .avatar-uploader {
          float: left;
          margin-left: 8px;
        }
        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #409EFF;
        }
        .avatar-uploader-icon {
          font-size: 18px;
          color: #8c939d;
          width: 66px;
          height: 41px;
          line-height: 41px;
          text-align: center;
        }
        .avatar {
          width: 66px;
          height: 41px;
          display: block;
        }
        label {
            width: 90px;
            display: inline-block;
        }
        input {
            width: 400px;
            border: 1px solid #ebebeb;
            border-radius: 20px;
            color: #c0c4cc;
            padding: 10px 20px;
            box-sizing: border-box;
        }
        .btn {
            text-align: center;
            button {
                width: 400px;
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
    .upload-img-form {
      .el-form-item__content {
        display: flex;
      }
      .driverUpload-hover {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 16px;
        background-color: rgba(0,0,0,.5);
        transition: opacity .3s;
        > span {
          margin: 12px 5px;
          line-height: 0!important;
          display: none;
          cursor: pointer;
        }
      }
      .driverUpload-hover:hover {
        opacity: 1;
        > span {
          display: inline-block;
        }
      }
    }
}
#dialog .el-dialog {
  width: 500px;
}
</style>

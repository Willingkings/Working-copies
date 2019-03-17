<template>
    <div class="information">
        <div class="headText">
            <b>基本资料</b>
        </div>
        <div class="infoType">
            <span>账户类型</span>
            <span v-if="userType == 3 || userType == 25">{{toggleType}}</span>
            <button @click="toggleEnter($event)" v-show="toggleType == '个人'">升级企业</button>
            <!--<button @click="toggleTour()" v-show="toggleType == '个人'">升级旅行团</button>-->
        </div>
        <el-form v-show="isShow1" :model="gerenForm" ref="gerenForm" :rules="gerenRules" name="userInfo" id="personal"
                 label-position="left">
            <el-form-item label="当前头像" prop="imgUrl">
              <el-input type="text" v-model="gerenForm.imgUrl" class="textInp" style="display: none;"></el-input>
              <el-upload class="avatar-uploader" action="" name='file' :disabled="disabled" :show-file-list="false"
                         :before-upload="beforeGerenUpload">
                <img v-if="gerenForm.imgUrl" :src="gerenForm.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <span class="upload-hover" v-if="gerenForm.imgUrl">
                  <span class="upload-list-preview" @click="gruploadPreview">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span class="upload-list-delete" @click="grUploadDelete">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </el-upload>
              <el-dialog id="dialog" :visible.sync="dialogVisible">
                <img width="100%" :src="gerenForm.imgUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item label="联系人" prop="name">
                <el-input type="text" v-model="gerenForm.name" class="textInp" name="contact"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input type="email" v-model="gerenForm.email" class="textInp" name="email"></el-input>
            </el-form-item>
            <div class="btn">
                <el-button @click="selfSumbit(gerenForm)">确认</el-button>
            </div>
        </el-form>

        <el-form v-show="isShow2 || userType == 25" :model="qiyeForm" ref="qiyeForm" :rules="qiyeRules"
                 name="enterprise" id="enterprise" label-position="left" class="clearfix">
          <el-col :span="12">
            <el-form-item label="当前头像" prop="imgUrl">
              <el-input type="text" v-model="qiyeForm.imgUrl" class="textInp" style="display: none;"></el-input>
              <el-upload class="avatar-uploader" action="" name='file' :disabled="disabledQy" :show-file-list="false"
                         :before-upload="beforeQiyeUpload">
                <img v-if="qiyeForm.imgUrl" :src="qiyeForm.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <span class="upload-hover" v-if="qiyeForm.imgUrl">
                  <span class="upload-list-preview" @click="qyuploadPreview">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span class="upload-list-delete" @click="qyUploadDelete">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </el-upload>
              <el-dialog id="dialog" :visible.sync="dialogVisibleQy">
                <img width="100%" :src="qiyeForm.imgUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item label="联系人" prop="name">
              <el-input type="text" v-model="qiyeForm.name" class="textInp" name="contact"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input type="email" v-model="qiyeForm.email" class="textInp gerenEmail" name="email"></el-input>
            </el-form-item>
            <el-form-item label="座机" prop="landline">
              <el-input type="tel" v-model="qiyeForm.landline" class="textInp"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照" prop="license" class="upload-img-qy">
              <el-button @click="addUploadLicense" class="uploadBtn">上传营业执照 <i class="iconfont">&#xe638;</i></el-button>
              <el-input type="text" v-model="qiyeForm.license" class="textInp" style="display: none;"></el-input>
              <span style="height: 55px;" v-if="licenseUploadShow">
                <el-upload class="avatar-uploader smallImg" style="margin-left: 5px;" :disabled="disabledLicense" action="" name="file" :show-file-list="false" :before-upload="beforeUploadLicense">
                  <img v-if="qiyeForm.license" :src="qiyeForm.license" class="avatar"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <span class="licenseUpload-hover" v-if="qiyeForm.license">
                    <span class="upload-preview" @click="licensePreview">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span class="upload-delete" @click="licenseDelete">
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </el-upload>
                <el-dialog id="dialog" :visible.sync="dialogLicense">
                  <img width="100%" :src="qiyeForm.license" alt="">
                </el-dialog>
              </span>
            </el-form-item>
            <el-form-item label="企业名字" prop="qyName">
              <el-input type="text" v-model="qiyeForm.qyName" class="textInp"></el-input>
            </el-form-item>
            <el-form-item label="法人姓名" prop="qyUserName">
              <el-input type="text" v-model="qiyeForm.qyUserName" class="textInp"></el-input>
            </el-form-item>
            <el-form-item label="企业地址" prop="qyAdd">
              <el-input type="text" v-model="qiyeForm.qyAdd" class="textInp"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="btn">
              <el-button @click="qiyeSumbit(qiyeForm)">确认</el-button>
            </div>
          </el-col>
        </el-form>
    </div>
</template>

<script>
import { uploadUri } from "../../js/Url";
import store from '@/store/store.js';
import { validateUsername, validateEMail, validateTelphone, validateChinese, validateUpload, validateCardName, validateAddress } from
    "../../js/validate";

export default {
    inject: ['reload'], //注入依赖
    data() {
        return {
          dialogVisible: false,
          disabled: false,
          dialogVisibleQy: false,
          disabledQy: false,
          uptoken: {
            token: '',
            key: ""
          },
            isShow1: true,
            isShow2: null,
            isShow3: null,
            toggleType: "",
            memberId: sessionStorage.getItem('memberId'),
            userType: sessionStorage.getItem('userType'),
            // userType: 3,
            gerenForm: {
              imgUrl: '',
              name: '',
              email: '',
            },
            gerenRules: {
              imgUrl: [{ required: true, trigger: 'change', validator: validateUpload }],
              name: [{ required: true, trigger: 'change', validator: validateUsername }],
              email: [{ required: true, trigger: 'change', validator: validateEMail }]
            },
            qiyeForm: {
              imgUrl: '',
              name: '',
              email: '',
              landline: '',
              license: '',
              qyName: '',
              qyUserName: '',
              qyAdd: '',
            },
            qiyeRules: {
              imgUrl: [{ trigger: 'change', validator: validateUpload }],
              name: [{ trigger: 'change', validator: validateUsername }],
              email: [{ trigger: 'change', validator: validateEMail }],
              landline: [{ trigger: 'change', validator: validateTelphone }],
              license: [{ trigger: 'change', validator: validateUpload }],
              qyName: [{ trigger: 'change', validator: validateChinese }],
              qyUserName: [{ trigger: 'change', validator: validateCardName }],
              qyAdd: [{ trigger: 'change', validator: validateAddress }]
            },
            licenseUploadShow: false,
            disabledLicense: false,
            dialogLicense: false
        }
    },
    created() {
      if (this.userType == 3) {
        this.toggleType = '个人';
      }else if (this.userType == 25) {
        this.toggleType = '企业';
        this.isShow1 = false;
      }
    },
    methods: {
        toggleEnter(event) {
          event.preventDefault(); //取消默认行为
          this.toggleType = "企业";
          this.isShow2 = true;
          this.isShow1 = false;
        },
        //个人资料
        selfSumbit(gerenForm) {
          this.$refs.gerenForm.validate(valid => {
            if (valid) {
              let _this = this;
              $.ajax({
                type: 'post',
                url: 'http://new.api.db.glchuxingwang.com/customer/api/v1/user/updateUserInfo',
                dataType: 'json',
                data: {
                  contact: this.gerenForm.name,
                  email: this.gerenForm.email,
                  head: this.gerenForm.imgUrl,
                  memberId: this.memberId,
                  userType: this.userType
                },
                success: function (response) {
                  let res = response;
                  if (res.code == '200') {
                    _this.$message.success('更新资料成功');
                    store.commit('newUserHead',_this.gerenForm.imgUrl);
                    _this.reload();
                  }
                }
              })
            }
          })
        },
        //升级企业资料
        qiyeSumbit(qiyeForm) {
          this.$refs.qiyeForm.validate(valid => {
            if (valid) {
              let _this = this;
              $.ajax({
                type: 'post',
                url: 'http://new.api.db.glchuxingwang.com/customer/api/v1/user/updateUserInfo',
                dataType: 'json',
                data: {
                  contact: this.qiyeForm.name,
                  email: this.qiyeForm.email,
                  head: this.qiyeForm.imgUrl,
                  memberId: this.memberId,
                  userType: this.userType
                },
                success: function (response) {
                  let res = response;
                  if (res.code == '200') {
                    _this.$message.success('更新资料成功');
                    store.commit('newUserHead',_this.gerenForm.imgUrl);
                    _this.reload();
                  }
                }
              })
            }
          })
        },
        //个人头像
        beforeGerenUpload(file) {
          // const isPNG = file.type === 'image/png';
          const isJPG = file.type === 'image/jpg';
          const isJPEG = file.type === 'image/jpeg';
          const isLt1M = file.size / 1024 / 1024 <= 1;
          if (!isJPG && !isJPEG) {
            this.$message.error('上传头像图片只能是JPG或JPEG格式！')
          }
          if (!isLt1M) {
            this.$message.error('上传头像图片大小不能超过 1MB!')
          }
          if ((isJPG || isJPEG) && isLt1M) {
            let fd = new FormData();
            let url = 'http://new.api.db.glchuxingwang.com/customer';
            fd.append('file', file);
            let _this = this;
            $.ajax({
              type: 'post',
              url: url + '/api/v1/upload/head',
              data: fd,
              // async: false,
              cache: false,//上传文件无需缓存
              processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
              contentType: false,
              success: function (res) {
                _this.gerenForm.imgUrl = url + res.filePath;
                _this.disabled = true;
                _this.$message.success('上传成功');
              }
            })
          }
          return isLt1M && isJPG && isJPEG;
        },
        //企业头像
        beforeQiyeUpload(file) {
          // const isPNG = file.type === 'image/png';
          const isJPG = file.type === 'image/jpg';
          const isJPEG = file.type === 'image/jpeg';
          const isLt1M = file.size / 1024 / 1024 <= 1;
          if (!isJPG && !isJPEG) {
            this.$message.error('上传头像图片只能是JPG或JPEG格式！')
          }
          if (!isLt1M) {
            this.$message.error('上传头像图片大小不能超过 1MB!')
          }
          if ((isJPG || isJPEG) && isLt1M) {
            let formDate = new FormData();
            let url = 'http://new.api.db.glchuxingwang.com/customer';
            formDate.append('file', file);
            let _this = this;
            $.ajax({
              type: 'post',
              url: url + '/api/v1/upload/head',
              data: formDate,
              cache: false,
              processData: false,
              contentType: false,
              success: function (res) {
                _this.qiyeForm.imgUrl = url + res.filePath;
                _this.disabledQy = true;
                _this.$message.success('上传成功');
              }
            })
          }
          return isLt1M && isJPG && isJPEG;
        },
        gruploadPreview() {  //个人放大效果
          this.dialogVisible = true;
        },
        qyuploadPreview() {  //企业放大效果
        this.dialogVisibleQy = true;
      },
        grUploadDelete() {   //删除个人头像
          this.gerenForm.imgUrl = '';
          this.disabled = false;
        },
        qyUploadDelete() {   //删除企业头像
          this.qiyeForm.imgUrl = '';
          this.disabledQy = false;
        },
        //企业营业执照上传
        beforeUploadLicense(file) {
          // const isPNG = file.type === 'image/png';
          const isJPG = file.type === 'image/jpg';
          const isJPEG = file.type === 'image/jpeg';
          const isLt1M = file.size / 1024 / 1024 <= 1;
          if (!isJPG && !isJPEG) {
            this.$message.error('上传头像图片只能是JPG或JPEG格式！')
          }
          if (!isLt1M) {
            this.$message.error('上传头像图片大小不能超过 1MB!')
          }
          if ((isJPG || isJPEG) && isLt1M) {
            let formDate = new FormData();
            let url = 'http://new.api.db.glchuxingwang.com/customer';
            formDate.append('file', file);
            let _this = this;
            $.ajax({
              type: 'post',
              url: url + '/api/v1/upload/head',
              data: formDate,
              cache: false,
              processData: false,
              contentType: false,
              success: function (res) {
                _this.qiyeForm.license = url + res.filePath;
                _this.disabledLicense = true;
                _this.$message.success('上传成功');
              }
            })
          }
          return isLt1M && isJPG && isJPEG;
        },
        addUploadLicense() {
          if (!this.licenseUploadShow) {
            this.licenseUploadShow = true;
          }else {
            this.$message.error('上传限制选择一张！！！');
          }
        },
        licensePreview() {
          this.dialogLicense = true;
        },
        licenseDelete() {
          this.qiyeForm.license = '';
          this.disabledLicense = false;
        }
    },
  mounted() {
  }
}
</script>

<style lang="scss">
.information {
    background-color: #fff;
    padding: 30px;
    .headText {
        font-size: 18px;
    }
    .headText b:first-child, .infoType span:first-child {
        width: 80px;
        display: inline-block;
        margin-right: 30px;
    }
    .infoType {
        padding: 15px 0;
        button {
            background-color: #fe4a54;
            color: #fff;
            border: 1px solid #ff2b35;
            margin-left: 16px;
            border-radius: 20px;
            padding: 4px 12px;
            cursor: pointer;
        }
    }
  .upload-img-qy .licenseUpload-hover {
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
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s;
    > span {
      margin: 22px 3px;
      line-height: 0!important;
      display: none;
      cursor: pointer;
    }
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
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px!important;
    text-align: center;
  }
  .smallImg .avatar-uploader-icon {
    width: 60px;
    height: 60px;
    line-height: 60px!important;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .smallImg .avatar {
    width: 60px;
    height: 60px;
    display: block;
  }
  .upload-hover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s;
    > span {
      margin: 40px 5px;
      line-height: 0!important;
      display: none;
      cursor: pointer;
    }
  }
  .upload-hover:hover, .upload-img-qy .licenseUpload-hover:hover {
    opacity: 1;
    > span {
      display: inline-block;
    }
  }
}
#personal label, #enterprise label, #tourGroup label {
    width: 80px;
    display: inline-block;
    margin-right: 6px;
}
#personal .textInp, #enterprise .textInp, #tourGroup .textInp {
    width: 240px;
    display: inline-block;
    box-sizing: border-box;
    input {
      background-color: #efeef4;
      height: 40px;
      line-height: 40px;
      border-radius: 8px;
    }
}
#personal .el-form-item__error, #tourGroup .el-form-item__error{
  padding-left: 90px;
}
#enterprise .el-form-item__content {
  display: flex;
  .uploadBtn {
    width: 240px;
    height: 40px;
    background: #efeef4;
    border-radius: 8px;
    color: #808080;
    text-align: left;
    i {
      float: right;
      font-size: 20px;
      color: #999;
    }
  }
  .el-button:focus, .el-button:hover {
    border-color: #c0c4cc;
  }
}
.information .btn {
    text-align: center;
    padding: 20px 0;
    button {
        width: 100px;
        background-color: #fe4a54;
        color: #fff;
        border: 1px solid #ff2b35;
        margin-left: 16px;
        border-radius: 20px;
        padding: 10px 20px;
        font-size: 20px;
        cursor: pointer;
    }
}
#dialog .el-dialog {
  width: 500px;
}
</style>


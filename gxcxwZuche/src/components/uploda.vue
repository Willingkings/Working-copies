<template>
  <div class="flex-img">
    <div class="el-upload-list el-upload-list--picture-card" v-show="hideShow">
      <div class="el-upload-list__item is-success">
        <img class="flex-img__image" :src="image">
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-check"></i>
        </label>
        <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-delete">
                        <i class="el-icon-delete" @click.stop="handleRemove()"></i>
                    </span>
                </span>
      </div>
    </div>
    <el-upload
      class="image-uploader"
      :http-request="uploda"
      action=""
      :show-file-list="false"
      accept="image/jpeg,image/jpg,image/png"
      :on-success="imageUploadSuccess"
      :before-upload="beforeUpload"
      v-show="!hideShow">
      <i class="el-icon-plus"></i>
    </el-upload>
    <!--<div slot="tip" class="el-upload__tip">尺寸宽度不低于640，高度不限制，支持jpg、png格式，1张上限</div>-->
  </div>
</template>

<script>
export default {
  props: ['image', 'clearList'],
  data() {
    return {
      uploadUrl: `http://new.api.db.glchuxingwang.com/customer/api/v1/upload/head`,//图片上传网址
      file: this.image ? this.image : '',
    };
  },
  watch: {
    image(value) {
      this.file = value
      console.log('爷爷', value)
    },
    clearList() {
      this.file = '';
    },
    file(value) {
      console.log('来了', value)
      const list = value;
      this.$emit('update:image', list);
    }
  },
  computed: {
    hideShow() {//当图片多于一张的时候，就隐藏上传框
      return this.file === '' ? false : true
    },
  },
  created() {

  },
  methods: {
    uploda(param) {
      let fileObj = param.file;
      let FileController = this.uploadUrl;
      let form = new FormData();
      form.append('file', fileObj);
      let xhr = new XMLHttpRequest();
      xhr.open('post', FileController, true);
      xhr.onload = function () {
        let res = xhr.response.data;
        this.image = res.filePath;
      };
      xhr.send(form);
    },
    imageUploadSuccess(response) {
      const {data: {url}} = response;
      this.file = url;
    },
    beforeUpload(file) {
      const imageSize = file.size / 1024 / 1024 < 1;//上传图片大小不超过1M
      if (!imageSize) {
        this.$message.error('上传封面大小不能超过 1MB!');
      }
      return imageSize;
    },
    handleRemove() {
      this.file = '';
    },
  }
}
</script>

<style lang="scss">
  .flex-img {
    display: flex;
  }

  .image-uploader {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: auto;
    cursor: pointer;
    line-height: 146px;
    vertical-align: top;
    text-align: center
  }

  .image-uploader {
    font-size: 28px;
    color: #8c939d;
  }

  .image-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .flex-img__image {
    width: 146px;
    height: auto;

    border-radius: 6px;
  }


  .disabled {
    display: none;
  }

  .el-upload--picture-card {
    height: auto
  }

  .el-upload-list--picture-card .el-upload-list__item {
    height: auto;
  }

  .el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: auto;
    margin: 0 8px 8px 0;
    display: inline-block;
  }

  .el-upload-list__item.is-success .el-upload-list__item-status-label {
    display: block;
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
  }

  .el-upload-list--picture-card .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
  }
</style>

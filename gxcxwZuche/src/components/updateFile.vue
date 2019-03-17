<template>
  <el-upload
    action=""
    accept="image/jpeg,image/gif,image/png,image/bmp"
    class="upload-demo"
    ref="upload"
    :auto-upload='false'
    :on-change='changeUpload'>

    <div size="small" class="upload_btn">点击上传</div>
  </el-upload>
</template>
<script>
  export default {
    name: 'regShopImg',
    data () {
      return {
        imageUrl: '',
        imgthing: {}
      }
    },
    props: ['imgN', 'nameN'],
    methods: {
      changeUpload (file, fileList) {
        console.log(file)
        // 判断图片大小
        if (fileList[0].size < 1100000) {
          // 判断图片格式是否为jpg,png,jepg,gif
          var fileName = fileList[0].name
          // var suffixIndex=fileName.lastIndexOf(".")
          // var suffix=fileName.substring(suffixIndex+1).toUpperCase()
          var suffix = fileName.substring(fileName.lastIndexOf(".")+1).toUpperCase()
          if (suffix=="BMP"||suffix=="JPG"||suffix=="JPEG"||suffix=="PNG"||suffix=="GIF") {
            this.fileList = fileList
            this.$nextTick(
              () => {
                console.log(this)
//                var i = this.imgN
                var i = 0
                let uploadLists = document.getElementsByClassName('el-upload-list')
                let uploadListsN = uploadLists[i]
                let uploadListLi = uploadListsN.children
                uploadListsN.setAttribute('style', 'position: absolute;height: 160px;margin-top: 0;margin-left: 300px;width: 260px;overflow: hidden')
                let liA = uploadListLi[0]
                // 试着获取bolb里面的数据------------S
                // 获取图片的Blob值
                function getImageBlob(url, cb) {
                  var xhr          = new XMLHttpRequest()
                  xhr.open("get", url, true)
                  xhr.responseType = "blob"
                  xhr.onload       = function() {
                    if (this.status == 200) {
                      if(cb) cb(this.response)
                    }
                  }
                  xhr.send()
                }
                function preView(url){
                  let reader    = new FileReader()
                  getImageBlob(url, function(blob){
                    reader.readAsDataURL(blob)
                  })
                  reader.onload = function(e) {
                    // 获取bolb里面数据时,生成预览
                    var img = document.createElement("img")
                    img.src = e.target.result
                    // 获取bolb里面数据时,生成预览
                    let imgElement = document.createElement('img')
                    imgElement.setAttribute('src', fileList[0].url)
                    imgElement.setAttribute('style', 'max-width:100%;padding-left:0')
                    if (liA.lastElementChild.nodeName !== 'IMG') {
                      liA.appendChild(imgElement)
                    }
                    // 把base64的信息放到imgthing的file里
                    file.base64 = e.target.result
                  }
                }
                preView(fileList[0].url)
                // 试着获取bolb里面的数据-------------E
                // 不获取bolb里面数据时,生成预览
                // let imgElement = document.createElement('img')
                // imgElement.setAttribute('src', fileList[0].url)
                // imgElement.setAttribute('style', 'max-width:100%;padding-left:0')
                // if (liA.lastElementChild.nodeName !== 'IMG') {
                //   liA.appendChild(imgElement)
                // }
              }
            )
            // 修改nameN名字对应的数据,在一个页面使用多个不同字段图片上传，为了复用组件
            if (this.nameN === 'identityCardFront') {
              this.imgthing.identityCardFront = file
            }
            if (this.nameN === 'identityCardBack') {
              this.imgthing.identityCardBack = file
            }
            if (this.nameN === 'driverLicenseFront') {
              this.imgthing.driverLicenseFront = file
            }
            if (this.nameN === 'driverLicenseBack') {
              this.imgthing.driverLicenseBack = file
            }
            this.$emit('imgthing', this.imgthing)
          } else {
            this.$message.error('文件类型不正确,请重新上传！')
          }
        } else {
          this.$message.error('图片大小超过1M,请重新上传')
        }
      }
    }
  }
</script>

<style lang="scss">
  // 上传
  .upload-demo{
    width:190px;float: left;margin-right: 12px;
    ul {
      position: relative !important;
      margin-left: 0 !important;
    }
    .upload_btn{
      width:190px;
      width: 100%;
      background-color: #FE4A54;
      border-color: #FE4A54;
      border-radius: 8px;
      color: #fff;
      padding: 10px 14px;
      font-size: 18px;
      margin-right: 10px;
    }
    .el-upload__tip{
      margin:0;float:left
    }
  }
</style>


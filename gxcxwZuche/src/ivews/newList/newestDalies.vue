<template>
  <main>
    <div class="newBread"></div>
    <div class="pagecon" v-for="item in newsDalies" v-if="item.id">
      <h1 class="pagetit">{{item.title}}</h1>
      <div class="pagecontent" v-html="item.content"></div>
    </div>
  </main>
</template>

<script>
export default {
  name: "newestDalies",
  data() {
    return {
      newsDalies: [ ]
    }
  },
  activated() {
    let _this = this;
    let newsId = this.$route.query.id;
    $.ajax({
      type: 'get',
      url:
        'http://admin.distribute.glchuxingwang.com/api/v1/stl/contents?siteId=19&channelId=20&startNum=1&totalNum=10',
      dataType: 'json',
      data: {
        id: newsId
      },
      headers: {'Content-Type': 'application/json;charset=utf8','X-SS-API-KEY':'0a9afe07-c124-4a7a-8e43-69d0d2019ea1'},
      success: function (res) {
        _this.newsDalies = res.value;
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == 'newest') {
      to.meta.isUseCache = true;
      next();
    }else if (to.name == 'indexZhu') {
      to.meta.isUseCache = true;
      next();
    }else {
      this.$destroy();//销毁B的实例
      next();
    }
  },
}
</script>

<style lang="scss">
.pagecon {
  .pagetit {
    text-align: center;
    font-size: 24px;
    margin: 20px 0;
  }
}
</style>

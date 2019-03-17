<template>
	<main>
    <div class="newBread">最新资讯</div>
    <div class="newslist" v-for="item in newList">
      <div class="newsItem">
        <div class="el-row">
          <div class="el-col-md-8">
            <router-link :to="{path: '/newList/newest/dalies',query:{id:item.id} }">
              <img :src="item.imageUrl" alt="">
            </router-link>
          </div>
          <div class="el-col-md-16">
            <h1 class="casetitle">
              <router-link :to="{path: '/newList/newest/dalies',query:{id:item.id} }">{{item.title}}</router-link>
            </h1>
            <div class="newsTag">发布时间：{{item.addDate}}</div>
            <p class="newszy"></p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "newest",
  data() {
      return {
        newList: [ ]
      }
  },
  activated() {
    let _this = this;
    $.ajax({
      type: 'get',
      url:
        'http://admin.distribute.glchuxingwang.com/api/v1/stl/contents?siteId=19&channelId=20&startNum=1&totalNum=10',
      dataType: 'json',
      data: { },
      headers: {'Content-Type': 'application/json;charset=utf8','X-SS-API-KEY':'0a9afe07-c124-4a7a-8e43-69d0d2019ea1'},
      success: function (res) {
        _this.newList = res.value;
      }
    })
  },
}
</script>

<style lang="scss">

</style>

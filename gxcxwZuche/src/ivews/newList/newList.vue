<template>
  <div class="newBox clearfix">
    <div class="container clearfix">
      <div class="asideMenu">
        <ul class="menuList">
          <li><router-link :to="{path: '/newList/newest'}">最新资讯</router-link></li>
          <!--<li><router-link :to="{path: '/newList/travel'}">旅游资讯</router-link></li>-->
          <!--<li><router-link :to="{path: '/newList/company'}">企业资讯</router-link></li>-->
        </ul>
      </div>
      <div class="newsMain">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    name: "newList"
}
</script>

<style lang="scss">
.newBox {
  .container {
    padding-top: 40px;
    width: 1200px;
    margin: 0 auto;
    .asideMenu {
      width: 266px;
      height: 650px;
      background: #fff;
      margin-right: 34px;
      margin-bottom: 50px;
      float: left;
      .menuList {
        text-align: center;
        padding: 20px;
        li {
          margin-bottom: 20px;
        }
        li a {
          display: inline-block;
          padding: 12px 0;
          color: #999;
        }
        li .active {
          font-weight: bold;
          color: #000;
        }
      }
    }
    .newsMain {
      width: 900px;
      background: #fff;
      padding: 30px;
      float: right;
      overflow: hidden;
      box-sizing: border-box;
    }
  }
}
.newBread {
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e5e5
}
.newsItem {
  padding: 30px 0;
  border-bottom: 1px dashed #e5e5e5;
  .el-row > div {
    padding-left: 15px;
    padding-right: 15px;
  }
  img {
    width: 100%;
    height: auto;
  }
  h1 {
    font-size: 20px;
    font-weight: bold;
    margin: 10px 0;
    a { color: #333; }
  }
  .newsTag {
    color: #999;
    margin-right: 10px;
    font-size: 12px;
  }
  .newszy {
    color: #666;
    line-height: 22px;
    margin-top: 10px;
    margin-bottom: 0;
  }
}
</style>

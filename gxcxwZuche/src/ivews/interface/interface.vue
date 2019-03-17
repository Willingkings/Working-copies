<template>
  <div class="aboutBox clearfix">
    <div class="container clearfix">
      <div class="asideMenu">
        <ul class="menuList">
          <li><router-link :to="{path: '/interface/index'}">首页介绍</router-link></li>
          <li><router-link :to="{path: '/interface/zhinan'}">接入指南</router-link></li>
          <li><router-link :to="{path: '/interface/apiShouce'}">API手册</router-link></li>
          <li><router-link :to="{path: '/interface/question'}">常见问题</router-link></li>
          <li><router-link :to="{path: '/interface/contact'}">联系我们</router-link></li>
          <li><router-link :to="{path: '/interface/website'}">跳转到开放平台网站</router-link></li>
        </ul>
      </div>
      <div class="aboutMain">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="scss">
  .aboutBox {
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
    }
  }
  .aboutMain {
    width: 900px;
    /*height: 650px;*/
    background: #fff;
    padding: 30px;
    float: right;
    overflow: hidden;
    box-sizing: border-box;
    p {
      margin-bottom: 20px;
      line-height: 1.6;
      text-indent: 2em;
    }
  }
</style>

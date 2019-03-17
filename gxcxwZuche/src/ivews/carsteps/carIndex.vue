<template>
    <div style="background: #fff;">
      <main class="stepBox clearfix">
        <!-- 分步 -->
        <el-steps :space="214" :active="step" align-center class="step">
          <el-step title="选择用车类型" description=""></el-step>
          <el-step title="填写行程信息" description=""></el-step>
          <el-step title="发布用车需求" description=""></el-step>
          <el-step title="等待车队报价" description=""></el-step>
          <el-step title="支付定金" description=""></el-step>
          <el-step title="费用结算" description=""></el-step>
        </el-steps>
        <div class="mainChild clearfix">
          <!-- 左侧导航 -->
          <div class="main-left">
            <ul class="carPathList">
              <li><router-link :to="{path: '/carIndex/oneDayCar'}">单日用车</router-link></li>
              <li><router-link :to="{path: '/carIndex/multiDayCar'}">多日用车</router-link></li>
              <li><router-link :to="{path: '/carIndex/oneWayCar'}">单程用车</router-link></li>
              <li><router-link :to="{path: '/carIndex/returmWayCar'}">往返用车</router-link></li>
            </ul>
          </div>
          <!-- 右侧主内容区 -->
          <div class="main-right">
            <transition name="fade">
              <router-view class="view"></router-view>
            </transition>
          </div>
        </div>
        <v-toolbar></v-toolbar>
      </main>
    </div>
</template>

<script>
import toolbar from "@/components/toolbar"
export default {
    components: {
        'v-toolbar': toolbar
    },
    data() {
        return {
            step: 2
        }
    }
}
</script>

<style lang="scss">
.stepBox {
    width: 1300px;
    margin: 0 auto;
    padding: 60px 0;
}
/* 左侧导航 */
.mainChild {
    margin: 40px 50px;
}
.main-left {
    width: 266px;
    margin-right: 34px;
    float: left;
    .carPathList {
        border: 1px solid #999;
        padding: 30px;
    }
    li {
        margin: 20px 0;
        line-height: 80px;
    }
    li a {
        display: inline-block;
        font-size: 24px;
        color: #333;
    }
    li a.active {
        width: 210px;
        height: 75px;
        color: #fff;
        margin-left: -40px;
        padding-left: 40px;
        background: url('../../../src/assets/images/label.png') no-repeat;
    }
}
/* 右侧主内容区 */
.main-right {
    width: 900px;
    float: right;
}
/* 路由切换动效 */
.fade-enter-active, .fade-leave-active {
    transition: all .5s;
}
.fade-enter, .fade-leave-active {
    opacity: 0;
}
</style>

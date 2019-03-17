<template>
    <div class="toolbar">
        <div class="list">
          <router-link :to="{path:'/order/myNews'}">
            <el-badge :value="12" class="item">
                <span class="iconfont">&#xe633;</span>
            </el-badge>
            <p>消息</p>
          </router-link>
        </div>
        <div class="list">
          <router-link :to="{path:'/order/feedback'}">
            <span class="iconfont">&#xe632;</span>
            <p>留言</p>
          </router-link>
        </div>
        <div class="list">
          <router-link :to="{path:'/interface/contact'}">
            <el-badge is-dot class="item-dot">
                <span class="iconfont">&#xe62f;</span>
            </el-badge>
            <p>客服</p>
          </router-link>
        </div>
        <div class="list">
            <span class="iconfont" @click="scrollToTop(step)">&#xe634;</span>
            <p>顶部</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        step: {
            type: Number,
            default: 50
        }
    },
    methods: {
        scrollToTop(i) {
            document.documentElement.scrollTop -= i;
            if(document.documentElement.scrollTop > 0) {
                setTimeout(() => this.scrollToTop(i), 30);
            }else{
                clearTimeout();
            }
        }
    }
}
</script>

<style lang="scss">
.toolbar {
    width: 76px;
    background-color: white;
    position: fixed;
    top: 50%;
    right: 20px;
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .5);
    -moz-box-shadow: 0 2px 8px rgba(0, 0, 0, .5);
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, .5);
    transition: .3s;
    z-index: 100;
    .list {
        text-align: center;
        padding: 16px 10px;
        border-bottom: 1px solid #EFEFEF;
        cursor: pointer;
        a {
          color: #2c3e50;
        }
        span {
            font-size: 34px;
            margin-bottom: 6px;
            display: block;
        }
    }
    .item .el-badge__content.is-fixed {
        top: 16px;
        right: 15px;
        background-color: #FE4A54;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        padding: 0;
    }
    .item-dot .el-badge__content.is-dot {
        width: 12px;
        height: 12px;
        right: 12px;
        top: 8px;
        background-color: #FE4A54;
    }
    .list:hover {
        background: #cccc;
    }
}
</style>

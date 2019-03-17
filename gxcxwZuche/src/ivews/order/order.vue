<template>
    <div class="orderBox clearfix">
        <div class="container clearfix">
            <div class="asideMenu">
                <div class="selfMy" @click="clickme">
                    <router-link :to="{path:'/order/information'}">
                        <div class="phone">
                            <img :src="userHead" alt="">
                        </div>
                        <p>{{userName}}</p>
                        <p>{{userPhone}}</p>
                    </router-link>
                </div>
                <ul class="menuList">
                    <li><router-link :to="{path:'/order/information'}">个人资料</router-link></li>
                    <li><router-link :to="{path:'/order/myOrder'}">我的订单</router-link></li>
                    <li><router-link :to="{path:'/order/accountSettings'}">账号设置</router-link></li>
                    <li><router-link :to="{path:'/order/myAccount'}">我的财务</router-link></li>
                    <li><router-link :to="{path:'/order/myNews'}">我的消息</router-link></li>
                    <li><router-link :to="{path:'/order/commonly'}">常用信息</router-link></li>
                    <li><router-link :to="{path:'/order/helpCenter'}">帮助中心</router-link></li>
                    <li><router-link :to="{path:'/order/feedback'}">反馈建议</router-link></li>
                </ul>
            </div>
            <div class="orderMain">
                <keep-alive>
                  <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "order",
    data() {
        return {
          userHead: '',
          userName: '',
          userPhone: ''
        }
    },
    activated() {
      this.clickme();
    },
    methods: {
      clickme() {
        this.userHead = sessionStorage.getItem('memberHead');
        this.userName = sessionStorage.getItem('memberName');
        this.userPhone = sessionStorage.getItem('loginName');
      }
    }
}
</script>

<style lang="scss">
.orderBox {
    background: #efefef;
    .container {
        padding-top: 40px;
        width: 1200px;
        margin: 0 auto;
    }
}
.asideMenu {
    width: 266px;
    margin-right: 34px;
    float: left;
}
.selfMy {
    background-color: #fff;
    text-align: center;
    padding: 24px 20px 12px;
    margin-bottom: 5px;
    a {
      color: #333;
    }
    .phone {
        width: 80px;
        height: 80px;
        background: #000;
        border-radius: 40px;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid #ccc;
        }
    }
}
.menuList {
    background: #fff;
    text-align: center;
    padding: 20px;
    li a {
        display: inline-block;
        padding: 10px 0;
        color: #b8b8b8;
    }
    li .active {
        font-weight: bold;
        color: #000;
    }
}
.orderMain {
    width: 900px;
    float: left;
}
</style>

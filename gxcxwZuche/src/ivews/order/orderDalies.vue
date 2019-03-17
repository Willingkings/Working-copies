<template>
    <div class="orderDalies clearfix">
        <div class="headText clearfix">
            <b>订单详情</b>
            <div class="btn">
                <!--<button class="disable">打印</button>-->
                <button @click="goBack">返回</button>
            </div>
        </div>
        <table class="daliesTable">
            <tbody>
                <tr>
                    <td>使用车型：</td>
                    <td>{{ordertable.orderType}}</td>
                    <!--<td v-if="ordertable.orderType == 1">单日用车</td>-->
                    <!--<td v-if="ordertable.orderType == 2">多日用车</td>-->
                    <!--<td v-if="ordertable.orderType == 3">单程用车</td>-->
                    <!--<td v-if="ordertable.orderType == 4">返程用车</td>-->
                </tr>
                <tr>
                  <td>团号：</td>
                  <td>{{ordertable.groupNumber}}</td>
                </tr>
                <tr>
                    <td>出发时间：</td>
                    <td>{{ordertable.beginDate}}</td>
                </tr>
                <tr>
                    <td>出发地点：</td>
                    <td>{{ordertable.fromCity}}</td>
                </tr>
                <tr>
                    <td>途径地点：</td>
                    <td>{{ordertable.crossCity}}</td>
                    <td v-for="itemDalies in ordertable.crossCitys">{{itemDalies.propertyValue}}</td>
                </tr>
                <tr>
                    <td>目的地：</td>
                    <td>{{ordertable.aimCity}}</td>
                </tr>
                <tr>
                    <td>联系人：</td>
                    <td>{{ordertable.name}}</td>
                </tr>
                <tr>
                    <td>手机号码：</td>
                    <td>{{ordertable.phone}}</td>
                </tr>
                <tr>
                    <td>用车人数：</td>
                    <td>{{ordertable.person}}人</td>
                </tr>
                <tr>
                    <td>用车数量：</td>
                    <td>{{ordertable.carNumber}}辆</td>
                </tr>
                <tr>
                    <td>车辆座位：</td>
                    <td>{{ordertable.person}}座 * {{ordertable.carNumber}}辆</td>
                </tr>
                <tr>
                    <td>订单状态：</td>
                    <td>{{ordertable.orderStatus}}</td>
                </tr>
                <tr>
                    <td>预付定金：</td>
                    <td>{{ordertable.payment}}</td>
                </tr>
                <tr>
                    <td>订单价格：</td>
                    <td>{{ordertable.price}}</td>
                </tr>
                <tr>
                    <td>司机：</td>
                    <td>{{ordertable.driver}}</td>
                </tr>
                <tr>
                    <td>司机手机：</td>
                    <td>{{ordertable.driverTal}}</td>
                </tr>
                <tr>
                    <td>车牌号：</td>
                    <td>{{ordertable.plateNum}}</td>
                </tr>
                <tr>
                    <td>订单号：</td>
                    <td>{{ordertable.orderNo}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'orderDalies',
    data() {
        return {
            ordertable: {},
            isBack: false,
        }
    },
    activated() {
      this.loingDelies();
    },
    // watch: {
    //   // 如果路由有变化，会再次执行该方法
    //   '$route': 'loingDelies'
    // },
    methods: {
      loingDelies: function () {
        let _this = this;
        let daliseId = this.$route.query.id;
        $.ajax({
          type: 'get',
          url: 'http://new.api.db.glchuxingwang.com/sales/order/orderDetail',
          data: {
            id: daliseId,
          },
          success: function (response) {
            let res = response;
            _this.ordertable = res;
          }
        })
      },
      goBack() {
        this.isBack = true;
        this.$router.go(-1);
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.name == 'myOrder') {
        to.meta.isUseCache = !this.isBack;
        next();
      }else {
        this.$destroy();//销毁B的实例
        next();
      }
    },
    // beforeRouteEnter(to, from, next) {
    //   next()
    // }
}
</script>

<style lang="scss">
.orderDalies {
    background: #fff;
    padding: 20px 30px;
    .headText {
        font-size: 20px;
        margin-bottom: 10px;
        .btn {
            float: right;
            .disable {
              background: #999;
              border: 1px solid #999;
              cursor: no-drop;
            }
        }
        button {
            width: 100px;
            background-color: #fe4a54;
            color: #fff;
            border: 1px solid #ff2b35;
            margin-left: 10px;
            border-radius: 20px;
            padding: 7px 20px;
            font-size: 18px;
            cursor: pointer;
        }
    }
}
.daliesTable, .daliesTable tbody, .daliesTable td {
    border: 1px solid #ccc;
    border-collapse: collapse;
    padding: 4px 10px;
}
.daliesTable {
    width: 100%;
    margin: 15px 0;
}
.daliesTable td:first-child {
    width: 110px;
}
</style>

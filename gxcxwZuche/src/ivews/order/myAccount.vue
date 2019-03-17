<template>
    <div>
        <div class="tabNavigation clearfix">
            <b v-for="(tab, index) in tabs">
                <span :class="{active:tab.isActive}" @click="tabChange(index)">{{tab.name}}</span>
            </b>
        </div>
        <div class="tabContent">
          <div class="tab-card" style="display: block;">
            <div class="tabList" v-for="item in invoiceItem">
              <div class="orderNum">
                <div class="label-num">
                  <span class="label-order">{{item.orderType}}</span>
                  <span class="texthui">订单号：{{item.orderNo}}</span>
                </div>
                <div class="btn">
                  <button><router-link :to="{ path: '/order/myOrder/dalies', query:{id:item.id} }">订单详情</router-link></button>
                </div>
              </div>
              <div class="timeCon clearfix">
                <div class="timeText">
                  <p>出发日期：{{item.beginDate}}</p>
                  <p class="small">出发城市：{{item.fromCity}}</p>
                  <p class="small" v-if="item.endAdd">到达地点：{{item.endAdd}}</p>
                </div>
                <div class="number">
                  <p>￥{{item.price}}</p>
                  <p>订单金额</p>
                </div>
                <div class="btn">
                  <p>{{item.status}}</p>
                  <p><button>下载发票</button></p>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-card">
            <div class="tabList" v-for="item in billItem">
              <div class="orderNum">
                <div class="label-num">
                  <span class="label-order">{{item.orderType}}</span>
                  <span class="texthui">订单号：{{item.orderNo}}</span>
                </div>
                <div class="btn">
                  <button><router-link :to="{ path: '/order/myOrder/dalies', query:{id:item.id} }">订单详情</router-link></button>
                </div>
              </div>
              <div class="timeCon clearfix">
                <div class="timeText">
                  <p>出发日期：{{item.beginDate}}</p>
                  <p class="small">出发城市：{{item.fromCity}}</p>
                  <p class="small" v-if="item.endAdd">到达地点：{{item.endAdd}}</p>
                </div>
                <div class="number">
                  <p>￥{{item.price}}</p>
                  <p>订单金额</p>
                </div>
                <div class="btn">
                  <p class="payRed">尾款 {{item.money}} 元</p>
                  <p><button @click="payTail(item.id)">支付尾款</button></p>
                </div>
              </div>
            </div>
            <div class="totalPrice">
              <button class="totalBtn">合并结算</button>
            </div>
          </div>

          <div class="tab-card">
            <div class="tabList" v-for="item in statementItem">
              <div class="orderNum">
                <div class="label-num">
                  <span class="label-order">{{item.orderType}}</span>
                  <span class="texthui">订单号：{{item.orderNo}}</span>
                </div>
                <div class="btn">
                  <button><router-link :to="{ path: '/order/myOrder/dalies', query:{id:item.id}}">订单详情</router-link></button>
                </div>
              </div>
              <div class="timeCon clearfix">
                <div class="timeText">
                  <p>出发日期：{{item.beginDate}}</p>
                  <p class="small">出发城市：{{item.orderDetails}}</p>
                  <p class="small" v-if="item.endAdd">到达地点：{{item.endAdd}}</p>
                </div>
                <div class="number">
                  <p>￥{{item.price}}</p>
                  <p>订单金额</p>
                </div>
                <div class="btn">
                  <p>已取消</p>
                  <p><button>再次使用</button></p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                invoiceItem: [
                {
                  orderType: "多日用车",
                  orderNo: "GL20180720000222",
                  beginDate: "07月21日 18：07",
                  fromCity: "广西壮族自治区桂林滔滔楼（公交站）—— 广西壮族自治区桂林象鼻山",
                  endAdd: "",
                  timeSheng: "2小时30",
                  price: 988,
                  status: '已完成'
                },
              ],  //开发票
                billItem: [
                  {
                    orderType: "多日用车",
                    orderNo: "GL20180720000222",
                    beginDate: "07月21日 18：07",
                    fromCity: "广西壮族自治区桂林滔滔楼（公交站）—— 广西壮族自治区桂林象鼻山",
                    endAdd: "",
                    timeSheng: "2小时30",
                    price: 988,
                    money: 800
                  },
                  {
                    orderType: "单日用车",
                    orderNo: "GL20180720000222",
                    beginDate: "07月21日 18：07",
                    fromCity: "广西壮族自治区桂林滔滔楼（公交站）—— 广西壮族自治区桂林象鼻山",
                    endAdd: "",
                    timeSheng: "2小时30",
                    price: 850,
                    money: 500
                  }
                ],  //结算单
                statementItem: [ ], //对账单
                tabs: [{
                  name: '开发票',
                  isActive: true
                }, {
                  name: '结算单',
                  isActive: false
                },{
                  name: '对账单',
                  isActive: false
                }],
                active: false
            }
        },
        activated() {
          this.billOrders();
        },
        methods: {
            tabChange: function (tabindex) {
                let tabCardCollection = document.querySelectorAll('.tab-card'),
                  len = tabCardCollection.length;
                for (var i = 0; i < len; i++) {
                  tabCardCollection[i].style.display = 'none';
                  this.tabs[i].isActive = false;
                }
                this.tabs[tabindex].isActive = true;
                tabCardCollection[tabindex].style.display = 'block';
            },
          billOrders() {
            let _this = this;
            $.ajax({
              type: 'post',
              url: 'http://new.api.db.glchuxingwang.com/financial/api/v1/bill/list',
              dataType: 'json',
              data: {
                memberId: sessionStorage.getItem('memberId'),
                token: sessionStorage.getItem('token'),
              },
              success: function (response) {
                let res = response;
                console.log(res);
                if (res.code == '200') {
                  _this.statementItem = res.data.list;
                }
              }
            })
          },
          //支付尾款
          payTail(id) {
            this.$router.push({
              path: '/payCode',
              query: {id: id}
            });
          }
        }
    }
</script>

<style lang="scss">
.tabNavigation {
    width: 100%;
    background: #fff;
    > b {
        width: 25%;
        display: block;
        float: left;
        text-align: center;
        > span {
            padding: 10px 0;
            display: inline-block;
            cursor: pointer;
        }
        .active {
            padding: 10px 0;
            display: inline-block;
            color: #fe4a54;
            border-bottom: 3px solid #ff2b35;
            font-weight: bold;
        }
    }
}
.tab-card {
  display: none;
}
.tabList {
    margin-top: 10px;
    background-color: #fff;
    .orderNum {
        border-bottom: 1px solid #e9e9e9;
        padding: 8px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label-num {
            display: flex;
            align-items: center;
        }
        .label-order {
            width: 93px;
            height: 33px;
            display: inline-block;
            background: url('../../../src/assets/images/Label-small.png') no-repeat center;
            margin-left: -5px;
            color: #fff;
            text-align: center;
            line-height: 36px;
        }
        .texthui {
            color: #c5c5c5;
            font-size: 14px;
            height: 33px;
            line-height: 36px;
            margin-left: 30px;
        }
        .btn {
            margin-right: 20px;
            button {
                border: 1px solid red;
                color: red;
                padding: 6px 14px;
                background-color: #fff;
                border-radius: 12px;
                margin: 0 4px;
                line-height: 1;
            }
            a {
              color: #fe4a54;
            }
        }
    }
    .timeCon {
        padding: 14px 20px;
        div {
            float: left;
            width: 17%;
            text-align: center;
            border-left: 1px solid #ccc;
            box-sizing: border-box;
            p {
                padding: 8px 0;
            }
            .payRed {
              color: #FE4A54;
            }
        }
        .timeText {
            width: 66%;
            text-align: left;
            border: none;
            .small {
                font-size: 14px;
            }
        }
        .btn button {
            border-radius: 12px;
            background-color: red;
            color: #fff;
            border: none;
            font-size: 10px;
            padding: 6px 10px;
            line-height: 1;
            cursor: pointer;
        }
    }
}
.tabSmall {
    font-size: 12px;
    color: red;
}
.totalPrice {
  margin: 20px 0;
  text-align: right;
  .totalBtn {
    width: 130px;
    padding: 12px 0;
    background: #808080;
    color: #fff;
    border: none;
  }
}
</style>


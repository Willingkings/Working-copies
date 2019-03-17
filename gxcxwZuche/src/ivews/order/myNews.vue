<template>
    <div class="feedback">
        <div class="infoBg">
            <b>我的消息</b>
            <span>已读0/未读1</span>
        </div>
        <div v-for="item in weiPayAarry">
          <div class="infoCon">
            <div class="head"><b>系统消息</b> &nbsp; &nbsp; <span>{{item.createDate}}</span></div>
            <div class="infoText">
              <b>您有个订单未付款</b>
              <div class="cont clearfix">
                <!--<p>系统消息是指网站管理者以信息广播形式向目标用户发布的公开的消息、公告、通知、提示等。具有群发性，高可达性等消息特性。</p>-->
                <p>由于您长时间没有付款，系统将取消了这个订单，你还可以按流程继续下单，欢迎再次使用。</p>
                <button @click="paySumbit(item.id)">再次使用</button>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      memberId: sessionStorage.getItem('memberId'),
      weiPayAarry: [ ]
    }
  },
  activated() {
    this.weiPayNews();
  },
  methods: {
    weiPayNews() {
      let _this = this;
      $.ajax({
        type: 'get',
        url: 'http://new.api.db.glchuxingwang.com/customer/customer/message',
        dataType: 'json',
        data: {
          memberId: this.memberId
        },
        success: function (response) {
          let res = response;
          if (res.success == true) {
            _this.weiPayAarry = res.list;
          }
        }
      })
    },
    paySumbit(orderId) {
      let _this = this;
      $.ajax({
        type: 'get',
        url: 'http://new.api.db.glchuxingwang.com/sales/order/addSameOrder',
        data: {
          id: orderId,
          token: sessionStorage.getItem('token')
        },
        success: function (response) {
          let res = response;
          if (res.msg == '再次使用成功') {
            _this.$message.success('支付现金成功');
            _this.carOrders(3);
          }else {
            _this.$message.error('支付现金失败');
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.infoBg, .infoCon {
    background-color: #fff;
    width: 100%;
    padding: 10px 20px;
    margin-bottom: 30px;
}
.infoBg {
    b {
        font-size: 18px;
    }
    span {
        color: #8c8c8c;
        float: right;
    }
}
.infoCon {
    .head {
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
    }
    .infoText {
        b {
            display: block;
            padding: 10px 0;
        }
        .cont {
            padding: 10px 0;
            p {
                width: 75%;
                float: left;
                font-size: 14px;
            }
            button {
                float: right;
                background-color: red;
                color: #fff;
                padding: 6px 14px;
                border-radius: 20px;
                border: none;
                cursor: pointer;
            }
        }
    }
}
</style>


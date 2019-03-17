<template>
    <div>
        <div class="tabNavigation clearfix">
            <!--<b v-for="(tab, index) in tabsName">-->
                <!--<span :class="{active:tab.isActive}" @click="tabChange(index)">{{tab.name}}</span>-->
            <!--</b>-->
            <b>
              <span :class="{active:tabsName[0].isActive}" @click="tabChange(0)">报价中({{payItem.count}})</span>
            </b>
          <b>
            <span :class="{active:tabsName[1].isActive}" @click="tabChange(1)">已预订({{bookingItem.count}})</span>
          </b>
          <b>
            <span :class="{active:tabsName[2].isActive}" @click="tabChange(2)">行驶中({{drivingItem.count}})</span>
          </b>
          <b>
            <span :class="{active:tabsName[3].isActive}" @click="tabChange(3)">已取消({{cancelOutItem.count}})</span>
          </b>
          <b>
            <span :class="{active:tabsName[4].isActive}" @click="tabChange(4)">已完成({{carryOutItem.count}})</span>
          </b>
        </div>
        <div class="tabContent" v-loading="loading">
          <div class="tab-card" style="display: block;">
            <template v-if="ordertotal0">
              <div class="tabList" v-for="item in payItem.list">
                <div class="orderNum">
                  <div class="label-num">
                    <span class="label-order" v-if="item.orderType == 1">单日用车</span>
                    <span class="label-order" v-if="item.orderType == 2">多日用车</span>
                    <span class="label-order" v-if="item.orderType == 3">单程用车</span>
                    <span class="label-order" v-if="item.orderType == 4">往返用车</span>
                    <span class="texthui">订单号：{{item.orderNo}}</span>
                  </div>
                  <div class="btn">
                    <button @click="showDialogA(item.id)">取消订单</button>
                    <button><router-link :to="{ path: '/order/myOrder/dalies', query:{id:item.id} }">订单详情
                    </router-link></button>
                  </div>
                  <transition name="dialog-fade">
                    <div class="dialog" @click="closeDialog" v-show="isDialog">
                      <div class="dialog-content" @click.stop>
                        <div class="headText clearfix">
                          <h3 class="title">取消订单</h3>
                          <span class="close" @click="closeDialog">X</span>
                        </div>
                        <div class="body">
                          <h4>取消理由</h4>
                          <ul class="selectList clearfix">
                            <li v-for="(cheso, index) in itemData">
                              <input type="checkbox" :id="'checkbox-'+ cheso.id" :data-id="cheso.id" :value="cheso.value" v-model="checkValues">
                              <label :for="'checkbox-'+ cheso.id">{{cheso.value}}</label>
                            </li>
                          </ul>
                          <h4>取消原因</h4>
                          <textarea cols="80" rows="3" placeholder="请输入取消原因" v-model="textarea"></textarea>
                        </div>
                        <div class="btn-group">
                          <span class="submitBtn" @click="submitA(item.id)">提交</span>
                          <span class="backBtn" @click="closeDialog">返回</span>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
                <div class="timeCon clearfix">
                  <div class="timeText">
                    <p>出发日期：{{item.beginDate}}</p>
                    <p class="small">出发城市：{{item.fromCity}}</p>
                    <p class="small" v-if="item.endAdd">到达地点：{{item.endAdd}}</p>
                  </div>
                  <div class="number">
                    <p>{{item.exp_time}}</p>
                    <p class="tabSmall" v-if="item.exp_time == '交易关闭'"></p>
                    <p class="tabSmall" v-else>距离报价结束</p>
                  </div>
                  <div class="btn">
                    <p class="tabSmall">已报价{{item.baojiaNum}}0家</p>
                    <p>
                      <button v-if="item.exp_time == '交易关闭'" class="payHui">支付失败</button>
                      <button @click="paySumbit(item.id)" v-else>支付定金</button>
                    </p>
                  </div>
                </div>
              </div>
              <v-page :page-index="pageIndex0" :total="ordertotal0" :page-size="pageSize" @change="pageChange0"></v-page>
            </template>
          </div>

          <div class="tab-card">
            <template v-if="ordertotal1">
              <div class="tabList" v-for="item in bookingItem.list">
                <div class="orderNum">
                  <div class="label-num">
                    <span class="label-order" v-if="item.orderType == 1">单日用车</span>
                    <span class="label-order" v-if="item.orderType == 2">多日用车</span>
                    <span class="label-order" v-if="item.orderType == 3">单程用车</span>
                    <span class="label-order" v-if="item.orderType == 4">往返用车</span>
                    <span class="texthui">订单号：{{item.orderNo}}</span>
                  </div>
                  <div class="btn">
                    <button @click="showDialogB(item.id)">取消订单</button>
                    <button><router-link :to="{ path: '/order/myOrder/dalies', query:{id:item.id}}">订单详情</router-link></button>
                  </div>
                  <transition name="dialog-fade">
                    <div class="dialog" @click="closeDialog" v-show="isDialog">
                      <div class="dialog-content" @click.stop>
                        <div class="headText clearfix">
                          <h3 class="title">取消订单</h3>
                          <span class="close" @click="closeDialog">X</span>
                        </div>
                        <div class="body">
                          <h4>取消理由</h4>
                          <ul class="selectList clearfix">
                            <li v-for="(cheso, index) in itemData">
                              <input type="checkbox" :id="'checkbox-'+ cheso.id" :data-id="cheso.id" :value="cheso.value" v-model="checkValues">
                              <label :for="'checkbox-'+ cheso.id">{{cheso.value}}</label>
                            </li>
                          </ul>
                          <h4>取消原因</h4>
                          <textarea cols="80" rows="3" placeholder="请输入取消原因" v-model="textarea"></textarea>
                        </div>
                        <div class="btn-group">
                          <span class="submitBtn" @click="submitB(item.id)">提交</span>
                          <span class="backBtn" @click="closeDialog">返回</span>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
                <div class="timeCon clearfix">
                  <div class="timeText">
                    <p>出发日期：{{item.beginDate}}</p>
                    <p class="small">出发城市：{{item.fromCity}}</p>
                    <p class="small" v-if="item.endAdd">到达地点：{{item.endAdd}}</p>
                  </div>
                  <div class="number">
                    <p>{{item.exp_time}}</p>
                    <p class="tabSmall" v-if="item.exp_time == '交易关闭'"></p>
                    <p class="tabSmall" v-else>距离行驶还有</p>
                  </div>
                  <div class="btn">
                    <p>{{item.plateNo}}桂A-XS996</p>
                    <p class="hui">白色-字通客车</p>
                  </div>
                </div>
              </div>
              <v-page :page-index="pageIndex1" :total="ordertotal1" :page-size="pageSize" @change="pageChange1"></v-page>
            </template>
          </div>

          <div class="tab-card">
            <template v-if="ordertotal2">
              <div class="tabList" v-for="item in drivingItem.list">
                <div class="orderNum">
                  <div class="label-num">
                    <span class="label-order" v-if="item.orderType == 1">单日用车</span>
                    <span class="label-order" v-if="item.orderType == 2">多日用车</span>
                    <span class="label-order" v-if="item.orderType == 3">单程用车</span>
                    <span class="label-order" v-if="item.orderType == 4">往返用车</span>
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
                    <p>{{item.exp_time}}</p>
                    <p class="tabSmall" v-if="item.exp_time == '交易关闭'"></p>
                    <p class="tabSmall" v-else>距离结束还有</p>
                  </div>
                  <div class="btn">
                    <p class="align"><button @click="renewalFeeSumbit(item.id)">立即续费</button></p>
                  </div>
                </div>
              </div>
              <v-page :page-index="pageIndex2" :total="ordertotal2" :page-size="pageSize" @change="pageChange2"></v-page>
            </template>
          </div>

          <div class="tab-card">
            <template v-if="ordertotal3">
              <div class="tabList" v-for="item in cancelOutItem.list">
                <div class="orderNum">
                  <div class="label-num">
                    <span class="label-order" v-if="item.orderType == 1">单日用车</span>
                    <span class="label-order" v-if="item.orderType == 2">多日用车</span>
                    <span class="label-order" v-if="item.orderType == 3">单程用车</span>
                    <span class="label-order" v-if="item.orderType == 4">往返用车</span>
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
                    <p style="font-size:14px;">订单金额</p>
                  </div>
                  <div class="btn">
                    <p class="hui">已取消</p>
                    <p><button @click="addSameSubmitCan(item.id)">再次使用</button></p>
                  </div>
                </div>
              </div>
              <v-page :page-index="pageIndex3" :total="ordertotal3" :page-size="pageSize" @change="pageChange3"></v-page>
            </template>
          </div>

          <div class="tab-card">
            <template v-if="ordertotal4">
              <div class="tabList" v-for="item in carryOutItem.list">
                <div class="orderNum">
                  <div class="label-num">
                    <span class="label-order" v-if="item.orderType == 1">单日用车</span>
                    <span class="label-order" v-if="item.orderType == 2">多日用车</span>
                    <span class="label-order" v-if="item.orderType == 3">单程用车</span>
                    <span class="label-order" v-if="item.orderType == 4">往返用车</span>
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
                    <p style="font-size:14px;">订单金额</p>
                  </div>
                  <div class="btn">
                    <p class="hui">已完成</p>
                    <p><button @click="addSameSubmit(item.id)">再次使用</button></p>
                  </div>
                </div>
              </div>
              <v-page :page-index="pageIndex4" :total="ordertotal4" :page-size="pageSize" @change="pageChange4"></v-page>
            </template>
          </div>
        </div>
        <!--<v-dialog v-show="isDialog" @on-close="closeDialog"></v-dialog>-->
    </div>
</template>

<script>
import dialog from '@/components/dialog.vue';
import vPage from '@/components/pages.vue'
//实现多个倒计时
function InitTime(endtime) {
  let dd, hh, mm, ss = null;
  let time = new Date(endtime).getTime() - new Date().getTime();
  if (time <= 0) {
    return '交易关闭';
  }else {
    dd = Math.floor(time / 1000 / 60 / 60 / 24);
    hh = Math.floor(time / 1000 / 60 / 60 % 24);
    mm = Math.floor(time / 1000 / 60 % 60);
    ss = Math.floor(time / 1000 % 60);
    let str = dd + '天'+ hh + '时'+ mm + '分'+ ss + '秒';
    return str;
  }
}

export default {
    name: 'myOrder',
    components: {
        'v-dialog': dialog,
        vPage
    },
    data () {
        let obj = {
          payItem: [ ],  //报价中
          bookingItem: [ ],  //已预订
          drivingItem: [ ],   //行驶中
          carryOutItem: [ ],  //已完成
          cancelOutItem: [],   //已取消
          tabsName: [{
            name: '报价中',
            isActive: true
          },{
            name: '已预订',
            isActive: false
          },{
            name: '行驶中',
            isActive: false
          },{
            name: '已取消',
            isActive: false
          },{
            name: '已完成',
            isActive: false
          }],
          active: false,
          isDialog: false,
          loading: false,
          current: 1,//列表页数
          display: 10,//列表条数
          total: 0,//总页数
          pageIndex0:1,//列表页数
          pageIndex1:1,//列表页数
          pageIndex2:1,//列表页数
          pageIndex3:1,//列表页数
          pageIndex4:1,//列表页数
          pageSize:10,//列表条数
          ordertotal0: 0, //总页数
          ordertotal1: 0,//总页数
          ordertotal2: 0,//总页数
          ordertotal3: 0,//总页数
          ordertotal4: 0,//总页数
          itemData: [
            { id: 1, value: '报价时间过长' },
            { id: 2, value: '价格过高' },
            { id: 3, value: '车型太少' },
            { id: 4, value: '现在不想包车' },
            { id: 5, value: '重复下单' },
            { id: 6, value: '车辆信息有误' },
            { id: 7, value: '发票有误' },
            { id: 8, value: '行程有误' },
            { id: 9, value: '联系人有误' },
            { id: 10, value: '操作太麻烦' },
            { id: 11, value: '产品体验差' },
            { id: 12, value: '服务不好' }
          ],
          checkValues: [],
          textarea: '',
          post: null
        };
        return obj;
    },
    activated() {
      this.carOrders(0,this.pageIndex0);
      this.carOrders(3,this.pageIndex1);
      this.carOrders(5,this.pageIndex2);
      this.carOrders(8,this.pageIndex3);
      this.carOrders(11,this.pageIndex4);
    },
    methods: {
        tabChange: function (tabindex) {
            let tabCardCollection = document.querySelectorAll('.tab-card'),
                len = tabCardCollection.length;
            for (var i = 0; i < len; i++) {
              tabCardCollection[i].style.display = 'none';
              this.tabsName[i].isActive = false;
            }
            this.tabsName[tabindex].isActive = true;
            tabCardCollection[tabindex].style.display = 'block';
        },
        showDialogA: function(id) {
            this.isDialog = !this.isDialog;
        },
        showDialogB: function() {
            this.isDialog = !this.isDialog;
        },
        closeDialog: function() {
          this.isDialog = false;
        },
        submitA: function(id) {
          let _this = this;
          let str_json = '';
          function switchUpper(key, value) {
            return value.toString().toUpperCase();
          }
          if (this.checkValues !== '' && this.textarea !== '') {
            str_json = JSON.stringify(this.checkValues, switchUpper);
            $.ajax({
              type: 'post',
              url: 'http://new.api.db.glchuxingwang.com/sales/order/cancelOrder',
              data: {
                id: id,
                orderStatus: Number(8),
                token: sessionStorage.getItem('token'),
                cancelCause: str_json,
                cancelReason: this.textarea
              },
              success: function (response) {
                let res = response;
                console.log(res);
                if (res.msg == '取消订单成功') {
                  _this.isDialog = false;
                  _this.$message.success('取消订单成功');
                  _this.carOrders(0);
                }
              }
            });
          }
        },
        submitB: function(id) {
          let _this = this;
          let str_json = '';
          function switchUpper(key, value) {
            return value.toString().toUpperCase();
          }
          if (this.checkValues !== '' && this.textarea !== '') {
            str_json = JSON.stringify(this.checkValues, switchUpper);
            $.ajax({
              type: 'post',
              url: 'http://new.api.db.glchuxingwang.com/sales/order/cancelOrder',
              data: {
                id: id,
                orderStatus: Number(8),
                token: sessionStorage.getItem('token'),
                cancelCause: str_json,
                cancelReason: this.textarea
              },
              success: function (response) {
                let res = response;
                if (res.msg == '取消订单成功') {
                  _this.isDialog = !this.isDialog;
                  _this.$message.success('取消订单成功');
                  _this.carOrders(3);
                }
              }
            })
          }
        },
      //列表每个倒计时
        countTime() {
          for (var key in this.payItem.list) {
            let endTime = new Date(this.payItem.list[key]['beginDate']).getTime();
            let nowTime = new Date().getTime();
            let rightTime = endTime - nowTime;
            if (rightTime >= 0) {
              var dd = Math.floor(rightTime / 1000 / 60 / 60 / 24);
              var hh = Math.floor(rightTime / 1000 / 60 / 60 % 24);
              var mm = Math.floor(rightTime / 1000 / 60 % 60);
              var ss = Math.floor(rightTime / 1000 % 60);
            }
            this.payItem.list[key]['exp_time'] = dd + '天'+ hh + '时' + mm + '分' + ss + '秒';
            this.payItem.list.map((obj, index) => {
              this.$set(obj, 'exp_time', InitTime(obj.beginDate));
            })
          }
          setTimeout(this.countTime, 1000);
        },
      //获取下单列表和订单状态: 0 待报价，2 待付款(定金), 3 待派单, 4 已派单 5 进行中,6 行程完成 7 待付款(尾款)  8 已取消  9支付中  11 已完成
        carOrderAll: function(data, status) {
          switch (status) {
            case 0:
              this.payItem = data;
              this.countTime();
              this.ordertotal0 = data.count;
              break;
            case 3:
              this.bookingItem = data;
              setInterval(() => {
                for (var key in this.bookingItem.list) {
                  let endTime = new Date(this.bookingItem.list[key]['beginDate']).getTime();
                  let nowTime = new Date().getTime();
                  let rightTime = endTime - nowTime;
                  if (rightTime >= 0) {
                    var dd = Math.floor(rightTime / 1000 / 60 / 60 / 24);
                    var hh = Math.floor(rightTime / 1000 / 60 / 60 % 24);
                    var mm = Math.floor(rightTime / 1000 / 60 % 60);
                    var ss = Math.floor(rightTime / 1000 % 60);
                  }
                  this.bookingItem.list['exp_time'] = dd + '天'+ hh + '时' + mm + '分' + ss + '秒';
                  this.bookingItem.list.map((obj, index) => {
                    this.$set(obj, 'exp_time',InitTime(obj.beginDate));
                  })
                }
              }, 1000);
              this.ordertotal1 = data.count;
              break;
            case 5:
              this.drivingItem = data;
              setInterval(() => {
                for (var key in this.drivingItem.list) {
                  let endTime = new Date(this.drivingItem.list[key]['beginDate']).getTime();
                  let nowTime = new Date().getTime();
                  let rightTime = endTime - nowTime;
                  if (rightTime >= 0) {
                    var dd = Math.floor(rightTime / 1000 / 60 / 60 / 24);
                    var hh = Math.floor(rightTime / 1000 / 60 / 60 % 24);
                    var mm = Math.floor(rightTime / 1000 / 60 % 60);
                    var ss = Math.floor(rightTime / 1000 % 60);
                  }
                  this.drivingItem.list['exp_time'] = dd + '天'+ hh + '时' + mm + '分' + ss + '秒';
                  this.drivingItem.list.map((obj, index) => {
                    this.$set(obj, 'exp_time',InitTime(obj.beginDate));
                  })
                }
              }, 1000);
              this.ordertotal2 = data.count;
              break;
            case 8:
              this.cancelOutItem = data;
              this.ordertotal3 = data.count;
              break;
            case 11:
              this.carryOutItem = data;
              this.ordertotal4 = data.count;
              break;
            default:
              break;
          }
        },
        carOrders(status,pageNo) {
          let _this = this;
          this.loading = true;
          this.$nextTick(function () {
            $.ajax({
              type: 'POST',
              url: 'http://new.api.db.glchuxingwang.com/sales/order/listOrder',
              dataType: 'json',
              data: {
                memberId: sessionStorage.getItem('memberId'),
                token: sessionStorage.getItem('token'),
                orderStatus: status,
                pageNo: pageNo,
                pageSize: this.pageSize
              },
              success: function (response) {
                _this.carOrderAll(response.list, status);
                _this.loading = false;
              }
            })
          });
        },
      //支付现金
      paySumbit(id) {
          this.$router.push({
            path: '/payCode',
            query: {id: id}
          });
      },
      // //立即续费
      // renewalFeeSumbit(id) {
      //   let _this = this;
      //   $.ajax({
      //     type: 'get',
      //     url: 'http://new.api.db.glchuxingwang.com/sales/order/addSameOrder',
      //     data: {
      //       id: id,
      //       token: sessionStorage.getItem('token')
      //     },
      //     success: function (response) {
      //       let res = response;
      //       if (res.msg == '修改成功') {
      //         _this.$message.success('立即续费成功');
      //       }
      //     }
      //   })
      // },
      // //再次使用成功(按钮)
      addSameSubmitCan(id) {
          let _this = this;
          $.ajax({
            type: 'get',
            url: 'http://new.api.db.glchuxingwang.com/sales/order/addSameOrder',
            data: {
              id: id,
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
        },
      addSameSubmit(id) {
        let _this = this;
        $.ajax({
          type: 'get',
          url: 'http://new.api.db.glchuxingwang.com/sales/order/addSameOrder',
          data: {
            id: id,
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
      },
      //分页
      pageChange0(page) {
        this.pageIndex0 = page;
        this.carOrders(0,page);
      },
      pageChange1(page) {
        this.pageIndex1 = page;
        this.carOrders(3,page);
      },
      pageChange2(page) {
        this.pageIndex2 = page;
        this.carOrders(5,page);
      },
      pageChange3(page) {
        this.pageIndex3 = page;
        this.carOrders(8,page);
      },
      pageChange4(page) {
        this.pageIndex4 = page;
        this.carOrders(11,page);
      },
    },
}
</script>

<style lang="scss">
.orderMain .el-loading-mask {
  position: fixed;
}
.tabNavigation {
    width: 100%;
    background: #fff;
    > b {
        width: 20% !important;
        display: block;
        float: left;
        text-align: center;
        font-size: 20px;
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
            a {
              color: #fe4a54;
            }
        }
        .btn button {
            border: 1px solid #fe4a54;
            color: #fe4a54;
            padding: 6px 14px;
            background-color: #fff;
            border-radius: 12px;
            margin: 0 4px;
            line-height: 1;
            cursor: pointer;
        }
    }
    .timeCon {
        padding: 14px 20px;
        display: flex;
        justify-content: center;
        div {
            float: left;
            width: 17%;
            text-align: center;
            border-left: 1px solid #ccc;
            box-sizing: border-box;
            p {
                padding: 8px 0;
                font-size: 16px;
            }
            p.hui {
                color: #999;
                font-size: 14px;
            }
            p.align {
                height: 54px;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
            }
        }
        .timeText {
            width: 66%;
            text-align: left;
            border: none;
            .small {
                font-size: 12px;
            }
        }
        .tabSmall {
            font-size: 12px;
            color: #fe4a54;
        }
        .btn button {
            border-radius: 12px;
            background-color: #fe4a54;
            color: #fff;
            border: none;
            font-size: 10px;
            padding: 8px 14px;
            line-height: 1;
            margin-top: -5px;
            cursor: pointer;
        }
      .payHui {
        background-color: #999 !important;
      }
    }
}
  //弹窗体
.dialog-fade-enter, .dialog-fade-leave-active {
  opacity: 0;
}
.dialog-fade-enter-active, .dialog-fade-leave-active {
  transition: opacity .5s ease;
}
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.1)!important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog .dialog-content {
  position: fixed;
  box-sizing: border-box;
  padding: 10px 20px;
  width: 800px;
  min-height: 140px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background: #fff;
  z-index: 112;
  .title{
    font-size: 18px;
    font-weight: bold;
    float: left;
  }
  .close {
    float: right;
    width: 20px;
    height: 20px;
    border: 2px solid #333;
    border-radius: 50%;
    line-height: 1.4;
    text-align: center;
    font-weight: bold;
    cursor: context-menu;
  }
  .body, .btn-group {
    padding: 10px 20px;
  }
  .body {
    h4{
      font-size: 16px;
      font-weight: bold;
      margin: 4px 0;
    }
    textarea {
      border: 1px solid #f1f1f1;
      background: #f9f9f9;
      color: #999;
      padding: 6px 10px;
      margin: 6px 10px 0;
    }
  }
  .btn-group {
    .submitBtn {
      background: #fe4a54;
      color: #fff;
      padding: 6px 12px;
      border-radius: 20px;
      width: 60px;
      display: inline-block;
      text-align: center;
      margin-left: 10px;
      margin-right: 5px;
      cursor: pointer;
    }
    .backBtn {
      background: #999;
      color: #fff;
      padding: 6px 12px;
      border-radius: 20px;
      display: inline-block;
      text-align: center;
      margin-left: 10px;
      margin-right: 5px;
      cursor: pointer;
    }
  }
}
.selectList li {
  float: left;
  width: 20%;
  padding: 6px 0 10px 10px;
  box-sizing: border-box;
}
</style>


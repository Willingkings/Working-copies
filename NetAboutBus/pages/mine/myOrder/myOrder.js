// pages/mine/myOrder/myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TypeIndex: 0,  // -----默认用户选中订单类型未进行中  （0：进行中；1：本月订单； 2：上月订单；3：历史订单）

    historyData: [], // ---历史订单数据
    thisMonthData: [], // -今月订单数据
    lastMonthData: [] // --上月订单数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 调取查询定制、众筹、购买的订单信息接口获取订单详情数据
    getApp().func.comHttp('/vl/cusbus/app/services/queryOrders', {
      userId: getApp().globalData.userData.mobileNo,  // ---用户id（手机号码）
      flowNo: "",  // --------------------------------------流水号(选填)
      useDate: "", // --------------------------------------乘车日期(选填)
      states: "", // ---------------------------------------订单状态(选填),逗号分隔(例如:1,2)
      token: "" // -----------------------------------------令牌
    }, 'get', function (res) {
      var thisMonthArr = []; // 今月订单数据
      var date = getApp().func.timeMethod.yearMonth(Date.parse(new Date())); // 今日年月
      for(var i = 0; i < res.data.length; i++) {
        if (date == res.data[i].workDate.substr(0, 7) ) {
          thisMonthArr.push(res.data[i])
        }
      }
      that.setData({ thisMonthData: thisMonthArr }) // 赋值今月订单数据
      var lastMonthArr = []; // 上月订单数据
      date = date.split("-"); // 获取年份月份截取
      // 判断今月是否是一月份
      if (Number(date[1]) == 1) {
        date[0] = Number(date[0]) - 1;
        date[1] = 12;
      } else {
        date[0] = Number(date[0]);
        date[1] = Number(date[1]) - 1;
      }
      date = date[0] + "-" + date[1]; // 组合上月年月份
      for (var i = 0; i < res.data.length; i++) {
        if (date == res.data[i].workDate.substr(0, 7)) {
          lastMonthArr.push(res.data[i])
        }
      }
      that.setData({ lastMonthData: lastMonthArr }) // 赋值今月订单数据

      that.setData({ historyData: res.data }) // 赋值历史订单数据
    })
  },
  // 用户点击类型
  TypeSele: function(e) {
    var that = this;
    that.setData({ TypeIndex: e.currentTarget.dataset.typeindex })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
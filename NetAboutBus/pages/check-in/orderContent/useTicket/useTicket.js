// pages/check-in/orderContent/useTicket/useTicket.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageData: "", // ---扫码详情数据
    orderNo: "",  // ------订单号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 调取查询定制、众筹、购买的订单信息接口获取订单详情数据
    getApp().func.comHttp('/vl/cusbus/app/services/queryOrders', {
      userId: getApp().globalData.userData.mobileNo,  // ---用户id（手机号码）
      flowNo: options.orderNo,  // -------------------------流水号(选填)
      useDate: "", // --------------------------------------乘车日期(选填)
      states: "", // ---------------------------------------订单状态(选填),逗号分隔(例如:1,2)
      token: "" // -----------------------------------------令牌
    }, 'get', function (res) {
      that.setData({
        messageData: res.data[0], // 赋值扫码详情数据
        orderNo: options.orderNo  // 赋值订单号
      })
    })
  },
  // 用户点击车票详情
  detailsSkip: function () {
    var that = this;
    var orderNo = that.data.orderNo; // 订单号
    var url = "/pages/check-in/orderContent/unusedTicket/ticketService/TicketDetails/TicketDetails?orderNo=" + orderNo + "&used=1"; // ---车票详情路径
    wx.navigateTo({ url: url }) // 进行跳转到车票详情
  },
  // 用户点击评价
  evaluate: function () {
    var that = this;
    var orderNo = that.data.orderNo; // 订单号
    var lineCode = that.data.messageData.lineCode; // 线路编号
    var url = "/pages/common/evaluation/evaluation?orderNo=" + orderNo + "&lineCode=" + lineCode; // 车票详情路径
    wx.navigateTo({ url: url }) // 进行跳转到乘车指引
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
    var url = "/pages/check-in/orderList/orderList?index=2" // 跳转到已使用验票页面
    wx.reLaunch({
      url: url
    })
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
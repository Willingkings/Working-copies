// pages/check-in/orderContent/refundTicket/refundTicket.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lineName: "",
    refundTicketData: [] // 退款订单详情数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ lineName: options.lineName }) // 赋值退款订单详情数据

    getApp().func.speHttp('/vl/cusbus/app/services/loadRefundApplys', {
      userId: getApp().globalData.userData.mobileNo,  // ---用户id（手机号码）
      flowNo: options.orderNo,  // -------------------------流水号(选填)
      token: "" // -----------------------------------------令牌
    }, 'get', function (res) {
      res.data[0].applyDate = getApp().func.timeMethod.timestamp(res.data[0].applyDate);
      res.data[0].dealTime = getApp().func.timeMethod.timestamp(res.data[0].dealTime);
      that.setData({ refundTicketData: res.data[0] }) // 赋值退款订单详情数据
    })
  },
  // 用户点击关闭
  closeBtn: function() {
    wx.navigateBack({ changed: true }); // 返回上一页
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
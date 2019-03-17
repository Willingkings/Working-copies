// pages/mine/myBusDetalis/myBusDetalis.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myBusDetalisData: [], // 定制详情数据
    pathData: [], // 路线详情数据
    open: true, // 默认线路为展开状态
    reimbursement: false, // ---默认退票弹窗为隐藏状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 调取查询定制、众筹、购买的订单信息接口获取退款订单详情数据
    getApp().func.speHttp('/vl/cusbus/app/services/myBus', {
      userId: getApp().globalData.userData.mobileNo,
      token: "",
    }, 'get', function (res) {
      that.setData({ myBusDetalisData: res.data[options.Index] })
    })
    // 获取当前线路的站点信息
    getApp().func.comHttp('/vl/cusbus/app/services/lineDetail', {
      lineCode: options.lineCode,
      token: "",
    }, 'get', function (res) {
      that.setData({ pathData: res.data })
    })
  },
  // 用户点击展开和关闭
  OpeningClosing: function() {
    var that = this;
    if (that.data.open == true) {
      that.setData({ open: false })
    } else {
      that.setData({ open: true })
    }
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
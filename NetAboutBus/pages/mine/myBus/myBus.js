// pages/mine/myBus/myBus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TypeIndex: 0,  // 默认用户选中已通过  （0：已通过；1：未通过；）
    myBusData: "" // 列表数据
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
      that.setData({ myBusData: res.data })
    })
  },
  // 用户点击班车详情
  BusDetails: function (e) {
    var that = this;
    var url = "/pages/mine/myBusDetalis/myBusDetalis?Index=" + e.currentTarget.dataset.index + "&lineCode=" + e.currentTarget.dataset.linecode; // 班车详情跳转路径
    wx.navigateTo({ url: url }) // 进行跳转
  },
  // 用户点击类型
  TypeSele: function (e) {
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
    var that = this;
    that.setData({
      TypeIndex: that.data.TypeIndex,  // 默认用户选中已通过  （0：已通过；1：未通过；）
      myBusData: "" // 列表数据
    })
    // 重新加载
    that.onLoad();
    wx.stopPullDownRefresh();
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
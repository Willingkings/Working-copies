// pages/mine/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否已经绑定桂林出行网账户，没有绑定显示绑定弹窗
    if (getApp().globalData.userData.memberID == null) {
      wx.showModal({
        title: '发现您还未绑定手机号',
        content: '是否通过短信验证进行绑定',
        success: function (res) {
          if (res.confirm) {
            // 用户点击确定
            wx.navigateTo({
              url: '/pages/login/login'
            })
          } else if (res.cancel) {
            // 用户点击取消
            wx.showToast({
              title: '获取信息失败',
              icon: 'loading',
              duration: 1000
            })
            // 后退
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    } else {
    }
  },
  // 用户头像和名字
  personal: function () {
    var that = this;
    var url = "/pages/mine/personalData/personalData"; // 个人资料跳转路径
    wx.navigateTo({ url: url }) // 进行跳转
  },
  // 用户点击我的订单
  myOrder: function () {
    var that = this;
    // var url = "/pages/mine/myOrder/myOrder"; // 我的订单跳转路径
    var url = "/pages/check-in/orderList/orderList?index=1"; // 我的订单跳转路径
    wx.navigateTo({ url: url }) // 进行跳转
  },
  // 用户点击我的钱包
  wallet: function() {
    var that = this;
    var url = "/pages/mine/wallet/wallet"; // 我的钱包跳转路径
    wx.navigateTo({ url: url }) // 进行跳转
  },
  // 用户点击我的班车
  myBus: function () {
    var that = this;
    var url = "/pages/mine/myBus/myBus"; // 我的班车跳转路径
    wx.navigateTo({ url: url }) // 进行跳转
  },
  // 用户点击我的定制
  myCustomization: function () {
    var that = this;
    var url = "/pages/mine/myCustomization/myCustomization"; // 我的定制跳转路径
    wx.navigateTo({ url: url }) // 进行跳转
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
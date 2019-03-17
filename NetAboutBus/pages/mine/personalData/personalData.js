// pages/mine/personalData/personalData.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobileNo: ""  // 用户手机号码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ mobileNo: getApp().globalData.userData.mobileNo })  // 用户手机号码
  },
  // 用户点击修改密码
  changePassword: function () {
    var that = this;
    var url = "/pages/mine/changePassword/changePassword"; // 修改密码跳转路径
    wx.navigateTo({ url: url }) // 进行跳转
  },
  // 用户点击退出登录
  quitBtn: function () {
    var that = this;
    var url = "/pages/login/login"; // 修改密码跳转路径
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
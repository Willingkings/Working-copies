// pages/mine/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0
  },
  recharge:function (){
    wx.navigateTo({
      url: "/pages/mine/recharge/recharge"
    }) // 进行跳转
  },
  expenseDetail: function (e) {
    wx.navigateTo({
      url: "/pages/mine/expenseDetail/expenseDetail?type=" + e.currentTarget.dataset.type
    }) // 进行跳转
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (getApp().globalData.userData.memberID == null) {
      wx.navigateTo({
        url: "/pages/login/login"
      }) // 进行跳转
    } else {
      this.setData({
        balance: getApp().globalData.userData.accountAmount
      })
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
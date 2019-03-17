// pages/specialLine/highSpeedRail/highSpeedRail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    highSpeedRailListData: [],    // 高铁专线列表数据
    code: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options != undefined) {
      this.setData({
        code: options.code
      })
    }
    var that = this;
    // 调用查询主题公交类型接口
    getApp().func.comHttp('/vl/cusbus/app/services/firstPageRecommendAll', {
      lng: "110.303186",     // 用户所在经度
      lat: "25.280088",      // 用户所在纬度
      subType: that.data.code,  // 用户点击传的类型参数
      openState: "2",         // 1.招募中  2、已开通  3.已关闭
      token: "",

    }, 'get', function (res) {
      if (res.success == true) {
        that.setData({ highSpeedRailListData: res.data })                                // 高铁列表数据
      } else {
        console.log("获取高铁列表数据接口错误")
      }
    })
  },
  // 用户点击列表跳转
  trainApply: function (e) {
    wx.navigateTo({ url: "/pages/search/lineDetails/lineDetails?index=0" + "&lineCode=" + e.currentTarget.dataset.linecode + "&ticketPrice=" + e.currentTarget.dataset.price + "&lineName=" + e.currentTarget.dataset.linename }) // 进行跳转
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
      highSpeedRailListData: [],    // 高铁专线列表数据
      code: that.data.code
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
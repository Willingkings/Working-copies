// pages/mine/myCustomization/myCustomization.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TypeIndex: 1, // 我的定制目录模块默认已采纳 （1：已采纳。2：未采纳）
    myCustomizationData: "", // 我的定制模块列表数据
    empty: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查询乘客定制需求接口
    getApp().func.speHttp('/vl/cusbus/app/services/findPassengerAdvice', {
      tel: getApp().globalData.userData.mobileNo,  
      token: "",  
    }, 'get', function (res) {
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].startTime = getApp().func.timeMethod.timeDivision(res.data[i].startTime); // 转出发时间将时间戳为时分
        res.data[i].endTime = getApp().func.timeMethod.timeDivision(res.data[i].endTime); // 转返程时间将时间戳为时分
      }
      that.setData({ myCustomizationData: res.data })
    })
    var query = wx.createSelectorQuery();
    query.select('.directList').boundingClientRect()
    query.exec((res) => {
      if (res[0].height == 0) {
        that.setData({
          empty: 1
        })
      } else {
        that.setData({
          empty: 2
        })
      }
    })
  },
  // 用户点击类型
  TypeSele: function (e) {
    var that = this;
    that.setData({ TypeIndex: e.currentTarget.dataset.typeindex })
    var query = wx.createSelectorQuery();
    query.select('.directList').boundingClientRect()
    query.exec((res) => {
      if (res[0].height == 0) {
        that.setData({
          empty: 1
        })
      } else {
        that.setData({
          empty: 2
        })
      }
    })
  },
  // 用户点击列表详情
  detailsSkip: function (e) {
    var that = this;
    var url = "/pages/mine/CustomDetails/CustomDetails?passengeradviceid=" + e.currentTarget.dataset.passengeradviceid; // 定制详情跳转路径
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
    var that = this;
    // 重置data
    that.setData({
      TypeIndex: that.data.TypeIndex, // 我的定制目录模块默认已采纳 （1：已采纳。2：未采纳）
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
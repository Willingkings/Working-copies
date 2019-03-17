// pages/search/lineList/lineList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyBoxIndex: 0, // 目录模块默认第一个
    empty: true,  // 默认为空数据模块显示
    businessListData: [],    // 已开通班车列表数据
    notBusinessListData: [],    // 招募线路列表数据
    nothing: 0, // 用户定制线路结果 [0:失败  1:成功]
  },
  lineDetails: function(e){
    var _this = this;
    wx.navigateTo({ url: "/pages/search/lineDetails/lineDetails?index=" + _this.data.keyBoxIndex + "&lineCode=" + e.currentTarget.dataset.linecode + "&ticketPrice=" + e.currentTarget.dataset.ticketprice + "&lineName=" + e.currentTarget.dataset.linename + "&lineType=" + e.currentTarget.dataset.linetype  }) // 进行跳转
  },
  // 用户点击目录切换列表事件
  keyBoxSele: function (e) {
    var _this = this;
    _this.setData({ keyBoxIndex: e.currentTarget.dataset.keyboxindex });
    // 用户点击热门推荐
    if (e.currentTarget.dataset.keyboxindex == 0) {
      if (_this.data.businessListData.length == 0) {
        _this.setData({ empty: true })
      } else {
        _this.setData({ empty: false })
      }
      // 用户点击即将开通
    } else if (e.currentTarget.dataset.keyboxindex == 1) {
      if (_this.data.notBusinessListData.length == 0) {
        _this.setData({ empty: true })
      } else {
        _this.setData({ empty: false })
      }
    }
  },
  closeResultWin: function (e) {
    var _this = this;
    _this.setData({
      empty: false
    })
  },
  confirmCustom: function(e){
    wx.reLaunch({
      url: '/pages/index/index?tabNum=1'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      coordinates: {
        fromPlaceLng: options.fromPlaceLng,
        fromPlaceLat: options.fromPlaceLat,
        toPlaceLng: options.toPlaceLng,
        toPlaceLat: options.toPlaceLat
      }
    })
    getApp().func.comHttp('/vl/cusbus/app/services/searchLine', {
      fromPlaceLng: options.fromPlaceLng,
      fromPlaceLat: options.fromPlaceLat,
      toPlaceLng: options.toPlaceLng,
      toPlaceLat: options.toPlaceLat, 
      token: ""
    }, 'get', function (res) {
      if (res.success){
        _this.setData({ empty: false })
        var busList = [];
        var notBusList = []
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].lineType == 2) {
            busList.push(res.data[i])
          }
          if (res.data[i].lineType == 1) {
            notBusList.push(res.data[i])
          }
        }
        if (busList.length == 0) {
          _this.setData({ empty: true })
        } else {
          _this.setData({ empty: false })
        }
        _this.setData({ businessListData: busList })
        _this.setData({ notBusinessListData: notBusList })
      }
    })
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
    let _this = this;
    _this.setData({
      keyBoxIndex: 0, // 目录模块默认第一个
      empty: true,  // 默认为空数据模块显示
      businessListData: [],    // 已开通班车列表数据
      notBusinessListData: [],    // 招募线路列表数据
    })
    _this.onLoad(_this.data.coordinates);
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
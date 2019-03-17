// pages/specialLine/business/business.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyBoxIndex: 0, // 商务班车目录模块默认第一个
    empty: true,  // 默认为空数据模块显示
    businessListData: [],    // 商务班车热点预订列表数据
    NotBusinessListData: [],    // 商务班车即将开通列表数据
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
    // 调用查询主题公交类型接口(商务班次热点推荐)
    getApp().func.comHttp('/vl/cusbus/app/services/firstPageRecommendAll', {
      lng: "110.303186",     // 用户所在经度
      lat: "25.280088",      // 用户所在纬度
      subType: that.data.code,  // 用户点击传的类型参数
      openState: "2",         // 1.招募中  2、已开通  3.已关闭
      token: "",
    }, 'get', function (res) {
      if (res.success == true) {
        that.setData({ businessListData: res.data })                                // 商务班次热点预订列表数据
        // 商务班次热点推荐数据不为空时隐藏空模块
        if (res.data.length != 0) {
          that.setData({ empty: false })
        }
      } else {
        console.log("获取商务班次热点预订列表数据失败")
      }
    })
    // 调用查询主题公交类型接口(商务班次即将开通)
    getApp().func.comHttp('/vl/cusbus/app/services/firstPageRecommendAll', {
      lng: "110.303186",     // 用户所在经度
      lat: "25.280088",      // 用户所在纬度
      subType: that.data.code,  // 用户点击传的类型参数
      openState: "1",         // 1.招募中  2、已开通  3.已关闭
      token: "",
    }, 'get', function (res) {
      if (res.success == true) {
        that.setData({ NotBusinessListData: res.data })                                // 商务班次热点预订列表数据
      } else {
        console.log("获取商务班次即将开通列表数据失败")
      }
    })
  },
  // 用户点击目录切换列表事件
  keyBoxSele: function (e) {
    var that = this;
    that.setData({ keyBoxIndex: e.currentTarget.dataset.keyboxindex })
    // 用户点击热门推荐
    if (e.currentTarget.dataset.keyboxindex == 0) {
      if (that.data.businessListData.length == 0) {
        that.setData({ empty: true })
      } else {
        that.setData({ empty: false })
      }
    // 用户点击即将开通
    } else if (e.currentTarget.dataset.keyboxindex == 1) {
      if (that.data.NotBusinessListData.length == 0) {
        that.setData({ empty: true })
      } else {
        that.setData({ empty: false })
      }
    }
  },
  // 用户点击热点预订列表跳转的报名事件
  hotApply: function(e) {
    wx.navigateTo({ url: "/pages/search/lineDetails/lineDetails?index=0" + "&lineCode=" + e.currentTarget.dataset.linecode + "&ticketPrice=" + e.currentTarget.dataset.price + "&lineName=" + e.currentTarget.dataset.linename + "&lineType=" + e.currentTarget.dataset.linetype }) // 进行跳转
  },
  // 用户点击即将开通列表跳转的报名事件
  openApply: function(e) {
    wx.navigateTo({ url: "/pages/search/lineDetails/lineDetails?index=1" + "&lineCode=" + e.currentTarget.dataset.linecode + "&ticketPrice=" + e.currentTarget.dataset.price + "&lineName=" + e.currentTarget.dataset.linename + "&lineType=" + e.currentTarget.dataset.linetype }) // 进行跳转
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
      keyBoxIndex: that.data.keyBoxIndex, // 商务班车目录模块默认第一个
      empty: true,  // 默认为空数据模块显示
      businessListData: [],    // 商务班车热点预订列表数据
      NotBusinessListData: [],    // 商务班车即将开通列表数据
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
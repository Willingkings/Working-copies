// pages/mine/CustomDetails/CustomDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomDetauilsData: [], // 定制详情数据
    pathData: [] // 路线详情数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查询乘客定制需求接口
    getApp().func.speHttp('/vl/cusbus/app/services/findPassengerAdviceById', {
      passengerAdviceId: options.passengeradviceid,
      token: "",
    }, 'get', function (res) {
      res.data[0].startTime = getApp().func.timeMethod.timeDivision(res.data[0].startTime); // 转出发时间将时间戳为时分
      res.data[0].endTime = getApp().func.timeMethod.timeDivision(res.data[0].endTime); // 转返程时间将时间戳为时分
      that.setData({ CustomDetauilsData: res.data[0] })
    })
  },
  // 用户点击展开和关闭按钮
  CloseOpen: function () {
    var that = this;
    if (that.data.unfold == false) {
      that.setData({ unfold: true })
    } else {
      that.setData({ unfold: false })
    }
  },
  // 用户点击邀请好友同行按钮
  invite: function() {
    var that = this;
    var url = "/pages/common/friendsShare/friendsShare"; 
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
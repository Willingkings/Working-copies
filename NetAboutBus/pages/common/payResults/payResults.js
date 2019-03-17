// pages/common/payResults/payResults.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    results: 0,
    realPrice: 0
  },
  friendsShare:function(e){
    var that = this;
    wx.navigateTo({ url: "/pages/common/friendsShare/friendsShare" }) // 进行跳转
  },
  myTicket: function (e) {
    var that = this;
    wx.reLaunch({
      url: '/pages/check-in/orderList/orderList?index=1'
    })
  },
  closePage: function (e) {
    var that = this;
    wx.reLaunch({ url: "/pages/index/index"}) // 进行跳转
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      results: options.results,
      realPrice: options.realPrice,
      title: options.title
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this;
    if (_this.data.results == "1"){
      wx.setNavigationBarTitle({
        title: "定制巴士-退票结果"
      })
    }
   
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
  onShareAppMessage: function (options) {
    var _this = this;
    var shareObj = {
      title: "",
      path: '',          // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '',                              //转发时显示的图片路径，支持网络和本地，不传则使用当前页默认截图。 ../../../img/icon/login.png
      success: function (res) {　                               // 转发成功之后的回调　　　　　
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function () {　                                     // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {      // 用户取消转发

        } else if (res.errMsg == 'shareAppMessage:fail') {      // 转发失败，其中 detail message 为详细失败信息

        }
      },
      complete: function () {                                   // 转发结束之后的回调（转发成不成功都会执行）

      }
    };
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      // var dataid = options.target.dataset; //上方data-id=shareBtn设置的值
      // 此处可以修改 shareObj 中的内容
      shareObj.title = _this.data.title;
      shareObj.path = '/pages/common/friendsShare/friendsShare?title=' + _this.data.title;
    }
    // 返回shareObj
    return shareObj;
  }
})
// pages/mine/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amountNum: "",
    selectAmountNum: ""
  },
  manualIput: function (e) {
    let _this = this;
    _this.setData({
      amountNum: e.detail.value,
      selectAmountNum: e.detail.value
    });
  },
  selectAmount: function (e) {
    let _this = this;
    _this.setData({
      amountNum: e.currentTarget.dataset.num,
      selectAmountNum: e.currentTarget.dataset.num
    });
  },
  recharge: function (){
    let that = this;
    let userData = getApp().globalData.userData
    getApp().func.balanceHttp('/third/gateWay/prepay/recharge', {
      money: this.data.amountNum,
      memberId: userData.memberID,
      business: "70",
      payment_terminal: "20",
      payment_type: "30",    //	支付类型(String, 必填, 可选值：全款传“30”；尾款传“10”)
      payment_method: "65", 
      notify_type: "1",
      openId: userData.openID
    }, 'get', function (res) {
      var timeStamp = res.data.timeStamp.toString()
      wx.requestPayment({
        "timeStamp": timeStamp,
        "package": res.data.package,
        "nonceStr": res.data.nonceStr,
        "paySign": res.data.paySign,
        "signType": "MD5",
        "success": function (rs) {
          if (rs.errMsg == 'requestPayment:ok') {
            // 刷新余额数据
            getApp().func.userHttp('/api/member/logined/getMemberInfo', {
              memberId: userData.memberID,
              sign: userData.sign // 加密
            }, 'get', function (res) {
              getApp().globalData.userData.accountAmount = res.member.AccountAmount;
              wx.navigateTo({
                url: '/pages/mine/index/index'
              })
            })
          }
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
// pages/scanQR/payercode/payercode.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payment: false,
    recharge: false,
    codeImg: "../../../img/icon/ic_dengdaizhong.png",
    timer: '',    //定时器名字
    countDownNum: '20'  //倒计时初始值
  },
  
  /**
   *  获取二维码
   */
  getMemberInfo: function () {
    let that = this;
    let userData = getApp().globalData.userData;
    getApp().func.codeHttp('/api/v1/epps/' + userData.memberID,
    {}, 'get', function (res) {
      if (res.code == "200") {
        if (res.data.status == '1') {
          that.setData({
            codeImg: res.data.qrcode
          })
          that.countDown();
        } else {
          that.setData({
            payment: true
          })
        }
      }
    })
  },
  /**
   *  倒计时
   */
  countDown: function () {
    let that = this;
    clearInterval(that.data.timer);
    let countDownNum = 20;//获取倒计时初始值
    that.setData({
      timer: setInterval(function () { //这里把setInterval赋值给变量名为timer的变量
        countDownNum--;
        that.setData({
          countDownNum: countDownNum
        })
        if (countDownNum == 0) {
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          that.getMemberInfo();
          // function huanImg() {
          //   that.setData({
          //     codeImg: "../../../img/icon/ic_dengdaizhong.png"
          //   })
          //   var timeout = setTimeout(function () {
              
          //   }, 3000);
          // }
          // huanImg();
        }
      }, 1000)
    })
  },
  /**
   * 立即刷新
   */
  refreshImmediately: function () {
    let that = this;
     clearInterval(that.data.timer);
     that.getMemberInfo();
  },
  recharge: function (){
    wx.navigateTo({
      url: "/pages/mine/recharge/recharge"
    })
  },
  otherCode: function (e){
    wx.redirectTo({
      url: "/pages/scanQR/" + e.currentTarget.dataset.type + "/" + e.currentTarget.dataset.type
    })
  },
  /**
   * 开启、验证免密支付
   */
  openPayment: function (){
    wx.navigateTo({
      url: '/pages/scanQR/paycode/paycode'
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
    let that = this;
    if (getApp().globalData.userData.memberID == null) {
      wx.navigateTo({
        url: "/pages/login/login"
      }) // 进行跳转
    } else {
      let balance = getApp().globalData.userData.accountAmount.toFixed(2)
      if (balance < "10") {
        that.setData({
          recharge: true
        })
      } else {
        that.getMemberInfo();
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    clearInterval(that.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    clearInterval(that.data.timer);
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
// pages/check-in/orderContent/unusedTicket/QR_code/QR_code.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageData: "", // ---扫码详情数据
    orderNo: "",  // ------订单号
    QrImg: "",
    QrCode: "", // 0：尚未到发车时间，1：已经到发车时间
    Loadingtime: "", // 二维码定时器
    Orderstime: "" // 状态定时器
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 判断是否是初入页面
    if (options != undefined) {
      that.setData({
        orderNo: options.orderNo  // 赋值订单号
      })
    } 
    // 调取验票二维码接口方法
    function QrImgHttp() {
      // 调取验票二维码接口
      wx.request({
        url: "https://api.microapp.glchuxingwang.com/ewallet/api/v1/cusbus/qrcode/ticket/" + getApp().globalData.userData.mobileNo + "/" + that.data.messageData.flowNo,
        data: {},
        method: "get",
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          // 判断是否到发车时间
          if (res.data.code == 200) {
            that.setData({
              QrCode: 1,
              QrImg: res.data.data
            })
          } else {
            that.setData({
              QrCode: 0
            })
          }
        },
        fail: function () {
          return typeof cb == "function" && cb(false)
        }
      })
    }
    // 调取验票订单详情数据
    function OrdersData() {
      getApp().func.comHttp('/vl/cusbus/app/services/queryOrders', {
        userId: getApp().globalData.userData.mobileNo,  // ---用户id（手机号码）
        flowNo: that.data.orderNo,  // -------------------------流水号(选填)
        useDate: "", // --------------------------------------乘车日期(选填)
        states: "", // ---------------------------------------订单状态(选填),逗号分隔(例如:1,2)
        token: "" // -----------------------------------------令牌
      }, 'get', function (res) {
        // 刷新判断是否已验票
        console.log(res.data[0].state)
        if (res.data[0].state == 3) {
          clearInterval(that.data.Loadingtime) // 退出页面清除二维码定时器
          clearInterval(that.data.Orderstime) // 退出页面清除状态定时器
          var orderNo = that.data.orderNo;  // 订单号
          var url = "/pages/check-in/orderContent/useTicket/useTicket?" + "orderNo=" + orderNo; // 已使用扫码上传路径
          wx.navigateTo({ url: url }) // 进行跳转到已使用扫码上车
        }
      })
    }
    
    // 调取查询定制、众筹、购买的订单信息接口获取订单详情数据
    getApp().func.comHttp('/vl/cusbus/app/services/queryOrders', {
      userId: getApp().globalData.userData.mobileNo,  // ---用户id（手机号码）
      flowNo: that.data.orderNo,  // -------------------------流水号(选填)
      useDate: "", // --------------------------------------乘车日期(选填)
      states: "", // ---------------------------------------订单状态(选填),逗号分隔(例如:1,2)
      token: "" // -----------------------------------------令牌
    }, 'get', function (res) {
      // 刷新判断是否已验票
      if (res.data[0].state == 3) {
        clearInterval(that.data.Loadingtime) // 退出页面清除二维码定时器
        clearInterval(that.data.Orderstime) // 退出页面清除状态定时器
        var orderNo = that.data.orderNo;  // 订单号
        var url = "/pages/check-in/orderContent/useTicket/useTicket?" + "orderNo=" + orderNo; // 已使用扫码上传路径
        wx.navigateTo({ url: url }) // 进行跳转到已使用扫码上车
      }
      that.setData({
        messageData: res.data[0], // 赋值扫码详情数据
      })
      QrImgHttp() // 调用获取二维码方法
    })
    // 创建状态获取定时器
    that.setData({
      Orderstime: setInterval(function () {
        OrdersData() // 调用获取二维码方法
      }, 3000)
    })
    // 创建二维码获取定时器
    that.setData({
      Loadingtime: setInterval(function() {
        QrImgHttp() // 调用获取二维码方法
      }, 20000)
    })
  },

  /** --------------------------------- 用户事件 --------------------------------- **/
  // 用户点击车票详情按钮
  detailsSkip: function () {
    // clearInterval(this.data.Loadingtime) // 退出页面清除二维码定时器
    // clearInterval(this.data.Orderstime) // 退出页面清除状态定时器
    var that = this;
    var orderNo = that.data.orderNo; // 订单号
    var url = "/pages/check-in/orderContent/unusedTicket/ticketService/TicketDetails/TicketDetails?orderNo=" + orderNo + "&used=0"; // 车票详情路径
    wx.navigateTo({ url: url }) // 进行跳转到车票详情
  },
  // 用户点击乘车指引按钮
  ToGuide: function () {
    // clearInterval(this.data.Loadingtime) // 退出页面清除二维码定时器
    // clearInterval(this.data.Orderstime) // 退出页面清除状态定时器
    var that = this;
    var url = "/pages/check-in/orderContent/unusedTicket/ticketService/ToGuide/ToGuide?flowNo=" + that.data.messageData.flowNo; // 车票详情路径
    wx.navigateTo({ url: url }) // 进行跳转到乘车指引
  },
  /** --------------------------------- ------- ---------------------------------- **/
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
    clearInterval(this.data.Loadingtime) // 退出页面清除二维码定时器
    clearInterval(this.data.Orderstime) // 退出页面清除状态定时器
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    clearInterval(this.data.Loadingtime) // 刷新页面清除定时器
    var that = this;
    that.setData({
      messageData: "", // ---扫码详情数据
      orderNo: that.data.orderNo,  // ------订单号
      QrImg: "",
      QrCode: "", // 0：尚未到发车时间，1：已经到发车时间
      Loadingtime: ""
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
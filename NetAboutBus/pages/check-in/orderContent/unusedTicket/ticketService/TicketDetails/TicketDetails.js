// pages/check-in/orderContent/unusedTicket/ticketService/TicketDetails/TicketDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reimbursement: false, // ---默认退票弹窗为隐藏状态
    particularsData: [], // ----班车详情数据
    courseData: [], // ---------途径路线数据
    used: "",  // --------------是否显示退票按钮(0:显示,1:隐藏)
    open: true, // -------------默认线路为展开状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ used: options.used }) // 是否显示退票按钮
    // 初加载接口数据
    function HttpData() {
      // 调取查询定制、众筹、购买的订单信息接口获取订单详情数据
      getApp().func.comHttp('/vl/cusbus/app/services/queryOrders', {
        userId: getApp().globalData.userData.mobileNo,  // ---用户id（手机号码）
        flowNo: options.orderNo,  // -------------------------流水号(选填)
        useDate: "", // --------------------------------------乘车日期(选填)
        states: "", // ---------------------------------------订单状态(选填),逗号分隔(例如:1,2)
        token: "" // -----------------------------------------令牌
      }, 'get', function (res) {
        that.setData({ particularsData: res.data[0] }) // 赋值班车详情数据
        // 调取当前线路的站点信息接口获取站点信息数据
        getApp().func.comHttp('/vl/cusbus/app/services/lineDetail', {
          lineCode: res.data[0].lineCode, // ---线路编号
          token: "" // -------令牌
        }, 'get', function (res) {
          that.setData({ courseData: res.data.stationInfo }) // 赋值途径路线数据
        })
      })
    }
    HttpData()
  },
  // 用户点击展开和关闭
  OpeningClosing: function () {
    var that = this;
    if (that.data.open == true) {
      that.setData({ open: false })
    } else {
      that.setData({ open: true })
    }
  },
  // 用户点击我要退票按钮
  applyFor: function () {
    var that = this;
    that.setData({ reimbursement: true })
  },
  // 用户点击取消退票
  cancel: function () {
    var that = this;
    that.setData({ reimbursement: false })
  },
  // 用户点确认退票
  refundSucceed: function () {
    var that = this;
    // 退票接口
    getApp().func.speHttp('/vl/cusbus/app/services/addRefundApply', {
      userId: getApp().globalData.userData.mobileNo,  // ---用户id（手机号码）
      flowNo: that.data.particularsData.flowNo,  // -------------------------流水号(选填)
      token: "" // -----------------------------------------令牌
    }, 'get', function (res) {
      if(res.success == true){
        var url = "/pages/common/payResults/payResults?realPrice=" + that.data.particularsData.orderPrice + "&results=1"; 
        wx.navigateTo({ url: url }) // 进行跳转
      } else {
        that.setData({ reimbursement: false })
        wx.showModal({
          title: res.message,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              return
            }
          }
        })
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
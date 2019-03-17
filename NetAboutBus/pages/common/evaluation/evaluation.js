// pages/common/evaluation/evaluation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    one_2: 0,
    two_2: 5,
    pop_up: 0, // ------------线路详情弹窗（0:隐藏,1:弹出）
    particularsData:[], // ---班车详情数据
    courseData: [], // -------途径路线数据
    concent: "" // ---------------用户评论文字内容
  },

  in_xin: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    var one_2;
    if (in_xin === 'use_sc2') {
      one_2 = Number(e.currentTarget.id);
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2;
    }
    this.setData({
      one_2: one_2,
      two_2: 5 - one_2
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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
  },
  /** --------------------------------用户事件------------------------------------------ **/
  // 用户评论失焦
  bindTextAreaBlur: function (e) {
    var that = this;
    that.setData({ concent: e.detail.value }) // 保存用户评论文字内容
  },
  // 用户点击线路详情
  particulars: function() {
    var that = this;
    that.setData({ pop_up: 1 })
  },
  // 用户点击关闭弹窗
  close: function () {
    var that = this;
    that.setData({ pop_up: 0 })
  },
  // 用户点击提交评论按钮
  submint: function () {
    var that = this;
    // 判断用户是否点击星级
    if (that.data.one_2 == 0) {
      wx.showToast({
        title: '请选择星级',
        icon: 'loading',
        duration: 1000
      })
    } else {
      // 调取评价当前订单的线路接口
      getApp().func.speHttp('/vl/cusbus/app/services/remarkOrder', {
        userId: getApp().globalData.userData.mobileNo,  // ---用户id（手机号码）
        orderNo: that.data.particularsData.flowNo,  // -------订单号
        lineCode: that.data.particularsData.lineCode, // -----线路编号
        remark: that.data.concent, // ------------------------评价内容
        starLevel: that.data.one_2, // -----------------------星级
        token: "" // -----------------------------------------令牌
      }, 'get', function (res) {
        if (res.success == true) {
          // 后退
          wx.navigateBack({ delta: 1 })
        } else {
          wx.showToast({
            title: '评论失败',
            icon: 'loading',
            duration: 1000
          })
        }
      })
    }
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
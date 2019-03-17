// pages/check-in/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TicketTypeIndex: "", // ---默认用户初加载为未使用模块（0：未支付，1：未使用，2：已使用，3：已退票）
    nonPayment: [], // -------未支付列表数据
    unused: [], // -----------未使用列表数据
    employ: [], // -----------已使用列表数据
    refund: [], // -----------已退票列表数据
    empty: false,  // ---------默认为空数据模块显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 判断是否是用户刷新 不是就赋值用户选择类型
    if (options != undefined) {
      that.setData({ TicketTypeIndex: options.index })
    } 
    
    // 初加载接口
    function HttpList(type) {
      // 调取查询定制、众筹、购买的订单信息接口获取未支付列表数据（1.未支付 2.未验票 3.已验票 4.已退票 5.已过期 9.退票中）
      getApp().func.comHttp('/vl/cusbus/app/services/queryOrders', {
        userId: getApp().globalData.userData.mobileNo,  // ---用户id（手机号码）
        flowNo: "",  // --------------------------------------流水号(选填)
        useDate: "", // --------------------------------------乘车日期(选填)
        states: type, // -------------------------------------订单状态(选填),逗号分隔(例如:1,2)
        token: "" // -----------------------------------------令牌
      }, 'get', function (res) {
        // 判断未支付列表数据不为空时
        if (res.data.length != 0) {
          // 循环将 1.下单时间戳转换成 Yyyy-Mm-Dd Hh:Mm:Ss格式 2.使用时间 Yyyy-Mm-Dd Hh:Mm:Ss 转为 Yyyy-Mm-Dd
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].occurtime = getApp().func.timeMethod.timestamp(res.data[i].occurtime);  // ---转时间戳
            res.data[i].runTimeStr = res.data[i].runTimeStr.substr(0, 10); // ------------------------截取使用时间字符串
          }
          if (type == 1) {
            that.setData({ nonPayment: res.data }) // ---赋值未支付列表数据
          } else if (type == 2) {
            that.setData({ unused: res.data }) // -------赋值未使用列表数据
          } else if (type == 3) {
            that.setData({ employ: res.data }) // -------赋值已使用列表数据
          } else if (type == 4) {
            that.setData({ refund: res.data }) // -------赋值已退票列表数据
          }
        }
      })
    }
    HttpList(1);
    HttpList(2);
    HttpList(3);
    HttpList(4);
    var timeOut = setTimeout(function () {
      that.TicketTypeSele(that.data.TicketTypeIndex) // 用户选择验票类型点击事件
    }, 1000)
  },

  /** --------------------------------- 用户事件 --------------------------------- **/
  // 用户选择验票类型点击事件
  TicketTypeSele: function (e) {
    var that = this;
    console.log(e)
    console.log(that.data.unused)
    if (e.currentTarget == undefined) {
      if (e == 0) {
        // 未支付数据为空时显示空模块
        if (that.data.nonPayment.length == 0) {
          that.setData({ empty: true })
        } else {
          that.setData({ empty: false })
        }
      } else if (e == 1) {
        // 未使用数据为空时显示空模块
        if (that.data.unused.length == 0) {
          that.setData({ empty: true })
        } else {
          that.setData({ empty: false })
        }
      } else if (e == 2) {
        // 已使用数据为空时显示空模块
        if (that.data.empty.length == 0) {
          that.setData({ empty: true })
        } else {
          that.setData({ empty: false })
        }
      } else if (e == 3) {
        // 已退票数据为空时显示空模块
        if (that.data.refund.length == 0) {
          that.setData({ empty: true })
        } else {
          that.setData({ empty: false })
        }
      } 
    } else {
      that.setData({ TicketTypeIndex: e.currentTarget.dataset.tickettypeindex });
      if (e.currentTarget.dataset.tickettypeindex == 0) {
        // 未支付数据为空时显示空模块
        if (that.data.nonPayment.length == 0) {
          that.setData({ empty: true })
        } else {
          that.setData({ empty: false })
        }
      } else if (e.currentTarget.dataset.tickettypeindex == 1) {
        // 未使用数据为空时显示空模块
        if (that.data.unused.length == 0) {
          that.setData({ empty: true })
        } else {
          that.setData({ empty: false })
        }
      } else if (e.currentTarget.dataset.tickettypeindex == 2) {
        // 已使用数据为空时显示空模块
        if (that.data.empty.length == 0) {
          that.setData({ empty: true })
        } else {
          that.setData({ empty: false })
        }
      } else if (e.currentTarget.dataset.tickettypeindex == 3) {
        // 已退票数据为空时显示空模块
        if (that.data.refund.length == 0) {
          that.setData({ empty: true })
        } else {
          that.setData({ empty: false })
        }
      } 
    } 
  },
  // 用户点击未支付列表
  nonPayment: function (e) {
    var that = this;
    // 未支付数据为空时显示空模块
    if (that.data.nonPayment.length == 0) {
      that.setData({ empty: true })
    }
    var url = "/pages/common/submitOrders/submitOrders?inOrder=0&lineCode=" + e.currentTarget.dataset.linecode + "&runTime=" + e.currentTarget.dataset.runtime + "&selectedDate=" + e.currentTarget.dataset.date + "&lineName=" + e.currentTarget.dataset.linename + "&flowNo=" + e.currentTarget.dataset.flowno + "&selectSite=" + e.currentTarget.dataset.startstation  
    wx.navigateTo({ url: url }) // 进行跳转到已使用扫码上车
  },
  // 用户点击未使用列表
  unusedSkip: function (e) {
    var that = this;
    var orderNo = e.currentTarget.dataset.orderno;  // 订单号
    var url = "/pages/check-in/orderContent/unusedTicket/QR_code/QR_code?" + "orderNo=" + orderNo; // 未使用扫码上车路径
    wx.navigateTo({ url: url }) // 进行跳转到未使用扫码上车
  },
  // 用户点击已使用列表
  useSkip: function (e) {
    var that = this;
    var orderNo = e.currentTarget.dataset.orderno;  // 订单号
    var url = "/pages/check-in/orderContent/useTicket/useTicket?" + "orderNo=" + orderNo; // 已使用扫码上传路径
    wx.navigateTo({ url: url }) // 进行跳转到已使用扫码上车
  },
  // 用户点击已退票列表
  refundSkip: function (e) {
    var that = this;
    var orderNo = e.currentTarget.dataset.orderno;  // 订单号
    var lineName = e.currentTarget.dataset.linename;  // 线路名
    var url = "/pages/check-in/orderContent/refundTicket/refundTicket?" + "orderNo=" + orderNo + "&lineName=" + lineName; // 退票详情路径
    wx.navigateTo({ url: url }) // 进行跳转到退票详情
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.setData({ 
      TicketTypeIndex: that.data.TicketTypeIndex, // ---默认用户初加载为未使用模块（0：未支付，1：未使用，2：已使用，3：已退票）
      nonPayment: [], // -------未支付列表数据
      unused: [], // -----------未使用列表数据
      employ: [], // -----------已使用列表数据
      refund: [], // -----------已退票列表数据
      empty: true,  // ---------默认为空数据模块显示
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
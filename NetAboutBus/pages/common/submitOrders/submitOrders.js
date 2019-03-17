// pages/common/submitOrders/submitOrders.js
var phoneNumReg = /^[1][3,4,5,7,8][0-9]{9}$/;  // 手机号码正则
var phoneNumReg1 = /^[1][9][8-9][0-9]{8}$/;  // 手机号码正则
var phoneNumReg2 = /^[1][6][6][0-9]{8}$/;  // 手机号码正则
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    origin: "",
    terminus: "",
    stepPrice: "",
    planArriveTime: "",
    selectedDate: "",
    selectSite: "",
    runTime: "",
    userName: "",
    userPhone:"",
    buttonClicked: false
  },
  submitOrders: function(e){
    let _this = this;
    if (_this.data.buttonClicked) {
      return;
    }
    getApp().func.speHttp('/vl/cusbus/app/services/buyTicket', {
      lineCode: parseInt(_this.data.lineCode),        //
      lineName: _this.data.title,        //	线路名称	string	query	true
      startStation: _this.data.selectSite,    //	开始站点名称	string	query	true
      endStation: _this.data.terminus,      //	结束站点名称	string	query	true
      customerNum: _this.data.selectedDate.length,     //	购票数	integer	query	true
      useDate: _this.data.selectedDate.join(","),         //	乘车日期, 多日期用','隔开	string	query	true
      runTime: _this.data.runTime,         //	发车时间	string	query	true
      userId: _this.data.userPhone,          //	用户id	string	query	true
      userName: _this.data.userName,        //	用户名	string	query	true
      tel: _this.data.userPhone,             //	手机号	string	query	true
      orderPrice: _this.data.stepPrice * _this.data.selectedDate.length,      //	订单价格（此次消费总价）	number	query	true
      offPrice: 0,        //	优惠券价格（此次消费总优惠价格）	number	query	false
      remark: _this.data.userData.memberID,
      buyType: 1,         //	订单类型 1.常规票 2.活动专线票 3.众筹 4.招募	integer	query	true
      token: "",
    }, 'get', function (res) {
      if (res.success) {
        var realPrice = res.data[0].info.realPrice
        var flowNo = "";
        if (res.data.length > 1) {
          let flow = res.data[0].info.flowNo
          flowNo = "Z" + flow.substr(-flow.length + 1)
        } else {
          flowNo = res.data[0].info.flowNo
        }
        getApp().func.speHttp('/cusbus/app/services/ticketpay', {
          userId: res.data[0].info.tel,           //   用户ID
          memberId: _this.data.userData.memberID,             //	会员号
          flowNo: flowNo,              //	  订单编号
          paymentMoney: res.data[0].info.realPrice * res.data[0].info.ticketNum,      //	支付金额,单位元
          paymentTerminal: "20",                  //	终端类型,可选值：APP传“10”；wechat公众号传“20”
          paymentMethod: "64",                    //	支付方式,可选值：公众号微信支付传“62”；公众号银联支付传“71”
          bankNumber: "",                         //	融联银行编码
          openId: _this.data.userData.openID      //	微信公众号支付
        }, 'get', function (res) {
          var timeStamp = res.data.timeStamp.toString()
          // 微信支付
          wx.requestPayment({
            "timeStamp": timeStamp,
            "package": res.data.package,
            "nonceStr": res.data.nonceStr,
            "paySign": res.data.paySign,
            "signType": "MD5",
            "success": function (rs) {
              if (rs.errMsg == 'requestPayment:ok') {
                wx.navigateTo({
                  url: '/pages/common/payResults/payResults?realPrice=' + realPrice + "&results=0&title=" + _this.data.title
                })
              } else {
                wx.showModal({
                  title: '支付失败(下单成功)',
                  content: '点击确认可到订单中心重新支付',
                  success: function (res) {
                    console.log('用户点击确定')
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '/pages/check-in/orderList/orderList?index=0'
                      })
                      return
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                      // 限制重复点击下单
                      _this.setData({
                        buttonClicked: true
                      })
                    }
                  }
                })
              }
            },
            'fail': function (rs) {
              console.log('程序调用支付失败')
              wx.showModal({
                title: '已取消支付(下单成功)',
                content: '点击确认可到订单中心重新支付',
                success: function (res) {
                  // 限制重复点击下单
                  _this.setData({
                    buttonClicked: true
                  })
                  console.log('用户点击确定')
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '/pages/check-in/orderList/orderList?index=0'
                    })
                    return
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        })
      }
    })
  },
  payOrders: function (e) {
    let _this = this;
    if (getApp().globalData.userData.memberID) {
      if (_this.data.buttonClicked) {
        return;
      }
      getApp().func.speHttp('/cusbus/app/services/ticketpay', {
        userId: _this.data.userPhone,           //   用户ID
        memberId: _this.data.userData.memberID,             //	会员号
        flowNo: _this.data.flowNo,              //	  订单编号
        paymentMoney: _this.data.realPrice,      //	支付金额,单位元
        paymentTerminal: "20",                  //	终端类型,可选值：APP传“10”；wechat公众号传“20”
        paymentMethod: "64",                    //	支付方式,可选值：公众号微信支付传“62”；公众号银联支付传“71”
        bankNumber: "",                         //	融联银行编码
        openId: _this.data.userData.openID,           //	微信公众号支付
      }, 'get', function (res) {
        var timeStamp = res.data.timeStamp.toString()
        // 微信支付
        wx.requestPayment({
          "timeStamp": timeStamp,
          "package": res.data.package,
          "nonceStr": res.data.nonceStr,
          "paySign": res.data.paySign,
          "signType": "MD5",
          "success": function (rs) {
            if (rs.errMsg == 'requestPayment:ok') {
              wx.navigateTo({
                url: '/pages/common/payResults/payResults?realPrice=' + _this.data.realPrice + "&results=0&title=" + _this.data.title
              })
            } else {
              wx.showModal({
                title: '支付失败(下单成功)',
                content: '点击确认可到订单中心重新支付',
                success: function (res) {
                  console.log('用户点击确定')
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '/pages/check-in/orderList/orderList?index=0'
                    })
                    return
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    // 限制重复点击下单
                    _this.setData({
                      buttonClicked: true
                    })
                  }
                }
              })
            }
          },
          'fail': function (rs) {
            console.log('程序调用支付失败')
            wx.showModal({
              title: '已取消支付(下单成功)',
              content: '点击确认可到订单中心重新支付',
              success: function (res) {
                // 限制重复点击下单
                _this.setData({
                  buttonClicked: true
                })
                console.log('用户点击确定')
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  })
                  return
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      })
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      })
    }
  },
  manualIput: function(e){
    let key = e.currentTarget.dataset.type;
    let _this = this;
    if (key == "userName" ){
      _this.setData({
        userName: e.detail.value
      })
    }else{ 
      _this.setData({
        userPhone: e.detail.value
      })
    }
  },
  reselectDate:function(e){
    let _this = this;
    wx.navigateBack({
      delta: 1
    })
    _this.setData({
      buttonClicked: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  lineDetailArriveTime: function (lineCode, selectedDate, runTime){
    let _this = this;
    getApp().func.comHttp('/vl/cusbus/app/services/lineDetailWithPlanArriveTime', {
      lineCode: lineCode,
      workDate: selectedDate,
      runTime: runTime,
      token: ""
    }, 'get', function (res) {
      var stationInfo = res.data.stationInfo;
      function quickSort(arr) {
        //如果数组长度小于等于1，则返回数组本身
        if (arr.length <= 1) {
          return arr;
        }
        //定义中间值的索引
        var index = Math.floor(arr.length / 2);
        //取到中间值
        let temp = arr.splice(index, 1);
        let tempList = temp[0].split("-")
        let tempDate = new Date(Number(tempList[0]), Number(tempList[1])-1, Number(tempList[2])).getTime()
        //定义左右部分数组
        var left = [];
        var right = [];
        for (var i = 0; i < arr.length; i++) {
          //如果元素比中间值小，那么放在左边，否则放右边
          let iList = arr[i].split("-");
          let iDate = new Date(Number(iList[0]), Number(iList[1]) - 1, Number(iList[2])).getTime()
          if (iDate < tempDate) {
            left.push(arr[i]);
          } else {
            right.push(arr[i]);
          }
        }
        return quickSort(left).concat(temp, quickSort(right));
      }
      _this.setData({
        origin: stationInfo[0].name,
        terminus: stationInfo[stationInfo.length - 1].name,
        stepPrice: stationInfo[0].stepPrice,
        planArriveTime: stationInfo[0].planArriveTime,
        selectedDate: quickSort(selectedDate.split(","))
      })
    })
  },
  onLoad: function (options) {
    console.log(options)
    let _this = this;
    let userData = getApp().globalData.userData;
    _this.setData({
      inOrder: options.inOrder,
      lineCode: options.lineCode,
      title: options.lineName,
      runTime: options.runTime,
      selectedDateString: options.selectedDate,
      selectSite: options.selectSite,
      userPhone: userData.mobileNo,
      userData: userData
    })
    if (options.inOrder == 0){
      _this.setData({
        flowNo: options.flowNo
      })
    }
    // _this.lineDetailArriveTime(options.lineCode, options.selectedDate, options.runTime)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this;
    _this.lineDetailArriveTime(_this.data.lineCode, _this.data.selectedDateString, _this.data.runTime);
    if (_this.data.inOrder == 0){
      getApp().func.comHttp('/vl/cusbus/app/services/queryOrders', {
        userId: _this.data.userPhone,  // ---用户id（手机号码）
        flowNo: _this.data.flowNo,  // --------------------------------------流水号(选填)
        useDate: "", // --------------------------------------乘车日期(选填)
        states: 1, // -------------------------------------订单状态(选填),逗号分隔(例如:1,2)
        token: "" // -----------------------------------------令牌
      }, 'get', function (res) {
        if (res.success) {
          console.log(res)
          _this.setData({
            realPrice: res.data[0].realPrice,
            selectSite: res.data[0].startStation
          })
        }
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
  onShareAppMessage: function () {

  }
})
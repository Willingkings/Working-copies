// pages/LineDetails/LineDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** * ** ** * ** ** * ** 初加载数据 ** * ** ** * ** ** * **/
    routeLength: 0, // 路线总长度
    blueLength: 0, // 蓝线长度美女，，吗。
    routemargin: 0, // 路线总长外边距
    siteIndex: 0, // 选中的站点
    siteName: 0, // 选中的站点名字
    userSelectleft: 0, // 用户选中坐标移动距离
    routemargin: 40, // 路线总长度的外边距
    siteLength: 60, // 站点长度
    siteMargin: 90, // 站点外边距
    windowWidth: 0, // 设备窗口宽度
    lineId: "", // 接口参数
    siteListData: [], // 站点列表
    busesData: [], // 巴士数据
    speedData: [], // 速度数据
    ratio: [], // rpx比例转换
    ratioData: { 
      routemargin: "", // 路线总长度的外边距
      siteLength: "", // 站点长度
      siteMargin: "", // 站点外边距
      locationSelect: "",
      busWidth: ""
    },
    busLeft: "", // 大巴
    stationname: "",
    scrollLet: "",
    
  },
  /** * ** ** * ** ** * ** 方法 ** * ** ** * ** ** * **/
  // 获取屏幕宽度
  windowWidthMethod: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let windowWidth = (res.windowWidth * (750 / res.windowWidth)); // 将高度乘以换算后的该设备的rpx与px的比例
        that.setData({
          windowWidth: windowWidth,
          ratio: 750 / res.windowWidth
        })
      }
    })
  },
  // 初加载计算样式rpx
  rpxMethod: function (index) {
    var that = this;
    if (that.data.ratioData.locationSelect == "") {
      wx.createSelectorQuery().select('.userSelect').fields({
        dataset: true,
        size: true,
        computedStyle: ['margin']//此处返回指定要返回的样式名
      }, function (res) {
        that.setData({
          ratioData: {
            siteLength: res.width, // 站点长度
            siteMargin: parseInt(res.margin.substring(4).slice(0, -8))// 站点外边距
          },
        })
        }).exec()
      wx.createSelectorQuery().select('.busIcon1').fields({
        dataset: true,
        size: true,
      }, function (res) {
        that.setData({
          ratioData: {
            siteLength: that.data.ratioData.siteLength, // 站点长度
            siteMargin: that.data.ratioData.siteMargin, // 站点外边距
            busWidth: res.width, 
          },
        })
      }).exec()
      wx.createSelectorQuery().selectAll('.List,.locationSelect').fields({
        dataset: true,
        size: true,
        computedStyle: ['margin']//此处返回指定要返回的样式名
      }, function (res) {
        that.setData({
          ratioData: {
            siteLength: that.data.ratioData.siteLength, // 站点长度
            siteMargin: that.data.ratioData.siteMargin, // 站点外边距
            busWidth: that.data.ratioData.busWidth, 
            routemargin: parseInt(res[1].margin.substring(4)), // 路线总长度的外边距
            locationSelect: res[0].width
          }, 
        })
      }).exec()
    }
    if (that.data.ratioData.locationSelect == "") {
      setTimeout(function () {
        var len = ((index) * that.data.ratioData.siteMargin + ((index) * that.data.ratioData.siteLength) + that.data.ratioData.routemargin + (that.data.ratioData.siteLength / 2) - (that.data.ratioData.locationSelect / 2)) * that.data.ratio
        
        that.setData({
          userSelectleft: len, // 选中图片位移长度
          siteIndex: index + 1, // 用户选中的标识
          scrollLet: len - that.data.windowWidth + that.data.windowWidth / 2 + "rpx"
        })
        that.busHttp(that.data.lineId, that.data.direction) // 调取通过线路和上下行方式，获取线路和线路上的BUS信息接口
      }, 1000)
    } else {
      var len = ((index) * that.data.ratioData.siteMargin + ((index) * that.data.ratioData.siteLength) + that.data.ratioData.routemargin + (that.data.ratioData.siteLength / 2) - (that.data.ratioData.locationSelect / 2)) * that.data.ratio
      that.setData({
        userSelectleft: len, // 选中图片位移长度
        siteIndex: index + 1, // 用户选中的标识
        scrollLet: len - that.data.windowWidth + that.data.windowWidth / 2 + "rpx"
      })
      that.busHttp(that.data.lineId, that.data.direction) // 调取通过线路和上下行方式，获取线路和线路上的BUS信息接口
    }


  },
  // 通过站点获取线路样式
  site: function (siteNumber) {
    let that = this;
    let routemargin = 40; // 路线总长度的外边距
    let siteLength = 60; // 站点长度
    let siteMargin = 90; // 站点外边距
    let length = siteNumber * siteLength + ((siteNumber - 1) * siteMargin);
    // 判断蓝色线是否小于屏幕宽度
    if (length + (routemargin * 2) < that.data.windowWidth) {
      that.setData({
        routeLength: length, // 路线总长度
        blueLength: "width: 100%", // 蓝线长度
        routemargin: routemargin // 路线总长度的外边距
      })
    } else {
      that.setData({
        routeLength: length, // 路线总长度
        blueLength: "width:" + (length + (routemargin * 2)) + "rpx", // 蓝线长度
        routemargin: routemargin // 路线总长度的外边距
      })
    }
  },
  // 循环获取初加载站点索引添加样式
  circulation: function (data, name) {
    let that = this;
    for (var i = 0; i < data.length; i ++ ) {
      if (data[i].stationName == name) {
        that.userSelect(i) // 调用用户选中最近的站点事件
        that.setData({
          siteName: data[i].stationName
        })
      } 
    }
  },
  // 计算站点之间的总距离
  distance: function (index1, index2) {
    let that = this;
    let distanceLength = 0;
    for (var i = index1 - 1; i <= index2 - 3; i++) {
      distanceLength += that.data.siteListData.stations[i].nextStopDistance
    }
    return distanceLength
  },
  // 循环获取初加载站点最近的三个速度时间
  SpeedTime: function (data) {
    let that = this;
    var busArr = []; // 新的巴士排序数组
    var k;
    // 循环筛选没有出发的车子
    for (k in data) {
      // 排除nextStationSequnce == 0 没有出发的车子
      if (data[k].nextStationSequnce != "0") {
        // 排除用户选中的地点已经过站的车
        if ((parseInt(data[k].nextStationSequnce)) <= that.data.siteIndex + 1) {
          busArr.push(data[k]); // 移入出发的巴士数组
        }
      }
    }
    // 按照下一站到达哪一个点进行排序方法
    function sequence(a, b) {
      if (parseInt(a.nextStationSequnce) > parseInt(b.nextStationSequnce)) {
        return 1;
      } else if (parseInt(a.nextStationSequnce) < parseInt(b.nextStationSequnce)) {
        return -1
      } else {
        return 0;
      }
    }
    busArr = busArr.sort(sequence) // 进行排序
    // 得出最近三个调用最后计算方法
    function calculate(data) {
      var NewsliceArr = data;
      var informationArr = []
      for (var i = 0; i < NewsliceArr.length; i++) {
        // 判断下一站是否是用户选择的站
        if (NewsliceArr[i].nextStationSequnce != that.data.siteIndex + 1) {
          // 剩余路程需要秒数
          var remainingJourney = ((Number(NewsliceArr[i].busToNextStationDistance)) + (that.distance(Number(NewsliceArr[i].nextStationSequnce), that.data.siteIndex + 1)));
          informationArr[i] = {
            speed: remainingJourney / 5,
            site: that.data.siteIndex - NewsliceArr[i].nextStationSequnce + "站", // 添加剩余站点数
            luchenglength: (remainingJourney / 1000).toFixed(1)
          }
        }
      }
      // 进行转换为分(45秒到60秒为一分钟 45秒以下为即将到达)
      for (var i = 0; i < informationArr.length; i++) {
        if (informationArr[i].site == "0站" || informationArr[i].site == "1站") {
          informationArr[i].site = "即将到站"
        } 
        if (informationArr[i].speed < 45) {
          informationArr[i].speed = 30 + "秒"
        } else if (informationArr[i].speed >= 45 && informationArr[i].speed <= 60) {
          informationArr[i].speed = 1 + "分"
        } else {
          informationArr[i].speed = parseInt(informationArr[i].speed / 60) + "分"
        }
      }

      that.setData({
        speedData: informationArr.reverse()
      })
    }
    // 循环筛选用户选中站点最近的前3个站
    function busThree() {
      // 没有班车状态
      if (busArr.length == 0) {
        console.log("设置它为空")
        that.setData({
          speedData: []
        })
        console.log(that.data.speedData)
      // 三班以内班车状态
      } else if (busArr.length <= 3) {
        console.log("设置它为1到3班")
        calculate(busArr)
      // 大于三班班车状态
      } else if (busArr.length > 3) {
        var NewsliceArr = busArr.slice(-3) // 截取后三位
        var repetitionNumber = 0; // 重复个数为0(状态可能值，全部重复（2），前两个重复（1），后两个重复（1），没有重复（0）)
        var repetition = []; // 重复对象
        // 计算后三个重复个数
        for (var i = 0; i < NewsliceArr.length - 1; i++) {
          var j = i + 1;
          if (NewsliceArr[i].nextStationSequnce == NewsliceArr[j].nextStationSequnce) {
            repetitionNumber += 1
            repetition.push(i)
            repetition.push(j)
          }
        }
        // 全部重复筛选后面是否有重复的值获取真正最近的三个
        function congruent() {
          var sliceNumber = NewsliceArr[0].nextStationSequnce // 当前相同的下站点数
          // 判断倒数三个后面第四个有没有重复
          if (busArr[busArr.length - 4].nextStationSequnce == sliceNumber) {
            // 进行循环看还有多少重复
            for (var i = busArr.length - 4; i > 0; i--) {
              // 判断相同的都移入NewsliceArr数组数据再进行筛选
              if (busArr[i].nextStationSequnce == sliceNumber) {
                NewsliceArr.push(busArr[i])
              } else {
                return
              }
            }
            var ectypeArr = []
            // 通过时间秒数进行排序
            function sequence(a, b) {
              if (parseInt(a.busToNextStationDistance) > parseInt(b.busToNextStationDistance)) {
                return 1;
              } else if (parseInt(a.busToNextStationDistance) < parseInt(b.busToNextStationDistance)) {
                return -1
              } else {
                return 0;
              }
            }
            NewsliceArr = NewsliceArr.sort(sequence).slice(0, 3) // 进行排序截取前三个

            calculate(NewsliceArr); // 得出最近三个调用最后计算方法
          } else {
            calculate(NewsliceArr); // 得出最近三个调用最后计算方法
          }
        }
        // 没有重复筛选后面是否有重复的值获取真正最近的三个
        function behind() {
          // 判断第四个与第三个是否是用一个站点
          if (busArr[busArr.length - 4].nextStationSequnce == busArr[busArr.length - 3].nextStationSequnce) {
            var identicalArr = [busArr[busArr.length - 3]]; 
            var sliceNumber = busArr[busArr.length - 3].nextStationSequnce; // 倒数第三个的下站点数
            // 进行循环看还有多少重复
            for (var i = busArr.length - 4; i > 0; i--) {
              // 判断相同的都移入新的数组数据再进行筛选
              if (busArr[i].nextStationSequnce == sliceNumber) {
                identicalArr.push(busArr[i])
              }
            }
            var ectypeArr = [];
            // 进行循环计算距离加索引赋值新的数组
            for (var i = 0; i < identicalArr.length; i++) {
              ectypeArr.push({ speed: parseInt(identicalArr[i].busToNextStationDistance), index: i })
            }
            // 通过时间秒数进行排序
            function sequence(a, b) {
              if (parseInt(a.speed) > parseInt(b.speed)) {
                return 1;
              } else if (parseInt(a.speed) < parseInt(b.speed)) {
                return -1
              } else {
                return 0;
              }
            }
            ectypeArr = ectypeArr.sort(sequence) // 进行排序
            NewsliceArr[0] = identicalArr[ectypeArr[0].index]; // 赋值真正最近的三个站点
            calculate(NewsliceArr); // 得出最近三个调用最后计算方法
          } else {
            calculate(NewsliceArr); // 得出最近三个调用最后计算方法
          }
        }
        // 前两个重复选后面是否有重复的值获取真正最近的三个
        function Arepetitive() {
          // 判断第四个与第三个是否是用一个站点
          if (busArr[busArr.length - 4].nextStationSequnce == busArr[busArr.length - 3].nextStationSequnce) {
            var identicalArr = [busArr[busArr.length - 3], busArr[busArr.length - 2]];
            var sliceNumber = busArr[busArr.length - 3].nextStationSequnce; // 倒数第三个的下站点数
            // 进行循环看还有多少重复
            for (var i = busArr.length - 4; i > 0; i--) {
              // 判断相同的都移入新的数组数据再进行筛选
              if (busArr[i].nextStationSequnce == sliceNumber) {
                identicalArr.push(busArr[i])
              }
            }
            var ectypeArr = [];
            // 进行循环计算距离加索引赋值新的数组
            for (var i = 0; i < identicalArr.length; i++) {
              ectypeArr.push({ speed: parseInt(identicalArr[i].busToNextStationDistance), index: i })
            }
            // 通过时间秒数进行排序
            function sequence(a, b) {
              if (parseInt(a.speed) > parseInt(b.speed)) {
                return 1;
              } else if (parseInt(a.speed) < parseInt(b.speed)) {
                return -1
              } else {
                return 0;
              }
            }
            ectypeArr = ectypeArr.sort(sequence) // 进行排序
            NewsliceArr[0] = identicalArr[ectypeArr[0].index]; // 赋值真正最近的三个站点
            calculate(NewsliceArr); // 得出最近三个调用最后计算方法
          } else {
            calculate(NewsliceArr); // 得出最近三个调用最后计算方法
          }
        }
        if (repetitionNumber == 2) {
          congruent(); // 调用全部重复筛选后面是否有重复的值获取真正最近的三个方法
        // 一个重复
        } else if (repetitionNumber == 1) {
          // 判断是前两个重复还是后两个重复
          if (repetition[0] == 0) {
            Arepetitive(); // 调用前两个重复选后面是否有重复的值获取真正最近的三个方法
          } else {
            behind(); // 调用没有重复筛选后面是否有重复的值获取真正最近的三个方法
          }
        // 没有重复
        } else if (repetitionNumber == 0) {
          behind(); // 调用没有重复筛选后面是否有重复的值获取真正最近的三个方法
        } else {
          cosnole.log("这段代码报错")
        }

      }
    }
    busThree() // 调用循环筛选用户选中站点最近的前3个站方法
   
  },
  // 巴士图片位移方法
  busList: function (data) {
    var that = this;
    var busData = []
    var k;
    // 循环筛选没有出发的车子
    for (k in data) {
      // 排除nextStationSequnce == 0 没有出发的车子
      if (data[k].nextStationSequnce != "0") {
        busData.push(data[k])
      }
    }
    var hArr = []
    for (var z = 0; z < busData.length; z++) {
      var ActualTotalDistance = 0; // 实际总距离
      for (var i = 0; i < busData[z].nextStationSequnce - 1; i++) {
        ActualTotalDistance += that.data.siteListData.stations[i].nextStopDistance
      }
      // 虚拟总距离
      var len = (((busData[z].nextStationSequnce) * that.data.ratioData.siteLength) + ((busData[z].nextStationSequnce - 2) * (that.data.ratioData.siteMargin) + that.data.ratioData.siteMargin) - that.data.ratioData.busWidth / 4) * that.data.ratio;
      hArr.push(len - (busData[z].busToNextStationDistance / ActualTotalDistance * len))
    }
    that.setData({
      busLeft: hArr
    })
  },
  // 调取获取线路上的所有站点接口获取列表（如：10）
  StationNameMethod: function (lineId, up_down, loading, name) {
    let that = this;
    getApp().func.comHttp('/lineStationApi/queryLineStations', {
      lineId: lineId, // 线路的id
      up_down: up_down// 线路上下行
    }, 'post', function (res) {
      if (res.success == true) {
        that.setData({
          siteListData: res.lineStations
        })
        console.log(res.lineStations)
        that.site(res.lineStations.stations.length) // 调用通过站点获取线路样式方法
        // 判断是否是初加载
        that.circulation(res.lineStations.stations, name) // 循环获取初加载站点索引添加样式
      } else {
        console.log(res.msg)
      }
    })
  },
  // 调取通过线路和上下行方式，获取线路和线路上的BUS信息接口
  busHttp: function (lineId, travelType) {
    let that = this;
    getApp().func.comHttp('/lineApi/queryLineBusInfo', {
      lineId: lineId, // 线路的id
      travelType: travelType// 线路上下行
    }, 'post', function (res) {
      if (res.success == true) {
        wx.setNavigationBarTitle({
          title: res.lineBusInfo.lineId + "路"
        })
        that.SpeedTime(res.lineBusInfo.buses) // 调用通过站点获取线路样式方法
        that.busList(res.lineBusInfo.buses) // 调用通过站点获取线路样式方法
      } else {
        console.log(res.msg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      lineId: options.lineId,
      direction: 0, // 方向
      stationname: options.stationname
    })
  },
  /** * ** ** * ** ** ** 用户事件 ** ** ** * ** ** * **/
  // 用户选中最近的站点事件
  userSelect: function (e) {
    let that = this;
    if (e.currentTarget == undefined) {
      var index = e; // 选中站点索引
    } else {
      var index = e.currentTarget.dataset.index; // 选中站点索引
      that.setData({
        siteName: e.currentTarget.dataset.stationname // 用户选中的名字
      })
    }
    that.rpxMethod(index)
  },
  // 用户点击换向事件
  reversing: function() {
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
    if (that.data.direction == 0) {
      that.StationNameMethod(that.data.lineId, 1, 1, that.data.siteName)
      that.busHttp(that.data.lineId, 1) // 调取通过线路和上下行方式，获取线路和线路上的BUS信息接口
      that.data.setInter = setInterval(function () {
        that.busHttp(that.data.lineId, 1) // 调取通过线路和上下行方式，获取线路和线路上的BUS信息接口
      }, 5000);   
      that.setData({
        direction: 1
      })
    } else {
      that.StationNameMethod(that.data.lineId, 0, 1, that.data.siteName)
      that.busHttp(that.data.lineId, 0) // 调取通过线路和上下行方式，获取线路和线路上的BUS信息接口
      that.data.setInter = setInterval(function () {
        that.busHttp(that.data.lineId, 0) // 调取通过线路和上下行方式，获取线路和线路上的BUS信息接口
      }, 5000);
      that.setData({
        direction: 0
      })  
    }
  },
  // 用户点击刷码上车跳转事件
  payerSkip: function () {
    var that = this;
    wx.navigateTo({
      url: "/pages/scanQR/payercode/payercode"
    }) // 
  },
  // 用户点击我的跳转事件
  mineSkip: function () {
    var that = this;
    wx.navigateTo({
      url: "/pages/mine/index/index"
    }) // 
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
    that.windowWidthMethod() // 调用获取屏幕宽度方法
    that.StationNameMethod(that.data.lineId, 0, 0, that.data.stationname) // 调取获取线路上的所有站点接口获取列表（如：10）
    that.data.setInter = setInterval(function () {
      that.busHttp(that.data.lineId, 0) // 调取通过线路和上下行方式，获取线路和线路上的BUS信息接口
    }, 5000);   

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)

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
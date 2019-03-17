// pages/search/destination/destination.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ListBoxHeight: 0, // 列表滚动高度
    stationname: "", // 开始站名字
    finishname: "", // 目的地站名字
    ListData: [], // 列表数据
    selectArr: [],
    secondArr: [],
    speedDataArr: [],
    ListDataFalse: false
  },
  // 获取滚动列表高度
  scrollHeight: function () {
    let that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        // 获取可使用窗口宽度
        let clientHeight = res.windowHeight;
        // 获取可使用窗口高度
        let clientWidth = res.windowWidth;
        // 算出比例
        let ratio = 750 / clientWidth;
        //创建节点选择器
        var query = wx.createSelectorQuery();
        query.select('#indexTop').boundingClientRect()
        query.exec((res) => {
          var listHeight = res[0].height; // 获取搜索模块高度
          // 赋值滚动模块高度
          that.setData({
            ListBoxHeight: (clientHeight - listHeight) * ratio
          })
        })
      }
    });
  },
  // 调取传入线路名称，查询经过的所有线路接口获取列表
  StationNameMethod: function (stationname) {
    let that = this;
    getApp().func.comHttp('/lineApi/ver2/queryLinesByStationName', {
      stationName : stationname, // 开始站
    }, 'post', function (res) {
      if (res.success == true) {
        that.setData({
          ListData: res.lines
        })
        for (var i = 0; i < res.lines.length; i ++) {
          that.routeHttp(res.lines[i].lineId, i)
        }
      } else {
        console.log(res.msg)
        that.setData({
          ListData: [],
          ListDataFalse: true
        })
      }
    })
  },
  // 调取经过某个站点到另一个站点的所有线路接口获取列表
  ThroughTwoStations: function (stationname, destination) {
    let that = this;
    getApp().func.comHttp('/lineApi/ver2/queryLinesThroughTwoStations', {
      stationName1: stationname, // 开始站
      stationName2: destination, // 目的地
    }, 'post', function (res) {
      if (res.success == true) {
        that.setData({
          ListData: res.lines
        })
      } else {
        console.log(res.msg)
        that.setData({
          ListData: []
        })
      }
    })
  },
  // 调取获取线路上的所有站点接口获取列表（如：10）
  routeHttp: function (lineId, index) {
    let that = this;
    getApp().func.comHttp('/lineStationApi/queryLineStations', {
      lineId: lineId, // 线路的id
      up_down: 0 // 线路上下行
    }, 'post', function (res) {
      // console.log(res)
      if (res.success == true) {
        that.setData({
          siteListData: res.lineStations.stations
        })
        for (var i = 0; i < res.lineStations.stations.length; i++) {
          if (res.lineStations.stations[i].stationName == that.data.stationname) {
            that.data.selectArr.push(i + 1)
            that.setData({
              selectArr: that.data.selectArr
            })
          }
        }
        // console.log(that.data.ListData[index].buses)
        // console.log(that.data.selectArr)
        // console.log(index)
        that.SpeedTime(that.data.ListData[index].buses, that.data.selectArr[index]) // 调取获取线路上的所有站点接口获取列表
      } else {
        console.log(res.msg)
      }
    })
  },
  // 计算站点之间的总距离
  distance: function (index1, index2) {
    let that = this;
    let distanceLength = 0;
    for (var i = index1 - 1; i <= index2 - 3; i++) {
      distanceLength += that.data.siteListData[i].nextStopDistance
    }
    return distanceLength
  },
  // 循环获取初加载站点最近的三个速度时间
  SpeedTime: function (data, selectIndex) {
    // console.log(selectIndex)
    // console.log(data)
    let that = this;
    var busArr = []; // 新的巴士排序数组
    var k;
    // 排除没有出发的车子
    for (var i = 0; i < data.length; i++) {
      // 排除nextStationSequnce == 0 没有出发的车子
      if (data[i].nextStationSequnce != "0") {
        // 排除用户选中的地点已经过站的车
        if ((parseInt(data[i].nextStationSequnce)) <= selectIndex) {
          busArr.push(data[i]); // 移入出发的巴士数组
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
    console.log(busArr)

    // 得出最近三个调用最后计算方法
    function calculate(data) {
      // console.log(data)
      var NewsliceArr = data;
      var informationArr = []
      for (var i = 0; i < NewsliceArr.length; i++) {
        // 判断下一站是否是用户选择的站
        if (NewsliceArr[i].nextStationSequnce != selectIndex + 1) {
          // 剩余路程需要秒数
          var remainingJourney = ((Number(NewsliceArr[i].busToNextStationDistance)) + (that.distance(Number(NewsliceArr[i].nextStationSequnce), selectIndex + 1)));
          informationArr[i] = {
            speed: remainingJourney / 5,
            site: selectIndex - NewsliceArr[i].nextStationSequnce + "站", // 添加剩余站点数
            luchenglength: (remainingJourney / 1000).toFixed(1)
          }
        }
      }
      // 进行转换为分(45秒到60秒为一分钟 45秒以下为即将到达)
      for (var i = 0; i < informationArr.length; i++) {
        if (i == informationArr.length - 1) {
          if (informationArr[i].speed < 45) {
            informationArr[i].speed = 30
            that.data.secondArr.push("秒")
            that.setData({
              second: that.data.secondArr
            })
          } else if (informationArr[i].speed >= 45 && informationArr[i].speed <= 60) {
            informationArr[i].speed = 1;
            informationArr[i].speed = 30
            that.data.secondArr.push("分")
            that.setData({
              second: that.data.secondArr
            })
          } else {
            informationArr[i].speed = parseInt(informationArr[i].speed / 60)
            that.data.secondArr.push("分")
            that.setData({
              second: that.data.secondArr
            })
          }
        } else {
          if (informationArr[i].speed < 45) {
            informationArr[i].speed = 30 + "秒"
          } else if (informationArr[i].speed >= 45 && informationArr[i].speed <= 60) {
            informationArr[i].speed = 1 + "分"
          } else {
            informationArr[i].speed = parseInt(informationArr[i].speed / 60) + "分"
          }
        }
      }
      var speedArr = informationArr.reverse()
      var obj = {}
      for (var i = 0; i < speedArr.length; i++) {
        obj["speed" + i] = speedArr[i].speed;
      }
      that.data.speedDataArr.push(obj)
      that.setData({
        speedData: that.data.speedDataArr
      })
      console.log(that.data.speedData)

    }
    // 循环筛选用户选中站点最近的前3个站
    function busThree() {
      // 没有班车状态
      if (busArr.length == 0) {
        // console.log("设置它为空")
        that.setData({
          speedData: []
        })
        var obj = {}
        for (var i = 0; i < 3; i++) {
          obj["speed" + i] = "";
        }
        that.data.speedDataArr.push(obj)
        that.data.secondArr.push("")
        that.setData({
          speedData: that.data.speedDataArr,
          second: that.data.secondArr
        })
        console.log(that.data.speedData)
        // console.log(that.data.speedData)
        // 三班以内班车状态
      } else if (busArr.length <= 3) {
        // console.log("设置它为1到3班")
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
        // console.log("重复个数：")
        // console.log(repetitionNumber)

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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // 定义标题为始站
    wx.setNavigationBarTitle({
      title: options.begin
    })
    let that = this;
    that.scrollHeight(); // 调取获取滚动列表高度方法
    that.setData({
      stationname: options.begin
    })
    // 判断是否有目的地参数
    if (options.finish == undefined) {
      that.StationNameMethod(options.begin) // 调取传入线路名称，查询经过的所有线路接口获取列表
    } else {
      that.ThroughTwoStations(options.begin, options.finish)   // 调取经过某个站点到另一个站点的所有线路接口获取列表
      that.setData({
        finishname: options.finish
      })
    }
  },
  // 用户点击搜索跳转到线路起点搜索页面
  searchOriginSkip: function (e) {
    var that = this;
    wx.navigateTo({
      url: "/pages/search/origin/origin?frequency=2&begin=" + that.data.stationname
    }) // 进行跳转
  },
  // 用户点清除目的地
  eliminate: function () {
    var that = this;
    that.setData({
      ListBoxHeight: 0, // 列表滚动高度
      finishname: "", // 目的地站名字
      ListData: [] // 列表数据
    })
    var options = {
      begin: that.data.stationname
    }
    that.onLoad(options)
  },
  // 用户点击线路跳转到线路详情
  LineDetailsSkip: function (e) {
    var that = this;
    console.log(e)
    console.log(that.data.latitude, that.data.longitude)
    // 计算两点间的距离
    function getDistance(lat1, lng1, lat2, lng2) {
      lat1 = lat1 || 0;
      lng1 = lng1 || 0;
      lat2 = lat2 || 0;
      lng2 = lng2 || 0;

      var rad1 = lat1 * Math.PI / 180.0;
      var rad2 = lat2 * Math.PI / 180.0;
      var a = rad1 - rad2;
      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

      var r = 6378137;
      return r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))
    }
    // console.log(getDistance(that.data.latitude, that.data.longitude, lat2, lng2))

    getApp().func.comHttp('/lineStationApi/queryLineStations', {
      lineId: e.currentTarget.dataset.lineid, // 线路的id
      up_down: 0 // 线路上下行
    }, 'post', function (res) {
      console.log(res.lineStations.stations)
      if (res.success == true) {
        var Arr = [];
        for (var i = 0; i < res.lineStations.stations.length; i++) {
          Arr.push(
            {
              distance: getDistance(that.data.latitude, that.data.longitude, res.lineStations.stations[i].lat, res.lineStations.stations[i].lng),
              index: i
            }
          )
        }
        // 按照下一站到达哪一个点进行排序方法
        function sequence(a, b) {
          if (parseInt(a.distance) > parseInt(b.distance)) {
            return 1;
          } else if (parseInt(a.distance) < parseInt(b.distance)) {
            return -1
          } else {
            return 0;
          }
        }
        Arr = Arr.sort(sequence) // 进行排序
        console.log(res.lineStations.stations[Arr[0].index].stationName)
        wx.navigateTo({
          url: "/pages/LineDetails/LineDetails?stationname=" + res.lineStations.stations[Arr[0].index].stationName + "&lineId=" + e.currentTarget.dataset.lineid
        }) // 进行跳转
      } else {
        console.log(res.msg)
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
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
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
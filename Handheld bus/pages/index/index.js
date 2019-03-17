//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    longitude: "", // ---------当前经度
    latitude: "", // ----------当前纬度
    ListBoxHeight: 0, // ------列表滚动高度
    recentlySiteName: "", // --最近站点名字
    nearbySiteName: "",  // ---附近全部车线路名字
    nearbyListData: [], // ----附近站点列表数据
    siteListData: [], // ------每条线路的总路线数组
    selectArr: [], // ---------每个线路对应的选择站点的索引数组
    busData: [], // -----------每条线路的巴士
    speedData: [], // ---------速度数组
    second: [], // ------------第一个单位数组
  },

  /** * ** ** * ** ** * ** 接口 ** * ** ** * ** ** * **/
  // 获取附近站点列表接口获取附近站点数据(七星公园坐标 lng: 110.3031,lat: 25.28012)
  queryNearbyStationsHttp: function () {
    var that = this;
    getApp().func.comHttp('/stationApi/ver2/queryNearbyStations', {
      lng: that.data.longitude,
      lat: that.data.latitude,
      up_down: "0"
    }, 'post', function (res) {
      var nearbySiteName = ""
      // 离我最近站点文字循环
      for (var i = 0; i < res.stations[0].lines.length; i++) {
        nearbySiteName += res.stations[0].lines[i].lineName + ";"
      }
      that.setData({
        nearbyListData: res.stations[0].lines, // -----------附近站点列表数据
        recentlySiteName: res.stations[0].stationName, // ---最近站点名字
        nearbySiteName: nearbySiteName, // ------------------附近全部车线路名字
      })
    })
  },
  // 调取获取线路上的所有站点接口获取列表(lineId: 线路id)
  StationNameMethod: function (lineId, index) {
    var that = this;
    getApp().func.comHttp('/lineStationApi/queryLineStations', {
      lineId: lineId, // 线路的id
      up_down: 0 // 线路上下行
    }, 'post', function (res) {
      if (res.success == true) {
        that.data.siteListData.push({ index: index, lineStations: res.lineStations }); // 每条线路所选的站点索引赋值
        that.setData({ siteListData: that.data.siteListData }) // 每条线路所有站点赋值
      } else {
        console.log(res.msg)
      }
    })
  },
  busDataHttp: function (lineId, index) {
    var that = this;
    getApp().func.comHttp('/lineApi/queryLineBusInfo', {
      lineId: lineId, // 线路的id
      travelType: 0 // 线路上下行
      }, 'post', function (res) {
        if (res.success == true) {
        that.data.busData.push({ index: index, buses: res.lineBusInfo.buses}); // 每条线路所选的站点索引赋值
        that.setData({ busData: that.data.busData }) // 每条线路所有站点赋值
      } else {
        console.log(res.msg)
      }
    })
  },
  /** * ** ** * ** ** * ** 方法 ** * ** ** * ** ** * **/
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
        query.select('#nearby').boundingClientRect()
        query.exec((res) => {
          var listHeight = res[0].height; // 获取搜索模块高度
          var listHeight1 = res[1].height; // 获取搜索模块高度
          // 赋值滚动模块高度
          that.setData({
            ListBoxHeight: (clientHeight - listHeight - listHeight1) * ratio - 33
          })
        })
      }
    });
  },
  // 定位方法
  posiTion: function () {
    var that = this;
    // 获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
      fail: function (res) { },
      complete: function () { }
    });
  },
  // 循环获取初加载站点最近的三个速度时间
  SpeedTime: function (data, selectIndex, siteListIndex) {
    let that = this;
    var siteListIndex = siteListIndex;
    var busArr = []; // 新的巴士排序数组
    var k;
     // 循环筛选没有出发的车子
    for (k in data) {
      // 排除nextStationSequnce == 0 没有出发的车子
      if (data[k].nextStationSequnce != "0") {
        // 排除用户选中的地点已经过站的车
        if ((parseInt(data[k].nextStationSequnce)) <= selectIndex - 1) {
          busArr.push(data[k]); // 移入出发的巴士数组
        }
      }
    }
    // 按照剩余距离排序
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

    // 判断选择车站的前面是否有车
    if (busArr.length == 0) {
      var obj = {}
      for (var i = 0; i < 3; i++) {
        obj["speed" + i] = "";
      }
      that.data.speedData.push(obj); // 速度数组赋值
      that.data.second.push(""); // 第一个速度的单位赋值
      that.setData({
        second: that.data.second, // --------单位数组赋值
        speedData: that.data.speedData // ---速度数组赋值
      })
    } else {
      // 判断只有三辆以下（包含三辆）
      if (busArr.length <= 3) {
        calculate(busArr)
      } else {
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
      }
    } 

    function calculate(data) {
      var NewsliceArr = data;
      var informationArr = []
      for (var i = 0; i < NewsliceArr.length; i++) {
        // 判断下一站是否是用户选择的站
        if (NewsliceArr[i].nextStationSequnce != selectIndex + 1) {
          // 剩余路程需要秒数
          var remainingJourney = ((Number(NewsliceArr[i].busToNextStationDistance)) + (that.distance(Number(NewsliceArr[i].nextStationSequnce), Number(selectIndex) + 1, siteListIndex)));
          informationArr[i] = {
            speed: remainingJourney / 5,
          }
        } else {
          // 剩余路程需要秒数
          var remainingJourney = Number(NewsliceArr[i].busToNextStationDistance);
          informationArr[i] = {
            speed: remainingJourney / 5,
          }
        }
      }
      // 进行转换为分(45秒到60秒为一分钟 45秒以下为即将到达)
      for (var i = 0; i < informationArr.length; i++) {
        if (i == informationArr.length - 1) {
          if (informationArr[i].speed < 45) {
            informationArr[i].speed = 30
            that.data.second.push("秒")
          } else if (informationArr[i].speed >= 45 && informationArr[i].speed <= 60) {
            informationArr[i].speed = 1;
            that.data.second.push("分")
          } else {
            informationArr[i].speed = parseInt(informationArr[i].speed / 60)
            that.data.second.push("分")
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
      obj["a"] = siteListIndex;
      that.data.speedData.push(obj)
      that.setData({
        speedData: that.data.speedData,
        second: that.data.second
      })
    }

    // 循环筛选用户选中站点最近的前3个站
    function busThree() {
    }
    busThree() // 调用循环筛选用户选中站点最近的前3个站方法
    // 得出最近三个调用最后计算方法
  },
  // 计算站点之间的总距离
  distance: function (index1, index2, siteListIndex) {
    let that = this;
    let distanceLength = 0;
    if (index1 != index2) {
      for (var i = index1 - 1; i <= index2 - 3; i++) {
        distanceLength += that.data.siteListData[siteListIndex].lineStations.stations[i].nextStopDistance
      }
    }
    return distanceLength
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    that.scrollHeight(); // 调取获取滚动列表高度方法
    that.posiTion()
    // 获取附近站点列表接口获取附近站点数据
    that.setData({
      queryNearbyStationsTime: setInterval(function () {
        if (that.data.longitude != "") {
          that.queryNearbyStationsHttp();
          clearInterval(that.data.queryNearbyStationsTime)
        }
      }, 1000)
    })
    that.setData({
      StationNameMethodTime: setInterval(function () {
        if (that.data.nearbyListData.length != 0) {
          clearInterval(that.data.StationNameMethodTime)
          var Data = that.data.nearbyListData;
          for (let i = 0; i < Data.length; i++) {
            that.StationNameMethod(Data[i].lineId, i);
          }
        }
      }, 1000)
    })
    that.setData({
      busDataTime: setInterval(function () {
        if (that.data.siteListData.length != 0) {
          // 按照剩余距离排序
          var NewDataList = that.data.siteListData;
          function sequence(a, b) {
            if (parseInt(a.index) > parseInt(b.index)) {
              return 1;
            } else if (parseInt(a.index) < parseInt(b.index)) {
              return -1
            } else {
              return 0;
            }
          }
          NewDataList = NewDataList.sort(sequence) // 进行排序
          that.setData({
            siteListData: NewDataList
          })
          clearInterval(that.data.busDataTime)
          // 循环获取每条线路所选的站点索引赋值
          for (let i = 0; i < NewDataList.length; i++) {
            that.busDataHttp(NewDataList[i].lineStations.lineId, NewDataList[i].index);
          }
        }
      }, 1000)
    })
    that.setData({
      siteListDataTime: setInterval(function () {
        if (that.data.busData.length != 0) {
          var Data = that.data.siteListData;
          clearInterval(that.data.siteListDataTime)
          // 循环获取每条线路所选的站点索引赋值
          for (let i = 0; i < Data.length; i++) {
            for (let j = 0; j < Data[i].lineStations.stations.length; j++) {
              if (Data[i].lineStations.stations[j].stationName == that.data.recentlySiteName) {
                that.data.selectArr.push({ index: Data[i].index, seleSite: j + 1}); // 每条线路所选的站点索引赋值
                that.setData({ selectArr: that.data.selectArr })
                break
              } 
            }
          } 
          // 按照剩余距离排序
          var NewArr = that.data.selectArr;
          function selectArr(a, b) {
            if (parseInt(a.index) > parseInt(b.index)) {
              return 1;
            } else if (parseInt(a.index) < parseInt(b.index)) {
              return -1
            } else {
              return 0;
            }
          }
          NewArr = NewArr.sort(selectArr) // 进行排序
          that.setData({ selectArr: NewArr })
          // // -------------------------------------------------
          that.setData({
            selectDataTime: setInterval(function () {
              if (that.data.selectArr.length == that.data.busData.length) {
                clearInterval(that.data.selectDataTime)
                var BusNewArr = that.data.busData
                // 按照剩余距离排序
                function busDataArr(a, b) {
                  if (parseInt(a.index) > parseInt(b.index)) {
                    return 1;
                  } else if (parseInt(a.index) < parseInt(b.index)) {
                    return -1
                  } else {
                    return 0;
                  }
                }
                BusNewArr = BusNewArr.sort(busDataArr) // 进行排序
                that.setData({
                  busData: BusNewArr
                })
                var NewArr = that.data.selectArr;
                var selectData = that.data.selectArr;
                for (let z = 0; z < selectData.length; z++) {
                  that.SpeedTime(that.data.busData[z].buses, selectData[z].seleSite, z)
                }
              }
            }, 1000)
          })
        }
      }, 1000)
    })
  },
  /** * ** ** * ** ** ** 用户事件 ** ** ** * ** ** * **/
  // 用户点击搜索跳转到线路起点搜索页面
  searchOriginSkip: function (e) {
    var that = this;
    wx.navigateTo({
      url: "/pages/search/origin/origin?frequency=1&recentlySiteName=" + that.data.recentlySiteName
    }) // 进行跳转
  },
  // 用户点击最近的站点搜索跳转到线路目的地搜索页面
  searchDestinationSkip: function () {
    var that = this;
    wx.navigateTo({
      url: "/pages/search/destination/destination"
    }) // 进行跳转
  },
  // 用户点击站点地图
  mapBtn: function() {
    var that = this;
    wx.navigateTo({
      url: "/pages/map/map"
    }) // 进行跳转
  },
  // 用户点击线路跳转到线路详情
  LineDetailsSkip: function(e) {
    var that = this;
    wx.navigateTo({
      url: "/pages/LineDetails/LineDetails?stationname=" + that.data.recentlySiteName + "&lineId=" + e.currentTarget.dataset.lineid
    }) // 进行跳转
  },
  // 用户点击刷码上车跳转事件
  payerSkip: function () {
    var that = this;
    wx.navigateTo({
      url: "/pages/scanQR/payercode/payercode"
    }) // 进行跳转
  },
  // 用户点击我的跳转事件
  mineSkip: function () {
    var that = this;
    wx.navigateTo({
      url: "/pages/mine/index/index"
    }) // 进行跳转
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    clearInterval(that.data.queryNearbyStationsTime)
    clearInterval(that.data.StationNameMethodTime)
    clearInterval(that.data.busDataTime)
    clearInterval(that.data.siteListDataTime)
    clearInterval(that.data.selectDataTime)
    that.setData({
      recentlySiteName: "", // --最近站点名字
      nearbySiteName: "",  // ---附近全部车线路名字
      nearbyListData: [], // ----附近站点列表数据
      siteListData: [], // ------每条线路的总路线数组
      selectArr: [], // ---------每个线路对应的选择站点的索引数组
      busData: [], // -----------每条线路的巴士
      speedData: [], // ---------速度数组
      second: [], // ------------第一个单位数组
    })
    that.posiTion()
    // 获取附近站点列表接口获取附近站点数据
    that.setData({
      queryNearbyStationsTime: setInterval(function () {
        if (that.data.longitude != "") {
          that.queryNearbyStationsHttp();
          clearInterval(that.data.queryNearbyStationsTime)
        }
      }, 1000)
    })
    that.setData({
      StationNameMethodTime: setInterval(function () {
        if (that.data.nearbyListData.length != 0) {
          clearInterval(that.data.StationNameMethodTime)
          var Data = that.data.nearbyListData;
          for (let i = 0; i < Data.length; i++) {
            that.StationNameMethod(Data[i].lineId, i);
          }
        }
      }, 1000)
    })
    that.setData({
      busDataTime: setInterval(function () {
        if (that.data.siteListData.length != 0) {
          // 按照剩余距离排序
          var NewDataList = that.data.siteListData;
          function sequence(a, b) {
            if (parseInt(a.index) > parseInt(b.index)) {
              return 1;
            } else if (parseInt(a.index) < parseInt(b.index)) {
              return -1
            } else {
              return 0;
            }
          }
          NewDataList = NewDataList.sort(sequence) // 进行排序
          that.setData({
            siteListData: NewDataList
          })
          clearInterval(that.data.busDataTime)
          // 循环获取每条线路所选的站点索引赋值
          for (let i = 0; i < NewDataList.length; i++) {
            that.busDataHttp(NewDataList[i].lineStations.lineId, NewDataList[i].index);
          }
        }
      }, 1000)
    })
    that.setData({
      siteListDataTime: setInterval(function () {
        if (that.data.busData.length != 0) {
          var Data = that.data.siteListData;
          clearInterval(that.data.siteListDataTime)
          // 循环获取每条线路所选的站点索引赋值
          for (let i = 0; i < Data.length; i++) {
            for (let j = 0; j < Data[i].lineStations.stations.length; j++) {
              if (Data[i].lineStations.stations[j].stationName == that.data.recentlySiteName) {
                that.data.selectArr.push({ index: Data[i].index, seleSite: j + 1 }); // 每条线路所选的站点索引赋值
                that.setData({ selectArr: that.data.selectArr })
                break
              }
            }
          }
          // 按照剩余距离排序
          var NewArr = that.data.selectArr;
          function selectArr(a, b) {
            if (parseInt(a.index) > parseInt(b.index)) {
              return 1;
            } else if (parseInt(a.index) < parseInt(b.index)) {
              return -1
            } else {
              return 0;
            }
          }
          NewArr = NewArr.sort(selectArr) // 进行排序
          that.setData({ selectArr: NewArr })
          // // -------------------------------------------------
          that.setData({
            selectDataTime: setInterval(function () {
              if (that.data.selectArr.length == that.data.busData.length) {
                clearInterval(that.data.selectDataTime)
                var BusNewArr = that.data.busData
                // 按照剩余距离排序
                function busDataArr(a, b) {
                  if (parseInt(a.index) > parseInt(b.index)) {
                    return 1;
                  } else if (parseInt(a.index) < parseInt(b.index)) {
                    return -1
                  } else {
                    return 0;
                  }
                }
                BusNewArr = BusNewArr.sort(busDataArr) // 进行排序
                that.setData({
                  busData: BusNewArr
                })
                var NewArr = that.data.selectArr;
                var selectData = that.data.selectArr;
                for (let z = 0; z < selectData.length; z++) {
                  that.SpeedTime(that.data.busData[z].buses, selectData[z].seleSite, z)
                }
              }
            }, 1000)
          })
        }
      }, 1000)
    })
    wx.stopPullDownRefresh()
  },
})

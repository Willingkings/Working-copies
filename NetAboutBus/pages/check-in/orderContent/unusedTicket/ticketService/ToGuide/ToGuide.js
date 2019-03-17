// pages/check-in/orderContent/unusedTicket/ticketService/ToGuide/ToGuide.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pathData: [],
    pathIndex: "", //上车站点索引
    ToGuideData: [], // 乘车指引数据
    SingleStation: 4, // 默认单个路程长度未4rem
    BusJourney: 0, // 默认巴士总路程长度
    // 地图显示
    openMap: false,
    latitude: 0,
    longitude: 0,
    polyline: [],
    markers: [],
    Loadingtime: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取线路数据接口
    getApp().func.comHttp('/vl/cusbus/app/services/queryOrders', {
      userId: getApp().globalData.userData.mobileNo,  // ---用户id（手机号码）
      flowNo: options.flowNo,  // -------------------------流水号(选填)
      useDate: "", // --------------------------------------乘车日期(选填)
      states: "", // ---------------------------------------订单状态(选填),逗号分隔(例如:1,2)
      token: "" // -----------------------------------------令牌
    }, 'get', function (res) {
      that.setData({
        ToGuideData: res.data[0], // 赋值扫码详情数据
      })
      // 获取当前线路的站点信息
      getApp().func.comHttp('/vl/cusbus/app/services/lineDetail', {
        lineCode: res.data[0].lineCode,  //线路编号
        token: "" // -----------------------------------------令牌
      }, 'get', function (res) {
        for (var i = 0; i < res.data.stationInfo.length; i++ ) {
          if (that.data.ToGuideData.startStation == res.data.stationInfo[i].name) {
            that.setData({
              pathIndex: i 
            })
          }
        }
        that.setData({
          pathData: res.data.stationInfo, // 赋值线路数据
          BusJourney: res.data.stationInfo.length < 6 ? "100%" : res.data.stationInfo.length * that.data.SingleStation + "rem" // 计算巴士总路程长度
        })
      })
    })
  },
  // polyline 坐标解压
  polyline: function (arr) {
    var polylineArr = []; // 设定路线的坐标数组
    var coors = arr;
    for (var i = 2; i < coors.length; i+=2) { 
      coors[i] = coors[i - 2] + coors[i] / 1000000
      coors[i + 1] = coors[i + 1 - 2] + coors[i + 1] / 1000000
      polylineArr.push({
        latitude: coors[i],
        longitude: coors[i + 1]
      })
    }
    return polylineArr
  },
  // 定位方法
  posiTion: function () {
    var that = this;
    // 获取当前位置坐标
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var origin_lat = res.latitude; // 当前位置经度
        var origin_lng = res.longitude; // 当前位置纬度
        var terminus_lat = that.data.pathData[that.data.pathIndex].lat; // 终点经度(南大数据)
        var terminus_lng = that.data.pathData[that.data.pathIndex].lng; // 终点维度(南大数据)
        // 调用腾讯地图接口转换坐标全局方法
        getApp().func.translate(origin_lat + "," + origin_lng + ";" + terminus_lat + "," + terminus_lng, 'get', function (res) {
          // 起点和终点显示
          var markersArr = []; // 设定需要显示的标点数组
          markersArr.push({
            anchor: {
              x: 0.5,
              y: 0.5
            },
            callout: {
              display: "BYCLICK",
              borderRadius: 5,
              content: "当前位置",
              fontSize: 12,
              padding: "3",
              bgColor: "#fff",
              color: "#FE4A54",
              textAlign: "right"
            },
            iconPath: "",
            id: "",
            latitude: origin_lat,
            longitude: origin_lng,
            width: 25,
            height: 25
          }, {
              anchor: {
                x: 0.5,
                y: 0.5
              },
              callout: {
                display: "BYCLICK",
                borderRadius: 5,
                content: "此处上车",
                fontSize: 12,
                padding: "3",
                bgColor: "#fff",
                color: "#FE4A54",
                textAlign: "right"
              },
              label: {
                nchorX: 12,
                anchorY: -30,
                bgColor: "#fff",
                borderRadius: 5,
                color: "#333",
                content: that.data.ToGuideData.endStation,
                fontSize: 12,
                padding: "3",
                textAlign: "right"
              },
              iconPath: "/img/icon/terminus.png",
              id: "",
              latitude: res.locations[1].lat,
              longitude: res.locations[1].lng,
              width: 25,
              height: 25
            }
          )
          that.setData({
            latitude: origin_lat, // ---起点经度
            longitude: origin_lng, // --起点纬度
            markers: markersArr, // --------------显示点数组
          })
          // 调取腾讯线路规划接口
          getApp().func.pathHttp(origin_lat + "," + origin_lng, res.locations[1].lat + "," + res.locations[1].lng, 'get', function (res) {
            var lineData = res.result.routes[0].polyline; // 路线总坐标点数据
            lineData = that.polyline(lineData); // 调用polyline 坐标解压
            // 赋值地图显示位置
            that.setData({
              polyline: [{
                arrowLine: true,
                color: "#4B89FF",
                points: lineData,
                width: 8
              }]
            })
          })
        });

      },
      fail: function (res) { },
      complete: function () { }
    });
  },
  // 用户点击导航到上车位置按钮
  navigationBtn: function () {
    var that = this;
    if (that.data.openMap == false) {
      that.posiTion()
      // 创建二维码获取定时器
      that.setData({
        Loadingtime: setInterval(function () {
          that.posiTion()
        }, 5000)
      })
      that.setData({ openMap: true }) // 打开地图
    } else {
      that.setData({ openMap: false }) // 打开地图
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
    clearInterval(this.data.Loadingtime) // 退出页面清除二维码定时器
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
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
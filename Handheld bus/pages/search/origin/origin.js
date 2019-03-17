// pages/search/origin/origin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    begin: true,
    SearchListings: false, // 判断搜索是否有数据（false:数据为空，true:有数据）
    originListData: [], // 搜索结果列表数据
    frequency: "", // 判断是开始站搜索还是目的地搜索
    beginName: "",
    recentlySiteName: ""
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let that = this;
    that.scrollHeight(); // 调取获取滚动列表高度方法
    that.setData({
      frequency: options.frequency, // 判断是开始站搜索还是目的地搜索
      recentlySiteName: options.recentlySiteName
    })
    // 判断目的地搜索保存开始站
    if (options.frequency == 2) {
      that.setData({
        beginName: options.begin
      })
    }
  },
  /** * ** ** * ** ** ** 用户事件 ** ** ** * ** ** * **/
  // 获取用户输入搜索内容
  searchInput: function (e) {
    var that = this;
    that.setData({ begin: false })
    // 调取搜索公交站点，可传入线路名，站点名,如“园林植物园”接口获取搜索列表数据
    getApp().func.comHttp('/lineApi/searchLineStation', {
      keyWord: e.detail.value // 用户输入搜索内容
    }, 'post', function (res) {
      if (res.success == true) {
        that.setData({
          originListData: res,
          SearchListings: true,
        })
      } else {
        // console.log(res.msg)
        that.setData({ SearchListings: false })
      }
    })
  },
  // 用户点击线路列表跳转到线路详情
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
    // console.log(getDistance(that.data.latitude, that.data.latitude, lat2, lng2))
    
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
              distance: getDistance(that.data.latitude, that.data.latitude, res.lineStations.stations[i].lat, res.lineStations.stations[i].lng),
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
        wx.navigateTo({
          url: "/pages/LineDetails/LineDetails?stationname=" + res.lineStations.stations[Arr[0].index].stationName + "&lineId=" + e.currentTarget.dataset.lineid
        }) // 进行跳转
      } else {
        console.log(res.msg)
      }
    })
  },
  // 用户点击车站列表跳转到目的地搜索页面
  destinationSkip: function (e) {
    var that = this;
    // 判断是开始站搜索还是目的地搜索（1：开始站 2：目的地）
    if (that.data.frequency == 1) {
      wx.navigateTo({
        url: "/pages/search/destination/destination?begin=" + e.currentTarget.dataset.stationname
      }) // 进行跳转
    } else if(that.data.frequency == 2) {
      wx.navigateTo({
        url: "/pages/search/destination/destination?begin=" + that.data.beginName + "&finish=" + e.currentTarget.dataset.stationname
      }) // 进行跳转
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
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        // console.log(res)
        that.setData({ latitude: res.latitude, longitude: res.longitude });
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
// pages/map/map.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '',
    longitude: '',
    markers: []
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // {
    //   id: i, 
    //   width: 25,  // 站点宽度
    //   height: 25,
    //   anchor: { x: .5, y: .5 }, // 偏移量
    //   label: {
    //     content: item.name,  
    //     color: "#333",
    //     fontSize: 12,
    //     borderRadius: 5,
    //     anchorX: 12,
    //     anchorY: -14,
    //     bgColor: "#fff",
    //     padding: "3",
    //     textAlign: "right"
    //   }, // 标签
    //   callout:{
    //     content: "此处\n上车",
    //     color: "#FE4A54",
    //     fontSize: 12,
    //     borderRadius: 5,
    //     bgColor: "#fff",
    //     padding: "3",
    //     display: 'BYCLICK',
    //     textAlign: "right"
    //   }, // 描述
    //   iconPath: "../../../img/icon/origin.png", // 图标
    //   latitude: res.locations[i].lat, // 经纬度
    //   longitude : res.locations[i].lng,
    // }









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
    let _this = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        _this.setData({ latitude: res.latitude, longitude: res.longitude });
        getApp().func.comHttp('/stationApi/ver2/queryStationsByLocation', {
          lng: res.longitude, // 经纬度
          lat: res.latitude,
          up_down: 0, // 线路上下行
        }, 'post', function (res) {
          var stationsArr = [];
          console.log(res)
          var Arr = ""
          for (var i = 0; i < res.stations.length; i++) {
            // console.log(res.stations[i].lat)
            // console.log(res.stations[i].lng)
            Arr += res.stations[i].lat + "," + res.stations[i].lng + ";"
            stationsArr.push({
              id: i,
              width: 25,  // 站点宽度
              height: 30,
              anchor: { x: .5, y: .5 }, // 偏移量
              label: {
                content: res.stations[i].stationName,
                color: "#333",
                fontSize: 12,
                borderRadius: 5,
                anchorX: -25,
                anchorY: 15,
                bgColor: "#fff",
                padding: "3",
                textAlign: "center"
              }, // 标签
              // callout:{
              //   content: "此处\n上车",
              //   color: "#FE4A54",
              //   fontSize: 12,
              //   borderRadius: 5,
              //   bgColor: "#fff",
              //   padding: "3",
              //   display: 'BYCLICK',
              //   textAlign: "right"
              // }, // 描述
              iconPath: "/img/icon/gongjiaoche.png", // 图标
              // latitude: res.locations[j].lat, // 经纬度
              // longitude: res.locations[j].lng,
            })
          }
          
          getApp().func.translate(Arr.slice(0, Arr.length - 1), 'get', function (res) {
            for (var j = 0; j < res.locations.length; j++) {
              stationsArr[j].latitude = res.locations[j].lat
              stationsArr[j].longitude = res.locations[j].lng
            }
            console.log(stationsArr)
            _this.setData({ markers: stationsArr });
          })
           
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
// pages/search/lineDetails/lineDetails.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    timeWindows: 0,
    lineListIndex: 0,
    lineCode: 0,
    applySuccess: 0,
    imgShow: 0,
    ticketPrice: 0,
    stationInfo: [],  // 站点信息
    timeList: [],  // 乘车时段
    selectedTime: "",  // 选中的乘车时段
    // 地图显示
    latitude: 0,
    longitude: 0,
    polyline: [],
    markers: []
  },
  selectImg: function (e) {
    var _this = this;
    _this.setData({ imgShow: e.currentTarget.dataset.id })
  },
  timeQuantum: function (e) {
    var _this = this;
    if (e.currentTarget.dataset.id==0){
      _this.setData({ selectedTime: e.currentTarget.dataset.select })
      _this.setData({ timeWindows: e.currentTarget.dataset.id })
      _this.stationInfo();
    }else {
      _this.setData({ timeWindows: e.currentTarget.dataset.id })
    }
    
  },
  selectedDate: function(e){
    var _this = this;
    wx.navigateTo({ url: "/pages/common/calendar/calendar?lineCode=" + _this.data.lineCode + "&runTime=" + _this.data.selectedTime + "&lineName=" + _this.data.lineName + "&selectSite=" + _this.data.selectSite	}) // 进行跳转
  },
  // 我要报名
  confirmApply: function (e) {
    let _this = this; 
    let userData = getApp().globalData.userData; 
    getApp().func.speHttp('/vl/cusbus/app/services/recruitEnroll', {
      lineCode: _this.data.lineCode,
      lineName: _this.data.lineName,
      startStation: _this.data.stationInfo[0].name,
      endStation: _this.data.stationInfo[_this.data.stationInfo.length - 1].name,
      runTime: _this.data.selectedTime,
      memberId: userData.memberId,
      userId: userData.mobileNo,
      userName: "",
      tel: userData.mobileNo,
      token: ""
    }, 'get', function (res) {
      if (res.success){
        _this.setData({ applySuccess: 1 });
      }else{
        wx.showToast({
          title: '已报名',
          icon: 'none'
        })
      }
    })
    
  },
  // 关闭报名成功弹窗
  closeResultWin: function (e) {
    var _this = this;
    _this.setData({ applySuccess: 0 })
  },
  // 站点信息获取
  stationInfo: function(e){
    var _this = this;
    let now = new Date()
    let workDate = now.getFullYear() + "-" + '0' + (now.getMonth() + 1) +"-"+now.getDate();
    getApp().func.comHttp('/vl/cusbus/app/services/lineDetailWithPlanArriveTime', {
      lineCode: _this.data.lineCode,
      workDate: workDate,
      runTime: _this.data.selectedTime,
      token: ""
    }, 'get', function (res) {
      _this.setData({ stationInfo: res.data.stationInfo });
    })
  },
  // 坐标系转换
  translate: function(froms){
    wx.request({
      url: "https://apis.map.qq.com/ws/coord/v1/translate",
      data: {
        locations: froms.slice(0,froms.length-1),
        type: 1,
        key: "UDWBZ-U2JRO-RR6WX-SDVZW-NLSPH-BDF72"
      },
      method: "get",
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        
      }
    })
  },
  markertap(e) {
    let _this =this;
    _this.data.selectSite = _this.data.markers[e.markerId].label.content;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var _this = this;
    _this.setData({ 
      lineListIndex: options.index, 
      lineCode: options.lineCode, 
      ticketPrice: options.ticketPrice, 
      lineName: options.lineName, 
      lineType: options.lineType 
    })
    // 站点图标显示
    var markers= [];
    //地图线路坐标集合
    var lineInfo = { points: [], color: '#4B99FF', width: 8, arrowLine: true }
    // 站点信息
    getApp().func.comHttp('/vl/cusbus/app/services/lineDetail', {
      lineCode: options.lineCode,
      token: ""
    }, 'get', function (res) {
      _this.setData({
        timeList: res.data.planRunTimeStr.split(", "),
        selectedTime: res.data.planRunTimeStr.split(",")[0],
        selectSite: res.data.stationInfo[0].name
      });
      _this.setData({  });
      _this.stationInfo();
      if (res.success) {
        //整合线路坐标
        var froms = "";
        for (var i = 0; i < res.data.lineInfo.length; i++) {
          var item = res.data.lineInfo[i]
          froms += item.lat + "," + item.lng + ";" + item.latOut + "," + item.lngOut + ";"
        }
        getApp().func.translate(froms.slice(0, froms.length - 1), 'get', function (res) {
          for (var i = 0; i < res.locations.length; i++) {
            var item = res.locations[i]
            lineInfo.points.push({ latitude: item.lat, longitude: item.lng })
          }
          _this.setData({ polyline: [lineInfo] });
        })
        //整合站点坐标
        var station = "";
        var markersObj = []; 
        for (var i = 0; i < res.data.stationInfo.length; i++) {
          var item = res.data.stationInfo[i];
          station += item.lat + "," + item.lng + ";"
          markersObj.push({
            id: i,
            width: 25,
            height: 25,
            anchor: { x: .5, y: .5 },
            label: {
              content: item.name,
              color: "#333",
              fontSize: 12,
              borderRadius: 5,
              anchorX: 12,
              anchorY: -14,
              bgColor: "#fff",
              padding: "3",
              textAlign: "right"
            },
            callout:{
              content: "此处\n上车",
              color: "#FE4A54",
              fontSize: 12,
              borderRadius: 5,
              bgColor: "#fff",
              padding: "3",
              display: 'BYCLICK',
              textAlign: "right"
            }
          })
        }
        getApp().func.translate(station.slice(0, station.length - 1), 'get', function (res) {
          for (var i = 0; i < res.locations.length; i++) {
            switch (i) {
              case 0:
                _this.setData({
                  latitude: res.locations[i].lat,
                  longitude: res.locations[i].lng
                });
                markersObj[i].iconPath = "../../../img/icon/origin.png";
                markersObj[i].latitude = res.locations[i].lat;
                markersObj[i].longitude = res.locations[i].lng;
                markers.push(markersObj[i])
                break;
              case res.locations.length - 1:
                markersObj[i].iconPath = "../../../img/icon/terminus.png";
                markersObj[i].latitude = res.locations[i].lat;
                markersObj[i].longitude = res.locations[i].lng;
                markers.push(markersObj[i])
                break;
              default:
                markersObj[i].iconPath = "../../../img/icon/map-up.png";
                markersObj[i].latitude = res.locations[i].lat;
                markersObj[i].longitude = res.locations[i].lng;
                markers.push(markersObj[i])
            }
          }
          _this.setData({ markers: markers })
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
  onShareAppMessage: function (options) {
    var _this = this;
    var shareObj = {
      title: "",
      path: '',          // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '',                              //转发时显示的图片路径，支持网络和本地，不传则使用当前页默认截图。 ../../../img/icon/login.png
      success: function (res) {　                               // 转发成功之后的回调　　　　　
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function () {　                                     // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {      // 用户取消转发

        } else if (res.errMsg == 'shareAppMessage:fail') {      // 转发失败，其中 detail message 为详细失败信息

        }
      },
      complete: function () {                                   // 转发结束之后的回调（转发成不成功都会执行）

      }
    };
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      // var dataid = options.target.dataset; //上方data-id=shareBtn设置的值
      // 此处可以修改 shareObj 中的内容
      shareObj.title = _this.data.title;
      shareObj.path = '/pages/common/friendsShare/friendsShare?title=' + _this.data.title;
    }
    // 返回shareObj
    return shareObj;
  }
})
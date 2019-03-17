//index.js
//获取应用实例
const app = getApp();
const date = new Date();
const multiArray = [];
const multiIndex = [];

// 时间填充
function timeFill(){
  let years = date.getFullYear();
  let days = [];
  let hours = [];
  let minutes = [];
  multiIndex.push(date.getHours()-1, date.getMinutes()-1);
  for (let i = date.getMonth(); i <= date.getMonth() + 2; i++) {
    let month = i+1 ;
    let dayList = new Date(years, month, 0).getDate();
    for (let j = 1; j <= dayList; j++){
      let week = new Date(years, month-1, j).getDay();
      switch (week) {
        case 1:          // 默认
          week = " 周一"
          break;
        case 2:          // 默认
          week = " 周二"
          break;
        case 3:          // 默认
          week = " 周三"
          break;
        case 4:          // 默认
          week = " 周四"
          break;
        case 5:          // 默认
          week = " 周五"
          break;
        case 6:          // 默认
          week = " 周六"
          break;
        default:             
          week = " 周日"
      }
      if (new Date(years, month - 1, j).getTime() == new Date(years, date.getMonth(), date.getDate()).getTime() ){
        multiIndex.unshift(days.length);
      }
      days.push(years + '-' + month + '-' + j + week);
    }
  }
  for (let i = 1; i <= 24; i++) {
    hours.push(i)
  }
  for (let i = 1; i <= 60; i++) {
    minutes.push(i)
  }
  multiArray.push(days, hours, minutes)
}
timeFill();
Page({
  data: {
    tabNum: 0, // 用户默认选择查询线路 [0:查询线路  1:线路定制]
    customSuccess: 0, // 用户定制线路结果 [0:失败  1:成功]
    themeTypeData: "", // 默认主题公交类型数据为空
    themeTypeImages: [   // 默认主题公交类型小图标图片路径以及用户点击的跳转路径
      {
        index: 1,
        img: "../../img/icon/business.png",
        url: "/pages/specialLine/business/business"
      },
      {
        index: 2,
        img: "../../img/icon/direct.png",
        url: "/pages/specialLine/direct/direct"
      },
      {
        index: 3,
        img: "../../img/icon/festival.png",
        url: "/pages/specialLine/festival/festival"
      },
      {
        index: 4,
        img: "../../img/icon/highSpeedRail.png",
        url: "/pages/specialLine/highSpeedRail/highSpeedRail"
      },
    ],
    origin: {},
    terminus: {},
    depart: "",    // 线路定制出发时间
    returns: "",    // 线路定制返程时间
    advice: "",            // 用户建议
    multiArray: multiArray,
    multiIndex: multiIndex
  },
  // 地图选点 
  selectedSite: function(e) {
    var _this = this;
    wx.navigateTo({
      url: "/pages/common/map/map?siteType=" + e.currentTarget.dataset.type + "&tabNum=" + _this.data.tabNum
    }) // 进行跳转
  },
  //事件处理函数
  selectTab: function(e) {
    var _this = this;
    _this.setData({
      tabNum: e.currentTarget.dataset.id,
      origin: { title: "", lat: 0, lng: 0 },
      terminus: { title: "", lat: 0, lng: 0 },
      depart: "",    // 线路定制出发时间
      returns: ""    // 线路定制返程时间
    })
    app.globalData.origin = { title: "", lat: 0, lng: 0 }
    app.globalData.terminus = { title: "", lat: 0, lng: 0 }
  },
  // 搜索线路
  searchLine: function(e) {
    var _this = this;
    wx.clearStorage(_this.data)
    // wx.navigateTo({
    //   url: "/pages/search/lineList/lineList?fromPlaceLng=110.31739&fromPlaceLat=25.252237&toPlaceLng=110.317787&toPlaceLat=25.2526"
    // }) // 进行跳转
    if (_this.data.origin.lng != 0 || _this.data.origin.lat != 0 || _this.data.terminus.lng != 0 || _this.data.terminus.lat != 0){
      wx.navigateTo({ url: "/pages/search/lineList/lineList?fromPlaceLng=" + _this.data.origin.lng + "&fromPlaceLat=" + _this.data.origin.lat + "&toPlaceLng=" + _this.data.terminus.lng + "&toPlaceLat=" + _this.data.terminus.lat }) // 进行跳转
    }else{
      wx.showToast({
        title: '请确认出发地点或目的地点',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 时间选择
  pickerChange: function(e){
    var _this = this;
    var val = e.detail.value
    var day = _this.data.multiArray[0][val[0]].split(" ");
    if (e.currentTarget.dataset.type == "depart"){
      this.setData({
        depart: day[0] + " " + multiArray[1][val[1]] + ":" + multiArray[2][val[2]]
      })
    }else{
      this.setData({
        returns: day[0] + " " + multiArray[1][val[1]] + ":" + multiArray[2][val[2]]
      })
    }
    
  },
  advice:function (e){
    _this.setData({
      advice: e.detail.value
    })
  },
  // 发起定制
  confirmCustom: function(e) {
    var _this = this;
    var userData = app.globalData.userData;
    function isEmpty(obj){
      let isEmpty = false
      let toastList = ["出发地点", "目的地点", "出发时间","返程时间"];
      for(let i=0;i<obj.length;i++){
        if (obj[i].trim() == "") {
          wx.showToast({
            title: toastList[i] + "不能为空",
            icon: 'none'
          })
          return isEmpty
        } else {
          isEmpty = true;
        }
      }
      return isEmpty
    }
    if (userData.memberID){
      let verify = isEmpty([_this.data.origin.title, _this.data.terminus.title, _this.data.depart, _this.data.returns]);
      if (verify){
        // 发起定制
        getApp().func.speHttp('/vl/cusbus/app/services/aKeyCustoms', {
          userId: userData.mobileNo, //	用户id	string	query	true
          memberId: userData.memberID, //	会员id	string	query	true
          fromPlace: _this.data.origin.title, //	出发地	string	query	true
          fromPlaceLng: _this.data.origin.lng, //	出发地经度	number	query	true
          fromPlaceLat: _this.data.origin.lat, //	出发地纬度	number	query	true
          toPlace: _this.data.terminus.title, //	目的地	string	query	true
          toPlaceLng: _this.data.terminus.lng, //	目的地经度	number	query	true
          toPlaceLat: _this.data.terminus.lat, //	目的地纬度	number	query	true
          startTime: _this.data.depart, //	出发时间	string	query	true
          endTime: _this.data.returns, //	下班时间	string	query	false
          remark: _this.data.advice, //	线路建议	string	query	false
          tel: userData.mobileNo, //	手机号	string	query	true
          token: "" //	令牌	string	query	true
        }, 'get', function (res) {
          if (res.success){
            _this.setData({
              customSuccess: 1
            })
          }else{
            
          }
        })
      }
    }else{
      wx.navigateTo({
        url: "/pages/login/login"
      })
    }
  },
  // 关闭发起定制弹窗
  closeResultWin: function(e) {
    var _this = this;
    _this.setData({
      customSuccess: 0,
      origin: { title: "", lat: 0, lng: 0 },
      terminus: { title: "", lat: 0, lng: 0 },
      depart: "",
      returns: ""
    })
    app.globalData.origin = { title: "", lat: 0, lng: 0 }
    app.globalData.terminus = { title: "", lat: 0, lng: 0 }
  },
  // 用户点击主题公交跳转事件
  selectThemeBtn: function(e) {
    var _this = this;
    var url = _this.data.themeTypeImages[e.currentTarget.dataset.index].url + "?code=" + e.currentTarget.dataset.code; // 用户点击获取跳转的路径
    wx.navigateTo({
      url: url
    }) // 进行跳转
  },
  // 初加载
  onLoad: function(options) {
    var _this = this;
    
    // 地图选点
    if (options && options.tabNum){
      _this.setData({
        tabNum: options.tabNum
      })
    }
    _this.setData({
      origin: getApp().globalData.origin,
      terminus: getApp().globalData.terminus
    })
    // 调用查询主题公交类型接口
    getApp().func.comHttp('/vl/cusbus/app/services/querySubjectBusType', {}, 'get', function(res) {
      if (res.success == true) {
        _this.setData({
          themeTypeData: res.data
        })
      } else {
        console.log("调用查询主题公交类型接口失败")
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var _this = this;
    // 地图选点
    _this.setData({
      origin: getApp().globalData.origin,
      terminus: getApp().globalData.terminus
    })
  },
  getUserInfo: function(e) {

  }
})
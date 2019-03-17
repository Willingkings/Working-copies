// pages/common/map/map.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '',
    longitude: '',
    rimList: [],
    inputPos: -1,
    siteType: ""
  },
  /**
   * input输入搜索
   */
  bindReplaceInput: function(e){
    const _this = this;
    const value = e.detail.value;
    let pos = e.detail.cursor;
    if (pos != -1) {
      // 关键字搜索
      _this.setData({ inputPos: pos });
      qqmapsdk.getSuggestion({
        keyword: value,
        region: "桂林市",
        region_fix: 1,
        policy: 1,
        page_index: 1,
        success: function (res) {
          _this.setData({ rimList: res.data })
        }
      });
    }
  },
  selectThis: function(e){
    const _this = this;
    getApp().globalData[_this.data.siteType].title = e.currentTarget.dataset.title 
    getApp().globalData[_this.data.siteType].lat = e.currentTarget.dataset.lat 
    getApp().globalData[_this.data.siteType].lng = e.currentTarget.dataset.lng 
    wx.reLaunch({ url: '/pages/index/index?tabNum=' + _this.data.tabNum})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    // 与地图组件绑定
    _this.mapCtx = wx.createMapContext('rimMap')
    // 实例化QQ地图
    qqmapsdk = new QQMapWX({
      key: 'FGGBZ-R4AK5-TGGIR-QXVYH-VPG7J-3SBU7'
    });
    // 确认是否授权定位
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation'
          })
        }
      }
    })
    // 地图移动到当前位置
    _this.mapCtx.moveToLocation()

    // 选点传参
    _this.setData({ siteType: options.siteType, tabNum: options.tabNum })
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
    const _this = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        _this.setData({ latitude: res.latitude, longitude: res.longitude });
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          get_poi: 1,
          poi_options: "policy=3&address_format=short",
          success: function (res) {
            _this.setData({ rimList: res.result.pois })
          }
        });
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
//app.js

var http = require('./utils/http.js'); // 调用域名请求方法
var timeMethod = require('./utils/time.js'); // 调用获取日期时间方法
var utilMd5 = require('./utils/md5.js');  // 调用md5加密方法
var DES3 = require('./utils/3des.js');  // 调用DES3文件base64_encode
var Base64 = require('./utils/Base64.js');  // 调用Base64方法

App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var datetime = that.func.timeMethod.haveSomeMinutesTime();  // 获取日期时间
        var sign = that.func.utilMd5.hexMD5("key=gldy2017@ugiant2017@!~#*" + "&datetime=" + datetime); // 加密
        // 发送code让后台判断openID是否是已经是桂林用户并绑定手机号码信息
        that.func.userHttp('/smallRoutine/getOpenID', {
          type: 3,
          js_code: res.code,
          datetime: datetime,
          sign: sign,
        }, 'get', function (res) {
          // 将用户信息数据赋值为全局数据
          that.globalData.userData = {
            openID: res.openID, // ----------------用户openID
            memberID: res.memberID, // ------------用户memberID
            mobileNo: res.mobileNo, // ------------默认用户手机号码
            token: res.token,  // -----------------判断用户是否登陆
            isWeChatBount: res.isWeChatBount // ---判断是否绑定微信
          }
          // 保存登录信息
          wx.request({
            url: "https://api.microapp.glchuxingwang.com/api_cusbus/vl/cusbus/app/services/saveLoginInfo",
            data: {
              memberId: String(getApp().globalData.userData.memberID),
              token: getApp().func.Base64.base64_encode(getApp().func.DES3.encrypt("lightintek@1234567890.com", getApp().globalData.userData.token))
            },
            method: "get",
            header: { 'Content-Type': 'application/json' },
            success: function (res,header) {
              that.globalData.cookie = res.header["Set-Cookie"]
              return typeof cb == "function" && cb(res.data)
            },
            fail: function () {
              return typeof cb == "function" && cb(false)
            }
          })
          
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  // 全局数据
  globalData: {
    userInfo: null,
    userData: null,  // 用户信息数据
    cookie: "",
    // 地图选点
    origin: {
      title: "",
      lat: 0,
      lng: 0
    },
    terminus: {
      title: "",
      lat: 0,
      lng: 0
    }
  },
  // 全局方法
  func: {
    comHttp: http.comHttp,  // ----普通接口方法
    speHttp: http.speHttp, // -----特殊接口方法
    userHttp: http.userHttp, // ---用户接口方法
    translate: http.translate, // -坐标转换
    pathHttp: http.pathHttp, // ---线路规划
    timeMethod: timeMethod,  // ---日期时间方法
    utilMd5: utilMd5,  // ---------调用md5加密方法
    DES3: DES3, // ----------------调用DES3加密
    Base64: Base64 //--------------调用DES3加密
  }
})
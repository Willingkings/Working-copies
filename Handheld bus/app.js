//app.js
var http = require('./utils/http.js'); // 调用域名请求方法
var timeMethod = require('./utils/time.js'); // 调用获取日期时间方法
var utilMd5 = require('./utils/md5.js');  // 调用md5加密方法
var DES3 = require('./utils/3des.js');  // 调用DES3文件base64_encode
var Base64 = require('./utils/Base64.js');  // 调用Base64方法

App({
  onLaunch: function () {
    // 展示本地存储能力
    let that = this;
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
          type: 4,
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
            isWeChatBount: res.isWeChatBount, // ---判断是否绑定微信
            sign: that.func.utilMd5.hexMD5("memberId=" + res.memberID + "&token=" + res.token) // ---验证登录加密sign
          }
          if (res.memberID){
            that.func.userHttp('/api/member/logined/getMemberInfo', {
              memberId: res.memberID,
              sign: that.func.utilMd5.hexMD5("memberId=" + res.memberID + "&token=" + res.token) // 加密
            }, 'get', function (res) {
              that.globalData.userData.accountAmount = res.member.AccountAmount
            })
          }
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
  globalData: {
    userInfo: null
  },
  // 全局方法
  func: {
    comHttp: http.comHttp,  // ----普通接口方法
    userHttp: http.userHttp, // ---用户接口方法
    translate: http.translate, // -坐标系转换
    codeHttp: http.codeHttp, // ---二维码相关
    balanceHttp: http.balanceHttp, // -充值
    timeMethod: timeMethod,  // ---日期时间方法
    utilMd5: utilMd5,  // ---------调用md5加密方法
    DES3: DES3, // ----------------调用DES3加密
    Base64: Base64 //--------------调用DES3加密
  }
})
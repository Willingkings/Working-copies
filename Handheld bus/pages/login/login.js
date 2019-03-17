// pages/login/login.js

var interval; // 倒计时定时器
var phoneNumReg = /^[1][3,4,5,7,8][0-9]{9}$/;  // 手机号码正则
var phoneNumReg1 = /^[1][9][8-9][0-9]{8}$/;  // 手机号码正则
var phoneNumReg2 = /^[1][6][6][0-9]{8}$/;  // 手机号码正则

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneValue: "",   // 默认用户填写的手机号码为空
    codeValue: "",  // 默认用户填写的验证码为空
    codeText: "获取动态码", // 默认获取验证码按钮文字
    currentTime: 60, // 默认验证码时间为60秒
    disabledCode: false,  // 默认获取验证码可点击状态
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /** ----------------------------------方法 ----------------------------------**/
  // 获取用户输入号码的内容
  inputPhone: function (e) {
    var that = this;
    that.setData({ phoneValue: e.detail.value })
  },
  // 获取用户输入验证码的内容
  inputCode: function (e) {
    var that = this;
    that.setData({ codeValue: e.detail.value })
  },
  // 校验手机号码方法
  verifyPhone: function (phone) {
    var that = this;
    if (phoneNumReg.test(phone) || phoneNumReg1.test(phone) || phoneNumReg2.test(phone)) {
      return true
    } else {
      return false
    }
  },
  // 验证码倒计时方法
  getCode: function () {
    var that = this;
    var currentTime = that.data.currentTime;  // 获取设定的倒计时秒数
    clearInterval(interval);  // 清除之前的倒计时定时器
    that.setData({ codeText: currentTime + '秒', disabledCode: true }); // 设置获取验证码按钮文字和设置获取验证码按钮为不可以点击状态
    interval = setInterval(function () {  // 启动倒计时定时器
      that.setData({ codeText: (currentTime - 1) + '秒' });   // 设置获取验证码按钮文字
      currentTime--;  // 秒数自减
      if (currentTime <= 0) {
        clearInterval(interval); // 秒数为0清除定时器
        that.setData({  // 设置还原数据
          codeText: '获取动态码',
          currentTime: 60,
          disabledCode: false
        })
      }
    }, 1000)
  },
  /** ---------------------------------用户事件 ---------------------------------**/
  // 用户点击清除手机号码按钮
  // delPhone: function () {
  //   var that = this;
  //   that.setData({ phoneValue: "" })
  // },
  // 用户点击获取验证码按钮
  gainCode: function () {
    var that = this;
    if (that.verifyPhone(that.data.phoneValue)) {
      var kay = "glcxw2017@ugiant2017@!~#*";  // 加密规则key
      var sign = getApp().func.utilMd5.hexMD5(getApp().func.utilMd5.hexMD5(that.data.phoneValue + kay)); // 加密
      // 调用获取验证码接口
      getApp().func.userHttp('/common/sms/send', {
        mobileNo: that.data.phoneValue,
        sign: sign,
        version: 1,
        platform: 1,
        type: 7,
      }, 'get', function (res) {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 1000
        })
      })
      that.getCode(); // 启动验证码倒计时方法
    } else {
      wx.showToast({
        title: '手机号码不正确',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  // 用户点击登录按钮
  submit: function () {
    var that = this;
    // 调用校验手机号码方法
    if (that.verifyPhone(that.data.phoneValue)) {
      if (that.data.codeValue.length == 6) {
        var datetime = getApp().func.timeMethod.haveSomeMinutesTime(0); // 获取时间
        var sign = getApp().func.utilMd5.hexMD5("key=gldy2017@ugiant2017@!~#*" + "&datetime=" + datetime);  // 加密
        // 绑定手机号码
        getApp().func.userHttp('/smallRoutine/bindCellPhoneNumber', {
          type: 4,
          loginName: that.data.phoneValue,  // -------------用户填写手机号码
          code: that.data.codeValue,  // -------------------用户填写验证码
          openID: getApp().globalData.userData.openID, //---用户微信openid
          datetime: datetime, // ---------------------------时间
          sign: sign, // -----------------------------------加密规则
        }, 'get', function (res) {
          if (res.success == true) {
            getApp().globalData.userData.memberID = res.memberID;
            getApp().globalData.userData.token = res.token;
            getApp().globalData.userData.mobileNo = that.data.phoneValue;
            // 保存登录信息
            wx.request({
              url: "https://api.microapp.glchuxingwang.com/api_cusbus/vl/cusbus/app/services/saveLoginInfo",
              data: {
                memberId: String(res.memberID),
                token: getApp().func.Base64.base64_encode(getApp().func.DES3.encrypt("lightintek@1234567890.com", res.token))
              },
              method: "get",
              header: { 'Content-Type': 'application/json' },
              success: function (res, header) {
                getApp().globalData.cookie = res.header["Set-Cookie"]
                return typeof cb == "function" && cb(res.data)
              },
              fail: function () {
                return typeof cb == "function" && cb(false)
              }
            })
            // 后退
            wx.navigateBack({
              delta: 1
            })
          } else {
            // 验证失败
            wx.showToast({
              title: res.msg,
              icon: 'loading',
              duration: 1000
            })
            return
          }
        })
      } else {
        wx.showToast({
          title: '验证码填写错误',
          icon: 'loading',
          duration: 1000
        })
      }
    } else {
      console.log("手机号码错误")
      wx.showToast({
        title: '手机号码不正确',
        icon: 'loading',
        duration: 1000
      })
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
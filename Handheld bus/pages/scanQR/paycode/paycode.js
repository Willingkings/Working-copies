// pages/scanQR/paycode/paycode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: ""
  },
  pwdInput: function (e){
    console.log(e)
    let pwd = '';
    if (this.data.password.length != 6){
      this.setData({
        password: this.data.password + e.currentTarget.dataset.num
      })
      if (this.data.password.length == 6){
        this.verification()
      }
    }
  },
  deletePwd: function (e) {
    let pwdLen = this.data.password.length;
    let newPwd = ""
    if (pwdLen != 1) {
      newPwd = this.data.password.slice(0, pwdLen - 1)
    }
    this.setData({
      password: newPwd
    })
  },
  verification: function(){
    let that = this;
    let password = getApp().func.Base64.base64_encode(getApp().func.Base64.base64_encode(getApp().func.DES3.encryptCbc("abcdefghijklmnopqrstuvwx", that.data.password)));
    getApp().func.codeHttp('/api/v1/epps/open', {
      userId: String(getApp().globalData.userData.memberID),
      pwd: password,
      confirmPwd: password
    }, 'get', function (res) {
      wx.redirectTo({
        url: "/pages/scanQR/payercode/payercode"
      }) // 进行跳转
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
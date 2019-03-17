// pages/mine/expenseDetail/expenseDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expenseList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let type = options.type;
    _this.setData({
      type: type
    })
    if (type == "expense"){
      wx.request({
        url: "https://ssl.glchuxingwang.com/tmp_api_ewallet/api/v1/order/list/" + getApp().globalData.userData.memberID,
        data: {
          page: "1"
        },
        method: 'post',
        success: function (res) {
          let list = res.data.data.list;
          _this.setData({
            expenseList: list
          })
        }
      })
    }else {
      wx.request({
        url: "https://ssl.glchuxingwang.com/tmp_api_member/mobile/person_center/expense_recordNew" ,
        data: {
          memberId: Number(getApp().globalData.userData.memberID),
          pageNumber: 1,
          pageSize: 20,
          costType: 0,
          BusinessType: 0,
          sign: getApp().globalData.userData.sign
        },
        method: 'get',
        success: function (res) {
          let list = res.data.data;
          _this.setData({
            expenseList: list
          })
        }
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
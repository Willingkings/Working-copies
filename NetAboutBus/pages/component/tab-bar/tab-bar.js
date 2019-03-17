// pages/component/tab-bar/tab-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    category: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    selsectTab: function (e) {
      let urlList = {
        "line": "/pages/index/index",
        "checkIn": "/pages/check-in/orderList/orderList?index=1",
        "mine": "/pages/mine/index/index"
      };
      if (this.data.category != e.currentTarget.dataset.type){
        wx.reLaunch({
          url: urlList[e.currentTarget.dataset.type]
        }) 
      }
    }
  }
})

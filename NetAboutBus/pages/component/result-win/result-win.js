// pages/component/resultWin/resultWin.js
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
    custom: {
      title: "../../../img/background/custom-title.png", 
      examine: "", // 我的定制链接
      backgroundUrl: "../../../img/background/custom-bg.png", 
      invitation: ""  // 邀请好友报名链接
    },
    nothing: {
      title: "../../../img/background/nothing-title.png",
      examine: "", // 个人定制链接
      backgroundUrl: "../../../img/background/nothing-bg.png",
      invitation: ""  // 线路定制链接
    },
    apply: {
      title: "../../../img/background/apply-title.png",
      examine: "", // 我的班车链接
      backgroundUrl: "../../../img/background/apply-bg.png",
      invitation: ""  // 邀请好友报名链接
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeResultWin: function () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('closeResultWin', myEventDetail, myEventOption)
      console.log(1)
    }
  }
})

// pages/common/calendar/calendar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lineCode: "",
    runTime: "",
    monthFlag: 0,          
    dataList: [],          // 原始日期数组
    dayLists: [],          // 重组后的日期数组
    currentYear: "--",     // 当前的年分
    currentMonth: "--",    // 当前的月份
    today: "",             // 当前的日期
    selectedTime: "",      // 展示的日期
    selectedDate: [],      // 选中的日期
    selectedTimeType: "today",      // 选中的日期类型
    btnList:[
      { name: "本周", type: "thisWeek", select: false, num: 0 },
      { name: "下周", type: "nextWeek", select: false, num: 0 },
      { name: "本月", type: "thisMonth", select: false, num: 0 },
      { name: "下月", type: "nextMonth", select: false, num: 1 },
    ]
  },
   //返回指定的月份的天数 月份1-12
  calDays :function(year, month) {
    return new Date(year, month, 0).getDate();
  },
  //展示指定的年和月的所有日期
  showDays: function (monthFlag, selectedTimeType,itemData){
    var _this = this;
    var now = new Date();
    var selected = "";
    _this.setData({ currentYear: now.getFullYear(), currentMonth: now.getMonth() + 1, today: now.getDate() })
    // if (monthFlag == null) monthFlag = 0;
    var month = (now.getMonth() + 1 + monthFlag)%12 > 0 ? (now.getMonth() + 1 + monthFlag)%12 : 12;
    var year = now.getFullYear() + Math.floor((now.getMonth() + 1 + monthFlag) / 12.1);
    _this.setData({ selectedTime: year + "年" + month + "月" })
    // 获取当月天数
    var daysOfMonth = _this.calDays(year, month);
    for (var i = 1; i <= daysOfMonth; i++) {
      var today = new Date(_this.data.currentYear, _this.data.currentMonth - 1, _this.data.today);
      selected += (year + "-" + month + "-" + i + ",");
    }
    // 获取余票
    getApp().func.comHttp('/vl/cusbus/app/services/moreTicketMultiDate', {
      lineCode: _this.data.lineCode,
      useDate: selected,
      runTime: _this.data.runTime,
      token: ""
    }, 'get', function (res) {
      var today = new Date(_this.data.currentYear, _this.data.currentMonth - 1, _this.data.today);
      var selectDay = _this.data.currentYear + "-" + _this.data.currentMonth + "-" + _this.data.today;
      var thisMonthLastDay = new Date(_this.data.currentYear, _this.data.currentMonth - 1, daysOfMonth);
      var dayOfWeek = today.getDay(); //得到当前日期是星期几
      let selectedDate = [];
      for (var i = 0; i < res.data.length; i++) {
        var item = res.data[i];
        var itemDate = res.data[i].useDate.split("-");
        var chooseDay = new Date(itemDate[0], itemDate[1] - 1, itemDate[2]);
        item.year = itemDate[0];
        item.month = itemDate[1];
        item.day = itemDate[2];
        item.timestamp = chooseDay.getTime();
        item.selected = false;
        if (chooseDay.getTime() < today.getTime()) {
          res.data[i].disable = false;
        } else {
          res.data[i].disable = true;
        }
        var firstDay = "";
        var lastDay = "";
        switch (selectedTimeType) {
          case "today":          // 默认
            if (i > 0 && item.moreTicket != 0 && res.data[i - 1].moreTicket == 0) {
              item.selected = true;
              selectedDate.push(item.useDate);
              selectDay = item.useDate;
            }
            break;
          case "item":          // 默认
            selectedDate = _this.data.selectedDate;
            if (_this.data.selectedDate.indexOf(item.useDate) > -1) {
              if (item.moreTicket == 0) {
                item.selected = false;
              } else {
                item.selected = true;
              }
            }
            break;
          case "thisWeek":       // 本周
            lastDay = new Date(_this.data.currentYear, _this.data.currentMonth - 1, _this.data.today + 5 - dayOfWeek)
            if (item.timestamp <= lastDay.getTime() && item.timestamp >= today.getTime()) {
              if (item.moreTicket == 0) {
                item.selected = false;
              } else {
                item.selected = true;
                selectedDate.push(item.useDate);
              }
            }
            break;
          case "nextWeek":       // 下周
            firstDay = new Date(_this.data.currentYear, _this.data.currentMonth - 1, _this.data.today + 8 - dayOfWeek);
            lastDay = new Date(_this.data.currentYear, _this.data.currentMonth - 1, _this.data.today + 12 - dayOfWeek);
            if (item.timestamp <= lastDay.getTime() && item.timestamp >= firstDay.getTime()) {
              if (item.moreTicket == 0) {
                item.selected = false;
              } else {
                item.selected = true;
                selectedDate.push(item.useDate);
              }
            }
            break;
          case "thisMonth":      // 本月
            lastDay = new Date(_this.data.currentYear, _this.data.currentMonth - 1, daysOfMonth);
            if (item.timestamp <= lastDay.getTime() && item.timestamp >= today.getTime()) {
              if (item.moreTicket == 0) {
                item.selected = false;
              } else {
                item.selected = true;
                selectedDate.push(item.useDate);
              }
            }
            break;
          default:               // 下月
            if (item.timestamp > thisMonthLastDay.getTime()) {
              if (item.moreTicket == 0) {
                item.selected = false;
              } else {
                item.selected = true;
                selectedDate.push(item.useDate);
              }
            }else{
              selectedDate = _this.data.selectedDate;
            }
        }
      }
      _this.setData({ selectedDate: selectedDate, dataList: res.data })
      //得到表示指定年和月的1日的那个时间对象
      var days = [];
      var date = new Date(res.data[0].year, res.data[0].month - 1, 1);
      //1.先添加响应的空白的li:这个月1号是星期几，就添加几个空白的li
      var dayOfWeek = date.getDay(); //得到1日是星期几
      for (var i = 0; i < dayOfWeek; i++) {
        res.data.unshift("");
      }
      while (res.data.length > 0) {
        var spliceLen = res.data.splice(0, 7);
        if (spliceLen.length < 7) {
          for (var i = 0; i <= 7; i++) {
            if (i > spliceLen.length) {
              spliceLen.push("");
            }
          }
        }
        days.push(spliceLen);
      }
      _this.setData({ dayLists: days })
    })
  },
  // 下月余票
  nextMonth: function(e){
    var _this = this;
    var num = _this.data.monthFlag + Number(e.currentTarget.dataset.num);
    _this.setData({ monthFlag: num });
    if (num){
      _this.showDays(_this.data.monthFlag, _this.data.selectedTimeType);
    }else{
      _this.showDays(_this.data.monthFlag, _this.data.selectedTimeType);
    }
    
  },
  // 时间选择
  selectDate: function(e){
    var _this = this;
    if (Number(e.currentTarget.dataset.num) != 2){
      let tempList = _this.data.btnList;
      let selectedTimeType = e.currentTarget.dataset.type;
      let monthFlag = Number(e.currentTarget.dataset.num);
      for (var i = 0; i < tempList.length ; i++){
        if (i == e.currentTarget.dataset.index){
          if (tempList[i].select) {
            selectedTimeType = "today"
            monthFlag = 0;
            _this.setData({ selectedDate: []})
          }
        }else{
          tempList[i].select = false;
        }
      }
      tempList[e.currentTarget.dataset.index].select = !tempList[e.currentTarget.dataset.index].select;
      _this.setData({
        selectedTimeType: selectedTimeType,
        monthFlag: monthFlag,
        btnList: tempList
      })
    }else{
      _this.setData({ selectedTimeType: e.currentTarget.dataset.type });
      var item = e.currentTarget.dataset.adata;
      var dateList = _this.data.selectedDate;
      if (dateList.indexOf(item.useDate) > -1 ) {
        if (item.moreTicket != 0 && item.selected) {
          dateList.splice(dateList.indexOf(item.useDate),1);
        }
      }else{
        if (item.moreTicket != 0 && !item.selected) {
          dateList.push(item.useDate);
        }
      }
      _this.setData({
        selectedDate: dateList, 
        btnList: [
          { name: "本周", type: "thisWeek", select: false, num: 0 },
          { name: "下周", type: "nextWeek", select: false, num: 0 },
          { name: "本月", type: "thisMonth", select: false, num: 0 },
          { name: "下月", type: "nextMonth", select: false, num: 1 },
        ] 
      })
    }
    _this.showDays(_this.data.monthFlag, _this.data.selectedTimeType);
   
  },
  // 确认购票
  buyTicket: function(e){
    let _this = this;
    if (getApp().globalData.userData.memberID) {
      if (_this.data.selectedDate.length > 0) {
        wx.navigateTo({ url: "/pages/common/submitOrders/submitOrders?inOrder=1&lineCode=" + _this.data.lineCode + "&runTime=" + _this.data.runTime + "&selectedDate=" + _this.data.selectedDate + "&lineName=" + _this.data.lineName + "&selectSite=" + _this.data.selectSite }) // 进行跳转
      } else {
        wx.showToast({
          title: "请选择购票日期",
          icon: 'none'
        })
      }
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({ lineCode: options.lineCode, runTime: options.runTime, lineName: options.lineName, selectSite: options.selectSite })
    _this.showDays(_this.data.monthFlag, _this.data.selectedTimeType);
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
    var _this = this;
    _this.showDays(_this.data.monthFlag, _this.data.selectedTimeType);
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
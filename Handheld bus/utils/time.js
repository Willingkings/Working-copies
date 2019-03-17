// 获取当前时间方法
function haveSomeMinutesTime(n) {
  if (n == null) {
    n = 0;
  }
  // 时间
  var newDate = new Date()
  // var timeStamp = newDate.getTime(); //获取时间戳
  var date = newDate.setMinutes(newDate.getMinutes() + n);
  newDate = new Date(date);
  var year = newDate.getFullYear();
  var month = newDate.getMonth() + 1;
  var day = newDate.getDate();
  var h = newDate.getHours();
  var m = newDate.getMinutes();
  var s = newDate.getSeconds();
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  if (h < 10) {
    h = '0' + h;
  };
  if (m < 10) {
    m = '0' + m;
  };
  if (s < 10) {
    s = '0' + s;
  };
  year = year.toString();
  var time = year + month + day + h + m + s;
  return time;
}
// 时间戳转日期方法 年-月-日 时:分:秒
function timestamp(unixtime) {
  var dateTime = new Date(parseInt(unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString());  //typescript转换写法
  var milliseconds = now_new - dateTime;
  if (String(month).length == 1) { month = "0" + month }
  if (String(day).length == 1) { day = "0" + day }
  if (String(hour).length == 1) { hour = "0" + hour }
  if (String(minute).length == 1) { minute = "0" + minute }
  if (String(second).length == 1) { second = "0" + second }
  var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ":" + second;
  return timeSpanStr;
}
// 时间戳转时分方法 时:分
function timeDivision(unixtime) {
  var dateTime = new Date(parseInt(unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString());  //typescript转换写法
  var milliseconds = now_new - dateTime;
  if (String(month).length == 1) { month = "0" + month }
  if (String(day).length == 1) { day = "0" + day }
  if (String(hour).length == 1) { hour = "0" + hour }
  if (String(minute).length == 1) { minute = "0" + minute }
  if (String(second).length == 1) { second = "0" + second }
  var timeSpanStr = hour + ':' + minute;
  return timeSpanStr;
}

// 时间戳转时分方法 年-月
function yearMonth(unixtime) {
  var dateTime = new Date(parseInt(unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString());  //typescript转换写法
  var milliseconds = now_new - dateTime;
  if (String(month).length == 1) { month = "0" + month }
  if (String(day).length == 1) { day = "0" + day }
  if (String(hour).length == 1) { hour = "0" + hour }
  if (String(minute).length == 1) { minute = "0" + minute }
  if (String(second).length == 1) { second = "0" + second }
  var timeSpanStr = year + '-' + month;
  return timeSpanStr;
}

module.exports = {
  haveSomeMinutesTime: haveSomeMinutesTime,
  timestamp: timestamp,
  timeDivision: timeDivision,
  yearMonth: yearMonth
}
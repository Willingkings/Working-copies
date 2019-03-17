var comDomain = 'https://ssl.glchuxingwang.com/api_zsgj';       // 普通域名 
var usertDocment = 'https://ssl.glchuxingwang.com/api_member';     // 用户域名
var codeCorrelation = 'https://ssl.glchuxingwang.com/tmp_api_ewallet';     // 二维码相关
var balanceEnquiry = 'https://ssl.glchuxingwang.com/tmp_api_member';     // 充值
// 普通http(不需要登录校验)
function comHttp(url, data, getpost, cb) {
  wx.request({
    url: comDomain + url,
    data: data,
    method: getpost,
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // header: { 'Content-Type': 'application/json' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false) 
    }
  })
}

// 二维码相关
function codeHttp(url, data, getpost, cb) {
  wx.request({
    url: codeCorrelation + url,
    data: data,
    method: getpost,
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // header: { 'Content-Type': 'application/json' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

// 余额查询
function balanceHttp(url, data, getpost, cb) {
  wx.request({
    url: balanceEnquiry + url,
    data: data,
    method: getpost,
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // header: { 'Content-Type': 'application/json' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}


// 用户
function userHttp(url, data, getpost, cb) {
  wx.request({
    url: usertDocment + url,
    data: data,
    method: getpost,
    header: { 'Content-Type': 'application/json' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

// 坐标系转换
function translate(locations, getpost, cb) {
  wx.request({
    url: "https://apis.map.qq.com/ws/coord/v1/translate",
    data: {
      locations: locations,
      type: 1,
      key: "FGGBZ-R4AK5-TGGIR-QXVYH-VPG7J-3SBU7"
    },
    method: getpost,
    header: { 'Content-Type': 'application/json' },
    success: function (res) {
      typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      typeof cb == "function" && cb(false)
    }
  })
}


module.exports = {
  comHttp: comHttp,
  userHttp: userHttp,
  codeHttp: codeHttp,
  balanceHttp: balanceHttp,
  translate: translate
}  
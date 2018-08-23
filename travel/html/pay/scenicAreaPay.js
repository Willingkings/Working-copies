var scenicPay = angular.module('scenicPay', [ 'Encrypt']);

scenicPay.run(["$rootScope", '$window', "$location", function ($rootScope, $window, $location, $scope) {
    var init = function() {
        //获取html元素
        var html = document.getElementsByTagName('html')[0];
        //屏幕的宽度（兼容处理）
        var htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
        var htmlHeight = document.documentElement.clientHeight || document.body.clientHeight;
        html.style.fontSize = htmlWidth / 375 * 20+ "px";
        html.style.height = htmlHeight+ "px";
    };
    init();
}]);

scenicPay.controller("scenicPayCon",function ($q, $rootScope, $scope, $httpService, $window, $location) {

    var searchStr = window.location.search;
    $scope.selectDateShow = false;
    $scope.areaPayDetails = JSON.parse(decodeURI(base64decode(getSearchItem(searchStr,"params"))));
    $scope.orderNums = 1;
    $scope.total = $scope.areaPayDetails.price;
    $scope.price = $scope.areaPayDetails.price;
    $scope.GGBSLineParams = {
        routeId: $scope.areaPayDetails.GGBSLineIdS,
        day: ""
    };
    $scope.QYBachIDParams = {
        batchCount: $scope.areaPayDetails.BatchCount,
        pKey: $scope.areaPayDetails.id
    };

    $scope.orderContact = '';
    $scope.orderTels = $rootScope.isApp ?  $scope.areaPayDetails.getUserInfo.phone : $scope.areaPayDetails.getSign.mobileNo;

    /***** 获取 SearchItem ******/
    function getSearchItem(searchStr,objItem) {
        var reg = new RegExp('(^|&)' + objItem + '=([^&]*)(&|$)', 'i');
        var r = searchStr.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    /**** 获取班次信息 ****/
    function getSchedule(params){
        if (params.routeId) {
            $httpService.getData("/TicketAPI/GGBS/getSchedule", 'GET', params)
                .then(function(data){
                    $scope.GGBScheduleDetail= data.list;
                    if ($scope.GGBScheduleDetail.length) {
                        $scope.GGBScheduleID = $scope.GGBScheduleDetail[0].id;
                        $scope.GGBScheduleName = $scope.GGBScheduleDetail[0].name;
                    }else {
                        $scope.GGBScheduleID = 0;
                    }
                },function (data) {
                    console.log("数据请求失败")
                })
        }
    }

    /**** 获取场次信息 ****/
    function getSendBatchList(params){
        if (params.batchCount) {
            $httpService.getData("/TicketAPI/Product/GetSendBatchList", 'GET', {pKey: params.pKey})
                .then(function(data){
                    $scope.QYBachIDDetail= data.data;
                    if ($scope.QYBachIDDetail.length) {
                        $scope.QYBachID = $scope.QYBachIDDetail[0].pbtID;
                    }else {
                        $scope.QYBachID = 0;
                    }
                },function (data) {
                    console.log("数据请求失败")
                })
        }
    }

    /**** 获取门票日期价格 ****/
    function getDatePrice(params){
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/Product/GetProductDatePrice", 'GET', {pKey: params})
            .then(function(data){
                defer.resolve(data.data)
            },function (data) {
                defer.reject(data);
                console.log("数据请求失败")
            })
        return defer.promise;
    }

    /**** 获取订单号 ****/
    function BSCreateOrder(){
        var defer = $q.defer();
        $scope.params = {
            memberId: $scope.areaPayDetails.getSign.memberId,
            sign: $scope.areaPayDetails.getSign.sign,
            datetime: $scope.areaPayDetails.getSign.datetime,
            orderNums : $scope.orderNums,
            orderValidTimeStart: $scope.GGBSLineParams.day,
            productID: $scope.areaPayDetails.id,     //"门票ID,必须入参",
            orderContactor:  $scope.orderContact,
            orderTel:  $scope.orderTels
        };

        // 班次
        if ($scope.areaPayDetails.GGBSLineIdS) {
            $scope.params.scheduleID = $scope.GGBScheduleID;
            $scope.params.scheduleName = $scope.GGBScheduleName
        }
        // 场次
        if ($scope.areaPayDetails.BatchCount) {
            $scope.params.pbtID  = $scope.QYBachID
        }
        $httpService.getData("/TicketAPI/WXAuth/CreateOrder", 'GET', $scope.params)
            .then(function(data){
                $scope.orderNo = data.orderNo;
                defer.resolve(data);
            },function (data) {
                defer.reject(data);
            });
        return defer.promise;
    }
    $scope.selectSchedules = function (id) {
        $scope.GGBScheduleID = id;
        $scope.QYBachID = id;
    };
    $scope.ticketPays = function (){
        if ($scope.submitOrderFlag) {
            return
        }
        $scope.submitOrderFlag = false;
        if (($scope.areaPayDetails.pProductLinks !== 0 && $scope.GGBScheduleID === 0) || ($scope.QYBachIDParams.batchCount !== 0 && $scope.QYBachID === 0)) {
            return;
        }
        BSCreateOrder().then(function (data) {
            if ($rootScope.isApp) {
                if (data.orderNo) {
                    alert(data.orderNo);
                    var pam = {
                        orderNo: data.orderNo,
                        orderType: "LY",
                        platformType: "APP"
                    };
                    backJSAction.callPayList(JSON.stringify(pam))
                }else {
                    $uibModal.open({
                        templateUrl: "./html/common/uiModal.html",    //引入模板路径
                        animation: true,    //出现的效果
                        backdrop:"static",    //让模板旁边的点击无效果
                        size:"sm",       //模板的大小
                        //关闭窗户
                        controller:function($scope,$uibModalInstance){
                            $scope.title = data.resultMsg;
                            $scope.ok=function(){
                                $uibModalInstance.close();
                            };
                        }
                    });
                }
            }else {
                var params = {
                    memberId: $scope.areaPayDetails.getSign.memberId,
                    sign: $scope.areaPayDetails.getSign.sign,
                    datetime: $scope.areaPayDetails.getSign.datetime,
                    business: 30,
                    order_no: data.orderNo,
                    payment_terminal: 20,
                    payment_method: 62,
                    notify_type: 1,
                    orderNo: data.orderNo,
                    orderType: "LY",
                    payment_type: 30,
                    openId: $scope.areaPayDetails.getSign.openId
                };
                $httpService.getData("/TicketAPI/WXAuth/Pay","GET",params)
                    .then(function(data){
                        $scope.payParams = JSON.parse(data.data.wechat);
                        /*wx.chooseWXPay({
                            appId: "wx873af39ea1f882ed",
                            timeStamp: data.data.timeStamp.toString(), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                            nonceStr: data.data.nonceStr, // 支付签名随机串，不长于 32 位
                            package: data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                            signType: "MD5",                   // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            paySign: data.data.paySign, // 支付签名
                            success: function (res) {
                                // 支付成功后的回调函数
                            }
                        });*/
                        /*$scope.payParams = {
                            appId: "wx873af39ea1f882ed",
                            timeStamp: data.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                            nonceStr: data.data.nonceStr, // 支付签名随机串，不长于 32 位
                            package: data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                            signType: "MD5",                   // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            paySign: data.data.paySign, // 支付签名
                        };*/
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', $scope.payParams,
                            function(res){
                                if(res.err_msg === "get_brand_wcpay_request:ok" ){

                                }
                            });
                    })
            }
        });

    };



    /**** 选择游玩日期 ****/
    $scope.selectDate = [
        {year: "", month: "", selectDays: []},
        {year: "", month: "", selectDays: []}
    ];
    //返回指定的月份的天数 月份1-12
    $scope.calDays = function (year, month) {
        return new Date(year, month, 0).getDate();
    }
    $scope.days = [];
    //展示指定的年和月的所有日期
    $scope.showDays = function(year, month, dayList, linePrice) {
        $scope.days = [];
        var todayTime = year + "-" + ($scope.active_month <= 9 ? "0"+$scope.active_month : $scope.active_month ) + "-" + ($scope.Today <= 9 ? "0"+$scope.Today : $scope.Today );
        var tomTime = year + "-" + ($scope.active_month <= 9 ? "0"+$scope.active_month : $scope.active_month ) + "-" + ($scope.tomorrow <= 9 ? "0"+$scope.tomorrow : $scope.tomorrow );
        $scope.tomPrice = $scope.areaPayDetails.price;
        $scope.todayPrice = $scope.areaPayDetails.price;
        //得到表示指定年和月的1日的那个时间对象
        var date = new Date(year, month - 1, 1);
        //计算一个月有多少天
        var daysOfMonth = $scope.calDays(year, month);
        //2. 从1号开始添加li
        for(var i = 1; i <= daysOfMonth; i++) {
            var chooseDay = new Date(year, month - 1, i);
            var today = new Date(year, currentMonth - 1,  $scope.Today);
            $scope.activeDay = $scope.Today;
            var dateTime = year + "-" + (month <= 9 ? "0"+month : month ) + "-" + (i <= 9 ? "0"+i : i );
            if ($scope.areaPayDetails.pBuyType > 0) {
                $scope.activeTime = linePrice[0].psdStoreTime.split("-");
                $scope.activeDay = parseInt($scope.activeTime[2]);
                $scope.otherMon = parseInt($scope.activeTime[1]);
                $scope.otherDay = parseInt($scope.activeTime[2]);
                $scope.price = linePrice[0].psdPrice;
                $scope.total = linePrice[0].psdPrice;
                $scope.days.push({
                    id: month + "-" + i ,
                    day: i,
                    price: $scope.areaPayDetails.price,
                    disables: true
                })
                for (var j = 0; j < linePrice.length; j++) {
                    var item = linePrice[j];
                    var time = linePrice[j].psdStoreTime.split("-");
                    var changeDay = new Date(parseInt(time[0]),parseInt(time[1])-1,parseInt(time[2]));
                    if (dateTime === item.psdStoreTime && changeDay.getTime() >= today.getTime() ) {
                        $scope.days[i-1].price = item.psdPrice;
                        $scope.days[i-1].disables = false;
                    }
                    if (todayTime === item.psdStoreTime) {
                        $scope.active_day = parseInt(time[1]) + "-" + parseInt(time[2]);
                        $scope.todayPrice = item.psdPrice;
                    }
                    if (tomTime === item.psdStoreTime) {
                        $scope.tomPrice = item.psdPrice;
                    }

                }
            }else {
                if (chooseDay.getTime() < today.getTime()) {
                    var disable = true
                }else {
                    var disable = false
                }
                $scope.days.push({
                    id: month + "-" + i ,
                    day: i,
                    price: $scope.areaPayDetails.price,
                    disables: disable
                })
            }
        }
        //1.先添加响应的空白的li:这个月1号是星期几，就添加几个空白的li
        var dayOfWeek = date.getDay(); //得到1日是星期几
        for(var i = 0; i < dayOfWeek; i++) {
            $scope.days.unshift("");
        }
        while ($scope.days.length > 0)
        {
            dayList.push($scope.days.splice(0,7));
        }
    }
    $scope.Today = '';
    $scope.tomorrow = '';
    $scope.active_day = '';
    $scope.active_month = '';
    $scope.otherMon = '';
    $scope.otherDay = '';
    var now = new Date(),
        currentYear = now.getFullYear(),
        currentMonth = now.getMonth() + 1,
        nextMonth = now.getMonth() + 2;
    $scope.active_year = now.getFullYear();
    $scope.active_month = currentMonth;
    $scope.Today = now.getDate();
    $scope.active_day = currentMonth + "-" + now.getDate();
    $scope.tom_month = now.getMonth(now.setDate($scope.Today + 1)) + 1 ;
    $scope.tomorrow =  now.getDate(now.setDate($scope.Today + 1));
    //初始化显示 当前年和月
    $scope.show_now = function() {
        getDatePrice($scope.areaPayDetails.id).then(function (priveList) {
            $scope.selectDate[0].year = currentYear;
            $scope.selectDate[0].month = currentMonth;
            $scope.selectDate[1].year = currentYear;
            $scope.selectDate[1].month = nextMonth;
            $scope.showDays(currentYear, currentMonth, $scope.selectDate[0].selectDays, priveList);
            $scope.showDays(currentYear, nextMonth, $scope.selectDate[1].selectDays, priveList);
            $scope.GGBSLineParams.day = currentYear + "-" + currentMonth + "-" + $scope.Today;
            getSchedule($scope.GGBSLineParams);
            getSendBatchList($scope.QYBachIDParams);
        })
    };
    $scope.change_day = function(year, month, day, disable, price){
        if (disable) {
            return;
        }
        $scope.orderNums = 1;
        $scope.total = price;
        $scope.active_day = month + "-" + day;
        $scope.otherMon = month;
        $scope.otherDay = day;
        $scope.GGBSLineParams.day = year + "-" + month + "-" + day;
        $scope.selectDateShow = false;
        getSchedule($scope.GGBSLineParams);
        getSendBatchList($scope.QYBachIDParams);
    };
    $scope.shiftNum = function (data){
        $scope.orderNums = $scope.orderNums + data;
        if ($scope.orderNums > 0){
            $scope.total = ($scope.price * $scope.orderNums).toFixed(2);
        }
    }
});



scenicPay.factory("$httpService",function ($http, $q) {
    var $httpService = {};
    $httpService.getData = function (url,method,params) {
        var defer = $q.defer(),
            urls = "http://pc.ticket.glchuxingwang.com" + url,
            headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'};
        if (method === 'GET') {
            $http({
                url: urls,
                method: "GET",
                headers: headers,
                params: params,
                timeout: 5000,
            }).success(function (data) {

                defer.resolve(data);
            }).
            error(function (data, status, headers, config) {
                defer.reject(data);
            });
        } else {
            $http({
                url: urls,
                method: method,
                headers: headers,
                data: params,
                timeout: 5000,
            }).success(function (data) {
                defer.resolve(data);
            }).
            error(function (data, status, headers, config) {
                // defer.resolve(data);
                defer.reject(data);
            });
        }
        return defer.promise;
    };
    return $httpService;
});

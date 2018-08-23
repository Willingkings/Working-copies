"use strict";
var commonControl = angular.module("commonControl",[]);

commonControl.controller("loginCont",function ( $rootScope, $q, $scope, $http, $state, $location,$httpService) {
    /*$scope.loginType = "login";
    $scope.inputModel = {
        loginNumber: "",
        loginPassword: "",
        regAccount: "",
        regCode: "",
        regPassword: "",
        regPassword1: "",
        forgetAccount: "",
        forgetCode: "",
        forgetPassword: "",
        forgetPassword1: "",
    };

    
    
    $scope.loginBtn = function (){

        if ($scope.inputModel.loginNumber === "" || $scope.inputModel.loginNumber == null) {
            layer.msg("请填写用户名");
            return;
        }
        if ($scope.inputModel.loginPassword === ""  || $scope.inputModel.loginPassword == null) {
            layer.msg("请填写用户密码");
            return;
        }
        if ($scope.inputModel.loginPassword.length < 6 || $scope.inputModel.loginPassword.length > 16) {
            layer.msg("密码格式不正确");
            $scope.inputModel.loginPassword = "";
            return;
        }
        $scope.inputModel.loginPassword = base64encode($scope.inputModel.loginPassword);
        $http({
            url: "http://wechat.glchuxingwang.com/login",
            method: "GET",
            params: {
                username: $scope.inputModel.loginNumber,
                password: $scope.inputModel.loginPassword
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
            timeout: 5000,
        }).success(function (response) {
            if (response.success) {
                layer.msg(response.msg, { time: 1500 }, function() {
                    history.go(-1);
                });
            } else {
                layer.msg(response.msg, { time: 1500 });
            }
        }).error(function (response) {
            layer.msg(response.msg, { time: 1500 });
        });
    };

    $scope.switchType = function (type) {
        $scope.loginType = type;
    }*/




});

commonControl.controller("searchCont",function ( $rootScope, $q, $scope, $state, $stateParams,$httpService) {

    /************************************************** 图片懒加载 ****************************************************/
    $scope.lozy = function () {
        var timeM = 0;  // 定义秒数为0
        var time = setInterval(function(){
            timeM++;    // 秒数自增
            var aImg = document.querySelectorAll("img[guoyu-src]");   // 等HTML加载完毕获取图片对象
            // 判断是否获取到图片对象
            var Lozd = document.querySelectorAll("div.lozd");
            // 判断是否获取到图片对象
            if(aImg.length != false) {
                for (var i = 0; i < aImg.length; i++) {
                    Lozd[i].style.display = "none";
                    aImg[i].src = aImg[i].getAttribute('guoyu-src');    // 图片guoyu-src替换成src
                }
                clearInterval(time);                                      // 删除定时器
            }else {
                // 秒数为5删除定时器
                if(timeM == 5) {

                    clearInterval(time);
                }
            }
        },1000);
    }
    $scope.lozy();

    $scope.searchLoading = false;
    $scope.searchFocus = true;
    $scope.searchValue = '';
    $scope.searchType = $stateParams.type == null ? sessionStorage.getItem('type') : $stateParams.type;
    $scope.searchChange = function(){
        if ($scope.searchValue !== ""){
            $scope.searchLoading = true;
            getSearchResults($scope.searchValue);
            $scope.searchFocus = false;
        }else {
            $scope.searchFocus = true;
        }
    };
    /**** 模糊搜索 ****/
    function getSearchResults(searchKey){
        var params = {searchKey: searchKey};
        $httpService.getData("/TicketAPI/Product/GetSearchAreaAndAttractions", "GET", params)
            .then(function (data){
                $scope.areaList = data.Area;
                $scope.attractionsList = data.Attractions;
                $scope.searchLoading = false;
            })
    }
    /**** 热门地区 ****/
    function  getAreaNameList(){
        var param = {isHot:1};
        $httpService.getData("/TicketAPI/Product/GetAreaNameList", 'GET', param)
            .then(function(data){
                $scope.areaNameList = data.data;
            },function (error) {

            });
    }

    /**** 热门景区 ****/
    function getAttractions(){
        var param = {isHot:1};
        $httpService.getData("/TicketAPI/Product/GetAttractions", 'GET', param)
            .then(function(data){
                $scope.hotAttractions = data.data;
            },function (error) {

            });
    }

    /**** init ****/
    getAreaNameList();
    getAttractions();
    $scope.goDirectTrainList = function (classify,data){
        if ($rootScope.searchTrain) {
            var params = {
                areaID: data.ID,
                areaName: data.Name,
                siteID: classify === "area" ? 0 : data.ID,
                siteName: classify === "area" ? null : data.Name
            };
            $state.go("directTrainList",{currentSite: params})
        }else {
            if (classify === "area") {
                var params = {
                    ID: data.ID,
                    Name: data.Name,
                    siteID: 0,
                    siteName: null
                };
                $state.go("travelScenicAreaList",{scenicSelect: params})
                sessionStorage.setItem("areaData",JSON.stringify(params));
            }else {
                $state.go("scenicAreaDetails",{areaDetails: data.ID})
            }
        }
    };
});

commonControl.controller("switchingArea",function ($q, $sce, $scope, $state, $stateParams, $httpService) {

    /**** 地区列表 ****/
    $scope.areaList = [];
    $scope.areaDetail = [];
    function getAreaList(){
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/Product/GetAreaNameList", 'GET')
            .then(function(data){
                $scope.areaList = data.data;
                defer.resolve($scope.areaList)
            },function (data) {
                defer.reject(data);
                console.log("数据请求失败")
            });
        return defer.promise;
    }

    /**** 地区详情 ****/
    function getAreaDetail(obj){
        if (obj){
            for (var i=0; i<obj.length; i++){
                let areaList = obj[i];
                let params = {areaID : obj[i].ID};
                $httpService.getData("/TicketAPI/Product/GetAreaDetail", 'GET', params)
                    .then(function(data){
                        areaList.Remart = $sce.trustAsHtml(data.data.Remart);
                        areaList.ImgUrl = data.data.ImgUrl;
                    },function (data) {
                        console.log("数据请求失败")
                    })
            }
        }
    }

    /*** init ***/
    function init (){
        getAreaList().then(function (data){
            getAreaDetail(data);
            /******************  swiper 初始化  ********************/
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: 'auto',
                centeredSlides: true,
                spaceBetween: 20,
                observer:true,         //修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,  //修改swiper的父元素时，自动初始化swiper
            });
        });
    }
    init();

    /**** 地区选择 ****/
    $scope.currentArea = function (data) {
        var parames = {
            ID: data.ID,
            Name: data.Name,
        }
        $state.go("travel.directTrain",{currentArea:parames});
        sessionStorage.setItem("currentAreas",JSON.stringify(parames));
    }

});

commonControl.controller("specialPaymentCont",function ($rootScope,$q, $scope, $stateParams, $state, $httpService,$http,$location) {

    $scope.selectDateShow = false;
    $scope.paymentDetails = $stateParams.TrainDetails == null ? JSON.parse(sessionStorage.getItem("TrainDetails")) : $stateParams.TrainDetails;

    $scope.orderNums = 1;
    $scope.scheduleParams = {
        routeId: $scope.paymentDetails.id,
        day: ""
    };
    $scope.scheduleDetail = [];
    $scope.orderContactor = '';
    $scope.orderTel = $rootScope.isApp ?  $scope.paymentDetails.getUserInfo.phone : "";

    /**** 获取班次信息 ****/
    function getSchedule(params){
        $httpService.getData("/TicketAPI/GGBS/getSchedule", 'GET', params)
            .then(function(data){
                $scope.scheduleDetail= data.list;
                if ($scope.scheduleDetail.length) {
                    $scope.price =  $scope.scheduleDetail[0].money;
                    $scope.total =  $scope.scheduleDetail[0].money;
                    $scope.scheduleID = $scope.scheduleDetail[0].id;
                    $scope.scheduleName = $scope.scheduleDetail[0].name;
                }else {
                    $scope.scheduleID = 0;
                }
            },function (data) {
                console.log("数据请求失败")
            })
    }
    /**** 获取订单号 ****/
    function BSCreateOrder(){
        var defer = $q.defer();
        $scope.params = {
            memberId: $scope.paymentDetails.getSign.memberId,
            sign: $scope.paymentDetails.getSign.sign,
            datetime: $scope.paymentDetails.getSign.datetime,
            scheduleID: $scope.scheduleID,
            scheduleName: $scope.scheduleName,
            orderNums : $scope.orderNums,
            orderValidTimeStart: $scope.scheduleParams.day,
            orderContactor: $scope.orderContactor, // 联系人
            orderTel: $scope.orderTel    // 联系电话
        };
        $httpService.getData("/TicketAPI/WXAuth/BSCreateOrder", 'GET', $scope.params)
            .then(function(data){
                $scope.orderNo = data.orderNo;
                defer.resolve($scope.orderNo);
            },function (data) {
                defer.reject(data)
            });
        return defer.promise;
    }
    $scope.selectSchedule = function (id,money) {
        $scope.price = money;
        $scope.scheduleID = id;
    };

    $scope.shiftNum = function (data){
        $scope.orderNums = $scope.orderNums + data;
        if ( $scope.orderNums > 0){
            $scope.total = ($scope.price * $scope.orderNums).toFixed(2);
        }
    }

    $scope.immediatePays = function (){
        if ( $scope.scheduleID === 0) {
            return;
        }
        if ($rootScope.isApp) {
            BSCreateOrder().then(function (data){
                if (data) {
                    var pam = {
                        orderNo: data,
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
                            $scope.cancel = false;
                            $scope.ok = function(){
                                $uibModalInstance.close();
                            };
                        }
                    });
                }
            })
        }else {
            $http({
                url: "/proxy/glly",
                method: "GET",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
                params: {
                    proxyUrl: encodeURI("/TicketAPI/WXAuth/BSCreateOrder"),
                    scheduleID: $scope.scheduleID,
                    scheduleName: $scope.scheduleName,
                    orderNums : $scope.orderNums,
                    orderValidTimeStart: $scope.scheduleParams.day,
                    orderContactor: $scope.orderContactor, // 联系人
                    orderTel: $scope.orderTel,    // 联系电话
                    'form_type': 'wechat',
                    "orderUrlType": "1"
                },
                timeout: 5000,
            }).success(function (response) {
                if (response.status === 1000) {
                    window.location.href = "http://wechat.glchuxingwang.com/pages/travel_pay.html?orderNo=" + response.orderNo + "&orderType=LY&orderUrlType=1&m="+ $scope.memberId;
                }
            });
        }
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
        //得到表示指定年和月的1日的那个时间对象
        var date = new Date(year, month - 1, 1);
        //1.先添加响应的空白的li:这个月1号是星期几，就添加几个空白的li
        var dayOfWeek = date.getDay(); //得到1日是星期几
        for(var i = 0; i < dayOfWeek; i++) {
            $scope.days.push("");
        }
        //计算一个月有多少天
        var daysOfMonth = $scope.calDays(year, month);
        //2. 从1号开始添加li
        for(var i = 1; i <= daysOfMonth; i++) {
            var chooseDay = new Date(year, month - 1, i);
            var today = new Date(year, currentMonth - 1,  $scope.Today);
            if (chooseDay.getTime() < today.getTime()) {
                var disable = true
            }else {
                var disable = false
            }
            $scope.days.push({
                id: month + "-" + i ,
                day: i,
                price: linePrice,
                disables: disable
            })
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
        $scope.selectDate[0].year = currentYear;
        $scope.selectDate[0].month = currentMonth;
        $scope.selectDate[1].year = currentYear;
        $scope.selectDate[1].month = nextMonth;
        $scope.showDays(currentYear, currentMonth, $scope.selectDate[0].selectDays, $scope.paymentDetails.money);
        $scope.showDays(currentYear, nextMonth, $scope.selectDate[1].selectDays, $scope.paymentDetails.money);
        $scope.scheduleParams.day = currentYear + "-" + currentMonth + "-" + $scope.Today;
        getSchedule($scope.scheduleParams);
    };
    $scope.change_day = function(year, month, day, disable){
        if (disable) {
            return;
        }
        $scope.orderNums = 1;
        $scope.active_day = "";
        $scope.active_day = month + "-" + day;
        $scope.otherMon = month;
        $scope.otherDay = day;
        $scope.scheduleParams.day = year + "-" + month + "-" + day;
        getSchedule($scope.scheduleParams);
        $scope.selectDateShow = false;
    };

    $scope.$watch('$routeChangeSuccess',function () {
        $http({
            url: "http://wechat.glchuxingwang.com/proxy/glmember",
            method: "GET",
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
            params: {
                proxyUrl: encodeURI("/api/member/logined/getMemberInfo")
            },
            timeout: 5000,
        }).success(function (data) {
            if (data.success) {
                $scope.orderTel = data.member.MobileNo;
                $scope.orderContactor = data.member.MemberName;
                $scope.memberId = data.member.MemberID;
            }
        })
    })

});

commonControl.controller("areaPaymentCont",function ($q, $rootScope, $scope, $http, $stateParams, $window, $state, $uibModal, $httpService) {

    $scope.selectDateShow = false;
    $scope.areaPayDetails = $stateParams.ticketDetails == null ? JSON.parse(sessionStorage.getItem("ticketDetails")) : $stateParams.ticketDetails;
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
    $scope.orderTels = $rootScope.isApp ?  $scope.areaPayDetails.getUserInfo.phone : "";

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
         /*// 场次
        if ($scope.areaPayDetails.BatchCount) {
            $scope.params.pbtID  = $scope.QYBachID
        }*/
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

        if ($rootScope.isApp) {
            BSCreateOrder().then(function (data) {
                if (data.orderNo) {
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
                            $scope.cancel = false;
                            $scope.ok=function(){
                                $uibModalInstance.close();
                            };
                        }
                    });
                }
            })
        }else {
            var params = {
                proxyUrl: encodeURI("/TicketAPI/WXAuth/CreateOrder"),
                orderNums : $scope.orderNums,
                orderValidTimeStart: $scope.GGBSLineParams.day,
                productID: $scope.areaPayDetails.id,     //"门票ID,必须入参",
                orderContactor:  $scope.orderContact,
                orderTel:  $scope.orderTels,
                'form_type': 'wechat',
                "orderUrlType": "1"
            };

            // 班次
            if ($scope.areaPayDetails.GGBSLineIdS) {
                params.scheduleID = $scope.GGBScheduleID;
                params.scheduleName = $scope.GGBScheduleName
            }
            $http({
                url: "/proxy/glly",
                method: "GET",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
                params: params,
                timeout: 5000,
            }).success(function (response) {
                if (response.status === 1000) {
                    window.location.href = "http://wechat.glchuxingwang.com/pages/travel_pay.html?orderNo=" + response.orderNo + "&orderType=LY&orderUrlType=1&m="+ $scope.memberId;
                }
            });
        }
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

    $scope.$watch('$routeChangeSuccess',function () {
        $http({
            url: "http://wechat.glchuxingwang.com/proxy/glmember",
            method: "GET",
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
            params: {
                proxyUrl: encodeURI("/api/member/logined/getMemberInfo")
            },
            timeout: 5000,
        }).success(function (data) {
            if (data.success) {
                $scope.orderTels = data.member.MobileNo;
                $scope.orderContact = data.member.MemberName;
                $scope.memberId = data.member.MemberID;
            }
        })
    })
});



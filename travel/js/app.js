﻿'use strict';
var indexApp = angular.module('indexApp', [
    'ui.router',
    'ui.bootstrap',
    "httpService",
    'commonControl',
    'travelControls',
    'scenicAreaControls'
]);

indexApp.run(["$rootScope", '$window', "$location", function ($rootScope, $window, $location, $scope) {
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
    /***************************** 返回当前页面 ***************************/
    $rootScope.goBack = function () {
        history.go(-1);
    };
    $rootScope.pageTitle = "出游";

    $rootScope.isApp = true;
    try {
        backJSAction.isLogin()
    } catch (e) {
        $rootScope.isApp = false;
    }

    /****** 微信配置 *******/
    function getWechatParams(){
        var links = window.location.href;
        $.ajax({
            url:"http://wechat.glchuxingwang.com/checkSign/getWechatParams",
            dataType:"json",
            type:"post",
            data:{
                "url":links
            },
            success:function(res){
                wx.config({
                    beta: true,// 必须这么写，否则在微信插件有些jsapi会有问题
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.appId, // 必填，企业微信的cropID
                    timestamp:res.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.noncestr, // 必填，生成签名的随机串
                    signature: res.signature,// 必填，签名，见[附录1](#11974)
                    jsApiList: [ 'onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            },
            error:function(res){
                console.log(res.msg);
            }
        });
    }
    getWechatParams();

    /**** 检测路由改变，和APP数据交互 ****/
    var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);
    function locationChangeStart(event, newUrl, currentUrl) {
        var router = $location.path(),
            searchStr = $location.search(),
            pageTitle = '',
            pam = {
                newUrl: decodeURIComponent(newUrl),
                index: false,
                shareUrl:false
            };
        if (searchStr.u) {
            localStorage.setItem("orderSpreader",Base64.decode(searchStr.u));
            sessionStorage.setItem("orderSpreader",Base64.decode(searchStr.u));
        }
        switch (router) {
            case "/travel/directTrain":
                pam.index = true;
                $rootScope.searchTrain = true;
                break;
            case "/travel/scenicArea":
                pam.index = true;
                $rootScope.searchTrain = false;
                break;
            case "/travel/directTrain/list":
                pageTitle = "全部专线";
                $rootScope.pageTitle = "全部专线";
                break;
            case "/travel/scenicArea/list":
                pageTitle = "全部景点";
                $rootScope.pageTitle = "全部景点";
                break;
            case "/common/search/all":
                pageTitle = "搜索";
                $rootScope.pageTitle = "搜索";
                break;
            case "/common/search/area":
                pageTitle = "搜索";
                $rootScope.pageTitle = "搜索";
                break;
            case "/common/switchingArea":
                pageTitle = "切换地区";
                $rootScope.pageTitle = "切换地区";
                break;
            case "/common/specialPayment":
                pageTitle = "订单详情";
                $rootScope.pageTitle = "订单详情";
                break;
            case "/common/areaAreaPay":
                pageTitle = "景点门票";
                $rootScope.pageTitle = "景点门票";
                break;
            default:
                if (router.indexOf('/scenicArea/ticket/') >= 0 || router.indexOf('/directTrain/details/') >= 0 || router.indexOf('/travel/scenicArea/details/') >= 0 ) {
                    pam.shareUrl = true;
                    scrollTo(0,0);
                }
                break;
        }
        if ($rootScope.isApp) {
            backJSAction.pageInfo(JSON.stringify(pam));
            backJSAction.setPageTitle(pageTitle);
        }
    }
}]);

indexApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/travel/directTrain');
    $stateProvider
       /* .state('index', {
            url: '/',
            templateUrl: './index.html'
        })*/
         /*=======  公用  ========*/
        .state("login",{
            url: "/common/login",
            templateUrl: "./html/common/login.html",
            controller: 'loginCont',
        })
        .state("search",{
            url: "/common/search/{type}",
            templateUrl: "./html/common/search.html",
            controller: 'searchCont',
        })
        .state("switchingArea",{
            url: "/common/switchingArea",
            params: {'initialPos': null},
            templateUrl: "./html/common/switchingArea.html",
            controller: 'switchingArea'
        })
        .state("specialPayment",{
            url: "/common/specialPayment",
            params: {'TrainDetails': null},
            templateUrl: "./html/specialPayment.html",
            controller: 'specialPaymentCont'
        })
        .state("scenicAreaPay",{
            url: "/common/areaAreaPay",
            params: {"ticketDetails": null},
            templateUrl: "./html/scenicAreaPay.html",
            controller: 'areaPaymentCont'
        })
       /*======= 直通车 ======*/
        .state('travel', {
            url: '/travel',
            templateUrl: './html/travel/travel.html',
            controller: 'travelControl',
        })
        .state('travel.directTrain', {
            url: '/directTrain',
            params: {currentArea: null},
            templateUrl: './html/travel/travel-directTrain.html',
            controller: 'directTrainControl'
        })
        .state('directTrainList', {
            url: '/travel/directTrain/list',
            params: {currentSite: null},
            templateUrl: './html/travel/travel-directTrainList.html',
            controller: 'directTrainList'
        })
        .state('directTrainDetails', {
            url: '/travel/directTrain/details/{routeId}',
            templateUrl: './html/travel/travel-directTrainDetails.html',
            controller: 'directTrainDetail'
        })
        /*======== 玩转景区 ========*/
        .state('travel.scenicArea', {
            url: '/scenicArea',
            params: {currentArea: null},
            templateUrl: './html/travel/travel-scenicArea.html',
            controller: 'scenicAreaControl'
        })
        .state("travelScenicAreaList",{
            url: "/travel/scenicArea/list/{btCode}",
            params: {scenicSelect: null},
            templateUrl: "./html/travel/travel-scenicAreaList.html",
            controller: 'travelScenicAreaList'
        })
        .state('scenicAreaDetails', {
            url: '/travel/scenicArea/details/{areaDetails}',
            params: {areaDetails: null},
            templateUrl: './html/travel/travel-scenicAreaDetails.html',
            controller: 'scenicAreaDetails'
        })
        .state('scenicAreaTicket', {
            url: '/travel/scenicArea/ticket/{productUiCode}',
            params: {productUiCode:null},
            templateUrl: './html/travel/travel-scenicAreaTicket.html',
            controller: 'scenicAreaTicket'
        })
}]);





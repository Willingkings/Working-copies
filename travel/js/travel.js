"use strict";
var travelControls = angular.module("travelControls",[]);

travelControls.controller("travelControl",function ($rootScope, $scope, $stateParams, $state, $httpService, $location) {
    $scope.pageTitle = $rootScope.pageTitle;
    /**** 地区显示 ****/
    $scope.currentRegion = JSON.parse(sessionStorage.getItem("currentAreas")) == null ?{ID: 1, Name: "阳朔"}: JSON.parse(sessionStorage.getItem("currentAreas"));

    function getAreaList(){
        $httpService.getData("/TicketAPI/Product/GetAreaDetail", 'GET', {areaID: $scope.currentRegion.ID})
            .then(function(data){
                $scope.areaDetailImg=data.data.ImgUrl;
            },function (data) {
                console.log("数据请求失败")
            })
    }
    getAreaList();
    /**** 地区选择 ****/
    $scope.selectedArea = function (data) {
        var aData = {
            ID: data.ID,
            Name: data.Name
        };
        $state.go("switchingArea",{ "initialPos": aData });
    };
    /**** 搜索 ****/
    $scope.searchType = function (type) {
        sessionStorage.setItem('type', type);
    };
});

travelControls.controller("directTrainControl",function ( $q, $scope, $stateParams, $state, $httpService) {

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
    /******************TEMP 获取地区列表**********************/
    function getAreaListTemp(){
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/Product/GetAreaNameList", 'GET')
            .then(function(data){
                $scope.areaListTemp = data.data;
                defer.resolve($scope.areaListTemp)
            },function (data) {
                defer.reject(data);
                console.log("数据请求失败")
            });
        return defer.promise;
    }
    function getAreaDetail(obj){
        if (obj){
            for (var i=0; i<obj.length; i++){
                let areaList = obj[i];
                let params = {areaID : obj[i].ID};
                $httpService.getData("/TicketAPI/Product/GetAreaDetail", 'GET', params)
                    .then(function(data){
                        areaList.ImgUrl = data.data.ImgUrl;
                    },function (data) {
                        console.log("数据请求失败")
                    })
            }
        }
    }

    getAreaListTemp().then(function (data){
        getAreaDetail(data);
    });

    $scope.selectLine = [];
    $scope.recommendedLine = [];
    $scope.directLoading = true;
    $scope.specialLoading = true;
    /**** 推荐景区 ****/
    function getAttractions(){
        var params = {
            areaID: $scope.currentRegion.ID,
            isHot: 1,
            topNum: 4
        };
        $httpService.getData("/TicketAPI/Product/GetAttractions", 'GET', params)
            .then(function(data){
                var aData = data.data;
                for (var i=0; i<aData.length; i++){
                    $scope.selectLine.push({
                        destination: aData[i].Name,
                        ranking: i+1,
                        PresentPrice: aData[i].pFXPrice,
                        originalPrice: null,
                        sold: aData[i].OrderCount,
                        label: aData[i].ThemeName ? aData[i].ThemeName.split(",") : null,
                        imgUrl: aData[i].ImgUrl,
                        siteID: aData[i].ID,
                        areaID: aData[i].AreaID,
                        areaName: aData[i].AreaName
                    })
                }
                $scope.directLoading = false;
            },function (data) {
                console.log("数据请求失败")
            })
    }

    /**** 推荐线路 ****/
    function  getRecommendedLine(){
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/GGBS/getRecommendedLine","GET")
            .then(function (data){
                var aData = data.page.list;
                defer.resolve(aData);
            },function (error){
                defer.reject(error);
            });
        return defer.promise;
    };

    /******************  swiper 初始化  ********************/
    function swiperInit(){
        var swiper = new Swiper('.specialContainer',{
            pagination: {
                el: '.swiper-pagination',
            },
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,//修改swiper的父元素时，自动初始化swiper

        });
    }

    /**** init ****/
    getAttractions();
    getRecommendedLine().then(function (obj) {
        $scope.recommendedLine = obj;
        $scope.specialLoading = false;
        swiperInit();
    });

    /**** 查看详情 ****/
    $scope.currentSite = function (num,data) {
        if (num === "all") {
            var aData = {
                id: "0-0",
                areaID: 0,
                siteName: "目的地",
            };
        } else {
            var aData = {
                id: data.areaID + "-" + data.siteID,
                areaID: data.areaID,
                areaName: data.areaName,
                siteID: data.siteID,
                siteName: data.destination,
            };
        }
        $state.go("directTrainList",{"currentSite": aData });
    };
    $scope.currentAreaT = function (data) {
        var aData = {
            id: data.ID + "-0",
            areaID: data.ID,
            areaName: data.Name,
            siteID: '',
            siteName: '',
        };
        $state.go("directTrainList",{"currentSite": aData });
    };
    $scope.recommendedLineDetails = function (data) {
        sessionStorage.setItem("lineDetails",JSON.stringify(data));
    }
});

travelControls.controller("directTrainList",function ( $q, $scope, $stateParams, $state, $httpService) {
    $scope.destina = {
        title: "目的地",
        show: false
    }
    $scope.sorting = {
        title: "排序优先",
        show: false
    };
    $scope.classify = {
        title: "筛选",
        show: false
    };
    $scope.filtrate = {
        key: "",
        order: false
    };
    $scope.ticketTypeAct = 0;
    $scope.lineTabLoading = true;
    $scope.selectLine = [];
    $scope.recommendedLine = [];
    $scope.themeListParame = [];
    $scope.areaSelectList = [];   // 主题筛选出的景区列表
    $scope.allLineParame= {
        returnTicket: "",
        endAddress: "",
        spotName: ""
    };

    /**** 选中景区 ****/
    $scope.selectedSite = $stateParams.currentSite == null ? JSON.parse(sessionStorage.getItem("currentSite")) || {"id":"0-0","areaID":0,"siteName":"目的地"} : $stateParams.currentSite;

    /**** 地区列表 ****/
    $scope.desRegion = [];
    $scope.desAttract = [{
        id: "0-0",
        areaID: 0,
        areaName: "全部",
        Checked: $scope.selectedSite ? angular.equals($scope.selectedSite.siteID,0) : true,
        attractions: null
    }];
    $scope.actionRegion = {
        area: "0-0",
        site: ""
    };

    /**** 地区列表 ****/
    function getdesRegionList(){
        if ($scope.desRegion.length) {
            return;
        }
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/Product/GetAreaNameList", 'GET')
            .then(function(data){
                $scope.desRegion = data.data;
                defer.resolve($scope.desRegion);
            },function (error) {
                defer.reject(error);
            });
        return defer.promise;
    }

    /**** 景区列表 ****/
    function getdesAttractList(areaList){
        if (areaList){
            var defer= $q.defer();
            for (var i=0; i<areaList.length; i++){
                var params = {areaID : areaList[i].ID};
                $httpService.getData("/TicketAPI/Product/GetAreaDetail", 'GET', params)
                    .then(function(data){
                        var desAttr = [{
                            id: data.data.ID +"-0",
                            siteID: 0,
                            siteName: "全部景点",
                            Checked: false
                        }];
                        var attracts = data.Attractions.length;
                        for (var j = 0; j < attracts; j++) {
                            desAttr.push({
                                id: data.data.ID + "-" + data.Attractions[j].ID,
                                siteID: data.Attractions[j].ID,
                                siteName: data.Attractions[j].Name
                            });
                            if (angular.equals($scope.selectedSite.siteID,data.Attractions[j].ID)){
                                $scope.actionRegion.site = data.data.ID + "-" + data.Attractions[j].ID;
                            }
                        }
                        $scope.desAttract.push({
                            id: data.data.ID + "-0",
                            areaID: data.data.ID,
                            areaName: data.data.Name,
                            attractions: desAttr
                        });
                        if (angular.equals($scope.selectedSite.areaID,data.data.ID)){
                            $scope.actionRegion.area = data.data.ID + "-0";
                        }
                        defer.resolve($scope.desAttract)
                    },function (error) {
                        defer.reject(error)
                    })
            }

            return defer.promise;
        }
    }
    
    /**** 主题筛选 ****/
    function getThemeList(){
        $httpService.getData("/TicketAPI/Product/GetThemeList", 'GET')
            .then(function(data){
                $scope.themeList = data.data;
            },function (error) {

            });
    }

    /**** 相关主题景区 ****/
    function getAttractions(){
        var defer = $q.defer();
        var params = {
            themeIDS: $scope.themeListParame.join()
        };
        $scope.areaSelectList = [];
        $httpService.getData("/TicketAPI/Product/GetAttractions", 'GET', params)
            .then(function(data){
                var aData = data.data;
                for (var i=0; i<aData.length; i++){
                    $scope.areaSelectList.push({
                        Name: aData[i].Name,
                        ID:aData[i].ID
                    })
                }
                defer.resolve($scope.areaSelectList)
            },function (error) {
                defer.reject(error);
                console("数据请求失败")
            });
        return defer.promise;
    }

    /**** 线路查询 ****/
    function getAllLine(param) {
        var defer = $q.defer();
        for (var key  in param) {
            if (param[key] === ''){
                delete param[key]
            }
        }
        $httpService.getData("/TicketAPI/GGBS/getReturnTicket","GET",param)
            .then(function (data) {
                defer.resolve(data.page.list)
            },function (error){
                defer.reject(error)
            });
        return defer.promise;
    }

    /**** 套票查询 ****/
    function GetTPList(data) {
        var defer = $q.defer();
        var param = {};
        if (data && data.siteID !== 0) {
            param.attractionsID = data.siteID;
        }
        if (data && data.areaID !== 0) {
            param.areaID = data.areaID;
        }
        param.btCode = 401;
        $httpService.getData("/TicketAPI/Product/GetPoductList","GET",param)
            .then(function (data) {
                var obj = data.data;
                for (var i = 0; i < obj.length; i++) {
                    obj[i].money = obj[i].minPrice;
                    obj[i].count = obj[i].uiLevel
                }
                defer.resolve(obj)
            },function (error){
                defer.reject(error)
            });
        return defer.promise;
    }

    /**** 销售量查询 ****/
    function getAllLineSales(obj){
        var defer = $q.defer();
        var objLenght = obj.length;
        for (var i = 0; i < objLenght; i++) {
            let item = obj[i];
            $httpService.getData("/TicketAPI/GGBS/getCountTourOrder","GET",{routeId: obj[i].id})
                .then(function (data) {
                    if (item.id === data.routeId) {
                        item.count = data.count;
                    }
                });
        }
        defer.resolve(obj);
        return defer.promise;
    }

    /**** 经过景区查询 ****/
    function getAllLineScenic(obj){
        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {
            let item = obj[i];
            $httpService.getData("/TicketAPI/GGBS/getLineSpot","GET",{routeId: obj[i].id})
                .then(function (data) {
                    item.scenicList = data.page.list;
                });
        }
    }

    /**** 线路时间查询 ****/
    function getScheduleTime(obj){
        var defer = $q.defer();
        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {
            let item = obj[i];
            $httpService.getData("/TicketAPI/GGBS/getRouteScheduleTime","GET",{routeId: obj[i].id})
                .then(function (data) {
                    if (data.page.list.length !== 0) {
                        item.scheduleTime = {
                            time:data.page.list[0].start_time,
                            possess: true
                        };
                    }else {
                        item.scheduleTime = {
                            time:"今日暂无班次",
                            possess: false
                        };
                    }
                });
        }

    }

    /******************  swiper 初始化  ********************/
    function swiperInit(){
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 4.5,
            spaceBetween: 5,
            freeMode: true,
        });
    }

    function initialize(){
        if ($scope.selectedSite){
            if ($scope.selectedSite.siteID !== 0) {
                $scope.destina.title = $scope.selectedSite.siteName;
            }else {
                $scope.destina.title = $scope.selectedSite.areaName;
            }
        }
    }

    /*** init ***/
    getdesRegionList().then(function (areaList) {
        getdesAttractList(areaList).then(function (data){
            $scope.checkedBou("site" ,$scope.selectedSite,$scope.selectedSite);
            swiperInit();
        });
        getThemeList();
        $scope.allLineParame.endAddress = $scope.selectedSite.areaName;
        $scope.allLineParame.spotName = $scope.selectedSite.siteName;
    });
    initialize();
    
    /***  设置filtrateOption的定位top值  ***/
    var filtrateItem = document.getElementsByClassName("filtrateItem");
    var filtrateItemH = angular.element(filtrateItem)[0].offsetHeight;
    $scope.filtrateOptionTop = {top:filtrateItemH + 1 + "px "};

    /****== 点击事件 ==****/
    $scope.checkedBou = function (bou,siteItem,areaItem) {
        scrollTo(0,0); // 回到顶部
        $scope.allLineParame.spotName = '';
        $scope.selectedSite.areaID = areaItem.areaID;
        $scope.selectedSite.areaName = areaItem.areaName;
        $scope.selectedSite.id = areaItem.id;
        $scope.destina.show = false;
        if (areaItem.areaID === 0) {
            $scope.destina.title = "目的地";
            getAllLine().then(function (obj) {
                $scope.allShuttle = [];
                getAllLineSales(obj).then(function (obj) {
                    $scope.allShuttle = obj;
                    $scope.lineTabLoading = false;
                });
            });
            GetTPList().then(function (obj) {
                $scope.TPlist = [];
                $scope.TPlist = obj;
            })

        }else {
            $scope.allLineParame.endAddress = areaItem.areaName;
            getAllLine($scope.allLineParame).then(function (obj) {
                $scope.allShuttle = [];
                getAllLineSales(obj).then(function (obj) {
                    $scope.allShuttle = obj;
                    $scope.lineTabLoading = false;
                });
            });
            if (bou === "area") {
                $scope.destina.title = areaItem.areaName;
                $scope.actionRegion.site = siteItem.id ? siteItem.id : areaItem.areaID + "-0";
                $scope.actionRegion.area = areaItem.id;
                $scope.selectedSite.siteID = 0;
                GetTPList($scope.selectedSite).then(function (obj) {
                    $scope.TPlist = [];
                    $scope.TPlist = obj;
                })
            }else {
                $scope.actionRegion.site = siteItem.id;
                $scope.destina.title = siteItem.siteID !== 0 ?  siteItem.siteName : areaItem.areaName;
                $scope.selectedSite.siteID = siteItem.siteID;
                $scope.selectedSite.siteName = siteItem.siteName;
                GetTPList($scope.selectedSite).then(function (obj) {
                    $scope.TPlist = [];
                    $scope.TPlist = obj;
                    $scope.lineTabLoading = false;
                })
            }
        }
        sessionStorage.setItem("currentSite",JSON.stringify($scope.selectedSite));

        /*$scope.allLineParame.endAddress = '';
        scrollTo(0,0); // 回到顶部
        $scope.allLineParame.spotName = '';
        $scope.selectedSite.areaID = areaItem.areaID;
        $scope.selectedSite.areaName = areaItem.areaName;
        $scope.selectedSite.id = areaItem.id;
        $scope.actionRegion.area = areaItem.id;
        $scope.destina.show = false;
        if (areaItem.areaID === 0) {
            $scope.destina.title = "目的地";
            getAllLine().then(function (obj) {
                $scope.allShuttle = [];
                getAllLineSales(obj).then(function (obj) {
                    $scope.allShuttle = obj;
                    $scope.lineTabLoading = false;
                });
            });
            GetTPList().then(function (obj) {
                $scope.TPlist = [];
                $scope.TPlist = obj;
            })
        }else {
            $scope.allLineParame.endAddress = areaItem.areaName;
            $scope.destina.title = areaItem.areaName;
            getAllLine($scope.allLineParame).then(function (obj) {
                $scope.allShuttle = [];
                getAllLineSales(obj).then(function (obj) {
                    $scope.allShuttle = obj;
                    $scope.lineTabLoading = false;
                });
            });
            GetTPList($scope.selectedSite).then(function (obj) {
                $scope.TPlist = [];
                $scope.TPlist = obj;
            })
        }
        sessionStorage.setItem("currentSite",JSON.stringify($scope.selectedSite));*/
    };
    $scope.closeMask = function () {
        $scope.destina.show = false;
        $scope.sorting.show = false;
        $scope.classify.show = false;
    }
    $scope.lineDetails = function (data) {
        sessionStorage.setItem("lineDetails",JSON.stringify(data));
    };
    $scope.TicketList = function (data){
        sessionStorage.setItem("productUiCode",JSON.stringify(data));
    }
    $scope.filtrateList = function (key, bool,id){
        scrollTo(0,0); // 回到顶部
        $scope.filtrateSelect = id;
        $scope.filtrate.key = key;
        $scope.filtrate.order = bool;
        $scope.sorting.show = false
    };
    /*$scope.ticketType = function(type){
        if (type ===0) {
            $scope.allLineParame.returnTicket = '';
        }else {
            $scope.allLineParame.returnTicket = type;
        }
        $scope.ticketTypeAct = type;
        getAllLine($scope.allLineParame).then(function (obj) {
            $scope.allShuttle = [];
            getAllLineSales(obj).then(function (obj) {

                $scope.allShuttle = obj;
                $scope.lineTabLoading = false;
            });
        });
    };*/
    $scope.themeListSelect = function(themeId){
        let incloud = $scope.themeListParame.includes(themeId);
        if (incloud) {
            let indexs = $scope.themeListParame.indexOf(themeId);
            $scope.themeListParame.splice(indexs,1)
        }else {
            $scope.themeListParame.push(themeId)
        }
    };
    $scope.clearThemeList = function(){
        $scope.themeListParame = [];
    };
    $scope.achieveThemeList = function(){
        scrollTo(0,0);
        $scope.lineTabLoading = true;
        $scope.allShuttle = [];
        $scope.actionRegion ={
            area: "0-0",
            site: ""
        };
        $scope.destina.title = "目的地";
        getAttractions().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                $scope.allLineParame = {
                    spotName: data[i].Name
                };
                getAllLine($scope.allLineParame).then(function (obj) {
                    getAllLineSales(obj).then(function (obj) {
                        $scope.allShuttle = $scope.allShuttle.concat(obj);
                    });
                });
                GetTPList($scope.selectedSite).then(function (obj) {
                    $scope.TPlist = [];
                    $scope.TPlist = obj;
                })
            }
            $scope.lineTabLoading = false;
        });
        $scope.classify.show = false
    };
});

travelControls.controller("directTrainDetail",function ($q, $rootScope, $scope, $stateParams, $state,$http, $httpService,$uibModal,$location,Md5 ) {
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

    $scope.currentTabs = 0;
    $scope.routeId = {routeId:$stateParams.routeId};
    var bookingInform = document.getElementById("bookingInform"),
         productFeature = document.getElementById("productFeature");
    /**** 获取线路详情 ****/
    function  getLineDetails(){
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/GGBS/getRouteInfo","GET",$scope.routeId)
            .then(function (data) {
                var bookingInformText = data.route.cost_remark,
                    productFeatureText = data.route.remark;
                angular.element(bookingInform).html(bookingInformText);
                angular.element(productFeature).html(productFeatureText);
                defer.resolve(data.route)
            },function (error){
                defer.reject(error)
            })
        return defer.promise;
    }

    /**** 获取行程景点 ****/
    function getAllLineScenic(){
        $httpService.getData("/TicketAPI/GGBS/getLineSpot","GET",$scope.routeId)
            .then(function (data) {
                $scope.allShuttleScenic = data.page.list;
            });
    }

    /**** 获取当前时间 yymmddhhmmss *****/
    function currentTime(){
        let newDate = new Date(),
            year = newDate.getFullYear(),
            month = (newDate.getMonth() + 1) <=9 ? "0"+ (newDate.getMonth() +1) : (newDate.getMonth() +1),
            day = newDate.getDate() <= 9 ? "0"+ newDate.getDate() : newDate.getDate(),
            h = newDate.getHours() <=9 ? "0"+ newDate.getHours() : newDate.getHours(),
            m = newDate.getMinutes() <=9 ? "0"+ newDate.getMinutes() : newDate.getMinutes(),
            s = newDate.getSeconds() <=9 ? "0"+ newDate.getSeconds() : newDate.getSeconds();
        return year + month + day + h + m + s
    }

    $scope.changeTap = function (event){
        $scope.currentTabs = parseInt(event.target.getAttribute('data-id'));
    };

    $scope.trainDetailsParams = function () {
        if ($rootScope.isApp) {
            var isLogin = backJSAction.isLogin();
            if (isLogin) {
                $scope.getSign = backJSAction.getSign();
                $scope.getUserInfo = backJSAction.getUserInfo();
                var aData = {
                    title: $scope.trainDetails.title,
                    end_address: $scope.trainDetails.end_address,
                    start_address: $scope.trainDetails.start_address,
                    id: $scope.trainDetails.id,
                    money: $scope.trainDetails.money,
                    getSign: JSON.parse($scope.getSign),
                    getUserInfo: JSON.parse($scope.getUserInfo)
                };
                $state.go("specialPayment",{"TrainDetails": aData });
                sessionStorage.setItem("TrainDetails",JSON.stringify(aData));
            }else {
                backJSAction.toLogin();
            }
        }else {
            sessionStorage.setItem("url",$location.absUrl());
            $http({
                url: "/checkLogined",
                method: "GET",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
                timeout: 5000,
            }).success(function (response) {
                if (response.success) {
                    let aData = {
                        title: $scope.trainDetails.title,
                        end_address: $scope.trainDetails.end_address,
                        start_address: $scope.trainDetails.start_address,
                        id: $scope.trainDetails.id,
                        money: $scope.trainDetails.money,
                    };
                    $state.go("specialPayment",{"TrainDetails": aData });
                    sessionStorage.setItem("TrainDetails",JSON.stringify(aData));
                }else {
                    window.location.href = "http://wechat.glchuxingwang.com/loginView?pamUrl="+ encodeURIComponent($location.path());
                }
            })
        }


    };
    $scope.callCustomerPhone = function ()  {
        backJSAction.callCustomerPhone();
    }

    $scope.$watch('$routeChangeSuccess',function () {
        getLineDetails().then(function (data) {
            $scope.trainDetails = data;
            getAllLineScenic();
            $rootScope.pageTitle = data.title;
            backJSAction.setPageTitle(data.title);
        });
    })
});


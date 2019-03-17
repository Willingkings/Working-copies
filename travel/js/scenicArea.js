
var scenicAreaControls = angular.module("scenicAreaControls",[]);

scenicAreaControls.controller("scenicAreaControl",function ($q, $scope, $stateParams, $state, $httpService) {

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

    /**** 业务类型列表 ****/
    var imgList = ["./images/icon/icon-ticket.png", "./images/icon/icon-impression.png", "./images/icon/icon-cruiseShip.png", "./images/icon/icon-hotel.png"];
    function getBussinessList(){
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/Product/GetBussinessList","GET")
            .then(function (data) {
                $scope.bussinessList = data.data;
                for (var i = 0; i < data.data.length; i++) {
                    $scope.bussinessList[i].imgs = imgList[i]
                }
                defer.resolve($scope.bussinessList)
            },function (error) {
                defer.reject(error)
            });
        return defer.promise;
    }

    function getAttractions(){
        var params = {
            areaID: $scope.currentRegion.ID,
            isHot: 1,
            topNum: 4
        };
        $httpService.getData("/TicketAPI/Product/GetAttractions", 'GET',params)
            .then(function(data){
                $scope.selectArea = data.data;
            },function (data) {
                console.log("数据请求失败")
            });
        /**** sweper 初始化 ****/
        var swiper =new Swiper('.swiper-container',{
            initialSlide: 0,
            slidesPerView: "auto",
            freeMode: true,
            freeModeMomentum: false,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,//修改swiper的父元素时，自动初始化swiper
        });
    }


    /**** 选定景区全部景点 ****/
    $scope.currentScenic = function (num,data) {
        switch (num) {
            case "all":
                var aData = {
                    id: "0-0",
                    areaID: 0,
                    siteName: "目的地",
                };
                // $state.go("travelScenicAreaList",{"scenicSelect": aData});
                sessionStorage.setItem("scenicSelect",JSON.stringify(aData));
                break;
            case "scenic":
                sessionStorage.setItem("areaDetailsID",JSON.stringify(data));
                break;
            default:
                var aData = {
                    btCode: data.btCode,
                    btName: data.btName
                };
                // $state.go("travelScenicAreaList",{"scenicSelect": aData});
                sessionStorage.setItem("scenicSelect",JSON.stringify(aData));
        }
    };

    getAttractions();

    /**** 选定业务推荐产品Tab ****/
    $scope.focusIndex = 0;
    function currentGetPoductList(obj) {
        for (var i = 0; i < obj.length; i++){
            (function (i) {
                var params = {
                    btCode: obj[i].btCode,
                    currentPage: 1,
                };
                var temporaryIt = obj[i];
                $httpService.getData("/TicketAPI/Product/GetPoductList", "GET", params)
                    .then(function (data) {
                        var aData = data.data;
                        temporaryIt.currentPoduct = [];
                        for (var j = 0; j < aData.length; j++) {
                            temporaryIt.currentPoduct.push({
                                name: aData[j].uiName,
                                beforeDays: aData[j].BeforeDays,
                                row: aData[j].Row,
                                label: aData[j].ThemeName ? aData[j].ThemeName.split(",") : null,
                                allTicket: aData[j].allTicket,
                                attractionsID: aData[j].attractionsID,
                                btCode: aData[j].btCode,
                                price: aData[j].minPrice,
                                imgUrl: aData[j].newUILogoURL,
                                uiCode: aData[j].uiCode
                            });
                        }
                    });
            }(i))

        }
    }

    $scope.headerFocus = function (index) {
        $scope.focusIndex = index;
    };

    getBussinessList().then(function (data) {
        currentGetPoductList(data);
    })
});

scenicAreaControls.controller("travelScenicAreaList",function ($sce,$q, $scope,$httpService,$state, $stateParams) {

    /************************************************* 获取DOM对象 ***************************************************/
    var Body = document.querySelector("body");                                  // 获取body
    var city = document.querySelector('.conditionRight');                      // 获取地区景点名
    var optionTop = document.querySelectorAll(".condition > ul > li");        // 获取导航顶部选项
    var optionTopi = document.querySelectorAll(".condition > ul > li > i");   // 获取导航顶部选项小三角


    /*************************************************** 定义变量 *****************************************************/

    $scope.allDataAlike = false;
    var eliminate = false;                                      // 筛选主题选项确认按钮是否加载全部内容
    $scope.entireText = "全部";                                 // 定义初始化顶部导航栏全部选项文字
    $scope.pullDownText = "目的地";                             // 定义初始化顶部导航栏目的地选项文字
    $scope.priceArr = ["销量最高", "价格最高", "价格最低"];     // 定义导航优先排序选项下拉列表选项
    $scope.parameterStr = [];                                   // 定义筛选下拉框主题选项被选择的主题为空
    $scope.scenicSel = {
        btCode : $stateParams.btCode,
        btName: ""
    };

    /************************************************** 数据请求方法 **************************************************/

    // 全部景区列表数据
    function getUserData(){
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/Product/GetAttractions","GET")
            .then(function (data) {
                scrollTo(0,0); // 回到顶部
                $scope.AlluserData = data.data;
                $scope.userData = data.data;
                $scope.ThemeName = [];  // 定义景区列表显示的主题为空
                for(var i = 0; i < $scope.userData.length; i++){
                    var html1 = $sce.trustAsHtml( '<span>推荐语：</span>' +  $scope.AlluserData[i].Remart);
                    $scope.userData[i].Remart = html1;
                    // 判断景区列表数据的主题是否为null
                    if($scope.userData[i].ThemeName != null){
                        // 不为null时将主题数据以，分割形式转化为数组并添加到景区列表主题数据里
                        $scope.ThemeName.push($scope.userData[i].ThemeName.split(","));
                    } else {
                        // 为null时景区列表主题显示为空
                        $scope.ThemeName.push([]);
                    }
                }
            },function (error){
                defer.reject(error)
            });
        return defer.promise;
    }
    // 业务类型数据
    function getBusinessTypeData(){
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/Product/GetBussinessList","GET")
            .then(function (data) {
                $scope.BusinessTypeData = data.data;
                for (var i = 0; i < data.data.length; i++) {
                    if ($stateParams.btCode != null && data.data[i].btCode == $stateParams.btCode){
                        $scope.scenicSel.btName = data.data[i].btName;
                        $scope.entireText = data.data[i].btName;
                    }
                }
            },function (error){
                defer.reject(error)
            });
        return defer.promise;
    }
    // 业务类型对应的景区列表数据
    function getPoductData(num) {
        var defer = $q.defer();
        // 传入产品类型参数 btCode: 对应的业务类型景区数据
        var params = { btCode:  num};
        var PoductData = [];    // 定义数组传入业务类型景区数据
        $httpService.getData("/TicketAPI/Product/GetPoductList", "GET", params)
            .then(function (data) {
                scrollTo(0,0); // 回到顶部
                var NewData = data.data;
                for (var i = 0; i < NewData.length; i++){
                    var html1 = $sce.trustAsHtml( '<span>推荐语：</span>' +  NewData[i].uiIntroduction);
                    NewData[i].uiIntroduction = html1;
                    PoductData.push({
                        ID: NewData[i].attractionsID,
                        ImgUrl: NewData[i].newUILogoURL,
                        Name: NewData[i].uiName,
                        AreaName: NewData[i].uiAreaCity,
                        pFXPrice: NewData[i].minPrice,
                        OrderCount: NewData[i].allTicket,
                        CreateTime: NewData[i].uiBusinessHours,
                        Remart: NewData[i].uiIntroduction,
                        uiCode: NewData[i].uiCode
                    })
                }
                // 将数据赋予给景区列表显示
                $scope.userData = PoductData;
            },function (error){
                defer.reject(error)
            });
    }
    // 地区选项数据
    function getAreaData(num){
        var defer = $q.defer();
        var params = { isHot: num };
        $httpService.getData("/TicketAPI/Product/GetAreaNameList","GET", params)
            .then(function (data) {
                $scope.areaData = data.data;
            },function (error){
                defer.reject(error)
            });
        return defer.promise;
    }
    // 地区对应数据
    function getAreaAffractionsData(ID){
        var defer = $q.defer();
        // 传入参数
        var params = { areaID: ID };
        $scope.AreaAffractionsData = [];
        // 获取地区对应的数据
        $httpService.getData("/TicketAPI/Product/GetAttractions", "GET", params )
            .then(function (data) {
                scrollTo(0,0); // 回到顶部
                var NewData = data.data;
                for (var i = 0; i < NewData.length; i++){
                    var html1 = $sce.trustAsHtml( '<span>推荐语：</span>' + NewData[i].Remart);
                    NewData[i].Remart = html1;
                    $scope.AreaAffractionsData.push({
                        ID: NewData[i].ID,
                        Name: NewData[i].Name,
                        AreaID: NewData[i].AreaID,
                        AreaName: NewData[i].AreaName,
                        ImgUrl: NewData[i].ImgUrl,
                        Grade: NewData[i].Grade,
                        pFXPrice: NewData[i].pFXPrice,
                        ThemeName: NewData[i].ThemeName,
                        CreateTime: NewData[i].CreateTime,
                        OrderCount: NewData[i].OrderCount,
                        Remart: NewData[i].Remart
                    })
                }
                $scope.userData = $scope.AreaAffractionsData;
                $scope.ThemeName = [];
                for(var i = 0; i < $scope.userData.length; i++) {
                    if($scope.userData[i].ThemeName != null){
                        $scope.userData[i].ThemeName = $scope.userData[i].ThemeName.split(",");
                        $scope.ThemeName.push($scope.userData[i].ThemeName);
                    } else {
                        $scope.ThemeName.push([]);
                    }
                }

            },function (error){
                defer.reject(error)
            });
    }
    // 筛选主题选项数据
    function getSubjectData(){
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/Product/GetThemeList","GET")
            .then(function (data) {
                $scope.subjectData = data.data;
                $scope.SubToLoad = true;
            },function (error){
                defer.reject(error)
            });
        return defer.promise;
    }
    // 筛选主题数据
    function  getThemeData(num){
        var defer = $q.defer();
        // 传入参数
        var params = { themeIDS: num};
        $scope.ThemeData = [];
        // 主题对应的数据
        $httpService.getData("/TicketAPI/Product/GetAttractions", "GET", params )
            .then(function (data) {
                scrollTo(0,0); // 回到顶部
                var NewData = data.data;
                for (var i = 0; i < NewData.length; i++) {
                    var html1 = $sce.trustAsHtml( '<span>推荐语：</span>' + NewData[i].Remart);
                    NewData[i].Remart = html1;
                    $scope.ThemeData.push({
                        ID: NewData[i].ID,
                        AreaID: NewData[i].AreaID,
                        Name: NewData[i].Name,
                        AreaName: NewData[i].AreaName,
                        ImgUrl: NewData[i].ImgUrl,
                        Grade: NewData[i].Grade,
                        pFXPrice: NewData[i].pFXPrice,
                        OrderCount: NewData[i].OrderCount,
                        CreateTime: NewData[i].CreateTime,
                        ThemeName: NewData[i].ThemeName,
                        Remart: NewData[i].Remart
                    })
                }
                $scope.userData = $scope.ThemeData;
                $scope.ThemeName = [];
                for(var i = 0; i < $scope.userData.length; i++) {
                    if($scope.userData[i].ThemeName != null){
                        $scope.userData[i].ThemeName = $scope.userData[i].ThemeName.split(",");
                        $scope.ThemeName.push($scope.userData[i].ThemeName);
                    } else {
                        $scope.ThemeName.push([]);
                    }
                }
            },function (error){
                defer.reject(error)
            });
    }

    /***************************************************** 方法 ******************************************************/

    // 顶部导航打开时添加class改变样式
    function navigationAddClass(obeject1,obeject2,i) {
        obeject1.forEach(function(value,index) {
            obeject1[index].className = "";                                              // 清除顶部导航栏全部文字的样式
            obeject2[index].className = "glyphicon glyphicon-triangle-bottom";       // 清除顶部导航栏全部三角的样式
        });
        Body.style.overflow = "hidden";                                                 // 使用户无法滚动内容
        obeject1[i].className = "onRotate";                                             // 点击导航栏文字对应对象添加样式
        obeject2[i].className = "onRotate glyphicon glyphicon-triangle-bottom";     // 点击导航栏三角对应对象添加样式
    }
    // 顶部导航关闭时删除class改变样式
    function navigationDelClass(obeject1,obeject2,i) {
        Body.style.overflow = "";                                                       // 使用可以滚动内容
        obeject1[i].className = "";                                                     // 点击导航栏文字对应对象清除样式
        obeject2[i].className = "glyphicon glyphicon-triangle-bottom";              // 点击导航栏三角对应对象清除样式
    }
    // 销量从大到小排序
    function SellBigToSmall(Arr) {
        for(var i = 0;i < Arr.length; i++){
            for(var j = i + 1; j < Arr.length; j++){
                if(Arr[i].OrderCount < Arr[j].OrderCount){
                    var tmp = Arr[i];
                    Arr[i] = Arr[j];
                    Arr[j] = tmp;
                }
            }
        }
    }
    // 价格从大到小排序
    function PriceBigToSmall(Arr) {
        for(var i = 0;i < Arr.length; i++){
            for(var j = i + 1; j < Arr.length; j++){
                if(Arr[i].pFXPrice < Arr[j].pFXPrice){
                    var tmp = Arr[i];
                    Arr[i] = Arr[j];
                    Arr[j] = tmp;
                }
            }
        }
    }
    // 价格从小到大排序
    function PriceSmallToBig(Arr) {
        for(var i = 0;i < Arr.length; i++){
            for(var j = i + 1; j < Arr.length; j++){
                if(Arr[i].pFXPrice > Arr[j].pFXPrice){
                    var tmp = Arr[i];
                    Arr[i] = Arr[j];
                    Arr[j] = tmp;
                }
            }
        }
    }
    // 清空导航栏下拉框所以选定数据
    function EmptyData() {
        var entireLi = document.querySelectorAll(".entire > span");               // 业务类型列表
        var conditionLi = document.querySelectorAll(".conditionLeft > li");      // 目的地列表
        var priceSalesLi = document.querySelectorAll(".priceSales > ul > li");   // 销量列表
        var topicFilterBox = document.querySelectorAll(".filtrateType span");    // 主题筛选列表
        $scope.entireText = "全部";                                                // 改变成全部
        $scope.pullDownText = "目的地";                                            // 改变完成目的地
        $scope.parameterStr = [];                                                  // 定义筛选下拉框主题选项被选择的主题为空
        eliminate = false;                                                          // 筛选主题选项确认按钮不加载全部内容
        priceSalesLi.forEach(function (item, index) {
            priceSalesLi[index].className = "";
        });
        conditionLi.forEach(function (item, index) {
            conditionLi[index].className = "";
        });
        entireLi.forEach(function (item, index) {
            entireLi[index].className = "";
        });
        topicFilterBox.forEach(function (vule) {
            vule.className = ""
        });
    }
    // 筛选清空其他导航数据
    function EmptyThemeData() {
        var entireLi = document.querySelectorAll(".entire > span");               // 业务类型列表
        var conditionLi = document.querySelectorAll(".conditionLeft > li");      // 目的地列表
        var priceSalesLi = document.querySelectorAll(".priceSales > ul > li");   // 销量列表
        $scope.entireText = "全部";                                                 // 改变成全部
        $scope.pullDownText = "目的地";                                            // 改变完成目的地
        priceSalesLi.forEach(function (item, index) {
            priceSalesLi[index].className = "";
        });
        conditionLi.forEach(function (item, index) {
            conditionLi[index].className = "";
        });
        entireLi.forEach(function (item, index) {
            entireLi[index].className = "";
        });
    }
    // 点击清除同类其他对象添加点击对象class obj: 对象， index: 点击对象的索引， cls: class
    function BtnClass(obj, index, cls) {
        obj.forEach(function (item, index) {
            obj[index].className = "";
        });
        obj[index].className= cls;
    }

    /************************************************* 获取跳转对象 ***************************************************/

    // 获取跳转参数缓存
    $scope.areaSelect = $scope.areaSelect != null ? $stateParams.scenicSelect : JSON.parse(sessionStorage.getItem('scenicSelect'))  == null ? $scope.scenicSel : JSON.parse(sessionStorage.getItem('scenicSelect')) ; // 业务参数+缓存
    $scope.areaDataID = JSON.parse(sessionStorage.getItem('areaData'));             // 地区缓存
    $scope.themeIDS = JSON.parse(sessionStorage.getItem('themeIDS'));   // 主题缓存
    /************************************************ 初始化加载页面 **************************************************/
    // 判断是否有业务参数或缓存
    if($scope.areaSelect != null) {
        if ($scope.areaSelect.siteName == "目的地") {
            $scope.entireText = "全部";
            getUserData();                      // 获取全部景区数据
            $scope.allDataAlike = true;       // 判断已是全部内容;
        } else {
            getBusinessTypeData()        // 获取业务类型
            $scope.entireText = $scope.areaSelect.btName;    // 赋值业务类型文字
            getPoductData($scope.areaSelect.btCode);          // 获取业务类型数据
            var TypeDatatimeMin = 0;                            // 定义秒数为0
            var TypeDatatime = setInterval(function(){
                TypeDatatimeMin++;  // 秒数自增
                if ($scope.BusinessTypeData != false) {
                    var entireLi = document.querySelectorAll(".entire > span");  // 获取全部子类
                    for(var i = 0; i < entireLi.length; i++) {
                        // 判断点击跳转文字与业务类型文字相同的添加class
                        if(entireLi[i].innerHTML == $scope.areaSelect.btName) {
                            entireLi[i].className = "CheckedBtn";
                        }
                    }
                    clearInterval(TypeDatatime);        // 获取到删除定时器
                } else {
                    // 秒数为5秒时删除定时器
                    if(TypeDatatimeMin == 5) {
                        clearInterval(TypeDatatime);    // 超过5秒删除定时器
                    }
                }
            },1000);
            $scope.allDataAlike = false;              // 判断是否已经是全部内容;
        }
    } else if ($scope.areaDataID != null){
        getAreaData()                                              // 获取地区数据
        getAreaAffractionsData($scope.areaDataID.ID);              // 获取地区对应的列表
        $scope.pullDownText = $scope.areaDataID.Name;              // 赋值地区文字
        var TypeDatatimeMin = 0;                                   // 定义秒数为0
        var TypeDatatime = setInterval(function(){
            TypeDatatimeMin++;  // 秒数自增
            if ($scope.AreaData != false) {
                var conditionLi = document.querySelectorAll(".conditionLeft > li");     // 获取全部子类
                for(var i = 0; i < conditionLi.length; i++) {
                    // 判断点击跳转文字与业务类型文字相同的添加class
                    if(conditionLi[i].innerHTML == $scope.areaDataID.Name) {
                        conditionLi[i].className = "CheckedBtn";
                    }
                }
                clearInterval(TypeDatatime);        // 获取到删除定时器
            } else {
                // 秒数为5秒时删除定时器
                if(TypeDatatimeMin == 5) {
                    clearInterval(TypeDatatime);    // 超过5秒删除定时器
                }
            }
        },1000);
        $scope.allDataAlike = false;              // 判断是否已经是全部内容;
    } else if ($scope.themeIDS != null) {
        getThemeData($scope.themeIDS.themeIDS);
    } else  {
        getUserData();  // 获取全部数据
    }

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

    /*************************************************** 点击事件 *****************************************************/

    /********* 返回按钮 *********/
    $scope.getBack = function () {
        history.go(-1);
    }

    /******* 导航全部部分 *******/
    // 顶部导航全部按钮点击事件
    $scope.entire = function (i) {                      // 筛选下拉框消失
        // // 判断点击导航目的地时下课了是出现还是消失
        if($scope.entireShow) {
            navigationAddClass(optionTop,optionTopi,0)
        }else {
            navigationDelClass(optionTop,optionTopi,0)
        }
        // 判断是否已经加载过业务类型数据
        if ($scope.BusinessTypeData == null) {
            getBusinessTypeData();                    // 获取业务数据
        }
    };
    // 全部下拉框业务类型按钮点击事件
    $scope.entireBtn = function (i) {
        EmptyData();                                                         // 清空导航栏数据
        $scope.areaNewName = null;                                          // 清空目的地已选择选项
        $scope.entireShow = !$scope.entireShow;                              // 点击业务类型下拉框消失
        $scope.entireText = $scope.BusinessTypeData[i].btName;               // 点击将业务类型文字赋值
        navigationDelClass(optionTop,optionTopi,0);                          // 顶部导航[全部]关闭时删除class改变样式
        // 赋值点击索引
        var index = i;
        // 判断现在点击选项文字和目前的选项文字不相同实行
        if($scope.BusinessTypeData[index].btName != $scope.NewName) {
            getPoductData($scope.BusinessTypeData[index].btCode);           // 获取业务类型对应的景区列表数据
            var aData = {
                btCode: $scope.BusinessTypeData[index].btCode,
                btName: $scope.BusinessTypeData[index].btName
            };
            sessionStorage.setItem("scenicSelect",JSON.stringify(aData));
            sessionStorage.removeItem('areaData');
            sessionStorage.removeItem('themeIDS');
            var entireLi = document.querySelectorAll(".entire > span");   // 获取业务类型子类
            index++;                                                        // 因为不包括全部选项, 开头索引为 i + 1
            BtnClass(entireLi, index, "CheckedBtn");                       // 点击清除同类其他对象添加点击对象class
            $scope.lozy();                                                   // 懒加载
        }
        $scope.NewName = $scope.BusinessTypeData[i].btName;               // 赋值目前点击的选项文字
        $scope.allDataAlike = false;                                     // 判断是否已经是全部内容
    };

    /******* 导航目的部分 *******/
    // 顶部导航目的地按钮点击事件
    $scope.pullDown = function () {                       // 筛选下拉框消失
        // 判断点击导航目的地时下拉框是出现还是消失
        if($scope.myVar) {
            navigationAddClass(optionTop,optionTopi,1)
        }else {
            navigationDelClass(optionTop,optionTopi,1)
        }
        // 判断是否已经加载过目的地数据
        if($scope.areaData == null) {
            getAreaData() // 获取地区数据
        }
    };
    // 目的地下拉框地点点击事件
    $scope.li_click = function (i,areaData) {
        EmptyData();                                          // 清空导航栏数据
        $scope.NewName = null;                               // 清空全部业务类型已选择选项
        $scope.myVar = !$scope.myVar;                        // 点击目的地下拉框消失
        navigationDelClass(optionTop,optionTopi,1);            // 顶部导航[全部]关闭时删除class改变样式
        $scope.pullDownText = $scope.areaData[i].Name;      // 点击改变目的地对应的文字
        var index = i;
        // 判断现在点击选项文字和目前的选项文字不相同实行
        if ($scope.areaNewName !== $scope.areaData[index].Name) {
            getAreaAffractionsData(areaData[index].ID);             // 获取地区对应的列表
            var aData = {
                ID: areaData[index].ID,
                Name: areaData[index].Name
            };
            sessionStorage.setItem("areaData",JSON.stringify(aData));
            sessionStorage.removeItem('scenicSelect');
            sessionStorage.removeItem('themeIDS');
            var conditionLi = document.querySelectorAll(".conditionLeft > li");     // 获取全部子类
            index++;                                                                    // 因为不包括全部选项, 开头索引为 i + 1
            BtnClass(conditionLi, index, "CheckedBtn");                                // 点击清除同类其他对象添加点击对象class
            $scope.lozy();                                                               // 懒加载
        }
        $scope.areaNewName = $scope.areaData[i].Name;                                 // 赋值目前点击的选项文字
        $scope.allDataAlike = false;                                                   // 判断是否已经是全部内容;
    };

    /******* 导航排序部分 *******/
    // 顶部导航排序优先按钮点击事件
    $scope.priceSales = function () {
        if($scope.Show) {
            navigationAddClass(optionTop,optionTopi,2);
        }else {
            navigationDelClass(optionTop,optionTopi,2);
        }
    }
    // 销量，价格高低按钮点击事件
    $scope.PriceSell = function (i) {
        scrollTo(0,0); // 回到顶部
        $scope.Show = false
        // 判断点击导航优先排序时下拉框是出现还是消失
        if($scope.Show) {
            navigationAddClass(optionTop,optionTopi,2)
        }else {
            navigationDelClass(optionTop,optionTopi,2)
        }
        // 判断为0：销量最高, 1: 价格最高, 2: 价格最低
        if(i == 0) {
            SellBigToSmall($scope.userData);
        } else if(i == 1) {
            PriceBigToSmall($scope.userData);
        } else {
            PriceSmallToBig($scope.userData);
        }
        var priceSalesLi = document.querySelectorAll(".priceSales > ul > li");  // 获取全部子类

        BtnClass(priceSalesLi, i, "CheckedBtn");                                  // 点击清除同类其他对象添加点击对象class
        priceSalesLi.forEach(function (item, index) {
            priceSalesLi[index].className = "";
        });
        priceSalesLi[i].className="CheckedBtn";
        $scope.lozy();
    }

    /******* 导航筛选部分 *******/
    // 顶部导航筛选按钮点击事件
    $scope.screenOn = function () {
        if($scope.hide) {
            navigationAddClass(optionTop,optionTopi, 3);
        }else {
            navigationDelClass(optionTop,optionTopi, 3);
        }
        // 判断是否加载过筛选选项数据
        if($scope.subjectData == null) {
            getSubjectData(); // 获取筛选选项数据
        }
    };
    // 筛选下拉框主题点击事件
    $scope.typeOn = function (i) {
        var topicFilterBox = document.querySelectorAll(".filtrateType span");       // 获取主题筛选列表
        // 判断筛选下拉框主题选项里面是否有用户点击的选项
        if($scope.parameterStr.indexOf($scope.subjectData[i].ID) == -1){
            $scope.parameterStr.push($scope.subjectData[i].ID);    // 添加选项
            topicFilterBox[i].className = "typeOnClass";            // 添加class
        } else {
            $scope.parameterStr.splice($scope.parameterStr.indexOf($scope.subjectData[i].ID),1);    // 移除选项
            topicFilterBox[i].className = "";                                                           // 添加class
        }
    };
    // 筛选下拉框主题清除点击事件
    $scope.clear = function (i) {
        $scope.parameterStr = [];                                               // 清除筛选下拉框主题选项
        var topicFilterBox = document.querySelectorAll(".filtrateType span"); // 获取主题筛选列表
        topicFilterBox.forEach(function (vule) {
            vule.className = ""                                                 // 清除主题筛选列表所有class
        });
        eliminate = true;                                                        // 筛选主题选项确认按钮要加载全部内容
    };
    // 筛选下拉框主题确认点击事件
    $scope.affirm = function () {
        EmptyThemeData();                                   // 筛选清空其他导航数据
        $scope.areaNewName = null;                         // 清空目的地已选择选项
        $scope.NewName = null;                             // 清空全部业务类型已选择选项
        $scope.hide = !$scope.hide;                        // 筛选下拉框消失或出现
        navigationDelClass(optionTop,optionTopi,3);
        var str = $scope.parameterStr;                    // 获取用户下拉框主题选项
        // 判断选项为空时或eliminat==true加载全部内容
        if (str == [] || eliminate == true) {
            getUserData();                 // 获取全部内容
            $scope.lozy();                 // 懒加载
        } else {
            $scope.parameterStr = $scope.parameterStr.join(",");        // 转换为字符串
            getThemeData($scope.parameterStr);                           // 获取筛选后的列表数据
            var aData = {
                themeIDS: $scope.parameterStr
            }
            sessionStorage.setItem("themeIDS",JSON.stringify(aData));
            sessionStorage.removeItem('scenicSelect');
            sessionStorage.removeItem('areaData');
            $scope.allDataAlike = false;                                 // 判断不是全部内容
            $scope.lozy();                                                 // 懒加载
        }
        $scope.parameterStr = str;       // 保存用户下拉主题选项
        $scope.allDataAlike = false;    // 判断是否已经是全部内容;
    };

    /******* 共同点击部分 *******/
    // 点击全部按钮获取全部数据
    $scope.allData = function(){
        EmptyData();                      // 清空导航栏数据
        $scope.areaNewName = null;      // 清空目的地已选择选项
        $scope.NewName = null;           // 清空全部业务类型已选择选项
        navigationDelClass(optionTop,optionTopi, 0);
        navigationDelClass(optionTop,optionTopi, 1);
        navigationDelClass(optionTop,optionTopi, 2);
        navigationDelClass(optionTop,optionTopi, 3);
        sessionStorage.removeItem('scenicSelect');
        sessionStorage.removeItem('areaData');
        sessionStorage.removeItem('themeIDS');
        if($scope.allDataAlike == false) {
            $scope.allDataAlike = true;
            getUserData();  // 获取全部数据
            $scope.lozy();  // 懒加载
        }
    };
    // 阴影点击
    $scope.ShadowBtn = function () {
        navigationDelClass(optionTop,optionTopi, 0);
        navigationDelClass(optionTop,optionTopi, 1);
        navigationDelClass(optionTop,optionTopi, 2);
        navigationDelClass(optionTop,optionTopi, 3);
    }

    /***** 景区列表点击部分 *****/
    // 列表跳转传参
    $scope.skip = function (i, data) {
        if(data[i].uiCode != undefined) {
            $state.go("scenicAreaTicket",{ productUiCode: data[i].uiCode });
        } else {
            // 传递参数
            var aData = {
                areaID: data[i].AreaID,
                areaName: data[i].AreaName,
                siteID: data[i].ID,
                siteName: data[i].Name
            }
            $state.go("scenicAreaDetails",{ areaDetails: data[i].ID });
            sessionStorage.setItem("scenicAreaDetails",JSON.stringify(aData));
        }
    };

});

scenicAreaControls.controller("scenicAreaDetails",function ($q, $rootScope, $scope, $httpService, $state, $stateParams,$location,$anchorScroll) {
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

    // 点击更多门票
    $scope.ShowNum = 3
    $scope.OpenMore = function() {
        $scope.ShowNum += 3
    }
    // 点击收起门票
    $scope.packUpMore = function() {
        $scope.ShowNum = 3
    }


    $scope.attractionsID = $stateParams.areaDetails;
    $scope.bussinessList = [];
    /**** 获取业务类型 ****/
    function getBussinessList(){
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/Product/GetBussinessList","GET")
            .then(function (data) {
                $scope.bussinessList = data.data;
                defer.resolve($scope.bussinessList)
            },function (error) {
                defer.reject(error)
            });
        return defer.promise;
    }

    /**** 获取产品列表、详情 ****/
    function getProductList(obj,siteID){

        for (var i = 0; i < obj.length; i++) {
            (function (i) {
                var params = {
                    btCode: obj[i].btCode,
                    attractionsID:siteID
                };
                var item = obj[i];
                $httpService.getData("/TicketAPI/Product/GetPoductList","GET",params)
                    .then(function (data) {
                        item.productList = data.data;
                    })
            }(i))
        }
    }

    getBussinessList().then(function (data) {
        getProductList(data,$scope.attractionsID);
    });

    $scope.areaTabIndex = 0;

    $scope.scrollSpies = function(id) {
        $scope.areaTabIndex = id;
        $location.hash(id);
        $anchorScroll();
    };

    $scope.goTicketList = function (data){
        sessionStorage.setItem("productUiCode",JSON.stringify(data));
    }

    /************************************************** 图片懒加载 ****************************************************/
    $scope.lozy = function () {
        $scope.timeM = 1;
        var time = setInterval(function(){
            $scope.timeM++;
            // 懒加载图片方法
            var aImg = document.querySelectorAll("img[guoyu-src]"); // 等HTML加载完毕获取图片对象
            if(aImg.length != false) {
                for (var i = 0; i < aImg.length; i++) {
                    aImg[i].src = aImg[i].getAttribute('guoyu-src');
                }
                clearInterval(time);
            }else {
                if($scope.timeM == 5) {
                    clearInterval(time);
                }
            }
        },1000);
    };
    $scope.lozy();

    $scope.$watch('$routeChangeSuccess',function (event, newUrl, currentUrl) {
        $httpService.getData("/TicketAPI/Product/GetAttractions","GET",{id:$scope.attractionsID})
            .then(function (data) {
                $scope.productTitle = data.data;
                $rootScope.pageTitle = data.data.Name;
                backJSAction.setPageTitle(data.data.Name);
            });
        wx.ready(function() {
            var links = window.location.href;
            wx.onMenuShareTimeline({
                title: $rootScope.pageTitle, // 分享标题
                link: links, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'http://wechat.glchuxingwang.com/travel/images/icon/shareLogo.png', // 分享图标
                success: function () {
                    // 用户点击了分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: $rootScope.pageTitle, // 分享标题
                desc: $rootScope.pageTitle, // 分享描述
                link: links, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'http://wechat.glchuxingwang.com/travel/images/icon/shareLogo.png', // 分享图标
                success: function () {
                    // 用户点击了分享后执行的回调函数
                }
            });
        });
    })

});

scenicAreaControls.controller("scenicAreaTicket",function ($q, $rootScope,$scope, $http,$httpService,$state, $stateParams, $sce, $uibModal, $location) {
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
    $scope.productUiCode = $stateParams.productUiCode;
    $scope.ticketList = [];
    /**** 获取景点详情 ****/
    function getProductDet(data){
        var params = {
            uiCode: data
        }
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/Product/GetPoductList","GET", params)
            .then(function (data) {
                defer.resolve(data.data)
            },function (error) {
                defer.reject(error)
            });
        return defer.promise;
    }
    /**** 获取票务种类 ****/
    function getTicketList(data){
        var params = {
            uiCode: data
        }
        var defer = $q.defer();
        $httpService.getData("/TicketAPI/Product/GetProductDetailList","GET", params)
            .then(function (data) {
                defer.resolve(data.data)
            },function (error) {
                defer.reject(error)
            });
        return defer.promise;
    }
    
    /**** 获取当前时间 yymmddhhmmss *****/
    function currentTime(){
        var newDate = new Date(),
            year = newDate.getFullYear(),
            month = (newDate.getMonth() + 1) <=9 ? "0"+ (newDate.getMonth() +1) : (newDate.getMonth() +1),
            day = newDate.getDate() <= 9 ? "0"+ newDate.getDate() : newDate.getDate(),
            h = newDate.getHours() <=9 ? "0"+ newDate.getHours() : newDate.getHours(),
            m = newDate.getMinutes() <=9 ? "0"+ newDate.getMinutes() : newDate.getMinutes(),
            s = newDate.getSeconds() <=9 ? "0"+ newDate.getSeconds() : newDate.getSeconds();
        return year + month + day + h + m + s
    }
    
    /**** init ****/
    getTicketList($scope.productUiCode).then(function (data) {
        for (var i = 0; i < data.length; i++) {
            $scope.ticketList.push({
                id: data[i].pKey,
                title: data[i].pName,
                type: data[i].ptName,
                price: data[i].pSalePrice,
                pTicketPrice: data[i].pTicketPrice,
                saleCount: data[i].saleCount,
                pBuyType: data[i].pBuyType, // 0:没库存限制   ; 1:有库存限制
                psNums: data[i].psNums, // 库存数量
                pProductLinks: data[i].pProductLinks,  // 是否套票 pProductLinks =1 是套票
                GGBSLineIdS: data[i].GGBSLineIdS,  // =null 包含巴士县里 ,!=null不包含巴士线路id)
                BatchCount: data[i].BatchCount,    // 是否场次票,=0不是场次票,>0是场次票,整型字段
                pValiteDate: data[i].pValiteDate   // 有效天数
            })
        }
    });
    $scope.goSpecialPay = function (obj){
        if ($rootScope.isApp) {
            var isLogin = backJSAction.isLogin();
            if (isLogin) {
                $state.go("scenicAreaPay",{"ticketDetail": obj });
                sessionStorage.setItem("ticketDetails",JSON.stringify(obj));
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
                    $state.go("scenicAreaPay",{"ticketDetail": obj });
                    sessionStorage.setItem("ticketDetails",JSON.stringify(obj));
                }else {
                    var params = window.location.hash.substr(1);
                    window.location.href = "http://wechat.glchuxingwang.com/loginView?pamUrl="+ encodeURIComponent(params);
                }
            })
        }
    };
    $scope.bugFocusIndex = 0;
    $scope.bugTicketFocus = function (index) {
        $scope.bugFocusIndex = index;
    };
    $scope.$watch('$routeChangeSuccess',function () {
        getProductDet($scope.productUiCode).then(function (data) {
            $scope.productDetail = {
                title: data.uiName,
                img: data.newUILogoURL,   // 图片
                bookingNote: $sce.trustAsHtml(data.uiBookingNote), //购票须知购票须知
                politeNotice: $sce.trustAsHtml(data.uiPoliteNotice), //产品特色
                trafficGuide: $sce.trustAsHtml(data.uiTrafficGuide), //费用说明
                beforeDays: data.BeforeDays   // 到期时间
            };
            $rootScope.pageTitle = data.uiName;
            if ($rootScope.isApp) {
                backJSAction.setPageTitle(data.uiName);
            }
        });
        wx.ready(function() {
            var links = window.location.href;
            wx.onMenuShareTimeline({
                title: $rootScope.pageTitle, // 分享标题
                link: links, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'http://wechat.glchuxingwang.com/travel/images/icon/shareLogo.png', // 分享图标
                success: function () {
                    // 用户点击了分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: $rootScope.pageTitle, // 分享标题
                desc: $rootScope.pageTitle, // 分享描述
                link: links, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'http://wechat.glchuxingwang.com/travel/images/icon/shareLogo.png', // 分享图标
                success: function () {
                    // 用户点击了分享后执行的回调函数
                }
            });
        });
    })
});

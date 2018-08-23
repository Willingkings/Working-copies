var loginApp = angular.module('loginApp', ['Encrypt']);
loginApp.controller("loginCon",function ($rootScope, $scope, $q, $location , $interval,$http,Md5) {
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

    /*****************************   验证码登录 ********************************/

    $scope.phoneNum= "";                // 用户填写的手机号码
    $scope.codeNum= "";                  // 用户填写的验证码
    $scope.description = "获取验证码";  // 验证码文字
    $scope.canClick = false;            // 禁止重复事件
    var second = 59;                     // 验证码倒数时间
    var timerHandler;                    // 验证码倒数定时器
    $scope.phoneError = false;         // 提示手机号码错误
    $scope.phoneErrortext = "";        // 提示手机号码错误文字
    $scope.codeError = false;          // 提示验证码错误
    $scope.codeErrortext = "";         // 提示验证码错误文字

    /***************************   验证码登录点击事件 ******************************/
    /// 点击切换验证码登陆页面
    $scope.code = function (i) {
        $scope.codePage = true;
        $scope.passwordPage = false;
        // 清除验证码
        $scope.codeNum = "";
        $scope.codeError = false;
        // 手机错误时清除手机号码
        if($scope.phoneError === true) {
            $scope.phoneNum = "";
            $scope.phoneError = false;
        }
    };
    // 填写手机号失去焦点事件
    $scope.phoneInput = function () {
        console.log($scope.phoneNum)
        var myreg = /^1[0-9]{10}$/
        if($scope.phoneNum === false || $scope.phoneNum === undefined){
            $scope.phoneError = true;
            $scope.phoneErrortext = "输入手机号码不能为空";
        } else if(!myreg.test($scope.phoneNum)){
            $scope.phoneError = true;
            $scope.phoneErrortext = "请输入有效的手机号码";
        } else {
            $scope.phoneError = false;
        }
    }
    // 填写验证码失去焦点事件
    $scope.codeInput = function () {
        if($scope.codeNum === undefined){
            $scope.codeError = true;
            $scope.codeErrortext = "验证码不能为空";
        } else if ($scope.codeNum.length !== 6) {
            $scope.codeError = true;
            $scope.codeErrortext = "请填写完整的验证码";
        } else {
            $scope.codeError = false;
        }
    }
    // 点击获取验证码
    $scope.getTestCode = function(){
        if($scope.phoneError === false) {
            timerHandler = $interval(function(){
                if(second <= 0){
                    $interval.cancel(timerHandler);      //当执行的时间59s,结束时，取消定时器 ，cancle方法取消
                    second = 59;
                    $scope.description = "获取验证码";
                    $scope.canClick = false;            // 设置按钮可以点击，可点击发送
                }else{
                    $scope.description = second + "s后重发";
                    second--;
                    $scope.canClick = true;             // 设置按钮可以点击，不可点击发送
                }
            },1000);
            getCode($scope.phoneNum)
        } else {
            $scope.phoneError = true;
            $scope.phoneErrortext = "请输入有效的手机号码";
        }
    };
    // 验证码登录
    $scope.codeloginBtn = function () {
        // 判断用户是否填写正确
        if ($scope.phoneError === false && $scope.codeError === false) {
            getMemberInfo($scope.phoneNum,$scope.codeNum)
        }
    }

    /**** 登陆获取用户信息 ****/
    function getMemberInfo(phoneNum,codeNum){
        var dataTime = currentTime();
        // window.location.href = "http://wechat.glchuxingwang.com/travel/index.html#"+ $scope.currentPath +"?memberID="+ "157807"  +"&mobileNo="+ "18681825979" + "&token=" + "a0b9e40f8b90434185e0c099f1f32bfd"  + "&openId=" + "oS3QDwHvJT5kGPs6NlRs6ONucOtA";
        $http({
            url: "http://test.api.member.glchuxingwang.com/smallRoutine/bindCellPhoneNumber",
            method: "GET",
            params: {
                type:2,
                loginName: phoneNum,
                code: codeNum,                          //短信验证码
                openID: $scope.openId,
                datetime: dataTime,
                sign: Md5.hex_md5('key=gldy2017@ugiant2017@!~#*' + '&datetime=' + dataTime ),
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
            timeout: 5000,
        }).success(function (data) {
            if (data.success) {
                window.location.href = "http://wechat.glchuxingwang.com/travel/index.html#"+ $scope.currentPath +"?memberID="+ data.memberID  +"&mobileNo="+ phoneNum + "&token=" + data.token  + "&openId=" + $scope.openId;
            }else {
                console.log(data.msg);
            }
        });
    }

    /**** 获取验证码 ****/
    function getCode(mobileNo){
        $http({
            url: "http://test.api.member.glchuxingwang.com/common/sms/send",
            method: "GET",
            params: {
                mobileNo: mobileNo,
                type: 7,
                version: 1,
                platform: 1,
                sign: Md5.hex_md5(Md5.hex_md5(mobileNo + "glcxw2017@ugiant2017@!~#*"))
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
            timeout: 5000,
        }).success(function (data) {
            console.log(data.msg);
        });
    }

    /***** 获取code ******/
    var searchStr = window.location.search;
    function getSearchItem(searchStr,objItem) {
        var reg = new RegExp('(^|&)' + objItem + '=([^&]*)(&|$)', 'i');
        var r = searchStr.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
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



    $scope.$watch("$locationChangeSuccess",function () {
        $scope.wechatCode = getSearchItem(searchStr,"code");
        $scope.currentPath = getSearchItem(searchStr,"state");
        var datetime = currentTime();
        $http({
            url: "http://test.api.member.glchuxingwang.com/smallRoutine/getOpenID",
            method: "GET",
            params: {
                js_code: $scope.wechatCode,
                datetime: datetime,
                sign: Md5.hex_md5('key=gldy2017@ugiant2017@!~#*' + '&datetime=' + datetime),
                type: "2"
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
            timeout: 5000,
        }).success(function (data) {
            $scope.accessToken = JSON.parse(data.data);
            $scope.openId = data.openID;
            var goUrl = "http://wechat.glchuxingwang.com/travel/#"+ $scope.currentPath +"?memberID="+ data.memberID  +"&mobileNo="+ data.mobileNo + "&token=" + data.token  + "&openId=" + $scope.openId;
            if (data.isWeChatBount === 1) {
                window.location.href = goUrl;
            }
        });
    })
});
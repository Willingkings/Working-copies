(function($, undefined) {
    var productDetails = {
        parameters: {
            code: mainFun.GetQueryString("code"),
            state: mainFun.GetQueryString("state").split("|")
        },
        memberInfo: {},
        init: function () {
            this.clickEnter();
            this.getOpenId();
            this.getProductDetails();
            this.immediatePay();
        },
        clickEnter: function () {
            var _this = this;
            var usePhone = $("#phone");
            var userName = $("#name");
            $("#userPhone").on("click",function () {
                usePhone.focus();
            });
            usePhone.on("input",function () {
                if (usePhone.val().length > 0) {
                    $("#userPhoneHolder").hide();
                }else {
                    $("#userPhoneHolder").show();
                }
            });
            $("#userName").on("click",function () {
                userName.focus();
            });
            userName.on("input",function () {
                if (userName.val().length > 0) {
                    $("#userNameHolder").hide();
                }else {
                    $("#userNameHolder").show();
                }
            });
            $("#lineStationBtn").on("click",function () {
                $("#lineStation li.sub").toggle()
            });
            // 日历显示
            $("#showDate").on("click",function () {
                if($("#showTime").html() == "选择发车时间"){
                    layer.msg("请选择发车时间",{time:2000});
                } else {
                    $("table").toggle();
                    // 选择日期
                    $(".selecTable").on("click",function () {
                        // console.log($(this).attr("lay-ymd"));
                        $('.selecTable[class="Choice selecTable"]').attr("class","selecTable");
                        $(this).attr("class","Choice selecTable");                 // 添加选定样式
                        $("#showDate").html($(this).attr("lay-ymd"));              // 修改日期内容
                        $("#showDate").attr("showDate",$(this).attr("lay-ymd"));   // 添加日期属性
                        $("table").hide();  // 隐藏日历
                        $('.selecTable').unbind('click');  // 取消绑定事件
                    });
                }
            });
            // 时间段显示
            $("#showTime").on("click",function () {
                $("#departure").toggle();
                $("#showBox").toggle();
                $("#cancelBtn").toggle();
            });
            // 时间段取消按钮
            $("#cancelBtn").on("click",function () {
                $("#departure").hide();
                $("#showBox").hide();
                $("#cancelBtn").hide();
            });
            $("#departure").on("click",'.planRunTimeList',function () {
                $("#departure").hide();
                $("#showBox").hide();
                $("#cancelBtn").hide();
                $(this).addClass("active").siblings(".planRunTimeList").removeClass("active");
                $("#showTime").text($(this).attr("value"));
                $("#showTime").attr("showTime",$(this).attr("value"));
                _this.pic($(this).attr("value"));

            });
            layui.use('layer', function(){
                var layer = layui.layer;
            });
        },

        // 发车时间重构
        planRunTimeReconsitution: function (showDate,planRunTimeList){
            var _this = this;
            var newDate = new Date();
            var currentTime = newDate.getTime();
            var flag = true;
            // 时间转换
            function timeCycle(listItem){
                let newDate = new Date(),
                    year = newDate.getFullYear(),
                    month = (newDate.getMonth() + 1) <=9 ? "0"+ (newDate.getMonth() +1) : (newDate.getMonth() +1),
                    day = newDate.getDate() <= 9 ? "0"+ newDate.getDate() : newDate.getDate();
                if (showDate) {
                    var listItemTime = new Date(showDate + " " + listItem);
                }else {
                    var listItemTime = new Date(year + "-" + month + "-" + day + " " + listItem);
                }
                return listItemTime.getTime();
            }
            $("#departure").empty();
            var departureTemp = $("#departure").html();
            for (let i = 0; i < planRunTimeList.length; i++) {
                var planRunTimeItem = planRunTimeList[i].trim()

                if (i == 0) {
                    departureTemp += "<li class='planRunTimeList active' value='"+ planRunTimeItem +"'>"+ planRunTimeItem +"</li>"
                    $("#showTime").text(planRunTimeItem);
                    $("#showTime").attr("showTime",planRunTimeItem);
                    _this.pic(planRunTimeItem);
                    flag = false;
                } else {
                    departureTemp += "<li class='planRunTimeList' value='"+ planRunTimeItem +"'>"+ planRunTimeItem +"</li>"
                }
                // if (timeItem < currentTime ) {
                //     departureTemp += "<li class='disabled' value='"+ planRunTimeItem +"'>"+ planRunTimeItem +"</li>";
                // }else if (flag) {
                //     departureTemp += "<li class='planRunTimeList active' value='"+ planRunTimeItem +"'>"+ planRunTimeItem +"</li>"
                //     $("#showTime").text(planRunTimeItem);
                //     $("#showTime").attr("showTime",planRunTimeItem);
                //     _this.pic(planRunTimeItem);
                //     flag = false;
                // }else {
                //     departureTemp += "<li class='planRunTimeList' value='"+ planRunTimeItem +"'>"+ planRunTimeItem +"</li>"
                // }
            }
            $("#departure").html(departureTemp);

        },
        // 日历
        pic: function (runTime){
            var now = new Date();
            var thisYear = now.getFullYear();                                   // 今日年份    2018    数字
            var thisMonth = ((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1);  // 今日月份    01  10  字符串
            var today  = (now.getDate()<10?"0":"")+now.getDate();               // 今日天数    01  10  字符串
            var d = (new Date(thisYear,thisMonth,0)).getDate();                 // 获取今月最后一天天数 29 30 31 数字
            var useDateStr = "";
            for(var i = Number(today); i <= d; i++){
                useDateStr +=  thisYear + "-" + thisMonth + "-" + (i < 10 ? "0":"")+ i + ","
            }
            var NextYear = (thisMonth == 12 ? thisYear + 1 : thisYear)                                                 // 下月年份
            var NextMonth = (today == d ? Number(thisMonth) + 1: ((Number(thisMonth) + 1) < 10? "0" : "" ) + (Number(thisMonth) + 1));  // 下月月份
            var Nextd = (new Date(NextYear,NextMonth,0)).getDate();       // 获取下月月最后一天天数 29 30 31 数字
            for(var j = 1; j <= Nextd; j++){
                useDateStr +=  NextYear + "-" + NextMonth + "-" + (j < 10 ? "0":"")+ j + ","
            }
            var time1 = new Date(thisYear,thisMonth-1,1);
            // console.log(time1.getDay());    // 今月第一天星期
            var day1 = time1.getDay();
            var time2 = new Date(NextYear,NextMonth-1,1);
            // console.log(time2.getDay());    // 下个月第一天星期
            var day2 = time2.getDay();
            lineCode =  mainFun.GetQueryString("state").split("|");  // 获取lineCode参数
            // console.log(lineCode);
            // console.log(useDateStr);                                 // 获取日期参数
            // console.log($("#showTime").attr("showTime").trim())
            // planRunTimeList active
            $.ajax({
                type: 'GET',
                url: 'http://api.cusbus.glchuxingwang.com/vl/cusbus/app/services/moreTicketMultiDate',
                // url: 'http://test.api.cusbus.glchuxingwang.com/vl/cusbus/app/services/moreTicketMultiDate',
                dataType: 'json',
                data: {
                    lineCode: lineCode[0],
                    runTime: runTime,
                    token: "",
                    useDate: useDateStr
                },
                success: function (data){
                    if (data.success) {
                        priceData = data.data;
                        xuanran(priceData)
                    }else {
                        layer.msg(data.msg,{time:2000});
                    }
                }
            })

            function xuanran(priceData){
                //行标签头
                var hangT = "<tr>";
                //空的td块
                var lieK = "<td></td>";

                var timestr = hangT;
                // 今日表头
                timestr = timestr+"<td colspan='7'>"+thisYear + "年" + thisMonth + "月" + "</td></tr><tr>";
                timestr = timestr+"<td>"+"日"+"</td>";
                timestr = timestr+"<td>"+"一"+"</td>";
                timestr = timestr+"<td>"+"二"+"</td>";
                timestr = timestr+"<td>"+"三"+"</td>";
                timestr = timestr+"<td>"+"四"+"</td>";
                timestr = timestr+"<td>"+"五"+"</td>";
                timestr = timestr+"<td>"+"六"+"</td>";
                timestr = timestr+"</tr><tr>";
                // 空白
                for(var i = 0;i<day1;i++){
                    timestr = timestr+lieK;
                }
                for(var j = 1;j <= d; j++){
                    if(j < Number(today)) {
                        timestr = timestr+"<td class='btnNone' lay-ymd=\"" + thisYear + "-" + thisMonth + "-" + (j < 10 ?"0":"") + j + "\">"+ j +"</td>";
                    } else if (j == Number(today)){
                        if(priceData[j - Number(today)].moreTicket != 0) {
                            $("#showDate").html(thisYear + "-" + thisMonth + "-" + (j < 10 ?"0":"") + j);                           // 修改日期内容
                            $("#showDate").attr("showDate",thisYear + "-" + thisMonth + "-" + (j < 10 ?"0":"") + j + "\">"+ j);   // 添加日期属性
                        }
                        var LiClassName = (priceData[j - Number(today)].moreTicket == 0 ? "btnNone":"Choice selecTable");
                        timestr = timestr+"<td class='"+ LiClassName + "' lay-ymd=\"" + thisYear + "-" + thisMonth + "-" + (j < 10 ?"0":"") + j + "\">"+ j + "<p>"+ (priceData[j - Number(today)].moreTicket  == 0 ? "无票" : priceData[j - Number(today)].moreTicket + "张" ) +"</p></td>";
                    } else {
                        var LiClassName = (priceData[j - Number(today)].moreTicket == 0 ? "btnNone":"selecTable");
                        if($("#showDate").html() == "选择日期" && priceData[j - Number(today)].moreTicket != 0) {
                            $("#showDate").html(thisYear + "-" + thisMonth + "-" + (j < 10 ?"0":"") + j);                           // 修改日期内容
                            $("#showDate").attr("showDate",thisYear + "-" + thisMonth + "-" + (j < 10 ?"0":"") + j + "\">"+ j);   // 添加日期属性
                            LiClassName =  "Choice selecTable";
                        }
                        timestr = timestr+"<td class='"+ LiClassName + "' lay-ymd=\"" + thisYear + "-" + thisMonth + "-" + (j < 10 ?"0":"") + j + "\">"+ j  + "<p>"+ (priceData[j - Number(today)].moreTicket  == 0 ? "无票" : priceData[j - Number(today)].moreTicket  + "张" )  +"</p></td>";
                    }
                    if(day1==6){
                        timestr = timestr+"</tr><tr>";
                        day1 = -1;
                    }
                    day1++;
                }
                // 空白
                if(day1>0){
                    for(var i = day1;i<=6;i++){
                        timestr = timestr+lieK;
                    }
                }
                timestr = timestr+"</tr><tr>";

                // 下个月表头
                timestr = timestr+"<td colspan='7'>"+NextYear + "年" + NextMonth + "月" + "</td></tr><tr>";
                // 空白
                for(var i = 0;i<day2;i++){
                    timestr = timestr+lieK;
                }
                for(var j = 1;j<=Nextd;j++){
                    var LiClassName = (priceData[j + (d - Number(today))].moreTicket == 0 ? "btnNone":"selecTable");
                    if($("#showDate").html() == "选择日期" && priceData[j + (d - Number(today))].moreTicket != 0) {
                        $("#showDate").html( NextYear + "-" + NextMonth + "-" + (j < 10 ?"0":"") + j);               // 修改日期内容
                        $("#showDate").attr("showDate", NextYear + "-" + NextMonth + "-" + (j < 10 ?"0":"") + j);   // 添加日期属性
                        LiClassName =  "Choice selecTable";
                    }
                    timestr = timestr+"<td class='"+ LiClassName + "' lay-ymd=\"" + NextYear + "-" + NextMonth + "-" + (j < 10 ?"0":"") + j + "\">"+j +"<p>"+ (priceData[j + (d - Number(today))].moreTicket  == 0 ? "无票" : priceData[j + (d - Number(today))].moreTicket  + "张" ) +"</p></td>";
                    if(day2 == 6){
                        timestr = timestr+"</tr><tr>";
                        day2 = -1;
                    }
                    day2++;
                }
                timestr = timestr+"</tr>";

                $("table").html(timestr);
            }

        },

        // 获取短信验证码
        getSecurityCode: function (isPhoneNum,openId){
            var _this = this;
            var flag = true;
            $("#getSecurityCode").on("click",function (){
                if (flag) {
                    var timeSec = 59;
                    var codeTime = setInterval(function Internal(){
                        if (timeSec === 0){
                            $("#getSecurityCode").html("获取验证码");
                            clearInterval(codeTime);
                            flag = true
                        }else {
                            let timeStr = "("+timeSec+"s)后重新获取";
                            $("#getSecurityCode").html(timeStr);
                            timeSec--;
                        }
                    },1000);
                    mainFun.getCode(isPhoneNum);
                    flag = false;
                }
            });
            $("#confirm").on("click",function () {
                let code = $("#code").val();
                if (code.length > 0) {
                    _this.getMemberInfo(openId,code,isPhoneNum);
                }
            });
            $("#cancel").on("click",function () {
                $("#securityCode").hide();
            });
        },
        // 获取openId
        getOpenId: function (){
            let _this = this;
            let code = mainFun.GetQueryString("code");
            let datetime = mainFun.currentTime("yymmddhhmmss");
            if (code) {
                $.ajax({
                    url: 'http://api.member.glchuxingwang.com/smallRoutine/getOpenID',
                    // url: 'http://test.api.member.glchuxingwang.com/smallRoutine/getOpenID',
                    dataType: 'json',
                    type: 'get',
                    data: {
                        js_code: code,
                        datetime: datetime,
                        sign: hex_md5('key=gldy2017@ugiant2017@!~#*' + '&datetime=' + datetime),
                        type: "2"
                    },
                    success: function (data){
                        $("#loading").hide();
                        $(".loading").hide();
                        if (data.success) {
                            _this.memberInfo.openId = data.openID;
                            _this.memberInfo.memberId = data.memberID;
                            _this.memberInfo.phoneNum = data.mobileNo;
                            _this.memberInfo.token = data.token;
                            $("#phone").val(data.mobileNo);
                            $("#userPhoneHolder").hide();
                            $.ajax({
                                url: 'http://sec.api.cusbus.glchuxingwang.com/vl/cusbus/app/services/saveLoginInfo',
                                dataType: 'json',
                                type: 'post',
                                xhrFields: {
                                    withCredentials: true
                                },
                                data: {
                                    memberId: _this.memberInfo.memberId,
                                    token: DES3.encrypt("lightintek@1234567890.com",_this.memberInfo.token)
                                },
                                success: function (response){

                                }
                            })
                        }else {
                            _this.memberInfo.memberId = null;
                            _this.memberInfo.openId = data.openID;
                        }
                    }
                });
            }
        },
        // 获取用户信息
        getMemberInfo: function (openId,code,isPhoneNum){
            var _this = this;
            let datetime = mainFun.currentTime("yymmddhhmmss");
            $.ajax({
                url: 'http://api.member.glchuxingwang.com/smallRoutine/bindCellPhoneNumber',
                // url: 'http://test.api.member.glchuxingwang.com/smallRoutine/bindCellPhoneNumber',
                dataType: 'json',
                type: 'get',
                data: {
                    type:2,
                    loginName: $("#phone").val(),
                    code: code,                          //短信验证码
                    openID: openId,
                    datetime: datetime,
                    sign: hex_md5('key=gldy2017@ugiant2017@!~#*' + '&datetime=' + datetime ),
                },
                success: function (data){
                    if (data.success) {
                        layer.msg(data.msg,{time:2000},function () {
                            _this.memberInfo.memberId = data.memberID;
                            _this.memberInfo.phoneNum = isPhoneNum;
                            _this.memberInfo.token = data.token;
                            $("#securityCode").hide();
                            $.ajax({
                                url: 'http://sec.api.cusbus.glchuxingwang.com/vl/cusbus/app/services/saveLoginInfo',
                                dataType: 'json',
                                type: 'post',
                                xhrFields: {
                                    withCredentials: true
                                },
                                data: {
                                    memberId: _this.memberInfo.memberId,
                                    token: DES3.encrypt("lightintek@1234567890.com",_this.memberInfo.token)
                                },
                                success: function (response){
                                    _this.placeOrder(_this.memberInfo);
                                }
                            })
                        })
                    }else {
                        layer.msg(data.msg,{time:2000});
                    }
                }
            })
        },
        // 获取商品详情
        getProductDetails: function(){
            var _this = this;
            var lineCode = _this.parameters.state[0];
            $.ajax({
                url: 'http://sec.api.cusbus.glchuxingwang.com/vl/cusbus/app/services/lineDetail',
                dataType: 'json',
                type: 'get',
                data: {
                    token: "",
                    lineCode: lineCode
                },
                success: function (response){
                    let data = response.data;
                    _this.memberInfo.planRunTimeStr = data.planRunTimeStr.split(",");
                    _this.memberInfo.price = data.stationInfo[0].stepPrice;
                    _this.memberInfo.lineCode = lineCode;
                    _this.memberInfo.title = data.stationInfo[0].name + "-" + data.stationInfo[data.stationInfo.length -1].name;
                    $("#startStation").text(data.stationInfo[0].name);
                    $("#endStation").text(data.stationInfo[data.stationInfo.length -1].name);
                    _this.planRunTimeReconsitution(null,_this.memberInfo.planRunTimeStr);
                    $("#price").text(data.stationInfo[0].stepPrice);
                    var lineStation = "";
                    for (let i = 0; i < data.stationInfo.length; i++) {
                        if (i===0) {
                            lineStation += "<li><i></i><span id='startStation'>"+ data.stationInfo[i].name +"</span></li>"
                        }else if(i===data.stationInfo.length-1){
                            lineStation += "<li><i></i><span id='endStation'>"+ data.stationInfo[i].name +"</span></li>"
                        }else {
                            lineStation += "<li class='sub' style='display: none;'><i></i><span>"+ data.stationInfo[i].name +"</span></li>"
                        }
                    }
                    $("#lineStation").html(lineStation);
                }
            })
            $.ajax({
                url:'http://api.cusbus.glchuxingwang.com/vl/cusbus/app/services/firstPageRecommendAll',
                type:'post',
                dataType:'json',
                data:{
                    lng: 110.319725,
                    lat: 25.277453,
                    token: "",
                },
                success:function(data){
                    var data = data.data;
                    for(var i = 0; i < data.length; i++) {
                        if(data[i].lineCode == lineCode) {
                            console.log(data[i].lineName);
                            $("#NexstartStation").html(data[i].lineName);
                        }
                    }
                },
                error:function(){
                    console.log('请求失败了');
                }
            });
        },
        // 登录保存（南大）
       /* saveLoginInfo: function(){
            var _this = this;

        },*/
        // 下单
        placeOrder: function(obj){
            var _this = this;
            $.ajax({
                url: 'http://sec.api.cusbus.glchuxingwang.com/vl/cusbus/app/services/buyTicket',
                type: 'post',
                dataType: 'json',
                xhrFields:    {
                    withCredentials: true
                },
                data: {
                    lineCode: parseInt(obj.lineCode),
                    lineName: obj.title,
                    startStation: $("#startStation").text(),//开始站点名称
                    endStation: $("#endStation").text(),//结束站点名称
                    customerNum: 1,//购票数
                    useDate: $("#showDate").text(),//乘车日期,多日期用','隔开
                    runTime: $("#showTime").attr("showTime").trim(), //	发车时间
                    userId: parseInt(obj.phoneNum), //用户id
                    userName: "",//	用户名
                    tel: parseInt(obj.phoneNum),//	手机号
                    orderPrice: $("#price").text(),//	订单价格（此次消费总价）
                    buyType: _this.parameters.state[1],//	订单类型 1.常规票 2.活动专线票 3.众筹 4.招募
                    token: "",
                    offPrice: 0
                },
                success: function (response){
                    if (response.success) {
                        var params = {lineCode:response.data[0].info.lineCode,flowNo:response.data[0].info.flowNo,price:response.data[0].info.orderPrice};
                        var userinfo = {openId: _this.memberInfo.openId, memberId: _this.memberInfo.memberId, phoneNum: _this.memberInfo.phoneNum, shortMessage: $("#phone").val()};
                        // 跳转到支付页
                        window.location.href = "http://wechat.payment.glchuxingwang.com/wechatpay/orderPay.html?state="+ encodeURIComponent(JSON.stringify(params)) + "&userinfo=" + encodeURIComponent(JSON.stringify(userinfo));
                    }else {
                        layer.msg(response.message,{time:2000});
                    }
                }
            })
        },
        // 支付
        immediatePay: function () {
            var _this = this;
            $("#submitBut").on("click",function () {
                var regExp = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
                let isPhoneNum = regExp.test($("#phone").val());
                let memberId = _this.memberInfo.memberId;
                let openId = _this.memberInfo.openId;
                // if (isPhoneNum) {
                //     if (memberId == null || _this.memberInfo.phoneNum !== $("#phone").val()) {
                //         _this.getSecurityCode($("#phone").val(),openId);
                //         $("#securityCode").show();
                //     }else {
                //         _this.placeOrder(_this.memberInfo)
                //     }
                // }else {
                //     layer.msg("手机号码不正确",{time:2000});
                // }
                if (isPhoneNum) {
                    // 用户未绑定号码 填写加以绑定
                    if(memberId == null || _this.memberInfo.phoneNum == null) {
                        _this.getSecurityCode($("#phone").val(),openId);
                        $("#securityCode").show();
                    }else if(!regExp.test(_this.memberInfo.phoneNum)){
                        _this.memberInfo.phoneNum = $("#phone").val();
                        _this.placeOrder(_this.memberInfo);
                    }
                    else {
                        _this.placeOrder(_this.memberInfo);
                    }
                }else {
                    layer.msg("手机号码不正确",{time:2000});
                }
            })
        }
    };
    productDetails.init();
})(jQuery)
(function($, undefined) {
    function codeTime(flag) {
        var timeSec = 20;
        var codeTime= setInterval(function Internal(){
            if (timeSec === 0){
                clearInterval(codeTime);
                $("#licensePlate").html("刷新倒计时(20s)");
                timeSec = 20;
                productDetails.init();
            }else {
                let timeStr = "刷新倒计时("+timeSec+"s)";
                $("#licensePlate").html(timeStr);
                timeSec--;
            }
        },1000);
        if (flag) {
            clearInterval(codeTime);
        }
    }
    var productDetails = {
        state: JSON.parse(decodeURIComponent(mainFun.GetQueryString("state"))),
        init: function () {
            this.getProductDetails(this.state.lineCode);
            this.getOrderDetail(this.state);
            this.getOrderCode(this.state.userId,this.state.flowNo);
            if ($("#TiS")[0].className == "TiS1") {
                $("#licensePlate").html("");
            } else {
                codeTime(false);
            }
            this.sendCodeMessages()
        },
        // 发送二维码短信
        sendCodeMessages: function (mobileNo,state){
            $.ajax({
                url: 'http://test.api.member.glchuxingwang.com/common/sms/send_test',
                dataType: 'json',
                type: 'get',
                data: {
                    mobileNo: mobileNo,
                    state: state,
                    type: 8,
                    version: 1,
                    platform: 1,
                    sign: hex_md5(hex_md5(mobileNo + "glcxw2017@ugiant2017@!~#*"))
                },
                success: function (response){
                    layer.msg(response.msg,{time:2000});
                    productDetails.state.flag = false;
                }
            })
        },
        // 获取线路详情
        getProductDetails: function(lineCode){
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
                    var lineStation = ""
                    for (let i = 0; i < data.stationInfo.length; i++) {
                        if (i===0 || i===data.stationInfo.length-1) {
                            lineStation += "<li><i></i><span>"+ data.stationInfo[i].name +"</span></li>"
                        }else {
                            lineStation += "<li class='sub'><i></i><span>"+ data.stationInfo[i].name +"</span></li>"
                        }
                    }
                    $("#lineStation").html(lineStation);
                }
            })
        },
        // 获取订单详情
        getOrderDetail: function(obj){
            let state = "";
            $.ajax({
                url: 'http://api.cusbus.glchuxingwang.com/vl/cusbus/app/services/queryOrders',
                // url: 'http://test.api.cusbus.glchuxingwang.com/vl/cusbus/app/services/queryOrders',
                dataType: 'json',
                type: 'get',
                async: false,
                data: {
                    userId: obj.userId,
                    flowNo: obj.flowNo,
                    token:""
                },
                success: function (response){
                    var now = new Date();
                    var thisYear = now.getFullYear();                                   // 今日年份    2018    数字
                    var thisMonth = ((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1);  // 今日月份    01  10  字符串
                    var today  = (now.getDate()<10?"0":"")+now.getDate();               // 今日天数    01  10  字符串
                    if (now.getFullYear() + "-" + ((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1) + "-" + (now.getDate()<10?"0":"")+ now.getDate() != response.data[0].runTimeStr.slice(0,10)) {
                         $("#TiS").attr("class","TiS1");                 // 添加提示样式
                    }
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
                                if(data[i].lineCode == response.data[0].lineCode) {
                                    $("#title").text(data[i].lineName);
                                }
                            }
                        },
                        error:function(){
                            console.log('请求失败了');
                        }
                    })
                    if (response.success) {
                        let data = response.data[0];
                        $("#date").text(data.runTimeStr);
                        $("#price").text(data.realPrice);
                        $("#flowNo").text(data.flowNo);
                        if (data.state > 2) {
                            $("#licensePlate").hide();
                            $("#securityCodeImg").hide();
                            codeTime(true)
                        }
                        switch (data.state) {
                            case 1:
                                state = "未支付";
                                break;
                            case 2:
                                state = "未验票";
                                break;
                            case 3:
                                state = "已验票 ";
                                break;
                            case 4:
                                state = "退票";
                                break;
                            case 5:
                                state = "已过期";
                                break;
                        }
                        $("#status").text(state);
                        $("#securityCodeStatus").text(state);
                    }
                }
            })
        },
        // 获取二维码
        getOrderCode: function (phoneNum,flowNo) {
            $.ajax({
                url: "http://tmp.api.ewallet.glchuxingwang.com/api/v1/cusbus/qrcode/ticket/"+ phoneNum + "/" + flowNo,
                dataType: 'json',
                success: function (data){
                    if (data.data != null) {
                        $("#securityCodeImg").attr("src",data.data);
                    } 
                }
            })
        },
    };
    productDetails.init();

})(jQuery)
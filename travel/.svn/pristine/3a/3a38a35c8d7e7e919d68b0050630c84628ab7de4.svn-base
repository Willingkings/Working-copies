(function() {
    /**** 获取当前时间 yymmddhhmmss *****/
    function currentTime(){
        var newDate = new Date(),
            year = newDate.getFullYear()+"",
            month = (newDate.getMonth() + 1) <=9 ? "0"+ (newDate.getMonth() +1) : (newDate.getMonth() +1)+"",
            day = newDate.getDate() <= 9 ? "0"+ newDate.getDate() : newDate.getDate(),
            h = newDate.getHours() <=9 ? "0"+ newDate.getHours() : newDate.getHours(),
            m = newDate.getMinutes() <=9 ? "0"+ newDate.getMinutes() : newDate.getMinutes(),
            s = newDate.getSeconds() <=9 ? "0"+ newDate.getSeconds() : newDate.getSeconds();
        return year + month + day + h + m + s
    }
    var dataSign = "";
    try {
        var signJsonStr = backJSAction.getSign();
        dataSign = JSON.parse(signJsonStr);
    } catch (e) {
        var datetime = currentTime();
        $.ajax({
            url: "http://wechat.glchuxingwang.com/checkLogined",
            dataType: "json",
            type: "get",
            timeout: 5000,
        }).success(function (response) {
            if (response.success) {
                dataSign = {
                    sign: hex_md5("memberId=" + response.data.memberId + "&token=" + response.data.token + "&datetime=" + datetime),
                    datetime: datetime,
                    memberId: response.data.memberId,
                }
            }else {
                window.location.href = "http://wechat.glchuxingwang.com/loginView?pamUrl="+ encodeURIComponent("APP");
            }
        });
    }
    var orderInfoJS = {
        init: function() {
            this.getDateFn();
        },
        // 获取当前日期时间
        getNowFormatDate: function() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if(hours<10){
                hours = "0"+hours;
            }
            if(minutes<10){
                minutes = "0"+minutes;
            }
            if(seconds<10){
                seconds = "0"+seconds;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
                " " + hours + seperator2 + minutes + seperator2 + seconds;
            return currentdate;
        },
        // 时间比较
        compare: function() {
            var _this = this;
            // 出行时间
            var time = $("#time").text();
            // 当前时间
            var curTime = _this.getNowFormatDate();
            //
            var oDate1 = new Date(time.replace(/-/g,"/"));
            var oDate2 = new Date(curTime.replace(/-/g,"/"));
            // 订单ID
            var orderId = mainFun.GetQueryString("orderId");
            //订单号
            var orderCode = $("#order-no").text();
            if (oDate1.getTime() > oDate2.getTime()) {
                $("#refund-btn").val("退票").on("click",function(){
                    var layers = layer.confirm('确认退票？', {
                        btn: ['确认', '取消'] //按钮
                    }, function() {
                        location.href = "/logined/refund/refund_ticket?orderId=" + orderId+"&orderCode="+orderCode;
                        layer.close(layers);
                    });
                });
            } else if (oDate1.getTime() < oDate2.getTime()) {
                $("#refund-btn").val("退款").on("click",function(){
                    var layers = layer.confirm('确认退款？', {
                        btn: ['确认', '取消'] //按钮
                    }, function() {
                        location.href = "/logined/refund/refund?orderId=" + orderId+"&orderCode="+orderCode;
                        layer.close(layers);
                    });
                });
            } else {
                console.log('相等');
            }
        },

        // 模板
        htmlTemplate: function(bianma, urls) {
            var html = "";
            html += '<div>' +
                '<p>检票乘车：<span> ('+bianma+')</span></p>' +
                '<div class="ewm-img">' +
                '<img src="' + urls + '" alt="" >' +
                '</div>' +
                '</div>';
            $("#busTickets").append(html);
        },

        // 获取二维码
        getQrCode: function (orderCode){
            var _this = this;
            $.ajax({
                url: 'http://pc.ticket.glchuxingwang.com/TicketAPI/NoAuth/GetOrderCodeEWM',
                dataType: 'json',
                type: 'get',
                data: {
                    orderNo:orderCode
                },
                success: function(response) {
                    if (response.BusBody.length > 0) {
                        // 可退款/退票标识 有未使用的票或已使用过的票
                        // var notUsed = [];
                        $.each(response.BusBody, function() {
                            var bianmas = this.OrderCode;
                            var urls = this.Image_Src_EWM;
                            _this.htmlTemplate(bianmas, urls);
                        });
                        $("#busTickets").show();
                    }
                },
                error: function(response) {
                    alert(response.resultMsg);
                }
            });
        },
        // 获取数据
        getDateFn: function() {
            var _this = this;
            // $("#ewm-list").html("");
            var type = $("#type");
			
            var orderName = $("#order-name");
			
            // var name = $("#name");
            // var qupiaoBox = $("#qupiao-box");
            // var busTickets = $("#busTickets");
            // var qupiao = $("#qupiao");
            var orderNo = $("#order-no");
            var time = $("#time");
            var state = $("#state");
            var money = $("#money");
            var ticket = $("#ticket");
            var num = $("#num");
            var img2 = $("#img2");
            var OrderVerifyCode  = $("#OrderVerifyCode ");
            var orderCode = mainFun.GetQueryString("orderId");
            $.ajax({
                url: 'http://pc.ticket.glchuxingwang.com/TicketAPI/WXAuth/GetOrders',
                dataType: 'json',
                type: 'get',
                data: {
                    sign: dataSign.sign,
                    datetime: dataSign.datetime,
                    memberID: dataSign.memberId,
                    orderNo:orderCode
                },
                // orderId: GetQueryString('orderId')
                success: function(response) {
					
                    $(".load-img").hide();
                    if (response.status == 1000) {
                        state.text(response.data[0].FStatus);
                        // // 金额：
                        money.text(response.data[0].OrderTotalPrice + "元");
                        // money.text(response.detail.order.sys_remark);
                        // 订单号：
                        orderNo.text(response.data[0].OrderNo);
                        // // 产品名称：
                        orderName.text(response.data[0].OrderProductName);
                        // //产品类型
                        type.text(response.data[0].btName);
                        // 出行日期：
                        time.text(response.data[0].OrderValidTimeStart.substr(0,10));
                        // 票数
                        num.text(response.data[0].OrderNumber);
                        // 数字验证码
                        OrderVerifyCode.text(response.data[0].OrderVerifyCode);
                        if (response.data[0].pProductLinks !== 0 && response.BSChildList.length !== 0 ) {
                            // 车票：
                            ticket.text(response.BSChildList[0].OrderProductName);
                        }else {
                            $("#Aticket").hide();
                        }
                        // 二维码
                        img2.attr('src', "http://pc.ticket.glchuxingwang.com/Ashx/QRCode.ashx?id=" + response.data[0].OrderNo);
                        var codeList = _this.getQrCode(response.data[0].OrderNo);
                        /*switch (response.data[0].btName) {
                            case "观光巴士":
                                _this.getQrCode(response.data[0].OrderOutNo);
                                busTickets.show();
                                break;
                            case "景点门票":
                                qupiao.text(response.data[0].OrderNo);
                                img2.attr('src', "http://pc.ticket.glchuxingwang.com/Ashx/QRCode.ashx?id=" + response.data[0].OrderNo);
                                qupiaoBox.show();

                                break;
                            case "套票":
                                if(response.QYChildList.length !== 0) {
                                    qupiao.text(response.QYChildList[0].OrderNo);
                                    img2.attr('src', "http://pc.ticket.glchuxingwang.com/Ashx/QRCode.ashx?id=" + response.QYChildList[0].OrderNo);
                                    qupiaoBox.show();
                                }
                                if (response.BSChildList.length !== 0) {
                                    _this.getQrCode(response.BSChildList[0].OrderOutNo);
                                    busTickets.show();
                                }
                                break;
                        }*/
                        _this.compare();
                    } else {
                        console.log(response);
                    }
                },
                error: function(response) {
                    $(".load-img").hide();
                    console.log(response.resultMsg);
                }
            });
        },
    };
	setTimeout(function(){
		orderInfoJS.init()
	},500);
    
})(jQuery);

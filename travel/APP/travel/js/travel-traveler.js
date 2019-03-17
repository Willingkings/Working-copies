(function($,undefined){
    var traveler = {
        init:function(){
            this.getDate();
            this.getMessage();
            this.payFun();
        },
        getDate:function(){
            var name = mainFun.GetQueryString("name");
            var money = parseFloat(mainFun.GetQueryString("money"));
            var num = parseInt(mainFun.GetQueryString("num"));
            var date = mainFun.GetQueryString("date");
            $("#name").text(name);
            $("#money").text(money);
            $("#date").text(date);
            $("#num").text(num);
            $("#total").text((num*money).toFixed(2));
        },
        // 获取短信验证码
        getMessage:function(){
            $("#send-btn").on("click",function(){
                var _this = this;
                var phone = $(".phone").val();
				var md5Account = backJSAction.strToMD5(phone);
                if(phone == "" || phone.length !=11){
                    layer.msg("填写正确手机号码");
                    return false;
                }
                $.ajax({
                    url: '/TicketAPI/NoAuth/GetVerificationCode',
                    dataType:"json",
                    type:"post",
                    data:{
                        mobileNo:phone,
						sign:md5Account,
                        type:4
                    },
                    success:function(res){
                        if(res.status == 1000){
                            layer.msg(res.resultMsg);
                            mainFun.sendMessage(_this);
                        }else{
                            layer.msg(res.resultMsg);
                        }
                    },
                    error:function(res){
                        console.log(res.resultMsg);
                    }
                })
            })
        },
        // 付款按钮
        payFun:function(){
            // 控制按钮点击
            var isClick = true;
            $("#pay-btn").on("touchend",function(){
                var scheduleId = mainFun.GetQueryString("scheduleId");
                var date = mainFun.GetQueryString("date");

                // 票数
                var num = $("#num").text();
                // 手机号
                var mobileNo = $(".phone").val();
                // 短信验证码
                var msgCode = $(".msg-code").val();
                // 出行人
                var name = $(".name").val();
                // 总价
                var total =$("#total").text();
                if(msgCode.length<=0){
                    layer.msg("请填写短信验证码");
                    return false;
                }
                if(name.length<=0){
                    layer.msg("请填写出行人");
                    return false;
                }
                if(!isClick){
                    return false;
                }
                isClick = false;
                layer.msg("订单提交中，请稍后",{
                    icon:16,
                    time:0,
                    shade:[0.8,"#393D49"],
                    success: function (layero, index) {
                        var data = eval('(' + backJSAction.getSign() + ')');
                        $.ajax({
                            url: "/TicketAPI/NoAuth/CreateOrder",
                            dataType: "json",
                            type: "post",
                            data: {
                                sign: data.sign,
                                memberID: data.memberId,
                                datetime: data.datetime,
                                'productID': scheduleId,
                                'orderNums': num,
                                "orderTel":mobileNo,
                                "VerificationCode":msgCode,
                                "orderContactor":name,
                                "orderAmount":total,
                                "orderValidTimeStart":date
                            },
                            success:function(res){
                                if(res.status == 1000){
                                    isClick =true;
                                    backJSAction.callPayList('{"orderNo":"' + res.orderNo + '","memberId":"' + res.memberID + '","token":"' + res.token + '","mobile":"' + mobileNo + '","name":"' + name + '","orderType":"LY","platformType":"APP"}');
                                    layer.close(index);
                                }else{
                                    isClick =true;
                                    layer.msg(res.resultMsg);
                                    layer.close(index);
                                }
                            },
                            error:function(res){
                                console.log(res.resultMsg);
                                isClick =true;
                                layer.close(index);
                            }
                        })
                    }
                });
            })
        }
    };
    traveler.init();
})(jQuery);

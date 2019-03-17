(function($, undefined) {
    var productDetails = {
        memberInfo: {},
        state: JSON.parse(decodeURIComponent(mainFun.GetQueryString("state"))),
        init: function () {
            this.getOpenId();
            this.getProductDetails();
            this.immediatePay();
        },
        // 获取memberId 、userId 、openId
        getOpenId: function (){
            let _this = this;
            let code = mainFun.GetQueryString("code");
            let datetime = mainFun.currentTime("yymmddhhmmss");
            if (code) {
                $.ajax({
                    url: 'http://test.api.member.glchuxingwang.com/smallRoutine/getOpenID',
                    dataType: 'json',
                    type: 'get',
                    data: {
                        js_code: code,
                        datetime: datetime,
                        sign: hex_md5('key=gldy2017@ugiant2017@!~#*' + '&datetime=' + datetime),
                        type: "2"
                    },
                    success: function (data){
                        if (data.success) {
                            $("#loading").hide();
                            $(".loading").hide();
                            _this.memberInfo.openId = data.openID;
                            _this.memberInfo.memberId = data.memberID;
                            _this.memberInfo.userId = data.mobileNo;
                        }else {
                            _this.memberInfo.memberId = null
                        }
                    }
                });
            }
        },
        // 获取商品价格
        getProductDetails: function(){
            var _this = this;
            var lineCode = _this.state.lineCode;
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
                    $("#orderTitle").text(data.stationInfo[0].name + "-" + data.stationInfo[data.stationInfo.length -1].name);
                    $("#price").text(data.stationInfo[0].stepPrice);
                    _this.memberInfo.price = data.stationInfo[0].stepPrice;
                }
            })
        },
        // 支付
        immediatePay: function () {
            var _this = this;
            _this.memberInfo.flowNo = _this.state.flowNo;
            _this.memberInfo.lineCode = _this.state.lineCode;
            window.location.href = "http://wechat.payment.glchuxingwang.com/wechatpay/ticketDetails.html?state="+ encodeURIComponent(JSON.stringify(_this.memberInfo))
            /*$("#submitBut").on("click",function () {
                if (_this.memberInfo.length !== 0) {
                    $.ajax({
                        url: 'http://test.api.cusbus.glchuxingwang.com/cusbus/app/services/ticketpay',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            userId: _this.memberInfo.userId,
                            memberId: _this.memberInfo.memberId,
                            flowNo: _this.state.flowNo,
                            paymentMoney: _this.state.price,
                            paymentTerminal: "20",
                            paymentMethod: "62",
                            openId: _this.memberInfo.openId
                        },
                        success: function (res){
                            if (res.success) {
                                if (typeof WeixinJSBridge == "undefined") {
                                    if (document.addEventListener) {
                                        document.addEventListener('WeixinJSBridgeReady',onBridgeReady,false);
                                    } else if (document.attachEvent) {
                                        document.attachEvent('WeixinJSBridgeReady',onBridgeReady);
                                        document.attachEvent('onWeixinJSBridgeReady',onBridgeReady);
                                    }
                                } else {
                                    var payInfo = JSON.parse(res.data.wechat);
                                    WeixinJSBridge.invoke('getBrandWCPayRequest',{
                                            "appId" : payInfo.appId, //公众号名称，由商户传入
                                            "timeStamp": payInfo.timeStamp, //戳，自1970 年以来的秒数
                                            "nonceStr" : payInfo.nonceStr, //随机串
                                            "package" : payInfo.package,
                                            "signType" : payInfo.signType, //微信签名方式:
                                            "paySign" : payInfo.paySign  //微信签名,
                                        },
                                        function(res) {
                                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                                _this.memberInfo.flowNo = _this.state.flowNo;
                                                _this.memberInfo.lineCode = _this.state.lineCode;
                                                window.location.href = "http://wechat.payment.glchuxingwang.com/wechatpay/ticketDetails.html?state="+ encodeURIComponent(JSON.stringify(_this.memberInfo))

                                            }else if (res.err_msg == "get_brand_wcpay_request:cancel") {

                                            }
                                        });
                                }
                            }
                        }
                    })
                }
            })*/
        }
    };
    productDetails.init();
})(jQuery)
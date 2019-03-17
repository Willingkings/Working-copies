(function($, undefined) {
    var productDetails = {
        memberInfo: {},
        init: function () {
            $(".PopUpBox").hide();
            this.obtainOpenId();
            this.placeOrderList();
            this.placeOrderDetail();
            this.clickEnter();
        },
        // 跳转订单列表
        clickEnter: function (){
            layui.use('layer', function(){
                var layer = layui.layer;
            });
            var _this = this;
            $("#viewTicket").on("click",function () {
                if ( _this.memberInfo.userId) {
                    window.location.href = "http://wechat.payment.glchuxingwang.com/wechatpay/viewTicket?userId=" + _this.memberInfo.userId
                }else {
                    layer.msg("请先购票",{time:2000});
                }
            });
        },
        // 获取openID
        obtainOpenId: function () {
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
                        $(".maskLayer").hide();
                        if (data.success) {
                            _this.memberInfo.openId = data.openID;
                            _this.memberInfo.userId = data.mobileNo;
                        }else {
                            _this.memberInfo.userId = null;
                            _this.memberInfo.openId = data.openID;
                        }
                    }
                });
            }
        },
        // 获取线路列表
        placeOrderList: function(){
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
                    var str1 = '';
                    $.each(data, function(i, item) {
                        str1 += `<div class="listBox" id="${data[i].lineCode}" type="${data[i].lineType}">
                                    <div class="listTop">
                                        <i>${data[i].ticketPrice}元</i>
                                        <span>${data[i].lineName}</span>
                                    </div>
                                    <div class="listBottom">
                                        <div><i></i><span>${data[i].startStationName}</span></div>
                                        <div><i></i><span>${data[i].endStationName}</span></div>
                                        <a href="javascript:void(0)">预订</a>
                                    </div>
                                </div>`;
                    });
                    $("#list").html(str1);              // 线路列表
                },
                error:function(){
                    console.log('请求失败了');
                }
            });
        },
        // 跳转线路详情
        placeOrderDetail: function () {
            $("#list").on("click",".listBox",function (e) {
                let lineCode = $(this).attr("id") + "|" + $(this).attr("type");
                let redirectUri = encodeURI("http://wechat.payment.glchuxingwang.com/wechatpay/productDetails");
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx873af39ea1f882ed&redirect_uri="+ redirectUri +"&response_type=code&scope=snsapi_base&state="+ lineCode +"#wechat_redirect";
                e.stopPropagation();
                /*if(localStorage.getItem("isBoundMobile") == "0") {
                    $(".PopUpBox").show();
                } else {

                }*/
            });
            /*$("#PopUpBoxShut").on("click",function(){
                $(".PopUpBox").hide();
            });
            $("#bindingBtn").on("click",function(){
                window.location.href="/weChatBindPhone?pamUrl=http://wechat.payment.glchuxingwang.com/wechatpay/productList";
            });*/
        }
    };
    if (!mainFun.GetQueryString("code")) {
        let redirectUri = encodeURI("http://wechat.payment.glchuxingwang.com/wechatpay/productList");
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx873af39ea1f882ed&redirect_uri="+ redirectUri +"&response_type=code&scope=snsapi_base#wechat_redirect";
    }else {
        productDetails.init();
    }
})(jQuery)


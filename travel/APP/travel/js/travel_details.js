(function($, undefined) {
    var busDetailsJS = {
        init: function() {
			// this.loadingFn();
            this.calendarFun();
            this.getDataFun();
            this.getPriceFun();
            this.leavePage();
            this.submitOrder();
           
        },

        // 日历控件
        calendarFun: function() {
            var _this = this;
            //获取今日之前的日期方法
            function GetDateStr(AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天前/后的日期
                var m = dd.getMonth() + 1; //获取当前月份的日期
                var d = dd.getDate();
                return m + "/" + d;
            }
            var daylist = [];
            var count = -211;
            //将当前211天前的日期组合成数组
            function DaysList() {
                for (var i = count; i < 0; i++) {
                    daylist.push(GetDateStr(i));
                }
            }
            DaysList();
            //初始化配置参数
            $('#datemodel').mobiscroll().calendar({
                theme: 'mobiscroll', //日期选择器使用的主题
                lang: 'zh', //使用语言
                display: 'bottom',
                invalid: daylist, //禁用今天之前的211天日期
                dateFormat: 'yy-mm-dd',
                onSet: function(obj, inst) {
                    // 点击确认后赋值到input
                    $('#thisdate').val(obj.valueText);
                    _this.getShiftInfoFun(obj.valueText);
                }
            });
        },
        // 轮播动画
        layout:function(){
            var mySwiper = new Swiper ('.t-media-list', {
             loop: true,
             //自动滚动秒数
             autoplay:2000
             });
        },
        // 广告轮播图模板
        bannerTemplate:function(img){
            var _this = this;
            var ht = "";
             ht +='<div class="swiper-slide">'+
              '<img src="'+img+'" alt=""/>'+
            '</div>';
            $("#img-list").append(ht);
            // _this.layout();
        },
        // 获取数据
        getDataFun: function() {

			var _this = this;
            var code = mainFun.GetQueryString('uiCode');
            $.ajax({
                url: '/TicketAPI/NoAuth/GetPoductList',
                dataType: 'json',
                type: 'post',
                data: {
                    uiCode: code
                },
                success: function(response) {
                    $(".load-img").hide();
                    if (response.status == 1000) {
                        if(response.data.length !=0){
                            var item = response.data[0];
                            $("#banner").attr("src",item.uiLogoURL);
                            $('#title').text(item.uiName);
                            $("title").html(item.uiName);
                            $('#money').text("￥" + item.minPrice.toFixed(2));
                            if (item.uiTrafficGuide == "") {
                                $(".t-details-section5").hide();
                            } else {
                                $(".t-details-section5").show();
                                $('#trip_remark').html(item.uiTrafficGuide);
                            }
                            if (item.uiBookingNote == "") {
                                $(".t-details-section6").hide();
                            } else {
                                $(".t-details-section6").show();
                                $('#reserve').html(item.uiBookingNote);
                            }
                            if (item.uiBookingNoteSK == "") {
                                $(".t-details-section7").hide();
                            } else {
                                $(".t-details-section7").show();
                                $('#fit-reserve').html(item.uiBookingNoteSK);
                            }
                            if (item.uiPoliteNotice == "") {
                                $(".t-details-section8").hide();
                            } else {
                                $(".t-details-section8").show();
                                $('#remark').html(item.uiPoliteNotice);
                            }
                            $("#propmt").text(item.BeforeDays);
                        }
                        // $("#yishou").text(response.count);
                    } else {
                        console.log(response.resultMsg);
                    }
                    _this.getUserInfos();
                },
                error: function(response) {
                    $(".load-img").hide();
                    console.log(response.resultMsg);
                }
            });
        },
        //获取个人信息
        getUserInfos:function(){
            var info = eval('(' + backJSAction.getUserInfo() + ')');
            if (info.msg == "") {
                $(".telphone").hide();
            }
            if(info.phone != undefined){
                $(".telphone").show();
                $("#mobile-no").val(info.phone);
                $(".orderContactor").show();
            }
        },
        // 获取班次信息
        getShiftInfoFun: function(time) {
            $('#t-details-list').html("");
            var _this = this;
            var code = mainFun.GetQueryString('uiCode');
            // html模板
            function htmlTemplate(item) {
                var kucun = item.psStoreLimit?item.psKuCun:999;
                var tpl= '<div class="t-details-shiftmain-box travel-info" data-price='+item.psDisPrice+' data-scheduleId='+item.pKey+' data-ticket='+kucun +'>'+
                    '<p class="banci">' + item.pName + '</p>' +
                    '<div class="price-info-box">' +
                        '<p class="price">&yen;'+item.psDisPrice+'元</p>'+
                        '<p class="ticket"><span style="color:#ec5a5a">剩余：</span>' + kucun + '张</p>' +
                    '</div>' +
                '</div>';
                return tpl;
            };
            $.ajax({
                url: '/TicketAPI/NOAuth/GetProductDetailList',
                dataType: 'json',
                type: 'post',
                data: {
                    uiCode: code,
                    psStartDate:time
                },
                // day: time
                success: function(response) {
                    if (response.status == 1000) {
                        if (response.data.length == 0) {
                            layer.msg("抱歉，所选日期暂无班次票务信息");
                            $(".t-details-number").hide();
                            $(".banci-info").hide();
                        } else {
                            $(".t-details-number").show();
                            $(".banci-info").show();
                            $.each(response.data, function(index,item) {
                                $('#t-details-list').append(htmlTemplate(item));
                                _this.selectBanciFun();
                            });
                        }
                    } else {
                        console.log(response.resultMsg);
                    }
                },
                error: function(response) {
                    console.log(response.resultMsg);
                }
            });
        },
        // 选择班次
        selectBanciFun: function () {
            //默认选中第一个
            var _this = $('#t-details-list').find(".t-details-shiftmain-box").eq(0);
            _this.addClass("active-box");
            var num = $('#numbox').val();
            var price = parseFloat(_this.data('price')).toFixed(2);
            var ticket = _this.data('ticket')
            var total = (num * price).toFixed(2);
            var scheduleId = _this.data('scheduleid');
            var productId = _this.data('productid');
            $('#total').text(total);
            $("#submitOrder").data("scheduleid", scheduleId);
            localStorage.setItem("prie", price);
            localStorage.setItem("num", num);
            localStorage.setItem("ticket", ticket);
            //点击选择
            $('#t-details-list').on('touchstart', '.t-details-shiftmain-box', function() {
                $('#t-details-list').find(".t-details-shiftmain-box").removeClass('active-box');
                $(this).addClass('active-box');
                num = $('#numbox').val();
                price = parseFloat($(this).data('price')).toFixed(2);
                ticket = $(this).data('ticket')
                total = (num * price).toFixed(2);
                scheduleId = $(this).data('scheduleid');
                productId = $(this).data('productid');
                $('#total').text(total);
                $("#submitOrder").data("scheduleid", scheduleId);
                localStorage.setItem("prie", price);
                localStorage.setItem("num", num);
                localStorage.setItem("ticket", ticket);
            });
        },
        // 获取总价
        getPriceFun: function() {
            var total = 0;
            var ticket = 0;
            var val = $("#numbox").val();

            $("#jia").on('touchstart', function() {
                ticket = localStorage.getItem("ticket");
         
                if (ticket == null) {
                    return false;
                }
                ++val;
                if (val > ticket && ticket > 0) {
                    val = ticket;
                }
                $("#numbox").val(val);


                var prie = localStorage.getItem("prie");
                prie = (prie == null ? 0 : prie);
                total = (val * parseFloat(prie)).toFixed(2);

                $("#total").text(total);

            });
            $("#jian").on('touchstart', function () {
                ticket = localStorage.getItem("ticket");
                if (ticket == null) {
                    return false;
                }
                --val;
                if (val <= 1) {
                    val = 1;
                }
                $("#numbox").val(val);
                var prie = localStorage.getItem("prie");
                prie = (prie == null ? 0 : prie);

                total = (val * parseFloat(prie)).toFixed(2);
                $("#total").text(total);

            });

            $("#numbox").on("input",function(){
                val = parseInt(Number($(this).val()));
                ticket = parseInt(localStorage.getItem("ticket"));
                var prie = localStorage.getItem("prie");

                if (ticket == null) {
                    return false;
                }
                if (val > ticket && ticket > 0) {
                    val = ticket;
                }
                $("#numbox").val(val);
                val = (val == "" ? 0 : val);
                ticket = (ticket == null ? 0 : ticket);
                prie = (prie == null ? 0 : prie);

                total = (val * parseFloat(prie)).toFixed(2);
                $("#total").text(total);
            })
        },

        leavePage: function() {
            $(window).unload(function() {
                localStorage.removeItem("prie");
                localStorage.removeItem("num");
                localStorage.removeItem("ticket");
            });
        },
        checkLogined: function (callback) {
 
            var isLogined = backJSAction.isLogin();
            if (isLogined) {
                callback();
            } else {
                layer.confirm("你还没有登录，是否现在进行登录？", {
                    title: false,
                    btn: ['去登录','过客购票']
                }, function (index) {
                    backJSAction.toLogin();
                    layer.close(index);
                }, function () {
                    // 票务名称
                    var name = $("#title").text();
                    // 票价
                    var money = localStorage.getItem("prie");
                    // 票数量
                    var num = $("#numbox").val();
                    // 出行时间
                    var date = $('#thisdate').val();
                    var scheduleId = $("#submitOrder").data("scheduleid");
                    window.location.href = "../travel/travel-traveler.html?name=" + name + "&money=" + money + "&num=" + num + "&date=" + date + "&scheduleId=" + scheduleId;
                });
            }
        },
        submitOrderFlag: true,
        submitOrder: function () {
            var thisObj = this;
            $("#submitOrder").on("touchend", function () {
                var times = $('#thisdate').val();
                var phone = $("#mobile-no").val();
                var orderContactor=$("#orderContactor").val();
                if (times == "" || times.length <= 0) {
                    layer.msg("请选择日期");
                    return false;
                }
          
                //登录检查
                thisObj.checkLogined(function(response) {
                    if (phone == "" || phone.length != 11) {
                        layer.msg("请输入正确联系方式");
                        return false;
                    }
                   if (orderContactor == "" ) {
                         layer.msg("请输入取票人姓名");
                        return false;
                    }
               
                    var scheduleId = $("#submitOrder").data("scheduleid");
                    var nums = $("#numbox").val();
                    var total = $("#total").text();
                    var date = localStorage.getItem("data");
                    var user = $("#user").val();
                    var tel = $("#tel").val();
//                  var productId = $("#productId").val();
//                  var routeId = $("#routeId").val();

                    var num = $("#numbox").val();
                    if (num <= 0) {
                        layer.msg("请选择购票数量");
                        return;
                    }
                    if (scheduleId <= 0) {
                        layer.msg("请选择购票班次");
                        return;
                    }
//                  if (routeId <= 0) {
//                      layer.msg("产品路线信息获取不到");
//                      return;
//                  }
//                  if (productId <= 0) {
//                      layer.msg("产品信息获取不到");
//                      return;
//                  }
                    //连续点击限制
                    if (!thisObj.submitOrderFlag) {
                        return;
                    }


                    thisObj.submitOrderFlag = false;

                    layer.msg('订单提交中，请稍候', {
                        icon: 16,
                        time: 0,
                        shade: [0.8, '#393D49'],
                        success: function (layero, index) {
                            var info = eval('(' + backJSAction.getUserInfo() + ')');
                            var data = eval('(' + backJSAction.getSign() + ')');
                            $.ajax({
                                url: "/TicketAPI/WXAuth/CreateOrder",
                                dataType: "json",
                                type: "post",
                                data: {
                                    sign: data.sign,
                                    memberID: data.memberId,
                                    datetime: data.datetime,
                                    productID: scheduleId,
                                    orderNums: nums,
                                    orderAmount: total,
                                    orderContactor: orderContactor,
                                    orderTel: info.phone,
                                    orderValidTimeStart: times,
                                    addOrderTel: phone,
                                    form_type:'APP'

                                },
                                success: function(response) {
                                    if (response.status == 1000) {
                                        backJSAction.callPayList('{"orderNo":"' + response.orderNo + '","orderType":"LY","platformType":"APP"}');
                                        layer.close(index);
                                        thisObj.submitOrderFlag = true;
                                    } else {
                                        layer.close(index);
                                        layer.msg(response.resultMsg);
                                        thisObj.submitOrderFlag = true;
                                    }
                                }
                            }); //ajax
                        } //layer-success
                    });

                });

                return false;

            }); //提交订单点击
        }
    };
    busDetailsJS.init();
})(jQuery);

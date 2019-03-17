$(document).ready(function(){

//启用tab列表
var tab = new uTab("#tabs");
tab.init();

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
//分页获取全部信息
function PageLoader(target, status,dataSign) {
    // var signJsonStr = backJSAction.getSign();
    // var dataSign = JSON.parse(signJsonStr);
    var temp = {
        target: target,
        params: {
            pageNumber: 1,
            pageSize: 5,
            status: status
        },
        dataSign: dataSign,
        tplOrderItem: function(item) {
//          var typeStr = "";
//          if (item.route != null && item.route.ticket_type == 0)
//              typeStr = "次票";
//          else if (item.route != null && item.route.ticket_type > 0)
//              typeStr = item.route.ticket_type + "日通票";
            var statusCss = "";
            if (item.OrderStatus == 7)
                statusCss = "wait";
            else if (item.OrderStatus == 1)
                statusCss = "paid";
            else if (item.OrderStatus == 3)
                statusCss = "cancel";

            var tpl = $("#tpl_order_item").text();
            var renderTpl = tpl.replace("{code}", item.OrderNo);
            renderTpl = renderTpl.replace("{created}", item.OrderDate.substr(0,19));
            renderTpl = renderTpl.replace("{total-money}", item.OrderTotalPrice);
            renderTpl = renderTpl.replace("{status}", item.FStatus);
            renderTpl = renderTpl.replace("{payStatus}", item.orderStatusCN);
            renderTpl = renderTpl.replace("{refundPayStatus}", item.OrderStatus);
            renderTpl = renderTpl.replace("{status-css}", statusCss);
            renderTpl = renderTpl.replace("{orderId}", item.OrderNo);
            renderTpl = renderTpl.replace("{orderNo}", item.OrderNo);
            renderTpl = renderTpl.replace("{memberId}", this.dataSign.memberId);
            renderTpl = renderTpl.replace("{cancelOrderId}", item.OrderNo);
            renderTpl = renderTpl.replace("{refundOrderId}", item.OrderNo);
            renderTpl = renderTpl.replace("{nums}", item.OrderNumber);
            renderTpl = renderTpl.replace("{orderNum}", item.OrderNumber);
            renderTpl = renderTpl.replace("{start}", item.OrderProductName == null ? "" : item.OrderProductName);
            renderTpl = renderTpl.replace("{end}", item.btName == null ? "" : item.btName);

            renderTpl = renderTpl.replace("{pValidTimeLost}", item.pValidTimeLost); // 有效期过后是否允许退票  true：可退；false：不可退；
            renderTpl = renderTpl.replace("{pGetTickets}", item.pGetTickets);       // 验票剩余的是否允许退票  true：可退；false：不可退；
            renderTpl = renderTpl.replace("{pPoundage}", item.pPoundage);           // 扣手续费不需审核退票    true：不需审核直接扣手续费；false：需要审核扣款
            renderTpl = renderTpl.replace("{pPoundagePercent}", item.pPoundagePercent);           // 退票扣手续费百分比      自动扣款比率

            if (item.OrderStatus == 7) {
                renderTpl = renderTpl.replace("{showPay}", "block");
                renderTpl = renderTpl.replace("{showPay}", "block");
                renderTpl = renderTpl.replace("{showPay}", "block");
            } else {
                renderTpl = renderTpl.replace("{showPay}", "none");
                renderTpl = renderTpl.replace("{showPay}", "none");
                renderTpl = renderTpl.replace("{showPay}", "none");
            }
            if (item.OrderStatus == 1) {
                renderTpl = renderTpl.replace("{refundPay}", "block");
            }else {
                renderTpl = renderTpl.replace("{refundPay}", "none");
            }
            return renderTpl;
        },
        requestData: function(params,dataSign, callback) {
            $.ajax({
                url: "http://pc.ticket.glchuxingwang.com//TicketAPI/WXAuth/GetOrders",
                data: {
                    sign: dataSign.sign,
                    datetime: dataSign.datetime,
                    memberID: dataSign.memberId,
                    currentPage: params.pageNumber,
                    pageIndex: params.pageSize,
                    orderStatus: params.status
                },
                dataType: "json",
                type: "get",
                success: function(response) {
                    $(".load-img").hide();
                    if (typeof(eval(callback)) == "function") {
                        callback(response);
                    }
                },
                error:function(response){
                    $(".load-img").hide();
                    console.log(response.resultMsg);
                }
            }); //ajax
        }, //requestData
        cancelOrder: function(orderId, payStatus) {
            //询问框
            var tipText = "";
            if (payStatus == 2)
                tipText = "已支付订单，是否确定取消？订单金额将退回会员余额。";
            else
                tipText = "待支付订单，是否确定取消？";
            layer.confirm(tipText, {
                title: false,
                btn: ['是', '否'] //按钮
            }, function(index) {
                layer.msg('发起取消，请稍候', {
                    icon: 16,
                    time: 0,
                    shade: [0.8, '#393D49'],
                    success: function(layero, index) {
                        $.ajax({
                            url: 'http://pc.ticket.glchuxingwang.com/TicketAPI/WXAuth/CancelOrder',
                            dataType: 'json',
                            type: 'get',
                            data: {
                                sign: dataSign.sign,
                                datetime: dataSign.datetime,
                                memberID: dataSign.memberId,
                                orderNo: orderId
                            },
                            success: function(response) {
                                if (response.status == 1000) {
                                    layer.msg(response.resultMsg, {
                                        time: 2000
                                    }, function() {
                                        window.location.reload();
                                    });
                                } else {
                                    layer.close(index);
                                    layer.msg(response.resultMsg);
                                }
                            },
                            error: function(response) {
                                console.log(response.resultMsg);
                            }
                        });

                    }
                });
            }, function(index) {
                console.log("不进行订单取消");
            });


        },
        // 申请退款
        refundOrder: function(orderId, orderNum, payStatus, status, refund) {
            console.log(refund);
            // 已验票判断是否可退票
            if(status == "已验票" && refund.pGetTickets == false) {
                layer.msg('此票务验票完不支持退票',{time:2000});
                // renderTpl = renderTpl.replace("{refundPay}", "none");
            } else {
                reimburse();
            }
            function reimburse() {
                // 询问框
                var tipText = "";
                if (payStatus == 1)
                    if(refund.pPoundage == true){
                        tipText = "已支付订单，是否确定退款？";
                    } else {
                        tipText = "此订单退款需扣除"+ Number(refund.pPoundagePercent)*100 + "%的手续费！";
                    }
                layer.confirm(tipText, {
                    title: false,
                    btn: ['是', '否'] //按钮
                }, function(index) {
                    layer.msg('发起退款，请稍候', {
                        icon: 16,
                        time: 0,
                        shade: [0.8, '#393D49'],
                        success: function(layero, index) {
                            $.ajax({
                                url: 'http://pc.ticket.glchuxingwang.com/TicketAPI/WXAuth/RefundApply',
                                dataType: 'json',
                                type: 'get',
                                data: {
                                    sign: dataSign.sign,
                                    datetime: dataSign.datetime,
                                    memberID: dataSign.memberId,
                                    orderNo: orderId,
                                    refundCount: orderNum
                                },
                                success: function(response) {
                                    if (response.success) {
                                        layer.msg(response.resultMsg, {
                                            time: 2000
                                        }, function() {
                                            window.location.reload();
                                        });
                                    } else {
                                        layer.close(index);
                                        layer.msg(response.resultMsg);
                                    }
                                },
                                error: function(response) {
                                    console.log(response.resultMsg);
                                }
                            });

                        }
                    });
                }, function(index) {
                    console.log("不进行订单取消");
                });
            }



        },
        pageScoll: function() {
            var targetThis = this.target;
            var thisPageLoader = this;
            var isLoad = false;
			var flag = true;
            $("ul.body li" + targetThis).scroll(function() {
                var scrollTop = $(this).scrollTop();
                var tabBodyH = $(this).height();
                var pageContentH = $(targetThis + " div.page-content").height();
                var subed = pageContentH - tabBodyH - scrollTop;
                if (subed <= 0) {
                    if(isLoad){
                        return false;
                    }
					if(flag){
                        flag = false;
						thisPageLoader.params.pageNumber = thisPageLoader.params.pageNumber + 1;
                        thisPageLoader.requestData(thisPageLoader.params, thisPageLoader.dataSign, function(response) {
							flag = false;
                            if (response.status) {
                                isLoad = response.lastPage;
								flag = true;
                                $.each(response.data, function(index, item) {
                                    var html = thisPageLoader.tplOrderItem(item);
                                    $(thisPageLoader.target + " div.page-content").append(html);
                                });
                                //点击取消按钮
                                $(thisPageLoader.target + " div.page-content section.order-item span.btn-cancel").unbind("click").on("click", function() {
                                    var orderId = $(this).attr("orderid");
                                    var payStatus = $(this).attr("pay-status");
                                    thisPageLoader.cancelOrder(orderId, payStatus);
                                });
                                //点击退款按钮
                                $(thisPageLoader.target + " div.page-content section.order-item span.btn-refund").unbind("click").on("click", function() {
                                    var orderId = $(this).attr("orderId");
                                    var payStatus = $(this).attr("payStatus");
                                    var orderNum = $(this).attr("orderNum");
                                    var status = $(this).attr("status");
                                    
                                    
                                    var refund ={
                                        pValidTimeLost: $(this).attr("pvalidtimelost"),
                                        pGetTickets: $(this).attr("pgetTickets"),
                                        pPoundage: $(this).attr("ppoundage"),
                                        pPoundagePercent: $(this).attr("ppoundagepercent")
                                    }
                                    thisPageLoader.refundOrder(orderId, orderNum, payStatus, status, refund);
                                });
                                //点击付款按钮
                                $(thisPageLoader.target + " div.page-content section.order-item  span.btn-pay").unbind("click").on("click", function() {
                                    var orderNo = $(this).attr("order-no");
                                    var memberId = $(this).attr("member-id");
                                    try{
                                        backJSAction.callPayList('{"orderNo":"' + orderNo + '","orderType":"LY","platformType":"APP"}');
                                    }catch(e){
                                        window.location.href = "http://wechat.glchuxingwang.com/pages/travel_pay.html?orderNo=" + orderNo + "&orderType=LY&orderUrlType=1&m="+ memberId
                                    }
                                });
                            }
                        });
					}
                }
            });
        },
        init: function() {
            var thisPageLoader = this;
            var windowH = $(window).height();
            var tabNavH = $("ul.nav").height();
            var bodyH = windowH - tabNavH;
            $("ul.body li").height(bodyH);
            this.requestData(this.params,this.dataSign, function(response) {
                if (response.status == 1000) {
                    if (response.data.length != 0) {
                        $(thisPageLoader.target).css("backgroundImage", "");
                        $.each(response.data, function(index, item) {
                            var html = thisPageLoader.tplOrderItem(item);
                            $(thisPageLoader.target + " div.page-content").append(html);
                            if (item.status == 9) {
                                $(thisPageLoader.target + " div.page-content section.order-item:last-child span.btn-cancel").remove();
                            }
                            //点击取消按钮
                            $(thisPageLoader.target + " div.page-content section.order-item  span.btn-cancel").unbind("click").on("click", function() {
                                var orderId = $(this).attr("orderid");
                                var payStatus = $(this).attr("pay-status");
                                thisPageLoader.cancelOrder(orderId, payStatus);
                            });
                            //点击退款按钮
                            $(thisPageLoader.target + " div.page-content section.order-item span.btn-refund").unbind("click").on("click", function() {
                                var orderId = $(this).attr("orderId");
                                var payStatus = $(this).attr("payStatus");
                                var orderNum = $(this).attr("orderNum");
                                    var status = $(this).attr("status");

                                    var refund ={
                                        pValidTimeLost: $(this).attr("pvalidtimelost"),
                                        pGetTickets: $(this).attr("pgetTickets"),
                                        pPoundage: $(this).attr("ppoundage"),
                                        pPoundagePercent: $(this).attr("ppoundagepercent")
                                    }

                                    thisPageLoader.refundOrder(orderId, orderNum, payStatus, status, refund);
                            });
                            //点击付款按钮
                            $(thisPageLoader.target + " div.page-content section.order-item  span.btn-pay").unbind("click").on("click", function() {
                                var orderNo = $(this).attr("order-no");
                                var memberId = $(this).attr("member-id");
                                try{
                                    backJSAction.callPayList('{"orderNo":"' + orderNo + '","orderType":"LY","platformType":"APP"}');
                                }catch(e){
                                    window.location.href = "http://wechat.glchuxingwang.com/pages/travel_pay.html?orderNo=" + orderNo + "&orderType=LY&orderUrlType=1&m="+ memberId
                                }
                            });

                        });
                    } else {
                        $(thisPageLoader.target).css("backgroundImage", "url('../images/2.png')");
                    }
                }

            }); //请求第一页数据

            this.pageScoll();
        }

    }; //temp

    temp.init();
    return temp;

}; //分页加载数据

    //加载全部订单数据列表
    try {
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
        setTimeout(function () {
            var allPageLoader = new PageLoader("#all", null,dataSign);
            var waitPageLoader = new PageLoader("#wait", 7,dataSign);
            var waitPageLoaders = new PageLoader("#paid", 1,dataSign);
            var cancelPageLoader = new PageLoader("#cancel", 3,dataSign);
        }, 500);
        
    } catch (e) {
        console.log(e.message);
    }

});//ready
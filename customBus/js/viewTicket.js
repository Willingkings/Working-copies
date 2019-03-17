(function ($, undefined) {
    var ticketDetails = {
        userId: mainFun.GetQueryString("userId"),
        init: function () {
            //1.未支付 2.未验票 3.已验票 4.退票 5.已过期
            this.queryOrders(2);
            this.queryOrders(3);
            this.queryOrders(5);
            this.clickEnter();
        },
        // 跳转订单列表
        clickEnter: function (){
            var _this = this;
            $("#tabContent").on("click",".cheaedBox",function () {
                var memberInfo = {
                    flowNo: $(this).attr("flowNo"),
                    lineCode: $(this).attr("lineCode"),
                    price: $(this).attr("price"),
                    userId: $(this).attr("userId")
                }
                window.location.href = "http://wechat.payment.glchuxingwang.com/wechatpay/ticketDetails.html?state="+ encodeURIComponent(JSON.stringify(memberInfo))
                // window.location.href = "http://wechat.payment.glchuxingwang.com/wechatpay/viewTicket?userId=" + _this.memberInfo.userId
            });
        },
        framingTime: function (dateTime){
            function add0(m){return m<10?'0'+m:m }
            var time = new Date(dateTime);
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
        },
        lineTicketAll: function (data,states) {
            var _this = this;
            var str1 = '';
            switch(states) {
                case 1:
                    $("#nonPayment").html(str1);
                    break;
                case 2:
                    $.each(data, function(i, item) {
                        data[i].occurtime = _this.framingTime(data[i].occurtime);
                        str1 += `<div class="cheaedBox flex"  userId = "${data[i].passengerId}" price="${data[i].realPrice}" lineCode="${data[i].lineCode}" flowNo="${data[i].flowNo}">
                            <div class="addressCon">
                                <div class="title">${data[i].lineName}</div>
                                <ul class="lineList">
                                    <li>
                                        <i></i>
                                        <div>${data[i].startStation} <span>${data[i].runTime} 发车</span></div>
                                    </li>
                                    <li>
                                        <i></i>
                                        <div>${data[i].endStation} </div>
                                    </li>
                                </ul>
                                <p class="ordertime">下单时间：${data[i].occurtime}</p>
                            </div>
                            <div class="dataCon green">
                                <div class="text">有效日期</div>
                                <div class="time">${data[i].runTimeStr.slice(0,10)}</div>
                                <div class="button">
                                    <span>未验票</span>
                                </div>
                            </div>
                        </div>`;
                    });
                    $("#notRecount").html(str1);
                    break;
                case 3:
                    $.each(data, function(i, item) {
                        data[i].occurtime = _this.framingTime(data[i].occurtime);
                        str1 += `<div class="cheaedBox flex" userId = "${data[i].passengerId}" price="${data[i].realPrice}" lineCode="${data[i].lineCode}" flowNo="${data[i].flowNo}">
                            <div class="addressCon">
                                <div class="title">${data[i].lineName}</div>
                                <ul class="lineList">
                                    <li>
                                        <i></i>
                                        <div>${data[i].startStation} <span>${data[i].runTime} 发车</span></div>
                                    </li>
                                    <li>
                                        <i></i>
                                        <div>${data[i].endStation} </div>
                                    </li>
                                </ul>
                                <p class="ordertime">下单时间：${data[i].occurtime}</p>
                            </div>
                            <div class="dataCon gray">
                                <div class="text">有效日期</div>
                                <div class="time">${data[i].workDate}</div>
                                <div class="button">
                                    <span>已验票</span>
                                </div>
                            </div>
                        </div>`;
                    });
                    $("#haveRecount").html(str1);
                    break;
                case 4:
                    $("#refund").html(str1);
                    break;
                default:
                    $.each(data, function(i, item) {
                        data[i].occurtime = _this.framingTime(data[i].occurtime);
                        str1 += `<div class="cheaedBox flex" userId = "${data[i].passengerId}" price="${data[i].realPrice}" lineCode="${data[i].lineCode}" flowNo="${data[i].flowNo}">
                            <div class="addressCon">
                                <div class="title">${data[i].lineName}</div>
                                <ul class="lineList">
                                    <li>
                                        <i></i>
                                        <div>${data[i].startStation} <span>${data[i].runTime} 发车</span></div>
                                    </li>
                                    <li>
                                        <i></i>
                                        <div>${data[i].endStation} </div>
                                    </li>
                                </ul>
                                <p class="ordertime">下单时间：${data[i].occurtime}</p>
                            </div>
                            <div class="dataCon gray">
                                <div class="text">有效日期</div>
                                <div class="time">${data[i].workDate}</div>
                                <div class="button">
                                    <span>已过期</span>
                                </div>
                            </div>
                        </div>`;
                    });
                    $("#expired").html(str1);
            }
        },
        queryOrders: function (states) {
            var _this = this;
            $.ajax({
                url:'http://api.cusbus.glchuxingwang.com/vl/cusbus/app/services/queryOrders',
                type: 'post',
                dataType: 'json',
                data: {
                    states: states,
                    token: "",
                    userId: _this.userId
                },
                success: function (response){
                    _this.lineTicketAll(response.data,states);
                }
            })
        }
    };
    ticketDetails.init();
})(jQuery);
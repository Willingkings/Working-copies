(function($,undefined){
    $("title").html(mainFun.GetQueryString('name'));
    var shipList = {
        init:function(){
            this.screenChioe();
            this.getListData();
            this.priceSort();
            this.priceRange();
            this.contentHeight();
            this.classification();
        },
        // 筛选选择
        screenChioe:function(){
            var _this = this;
            // 价格排序
            $("#price-choice").on("touchend",function(event){
                $(this).addClass('cur').siblings().removeClass('cur');
                $(this).siblings().data('is',"0");
                var isClick = $(this).data("is");
                $(".choice-box").hide();
                if(isClick=="0"){
                    $(".price-choice-box").show();
                    isClick = 1;
                }else{
                    $(".price-choice-box").hide();
                    isClick = 0;
                }
                $(this).data("is", isClick);
                event.stopPropagetion();
            });
            // 区域
            $("#price-in").on("touchend",function(){
                $(this).addClass('cur').siblings().removeClass('cur');
                $(this).siblings().data('is',"0");
                $(".choice-box").hide();
                var isClick = $(this).data("is");
                if(isClick=="0"){
                    $(".price-box-con").show();
                    isClick = 1;
                }else{
                    $(".price-box-con").hide();
                    isClick = 0;
                }
                 $(this).data("is",isClick);
            });
            // 分类 
            $("#sales-volume").on("touchend",function(){
                $(this).addClass('cur').siblings().removeClass('cur');
                $(this).siblings().data('is',"0");
                $(".choice-box").hide();
                var isClick = $(this).data("is");
                if(isClick == "0"){
                    $("#classification").show();
                    isClick = 1;
                }else{
                    $("#classification").hide();
                    isClick = 0;
                }
                $(this).data("is", isClick);
            });
        },
        // 价格排序
        priceSort:function(){
            var _this = this;
            $(".price-choice-box").on("click", "li", function (event) {
                var index = $(this).index();
                $(this).addClass("cur").siblings().removeClass('cur');
                $(this).parent().hide();
                $("#price-choice").data("is","0");
                $("#selected-line").html("");
                $(".let-load-img").show();
                _this.getListData("0", index);
                event.stopPropagation();
            })
        },
        //区域
        priceRange:function(){
            function tpl_html(item) {
                var tpl = $("#hot-spot").text();
                tpl = tpl.replace("{ID}", item.ID);
                tpl = tpl.replace("{bName}", item.DestinationName);
                tpl = tpl.replace("{bName}", item.DestinationName);
                return tpl;
            }
            $.ajax({
                url: "/TicketAPI/NoAuth/GetDestinationList",
                dataType: "json",
                type: "post",
                success: function (res) {
                    if (res.status == 1000) {
                        if (res.data.length != 0) {
                            $.each(res.data, function (index, item) {
                                $("#hot-list").append(tpl_html(item));
                            });
                        }
                    } else {
                        console.log(res.resultMsg);
                    }
                },
                error: function (res) {
                    $(".load-img").hide();
                    console.log(res.resultMsg);
                }
            });
        },
        classification:function(){
            function tpl_nav_html(item) {
                var tpl = $("#hot-spot").text();
                tpl = tpl.replace("{bCode}", item.bCode);
                tpl = tpl.replace("{bName}", item.bName);
                tpl = tpl.replace("{bName}", item.bName);
                return tpl;
            };
            $.ajax({
                url: "/TicketAPI/NoAuth/GetBussinessList",
                dataType: "json",
                type: "post",
                data: {
                    iHot: 0
                },
                success: function (res) {
                    $(".load-img").hide();
                    if (res.status == 1000) {
                        if (res.data.length != 0) {
                            $.each(res.data, function (index, item) {
                                $('#classification').append(tpl_nav_html(item));
                            });
                        } else {

                        }
                    } else {
                        console.log(res.resultMsg);
                    }
                },
                error: function (res) {
                    $(".load-img").hide();
                    console.log(res.resultMsg);
                }
            });
        },
        // 获取列表数据
        getListData:function(type,index,start,end){
            var _this = this;
            // 获取url参数
            // 图片导航
            var code = mainFun.GetQueryString("bCode");
            // 热门地点
            var id = mainFun.GetQueryString("DestinationID");
            // 搜索
            var name = mainFun.GetQueryString("uiName");
            $(".loading").hide();
            // 提交参数
            var params ={
                currentPage:1,
            };
            // pageIndex:5,
            // 产品类型
            if(code != null){
                params.bCode = code;
            }else if(id != null){
                params.DestinationID = id;
            }else if(name != null){
                params.uiName = name;
            }
            //排序
            if(type == "0"){
                params.orderPriceType = index;
            }else if(type == "1"){
                params.minPriceStart = start;
                params.minPriceEnd = end;
            }else if(type == "2"){
                params.orderAllTicketType = index;
            }
            function tpl_html(item){
                var tpl = '<li class="tab-item">'+
                    '<a href="../travel/details.html?uiCode='+item.uiCode+'">'+
                        '<div class="img-box">'+
                            '<img src="'+item.uiLogoURL+'" alt="">'+
                            '<p class="prompt">'+item.BeforeDays+'</p>'+
                            '<p class="price-box"><span class="price">&yen;&nbsp;'+item.minPrice+'</span></p>'+
                        '</div>'+
                        '<p class="title">'+item.uiName+'</p>'+
                        // <p class="desc">豪华游船全新升级，三星游船以“”一船一景“”的新姿态与奇... 拷贝</p>
                        '<p class="sold">已售：'+item.allTicket+'</p>'+
                    '</a>'+
                '</li>';
                return tpl;
            };
            // 请求数据
            $.ajax({
                url: "/TicketAPI/NoAuth/GetPoductList",
                dataType:"json",
                type:"post",
                data:params,
                success:function(res){
                    $(".load-img").hide();
                    if(res.status == 1000){
                        $(".let-load-img").hide();
                        if(res.data.length != 0){
                            $(".no-data").hide();
                            $.each(res.data,function(index, item) {
                                $("#selected-line").append(tpl_html(item));
                            });

                        }else{
                            $(".no-data").show();
                        }
                        $("#selected-line").data("totalPage",res.totalPage);
                    }else{
                        $(".load-img").hide();
                        console.log(res.resultMsg);
                    }
                },
                error:function(res){
                    $(".load-img").hide();
                    console.log(res.resultMsg);
                }
            });
        },
        // 内容高度
        contentHeight:function(){
            // 顶部高度
            var topH = $(".screen-con").height();
            // 底部高度
            var bottomH = $(".footer").height();
            //  内容高度
            var conH = $(window).height()-topH-bottomH;
            $(".no-data").height(conH);
            $(".let-load-img").height(conH);
        }
    };
    shipList.init();
})(jQuery);

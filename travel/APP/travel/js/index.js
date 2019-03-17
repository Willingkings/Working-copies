(function($,undefined){

    var tourismIndex = {
        init:function(){
            this.searchFun();
            this.imgNav();
            this.getHotspot();

            // this.getLineRecommend();
        },
        // 搜索功能
        searchFun: function () {
            var _this = this;
            // 搜索页面
            $("#search-con").on("touchend",function(){
                $("#search-modal").fadeIn();
                $("#search-in").focus().val("");
            $("body").css({"height":"100%","overflow":"hidden"});
            });

            // 取消搜索
            $("#cancel").on("touchend",function(){
                $("#search-modal").fadeOut();
                $("body").css({"height":"auto%","overflow":"auto"});
            });

            // 点击搜索
            $("#search-in").on("keydown", function (e) {
                if(e.keyCode ==13){
                    var searchText = $(this).val();
                    if (searchText == "") {
                        return false;
                    }
                    window.location.href ="../travel/product_list.html?uiName="+searchText;
                }
            });
            _this.getHotSpot();
        },
        // 获取热搜词数据
        getHotSpot: function () {
            function tpl_html(item) {
                var tpl = $("#tpl_hot_word").text();
                tpl = tpl.replace("{SearchName}", item.SearchName);
                tpl = tpl.replace("{SearchName}", item.SearchName);
                tpl = tpl.replace("{SearchName}", item.SearchName);
                return tpl;
            };
            $.ajax({
                url: "/TicketAPI/NoAuth/GetSearchHistory",
                dataType: "json",
                type: "post",
                success: function (res) {
                    if (res.status == 1000) {
                        if (res.data.length != 0) {
                            $("#modal-con-hot").show();
                            $.each(res.data, function (index, item) {
                                $("#hot-spot-list").append(tpl_html(item));
                            });
                        } else {
                            $("#modal-con-hot").hide();
                        }
                    }
                },
                error: function (res) {

                }
            })
        },
        //图片导航数据
        imgNav:function(){
            var _this = this;
            function tpl_nav_html(item){
                var tpl = $("#template_tab_img").text();
                tpl = tpl.replace("{bCode}",item.bCode);
                tpl = tpl.replace("{icon}",item.bCode);
                tpl = tpl.replace("{DomianNameImgPath}",item.DomianNameImgPath);
                tpl = tpl.replace("{bName}", item.bName);
                tpl = tpl.replace("{bName}", item.bName);
                return tpl;
            };
            function tpl_tab_html(item){
                var tpl = $("#line-recommend-tab").text();
                tpl = tpl.replace("{bCode}",item.bCode);
                tpl = tpl.replace("{APPShowName}",item.APPShowName);
                return tpl;
            };
            $.ajax({
                url: "/TicketAPI/NoAuth/GetBussinessList",
                dataType:"json",
                type:"post",
                data:{
                    iHot:0
                },
                success:function(res){
                    $(".load-img").hide();
                    if(res.status == 1000){
                        if(res.data.length !=0){
                            $.each(res.data,function(index,item){
                                $('#img-nav').append(tpl_nav_html(item));
                                $("#line-tab-list").append(tpl_tab_html(item));
                            });
                            _this.productTab();
                        }else{

                        }
                    }else{
                        console.log(res.resultMsg);
                    }
                },
                error:function(res){
                    $(".load-img").hide();
                    console.log(res.resultMsg);
                }
            });
        },
        // 获取热门地点数据
        getHotspot:function(){
            function tpl_html(item){
                var tpl = $("#hot-spot").text();
                tpl = tpl.replace("{ID}",item.ID);
                tpl = tpl.replace("{pID}",item.ID);
                tpl = tpl.replace("{DestinationName}", item.DestinationName);
                tpl = tpl.replace("{DestinationName}", item.DestinationName);
                return tpl
            }
            $.ajax({
                url: "/TicketAPI/NoAuth/GetDestinationList",
                dataType:"json",
                type:"post",
                data:{},
                success:function(res){
                    if(res.status == 1000){
                        if(res.data.length !=0){
                            $.each(res.data,function(index,item){
                                $("#hot-list").append(tpl_html(item))
                            });
                        }else{
                            $(".hot-spot").hide();
                        }
                    }else{
                        console.log(res.resultMsg);
                    }
                },
                error:function(res){
                    console.log(res.resultMsg);
                }
            });
        },
        // 产品推荐tab
        productTab:function(){
            var _this = this;
            $("#line-tab-list").find(".tab-box").eq(0).addClass('cur');
            var code =$("#line-tab-list").find(".tab-box").eq(0).data("code");
            _this.getLineRecommend(code);
            $("#line-tab-list").on("touchend",".tab-box",function(){
                $(".no-data-text").hide();
                $(".let-load-img").show();
                $("#selected-line").html("");
                code = $(this).data("code");
                $(".tab-box").removeClass('cur');
                $(this).addClass('cur');
                _this.getLineRecommend(code);
            });

        },
        // 热门推荐
        getLineRecommend:function(code){
            function tpl_html(item){
                var tpl = '<li class="tab-item">'+
                    '<a href="details.html?uiCode='+item.uiCode+'">'+
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
            }
            $.ajax({
                url: "/TicketAPI/NoAuth/GetPoductList",
                dataType:"json",
                type:"post",
                data:{
                    bCode:code,
                    uiHot:1
                },
                success:function(res){
                    $(".let-load-img").hide();
                    if(res.status == 1000){
                        if(res.data.length !=0){
                            $(".no-data-text").hide();
                            $.each(res.data,function(index,item){
                                if(index<10){
                                    $("#selected-line").append(tpl_html(item));
                                }
                            });
                        }else{
                            $(".no-data-text").show();
                        }
                    }else{
                        console.log(res.resultMsg);
                    }
                },
                error:function(res){
                    $(".let-load-img").hide();
                    console.log(res.resultMsg);
                }
            })
        }
    };
    // 搜索功能

    tourismIndex.init();

})(jQuery)

(function($,undefined){
    var mainFun = {
        // 获取url列表参数
         GetQueryString:function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        // 短信
        sendMessage:function(obj){
            var countdown=60;
            function settime(obj) {
                if (countdown == 0) {
                    $(obj).removeAttr("disabled");
                    $(obj).val("获取验证码")
                    countdown = 60;
                    return;
                } else {
                    $(obj).attr("disabled", true);
                    $(obj).val("重新发送("+ countdown + ")");
                    countdown --;
                }
                setTimeout(function() {
                    settime(obj);
                },1000);
            }
            settime(obj);
        }
    };
    window.mainFun = mainFun;
})(jQuery)

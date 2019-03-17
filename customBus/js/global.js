var html = document.getElementsByTagName('html')[0];
//屏幕的宽度（兼容处理）
var htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
var htmlHeight = document.documentElement.clientHeight || document.body.clientHeight;
html.style.fontSize = htmlWidth / 375 * 20+ "px";
(function($,undefined){
    var mainFun = {
        // 获取url列表参数
        GetQueryString:function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        /**** 获取当前时间 yymmddhhmmss *****/
        currentTime: function(data){
            let newDate = new Date(),
                year = newDate.getFullYear(),
                month = (newDate.getMonth() + 1) <=9 ? "0"+ (newDate.getMonth() +1) : (newDate.getMonth() +1),
                day = newDate.getDate() <= 9 ? "0"+ newDate.getDate() : newDate.getDate(),
                h = newDate.getHours() <=9 ? "0"+ newDate.getHours() : newDate.getHours(),
                m = newDate.getMinutes() <=9 ? "0"+ newDate.getMinutes() : newDate.getMinutes(),
                s = newDate.getSeconds() <=9 ? "0"+ newDate.getSeconds() : newDate.getSeconds();
            if (data === "yymmddhhmmss") {
                return year + month + day + h + m + s
            }else {
                return year+"-"+month+"-"+day
            }
        },
        /**** 获取验证码 ****/
        getCode: function (mobileNo){
            $.ajax({
                url: "http://api.member.glchuxingwang.com/common/sms/send",
                dataType: 'json',
                type: 'get',
                data: {
                    mobileNo: mobileNo,
                    type: 7,
                    version: 1,
                    platform: 1,
                    sign: hex_md5(hex_md5(mobileNo + "glcxw2017@ugiant2017@!~#*"))
                },
                success: function (response){
                    layer.msg(response.msg,{time:2000});
                }
            });
        }
    };
    window.mainFun = mainFun;
})(jQuery)

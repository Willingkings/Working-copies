<template>
    <div class="registerHeiPic clearfix">
        <div class="registerbox">
            <div class="tabs clearfix">
                <span v-for="(item, index) in tabsParam" :class="{active: index === nowIndex}" @click="toggleTabs(index)">{{item}}</span>
            </div>
            <div class="cont">
                <form name="registerGR" id="registerGR"  v-show="nowIndex === 0">
                    <input type="text" placeholder="请输入您的真实姓名">
                    <input type="text" placeholder="请输入您的手机号">
                    <div class="code">
                        <input type="text" placeholder="请输入验证码">
                        <button>获取验证码</button>
                    </div>
                    <input type="password" placeholder="请输入您的密码">
                    <div class="prompt">
                        建议6-18位数字、字母、符号的组合
                        <span><i>强</i><i>中</i><i>弱</i></span>
                    </div>
                    <input type="password" placeholder="请输入再次您的密码">
                    <div class="read">
                        <input type="radio" value="我已阅读并同意" checked="checked">
                        <span>我已阅读并同意 &nbsp;&nbsp; <span class="col">大巴租车条款</span></span>
                    </div>
                    <div class="btn">
                        <button>立即注册</button>
                    </div>
                </form>
                <form name="registerQY" id="registerQY"  v-show="nowIndex === 1">
                    <input type="text" placeholder="请输入企业或旅行团名称">
                    <input type="text" placeholder="请输入您的手机号">
                    <div class="code">
                        <input type="text" placeholder="请输入验证码">
                        <button>获取验证码</button>
                    </div>
                    <input type="password" placeholder="请输入您的密码">
                    <div class="prompt">
                        建议6-18位数字、字母、符号的组合
                        <span><i>强</i><i>中</i><i>弱</i></span>
                    </div>
                    <input type="password" placeholder="请输入再次您的密码">
                    <div class="read">
                        <input type="radio" value="我已阅读并同意" checked="checked">
                        <span>我已阅读并同意 &nbsp;&nbsp; <span class="col">大巴租车条款</span></span>
                    </div>
                    <div class="btn">
                        <button>立即注册</button>
                    </div>
                </form>
                <div class="footTxt">已有账号，<router-link :to="{path:'/login'}" class="col">立即登录</router-link></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tabsParam: ["注册个人账户","注册企业账户"],
            nowIndex: 0,
            isShow: false
        }
    },
    methods: {
        toggleTabs(index) {
            this.nowIndex = index;
        }
    }
}
</script>

<style lang="scss">
.registerHeiPic {
    height: 100%;
    background: url('../assets/images/loginbg.png') no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
}
.registerbox {
    width: 420px;
    background: #fff;
    margin: 50px auto;
    .tabs span {
        background: #f7f7f7;
        color: #999;
        font-size: 20px;
        width: 50%;
        display: block;
        float: left;
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
    }
    .tabs span.active {
        color: #333;
        background: #fff;
    }
    .cont {
        width: 100%;
        padding: 16px 30px;
        box-sizing: border-box;
        input {
            width: 100%;
            border: 1px solid #ebebeb;
            border-radius: 20px;
            color: #999;
            padding: 10px 20px;
            box-sizing: border-box;
            margin-bottom: 15px;
        }
        .code {
           input {
                width: 220px;
                margin-right: 7px;
            }
            button {
                width: 128px;
                border: 1px solid #ff2b35;
                color: #ff2b35;
                background: #fff;
                border-radius: 20px;
                padding: 10px 20px;
                box-sizing: border-box;
            } 
        }
        .prompt {
            margin: 0 10px 15px;
            color: #ff2b35;
            font-size: 12px;
            span {
                background: #f7f7f7;
                border-radius: 10px;
                padding: 2px 6px;
                color: #999;
                margin-left: 10px;
                i {
                    padding: 0 8px;
                }
            }
        }
        .read input {
            width: 12px;
            height: 12px;
            border-radius: 6px;
            padding: 0;
        }
        .btn button {
            width: 100%;
            border: 1px solid #ff2b35;
            background: #ff2b35;
            font-size: 16px;
            color: #fff;
            border-radius: 20px;
            padding: 10px 20px;
            box-sizing: 20p
        }
    }
    .col {
        color: #ff2b35;
    }
    .footTxt {
        margin: 24px 0 10px;
        text-align: center;
    }
}
</style>

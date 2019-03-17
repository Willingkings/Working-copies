<template>
    <main>
        <div class="driverPic">
            <div class="container">
                <div class="driverTxt">
                    <h3>专业配驾租车 </h3>
                    <h1>司机招募</h1>
                    <div class="btn"><router-link :to="{ path: '/driver/applyDriver' }">立即加入</router-link></div>
                </div>
            </div>
        </div>
        <div class="driverMain white clearfix">
            <div class="container clearfix">
                <h1>业务特征</h1>
                <ul class="featureList clearfix">
                    <li>
                        <img src="../../src/assets/images/driverSm1.png" alt="">
                        <h3>更体面</h3>
                        <p>高收入高福利，配驾大巴让你生活</p>
                        <p>更体面</p>
                    </li>
                    <li>
                        <img src="../../src/assets/images/driverSm2.png" alt="">
                        <h3>有保障</h3>
                        <p>更专业更安全，配驾大巴定期专业培训</p>
                        <p>靠职业技能生活的更有保障</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="driverMain gray clearfix">
            <div class="container clearfix">
                <div class="joinTxt clearfix">
                    <h1>加入我们</h1>
                    <p class="gray-col">加入我们的团队，享受更多的快乐时光</p>
                    <p>当您准备就绪，打开应用程序，我们会推送附近订单给您，并且为您导航到目的地。一个旅程结束后，我们会继续推送订单。相信您与乘客会合作得很愉快。</p>
                </div>
                <div class="joinTxt">
                    <img src="../../src/assets/images/huaban.png" alt="">
                </div>
            </div>
        </div>
        <v-foot></v-foot>
        <v-toolbar></v-toolbar>
    </main>
</template>

<script>
import foot from "@/components/foot"
import toolbar from "@/components/toolbar"
export default {
    components: {
        'v-foot': foot,
        'v-toolbar': toolbar
    },
}
</script>

<style lang="scss">
.driverPic {
    width: 100%;
    height: 626px;
    background: url('../../src/assets/images/driverPic.png') no-repeat center;
    background-size: cover;
    .container {
        width: 1300px;
        margin: 0 auto;
        position: relative;
    }
    .driverTxt {
        position: absolute;
        color: #fff;
        top: 266px;
        left: 100px;
        h3 {
            font-size: 30px;
            font-weight: bold;
            margin: 20px 0; 
            line-height: 1;
        }
        h1 {
            font-size: 60px;
            font-weight: bold;
            margin: 20px 0;
        }
        .btn {
            width: 200px;
            height: 54px;
            line-height: 54px;
            background: #FE4A54;
            text-align: center;
            a {
                color: #fff;
            }
        }
    }
}
.driverMain.white {
    width: 100%;
    background: #fff;
    .container {
        width: 1200px;
        padding: 0 20px;
        margin: 60px auto;
        box-sizing: border-box;
    }
    h1 {
        font-size: 50px;
        color: #333;
        font-weight: bold;
        margin-bottom: 60px;
    }
    .featureList {
        margin-left: -7%; 
        li {
            float: left;
            width: 40%;
            margin: 10px 3% 10px 7%;
            box-sizing: border-box;
            img {
                height: 247px;;
            }
            h3 {
                font-size: 30px;
                color: #333;
                font-weight: bold;
                margin: 20px 40px;
            }
            p {
                margin-left: 40px;
                color: #8C8C8C;
                padding-bottom: 6px; 
            }
        }
    }
}
.driverMain.gray {
    width: 100%;
    background: #f8f8f8;
    .container {
        width: 1200px;
        margin: 120px auto;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .joinTxt {
        float: left;
        width: 45%;
        color: #333;
        h1 {
            font-size: 50px;
            color: #333;
            font-weight: bold;
            margin-bottom: 20px;
        }
        p {
            margin: 10px 0;
            line-height: 1.8;
        }
        p.gray-col {
            color: #8C8C8C;
            padding: 10px 0 20px;
        }
        img {
            width: 100%;
        }
    }
    .joinTxt:first-child {
        margin-right: 5%;
    }
    .joinTxt:last-child {
        margin-left: 5%;
    }
}
</style>
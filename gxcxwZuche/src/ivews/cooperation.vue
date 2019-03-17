<template>
    <main>
        <div class="cooperationPic">
            <div class="container">
                <div class="text-img">
                    <img src="../../src/assets/images/chengyaojiamen.png" alt="">
                </div>
                <div class="btn"><router-link :to="{ path: '/cooperation/applyCooperation' }">申请加盟</router-link></div>
            </div>
        </div>
        <div class="cooperationTxt">
            <div class="container clearfix">
                <h1>合作介绍</h1>
                <p>桂林出行网租车坚持以客户为本的专业态度，颠覆繁琐的传统租车模式，为客户提供了快速便捷的全新租车服务体验。公司遍布在中国大陆各主要城市及旅游地区的服务网络，以及24
                  小时的取还车服务和配套服务，不仅可以随时随地满足客户的租车服务需求，户的安全行车保驾护航。</p>
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
.cooperationPic {
    width: 100%;
    height: 720px;
    background: url('../../src/assets/images/cooperationPic.png') no-repeat center;
    background-size: cover;
    .container {
        width: 1300px;
        margin: 0 auto;
        .text-img {
            text-align: center;
            padding: 160px 0 20px;
        }
        .btn {
            width: 220px;
            height: 54px;
            line-height: 54px;
            font-size: 20px;
            background: #FE4A54;
            text-align: center;
            margin: 20px auto;
            a {
                color: #fff;
            }
        }
    }
}
.cooperationTxt {
    margin: 60px auto;
    .container {
        width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        box-sizing: border-box;
    }
    h1 {
        font-size: 30px;
        text-align: center;
        color: #000;
        padding-bottom: 20px;
    }
    p {
        margin: 20px 0 10px;
        color: #333;
        font-size: 20px;
        line-height: 1.8;
    }
}
</style>

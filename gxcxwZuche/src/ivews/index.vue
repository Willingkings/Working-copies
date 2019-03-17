<template>
    <main style="background: #fff">
        <div class="indexPic">
            <div class="container">
                <el-form :model="carSelectFrom" ref="carSelectFrom" :rules="rules" class="indexLogin">
                    <h3 class="iconfont">配驾租车</h3>
                    <el-form-item prop="headValue">
                        <el-select v-model="carSelectFrom.headValue" placeholder="请选择">
                            <el-option label="单日用车" value="/carIndex/oneDayCar"></el-option>
                            <el-option label="多日用车" value="/carIndex/multiDayCar"></el-option>
                            <el-option label="单程用车" value="/carIndex/oneWayCar"></el-option>
                            <el-option label="往返用车" value="/carIndex/returmWayCar"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="dateValue">
                        <el-date-picker type="datetime" v-model="carSelectFrom.dateValue" value-format="yyyy-MM-dd HH:mm"  format="yyyy-MM-dd HH:mm" placeholder="选择日期" :picker-options="pickerBeginDateBefore"></el-date-picker>
                    </el-form-item>
                    <el-button @click.stop="carIndexLogin(carSelectFrom)">立即用车</el-button>
                </el-form>
            </div>
        </div>
        <div class="mainBox">
            <div class="carType">
                <ul class="ulIcon clearfix">
                    <li>
                        <router-link :to="{path: '/carIndex/oneDayCar'}">
                            <div class="icon iconfont">&#xe644;</div>
                            <p>单日用车</p>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{path: '/carIndex/multiDayCar'}">
                            <div class="icon iconfont">&#xe641;</div>
                            <p>多日用车</p>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{path: '/carIndex/oneWayCar'}">
                          <div class="icon iconfont">&#xe63f;</div>
                          <p>单程用车</p>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{path: '/carIndex/returmWayCar'}">
                            <div class="icon iconfont">&#xe642;</div>
                            <p>往返用车</p>
                        </router-link>
                    </li>
                </ul>
                <el-steps :space="214" :active="step" align-center class="step stepFirst">
                  <el-step title="选择用车类型" description=""></el-step>
                  <el-step title="填写行程信息" description=""></el-step>
                  <el-step title="发布用车需求" description=""></el-step>
                  <el-step title="等待车队报价" description=""></el-step>
                  <el-step title="支付定金" description=""></el-step>
                  <el-step title="费用结算" description=""></el-step>
                </el-steps>
            </div>
            <div class="chapter">
                <div class="text">
                    <h1>服务介绍</h1>
                    <p>Service Introduction</p>
                </div>
                <ul class="serviceList clearfix">
                    <li>
                        <div class="icon iconfont">&#xe624;</div>
                        <h3>广西地区 专业服务</h3>
                        <p>覆盖全区，快速用车</p>
                    </li>
                    <li>
                        <div class="icon iconfont">&#xe623;</div>
                        <h3>客户为先租车首选</h3>
                        <p>20年坚持，始于信赖</p>
                    </li>
                    <li>
                        <div class="icon iconfont">&#xe625;</div>
                        <h3>多种车型 丰富用车</h3>
                        <p>多种车型，满足多重需求</p>
                    </li>
                    <li>
                        <div class="icon iconfont">&#xe626;</div>
                        <h3>0手续费 行业首家</h3>
                        <p>价格实惠，免手续费</p>
                    </li>
                </ul>
            </div>
            <div class="chapter two-chapter">
                <div class="text">
                    <h1>丰富车源</h1>
                    <p>Rich vehicle source</p>
                </div>
                <div class="tabs-content">
                    <ul class="nav-tabs clearfix">
                        <li v-for="(navItem, index) in navData" class="nav-li iconfont" :class="{active: tabIndex == index}" @click="carShowFun(index)">{{navItem}}</li>
                    </ul>
                </div>
                <div class="tabs-body">
                    <transition name="tab-fade">
                        <ul class="tabs-pic clearfix">
                            <li v-for="item in tabPicAll[tabIndex]">
                                <img :src="item.pic" :alt="item.alt">
                            </li>
                        </ul>
                    </transition>
                </div>
            </div>
            <div class="chapter">
                <div class="text">
                    <h1>新闻资讯</h1>
                    <p>News and information</p>
                </div>
                <ul class="newPic clearfix">
                    <li v-for="item in newList.slice(0,4)">
                        <router-link :to="{path: '/newList/newest/dalies',query:{id:item.id} }">
                          <img :src="item.imageUrl" alt="">
                          <p>{{item.title }}</p>
                        </router-link>
                    </li>
                    <!--<li>-->
                        <!--<img src="../assets/images/car/img-news2.png" alt="">-->
                        <!--<p>大巴租车连续6年稳居品牌力指数行业第一</p>-->
                    <!--</li>-->
                    <!--<li>-->
                        <!--<img src="../assets/images/car/img-news3.png" alt="">-->
                        <!--<p>大巴租车连续6年稳居品牌力指数行业第一</p>-->
                    <!--</li>-->
                    <!--<li>-->
                        <!--<img src="../assets/images/car/img-news1.png" alt="">-->
                        <!--<p>大巴租车连续6年稳居品牌力指数行业第一</p>-->
                    <!--</li>-->
                </ul>
                <router-link class="more" :to="{path: '/newList'}">更多快讯></router-link>
            </div>
        </div>
        <v-foot></v-foot>
        <v-toolbar></v-toolbar>

      <v-login v-show="isShowLogin" @on-loginClose="closeLogin" @on-handLogin="handLogin" @on-tologin="tologin" @on-toEmploye="toEmloye" @on-toRegist="toRegist"></v-login>
    </main>
</template>

<script>
import img1 from "@/assets/images/car/img1.png"
import img2 from "@/assets/images/car/img2.png"
import img3 from "@/assets/images/car/img3.png"
import img4 from "@/assets/images/car/img4.png"
import img5 from "@/assets/images/car/img5.png"
import img6 from "@/assets/images/car/img6.png"
import img7 from "@/assets/images/car/img7.png"
import img8 from "@/assets/images/car/img8.png"
import foot from "@/components/foot"
import toolbar from "@/components/toolbar"
import loginIndex from "@/components/loginIndex"
// import SIdentify from '@/components/identify'
import store from '@/store/store.js'
import md5 from 'js-md5'
import { validatePhone, validateVerifyNum } from "../js/validate";

let code = '';
export default {
    name: 'indexZhu',
    components: {
        'v-foot': foot,
        'v-toolbar': toolbar,
        'v-login': loginIndex,
        // SIdentify
    },
    inject: ['reload'], //注入依赖
    data() {
        let tabPic1 = [
            { pic: img1, alt: 'img1' },
            { pic: img2, alt: 'img2' },
            { pic: img3, alt: 'img3' },
            { pic: img4, alt: 'img4' },
            { pic: img5, alt: 'img5' },
            { pic: img6, alt: 'img6' },
            { pic: img7, alt: 'img7' },
            { pic: img8, alt: 'img8' }
        ];
        let tabPic2 = [
            { pic: img4, alt: 'img4' },
            { pic: img3, alt: 'img3' },
            { pic: img2, alt: 'img2' },
            { pic: img1, alt: 'img1' },
        ];
        let tabPic3 = [
            { pic: img4, alt: 'img4' },
            { pic: img3, alt: 'img3' },
            { pic: img1, alt: 'img1' },
            { pic: img2, alt: 'img2' },
        ];
        let tabPic4 = [
            { pic: img1, alt: 'img1' },
            { pic: img2, alt: 'img2' },
            { pic: img3, alt: 'img3' },
            { pic: img4, alt: 'img4' },
        ];
        let picAll = [tabPic1, tabPic2, tabPic3, tabPic4];

        return {
            step: 1,
            checkCode: '',
            carSelectFrom: {
              headValue: '',
              dateValue: ''
            },
            rules: {
              headValue: [{ required: true, trigger: 'change', message: '请选择用车类型' }],
              dateValue: [{ required: true, trigger: 'change', message: '请选择日期' }]
            },
            // 禁止用户选择过去和今日日期
            pickerBeginDateBefore:{
              disabledDate(time) {
                let timeSpace = time.getTime() < Date.now();
                return timeSpace;

              }
            },
            tabsShowFlag: [],
            tabIndex: 0,
            navData: ['热门车型', '商务车系列', '电瓶车系列', '大中巴系列'],
            tabPicAll: picAll,
            isShowLogin: false,
            newList: [ ]   //新闻列表
        }
    },
    activated() {
      let _this = this;
      $.ajax({
        type: 'get',
        url:
          'http://admin.distribute.glchuxingwang.com/api/v1/stl/contents?siteId=19&channelId=20&startNum=1&totalNum=10',
        dataType: 'json',
        data: { },
        headers: {'Content-Type': 'application/json;charset=utf8','X-SS-API-KEY':'0a9afe07-c124-4a7a-8e43-69d0d2019ea1'},
        success: function (res) {
          _this.newList = res.value;
        }
      })
    },
    methods: {
        carShowFun: function (index) {
            this.tabIndex = index;
        },
        carIndexLogin(carSelectFrom) {
          this.$refs.carSelectFrom.validate(valid => {
            if (valid) {
              if (window.sessionStorage.getItem('token') == null) {
                this.isShowLogin = !this.isShowLogin;
              } else if (window.sessionStorage.getItem('token')) {
                this.$router.push({ path: carSelectFrom.headValue });
              }
            } else {
              return false;
            }
          });
        },
        closeLogin: function () {
            this.isShowLogin = false;
        },
        handLogin: function() {
          this.isShowLogin = false;
        },
        tologin: function() {
          this.isShowLogin = false;
        },
        toEmloye() {
          this.isShowLogin = false;
        },
        toRegist() {
          this.isShowLogin = false;
        },
        fillContent() {
            console.log("fillContent");
        },
    }
}
</script>

<style lang="scss">
.indexPic {
    width: 100%;
    height: 580px;
    background: url('../../src/assets/images/indexPic.png') no-repeat center;
    background-size: cover;
    .container {
        width: 1300px;
        height: 580px;
        margin: 0 auto;
        position: relative;
        .indexLogin {
            width: 426px;
            height: 316px;
            background: #fff;
            box-sizing: border-box;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            position: absolute;
            top: 50%;
            left: 0;
            z-index: 0;
            -webkit-transform: translate(0, -60%);
            transform: translate(0, -60%);
            h3 {
                font-size: 22px;
                letter-spacing: 4px;
            }
            h3::before {
                content: '\e62e';
                font-size: 30px;
                display: inline-block;
                line-height: 1;
                vertical-align: middle;
                color: #FE4A54;
            }
            .el-form-item__error {
                margin-left: 50px;
            }
            .el-date-editor.el-input, .el-select {
                margin: 20px 0 8px;
                width: 280px;
            }
            button {
                width: 280px;
                height: 40px;
                background: #FE4A54;
                text-align: center;
                color: #fff;
                font-size: 16px;
                border: none;
                margin-top: 10px;
            }
        }
    }
}
.mainBox {
    width: 1300px;
    margin: 0 auto;
    padding: 0 20px;
    box-sizing: border-box;
    .chapter {
        padding: 70px 0 0;
        text-align: center;
        .text {
            text-align: center;
            h1 {
                font-size: 44px;
                letter-spacing: 4px;
                color: #000;
            }
            p {
                font-size: 30px;
                color: #F2F2F2;
                padding: 20px 0;
                text-transform: uppercase;
            }
        }
        .serviceList li {
            float: left;
            width: 25%;
            padding: 20px;
            box-sizing: border-box;
            text-align: center;
            .icon {
                font-size: 48px;
                display: inline-block;
                margin: 10px;
                color: #333;
            }
            h3 {
                font-size: 20px;
                color: #333;
            }
            p {
                font-size: 14px;
                color: #B0B0B0;
                margin: 8px 0;
            }
        }
    }
    .carType {
      margin-top: -85px;
      .ulIcon {
        width: 1200px;
        height: 170px;
        margin: 0 auto;
        background: #fff;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,.2), 0 0 6px 0 rgba(0,0,0,.08);
        -moz-box-shadow: 0 2px 10px 0 rgba(0,0,0,.2), 0 0 6px 0 rgba(0,0,0,.08);
        -webkit-box-shadow: 0 2px 10px 0 rgba(0,0,0,.2), 0 0 6px 0 rgba(0,0,0,.08);
        li {
          float: left;
          width: 25%;
          margin: 24px 0;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          text-align: center;
        }
        a {
          display: inline-block;
          font-size: 30px;
          color: #999;
          .icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
        }
        a:hover {
          color: #333;
          font-size: 36px;
          .icon {
            font-size: 60px;
          }
        }
      }
      .stepFirst {
        margin: 80px 0 30px;
      }
    }
}
.tabs-content {
    padding: 20px 0;
    .nav-tabs {
        li {
            float: left;
            font-size: 22px;
            margin: 0 20px;
            cursor: pointer;
        }
        li:first-child::before {
            content: "\e629";
        }
        li.active {
            color: #FE4A54;
        }
    }
}
.tabs-pic, .newPic {
    width: 100%;
    li {
        float: left;
        width: 22%;
        margin: 0 1.5% 28px;
    }
}
.newPic li {
    height: 166px;
    position: relative;
    margin: 20px 1.5% 28px;
    img {
        width: 100%;
    }
    p {
        position: absolute;
        background: #000;
        color: #fff;
        font-size: 13px;
        height: 46px;
        width: 100%;
        line-height: 46px;
        text-align: center;
        bottom: 0;
        left: 0;
    }
}
.more {
    width: 160px;
    height: 40px;
    display: inline-block;
    line-height: 40px;
    color: #707070;
    text-align: center;
    border: 1px solid #D5D0CC;
    border-radius: 2px;
    margin: 20px 0 40px;
}
.tab-fade-enter-active {
    transition: all 0.5s linear;
    transform: translate3d(0, 0, 0);
}
.tab-fade-enter {
    transition-timing-function: ease-in-out ;
    transform: translate3d(100%, 0, 0);
}

#verification{
  border-radius: 12px;
  width:100px;
  letter-spacing:5px;
  margin-left: 30px;
  margin-bottom: 0;
  height: 40px;
  transform: translate(-15px,0);
}
.captcha{
  width: 100%;
  text-align: justify;
}
</style>

<template>
    <div class="aboutBox clearfix">
        <div class="container clearfix">
            <div class="asideMenu">
                <ul class="menuList">
                  <li v-for="(tab, index) in aboutTabs">
                    <a href="#" class="tab-link" @click="tabsSwitchs(index)" :class="{active:tab.isActive}">{{tab
                      .name}}</a>
                  </li>
                </ul>
            </div>
            <div class="aboutMain">
                <div class="article" style="display: block">
                    <p>桂林出行网租车有限公司(CAR
                      Inc.，简称桂林出行网租车)成立于2007年9月，总部位于北京。作为中国领先的汽车租赁服务提供商，桂林出行网租车积极借鉴国际上成功的汽车租赁模式，并结合中国客户的消费习惯，为客户提供短租、长租及融资租赁等专业化的汽车租赁服务，以及全国救援、异地还车等完善的配套服务。截至2017年12月，桂林出行网租车在国内300余个主要城市设有1100余个服务网点，服务个人客户过千万、企业客户数万家，是目前中国汽车租赁行业的领跑企业。</p>
                    <p>桂林出行网租车坚持以客户为本的专业态度，颠覆繁琐的传统租车模式，为客户提供了快速便捷的全新租车服务体验。公司遍布在中国大陆各主要城市及旅游地区的服务网络，以及24小时的取还车服务和配套服务，不仅可以随时随地满足客户的租车服务需求，更可为客户的安全行车保驾护航。</p>
                    <p>自成立以来，桂林出行网租车获得了客户的一致认可和社会各界的广泛好评。2008年，公司成为第29届奥运会租车服务提供商，2008年公司获评《中国企业家》“21世纪未来之星”企业，2009年公司荣登《福布斯》中文版“中国潜力企业榜”，2010年公司获评《新财富》“最具增长潜力商业模式”、中华网“年度最佳租车服务奖”，2011年公司获评哈佛《商业评论》“管理行动奖”金奖、中国品牌节“品牌中国大奖最佳服务奖”、《时尚旅游》“中国旅游金榜”最佳租车公司奖。</p>
                    <p>秉持“Any One、Any Time、Any Car、Any Where”的服务理念，桂林出行网租车以推动绿色出行和新型汽车消费文化为己任，致力成为消费者首选的中国汽车租赁服务品牌，并立志为推动中国的汽车租赁产业和汽车工业的发展而努力。</p>
                    <p>根据第三方机构罗兰贝格的调查报告，桂林出行网租车是目前中国最具认知度的汽车租赁服务提供商，并在车队规模、网点覆盖、市场份额和业务收入等各项运营和财务指标上，处于中国汽车租赁行业绝对的领导地位。</p>
                </div>
                <div class="article">
                    <p>联系我们</p>
                    <p>根据第三方机构罗兰贝格的调查报告，桂林出行网租车是目前中国最具认知度的汽车租赁服务提供商，并在车队规模、网点覆盖、市场份额和业务收入等各项运营和财务指标上，处于中国汽车租赁行业绝对的领导地位。</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
        aboutTabs: [{
          name: '平台介绍',
          isActive: true
        },{
          name: '联系我们',
          isActive: false
        }],
        active: false
      }
    },
    methods: {
      tabsSwitchs: function (tabIndex) {
        let tabCardCollection = document.querySelectorAll('.article'),
          len = tabCardCollection.length;

        for (var i = 0; i < len; i++) {
          tabCardCollection[i].style.display = 'none';
          this.aboutTabs[i].isActive = false;
        }
        this.aboutTabs[tabIndex].isActive = true;
        tabCardCollection[tabIndex].style.display = 'block';
      }
    }
}
</script>

<style lang="scss">
.aboutBox {
    .container {
        padding-top: 40px;
        width: 1200px;
        margin: 0 auto;
        .asideMenu {
            width: 266px;
            height: 650px;
            background: #fff;
            margin-right: 34px;
            margin-bottom: 50px;
            float: left;
            .menuList {
                text-align: center;
                padding: 20px;
                li {
                    margin-bottom: 20px;
                }
                li a {
                    display: inline-block;
                    padding: 12px 0;
                    color: #999;
                }
                li .tab-link.active {
                    font-weight: bold;
                    color: #000;
                }
            }
        }
    }
}
.aboutMain {
    width: 900px;
    /*height: 650px;*/
    background: #fff;
    padding: 30px;
    float: right;
    overflow: hidden;
    box-sizing: border-box;
    .article {
      display: none;
    }
    p {
        margin-bottom: 30px;
        line-height: 1.6;
        text-indent: 2em;
    }
}
</style>

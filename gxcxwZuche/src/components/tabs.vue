<template>
    <div class="tabs-content" v-if="flag">
        <ul class="nav-tabs clearfix">
            <li v-for="nav in navdata" class="nav-li iconfont" :class="{active:nav.showFlag >= 0}" @click="keyShowFun">
                {{nav.key}}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        flag: {
            type: Boolean,
            required: true,
            twoWay: true
        },
        navdata: {
            type: Array,
            required: true
        }
    },
    data() {
        return {}
    },
    components: {},
    methods: {
        keyShowFun: function(index) {
            let _this = this;
            _this.navdata.forEach(function(item){
                item.showFlag = -1;
            });
            _this.navdata[index].showFlag = 1;
        }
    }
}
</script>

<style lang="scss">
.tabs-content {
    padding: 20px 0;
    .nav-tabs {
        li {
            float: left;
            font-size: 22px;
            margin: 0 20px;
        }
        li:first-child::before {
            content: "\e629";
        }
        li.active {
            color: #FE4A54;
        }
    }
}
</style>
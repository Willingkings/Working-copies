<template>
    <transition name="dialog-fade">
        <div class="dialog" @click="close" v-show="show">
            <div class="dialog-content" @click.stop>
                <div class="headText clearfix">
                    <h3 class="title">取消订单</h3>
                    <span class="close" @click="close">X</span>
                </div>
                <div class="body">
                    <slot name="body">
                        <h4>取消理由</h4>
                        <ul class="selectList clearfix">
                            <li v-for="(item, index) in itemData">
                                <input type="checkbox" :id="'checkbox-'+ item.id" :data-id="item.id" :value="item.value" v-model="checkValues">
                                <label :for="'checkbox-'+ item.id">{{item.value}}</label>
                            </li>
                        </ul>
                        <h4>取消原因</h4>
                        <textarea cols="80" rows="3" placeholder="请输入取消原因" v-model="textarea"></textarea>
                        <div class="prompt">当前取消订单扣除2分信用值</div>
                    </slot>
                </div>
                <div class="btn-group">
                    <span class="submitBtn" @click="submit">提交</span>
                    <span class="backBtn" @click="close">返回</span>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: [
        'show'
    ],
    data() {
        return {
            itemData: [
                { id: 1, value: '报价时间过长' },
                { id: 2, value: '价格过高' },
                { id: 3, value: '车型太少' },
                { id: 4, value: '现在不想包车' },
                { id: 5, value: '重复下单' },
                { id: 6, value: '车辆信息有误' },
                { id: 7, value: '发票有误' },
                { id: 8, value: '行程有误' },
                { id: 9, value: '联系人有误' },
                { id: 10, value: '操作太麻烦' },
                { id: 11, value: '产品体验差' },
                { id: 12, value: '服务不好' }
            ],
            checkValues: [],
            textarea: ''
        }
    },
    methods: {
        close: function() {
            this.$emit('on-close');
        },
        submit: function() {
            console.log(this.checkValues);
        }
    },
    mounted: function() {}
}
</script>

<style lang="scss">
.dialog-fade-enter, .dialog-fade-leave-active {
    opacity: 0;
}
.dialog-fade-enter-active, .dialog-fade-leave-active {
    transition: opacity .5s ease;
}
.dialog {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, .5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.dialog .dialog-content {
    position: fixed;
    box-sizing: border-box;
    padding: 10px 20px;
    width: 800px;
    min-height: 140px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    background: #fff;
    z-index: 112; 
    .title{
        font-size: 18px;
        font-weight: bold;
        float: left;
    }
    .close {
        float: right;
        width: 20px;
        height: 20px;
        border: 2px solid #333;
        border-radius: 50%;
        line-height: 1.4;
        text-align: center;
        font-weight: bold;
        cursor: context-menu;
    }
    .body, .btn-group {
        padding: 10px 20px;
    }
    .body {
        h4{
            font-size: 16px;
            font-weight: bold;
            margin: 4px 0;
        }
        textarea {
            border: 1px solid #f1f1f1;
            background: #f9f9f9;
            color: #999;
            padding: 6px 10px;
            margin: 6px 10px 0;
        }
        .prompt {
            font-size: 12px;
            color: #de5c56;
            margin-left: 20px;
        }
    }
    .btn-group {
        .submitBtn {
            background: #fe4a54;
            color: #fff;
            padding: 6px 12px;
            border-radius: 20px;
            width: 60px;
            display: inline-block;
            text-align: center;
            margin-left: 10px;
            margin-right: 5px;
        }
        .backBtn {
            background: #999;
            color: #fff;
            padding: 6px 12px;
            border-radius: 20px;
            display: inline-block;
            text-align: center;
            margin-left: 10px;
            margin-right: 5px;
        }
    }      
}
.selectList li {
    float: left;
    width: 20%;
    padding: 6px 0 10px 10px;
    box-sizing: border-box;
}
</style>
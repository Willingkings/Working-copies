<!-- 地址选择组件 -->
<template>
  <el-form :model="forms" class="demo-ruleForm address" :rules="rules" ref="forms" label-position="top">

    <el-col :span="5">
      <el-form-item prop="province">
        <el-select v-model="forms.province" placeholder="请输入省" @change="proChange">
          <el-option
            v-for="item in provinces"
            :key="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="5">
      <el-form-item  prop="city">

        <el-select v-model="forms.city" placeholder="请输入市" @change="cityChange" >
          <el-option
            v-for="item in citys"
            :key="item.value"
            :value="item.value" >
          </el-option>
        </el-select>
      </el-form-item>

    </el-col>

    <el-col :span="11">
      <el-form-item  prop="detail">

        <el-input
          placeholder="请填写详细地址"
          :number="true"
          v-model="forms.detail">
        </el-input>
      </el-form-item>

    </el-col>
  </el-form>
</template>
<script>
  import addressData from '../assets/js/addressData.js'
  // import store from '@/store/store.js'

  function formatData(data){
    var result = [];
    for(var key in data){
      result.push({
        value: key
      })
    }
    return result
  }

  export default {
    props:['isAddressTrue','forms'],
    data: function () {
      return {
        rules:{
          province:[{required:true,message:'请选择省份',trigger:'change'}],
          city:[{required:true,message:'请选择城市',trigger:'change'}],
          detail:[{required:true,message:'请填写详细地址',trigger:'change'}]
        },
        // forms:{
        //   province: this.province,
        //   city: this.city,
        //   detail: this.detail
        // },
        provinces: formatData(addressData)
      }
    },
    watch: {
      forms: {
        handler:function(val,oldVal){

        },
        deep:true
      },
      ifCheckFrom: function (val,oldVal) {
        if(val){
          this.$refs.forms.validate((valid) => {
          }) ;
        }
      }
    },
    computed: {
      citys: function (){
        return formatData(addressData[this.forms.province])
      },
      ifCheckFrom: function () {
        return this.isAddressTrue
      }
    },
    methods: {
      proChange: function (val,oldVal) {
        let _this = this;
        if(oldVal){
          _this.forms.city='';
          _this.forms.detail='';
        }
        var data = formatData(addressData[this.forms.province]);
        for(var i = 0; i<data.length; i++){
          this.$set(this.citys,i,data[i]);
        }
      },
      cityChange: function (val, oldVal) {
        let _this = this;
        if (oldVal) {
          _this.forms.detail = '';
        }
      },
    }
  }
</script>
<style>
  .address .el-form-item{margin-bottom: 0!important;margin-right: 0!important;}
</style>

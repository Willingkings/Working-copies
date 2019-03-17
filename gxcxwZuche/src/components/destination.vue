<!-- 地址选择组件 -->
<template>
  <el-form :model="forms" class="demo-ruleForm address" :rules="rules" ref="forms" label-position="top">

    <el-col :span="5">
      <el-form-item prop="overProvince">
        <el-select v-model="forms.overProvince" placeholder="请输入省" @change="proChange">
          <el-option
            v-for="item in overProvinces"
            :key="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="5">
      <el-form-item  prop="overCity">

        <el-select v-model="forms.overCity" placeholder="请输入市" @change="cityChange" >
          <el-option
            v-for="item in overCitys"
            :key="item.value"
            :value="item.value" >
          </el-option>
        </el-select>
      </el-form-item>

    </el-col>

    <el-col :span="11">
      <el-form-item  prop="overDetail">

        <el-input
          placeholder="请填写详细地址"
          :number="true"
          v-model="forms.overDetail">
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
          overProvince:[{required:true,message:'请选择省份',trigger:'change'}],
          overCity:[{required:true,message:'请选择城市',trigger:'change'}],
          overDetail:[{required:true,message:'请填写详细地址',trigger:'change'}]
        },
        // forms:{
        //   overProvince: this.overProvince,
        //   overCity: this.overCity,
        //   overDetail: this.overDetail
        // },
        overProvinces: formatData(addressData)
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
      overCitys: function (){
        return formatData(addressData[this.forms.overProvince])
      },
      ifCheckFrom: function () {
        return this.isAddressTrue
      }
    },
    methods: {
      proChange: function (val,oldVal) {
        let _this = this;
        if(oldVal){
          _this.forms.overCity='';
          _this.forms.overDetail='';
        }
        var data = formatData(addressData[this.forms.overProvince]);
        for(var i = 0; i<data.length; i++){
          this.$set(this.overCitys,i,data[i]);
        }
      },
      cityChange: function (val, oldVal) {
        let _this = this;
        if (oldVal) {
          _this.forms.overDetail = '';
        }
      },
    }
  }
</script>
<style>
  .address .el-form-item{margin-bottom: 0!important;margin-right: 0!important;}
</style>

<template>
  <div class="articles">
    <div class="tible">联系我们</div>
    <ul class="kefu" v-for="item in customService">
      <li>
        <span>公司电话：</span>
        <span>{{item.contactPhone}}</span>
      </li>
      <li>
        <span>联 系 人：</span>
        <span>{{item.customServiceName}}</span>
      </li>
      <li>
        <span>手机号码1：</span>
        <span>{{item.loginName}}</span>
      </li>
      <li>
        <span>手机号码2：</span>
        <span>{{item.phone}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
    name: "contact",
    data() {
      return {
        customService: [ ]
      }
    },
    created() {
      let _this = this;
      $.ajax({
        type: 'get',
        url: 'http://new.api.db.glchuxingwang.com/customer/customer/customService',
        dataType: 'json',
        success: function (response) {
          let res = response;
          _this.customService = res.list;
        }
      })
    },
}
</script>

<style lang="scss">
  .tible {
    font-weight: bold;
    border-bottom: 1px solid #999;
    padding-bottom: 10px;
  }
  .kefu {
    margin: 20px 0;
    border-bottom: 1px solid #ccc;
    padding-bottom: 20px;
    width: 50%;
    float: left;
    li {
      margin: 10px 0;
      span:first-child {
        width: 90px;
        display: inline-block;
      }
    }
  }
</style>

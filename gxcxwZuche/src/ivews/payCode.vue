<template>
	<div class="payBox">
    <div class="scanning">
      <h1>支付全额：<span class="moneyRed">120</span>元</h1>
      <div class="pic">
        <b>
          <img src="../assets/images/zfb.png" alt="">
          <span class="qrCode"></span>
        </b>
        <b>
          <img src="../assets/images/wx.png" alt="">
          <span class="qrCode"></span>
        </b>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "payCode"
}
</script>

<style lang="scss">
.payBox {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #EFEEF4;
  .scanning {
    width: 620px;
    margin: 80px auto;
    h1 {
      font-size: 30px;
      text-align: center;
      .moneyRed {
        color: #FE4A54;
        font-size: 60px;
        margin-right: 10px;
      }
    }
    .pic {
      margin-top: 50px;
      b{
        display: block;
        width: 310px;
        float: left;
        position: relative;
        img {
          width: 100%;
        }
        .qrCode {
          position: absolute;
          bottom: 70px;
          left: 46px;
          width: 210px;
          height: 210px;
          background: #fff;
          padding: 10px;
          display: block;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>

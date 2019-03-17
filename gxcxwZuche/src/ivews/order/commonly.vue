<template>
  <div class="feedback">
    <div class="infoBg">
      <b>常用信息</b>
    </div>
    <div class="infoCon">

    </div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="scss">
  .infoBg, .infoCon {
    background-color: #fff;
    width: 100%;
    padding: 10px 20px;
    margin-bottom: 30px;
  }
  .infoBg {
    b {
      font-size: 18px;
    }
    span {
      color: #8c8c8c;
      float: right;
    }
  }
  .infoCon {
    .head {
      padding-bottom: 10px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 10px;
    }
    .infoText {
      b {
        display: block;
        padding: 10px 0;
      }
      .cont {
        padding: 10px 0;
        p {
          width: 75%;
          float: left;
          font-size: 14px;
        }
        button {
          float: right;
          background-color: red;
          color: #fff;
          padding: 6px 14px;
          border-radius: 20px;
          border: none;
        }
      }
    }
  }
</style>


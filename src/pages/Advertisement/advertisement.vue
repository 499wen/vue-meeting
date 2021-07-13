<template>
  <div class="advertisement">
    <div class="tips">
      您已登录，5s后自动跳转进入后台，
      <span class="link">点击立即跳转</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    setTimeout( () => {
      this.$router.push('/')
    }, 5000)
  }
}
</script>

<style lang="less" scoped>
.advertisement {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/images/login-bgi.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;

  .tips {
    font-size: 20px;
    color: #fff;
  }

  .link {
    text-decoration: underline;
    cursor: pointer;
    color: #409efe;
  }
}
</style>
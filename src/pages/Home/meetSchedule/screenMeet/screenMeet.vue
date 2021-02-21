<template>
  <div class="box">
    <div class="title">
      <div class="content">2021-02-23 周二 会议安排</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang='less'>
.box {
  border: 1px solid rgb(226, 226, 226);
  border-radius: 5px;
  box-sizing: border-box;
}

.title { 
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(226, 226, 226);

  .content {
    width: 100%;
    height: 33px;
    line-height: 33px;
    box-sizing: border-box;
    text-align: center;
    font-size: 15px;
    color: #fff;
    border-radius: 5px;
    background-color: #e6a23c;
  }

}
</style>
<template>
  <div class="home" v-if="show">
    <div class="meet-about">
      <!-- 会议信息 -->
      <div class="meet-info">
        <meetInfo></meetInfo>
      </div>
 
      <!-- 会议日程 -->
      <div class="meet-schedule">
        <meetSchedule></meetSchedule> 
      </div>
    </div> 
    <div class="bottom">
      <!-- 请假消息 -->
      <div class="leave-mess">
        <leaveMess></leaveMess>
      </div>

      <!-- 未召开会议 -->
      <div class="notheld-meet">
        <notheldMeet></notheldMeet>
      </div>
    </div>
  </div>
</template>

<script>
import Home from './home.js'

export default Home
</script>

<style scoped lang='less'>
@import url('./home.less');
</style>
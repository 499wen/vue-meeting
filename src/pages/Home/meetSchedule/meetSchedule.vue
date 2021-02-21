<template>
  <div>
    <div class="header-opera special">
      <div class="tap">
        <span>会议日程</span> 
      </div>

      <div class="look-more" @click="more">查看更多>>></div>
    </div>

    <!-- 日历 - 会议 -->
    <div class="cale-meet">
      <!-- 日历 -->
      <div class="calendar">
        <calendar></calendar>
      </div>

      <!-- 日历筛选会议 -->
      <div class="screen-meet">
        <screenMeet></screenMeet>
      </div>
    </div>
  </div> 
</template>

<script>
import meetSchedule from "./meetSchedule.js";

export default meetSchedule;
</script>

<style scoped lang='less'>
@import url("./meetSchedule.less");
</style>
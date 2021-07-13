<template>
  <div>
    <div class="header-opera">
      <div class="tap">
        <span>未召开会议</span> 
      </div>
    </div>

    <!-- 未召开会议列表 -->
    <div class="list-noheld">
      <div class="single-data" v-for="(item, idx) in filterData" :key="idx">
        <span class="tips-title qiu">会议名称:</span>
        <span class="tips-cte">{{ item.meetingName }}</span>
        <span class="tips-title">会议日期:</span>
        <span class="">{{ item.meetTime }}</span>
      </div>
    </div>

  </div>
</template>

<script>
import notheldMeet from "./notheldMeet.js";

export default notheldMeet;
</script>
 
<style scoped lang='less'>
@import url("./notheldMeet.less");
</style>
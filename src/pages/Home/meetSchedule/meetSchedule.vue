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
        <div class="title">
          <div class="content">{{ date }} 会议安排</div>
          <div class="meet-cte" v-show="meetList.length">
            <div class="single-meet" v-for="(item, idx) in meetList" :key="idx">
              <div class="row-meet">
                <span class="meet-tips">会议名称：</span>
                <span class="tips-cte">{{ item.meetingName }}</span>
              </div>
              <div class="row-meet">
                <span class="meet-tips">会议地点：</span>
                <span class="tips-cte">{{ item.address }}</span>
              </div>
              <div class="row-meet">
                <span class="meet-tips">会议时间：</span>
                <span class="tips-cte">{{ item.meetTime }}</span>
              </div>
            </div>
          </div>
          <div class="no-meet meet-cte" v-show="!meetList.length">
            今日没有会议安排...
          </div>
        </div>
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
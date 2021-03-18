<template>
  <div class="box">
    <div class="title">
      <div class="content">
        <i class="el-icon-arrow-left" @click="prevMonth"></i>
        <div>
          <span class="particular-year" title="点击选择年份" @click="showYear">{{ year }}年</span>
          <span class="particular-month" title="点击选择月份" @click="showMonth">{{ month }}月</span>
        </div>
        <i class="el-icon-arrow-right" @click="nextMonth"></i>
 
        <!-- 返回今日 - 非当前月份显示 -->
        <div class="to-day" v-show="notCurTime" @click="backToday"> 返回今日</div>

        <!-- 隐藏 - 选择年份 -->
        <div class="hidden-year" :style="{height: calenHeight + 'px'}"
         v-show='hidden_year' tabindex="1">
          <span v-for="(item, i) in years" :key="i" @click="choiceYear(item)"
           :style="{height: gridYear + 'px'}" :class="['span-month', year == item && 'cur-month']">{{ item }}年</span>
        </div>
        
        <!-- 隐藏 - 选择月份 -->
        <div class="hidden-month" :style="{height: calenHeight + 'px'}"
         v-show="hidden_month" tabindex="1">
          <!-- <span class="to-day">返回今日</span> -->
          <span v-for="(item, i) in 12" :key="i" @click="choiceMonth(item)"
           :style="{height: gridMonth + 'px'}" :class="['span-month', month == item && 'cur-month']">{{ item }}月</span>
        </div>
      </div>
    </div>

    <!-- 日历 -->
    <div class="show-calendar">
      <!-- 星期 -->
      <div class="week">
        <span class="week-box" v-for="(week, i) in week" :key="i">{{ week }}</span>
      </div>

      <!-- 天号 -->
      <div class="days" v-for="(day, i) in days" :key="i">
        <!-- class 优先级 select-day = notCurmonth > axist-meet > weekend > days-box -->
        <span :class="['days-box',
          item.is_weekend && 'weekend',
          item.is_axistMeet && 'axist-meet',
          item.select && 'select-day', 
          item.monthType != 'cur' && 'notCurmonth']" 
          @click="clickDay(item)"
          v-for="(item, idx) in day" :key="idx">
            {{ item.day }}
            <span class="tips" v-if="item.is_axistMeet">{{ item.meetNum }}</span>
          </span>
      </div>
    </div>
  </div>
</template>

<script>
import calendar from './calendar.js'

export default calendar
</script>

<style scoped lang='less'>
@import url('./calendar.less');
</style>
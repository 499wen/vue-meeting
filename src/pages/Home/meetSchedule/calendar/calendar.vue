<template>
  <div class="box">
    <div class="title">
      <div class="content">
        <i class="el-icon-arrow-left"></i>
        <span>{{ year + '年 ' + month + '月' }}</span>
        <i class="el-icon-arrow-right"></i>
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
        <!-- class 优先级 select-day = notCurmonth > weekend > days-box -->
        <span :class="['days-box',
          item.is_weekend && 'weekend',
          item.select && 'select-day', 
          item.monthType != 'cur' && 'notCurmonth']" 
          @click="clickDay(item)"
          v-for="(item, idx) in day" :key="idx">{{ item.day }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { selfTime } from '@/plugins/plugins.js'
/**
 *  days:
 *    day: 天号 
 *    select: 当前选中天号
 *    is_weekend: 是否双休 
 *    is_axistMeet: 是否存在会议 
 *    timestamp: 时间戳 
 *    date: 日期 
 *    monthType: 月份类型 (prev: 上月, cur: 当月, next: 下月)
 */
export default {
  data() {
    return {
      week: ['日', '一', '二', '三', '四', '五', '六'],
      days: [],
      year: '',
      month: '',
      day: ''
    }
  },
  methods: {
    // 点击天号
    clickDay(data){
      if(data.monthType == 'cur'){
        // console.log(data)
        let days = this.days
        days.filter(item => {
          item.filter(i => (i.day == data.day && i.monthType == 'cur') ? i.select = true : i.select = false)
        })
      }
    },
    // 根据年月 获取展示天号  42天
    getDayNum(year, month, day){
      let dayArr = [], // 保存天号
        timestamp = '' // 记录时间戳
      const Yi = new Date(year, month - 1, 1) // 获取1号时间
      // 获取上月残留天号
      if(Yi.getDay() != 0){
        const PrevMonth = new Date(year, month - 1, 0).getDate()

        for(let i = PrevMonth; i > (PrevMonth - Yi.getDay()); i--){
          timestamp = new Date(year, month - 2, i).getTime()

          // 往头部追加 
          dayArr.unshift({
            timestamp, 
            select: false,
            day: i, 
            is_weekend: false,
            is_axistMeet: false,
            date: selfTime(timestamp),
            monthType: 'prev'
          })
        }
      }

      // 获取本月天号
      const dayNum = new Date(year, month, 0).getDate()
      for(let i = 1; i <= dayNum; i++) {
        let timeObj = new Date(year, month - 1, i)
        timestamp = timeObj.getTime()

        // 往头部追加 
        dayArr.push({
          timestamp, 
          day: i, 
          select: day == i ? true : false,
          is_weekend: (timeObj.getDay() == 0 || timeObj.getDay() == 6) ? true : false,
          is_axistMeet: false,
          date: selfTime(timestamp),
          monthType: 'cur'
        })
      }

      // 获取下月多余天号
      const NextMonth = 42 - Yi.getDay() - dayNum
      for(let i = 1; i <= NextMonth; i++){
        timestamp = new Date(year, month - 2, i).getTime()

        // 往头部追加 
        dayArr.push({
          timestamp, 
          day: i, 
          select: false,
          is_weekend: false,
          is_axistMeet: false,
          date: selfTime(timestamp),
          monthType: 'next'
        })
      }

      let days = []
      for(let i = 0; i < dayArr.length; i++){
        let idx = Math.floor(i / 7)
        if(!days[idx]){
          days[idx] = []
        }
        days[idx].push(dayArr[i])
      }

      this.days = days
      // console.log(JSON.stringify(dayArr, false))
    }
  },
  mounted() {
    let curDate = new Date()
    this.year = curDate.getFullYear()
    this.month = curDate.getMonth() + 1
    this.day = curDate.getDate()
    this.getDayNum(this.year, this.month, this.day)
  }
};
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
  // border-bottom: 1px solid rgb(226, 226, 226);

  .content {
    width: 100%;
    height: 33px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    font-size: 15px;
    color: #333;
    border-radius: 5px;
    background-color: #d1ecfb;
    padding: 0 20px;

    & > i {
      font-size: 20px;
      font-weight: 700;
      cursor: pointer;
      color: #5e7a88;
    }
  }

}

.show-calendar {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  height: calc(100% - 53px);

  .week {
    width: 100%;
    height: 40px;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: default;
  }

  .week-box, .days-box {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: #333;
    text-align: center;
    line-height: 30px;
  }

  .days-box:hover {
    background-color: #eee;
  }

  // 双休
  .weekend {
    color: #ed6151;
  }

  .weekend:hover {
    background-color: #ed615121;
  }

  // 选中的天号
  .select-day {
    background-color: #e6a23c;
    color: #fff;
  }

  .select-day:hover {
    background-color: #e6a23c;
    color: #fff;
  }

  // 非当月
  .notCurmonth {
    cursor: default !important;
    color: #ccc !important;
  }

  .notCurmonth:hover {
    background-color: #fff;
  }

  .days {
    height: calc(100% - 40px);
    flex-wrap: wrap;
    height: 40px;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    align-content: center;
    justify-content: space-between;
    cursor: pointer;
  }
}
</style>
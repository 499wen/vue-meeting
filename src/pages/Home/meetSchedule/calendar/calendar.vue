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
import { selfTime } from '@/plugins/plugins.js'
let curDate = new Date() // 当前时间对象
/**
 *  days:
 *    day: 天号 
 *    select: 当前选中天号
 *    is_weekend: 是否双休 
 *    is_axistMeet: 是否存在会议 
 *    meetNum: 存在会议数量
 *    timestamp: 时间戳 
 *    date: 日期 
 *    monthType: 月份类型 (prev: 上月, cur: 当月, next: 下月)
 */
export default {
  data() {
    return {
      years: [],

      week: ['日', '一', '二', '三', '四', '五', '六'],
      days: [],
      year: '',
      month: '',
      day: '',
      curTime: { year: '', month: '', day: ''},

      calenHeight: null,
      gridMonth: null,
      gridYear: null,
      
      hidden_year: false,
      hidden_month: false,

    }
  },
  computed: {
    // 不是当前时间
    notCurTime: function(){
      let year = curDate.getFullYear(),
        month = curDate.getMonth() + 1
      
      return !(this.year == year && this.month == month) ? true : false
    }
  },
  methods: {
    // 展示 - 年份选择
    showYear(){
      this.hidden_year = true
      setTimeout(() => {
        // 获取grid块的宽度
        let gridMonth = document.querySelector('.hidden-year span')
        this.gridYear = gridMonth.offsetWidth / 2

        let yearDom = document.querySelector('.hidden-year')
        yearDom.focus()
        yearDom.onblur = (e) => {
          this.hidden_year = false
        }
      }, 50)

    },
    // 选择年份
    choiceYear(y){
      this.year = y
      this.getDayNum(this.year, this.month)

      this.hidden_year = false
    },

    // 展示 - 月份选择
    showMonth(){
      this.hidden_month = true
      setTimeout(() => {
        // 获取grid块的宽度
        let gridMonth = document.querySelector('.hidden-month span')
        this.gridMonth = gridMonth.offsetWidth

        let monthDom = document.querySelector('.hidden-month')
        monthDom.focus()
        monthDom.onblur = (e) => {
          this.hidden_month = false
        }
      }, 5)
    },
    // 选择月份
    choiceMonth(m){
      this.month = m
      this.getDayNum(this.year, this.month)

      this.hidden_month = false
    },

    // 上个月
    prevMonth(){
      if(this.month == 1){
        this.year --
        this.month = 12
      } else {
        this.month --
      }

      // 重置日历
      this._shareFun()
    },
    // 下个月
    nextMonth(){
      if(this.month == 12){
        this.year ++
        this.month = 1
      } else {
        this.month ++
      }

      // 重置日历
      this._shareFun()
    },
    _shareFun(){
      let {year, month, day} = this.curTime

      // 初始化日历
      if(this.year == year && this.month == month){
        this.getDayNum(year, month, day)
      } else {
        this.getDayNum(this.year, this.month)
      }
    },
    // 返回当天
    backToday(){
      this.year = curDate.getFullYear()
      this.month = curDate.getMonth() + 1
      this.day = curDate.getDate()
      this.curTime = {
        year: this.year,
        month: this.month,
        day: this.day
      }

      this.getDayNum(this.year, this.month, this.day)
    },
    // 点击天号
    clickDay(data){
      // 当月日历才有效果
      if(data.monthType == 'cur'){
        // console.log(data)
        let days = this.days
        this.curTime = {
          year: this.year,
          month: this.month,
          day: data.day
        }

        days.filter(item => {
          item.filter(i => (i.day == data.day && i.monthType == 'cur') ? i.select = true : i.select = false)
        })
      }
    },
    // 根据年月 获取展示天号  
    getDayNum(year, month, day){
      let dayArr = [], // 保存天号
        timestamp = '', // 记录时间戳
        showDaynum = 42 // 展示42天日历
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
          meetNum: 0,
          date: selfTime(timestamp),
          monthType: 'cur'
        })
      }

      // 获取下月多余天号
      const NextMonth = showDaynum - Yi.getDay() - dayNum
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

      // 最终日历数据
      this.days = days
      // console.log(JSON.stringify(dayArr, false))
    }
  },
  mounted() {
    // 初始化日历
    this.backToday()

    // 获取日历盒子的高度
    let calendar = document.querySelector('.show-calendar')
    this.calenHeight = calendar.offsetHeight

    let curYear = curDate.getFullYear() + 4
    for(let i = 1; i <= 20; i++){
      this.years.unshift(curYear - i)
    }

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
    position: relative;

    .to-day {
      font-size: 13px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50px;
      width: 70px;
      height: 23px;
      border-radius: 50px;
      border: 1px solid #777;
      text-align: center;
      line-height: 23px;
      margin: auto;
      box-sizing: border-box;
      cursor: pointer;
    }

    .hidden-year, .hidden-month {
      position: absolute;
      top: 33px;
      left: 0;
      height: 180px;
      width: 100%;
      background-color: #fff;
      border-radius: 0 0 5px 5px;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: flex-start;
      overflow-y: auto;
      outline: none;
      box-shadow: 1px 2px 10px 2px #eee;

      .span-month {
        width: calc(25% - 7.25px);
        margin-bottom: 10px;
        background-color: #ccc;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333;
        font-size: 18px;
        cursor: pointer;
        letter-spacing: 1px;
        transition: all 0.5s;
      }

      .cur-month {
        background-color: #e6a23c;
        color: #fff;
      }

      .span-month:hover {
        background-color: #e6a23c;
        color: #fff;
      }
      

    }

    .hidden-year .span-month {
      letter-spacing: 0px;
      font-size: 16px;
    }

    .particular-month, .particular-year {
      cursor: pointer;
      margin: 0 5px;
    }

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
    background-color: #d1ecfb;
  }

  // 双休
  .weekend {
    color: #ed6151;
  }

  .weekend:hover {
    background-color: #ed615121;
  }

  // 存在会议
  .axist-meet {
    background-color: #d1ecfb;
    position: relative;
  }

  .axist-meet .tips {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #ff0000;
    color: #fff;
    font-size: 12px;
    text-align: center;
    line-height: 14px;
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
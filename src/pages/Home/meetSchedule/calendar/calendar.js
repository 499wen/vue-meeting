import { mapState, mapMutations } from 'vuex'
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
    },
    // 未召开会议
    ...mapState([
      'notheldMeet'
    ])
  },
  methods: {
    ...mapMutations([
      'setCalendarTime'
    ]),
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

      // 更新当天时间戳
      this.setCalendarTime(new Date(`${this.year}-${this.month}-${this.day}`).getTime())
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
        console.log(`${this.year}-${this.month}-${data.day}`)

        this.setCalendarTime(new Date(`${this.year}-${this.month}-${data.day}`).getTime())
      }
    },
    // 根据年月 获取展示天号  
    getDayNum(year, month, day = 1){
      console.log(year, month, day)
      let dayArr = [], // 保存天号
        timestamp = '', // 记录时间戳
        showDaynum = 42, // 展示42天日历
        todayYear = curDate.getFullYear(),
        todayMonth = curDate.getMonth() + 1
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
        // 当天之前 不作标识
        let meetNum = 0

        // && new Date().getDate() <= i
        if(year >= todayYear && month >= todayMonth){
          meetNum = this.hdNomeet(timestamp)
        }
        // 往头部追加 
        dayArr.push({
          timestamp, 
          day: i, 
          select: day == i ? true : false,
          is_weekend: (timeObj.getDay() == 0 || timeObj.getDay() == 6) ? true : false,
          is_axistMeet: meetNum != 0,
          meetNum: meetNum,
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
    },

    // 处理未召开会议数据
    hdNomeet(timestamp) {
      console.log(timestamp)
      let n = 0
      this.notheldMeet.filter(item => {
        
        if(item.lowerT <= timestamp && timestamp <= item.upperT){
          n++
        }
      })

      return n
    }
  },
  mounted() {
    console.log(this.notheldMeet)
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
import calendar from './calendar/calendar.vue'
import screenMeet from './screenMeet/screenMeet.vue'

import { mapState } from 'vuex'
import { selfTime } from '@/plugins/plugins.js'

export default {
  components: {
    calendar,
    screenMeet
  },
  data() {
    return {
      date: null,
      meetList: []
    }
  },
  computed: {
    ...mapState([
      'calendarTime',
      'notheldMeet'
    ])
  },
  methods: {
    // 查看更多
    more(){
      
    },
    // 根据时间戳 转换日期
    tsToDate(timeStamp) {
      var date = new Date(timeStamp);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate(); 
      m = m < 10 ? ("0" + m) : m;
      d = d < 10 ? ("0" + d) : d;
      var week;
      switch(date.getDay()) {
        case 0: week = '周日'; break;
        case 1: week = '周一'; break;
        case 2: week = '周二'; break;
        case 3: week = '周三'; break;
        case 4: week = '周四'; break;
        case 5: week = '周五'; break;
        case 6: week = '周六'; break;
      }

      return y + "-" + m + "-" + d + ' ' + week
    },


    // 根据时间戳 筛选会议
    screenMeet(time) {
      this.meetList = []
      this.notheldMeet.filter(item => {
        if(item.lowerT <= time && time <= item.upperT){
          
          this.meetList.push(item)
        }
      })
    }
  },
  mounted() {
    this.date = this.tsToDate(this.calendarTime)

    // 筛选会议
    this.screenMeet(this.calendarTime)
  },
  watch: {
    calendarTime: function(val) {
      this.date = this.tsToDate(val)
      this.screenMeet(val)
    }
  }
}
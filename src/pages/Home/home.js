import meetInfo from './meetInfo/meetInfo.vue'
import meetSchedule from './meetSchedule/meetSchedule.vue'
import leaveMess from './leaveMess/leaveMess.vue'
import notheldMeet from './notheldMeet/notheldMeet.vue'

import { mapMutations } from 'vuex'

export default {
  components: {
    meetInfo,
    meetSchedule,
    leaveMess,
    notheldMeet
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    /**
     * vuex
     * 保存未召开会议数据
     * 设置时间戳
     **/ 
    ...mapMutations([
      'setNotheldMeet',
      'setCalendarTime'
    ]),

    /**
     * 处理时间 
     * @param {*} form 
     *    st: 开始时间
     *    et: 结束时间
     * @param {*} date
     *    时间戳 
     * 
     */
    ymd(form, date) {
      date = new Date(date);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate(); 
      var h = date.getHours();
      var m1 = date.getMinutes();
      var s = date.getSeconds();

      if(form == 'et' && (h == m1 == s == 0)) {
        return new Date(y + "-" + m + "-" + (d)).getTime() - 1000
      } else if(form == 'et'){
        return new Date(y + "-" + m + "-" + (d + 1)).getTime() - 1000
      }
      return new Date(y + "-" + m + "-" + d).getTime()
    },

    // 处理时间 eg: 1615651200000 - 1617120000000 -> 2021-03-14 00:00 至 23:59
    hdTime(st, et) {
      var st = new Date(st);
      var y = st.getFullYear();
      var m = st.getMonth() + 1;
      var d = st.getDate(); 
      var h = st.getHours();
      var m1 = st.getMinutes();
      m = m < 10 ? ("0" + m) : m;
      d = d < 10 ? ("0" + d) : d;
      h = h < 10 ? ("0" + h) : h;
      m1 = m1 < 10 ? ("0" + m1) : m1;

      var et = new Date(et)
      var eh = et.getHours();
      var em = et.getMinutes();
      eh = eh < 10 ? ("0" + eh) : eh;
      em = em < 10 ? ("0" + em) : em;
  
      if(eh == '00' && em == '00'){
        eh = '23'
        em = '59'
      }

      return y + "-" + m + "-" + d + " " + h + ":" + m1 + " 至 " + eh + ":" + em
    },
  },
  created() {
    // 设置时间戳
    this.setCalendarTime(new Date().getTime())

    // 获取未召开会议 数据
    this.$http.get(this.API.meetingsPageAndStateCode(4, 1, 999, ''))
      .then(res => {
        if(res.code == '000' && res.data) {
          res.data.filter(item => {
            item.meetTime = this.hdTime(item.beginDate, item.endDate)
            item.lowerT = this.ymd('st', item.beginDate)
            item.upperT = this.ymd('et', item.endDate)
          })
          this.setNotheldMeet(res.data)

          this.show = true
        }
      })
  }
};
import { selfTime } from '@/plugins/plugins.js'

export default {
  data() {
    return {
      height: null,
      tableData: [],
      tableCate: [
        // {props: 'meetingName', label: '会议名称', width: '190'},
        // {props: 'meetingName', label: '会议时间', width: ''},
        {props: 'inviteNumber', label: '通知人数', width: '80'},
        {props: 'confirmAttendanceNum', label: '确认参会', width: '80'},
        {props: 'actualNumberOfPeople', label: '已签到', width: '70'},
        {props: 'leaveNumber', label: '请假', width: '60'},
      ]
    }
  },
  methods: {
    // 查看更多
    more(){
      this.$router.push({
        path: '/info_more',
        query: { msg: '会议信息'}
      })
    },

    // 获取参会人报到数据
    getAttenData(){
      this.$http.get(this.API.findMeetingStatistical(1, 10, ''))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter((item, idx) => {
              var time = selfTime(new Date(item.beginDate).getTime())
              var st = selfTime(new Date(item.beginDate).getTime(), true, true, true)
              var et = selfTime(new Date(item.endDate).getTime(), true, true, true)
              item.number = idx + 1
              item.time = time
              item.beginAndEndDate = st + ' - ' + et;
            })
            this.tableData = res.data
          } else {
            this.tableData = []
          }
        })
    }
  },
  mounted() {
    // 获取表格高度
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取参会人报到数据
    this.getAttenData()
  }
}
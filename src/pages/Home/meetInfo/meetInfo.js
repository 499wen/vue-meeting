export default {
  data() {
    return {
      height: null,
      tableData: [],
      tableCate: [
        {props: 'meetingName', label: '会议名称', width: '190'},
        {props: 'meetingName', label: '会议时间', width: ''},
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
    }
  },
  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight
  }
}
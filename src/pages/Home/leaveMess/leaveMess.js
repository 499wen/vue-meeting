export default {
  data() {
    return {
      height: null,
      tableData: [],
      tableCate: [
        {props: 'meetingName', label: '请假会议', width: ''},
        {props: 'userName', label: '请假人', width: '140'},
        {props: 'leaveReason', label: '事由', width: ''},
        {props: 'stateCode', label: '审批状态', width: ''},
      ]
    }
  },
  methods: {
    // 查看更多
    more(){
      this.$router.push({
        path: '/info_more',
        query: { msg: '请假消息'}
      })
    }
  },
  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight
  }
}
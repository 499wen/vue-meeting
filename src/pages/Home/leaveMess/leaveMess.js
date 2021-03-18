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
    },

    // 获取请假数据
    getLeave() {
      this.$http.get(this.API.findleaveInfo(2, 1, 10))
        .then(res => {
          if(res.code == '000' && res.data){
            this.tableData = res.data
          } else {
            this.tableData = []
          }
        })
    }
  },
  mounted() {
    // 表格高度
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取请假数据
    this.getLeave()
  }
}
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
      console.log(1123)
      return 
      this.$router.push({
        path: '/info_more',
        query: { msg: '请假消息'}
      })
    },

    // 获取请假数据
    getLeave() {
      var arr = ['待审批', '通过', '不通过']
      this.$http.get(this.API.findleaveInfo(2, 1, 10))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter(obj => {
              obj.userName = obj.user.userName
              obj.meetingName = obj.meeting.meetingName
              if (!obj.leaveReason) {
                obj.leaveReason = "(无)"
              } 
              obj.stateCode = obj.approvalState == 0 ? arr[obj.approvalState] : arr[obj.approvalResultCode]
            })
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
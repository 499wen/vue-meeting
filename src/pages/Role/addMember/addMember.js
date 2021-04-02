export default {
  data() {
    return {
      searchKey: '',
      tableCate: [
        {value: 'userName', label: '姓名'},
        {value: 'sex', label: '性别'},
        {value: 'phone', label: '电话'},
      ],
      tableData: [],
      height: null,
      total: 0,
      pageNum: 1,
      pageSize: 300,

      batch: []
    }
  },
  methods: {
    // 分页
    sizeChange(val){
      this.pageNum = 1 
      this.pageSize = val
    },
    curChange(val){
      this.pageNum = val

      this.getPerson()
    },

    // 表格勾选回调
    batchDel(val){
      this.batch = val
    },

    // 搜索按钮
    searchBtn(){
      this.pageNum = 1 
      this.getPerson()
    },

    // 查询人员
    getPerson() {
      let deparmentId = this.loginInfo.companyId,
      obj = {
        contanUserIdArr: [],
        ifContanUserIdArr: false,
        queryConditionArr: []
      }
      this.$http.post(this.API.conditionQuerys(deparmentId, this.pageNum, this.pageSize, '', this.searchKey, 2), obj)
        .then(res => {
          if(res.code == '000') {
            this.tableData = res.data
            this.total = res.count
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    }
  },
  mounted() {
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    // 获取表格高度
    var dom = document.querySelector('.member-table')
    this.height = dom.offsetHeight

    // 获取人员
    this.getPerson()
  }

};
import detailed from './detailed/detailed.vue'
import { selfTime, exportToExcel } from '@/plugins/plugins.js'

export default {
  components: {
    detailed
  },
  data() {
    return {
      // table
      height: null,
      tableData: [],
      tableCate: [
        // {props: 'type', label: '交易类型', width: '130'},
        {props: 'channel', label: '交易渠道', width: '130'},
        {props: 'transaction', label: '交易金额(元)', width: '120'},
        {props: 'description', label: '交易明细', width: ''},
        {props: 'availableBalance', label: '余额(元)', width: '120'},
        {props: 'time', label: '支付时间', width: '160'},
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      // 当前选中
      row: {},

      // 子组件 开关
      detailed_child: false,
    }
  },
  methods :{
    openDetailed(row) {
      this.row = {...row}
      this.detailed_child = true
    },
    // tree - 点击触发
    treeClick(data, node){
      
    },

    // 子组件方法
    cancel() {
      this.detailed_child = false
    },

    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val
      this.getData()
    },
    curChange(val){
      this.pageNum = val

      this.getData()
    },
    // 获取数据
    getData() {
      this.$http.get(this.API.getDetails(this.pageNum, this.pageSize, '1'))
      .then(res => {
        console.log(res)
        if(res.code == '000'){
          res.data.filter(its => {
            its.type = its.transactionType == 0 ? '消费' : '充值'
            its.channel = its.tradingChannels == 0 ? '余额支付' : '扫码支付'
            its.time = selfTime(its.creationTime, true)
            its.transaction = its.transactionType == 0 ? '-' + its.expenditure : '+' + its.Entry
          })

          let tHeader = [], filterVal = []
          this.tableCate.filter(its => {
            tHeader.push(its.label)
            filterVal.push(its.props)
          })

          this.tableData = res.data
          this.total = res.total
        } else {
          this.tableData = []
          this.total = 0
        }
      })
    }
  },
  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    this.getData()
  }
}
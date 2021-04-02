import { dataScrollLoad } from '@/plugins/plugins.js'

export default {
  props: ['row'],
  data() {
    return {
      tableCate: [
        {value: 'customerName', label: '姓名'},
        {value: 'sex', label: '性别'},
        {value: 'phone', label: '电话'},
      ],
      tableData: [],
      height: null,
      
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
    },

    // 表格勾选回调
    batchDel(val){
      this.batch = val
    },
  },
  mounted() {
    var dom = document.querySelector('.member-table')
    this.height = dom.offsetHeight

    let table_scroll = document.querySelector('.member-table .el-table__body-wrapper')
    dataScrollLoad(table_scroll, this.row.Customers || [], 1, 30, (data) => {
        this.tableData = data
    })
  },

};
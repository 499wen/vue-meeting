import { selfTime, exportToExcel } from '@/plugins/plugins.js'
import { exportFile } from './exportFile.js'

export default {
  data() {
    return {
      // tree
      data: [
        { id: 1, groupName: '明细列表',
          children: [
            { id: 3, groupName: '版本费用', tips: '版本', children: []},
            { id: 4, groupName: '短信费用', tips: '短信', children: []},
          ]
        },
      ],
      treeProps: {
        children: 'children',
        label: 'groupName'
      },
      curTree: {
        groupName: "短信费用",
        id: 4,
        tips: '短信'
      },

      // table
      height: null,
      tableData: [],
      tableCate: [
        {props: 'groupName', label: '短信类型', width: ''},
        {props: 'channel', label: '支付方式', width: ''},
        {props: 'title', label: '短信名称', width: ''},
        {props: 'total', label: '总数', width: ''},
        {props: 'totalAmount', label: '总金额(元)', width: ''},
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      // 查询类型
      type: 'all',
      typeVal: '全部',
      code: '',

      // 类型列表
      typeList: [
        // {label: '消费', value: '0', select: false},
        // {label: '充值', value: '1', select: false},
        // {label: '全部', value: 'all', select: true},
      ]
    }
  },
  methods: {
    // tree - 点击触发
    treeClick(data, node){
      console.log(data, node)
      this.curTree = data
      // no_click 点击不作效果 
      // if(data.no_click) return 
      if(data.tips == '版本'){
        this.versionData()
      } else 
      // 查询全部
      if(data.tips == '短信'){
        this.code = data.typeCode || ''
        this.getcost(data.typeCode)
      }
    },
    // tree - 树结构
    renderContent(h, { node, data, store }) {
      if(node.level == 1){
        return (
          <span class="custom-tree-node">
            <span class=''>{node.label}</span>
          </span>);
      }
      return (
        <span class="custom-tree-node">
          <span class='clrol'>{node.label}</span>
        </span>);
    },
    // 点击下拉
    handleClick(row){
      console.log(row)
      this.typeList.filter(its => its.select = false)
      row.select = true

      this.type = row.value
      this.typeVal = row.label
      this.getcost()
    },
    // 导出报表
    exportExcel() {
      if(this.tableData.length == 0){
        this.$message.error('没有数据可以导出！')
        return 
      }
      exportFile(this.curTree, this.tableCate, this.code)
    },

    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val

      if(this.curTree.tips == '版本'){
        this.versionData()
      } else 
      // 查询全部
      if(this.curTree.tips == '短信'){
        this.code = data.typeCode || ''
        this.getcost(data.typeCode)
      }
    },
    curChange(val){
      this.pageNum = val

      if(this.curTree.tips == '版本'){
        this.versionData()
      } else 
      // 查询全部
      if(this.curTree.tips == '短信'){
        this.code = data.typeCode || ''
        this.getcost(data.typeCode)
      }
    },
    // 版本数据
    versionData(){
      this.tableCate = [
        {props: 'channel', label: '支付方式', width: ''},
        {props: 'description', label: '描述', width: ''},
        {props: 'expenditure', label: '费用', width: ''},
        {props: 'time', label: '支付时间', width: ''},
      ]
      this.$http.get(this.API.findSysReplace(this.pageNum, this.pageSize))
        .then(res => {
          if(res.code == '000') {
            res.data.filter(its => {
              // its.type = its.transactionType == 0 ? '消费' : '充值'
              its.channel = its.tradingChannels == 0 ? '余额支付' : '扫码支付'
              its.time = selfTime(its.creationTime, true)
              // its.transaction = its.transactionType == 0 ? '-' + its.expenditure : '+' + its.Entry

            })
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    },
    // 获取短信数据
    getcost() {
      console.log('getcost')
      this.tableCate = [
        {props: 'groupName', label: '短信类型', width: ''},
        {props: 'meetingName', label: '会议名称', width: ''},
        {props: 'title', label: '短信名称', width: ''},
        {props: 'total', label: '总数', width: ''},
        {props: 'totalAmount', label: '总金额(元)', width: ''},
      ]
      this.$http.get(this.API.smsStatistics(this.pageNum, this.pageSize, this.code))
        .then(res => {
          console.log(res)
          if(res.code == '000') {
            // res.data.filter(its => {
            //   its.type = its.transactionType == 0 ? '消费' : '充值'
            //   its.channel = its.tradingChannels == 0 ? '余额支付' : '扫码支付'
            //   its.time = selfTime(its.creationTime, true)
            //   its.transaction = its.transactionType == 0 ? '-' + its.expenditure : '+' + its.Entry

            // })

            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    },
    // 获取短信分类
    getSmsCate() {
      this.$http.get(this.API.findCompanySmsGroup)
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter(its => its.tips = '短信')
            this.data[0].children[1].children = res.data.sort((cur, next) => cur.sortNum - next.sortNum)
            document.querySelector('.el-tree-node__content').style = `
              background-color: #e67c7c;
              color: #fff
            `
          } else {
            this.data[0].children = []
          }
        })
    },

    // 获取短信
    getData() {
      this.$http.get(this.API.smsStatistics(1, 10, '1'))
      .then(res => {
        console.log(res)
        if(res.code == '000'){
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

    // 获取短信分类
    this.getSmsCate()

    // 查询费用明细
    this.getcost()

    // 默认高亮
    this.$refs['tree'].setCurrentKey('4')
  }
}
import detail from './detail/detail.vue'

export default {
  components: {
    detail
  },
  data() {
    return {
      // tree
      data: [
        { id: 1, groupName: '全部短信',
          children: []
        }
      ],
      treeProps: {
        children: 'children',
        label: 'groupName'
      },

      // table
      height: null,
      tableData: [],
      tableCate: [
        { label: '短信类别', prop: 'groupName', width: 150 },
        { label: '标题', prop: 'title', width: 260 },
        { label: '描述', prop: 'description', width: '' },
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 20,

      // 子集组件 开关
      smsDetail_child: false,

      // 详情数据
      detail: {}
    }
  },
  methods: {
    // 添加短信模板
    addRole(){

    },
    // tree - 点击触发
    treeClick(data, node){
      console.log(data)
      // 查询全部
      if(node.level == 1){
        this.getSms()
      } else {
        this.getSms(data.typeCode)
      }
    },
    // tree - 树结构
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
        </span>);
    },

    // 改变启用状态
    updateSmsIsUse(item){
      let isUse = item.isUse == '0' ? '1' : '0'
      this.$http.post(this.API.updateSmsIsUse(item.cid, isUse))
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            this.$message.success('状态修改成功！')
            this.getSms()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    // 短信详情
    smsDetail(data){
      this.detail = data
      this.smsDetail_child = true
    },

    // 子组件方法
    submitForm(){
      
    },

    // 分页方法
    sizeChange(val){
      this.pageSize = val
    },
    curChange(val){
      this.pageNum = val
    },

    // 获取短信分类
    getSmsCate() {
      this.$http.get(this.API.findCompanySmsGroup)
        .then(res => {
          if(res.code == '000' && res.data){
            this.data[0].children = res.data
          } else {
            this.data[0].children = []
          }
        })
    },

    // 获取短信
    getSms(typeCode = undefined){
      let api
      if(!typeCode){
        api = this.API.findAllSms(this.pageNum, this.pageSize)
      } else {
        api = this.API.findCompanySmsType(typeCode, this.pageNum, this.pageSize)
      }

      this.$http.get(api)
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter(item => {
              item.use = item.isUse == 0 ? true : false
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
    // 获取表格高度
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取短信分类
    this.getSmsCate()

    // 获取短信
    this.getSms()
  }
}
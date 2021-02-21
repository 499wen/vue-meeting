
export default {
  data() {
    return {
      // tree
      data: [
        { id: 1, label: '全部短信',
          children: []
        }
      ],
      treeProps: {
        children: 'children',
        label: 'label'
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
      pageSize: 10
    }
  },
  methods: {
    // 添加短信模板
    addRole(){

    },
    // tree - 点击触发
    treeClick(node, data){
      
    },
    // tree - 树结构
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button size="mini" type="text" on-click={ () => this.append(data) } icon="el-icon-circle-plus-outline"></el-button>
            <el-button size="mini" type="text" on-click={ () => this.remove(node, data) } icon="el-icon-delete"></el-button>
            <el-button size="mini" type="text" on-click={ () => this.edit(node, data) } icon="el-icon-edit"></el-button>
          </span>
        </span>);
    },
    // tree - 添加
    append(data){

    },
    // tree - 删除
    remove(node, data){

    },

    // tree - 编辑
    edit(node, data){

    },

    // 改变启用状态
    updateSmsIsUse(data){

    },
    // 短信详情
    smsDetail(data){

    },

    // 分页方法
    sizeChange(val){
      this.pageSize = val
    },
    curChange(val){
      this.pageNum = val
    }
  },

  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight
  }
}
import AddPerson from './addPeroson/addPeroson.vue'

export default {
    components: {
      AddPerson
    },
    data() {
      return {
        data: [
          {
            id: 1,
            label: '一级 1',
            children: []
          }
        ],
        treeProps: {
          children: 'children',
          label: 'label'
        },

        // table
        height: null,
        tableData: [{}],
        tableCate: [
          { prop: 'attribute2', label: '编号', width: '110' },
          { prop: 'userName', label: '姓名', width: '110' },
          { prop: 'sex', label: '性别', width: '70' },
          { prop: 'phone', label: '手机号码', width: '120' },
          { prop: 'email', label: '电子邮箱', width: '180' },
          { prop: 'departmentName', label: '部门', width: '' },
          { prop: 'ranksId', label: '级别', width: '110' },
          { prop: 'duties', label: '职务', width: '150' },
          { prop: 'characterId', label: '角色', width: '110' },
          { prop: 'attribute1', label: '组别', width: '110' }
        ],

        // 分页
        pageNum: 1,
        pageSize: 50,
        total: 0,
        searchKey: '',

        // 各子组件开关
        addPeroson_child: true
      }
    },
    methods: {
      // tree - 树结构
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.append(data) }>添加</el-button>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>);
      },
      // 分页方法
      sizeChange(val){
        this.pageSize = val
      },
      curChange(val){
        this.pageNum = val
      },
      // 打开自定义条件组
      openBox(){

      },
      // 输入框搜索
      doSeacKey() {

      },
      // 自定匹配
      auto() {

      },
      // 添加人员 - 下拉
      addPersonL(command){

      },
      // 删除人员 - 下拉
      handlePhoto(command){

      },
      // 相片管理 - 下拉
      handleCommand(command){

      },
      // 筛选 - 下拉
      screenCommand(command) {

      },
      // 编辑
      updateUser(data){
        
      },

      /**
       * 子集组件 - 按钮
       */
      submitForm(){
        let child = this.$refs.AddPerson, from = {...child.user}
        child.$refs['userForm'].validate((valid) => {
          if (valid) {
            
          } else { 
            console.log('error submit!!');
            return false;
          }
        }); 
      },
      cancel() {
        this.addPeroson_child = false
      }
    },
    mounted() {
      var dom = document.querySelector('.table')
      this.height = dom.offsetHeight
    }
}
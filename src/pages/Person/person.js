import AddPerson from './addPeroson/addPeroson.vue'

export default {
    components: {
      AddPerson
    },
    data() {
      return {
        data: [],
        treeProps: {
          children: 'children',
          label: 'departmentName'
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
        addPeroson_child: false
      }
    },
    methods: {
      // tree - 点击触发
      treeClick(node, data){
        
      },
      // tree - 树结构
      renderContent(h, { node, data, store }) {
        let html;
        // console.log(node,node.level)
        if (node.level == 1) {
            html = (<span class="custom-tree-node" >
                <span class="tree-title"> {node.label} </span> <span class="node-tool-bar" >
          </span> </span>);
        } else if(node.level == 2){
            html = (<span class="custom-tree-node" >
            <span class="tree-title"> {node.label} </span> <span class="node-tool-bar" >
              {
                data.departmentName == '内部人员' 
                ? <el-button type="text" class="el-icon-circle-plus-outline" title="添加"
                                on-click={(e) => this.append(data, e)} > </el-button>
                : ''
              }
              </span> </span>);
        } else if(node.level == 3){
            html = (<span class="custom-tree-node" >
              <span class="tree-title"> {node.label} </span> <span class="node-tool-bar" >
                  <el-button type="text"
                      class="el-icon-edit-outline"
                      title="重命名"
                      on-click={(e) => this.edit(data, e)} >
                  </el-button>

                  <el-button type="text"
                      class="el-icon-delete"
                      title="删除"
                      on-click={(e) => this.remove(data, node, e)} >
                  </el-button> </span> </span>);
        }
        return html;
      },
      // tree - 添加
      append(data, e){
        e.preventDefault();
        e.stopPropagation();
        let _this = this, arr = this.data[0].children[0].children
        this.$prompt('请输入部门名称', `您将在: ${data.departmentName} 下添加一个新部门`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.{1,20}/,
          inputErrorMessage: '请输入新部门的名称',
          inputValidator: function(val) {
            // console.log(val)
            let bool = false
            arr.filter(item => item.departmentName == val ? bool = true : bool = false)
            return bool ? '该名称已存在' : true
          }
        }).then(({ value }) => {
          if (value) {
            if (value.indexOf("-") >= 0 || value.indexOf("/") >= 0 || value.indexOf("\\") >= 0) {
              this.$message.error('部门名称不能包含 \'-\'，\'/\'和\'\\\'字符！'); 
              return false
            }
          }
          let depart = {
              departmentName: value,
              parentId: this.data[0].companyId
          }
          _this.doAddDepart(depart)
        }).catch(info => {});
      },
      doAddDepart: function (val) {
        console.log("doAddDepart:", val);
        this.$http.post(this.API.addDepartmentForCompany, val)
          .then(res => {
            console.log(res);
            if (res.code == "000") {
              this.initDepartData();
              this.$message.success("操作成功");
            } else {
              this.$message.info(res.msg);
            }
          }).catch(res => {
            console.log(res);
          });
      }, //doAddDepart
      // tree - 删除
      remove(data, node, e){
        e.preventDefault();
        e.stopPropagation();
        console.log(data)
        this.$confirm('是否删除该部门?', '提示', {
          closeOnPressEscape: false,
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn_custom_cancel',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.API.delDpeartmentForCompany, [data.id])
          .then(res => {
            if (res.code == "000") {
              this.initDepartData();
              this.$message.success("删除成功");
            } else {
              this.$message.info(res.msg);
            }
          })
        }).catch(() => {})
      },

      // tree - 编辑
      edit(data, e){
        e.preventDefault();
        e.stopPropagation();
        let _this = this, arr = this.data[0].children[0].children
        console.log(data)
        this.$prompt('请输入新的部门名称', `修改部门：${data.departmentName} 的名称`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /.{1,20}/,
            inputErrorMessage: '请输入部门名称',
            inputValidator: function(val) {
              // console.log(val)
              let bool = false
              arr.filter(item => item.departmentName == val ? bool = true : bool = false)
              return bool ? '该名称已存在' : true
            }
          }).then(({ value }) => {
            if(value){
              if(value.indexOf("-")>=0 || value.indexOf("/")>=0 || value.indexOf("\\") >=0){
                this.$message.error('部门名称不能包含 \'-\'，\'/\'和\'\\\'字符！'); 
                return false
              }
            }
            data.name = value
            _this.editAddDepart(data)
          }).catch(() => {}); 
      },//renameDepart
      editAddDepart(val){
        this.$http.post(this.API.editDepartmentNameForCompany(val.id, val.parentId, val.name))
          .then(res => {
          if (res.code == "000") {
            this.initDepartData();
            this.$message.success("操作成功");
          } else {
            this.$message.info(res.msg);
          }
        })
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
      searchBtn() {

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
      },


      // 获取部门
      initDepartData() {
        this.$http.get(this.API.findCompanyDepartment)
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            let arr = []
            res.data.filter(item => {
              if(item.departmentName == item.companyName){
                this.data = [
                  {
                    companyId: item.companyId,
                    departmentName: item.companyName,
                    id: item.id,
                    children: [
                      { departmentName: '内部人员', id: 0, children: []}, 
                      { departmentName: '外部人员', id: 1 }, 
                    ]
                  }
                ]
              } else {
                arr.push(item)
              }
            })
          
            this.data[0].children[0].children = arr;
          
            // setTimeout(() => {
            //   document.querySelector('.el-tree-node__content').click()
            // }, 500)
          }
        })
      },
    },
    mounted() {
      var dom = document.querySelector('.table')
      this.height = dom.offsetHeight

      // 获取部门
      this.initDepartData()
    }
}
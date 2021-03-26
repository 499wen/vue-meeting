import addAtte from './addAtte/addAtte.vue' // 添加参会人
import operconditionGroup from './operconditionGroup/operconditionGroup.vue' // 条件组
import { mapState } from 'vuex'
import { toTree, exportToExcel, Load } from '@/plugins/plugins.js'

export default {
  components: {
    addAtte,
    operconditionGroup
  },
  data() {
    return {
      // tree
      data: [
        { id: 1, label: '全体参会人',
          children: []
        }
      ],
      treeProps: {
        children: 'children',
        label: 'confereeGroupName'
      },

      searchKey: '',

      // table
      height: null,
      tableData: [],
      tableCate: [
        {props: 'userName', label: '姓名', width: ''},
        {props: 'phone', label: '手机号', width: ''},
        {props: 'departmentName', label: '部门', width: ''},
        {props: 'characterId', label: '角色', width: ''},
        {props: 'confereeGroupName', label: '所在分组', width: ''},
        {props: 'status', label: '状态', width: '100'},
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      // 当前选中参会人分组
      curAttenGroup: {},
      curEditGroup: {},

      // 条件组数据
      condiData: [],
      queryConditionArr: [],

      // 子组件 - 开关
      addAtte_child: false,
      condition_child: false,
      editGroup_child: false,

      // 操作条件组 new: 添加， update: 修改
      type: 'new'
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: {
    // 导出参会人
    exportAtten(){
      let loading = new Load()
      let arr = ['未确认', '已确认', '已报到', '已签到', '不参加'], 
        arr2 = ['', '请假', '请假', '请假'],
        tHeader = ["序号", "姓名", "手机号", "部门", "角色", "所在分组", "状态"],
        filterVal = ["id", "userName", "phone", "departmentName", "characterId", "confereeGroupName", "status"]
      this.$http.get(this.API.findByMeetingIdAndPage(this.curAttenGroup.id, 1, 9999999))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter((item, idx) => {
              item.confereeGroupName = this.curAttenGroup.confereeGroupName
              item.statusCode = item.statusCode == '' ? 0 : item.statusCode
              item.status = !item.leaveState ? arr[item.statusCode] : arr2[item.leaveState]
              item.id = idx + 1
            })
            
            exportToExcel(res.data, this.curAttenGroup.confereeGroupName, tHeader, filterVal, () => {
              console.log('回调')
              loading.close()
            })
          } else {

          }
        })
    },
    // 搜索按钮
    searchBtn(){
      this.pageNum = 1
      
      this.getAttenPerson()
    },
    // tree - 点击触发
    treeClick(data, node){
      this.curAttenGroup = data
      
      // 查询参会分组下的人员
      this.getAttenPerson()
    },
    // tree - 树结构
    renderContent(h, { node, data, store }) {
      let html;
      if(node.level == 1){
        html = (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ (e) => this.append(data, e) } icon="el-icon-circle-plus-outline"></el-button>
            </span>
          </span>)
      } else {
        html = (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ (e) => this.remove(data, e) } icon="el-icon-delete"></el-button>
              <el-button size="mini" type="text" on-click={ (e) => this.edit(node, data, e) } icon="el-icon-edit"></el-button>
            </span>
          </span>)
      }
      return html;
    },
    // tree - 添加
    append(data, e){
      e.preventDefault();
      e.stopPropagation();

      this.type = 'new'
      this.condition_child = true
    },
    // tree - 删除
    remove(data, e){
      e.preventDefault();
      e.stopPropagation();

      console.log(data)
      this.$confirm('是否删除该分组?', '提示', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.API.deleteConfereeGroup(data.id))
          .then(res => {
            if(res.code == '000'){
              this.$message.success('删除成功！')
              this.pageNum = 1
              this.getAttenPerson()
            } else {
              this.$message.error(res.msg)
            }
          })
      }).catch(() => {})
    },

    // tree - 编辑
    edit(node, data, e){
      e.preventDefault();
      e.stopPropagation();
      this.type = 'update'
      this.editGroup_child = true
      let obj = {...data}
      this.curEditGroup = obj
      
      this.$nextTick(() => {
        this.$refs.conditionGroup.handleSelectionChange(obj)
        this.$refs.conditionGroup.depart = obj
      })
    },

    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val

      this.getAttenPerson()
    },
    curChange(val){
      this.pageNum = val

      this.getAttenPerson()
    },

    addAtteBtn (){
      this.addAtte_child = true
    },

    // 选中条件组
    clickCondi(idx){
      let item = this.condiData[idx]
      this.queryConditionArr = item.condition
      this.getProson()
    },

    // 子组件 - 按钮
    addTo(){
      let selectData = this.$refs.addAtte.selectData, ids = []
      if(selectData.length == 0){
        this.$message.error('请勾选人员!')
        return
      }

      // 处理数据
      selectData.filter(item => ids.push(item.id))

      this.$http.post(this.API.addWholeatten(this.curAttenGroup.id), ids)
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            this.$message.success('添加成功!')
            this.addAtte_child = false

            // 重新查 人员
            this.getAttenPerson()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    addCondis(){
      let conditionGroup = this.$refs.conditionGroup,
        param = conditionGroup.param

      if (!param.queryBuilderName || !param.queryBuilderName.trim()) {
        this.$message("请输入条件组名称！")
        return
      }

      if (param.queryConditionList.length == 0) {
        this.$message("请添加查询条件！")
        return
      }

      // if (!conditionGroup.bool && conditionGroup.editBool) {
      //   var data = {
      //     id: param.id,
      //     groupName: param.queryBuilderName,
      //     condition: JSON.stringify(param.queryConditionList),
      //     types: 'adduser'
      //   }
      // } else {
      //   // 处理数据 condition
      //   param.queryConditionList.map((item, idx) => param.queryConditionList[idx].sequenceNumber = '' + idx)
      //   var data = {
      //     groupName: param.queryBuilderName,
      //     condition: JSON.stringify(param.queryConditionList),
      //     types: 'adduser'
      //   }
      // }

      if (this.type == 'new') {
        let depart = {
          meetingId: this.meetingData.id,
          parentId: this.curAttenGroup.id,
          confereeGroupName: param.queryBuilderName,
          queryCondition: param.queryConditionList,
          jsonQuery: JSON.stringify(param.queryConditionList)
        }
        
        this.$http.post(this.API.addByParentId, depart)
          .then(res => {
            if (res.code == '000') {
              this.condition_child = false
              this.$message.success('保存成功！')
              this.getAttenGroup()
            }
          })
          .catch(res => {
            console.log(res);
          });
      } else {
        let depart = this.curEditGroup
        depart.confereeGroupName = param.queryBuilderName
        depart.queryCondition = param.queryConditionList
        depart.jsonQuery = JSON.stringify(param.queryConditionList)

        // return 
        this.$http.post(this.API.updateConfereeGroup, depart)
          .then(res => {
            if (res.code == '000') {
              this.editGroup_child = false
              this.$message.success('保存成功！')
              this.getAttenGroup()
            }
          })
          .catch(res => {
            console.log(res);
          });
      }
    },
    cancel() {
      this.addAtte_child = false
      this.condition_child = false
      this.editGroup_child = false
    },

    // 获取参会人分组
    getAttenGroup() {
      this.$http.get(this.API.getConfereeGroupAll(this.meetingData.id))
        .then(res => {
          if(res.code == '000' && res.data) {
            // 手动补充属性 children
            res.data.filter(item => item.children = [])
            this.data = toTree(res.data)

            setTimeout(() => {
              document.querySelector('.atte-tree .el-tree-node__content').click()
            }, 200)
          }
        })
    },

    // 查询参会分组下的参会人员
    getAttenPerson(){
      let arr = ['未确认', '已确认', '已报到', '已签到', '不参加'], 
        arr2 = ['', '请假', '请假', '请假']
      this.$http.get(this.API.findByMeetingIdAndPage(this.curAttenGroup.id, this.pageNum, this.pageSize))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter((item, idx) => {
              item.confereeGroupName = this.curAttenGroup.confereeGroupName
              item.statusCode = item.statusCode == '' ? 0 : item.statusCode
              item.status = !item.leaveState ? arr[item.statusCode] : arr2[item.leaveState]
            })
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    },

    // 获取条件组 数据
    getCondi() {
      this.$http.get(this.API.selectConditionGroup('adduser'))
        .then(res => {
          console.log(res)
          if(res.code == '000' && res.data){
            res.data.filter(item => item.condition = JSON.parse(item.condition))
            this.condiData = res.data
          }
        })
    }
  },
  mounted() {
    // 表格高度
    var dom = document.querySelector('.table-child')
    this.height = dom.offsetHeight
    
    // 获取参会人分组
    this.getAttenGroup()

    // 获取条件组
    this.getCondi()
  }
}
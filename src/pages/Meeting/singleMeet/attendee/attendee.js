import addAtte from './addAtte/addAtte.vue' // 添加参会人
import operconditionGroup from './operconditionGroup/operconditionGroup.vue' // 条件组
import manualImport from './manualImport/manualImport.vue' // 手动录入
import { mapState } from 'vuex'
import { toTree, exportToExcel, Load } from '@/plugins/plugins.js'
import $ from 'jquery'

export default {
  components: {
    addAtte,
    manualImport,
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
        {props: 'type', label: '人员类型', width: ''},
        // {props: 'confereeGroupName', label: '所在分组', width: ''},
        {props: 'status', label: '状态', width: '100'},
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      // 当前选中参会人分组
      curAttenGroup: {},
      curEditGroup: {},
      delData: [],

      // 条件组数据
      condiData: [],
      queryConditionArr: [],

      // 子组件 - 开关
      addAtte_child: false,
      condition_child: false,
      editGroup_child: false,
      manualImport_child: false,

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
      let loading = new Load(),
      obj = {
        contanUserIdArr: [],
        ifContanUserIdArr: false,
        queryConditionArr: this.queryConditionArr
      }
      let arr = ['未确认', '已确认', '已报到', '已签到', '不参加'], 
        arr2 = ['', '请假', '请假', '请假'],
        tHeader = ["序号", "姓名", "手机号", "部门", "角色", "所在分组", "状态"],
        filterVal = ["id", "userName", "phone", "departmentName", "characterId", "confereeGroupName", "status"]
      this.$http.post(this.API.findByMeetingIdAndPage(this.meetingData.id, this.curAttenGroup.id, 1, 9999999, this.searchKey), obj)
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter((item, idx) => {
              item.type = item.externalCode == '0' ? '内部人员' : '外部人员'
              item.confereeGroupName = this.curAttenGroup.confereeGroupName
              item.statusCode = item.statusCode == '' ? 0 : item.statusCode
              item.status = !item.leaveState ? arr[item.statusCode] : arr2[item.leaveState]
              item.id = idx + 1
            })
            
            exportToExcel(res.data, this.curAttenGroup.confereeGroupName, tHeader, filterVal, () => {
              loading.close()
            })
          } else {

          }
        })
    },

    // 移除全部参会人
    removeAll() {
      if(this.tableData.length == 0){
        this.$message.error('没有可以移除的参会人!')
        return 
      }
      this.$confirm('是否移除全部人员?', '提示', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doRemoveAll()
      }).catch((err) => {
        console.log(err)
      })
    },
    test() {
      console.log('11')
    },
    doRemoveAll() {
      let obj = {
        contanUserIdArr: [],
        ifContanUserIdArr: false,
        queryConditionArr: this.queryConditionArr
      }, load = this.$loading({
        lock: true,
        text: "Loading...",
        background: 'rgba(0, 0, 0, 0.5)',
        target: "body"
      })
      $.ajax({
        url: this.API.findByMeetingIdAndPage(this.meetingData.id, this.curAttenGroup.id, this.pageNum, 999999, this.searchKey),
        data: obj,
        dataType: 'JSON',
        headers: {
          token: localStorage.getItem('token')
        },
        type: 'post',
        success: (res) => {
          console.log(res)
          if(res.code == '000' && res.data){
            let data = [], api
            res.data.filter(item => data.push(item.id))
            if(this.meetingData.id == this.curAttenGroup.id) {
              api = this.API.deleteByIds
            } else {
              api = this.API.updateConfereeGroupId(this.meetingData.id)
            }
            this.$http.post(api, data)
              .then(res => {
                console.log(res)
                if(res.code == '000') {
                  this.$message.success('移除成功!')
                  load.close()
                  this.getAttenPerson()
                } else {
                  this.$message.error(res.msg)
                }
              })
          }
        }
      })

      this.$http.post(this.API.findByMeetingIdAndPage(this.meetingData.id, this.curAttenGroup.id, this.pageNum, 999999, this.searchKey), obj)
        .then(res => {
          
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
      let html, meetingData = this.meetingData;
      if(node.level == 1){
        html = (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button v-preventReClick size="mini" type="text" on-click={ (e) => this.append(data, e) } disabled={meetingData.timeNow > meetingData.endDate} icon="el-icon-circle-plus-outline"></el-button>
            </span>
          </span>)
      } else {
        html = (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button v-preventReClick size="mini" type="text" on-click={ (e) => this.remove(data, e) } disabled={meetingData.timeNow > meetingData.endDate} icon="el-icon-delete"></el-button>
              <el-button v-preventReClick size="mini" type="text" on-click={ (e) => this.edit(node, data, e) } disabled={meetingData.timeNow > meetingData.endDate} icon="el-icon-edit"></el-button>
            </span>
          </span>)
      }
      return html;
    },
    // tree - 添加
    append(data, e){
      e.preventDefault();
      e.stopPropagation();

      console.log(this.data[0])
      let arr = []
      this.data[0].children.filter(item => arr.push(item.confereeGroupName))

      this.$prompt('请输入分组名称', '提示', {
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: function(val) {
          let cte = val ? val.trim() : ''
          if(!cte) {
            return '分组名称不能为空'
          } else if(arr.includes(cte)) {
            return '名称已存在'
          }
        }
      }).then(({ value }) => {
        let obj = {
          meetingId: this.meetingData.id,
          parentId: this.meetingData.id,
          confereeGroupName: value
        }
        this.$http.post(this.API.addByParentId, obj)
          .then(res => {
            if(res.code == '000'){
              this.$message.success('添加成功！')
              this.getAttenGroup()
            } else {
              this.$message.error(res.msg)
            }
          })
      }).catch(err => {})

      // this.type = 'new'
      // this.condition_child = true
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
              this.getAttenGroup()
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

      let arr = []
      this.data[0].children.filter(item => arr.push(item.confereeGroupName))

      this.$prompt('请输入分组名称', '提示', {
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: function(val) {
          let cte = val ? val.trim() : ''
          if(!cte) {
            return '分组名称不能为空'
          } else if(arr.includes(cte)) {
            return '名称已存在'
          }
        }
      }).then(({ value }) => {
        // let obj = {
        //   meetingId: this.meetingData.id,
        //   id: data.id,
        //   confereeGroupName: value
        // }

        data.confereeGroupName = value
        
        this.$http.post(this.API.updateConfereeGroup, data)
          .then(res => {
            if(res.code == '000'){
              this.$message.success('更新成功！')
              this.getAttenGroup()
            } else {
              this.$message.error(res.msg)
            }
          })
      }).catch(err => {})
    },

    // 参会人预约
    subscribe(row) {
      let obj = {
        inviteId: row.id,
        meetingId: this.meetingData.id
      }

      this.$http.post(this.API.addMeetingSginSms, obj)
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            this.$message.success('预约成功!')
            row.types = 1
          } else {
            this.$message.error(res.msg)
          }
        })
    },

    // 参会人取消预约
    cancelSub(row){
      this.$http.post(this.API.delMeetingSginSms(row.sid))
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            this.$message.success('取消成功!')
            row.types = 0
          } else {
            this.$message.error(res.msg)
          }
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
    // 手动录入
    manualImport() {
      this.manualImport_child = true
    },
    // 新增人员
    newAddPerson(){
      let child = this.$refs.manualImport
      child.form.confereeGroupId = this.meetingData.id
      child.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http.post(this.API.addUserToMeetingInvite(this.meetingData.id), child.form)
            .then(res => {
              console.log(res)
              if(res.code == '000'){
                this.$message.success('添加成功!')
                this.manualImport_child = false
                this.getAttenPerson()
              } else {
                this.$message.error(res.msg)
              }
            })
        }
      })
    },

    // 移除参会人
    removeAtte(){
      if(this.delData.length == 0){
        this.$message.info('请勾选参会人!')
        return 
      }

      this.$confirm('是否移除选中的参会人?', '提示', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = [], api, tableData = this.tableData

        this.delData.filter(item => data.push(item.id))
        if(this.meetingData.id == this.curAttenGroup.id) {
          api = this.API.deleteByIds
        } else {
          api = this.API.updateConfereeGroupId(this.meetingData.id)
        }
        this.$http.post(api, data)
          .then(res => {
            console.log(res)
            if(res.code == '000') {
              this.$message.success('移除成功!')
              this.getAttenPerson()
            } else {
              this.$message.error(res.msg)
            }
          })
        
      }).catch((err) => {
        console.log(err)
      })
      
    },
    batchDel(val){
      this.delData = val
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
      let selectData = this.$refs.addAtte.selectData, ids = [], api
      if(selectData.length == 0){
        this.$message.error('请勾选人员!')
        return
      }

      // 处理数据
      selectData.filter(item => ids.push(item.id))
      if(this.curAttenGroup.id == this.meetingData.id){
        api = this.API.addWholeatten(this.curAttenGroup.id)
      } else {
        api = this.API.updateConfereeGroupId(this.curAttenGroup.id)
      }

      this.$http.post(api, ids)
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
      this.manualImport_child = false
    },

    // 获取参会人分组
    getAttenGroup() {
      this.$http.get(this.API.getConfereeGroupAll(this.meetingData.id))
        .then(res => {
          if(res.code == '000' && res.data) {
            // 手动补充属性 children
            res.data.filter(item => item.children = [])
            console.log(res.data)
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
        arr2 = ['', '请假', '请假', '请假'],
        obj = {
          contanUserIdArr: [],
          ifContanUserIdArr: false,
          queryConditionArr: this.queryConditionArr
        }
      this.$http.post(this.API.findByMeetingIdAndPage(this.meetingData.id, this.curAttenGroup.id, this.pageNum, this.pageSize, this.searchKey), obj)
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter((item, idx) => {
              item.type = item.externalCode == '0' ? '内部人员' : '外部人员'
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
<template>
  <div class="remin">
    <div class="header-opera">
      <div class="tap">
        <span>会务管理</span>
        <span>信息通知</span>
        <span>会议名称</span>
      </div>
      <el-button v-preventReClick round size="small" @click="$router.go(-1)">返回</el-button>
    </div>
    
    <div class="content">
      <!-- tree -->
      <div class="tree">
        <el-tree
          :data="data"
          :props="treeProps"
          node-key="id"
          ref='sms-tree'
          default-expand-all
          @node-click='treeClick'
          :expand-on-click-node="false"
          :highlight-current="true"
          :render-content="renderContent">
        </el-tree>
      </div>

      <div class="data">
        <div class="func">
          <el-button v-preventReClick round size="small" type="primary" @click="addPerson"> 添加人员 </el-button>
          <el-button v-preventReClick round size="small" type="primary" @click="delPerson"> 移除人员 </el-button>
        </div>

        <!-- 表格 -->
        <div class="table">
          <el-table ref="singleTable" @selection-change="batchDel"
            :data="tableData" border :height="height">
            <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' type="selection" width="50"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
              v-for="(item, idx) in tableCate" :key="idx"
              align="center" :resizable="false">
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagin">
          <el-pagination
          background
          @size-change="sizeChange"
          @current-change="curChange"
          :current-page="pageNum"
          :page-sizes="[20, 50, 100, 300]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
          </el-pagination>
        </div>

      </div>
    </div>

    <!-- 添加人员 -->
    <el-dialog title="添加人员" :visible.sync="addPerson_child" width="60%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <AddPersonRemin ref="AddPersonRemin" v-if="addPerson_child" :row='row'></AddPersonRemin>
      <div class="dialog-btn">
        <el-button v-preventReClick type="primary" @click="submitForm" size="small" round>添 加</el-button>
        <el-button v-preventReClick @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddPersonRemin from './addPersonRemin.vue'

export default {
  components: {
    AddPersonRemin
  },
  data() {
    return {
      // tree
      data: [
        { id: 1, label: '信息提醒',
          children: [
            { label: '签到信息提醒', id: '2'},
          ]
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
        {props: 'userName', label: '姓名', width: ''},
        {props: 'phone', label: '手机号', width: ''},
        {props: 'departmentName', label: '部门', width: ''},
        {props: 'characterId', label: '角色', width: ''},
        {props: 'type', label: '人员类型', width: ''},
      ],
      multiple: [],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      // 路由参数
      row: {},


      // 子组件开关
      addPerson_child: false
    }
  },
  methods :{
    addPerson() {
      this.addPerson_child = true
    },
    // tree - 点击触发
    treeClick(data, node){
      this.getData()
    },
    // tree - 树结构
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
        </span>);
    },
    // 表格多选
    batchDel(val){
      this.multiple = val
    },

    // 移除人员
    delPerson(){
      let multiple = this.multiple, ids = []
      if(multiple.length == 0){
        this.$message.error('请勾选参会人!')
        return 
      }

      multiple.filter(its => ids.push(its.id))

      this.$http.post(this.API.delMeetingSginSms, ids)
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            this.$message.success('移除成功!')
            this.getData()
          } else {
            this.$message.error(res.msg)
          }
        })
    },

    // 子组件方法
    submitForm(){
      let child = this.$refs.AddPersonRemin, multiple = child.multiple, ids = []
      if(multiple.length == 0){
        this.$message.error('请勾选参会人!')
        return 
      }

      multiple.filter(its => ids.push({meetingId: this.row.id,inviteId: its.id}))

      this.$http.post(this.API.addMeetingSginSms, ids)
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            this.$message.success('预约成功!')
            this.addPerson_child = false
            this.getData()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    cancel() {
      this.addPerson_child = false
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
      let arr = ['未确认', '已确认', '已报到', '已签到', '不参加'], 
        arr2 = ['', '请假', '请假', '请假']

      this.$http.get(this.API.findMeetingSginSms(this.row.id, this.pageNum, this.pageSize))
      .then(res => {
        console.log(res)
        if(res.code == '000'){
          res.data.filter((item, idx) => {
            item.type = item.externalCode == '0' ? '内部人员' : '外部人员'
            // item.confereeGroupName = this.curAttenGroup.confereeGroupName
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
    }
  },
  mounted() {
    // 路由参数
    this.row = this.$route.query
    console.log(this.row)

    // 表格高度
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取数据
    this.getData()

    document.querySelector('.el-tree-node__content').style = `
      background-color: #e67c7c;
      color: #fff
    `

    // 默认高亮
    this.$refs['sms-tree'].setCurrentKey('2')
  }
}
</script>

<style lang="less" scoped>
.remin {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .content {
    width: 100%;
    height: calc(100% - 52px);
    box-sizing: border-box;
    display: flex;

    .tree {
      padding: 5px;
      width: 240px;
      margin-right: 10px;
      box-sizing: border-box;
      height: 100%;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    .data {
      border: 1px solid #ccc;
      border-radius: 6px;
      width: calc(100% - 230px);
      height: 100%;
      padding: 5px;
      box-sizing: border-box;

      .func {
        margin-bottom: 5px;
      }

      .table {
        width: 100%;
        height: calc(100% - 79px);
      }
    }
  }
}
</style>
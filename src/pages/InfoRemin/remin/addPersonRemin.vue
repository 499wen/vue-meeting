<template>
  <div class="addPersonRemin">
    <div class="func">
      <div class="func-left">
        <!-- 人员类型 -->
        <el-dropdown trigger="click" class="spacing" @command='personType' placement='bottom'>
          <el-button size="small">
            {{ type }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command='全部人员'>全部人员</el-dropdown-item>
            <el-dropdown-item command='内部人员'>内部人员</el-dropdown-item>
            <el-dropdown-item command='外部人员'>外部人员</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 人员查询 - 条件组  --> 
        <el-dropdown trigger="click" class="spacing right-10px" @command='clickCondi' placement='bottom'>
          <el-button size="small">
            <div class="cont">
              <span >{{ tjgroup }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, idx) in condiData" :key="idx" :command='idx'>{{ item.groupName }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="small" @click="custom" class=" right-10px">自定义条件</el-button> 
      </div>

      <!-- 查询数据 -->
      <el-input size="small" class="search" placeholder="请输入会议名称" v-model="searchKey" @keyup.native.enter="searchBtn">
        <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
      </el-input>
    </div>

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

    <!-- 条件组 -->
    <el-dialog title="条件组" :visible.sync="condi_child" width="60%" center append-to-body :before-close="close"
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <conditionGroup ref="conditionGroup" v-if="condi_child"></conditionGroup>
      <div class="dialog-btn">
        <el-button @click="close" size="small" type="danger" round>关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import conditionGroup from '../operconditionGroup/operconditionGroup.vue'

export default {
  props: ['row'],
  components: {
    conditionGroup
  },
  data() {
    return {
      searchKey: '',

      // table
      height: 500,
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
      pageSize: 1000,

      // 条件组数据
      condiData: [],
      queryConditionArr: [],
      tjgroup: '条件组查询',
      externalCode: 2,
      type: '全部人员', 

      // 子级组件开关
      condi_child: false
    }
  },
  methods: {
    // 自定义条件
    custom(){
      this.condi_child = true
    },
    // 选中人员类型
    personType(info) {
      this.type = info
      this.tjgroup = '条件组查询'
      this.queryConditionArr = []
      switch(info) {
        case '全部人员' : this.externalCode = '2'; break;
        case '内部人员' : this.externalCode = '0'; break;
        case '外部人员' : this.externalCode = '1'; break;
      }

      this.getData()
    },
    // 搜索按钮
    searchBtn(){
      console.log('触发')
      this.getData()
    },
    // 选中条件组
    clickCondi(idx){
      let item = this.condiData[idx]
      this.queryConditionArr = item.condition
      this.tjgroup = item.groupName
      this.getData()
    },
    // 表格多选
    batchDel(val){
      this.multiple = val
    },
    close() {
      this.condi_child = false
      this.getCondit()
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
        arr2 = ['', '请假', '请假', '请假'],
        obj = {
          contanUserIdArr: [],
          ifContanUserIdArr: false,
          queryConditionArr: this.queryConditionArr
        }
      
      this.$http.post(this.API.findByMeetingIdAndPage(this.row.id, this.row.id, this.pageNum, this.pageSize, this.searchKey, this.externalCode), obj)
        .then(res => {
          console.log(res)
          if(res.code == '000' && res.data){
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
    },
    // 获取条件组数据
    getCondit() {
      this.$http.get(this.API.selectConditionGroup('adduser'))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter(item => item.condition = JSON.parse(item.condition))
            this.condiData = res.data
          }
        })
    }
  },

  mounted() {
    this.getData()
    
    // 获取条件组
    this.getCondit()
  }
}
</script>

<style lang="less" scoped>
.addPersonRemin {
  width: 100%;
  box-sizing: border-box;

  .func {
    width: 100%;
    height: 42px;
    display: flex;
    justify-content: space-between;

    .search {
      width: 300px;
    }
  }
}
</style>
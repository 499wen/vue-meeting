<template>
  <div class="approval_atten">
    <div class="header-opera">
      <div class="tap">
        <span>会议室预约</span>
        <span>预约审批</span>
      </div>
    </div>

    <!-- 切换类型 -->
    <div class="tab-type">
      <div @click="getApproval" :class="['single', tabIndex == 0 && 'select']">全部</div>
      <div @click="getType(0)" :class="['single', tabIndex == 1 && 'select']">未审批</div>
      <div @click="getType(1)" :class="['single', tabIndex == 2 && 'select']">已审批</div>
    </div>
 
    <!-- 表格 -->
    <div class="table">
      <el-table ref="multipleTable" :data="tableData" border :height='height'
        @selection-change="handleSelectionChange">
        <el-table-column :show-overflow-tooltip="true" type="selection" width="55" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" 
          v-for="(item, idx) in tableCate" :key="idx"
          :prop="item.prop" :label="item.label" :width="item.width" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="状态" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.date ? '已通过' : '未通过' }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.date ? '通过' : '不通过' }}</template>
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
</template>

<script>
import { selfTime } from '@/plugins/plugins.js'

export default {
  data() {
    return {
      // tab
      tabIndex: 0,

      // table
      height: null,
      tableData: [],
      tableCate: [
        { prop: 'userName', label: '申请人', width: '150'},
        { prop: 'phone', label: '手机号', width: '150'},
        { prop: 'companyName', label: '单位', width: '200'},
        { prop: 'departmentName', label: '部门', width: ''},
        { prop: 'email', label: '邮件', width: '180'},
        { prop: 'time', label: '申请时间', width: '200'}
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      meetRoomTypeEnum:['方形','椭圆','菱形'], //会议室类型
      stateEnum:['待审批','通过','未通过'], //状态
    }
  },
  methods: {
    // 表格多选框
    handleSelectionChange(val){

    },
    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val

      if(this.tabIndex == 0) {
        this.getApproval()
      } else {
        this.getType(this.tabIndex - 1)
      }
    },
    curChange(val){
      this.pageNum = val

      if(this.tabIndex == 0) {
        this.getApproval()
      } else {
        this.getType(this.tabIndex - 1)
      }
    },

    // 未审批 - 已审批
    getType(idx){
      this.tabIndex = idx + 1
      this.$http.get(this.API.selectByStateCodeAlready(idx, this.pageNum, this.pageSize))
        .then(res => {
          console.log(res)
          if(res.code == '000' && res.data){
            res.data.filter(item => {
              item.cate = this.meetRoomTypeEnum[item.type]
              item.time = selfTime(item.beginDate, false)
              item.st = selfTime(item.beginDate, false, true)
              item.et = selfTime(item.endDate, false, true, true)
            })

            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    },
    // 获取全部审批数据
    getApproval() {
      this.tabIndex = 0
      this.$http.get(this.API.selectByStateCode(this.pageNum, this.pageSize))
        .then(res => {
          console.log(res)
          if(res.code == '000' && res.data){
            res.data.filter(item => {
              item.cate = this.meetRoomTypeEnum[item.type]
              item.time = selfTime(item.beginDate, false)
              item.st = selfTime(item.beginDate, false, true)
              item.et = selfTime(item.endDate, false, true, true)
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
    // 表格高度
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取全部审批数据
    this.getApproval()
  }
};
</script>

<style scoped lang='less'>
.approval_atten {
  width: 100%;
  height: 100%;

  .tab-type {
    width: 100%;
    margin-bottom: 10px; 
    display: flex;

    .single {
      padding: 0 20px;
      padding-bottom: 5px;
      margin-right: 10px;
      font-size: 16px;
      color: #333;
      position: relative;
      cursor: pointer;
    }

    .select:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #409eff;
    }
  }

  .table {
    height: calc(100% - 133px);
    width: 100%;
  }
}
</style>
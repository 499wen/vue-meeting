<template>
  <div class="approval_atten">
    <div class="header-opera">
      <div class="tap">
        <span>会务管理</span>
        <span>参会审批</span>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table">
      <el-table ref="multipleTable" :data="tableData" border :height='height'>
        <el-table-column :show-overflow-tooltip="true" 
          v-for="(item, idx) in tableCate" :key="idx"
          :prop="item.prop" :label="item.label" :width="item.width" align="center"></el-table-column>
        <el-table-column align="center" label="状态" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.ifExamineAndApprove == 0">未审批</div>
              <div v-else>
                <span v-if="scope.row.examineAndApproveResult == 0">未通过</span>
                <span v-if="scope.row.examineAndApproveResult == 1">已通过</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" class="edit">
            <template slot-scope="scope" v-if="scope.row.ifExamineAndApprove == 0">
              <el-button v-preventReClick size="mini" @click="handlePass(1, scope.row)" round>通过</el-button>
              <el-button v-preventReClick size="mini" type="danger" @click="handlePass(0, scope.row)" round>不通过</el-button>
            </template>
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
      // table
      height: null,
      tableData: [{}],
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
      pageSize: 100
    }
  },
  methods: {
    // 审批
    handlePass(code, data){
      this.$http.post(this.API.examinationApprovalById(data.id, code))
        .then(res => {
          console.log(res)
          if(res.code == '000') {
            this.$message.success('审批成功！')
            this.getAppr()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val

      this.getAppr()
    },
    curChange(val){
      this.pageNum = val

      this.getAppr()
    },
    
    // 获取审批数据
    getAppr(){
      this.$http.get(this.API.findAllByCompanyIdApprove(this.pageNum, this.pageSize, 2))
        .then(res => {
          if(res.code == '000'){
            res.data.filter(item => item.time = selfTime(item.createDate, true))
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = res.data
            this.total = res.total
          }
        })
    }
  },
  mounted() {
    // 获取表格高度
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取审批数据
    this.getAppr()
  }
};
</script>

<style scoped lang='less'>
.approval_atten {
  width: 100%;
  height: 100%;

  .table {
    height: calc(100% - 97px);
    width: 100%;
  }
}
</style>
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
      <el-table ref="multipleTable" :data="tableData" border :height='height'
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column 
          v-for="(item, idx) in tableCate" :key="idx"
          :prop="item.prop" :label="item.label" :width="item.width" align="center"></el-table-column>
        <el-table-column label="状态" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.date ? '已通过' : '未通过' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
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
export default {
  data() {
    return {
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
      pageSize: 10
    }
  },
  methods: {
    // 表格多选框
    handleSelectionChange(val){

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
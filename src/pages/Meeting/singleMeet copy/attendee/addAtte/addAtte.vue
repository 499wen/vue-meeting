<template>
  <div class="addAtte">
    <div class="head">
      <div class="head-left">
        <!-- 条件组查询 -->
        <el-dropdown trigger="click" class="spacing">
          <el-button size="small">
            条件组查询<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="head-right">
        <el-input size="small" placeholder="请输入会议名称" v-model="searchKey" @keyup.native.enter="searchBtn">
          <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
        </el-input>
      </div>
    </div>

    <!-- table -->
    <div class="data-atte">
      <div class="table">
        <el-table ref="singleTable"
          :data="tableData" border :height="height">
          <el-table-column align="center" :resizable='false' type="selection" width="50"></el-table-column>
          <el-table-column type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
          <el-table-column :prop="item.props" :label="item.label" :width="item.width"
            v-for="(item, idx) in tableCate" :key="idx"
            align="center" :resizable="false">
          </el-table-column>
          <el-table-column align="center" :resizable='false' label="状态" width='100'>
            <template slot-scope="scope">
              <span
                style="margin-left: 0.625rem"
                class="table-style"
              >{{scope.row.status}}</span>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchKey: '',

      // table
      height: null,
      tableData: [],
      tableCate: [
        {props: 'userName', label: '姓名', width: ''},
        {props: 'phone', label: '手机号', width: ''},
        {props: 'departmentName', label: '部门', width: ''},
        {props: 'characterId', label: '角色', width: ''},
        {props: 'attribute1', label: '组别', width: ''},
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 10
    }
  },
  methods: {
    // 搜索按钮
    searchBtn(){
      console.log('触发')
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
</script>

<style scoped lang='less'>
.addAtte {
  width: 100%;
  height: 100%;

  .head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .data-atte {
    width: 100%;
    height: 524px;

    .table {
      width: 100%;
      height: calc(100% - 42px);
    }
  }
}
</style>
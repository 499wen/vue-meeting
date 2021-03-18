<template>
  <div class="addAtte">
    <div class="head">
      <div class="head-left">
        <!-- 条件组查询 -->
        <el-button-group autofocus>
           
          <el-button size="small" @click="custom">自定义条件</el-button> 
          <el-dropdown trigger="click" class="spacing" @command='clickCondi' placement='bottom'>
            <el-button size="small">
              条件组查询<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, idx) in condiData" :key="idx" :command='idx'>{{ item.groupName }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-button-group>
      </div>

      <div class="head-right">
        <el-input size="small" placeholder="请输入人员名称" v-model="searchKey" @keyup.native.enter="searchBtn">
          <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
        </el-input>
      </div>
    </div>

    <!-- table -->
    <div class="data-atte">
      <div class="table">
        <el-table ref="singleTable"
          :data="tableData" border :height="height" @selection-change="batchAdd">
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

    <!-- 条件组 -->
    <el-dialog title="条件组" :visible.sync="condi_child" width="60%" center append-to-body :before-close="cancel"
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <conditionGroup ref="conditionGroup" v-if="condi_child"></conditionGroup>
      <div class="dialog-btn">
        <el-button @click="cancel" size="small" type="danger" round>关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addAtte from './addAtte.js'

export default addAtte
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
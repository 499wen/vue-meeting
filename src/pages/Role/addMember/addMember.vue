<template>
  <div>
    <div class="oper">
      <el-input  placeholder="请输入内容" v-model="searchKey" class="input-with-select" @keyup.native.enter="searchBtn">
        <el-button v-preventReClick slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
      </el-input>
      <!-- <el-button v-preventReClick > 添加人员 </el-button> -->
    </div>

    <div class="member-table">
      <el-table :data="tableData" :height='height' border @selection-change="batchDel">
        <el-table-column :show-overflow-tooltip="true" type="selection" width="50" align='center'></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :resizable="false" align='center' type="index" label="序号" width="50"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :resizable="false"  align='center'
        v-for="(item,index) in tableCate"
        :key="index"
        :prop="item.value" :label="item.label" :width="item.width"
        ></el-table-column>
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
    
  </div>
</template>

<script>
import addMember from './addMember.js'

export default addMember
</script>

<style scoped lang='less'>
.oper {
  width: 100%;
  padding-bottom: 20px;
  box-sizing: border-box;

  .input-with-select {
    width: 40%;
    margin-right: 10px;
  }

}

.member-table {
  width: 100%;
  height: 450px;
}

.dialog-btn {
  padding-top: 10px;
  width: 100%;
  text-align: center;
}
</style>
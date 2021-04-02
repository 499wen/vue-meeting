<template>
  <div>
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
  </div>
</template>

<script>
import delMember from './delMember.js'

export default delMember
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
  height: 500px;
}

.dialog-btn {
  padding-top: 10px;
  width: 100%;
  text-align: center;
}

</style>
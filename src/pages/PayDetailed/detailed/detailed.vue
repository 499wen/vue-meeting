<template>
  <div class="detailed">
    <div class="table">
      <el-table ref="singleTable"
        :data="tableData" border :height="height">
        <el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
          v-for="(item, idx) in tableCate" :key="idx"
          align="center" :resizable="false">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['row'],
  data() {
    return {
      height: null,
      tableData: [],
      tableCate: [
        {props: 'userName', label: '姓名', width: ''},
        {props: 'phone', label: '手机号', width: ''},
        {props: 'departmentName', label: '部门', width: ''},
        {props: 'characterId', label: '角色', width: ''},
        {props: 'attribute1', label: '组别', width: ''},
      ]
    }
  },

  mounted() {
    var dom = document.querySelector('.detailed .table')
    this.height = dom.offsetHeight
  }
}
</script>

<style scoped lang='less'>
.detailed {
  width: 100%;
  height: 100%;

  .table {
    width: 100%;
    height: 600px;
  }
}
</style>
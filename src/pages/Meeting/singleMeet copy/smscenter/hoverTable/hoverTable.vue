<template>
  <div class="hoverTable">
    <div class="hide-table">
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
            <span>{{scope.row.status}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 按钮 -->
    <div class="hover-btn">
      <el-button round size='small' type="primary">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: null,
      tableData: [{},{},{},{},{},{}],
      tableCate: [
        {props: 'userName', label: '短信名称', width: ''},
      ]
    }
  },
  mounted() {
    var dom = document.querySelector('.hide-table')
    this.height = dom.offsetHeight
  }
}
</script>

<style scoped lang='less'>
.hoverTable {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .hide-table {
    width: 100%;
    height: calc(100% - 42px);
  }

  .hover-btn {
    width: 100%;
    height: 42px;
    text-align: center;
    padding-top: 10px;
  }
}
</style>
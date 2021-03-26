<template>
  <div class="sendRecord">
    <el-table ref="singleTable"
        :data="tableData" border :height="500">
        <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' type="selection" width="50"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
          v-for="(item, idx) in tableCate" :key="idx"
          align="center" :resizable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="状态">
          <template slot="header" slot-scope="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ smsTypeTitle }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, idx) in smsType" :key="idx">黄金糕</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表格
      height: null,
      tableData: [],
      tableCate: [
        {props: 'userName', label: '姓名', width: ''},
        {props: 'phone', label: '手机号', width: ''},
        {props: 'departmentName', label: '部门', width: ''},
        {props: 'characterId', label: '角色', width: ''},
        {props: 'attribute1', label: '组别', width: ''},
      ],

      smsTypeTitle: '全体参会人',
      smsType: []
    }
  }
}
</script>

<style scoped lang='less'>
.sendRecord {

}
</style>
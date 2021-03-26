<template>
  <div class="dispose">
    <div class="sms">
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

    <div class="person">
      <el-table ref="singleTable"
        :data="personData" border :height="500">
        <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' type="selection" width="50"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
          v-for="(item, idx) in personCate" :key="idx"
          align="center" :resizable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="状态">
          <template slot="header" slot-scope="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ personTypeTitle }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, idx) in personType" :key="idx">黄金糕</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 短信表格
      tableData: [],
      tableCate: [
        {props: 'userName', label: '短信名称', width: '200'},
      ],
      smsType: [],
      smsTypeTitle: '短信类型',

      // 人员表格
      personData: [],
      personCate: [
        {props: 'userName', label: '姓名', width: '100'},
        {props: 'phone', label: '手机号', width: '150'},
      ],
      personType: [],
      personTypeTitle: '全体参会人'

      
    }
  }
}
</script>

<style scoped lang='less'>
.dispose {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .sms {
    width: calc(50% - 50px);
    height: 500px;

  }

  .person {
    width: calc(50% - 50px);
    height: 500px;
  }
}
</style>
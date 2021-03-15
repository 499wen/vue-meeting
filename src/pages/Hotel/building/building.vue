<template>
  <div class="building">
    <div class="operation">
      <el-button @click="addBuild" type="primary" size="small">添加大楼</el-button>
    </div>
    <el-table :data="tableData" height="400"  border align='center'>
      <el-table-column type="index" align='center' label='序号' :resizable="false" width="80"></el-table-column>
      <el-table-column :prop="item.props" :label="item.label" :width="item.width"
        v-for="(item, idx) in tableCate" :key="idx"
        align="center" :resizable="false">
      </el-table-column>
      <el-table-column label="操作" align='center' :resizable="false" width="300">
        <template slot-scope="scope">
          <el-button @click="look(scope.row)" type="primary" size="small">查看房间</el-button>
          <el-button @click="editBuild(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="delBuild(scope.row.id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加大楼 -->
    <el-dialog title="添加大楼" :visible.sync="addFloor_child" width="60%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      
      <div class="dialog-btn">
        <el-button type="primary" @click="submitForm('userForm')" size="small" round>添 加</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // table
      tableData: [],
      tableCate: [
        {props: 'hotelBuildingName', label: '大楼名称', width: ''},
      ],

      addFloor_child: false
    }
  },
  methods: {
    // 添加大楼
    addBuild() {

    },
    // 查看房间
    look(row) {

    },
    // 编辑
    editBuild(row) {

    },
    // 删除
    delBuild(id) {

    },
  }
}
</script>

<style scoped lang='less'>
.building {

  .operation {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
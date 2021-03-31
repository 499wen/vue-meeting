<template>
  <div class="room">
    <div class="data-show">
      <!-- tree - 树结构 -->
      <div class="data-show-tree">
        <el-tree
          :data="data"
          :props="treeProps"
          ref='room-tree'
          node-key="id"
          default-expand-all
          @node-click='treeClick'
          :expand-on-click-node="false"
          :highlight-current="true"
          :render-content="renderContent">
        </el-tree>
      </div>

      <!-- 表格数据 -->
      <div class="data-show-table">
        <div class="room-top"> 
          <el-input size="small" placeholder="请输入会议名称" v-model="searchKey" @keyup.native.enter="searchBtn" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
          </el-input>
          <el-button type="primary" size="small" @click="addRoom">添加房间</el-button>
        </div>

        <!-- table -->
        <el-table ref="singleTable"
          :data="tableData" border :height="400">
          <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' type="selection" width="50"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
            v-for="(item, idx) in tableCate" :key="idx"
            align="center" :resizable="false">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="操作" width='160'>
            <template slot-scope="scope">
              <el-button @click="editRoomBtn(scope.row)" type="primary" size="small" round>编辑</el-button>
              <el-button @click="delRoom(scope.row.id)" type="danger" size="small" round>删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagin">
          <el-pagination
          background
          @size-change="sizeChange"
          @current-change="curChange"
          :current-page="pageNum"
          :page-sizes="[10, 50, 100, 300]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 添加房间 -->
    <el-dialog title="添加房间" :visible.sync="addRoom_child" width="10%" center append-to-body
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <addRoom ref="addRoom" v-if="addRoom_child"></addRoom>
      <div class="dialog-btn">
        <el-button type="primary" @click="submitForm()" size="small" round>添 加</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改房间 -->
    <el-dialog title="修改房间" :visible.sync="editRoom_child" width="10%" center append-to-body
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <editRoom ref="editRoom" v-if="editRoom_child" :editItem='editItem'></editRoom>
      <div class="dialog-btn">
        <el-button type="primary" @click="editSave()" size="small" round>修 改</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import room from './room.js'

export default room
</script>

<style scoped lang='less'>
@import url('./room.less');
</style>
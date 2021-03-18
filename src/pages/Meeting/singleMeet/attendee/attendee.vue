<template>
  <div class="attendee">
    <!-- tree -->
    <div class="atte-tree">
      <div class="tree-head">参会人分组管理</div>
      <el-tree
        :data="data"
        :props="treeProps" 
        node-key="id"
        default-expand-all
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click='treeClick'
        :render-content="renderContent">
      </el-tree> 
    </div>
    <!-- table 参会人数据 -->
    <div class="atte-data">
      <!-- 数据操作 -->
      <div class="data-oper">
        <div class="data-add" v-show='!curAttenGroup.parentId'>
          <el-button round size='small' type="primary" @click="addAtteBtn">添加参会人</el-button>
          <el-button round size='small' type="danger">移除参会人</el-button>
          <el-button round size='small' type="primary" v-show="false">手动录入</el-button>
        </div>
        <div class="data-query" v-show="false">
          <el-button class="spacing" size='small' @click="exportAtten">导出参会人</el-button>
          <!-- 条件组查询 -->
          <el-dropdown trigger="click" class="spacing" @command='clickCondi' placement='bottom'>
            <el-button size="small">
              条件组查询<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, idx) in condiData" :key="idx" :command='idx'>{{ item.groupName }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-input size="small" placeholder="请输入会议名称" v-model="searchKey" @keyup.native.enter="searchBtn" v-show='!curAttenGroup.parentId'>
            <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
          </el-input>
        </div>
      </div>

      <!-- 表格 -->
      <div class="show-data">
        <div class="table-child">
          <el-table ref="singleTable"
            :data="tableData" border :height="height">
            <el-table-column align="center" :resizable='false' type="selection" width="50"></el-table-column>
            <el-table-column type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
            <el-table-column :prop="item.props" :label="item.label" :width="item.width"
              v-for="(item, idx) in tableCate" :key="idx"
              align="center" :resizable="false">
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

    <!-- 添加参会人 - dialog-->
    <el-dialog title="添加参会人" :visible.sync="addAtte_child" width="50%" center height='100%'
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <addAtte ref="addAtte" v-if="addAtte_child" :groupId='this.curAttenGroup.id'></addAtte>
      <div class="dialog-btn">
        <el-button type="primary" @click="addTo" size="small" round>添 加</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加分组 -->
    <el-dialog title="添加分组" :visible.sync="condition_child" width="50%" center height='100%'
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <operconditionGroup ref="conditionGroup" v-if="condition_child" :groupId='this.curAttenGroup.id'></operconditionGroup>
      <div class="dialog-btn">
        <el-button type="primary" @click="addCondis" size="small" round>添 加</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改分组 -->
    <el-dialog title="修改分组" :visible.sync="editGroup_child" width="50%" center height='100%'
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <operconditionGroup ref="conditionGroup" v-if="editGroup_child" :groupId='this.curAttenGroup.id'></operconditionGroup>
      <div class="dialog-btn">
        <el-button type="primary" @click="addCondis" size="small" round>保 存</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import attendee from './attendee.js'

export default attendee
</script>

<style scoped lang='less'>
@import url('./attendee.less');
</style>
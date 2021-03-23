<template>
  <div class="short-message">
    <div class="header-opera">
      <div class="tap">
        <span>基础设置</span>
        <span>短信中心</span>
      </div>

      <!-- <el-button size="small" round @click="addRole" type="primary">添加短信模板</el-button> -->
    </div>

    <!--  -->
    <div class="bottom">
      <!-- tree -->
      <div class="tree">
        <el-tree
          :data="data"
          :props="treeProps"
          node-key="id"
          default-expand-all
          @node-click='treeClick'
          :expand-on-click-node="false"
          :highlight-current="true"
          :render-content="renderContent">
        </el-tree>
      </div>

      <div class="sms-list">
        <!-- table -->
        <div class="table">
          <el-table ref="singleTable" :height='height'
            :data="tableData" border>
            <el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号" align="center" :resizable="false">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" :prop="item.prop" :label="item.label" :width="item.width"
              v-for="(item, idx) in tableCate" :key="idx"
              align="center" :resizable="false">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" width="120" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-button size="small" round @click="smsDetail(scope.row)" :class="scope.row.configurable == 1 && 'tips'">详情</el-button>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="启用状态" width="120" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.use" active-color="#006fdf" @change="updateSmsIsUse(scope.row)"></el-switch>
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
    </div>

    <!-- 查看详情 -->
    <el-dialog title="短信详情" :visible.sync="smsDetail_child" width="60%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <detail ref="detail" v-if="smsDetail_child" :detail='detail'></detail>
      <div class="dialog-btn" v-show="detail.configurable != 0">
        <el-button type="primary" @click="submitForm" size="small" round>保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import shortMessage from './short_message.js'

export default shortMessage
</script>

<style scoped lang='less'>
@import url('./short_message.less');
</style>
<template>
  <div class="short-message">
    <div class="header-opera">
      <div class="tap">
        <span>基础设置</span>
        <span>短信中心</span>
      </div>

      <el-button size="small" round @click="addRole" type="primary">添加短信模板</el-button>
    </div>

    <!--  -->
    <div class="bottom">
      <!-- tree -->
      <div class="tree">
        <el-tree
          :data="data"
          :props="treeProps"
          node-key="id"
          @node-click='treeClick'
          :render-content="renderContent">
        </el-tree>
      </div>

      <div class="sms-list">
        <!-- table -->
        <div class="table">
          <el-table ref="singleTable" :height='height'
            :data="tableData" border>
            <el-table-column type="index" width="50" label="序号" align="center" :resizable="false">
            </el-table-column>
            <el-table-column :prop="item.prop" :label="item.label" :width="item.width"
              v-for="(item, idx) in tableCate" :key="idx"
              align="center" :resizable="false">
            </el-table-column>
            <el-table-column label="操作" width="120" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-button size="small" round @click="smsDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column>
            <el-table-column label="启用状态" width="120" align="center" :resizable="false">
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
  </div>
</template>

<script>
import shortMessage from './short_message.js'

export default shortMessage
</script>

<style scoped lang='less'>
@import url('./short_message.less');
</style>
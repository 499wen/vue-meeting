<template>
  <div class="costCenter">
    <div class="header-opera">
      <div class="tap"> 
        <span>收支明细</span>
      </div>
    </div>

    <div class="content">
      <div class="left-tree">
        <el-tree
          :data="data"
          :props="treeProps"
          node-key="id"
          ref='tree'
          default-expand-all
          @node-click='treeClick'
          :expand-on-click-node="false"
          :highlight-current="true"
          :render-content="renderContent">
        </el-tree>
      </div>

      <div class="right">

        <div class="func">
          
          <div class="category">
            <div :class="['single', its.select && 'select']" v-for="(its, idx) in typeList" :key="idx" @click="handleClick(its)"> {{ its.label }} </div>
          </div>

          <el-button v-preventReClick size="small" @click="exportExcel" class="margin-right" type="primary"> 导出报表 </el-button>
        </div>

        <!-- 表格 -->
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
import costCenter from './costCenter.js'

export default costCenter
</script>

<style scoped lang='less'>
@import url('./costCenter.less');
</style>
<template>
  <div>
    <div class="header-opera">
      <div class="tap">
        <span>请假消息</span> 
      </div>

      <div class="look-more" @click="more">查看更多>>></div>
    </div>

    <!-- 表格 -->
    <div class="table">
      <el-table ref="singleTable"
        :data="tableData" border :height="height"
        style="width: 100%">
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
import leaveMess from "./leaveMess.js";

export default leaveMess;
</script>

<style scoped lang='less'>
@import url("./leaveMess.less");
</style>
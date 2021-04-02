<template>
  <div>
    <div class="header-opera">
      <div class="tap">
        <span>会议信息</span> 
      </div>

      <div class="look-more" @click="more">查看更多>>></div>
    </div>
 
    <!-- 表格 -->
    <div class="table">
      <el-table ref="singleTable"
        :data="tableData" border :height="height"
        style="width: 100%">
        <el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="meetingName" label="会议名称" width="300" align='center' :resizable='false'> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  label="会议时间" width="" :resizable='false' align='center'>
          <template slot-scope="scope">
            <div class="time">
              <span>{{ scope.row.time }}</span>
              <span>{{ scope.row.beginAndEndDate }}</span>    
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
          v-for="(item, idx) in tableCate" :key="idx"
          align="center" :resizable="false">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import meetInfo from "./meetInfo.js";

export default meetInfo;
</script>

<style scoped lang='less'>
@import url("./meetInfo.less");
</style>
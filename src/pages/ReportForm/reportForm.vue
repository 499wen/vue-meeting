<template>
  <div class="reportForm">
    <!-- 表格 -->
    <div class="table">
      <el-table :data="tableData" :height='height' border>
        <el-table-column :show-overflow-tooltip="true" type="index" width="80" label="序号" align='center' :resizable='false'></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="meetingName" label="会议名称" width="300" align='center' :resizable='false'> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  label="会议时间" width="240" :resizable='false' align='center'>
          <template slot-scope="scope">
            <div class="time">
              <span>{{ scope.row.time }}</span>
              <span>{{ scope.row.beginAndEndDate }}</span>    
            </div>
          </template>
        </el-table-column>
  
        <el-table-column :show-overflow-tooltip="true" label="邀请/通知" align='center' :resizable='false'>
          <el-table-column :show-overflow-tooltip="true" prop="inviteNumber" label="邀请/通知" align='center' :resizable='false'>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="confirmAttendanceNum" label="确认参会" align='center' :resizable='false'>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="unconfirmedAttendanceNum" label="未确认参会" align='center' :resizable='false'>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="leaveNumber" label="请假" align='center' :resizable='false'>
          </el-table-column> 
        </el-table-column>  

        <el-table-column :show-overflow-tooltip="true" prop="reportNumber" label="报到人数" width="" align='center' :resizable='false'> </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="到会签到" align='center' :resizable='false'>
          <el-table-column :show-overflow-tooltip="true" prop="shouldArrive" label="应到" align='center' :resizable='false'>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="actualNumberOfPeople" label="实到" align='center' :resizable='false'>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="notYet" label="未到" align='center' :resizable='false'>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="arrivalRate" label="到会率" align='center' :resizable='false'>
          </el-table-column>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="操作" width='180'>
          <template slot-scope="scope">
            <el-button v-preventReClick round size='small' type="primary" @click="detailed(scope.row)">查看</el-button>
            <el-button v-preventReClick round size='small' type="primary" @click="clumnLook(scope.row)">导出报表</el-button>
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

    <!-- 导出报表 -->
    <el-dialog :title="row.meetingName" :visible.sync="clumnLook_child" width="25%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <clumnLook ref="clumnLook" v-if="clumnLook_child" :row='row'></clumnLook>
      <div class="dialog-btn">
        <el-button v-preventReClick type="primary" size="small" round @click="exportBb">导出报表</el-button>
        <el-button v-preventReClick size="small" type="danger" round @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 明细 -->
    <el-dialog :title="row.meetingName" :visible.sync="detailed_child" width="80%" center :show-close='false'
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <detailed ref="detailed" v-if="detailed_child" :row='row'></detailed>
      <div class="dialog-btn">
        <el-button v-preventReClick size="small" type="danger" round @click="close">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import reportForm from './reportForm.js'

export default reportForm
</script>

<style scoped lang='less'>
@import url('./reportForm.less');
</style>
<template>
  <div class="child">
    <!-- 表格 -->
    <div class="table">
    <div class="table">
      <el-table :data="tableData" :height='height' border>
        <el-table-column type="index" width="80" label="序号" align='center' :resizable='false'></el-table-column>
        <el-table-column prop="meetingName" label="会议名称" width="300" align='center' :resizable='false'> </el-table-column>
        <el-table-column  label="会议时间" width="240" :resizable='false' align='center'>
          <template slot-scope="scope">
            <div class="time">
              <span>{{ scope.row.time }}</span>
              <span>{{ scope.row.beginAndEndDate }}</span>    
            </div>
          </template>
        </el-table-column>
  
        <el-table-column label="邀请/通知" align='center' :resizable='false'>
          <el-table-column prop="inviteNumber" label="邀请/通知" align='center' :resizable='false'>
          </el-table-column>
          <el-table-column prop="confirmAttendanceNum" label="确认参会" align='center' :resizable='false'>
          </el-table-column>
          <el-table-column prop="unconfirmedAttendanceNum" label="未确认参会" align='center' :resizable='false'>
          </el-table-column>
          <el-table-column prop="leaveNumber" label="请假" align='center' :resizable='false'>
          </el-table-column> 
        </el-table-column>  

        <el-table-column prop="reportNumber" label="报到人数" width="" align='center' :resizable='false'> </el-table-column>

        <el-table-column label="到会签到" align='center' :resizable='false'>
          <el-table-column prop="shouldArrive" label="应到" align='center' :resizable='false'>
          </el-table-column>
          <el-table-column prop="actualNumberOfPeople" label="实到" align='center' :resizable='false'>
          </el-table-column>
          <el-table-column prop="notYet" label="未到" align='center' :resizable='false'>
          </el-table-column>
          <el-table-column prop="arrivalRate" label="到会率" align='center' :resizable='false'>
          </el-table-column>
        </el-table-column>
      </el-table> 
    </div>
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
</template>

<script>
import { selfTime } from '@/plugins/plugins.js'

export default {
  data() {
    return {
      // table
      tableData: [],
      height: null,

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 1000
    }
  },
  methods: {
    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val

      this.getAttenData()
    },
    curChange(val){
      this.pageNum = val

      this.getAttenData()
    },

    // 获取参会人报到数据
    getAttenData(){
      this.$http.get(this.API.findMeetingStatistical(this.pageNum, this.pageSize, ''))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter((item, idx) => {
              var time = selfTime(new Date(item.beginDate).getTime())
              var st = selfTime(new Date(item.beginDate).getTime(), true, true)
              var et = selfTime(new Date(item.endDate).getTime(), true, true, true)
              item.number = idx + 1
              item.time = time
              item.beginAndEndDate = st + ' - ' + et;
            })
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    }
  },
  mounted() {
    // table
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    this.getAttenData()
  }
}
</script>

<style scoped lang='less'>
.child {
  width: 100%;
  height: 100%;

  .table {
    width: 100%;
    height: calc(100% - 42px);
  }
}
</style>
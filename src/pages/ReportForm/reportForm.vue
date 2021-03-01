<template>
  <div class="reportForm">
    <!-- 表格 -->
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
        <el-table-column align="center" :resizable='false' label="操作" width='180'>
          <template slot-scope="scope">
            <el-button round size='small' type="primary" @click="clumnLook(scope.row)">查看</el-button>
            <el-button round size='small' type="primary" @click="detailed(scope.row)">明细</el-button>
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

    <!-- 查看 -->
    <el-dialog title="下载选择项" :visible.sync="clumnLook_child" width="10%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <clumnLook ref="clumnLook" v-if="clumnLook_child"></clumnLook>
      <div class="dialog-btn">
        <el-button size="small" type="danger" round>取 消</el-button>
        <el-button type="primary" size="small" round>添 加</el-button>
      </div>
    </el-dialog>

    <!-- 明细 -->
    <el-dialog title="查明细" :visible.sync="detailed_child" width="80%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <detailed ref="detailed" v-if="detailed_child"></detailed>
      <div class="dialog-btn">
        <el-button size="small" type="danger" round>取 消</el-button>
        <el-button type="primary" size="small" round>添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import clumnLook from './clumnLook/clumnLook.vue'
import detailed from './detailed/detailed.vue'

export default {
  components: {
    clumnLook,
    detailed
  },
  data() {
    return {
      // table
      tableData: [{}],
      height: null,

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 10,

      // 子集组件 开关
      clumnLook_child: false,
      detailed_child: false
    }
  },
  methods: {
    // 查看
    clumnLook(data){
      this.clumnLook_child = true
    },
    // 明细
    detailed(data){
      this.detailed_child = true
    },
    // 分页方法
    sizeChange(val){
      this.pageSize = val
    },
    curChange(val){
      this.pageNum = val
    }
  },
  mounted() {
    // table
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

  }
}
</script>

<style scoped lang='less'>
.reportForm {
  width: 100%;
  height: 100%;

  .table {
    width: 100%;
    height: calc(100% - 42px);
  }
}
</style>
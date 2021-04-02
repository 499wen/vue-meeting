<template>
  <div class="child">
    <!-- 分类 -->
    <div class="header-opera list">
      <div class="tap">
        <div :class="item.select && 'select'" @click="tabList(idx)"
         v-for="(item, idx) in list" :key="idx">{{ item.name }}</div> 
      </div>
    </div>

    <!-- 表格 -->
    <div class="table">
      <el-table :data="tableData" :height='height' border>
        <el-table-column :show-overflow-tooltip="true"
        :prop="item.description" :label="item.name" :resizable='false' align='center'
          v-for="(item, idx) in tableCate" :key="idx"> </el-table-column> 
        <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="操作" width='150'>
          <template slot-scope="scope" v-if="scope.row.approvalState == '0'">
            <el-button type="primary" size='small' @click="approval(scope.row)"> 审批 </el-button>
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

    <!-- 请假审批 -->
    <el-dialog title="请假审批" :visible.sync="approval_child" width="10%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <approval ref="approval" v-if="approval_child" :form="selectRow"></approval>
      <div class="dialog-btn">
        <el-button @click="applyAgree(1)" size="small" type="primary" round>同 意</el-button>
        <el-button @click="applyAgree(2)" size="small" type="success" round>不同意</el-button>
        <el-button @click="cancel" size="small" type="danger" round>关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import approval from '../approval/approval.vue'

export default {
  components: {
    approval
  },
  data() {
    return {
      // 分类
      list: [
        {name: '请假消息', select: true, tips: '2'},
        {name: '未审批', select: false, tips: '0'},
        {name: '已审批', select: false, tips: '1'},
      ],
      tableCate: [
        { name: '请假人', description: 'userName' },
        { name: '请假会议', description: 'meetingName' },
        { name: '事由', description: 'leaveReason' },
        { name: '审批状态', description: 'stateCode' },
      ],
      tips: '2',

      // 选中row
      selectRow: {},

      // table
      tableData: [],
      height: null,

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      // 子组件 开关
      approval_child: false
    }
  },
  methods: {
    // 审批
    approval(appr){
      console.log(appr)
      this.selectRow = appr
      this.approval_child = true
    },
    // 切换list
    tabList(index){
      this.list.filter((item, idx) => idx == index ? item.select = true : item.select = false)
      this.tips = this.list[index].tips

      this.getLeave()
    },

    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val

      this.getLeave()
    },
    curChange(val){
      this.pageNum = val

      this.getLeave()
    },

    // 子组件方法
    // 审批
    applyAgree(code) {
      let child = this.$refs.approval
      let formObject = {
          approvalReplyMessage: child.form.approvalOpinions
      };
      this.$http.post(this.API.examinationAndApprovalLeave(child.form.id, code), formObject)
        .then(res => {
          if (res.code == "000") {
            this.$message.success('审批成功!')
            this.approval_child = false
            this.getLeave()
          } else {
            this.$message.error(res.msg)
          }
        });
    },
    cancel() {
      this.approval_child = false
    },

    // 获取请假数据
    getLeave() {
      var arr = ['待审批', '通过', '不通过']
      this.$http.get(this.API.findleaveInfo(this.tips, this.pageNum, this.pageSize))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter(obj => {
              obj.userName = obj.user.userName
              obj.meetingName = obj.meeting.meetingName
              if (!obj.leaveReason) {
                obj.leaveReason = "(无)"
              } 
              obj.stateCode = obj.approvalState == 0 ? arr[obj.approvalState] : arr[obj.approvalResultCode]
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

    // 获取数据
    this.getLeave()
  }
}
</script>

<style scoped lang='less'>
.child {
  width: 100%;
  height: 100%;

  .list {
    background-color: #fff;

    .tap {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      & > div {
        padding: 0 5px;
        margin: 0 10px;
        position: relative;
        cursor: pointer;
      }

      .select:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: 0px;
        left: 0;
        background-color: #234060;
      }
    }
  }

  .table {
    width: 100%;
    height: calc(100% - 92px);
  }
}
</style>
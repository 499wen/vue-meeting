<template>
  <div class="checkin">
    <div class="header">
      <!-- 条件组 -->
      <el-dropdown trigger="click" class="spacing" @command='clickCondi' placement='bottom'>
        <el-button v-preventReClick size="small">
          条件组查询<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, idx) in condiData" :key="idx" :command='idx'>{{ item.groupName }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 选择入住时间 -->
      <div> 
        入住时间: 
        <el-date-picker
            size='mini'
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>

    <!-- 表格 -->
    <el-table ref="singleTable"
      :data="tableData" border :height="400">
      <el-table-column :show-overflow-tooltip="true" label="选择" width="55" :resizable='false' align='center'>
        <template slot-scope="scope">
          <el-radio @change="chioce(scope.row)" v-model="radio" :label='scope.row.id'><i></i></el-radio>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
        v-for="(item, idx) in tableCate" :key="idx"
        align="center" :resizable="false">
      </el-table-column>
    </el-table>

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
import { mapState } from 'vuex'

export default {
  data() {
    return {
      // 条件组数据
      condiData: [],
      queryConditionArr: [],

      // 选中的时间
      time: '',
      // 单选
      radio: '',
      selectData: null,

      // table
      tableData: [],
      tableCate: [
        { label: '姓名', props: 'userName' },
        { label: '电话', props: 'phone' },
        { label: '性别', props: 'sex' },
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,
      
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: {
    // 选中条件组
    clickCondi(idx){
      let item = this.condiData[idx]
      this.queryConditionArr = item.condition
      this.getProson()
    },

    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val

      this.getProson()
    },
    curChange(val){
      this.pageNum = val

      this.getProson()
    },

    // 获取条件组 数据
    getCondi() {
      this.$http.get(this.API.selectConditionGroup('adduser'))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter(item => item.condition = JSON.parse(item.condition))
            this.condiData = res.data
          }
        })
    },

    // 选中的人员
    chioce(data) {
      this.selectData = data
    },

    // 获取人员数据
    getProson() {
      /**
       * noCheckPerson 参数
       *  参会人分组id 全部参会人id 与 会议id一致
       *  会议id
       *  num
       *  size
       */
      this.$http.get(this.API.noCheckPerson(this.meetingData.id, this.meetingData.id, this.pageNum, this.pageSize))
        .then(res => {
          if(res.code == '000' && res.data) {
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    }
  },
  created() {
    // 获取条件组
    this.getCondi()

    // 获取人员数据
    this.getProson()
  }
}
</script>

<style scoped lang='less'>
.checkin {
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
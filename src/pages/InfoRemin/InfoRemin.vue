<template>
  <div class="InfoRemin">
    <div class="header-opera">
      <div class="tap">
        <span>会务管理</span>
        <span>信息通知</span>
      </div>
      
    </div>
    
    <div class="content">
      <div class="data">
        <!-- 表格 -->
        <div class="table">
          <el-table ref="singleTable"
            :data="tableData" border :height="height">
            <el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
              v-for="(item, idx) in tableCate" :key="idx"
              align="center" :resizable="false">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="操作" width='130'>
              <template slot-scope="scope">
                <el-button size='small' round type="primary" @click="openDetailed(scope.row)">信息提醒</el-button>
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
import { selfTime } from '@/plugins/plugins.js'

export default {
  data() {
    return {
      // table
      height: null,
      tableData: [],
      tableCate: [
        {props: 'meetingName', label: '会议名称', width: '180'},
        {props: 'address', label: '会议地址', width: ''},
        {props: 'time', label: '召开时间', width: '300'},
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      
    }
  },
  methods: {
    openDetailed(row) {
      this.$router.push({path: '/remin', query: {...row}})
    },
    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val
      this.getData()
    },
    curChange(val){
      this.pageNum = val

      this.getData()
    },
    // 获取数据
    getData() {
      this.$http.get(this.API.findMeetingById(this.pageNum, this.pageSize, ''))
      .then(res => {
        console.log(res)
        if(res.code == '000'){
          let curTime = new Date().getTime()
          this.tableData = res.data.filter(item => {
            item.time = selfTime(item.beginDate, true) + ' 至 ' + selfTime(item.endDate, true)
            if(item.endDate < curTime && item.releaseCode == 1) return false
            else return item
          })
          this.total = res.total
        } else {
          this.tableData = []
          this.total = 0
        }
      })
    }
  },
  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    this.getData()

  }
}
</script>

<style lang="less" scoped>
.InfoRemin {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .content {
    width: 100%;
    height: calc(100% - 52px);
    box-sizing: border-box;
    display: flex;

    .data {
      width: 100%;
      height: calc(100% - 42px);

      .table {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
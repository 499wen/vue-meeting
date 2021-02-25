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
        <el-table-column
        :prop="item.description" :label="item.name" :resizable='false' align='center'
          v-for="(item, idx) in tableCate" :key="idx"> </el-table-column> 
        <el-table-column  label="操作" width="200" :resizable='false' align='center'>
          <template slot-scope="scope">
            <div class="time">
              <span>{{ scope.row.time }}</span>
              <span>{{ scope.row.beginAndEndDate }}</span>    
            </div>
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
</template>

<script>
export default {
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

      // table
      tableData: [],
      height: null,

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 10
    }
  },
  methods: {
    // 切换list
    tabList(index){
      this.list.filter((item, idx) => idx == index ? item.select = true : item.select = false)
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
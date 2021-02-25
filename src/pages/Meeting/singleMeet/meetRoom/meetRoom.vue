<template>
  <div class="meetRoom">
    <!-- 表格 -->
    <div class="table">
      <el-table ref="singleTable"
        :data="tableData" border :height="height">
        <el-table-column type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
        <el-table-column :prop="item.props" :label="item.label" :width="item.width"
          v-for="(item, idx) in tableCate" :key="idx"
          align="center" :resizable="false">
        </el-table-column>
        <el-table-column align="center" :resizable='false' label="预约" width='100'>
          <template slot-scope="scope">
            <span>{{scope.row.status}}</span>
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
      height: null,
      tableData: [],
      tableCate: [
        {props: 'name', label: '会议室名称', width: '300'},
        {props: 'photoFileId', label: '会议室图片', width: '180'},
        {props: 'type', label: '会议室类型', width: '150'},
        {props: 'maximumCapacity', label: '容纳人数', width: '150'},
        {props: 'address', label: '地址', width: ''},
      ],

      typeEnum: ['方形', '椭圆', '菱形'], //会议室类型

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 10
    }
  },
  methods: {
    // 分页方法
    sizeChange(val){
      this.pageSize = val
    },
    curChange(val){
      this.pageNum = val
    }
  },
  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight
  }
}
</script>

<style scoped lang='less'>
.meetRoom {
  width: 100%;
  height: 100%;
  
  .table {
    width: 100%;
    height: calc(100% - 42px);
  }
}
</style>
<template>
  <div class="smscenter">
    <!-- 功能 -->
    <div class="sms-func">
      <el-button round size='small' type="primary">个性短信配置</el-button>
      <el-button round size='small' type="success">短信发送记录</el-button>
    </div>

    <!-- 主体 -->
    <div class="sms-body">
      <!-- table -->
      <div class="table">
        <el-table ref="singleTable" @cell-mouse-enter='hoverTable' @cell-mouse-leave='closeHover'
          :data="tableData" border :height="height">
          <el-table-column align="center" :resizable='false' type="selection" width="50"></el-table-column>
          <el-table-column type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
          <el-table-column :prop="item.props" :label="item.label" :width="item.width"
            v-for="(item, idx) in tableCate" :key="idx"
            align="center" :resizable="false">
          </el-table-column>
          <el-table-column align="center" :resizable='false' label="状态" width='100'>
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

    <!-- 短信表格 -->
    <div class="sms-table" tabindex="0" :style="style">
      
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data() {
    return {
      // table
      height: null,
      tableData: [{}],
      tableCate: [
        {props: 'userName', label: '姓名', width: ''},
        {props: 'phone', label: '手机号', width: ''},
        {props: 'departmentName', label: '部门', width: ''},
        {props: 'characterId', label: '角色', width: ''},
        {props: 'attribute1', label: '组别', width: ''},
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 10,

      style: {}
    }
  },
  methods: {
    // 鼠标移动表格中
    hoverTable(row, column, cell){
          console.log(2)

      let parent = $(cell.parentNode)
      var top = parent.offset().top + parent.height()
      this.style = {
        'top': top + 'px',
        'width': parent.width() + 'px',
        'display': 'block'
      }
      // 获取子集短信 dom
      let childSms = $('.sms-table')[0]
      console.log(childSms)
      childSms.focus()
      childSms.onblur = () => {
        this.style = {
          'display': 'none'
        }
        childSms.onblur = null
      }
    },
    // 关闭 hover - table
    closeHover(){
      document.body.onmousemove = (e) => {
        if(e.toElement.getAttribute("class") != 'sms-table'){
          console.log(1)
          document.body.onmousemove = null
          this.style = {
            'display': 'none'
          }
        }
      }
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
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight
  }
}
</script>

<style scoped lang='less'>
.smscenter {
  width: 100%;
  height: 100%;

  .sms-func {
    padding-bottom: 10px;
    width: 100%;
  }

  .sms-body {
    width: 100%;
    height: calc(100% - 42px);

    .table {
      width: 100%;
      height: calc(100% - 42px);
    }
  }

  .sms-table {
    position: fixed;
    height: 300px;
    background-color: #638e50;
    box-shadow: 1px 1px 10px 1px #ccc;
    display: none;
  }
}
</style>
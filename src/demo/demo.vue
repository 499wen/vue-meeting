<template>
  <div>
    <el-table
    :data="tableData"
    style="width: 100%"
    @sort-change='hd'
    :default-sort="{prop: 'date', order: 'descending'}"
    >
    <el-table-column
      prop="date"
      label="日期"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      sortable
      @sort-method='aa'
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      >
    </el-table-column>
  </el-table>

  <div class="" @click="aaaa">点击</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    methods: {
      aaaa() {
        this.$http.post('http://192.168.0.224:19520/take/addTake', {title: 1, place: 2, describe: 3, contacts: 4, phone: 5})
          .then(res => {
            console.log(res)
          })
      },
      formatter(row, column) {
        return row.address;
      },
      hd({ column, prop, order }) {
        console.log(column, prop, order)
      },

      aa(a, b){
        consoel.log(a, b)
      }
    },

  }
</script>
<template>
  <div>
    <div class="oper">
      <el-input  placeholder="请输入内容" v-model="searchKey" class="input-with-select" @keyup.native.enter="searchBtn">
        <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
      </el-input>
      <el-button > 添加人员 </el-button>
    </div>

    <div class="member-table">
      <el-table :data="tableData" :height='height' border>
        <el-table-column :show-overflow-tooltip="true" type="selection" width="50" align='center'></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :resizable="false" align='center' type="index" label="序号" width="50"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :resizable="false"  align='center'
        v-for="(item,index) in tableCate"
        :key="index"
        :prop="item.value" :label="item.label" :width="item.width"
        ></el-table-column>
      </el-table>
    </div>

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
      searchKey: '',
      tableCate: [
        {value: 'userName', label: '姓名'},
        {value: 'sex', label: '性别'},
        {value: 'phone', label: '电话'},
      ],
      tableData: [],
      height: null,
      total: 0,
      pageNum: 1,
      pageSize: 100
    }
  },
  methods: {
    // 分页
    sizeChange(val){
      this.pageNum = 1 
      this.pageSize = val
    },
    curChange(val){
      this.pageNum = val
    },

    // 搜索按钮
    searchBtn(){
      console.log('触发')
    }
  },
  mounted() {
    var dom = document.querySelector('.member-table')
    this.height = dom.offsetHeight
  }

};
</script>

<style scoped lang='less'>
.oper {
  width: 100%;
  padding-bottom: 20px;
  box-sizing: border-box;

  .input-with-select {
    width: 40%;
    margin-right: 10px;
  }

}

.member-table {
  width: 100%;
  height: 450px;
}

.dialog-btn {
  padding-top: 10px;
  width: 100%;
  text-align: center;
}
</style>
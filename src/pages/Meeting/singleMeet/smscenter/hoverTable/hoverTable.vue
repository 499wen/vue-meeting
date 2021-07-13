<template>
  <div class="hoverTable">
    <div class="hide-table">
      <el-table ref="singleTable" @selection-change="batchDel"
        :data="tableData" border :height="height">
        <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' type="selection" width="50"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
          v-for="(item, idx) in tableCate" :key="idx"
          align="center" :resizable="false">
        </el-table-column>
      </el-table>
    </div>

    <!-- 按钮 -->
    <!-- <div class="hover-btn">
      <el-button v-preventReClick round size='small' type="primary" @click="determine">确 定</el-button>
    </div> -->
  </div>
</template>

<script>
export default {
  props: ['smsRow'],
  data() {
    return {
      height: null,
      tableData: [],
      tableCate: [
        {props: 'title', label: '短信名称', width: ''},
      ],

      // 保存已选中的短信
      saveSmsList: []
    }
  },
  methods: {
    // 确定按钮 - 将数据传给父组件
    // determine(){
    //   console.log(JSON.stringify(this.saveSmsList, false, 2))
    // },
    // 勾选回调
    batchDel(val){
      if(val.length == 0) return
      this.saveSmsList = []
      this.saveSmsList.push(...val)

      let ids = []
      val.filter(item => ids.push(item.id))

      this.$emit('update', ids)
    },
    // 获取短信
    getSms() {
      let data = this.smsRow
      if(data.meetingSMSCenters){
        this.tableData = data.meetingSMSCenters
        // 取出已选中的数据
        this.saveSmsList = data.meetingSMSCenters.filter(item => item.smsIsUse == 1 && item)

        setTimeout(() => {
          // 全选 
          this.saveSmsList.forEach(row => {
              this.$refs.singleTable.toggleRowSelection(row);
          });
        }, 100)
      }
    }
  },
  mounted() {
    // 获取表格高度
    var dom = document.querySelector('.hide-table')
    this.height = dom.offsetHeight

    // 获取短信
    this.getSms()
  }
}
</script>

<style scoped lang='less'>
.hoverTable {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .hide-table {
    width: 100%;
    height: calc(100% - 42px);
  }

  .hover-btn {
    width: 100%;
    height: 42px;
    text-align: center;
    padding-top: 10px;
  }
}
</style>
<template>
  <div class="building">
    <div class="operation">
      <el-button v-preventReClick @click="addBuild" type="primary" size="small">添加大楼</el-button>
    </div>
    <el-table :data="tableData" height="400"  border align='center'>
      <el-table-column :show-overflow-tooltip="true" type="index" align='center' label='序号' :resizable="false" width="80"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
        v-for="(item, idx) in tableCate" :key="idx"
        align="center" :resizable="false">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="操作" align='center' :resizable="false" width="300">
        <template slot-scope="scope">
          <el-button v-preventReClick @click="look(scope.row)" type="primary" size="small">查看房间</el-button>
          <el-button v-preventReClick @click="editBuild(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button v-preventReClick @click="delBuild(scope.row.id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column> 
    </el-table>

    <!-- 房间配置 -->
    <el-dialog title="添加大楼" :visible.sync="room_child" width="60%" center append-to-body
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <room v-if="room_child" ref="room" :building='curBuild'></room>
      <div class="dialog-btn">
        <el-button v-preventReClick @click="cancel" size="small" type="danger" round>关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import room from './room/room.vue'

export default {
  props: ['hotel'],
  components: {
    room
  },
  data() {
    return {
      // table
      tableData: [],
      tableCate: [
        {props: 'hotelBuildingName', label: '大楼名称', width: ''},
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      // 当前处理的大楼
      curBuild: null,
      
      // 子组件 开关
      room_child: false,

    }
  },
  methods: {
    // 添加大楼
    addBuild() {
      let name = []
      this.tableData.filter(item => name.push(item.hotelBuildingName))
      this.$prompt('请输入大楼名称', '提示', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (val) => {
          if(!val.trim()){
            return '请输入大楼名称'
          }
          if(name.includes(val.trim())){
            return '大楼名称重复'
          }

          return true
        }
      }).then((obj) => {
        this.$http.post(this.API.addListByHotelId(this.hotel.id), [{hotelBuildingName: obj.value}])
          .then(res => {
            if(res.code == '000'){
              this.$message.success('添加成功!')
              this.getAllFloor()
            } else {
              this.$message.info(res.msg)
            }
          })
      }).catch((err) => {})
    },
    // 查看房间
    look(row) {
      this.curBuild = row
      this.room_child = true
    },
    // 编辑
    editBuild(row) {
      let name = []
      this.tableData.filter(item => name.push(item.hotelBuildingName))
      this.$prompt('请输入大楼名称', '提示', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (val) => {
          if(!val.trim()){
            return '请输入大楼名称'
          }
          if(name.includes(val.trim())){
            return '大楼名称重复'
          }

          return true
        }
      }).then((obj) => {
        let from = {...row}
        from.hotelBuildingName = obj.value
        this.$http.post(this.API.updateListByHotelId(this.hotel.id), [from])
          .then(res => {
            if(res.code == '000'){
              this.$message.success('修改成功!')
              this.getAllFloor()
            } else {
              this.$message.info(res.msg)
            }
          })
      }).catch((err) => {})
    },
    // 删除 
    delBuild(id) {
      this.$confirm('是否删除该大楼?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn_custom_cancel',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {

        this.dodelBuild(id)
      }).catch(() => {})
    },
    dodelBuild(id) {
      this.$http.post(this.API.delBuilding(id))
        .then(res => {
          if(res.code == '000'){
            this.$message.success('删除成功!')
            this.pageNum = 1
            this.getAllFloor()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    // 子组件 方法
    cancel(){
      this.room_child = false
    },

    // 获取全部大楼
    getAllFloor(){
      this.$http.get(this.API.findByHotelIdAndPage(this.hotel.id))
        .then(res => {
          if(res.code == '000' && res.data){
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
    // 获取全部大楼数据
    this.getAllFloor()
  }
}
</script>

<style scoped lang='less'>
.building {

  .operation {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
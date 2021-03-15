<template>
  <div class="hotel">
    <div class="header-opera">
      <div class="tap">
        <span>基础设置</span> 
        <span>酒店管理</span>
      </div>

      <div class="opera">
        <el-input size="small" placeholder="请输入酒店名称" v-model="searchKey" @keyup.native.enter="searchBtn">
          <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
        </el-input>
        <el-button size="small" @click="addHotel" type="primary" plain class="add-hotel"> 新建酒店 </el-button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table" >
      <el-table :data="tableData" :height='height' border>
        <el-table-column :resizable="false" align='center' type="index" label="序号" width="50"></el-table-column>
        <el-table-column :resizable="false"  align='center' label="酒店封面" width="200">
          <template slot-scope="scope">
            <img v-if="!scope.row.hotelImageUrl" src="@/assets/images/defaultImg.png" class="hotel-img" />
            <img v-else id="updateUserImg" class="hotel-img" :src="`/zhenapi/fileserve/hotelFile/hotel/hotelImage/${loginInfo.companyId}/${scope.row.hotelImageUrl}`" alt="">
          </template>
        </el-table-column> 
        <el-table-column :resizable="false" align='center'
        v-for="(item,index) in tableCate"
        :key="index"
        :prop="item.value" :label="item.label" :width="item.width"
        ></el-table-column>
        <el-table-column :resizable="false"  align='center' label="操作" width="350">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="addUsers(scope.row)" round>楼栋配置</el-button>
            <el-button size="small" type="warning" @click="handleEdit(scope.row)" round>修改酒店</el-button>
            <el-button size="small" type="danger" @click="deleteUsers(scope.row)" round>删除酒店</el-button>
          </template> 
        </el-table-column> 
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagin" >
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


    <!-- 楼栋配置 -->
    <el-dialog title="楼栋配置" :visible.sync="building_child" width="60%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <building ref="building" v-if="building_child"></building>
      <div class="dialog-btn">
        <el-button @click="cancel" size="small" type="primary" round>关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dataScrollLoad } from '@/plugins/plugins'
import building from './building/building.vue'

export default {
  components: {
    building
  },
  data() {
    return {
      searchKey: '',
      tableCate: [
        { label: "酒店名称", value: "hotelName", width: '200' },
        { label: "酒店地址", value: "address", width: '300' },
        { label: "描述", value: "remark", width: '' }
      ],
      tableData: [],
      height: null,
      total: 0,
      pageNum: 1,
      pageSize: 10,

      // 子组件 开关
      building_child: false
    }
  },
  methods: {
    // 楼栋配置
    addUsers(data){
      this.building_child = true
    },
    // 添加酒店
    addHotel(){
      this.$router.push('/addHotel')
    },
    // 修改酒店
    handleEdit(data){
      this.$router.push({
        path: '/editHotel', 
        query: { id: data.id }
      })
    },
    // 删除酒店
    deleteUsers(data){
      this.$confirm('是否删除该酒店?', '提示', {
        closeOnPressEscape: false,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn_custom_cancel',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.API.deleteHotelById(data.id))
          .then(res => {
            if(res.code == '000'){
              this.$message.success('删除成功！')
              this.getHotelData()
            } else {
              this.$message.error(res.msg)
            }
          })
      }).catch(() => {})
    },
    // 分页方法
    sizeChange(val){
      this.pageSize = val
    },
    curChange(val){
      this.pageNum = val
    },

    // 关闭所有子组件
    cancel(){
      this.building_child = false
    },

    // 查询酒店数据
    getHotelData() {
      this.$http.get(this.API.findHotelByCompanyId(this.pageNum, this.pageSize))
        .then(res => {
          if(res.code == '000' && res.data){
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    },
    // 搜索按钮
    searchBtn(){
      console.log('触发')
    }
  },
  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 查询酒店数据
    this.getHotelData()
  }
};
</script>

<style scoped lang='less'>
.hotel {
  width: 100%;
  height: 100%;

  .opera {
    display: flex;
    align-items: center;
    height: 100%;

    .add-hotel {
      margin-left: 10px;
    }
  }

  .table {
    width: 100%;
    height: calc(100% - 97px);

    .hotel-img {
      width: 112px;
      height: 71px;
    }
  }
}
</style>
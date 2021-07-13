<template>
  <div class="hotel">
    <div class="header-opera">
      <div class="tap">
        <span>基础设置</span>
        <span>餐厅管理</span>
      </div>

      <div class="opera">
        <el-input size="small" placeholder="请输入餐厅名称" v-model="searchKey" @keyup.native.enter="searchBtn">
          <el-button v-preventReClick slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
        </el-input>
        <el-button v-preventReClick size="small" @click="addHotel" type="primary" plain class="add-hotel"> 新建餐厅 </el-button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table" >
      <el-table :data="tableData" :height='height' border>
        <el-table-column :show-overflow-tooltip="true" :resizable="false" align='center' type="index" label="序号" width="50"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :resizable="false"  align='center' label="餐厅封面" width="200">
          <template slot-scope="scope">
            <img v-if="!scope.row.restaurantPhoto" src="@/assets/images/defaultImg.png" class="hotel-img" />
            <img v-else id="updateUserImg" class="hotel-img" :src="API.echoImage(scope.row.restaurantPhoto, 'Restaurant')" alt="">
          </template>
        </el-table-column> 
        <el-table-column :show-overflow-tooltip="true" :resizable="false" align='center'
        v-for="(item,index) in tableCate"
        :key="index"
        :prop="item.value" :label="item.label" :width="item.width"
        ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :resizable="false"  align='center' label="操作" width="350">
          <template slot-scope="scope">
            <el-button v-preventReClick size="small" type="warning" @click="handleEdit(scope.row)" round>修 改</el-button>
            <el-button v-preventReClick size="small" type="danger" @click="deleteUsers(scope.row)" round>删 除</el-button>
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

  </div>
</template>

<script>
import { dataScrollLoad } from '@/plugins/plugins'

export default {
  data() {
    return {
      searchKey: '',
      tableCate: [
        { label: "名称", value: "restaurantName", width: '' },
        { label: "餐厅类别", value: "restaurantType", width: '' },
        { label: "就餐人数", value: "maxPeopleNumber", width: '' },
        { label: "餐厅地点", value: "restauranAddress", width: '300'}
      ],
      tableData: [],
      height: null,
      total: 0,
      pageNum: 1,
      pageSize: 100 
    }
  },
  methods: {
    // 删除餐厅
    deleteUsers(data){
      this.$confirm('是否删除该餐厅?', '提示', {
          closeOnPressEscape: false,
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn_custom_cancel',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.API.delectRestaurantById(data.id))
            .then(res => {
              if(res.code == '000'){
                this.$message.success('删除成功!')
                // 重新获取数据
                this.getRestaurant()
              } else {
                this.$message.error(res.msg)
              }
            })
        }).catch(() => {})
    },
    // 修改餐厅
    handleEdit(data){
      this.$router.push({path: '/editRestaurant', query: {
        id: data.id
      }})
    },
    // 添加餐厅
    addHotel(){
      this.$router.push('/addRestaurant')
    },
    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val
      this.getRestaurant()
    },
    curChange(val){
      this.pageNum = val
      this.getRestaurant()
    },

    // 获取餐厅数据
    getRestaurant(){
      this.$http.get(this.API.selectRestaurantAll(this.pageNum, this.pageSize, this.searchKey))
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
      this.pageNum = 1
      this.getRestaurant()
    }
  },
  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取餐厅数据
    this.getRestaurant()
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
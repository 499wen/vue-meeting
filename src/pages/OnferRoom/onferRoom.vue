<template>
  <div class="hotel">
    <div class="header-opera">
      <div class="tap">
        <span>基础设置</span> 
        <span>会议室管理</span>
      </div>

      <div class="opera">
        <el-input size="small" placeholder="请输入会议室名称" v-model="searchKey" @keyup.native.enter="searchBtn">
          <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
        </el-input>
        <el-button size="small" @click="addHotel" type="primary" plain class="add-hotel"> 新建会议室 </el-button>
      </div>
    </div>

    <!-- <router-view /> -->
    <!-- 表格 -->
    <div class="table" >
      <el-table :data="tableData" :height='height' border>
        <el-table-column :show-overflow-tooltip="true" :resizable="false" align='center' type="index" label="序号" width="50"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :resizable="false"  align='center' label="会议室封面" width="200">
          <template slot-scope="scope">
            <img v-if="!scope.row.hotelImageUrl" src="@/assets/images/defaultImg.png" class="hotel-img" />
            <img v-else id="updateUserImg" class="hotel-img" :src="`/zhenapi/fileserve/hotelFile/hotel/hotelImage/${loginInfo.companyId}/${scope.row.hotelImageUrl}`" alt="">
          </template>
        </el-table-column> 
        <el-table-column :show-overflow-tooltip="true" :resizable="false" align='center'
        v-for="(item,index) in tableCate"
        :key="index"
        :prop="item.value" :label="item.label" :width="item.width"
        ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :resizable="false"  align='center' label="操作" width="350">
          <template slot-scope="scope">
            <el-button size="small" type="warning" @click="handleEdit(scope.row)" round>修改会议室</el-button>
            <el-button size="small" type="danger" @click="deleteUsers(scope.row)" round>删除会议室</el-button>
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
        { label: "会议室名称", value: "name", width: '200' },
        { label: "会议室类型", value: "showType", width: '130' },
        { label: "容纳人数", value: "maximumCapacity", width: '130' },
        { label: "会议室地址", value: "address", width: '300' },
        { label: "描述", value: "notes", width: '' }
      ],
      tableData: [],
      height: null,
      total: 0,
      pageNum: 1,
      pageSize: 100
    }
  },
  methods: {
    // 删除会议室
    deleteUsers(data){
      this.$confirm('是否删除该会议室?', '提示', {
        closeOnPressEscape: false,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn_custom_cancel',
        type: 'warning'
      }).then(() => {
          this.$http.post(this.API.delectRoomById(data.id))
            .then(res => {
              if(res.code == '000'){
                this.$message.success('删除成功!')
                // 重新获取数据
                this.getRoomData()
              } else {
                this.$message.error(res.msg)
              }
            })
      }).catch(() => {})
    },
    // 添加会议室
    addHotel(){
      this.$router.push('/addOnferRoom')
    },
    // 编辑会议室
    handleEdit(data){
      this.$router.push({path: '/editOnferRoom', query: {
        id: data.id
      }})
    },
    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val

      this.getRoomData()
    },
    curChange(val){
      this.pageNum = val

      this.getRoomData()
    },

    // 获取会议室数据
    getRoomData(){
      let showType = ['方形', '椭圆', '圆桌形']
      this.$http.get(this.API.selectRoomByCompany(this.pageNum, this.pageSize, this.searchKey))
        .then(res => {
          if(res.code == '000' && res.data){
            // 处理数据
            res.data.filter(item => item.showType = showType[item.type])
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
      this.getRoomData()
    }
  },
  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取会议室数据
    this.getRoomData()
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
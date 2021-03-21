<template>
  <div class="addAtte">
    <el-form ref="addForm" :model="addRoomForm" :rules="addFormRules" label-width="80px" class="head">
      <el-form-item label="选择酒店" prop="hotelRoomId" size="small">
          <el-cascader :props="props" :options="options" v-model='addRoomForm.hotelRoomId' @change="setHotelRoomId"></el-cascader>
      </el-form-item>
    </el-form>

    <!-- table -->
    <div class="data-atte">
      <div class="table">
        <el-table ref="singleTable" @selection-change="batchDel"
          :data="tableData" border :height="height">
          <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' type="selection" width="50"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
            v-for="(item, idx) in tableCate" :key="idx"
            align="center" :resizable="false">
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
let load

export default {
  data() {
    return {
      searchKey: '',

      // table
      height: null,
      tableData: [],
      tableCate: [
        { label: "房间号", props: "roomNumber", width: '' },
        { label: "房间类型", props: "roomType", width: '' },
        { label: "房间等级", props: "roomGrade", width: '' }
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      // 表单验证
      addRoomForm:{
        //会议ID
        meetingId: "",
        //酒店名称/Id
        hotelRoomId: "",
      },
      //添加客房表单校验
      addFormRules:{
        hotelRoomId: [
          { required: true, message: "请选择酒店大楼", trigger: 'blur' }
        ],
      },

      // 选中的酒店
      selectedData: {
        hotelBuildingId: '',
        hotelId: ''
      },
      // 选中的table row
      selectRoom: [],

      // 联级选择
      options: [{value: 1, label: '指南'}],
      props: {
        lazy: true,
        vue: null,
        lazyLoad (node, resolve) {
          const { level } = node, vue = this.vue
          console.log(level, node.value)
          vue.selectedData.hotelId = node.value

          // 第二级 - 酒店大楼
          vue.levelChild(node.value, url => {
            console.log(url)
            vue.$http.get( url ).then(res => {
              if(res.code == '000'){
                const nodes = res.data
                  .map(item => ({
                    value: item.id,
                    label: item.roomNumber || item.hotelBuildingName,
                    leaf: level >= 2
                  }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                setTimeout(() => {
                  resolve(nodes);
                }, 500);
              }
            })
          }) 

          // 第三级 - 大楼层数 
          vue.getFloorCeng(node.value, url => {
            console.log(url)
            vue.$http.get( url ).then(res => {
              if(res.code == '000'){
                const nodes = res.data
                  .map(item => ({
                    value: item.id,
                    label: '第' + item.floor + '层',
                    leaf: level >= 2
                  }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                setTimeout(() => {
                  resolve(nodes);
                }, 500);
              }
            })
          })
        }
      },
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: {
    // table 勾选回调
    batchDel(val){
      this.selectRoom = val
    },

    // 选择下拉框
    setHotelRoomId(val){
      // 选中的数据 id依次往后推
      console.log(val)
      if(val){
        this.selectedData.hotelBuildingId = val[1]
        this.addRoomForm.floor = val[2]
        // console.log(this.selectedData)
        this.getRoom(val[2])
      }

    },
    // 查询 大楼 
    levelChild(id, callBack){
      var url = this.API.findByHotelIdAndPage(id)
      
      callBack(url)
    },
    // 查询大楼层数
    getFloorCeng(id, callBack){
      var url = this.API.selectFloorByHotelId(id)
      
      callBack(url)
    },

    // 搜索按钮
    searchBtn(){
      this.pageNum = 1
      this.getHotels()
    },
    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val
      this.getHotels()
    },
    curChange(val){
      this.pageNum = val
      this.getHotels()
    },

    // 获取房间
    getRoom(id){
      var roomGrade = ['普通套房', '豪华套房', '总统套房']
      this.$http.get(this.API.accordMeetRoom(this.meetingData.id, id,  this.pageNum, this.pageSize))
        .then(res => {
          console.log(res)
          if(res.code == '000' && res.data){
            res.data.filter(item => {
              item.roomType = item.hotelRoomType == 1 ? '单人房' : '双人房'
              item.roomGrade = roomGrade[item.hotelRoomGrade]
            })
            this.tableData = res.data
            this.total = res.total

          } else {
            this.$message.error(res.msg)
            this.tableData = []
            this.total = 0
 
          }
        }).catch(err=> {})
    },
    // 获取酒店数据
    getHotels() {
      this.options = []
      this.$http.get(this.API.findHotelByCompanyId(1, 999))
        .then(res => {
          if(res.code == '000' && res.data) {
            res.data.filter(item => {
              item.label = item.hotelName
              item.value = item.id
              this.options.push(item)
            })
          } 
        })
    },
  },
  created() {
    this.props.vue = this
    this.getHotels()
  },
  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight
  }
}
</script>

<style scoped lang='less'>
.addAtte {
  width: 100%;
  height: 100%;

  .head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .data-atte {
    width: 100%;
    height: 524px;

    .table {
      width: 100%;
      height: calc(100% - 42px);
    }
  }
}
</style>
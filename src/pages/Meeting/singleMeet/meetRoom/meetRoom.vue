<template>
  <div class="meetRoom">
    <!-- 表格 -->
    <div class="table">
      <el-table ref="singleTable"
        :data="tableData" border :height="height">
        <el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" width="300" prop="name" label="会议室名称" align="center" :resizable="false"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" width="180px" align="center" label="会议室图片" :resizable='false'>
          <template slot-scope="scope">
            <img v-if="!scope.row.photoFileId" src="@/assets/images/defaultImg.png" class="hotel-img" />
            <img v-else id="updateUserImg" class="hotel-img" :src="API.echoImage(scope.row.photoFileId, 'MeetingRoomImage')" alt="">
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
          v-for="(item, idx) in tableCate" :key="idx"
          align="center" :resizable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
          label="状态" width="150px" align="center" prop="stateCode">
          <template slot-scope="scope" v-if="scope.row.Is !== 3">
            <div v-if="scope.row.Is == '0'" class="ball-fa">
              <div class="ball" style="color: #ed7d31 !important;">待审批</div>
            </div>
            <div v-if="scope.row.Is == '1'" class="ball-fa">
              <div class="ball" style="color: #409EFF #16a085">已通过</div>
            </div>
            <div v-if="scope.row.Is == '2'" class="ball-fa">
              <div class="ball" style="color: #f60a0a">未通过</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="预约"
          width="100px" align="center" prop="stateCode" :resizable='false'>
          <template slot-scope="scope" v-if="scope.row.Is === 3">
            <el-button v-preventReClick type="primary" @click="subscribe(scope.row.id)" 
            round :disabled='meetIsEnd' size="small">选择</el-button>
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
import { mapState } from 'vuex'

export default {
  data() {
    return {
      height: null,
      tableData: [],
      tableCate: [
        {props: 'type', label: '会议室类型', width: '150'},
        {props: 'maximumCapacity', label: '容纳人数', width: '150'},
        {props: 'address', label: '地址', width: ''},
      ],

      typeEnum: ['方形', '椭圆', '菱形'], //会议室类型

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      meetIsEnd: false
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: {
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

    // 选择会议室
    subscribe(val){
      // 获取当天整点
      let startTime = new Date(new Date(this.meetingData.beginDate).toLocaleDateString()).getTime(),
        endTime = new Date(new Date(this.meetingData.endDate).toLocaleDateString()).getTime(),
        sT = this.meetingData.beginDate - startTime,
        eT = this.meetingData.endDate - endTime
        
			var obj = {
				meetingRoomId: val,
				meetingId: this.meetingData.id,
				startTime,
	 			endTime,
				isStartTime: sT,
				isEndTime: eT,
				remarks: '备注'
      }
      this.$confirm('您是否确认预约该会议室?', '会议室预约审批', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.API.bookingMeetingRoom, obj)
        .then(res => {
          if(res.code == '000'){
            this.$message.success('预约成功, 待审批!')
            this.getRoomData()
          } else {
            this.$message.info(res.msg)
          }
        })
      }).catch(() => {})

    },

    // 获取会议室数据
    getRoomData(){
      let todayTime = new Date(new Date().toLocaleDateString()).getTime(),
        obj = {
          startDate: todayTime,
          endDate: todayTime + 3600 * 24 * 1000 - 1000,
          meetingId: this.meetingData.id
        }

      this.$http.post(this.API.selectRoomByBettwnDate(this.pageNum, this.pageSize), obj)
        .then(res => {
          if(res.code == '000') {
            let List = res.data;
            if(List && List.length){
              // List.filter(item => item.Is = 0)
              this.tableData = List
              this.total = res.total
    
            } else {
              this.$message.info('当前时间段没有可预约的会议室！')
            }
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    }
  },
  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取会议室数据
    this.getRoomData()
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

    .hotel-img {
      width: 112px;
      height: 71px;
    }
  }
}
</style>
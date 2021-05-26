<template>
  <div class="approval_atten">
    <div class="header-opera">
      <div class="tap">
        <span>会议室预约</span>
        <span>预约审批</span>
      </div>
    </div>

    <!-- 切换类型 -->
    <div class="tab-type">
      <div @click="getApproval" :class="['single', tabIndex == 0 && 'select']">全部</div>
      <div @click="getType(0)" :class="['single', tabIndex == 1 && 'select']">未审批</div>
      <div @click="getType(1)" :class="['single', tabIndex == 2 && 'select']">已审批</div>
    </div>
 
    <!-- 表格 -->
    <div class="table">
      <el-table ref="multipleTable" :data="tableData" border :height='height'
        @selection-change="handleSelectionChange">
          <!-- 序号 -->
          <el-table-column :resizable='false' align="center" type="index"  label="序号" width='60'></el-table-column>
          <el-table-column align="center" label="会议名称" prop="meetingName"></el-table-column>
          <el-table-column label="时间" width='120' align="center" prop="stateCode">
            <template slot-scope="scope">
              <div style="display: block; text-align: center">
                <div >{{ scope.row.time }} </div>
                <div>{{ scope.row.st + ' - ' + scope.row.et }} </div>
              </div>
              
            </template>
          </el-table-column>
          <!-- 会议室名称 -->
          <el-table-column :resizable='false' align="center" label="会议室名称" prop="name" width='170'></el-table-column>
          <!-- 会议室图片 -->
          <el-table-column :resizable='false' align="center" label="会议室图片" prop="photoFileId" width='150'>
            <template slot-scope="scope">
              <img v-if="scope.row.photoFileId" class="photo" :src="API.echoImage(scope.row.photoFileId, 'MeetingRoomImage')"/>
              <img v-else src="@/assets/images/defaultImg.png" class="photo" alt="">
            </template>
          </el-table-column>
          <!-- 会议室类型 -->
          <el-table-column :resizable='false' align="center" label="会议室类型" width='100' prop="cate">
            <template
              slot-scope="scope">
              {{scope.row.cate}}
            </template>
          </el-table-column>
          <el-table-column :resizable='false' align="center" label="容量" width='80' prop="maximumCapacity">
            <template slot-scope="scope">{{scope.row.maximumCapacity}}人</template>
          </el-table-column>
          <el-table-column align="center" label="地址" prop="address" width='220'></el-table-column>
          <el-table-column align="center" label="申请人" width='80' prop="customerName"></el-table-column>

          <el-table-column label="状态" width='80' align="center" prop="stateCode">
            <template slot-scope="scope">
              <!-- {{stateEnum[scope.row.stateCode]?stateEnum[scope.row.stateCode]:"未知"}} -->
              <span v-if="scope.row.stateCode == '0'" style="color:#f19d19;">未审批</span>
              <span v-if="scope.row.stateCode == '1'" style="color:#01b59c;">已通过</span>
              <span v-if="scope.row.stateCode == '2'" style="color:#fe0052;">未通过</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width='170'>
            <template slot-scope="scope">
              <!-- scope.row.stateCode == 0 -->
              <div v-if="scope.row.stateCode != null">
                <el-button
                  size="mini" round
                  class="operation_btn"
                  style="background-color:#53c6ac;color:#fff;"
                  @click="agree(scope.row)"
                >同意</el-button>
                <el-button
                  size="mini" round
                  class="operation_btn"
                  type="danger"
                  @click="disagree(scope.row)"
                >不同意</el-button>
              </div>
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
import { selfTime } from '@/plugins/plugins.js'

export default {
  data() {
    return {
      // tab
      tabIndex: 0,

      // table
      height: null,
      tableData: [],
      tableCate: [
        { prop: 'userName', label: '申请人', width: '150'},
        { prop: 'address', label: '地址', width: '150'},
        { prop: 'companyName', label: '单位', width: '200'},
        { prop: 'departmentName', label: '部门', width: ''},
        { prop: 'email', label: '邮件', width: '180'},
        { prop: 'time', label: '申请时间', width: '200'}
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      meetRoomTypeEnum:['方形','椭圆','菱形'], //会议室类型
      stateEnum:['待审批','通过','未通过'], //状态
    }
  },
  methods: {
    // 表格多选框
    handleSelectionChange(val){

    },
		// 同意审批申请
		agree:function(row){
			this.$confirm('确认同意申请吗？', '确认', {
				cancelButtonClass: 'btn_custom_cancel',
				type: 'success'
			}).then(() => {
				var obj = { id: row.id,  remarks: '', stateCode: 1, roomName: row.name, beeginDate: row.beginDate, creatorId: row.creatorId}
				this.$http.post(this.API.approvalBinDing, obj)
				.then(res => {
					if("000" == res.code){
						this.$message.success("审批通过");
						if(this.tabIndex == 0) {
              this.getApproval()
            } else {
              this.getType(this.tabIndex - 1)
            }
					}else{
						this.$message.error("审批出现错误,请重试!");
					}
				})
			}).catch(() => {});
		},
		// 不同意审批申请
		disagree:function(row){
			this.$confirm('确认拒绝申请吗？', '确认', {
				cancelButtonClass: 'btn_custom_cancel',
				type: 'warning'
			}).then(() => {
				var obj = { id: row.id,  remarks: '', stateCode: 2, roomName: row.name, beeginDate: row.beginDate, creatorId: row.creatorId}
				this.$http.post(this.API.approvalBinDing, obj)
				.then(res => {
					if("000" == res.code){
						this.$message.success("已拒绝审批申请");
						if(this.tabIndex == 0) {
              this.getApproval()
            } else {
              this.getType(this.tabIndex - 1)
            }
					}else{
						this.$message.error("拒绝审批出现错误,请重试!");
					}
				})
			}).catch(() => {});
		},
    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val

      if(this.tabIndex == 0) {
        this.getApproval()
      } else {
        this.getType(this.tabIndex - 1)
      }
    },
    curChange(val){
      this.pageNum = val

      if(this.tabIndex == 0) {
        this.getApproval()
      } else {
        this.getType(this.tabIndex - 1)
      }
    },

    // 未审批 - 已审批
    getType(idx){
      this.tabIndex = idx + 1
      this.$http.get(this.API.selectByStateCodeAlready(idx, this.pageNum, this.pageSize))
        .then(res => {
          console.log(res)
          if(res.code == '000' && res.data){
            res.data.filter(item => {
              item.cate = this.meetRoomTypeEnum[item.type]
              item.time = selfTime(item.beginDate, false)
              item.st = selfTime(item.beginDate, false, true)
              item.et = selfTime(item.endDate, false, true, true)
            })

            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    },
    // 获取全部审批数据
    getApproval() {
      this.tabIndex = 0
      this.$http.get(this.API.selectByStateCode(this.pageNum, this.pageSize))
        .then(res => {
          console.log(res)
          if(res.code == '000' && res.data){
            res.data.filter(item => {
              item.cate = this.meetRoomTypeEnum[item.type]
              item.time = selfTime(item.beginDate, false)
              item.st = selfTime(item.beginDate, false, true)
              item.et = selfTime(item.endDate, false, true, true)
            })

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
    // 表格高度
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取全部审批数据
    this.getApproval()
  }
};
</script>

<style scoped lang='less'>
.approval_atten {
  width: 100%;
  height: 100%;

  .tab-type {
    width: 100%;
    margin-bottom: 10px; 
    display: flex;

    .single {
      padding: 0 20px;
      padding-bottom: 5px;
      margin-right: 10px;
      font-size: 16px;
      color: #333;
      position: relative;
      cursor: pointer;
    }

    .select:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #409eff;
    }
  }

  .table {
    height: calc(100% - 133px);
    width: 100%;
  }

  .photo {
    width: 121px;
    height: 71px;
  }
}
</style>
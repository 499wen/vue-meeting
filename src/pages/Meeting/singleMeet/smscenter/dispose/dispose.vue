<template>
  <div class="dispose">
    <div class="top">
      <!-- 条件组查询 -->
      <el-dropdown trigger="click" class="spacing" @command='clickCondi' placement='bottom'>
        <el-button v-preventReClick size="small">
          条件组查询<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, idx) in condiData" :key="idx" :command='idx'>{{ item.groupName }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-input size="small" placeholder="输入参会人名称、手机号" v-model="searchKey" @keyup.native.enter="getAtten" class="search">
        <el-button v-preventReClick slot="append" icon="el-icon-search" @click="getAtten"></el-button>
      </el-input>
    </div>

    <div class="bottom">
      <!-- 短信 -->
      <div class="sms">
        <el-table ref="singleTable"
          :data="tableData" border :height="480">
          <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' width="50" >
            <template slot-scope="scope">
                <el-radio v-model="radio" :label='scope.row.id' @change="select(scope.row)">{{ '' }}</el-radio>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
            v-for="(item, idx) in tableCate" :key="idx"
            align="center" :resizable="false">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="短信类型">
            <template slot-scope="scope">
                {{ scope.row.groupName }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 按钮 -->
      <div class="btn">
        <el-button v-preventReClick size="small" @click="sendOut"> 发送 </el-button>
      </div>

      <!-- 人员 -->
      <div class="person">
        <el-table ref="singleTable" @selection-change="batchDel"
          :data="personData" border :height="480">
          <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' type="selection" width="50"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
            v-for="(item, idx) in personCate" :key="idx"
            align="center" :resizable="false">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="手机号">
            <!-- <template slot="header" slot-scope="scope">
              <el-input v-model="searchKey" size="mini"
              @keyup.native.enter="getAtten" placeholder="输入参会人名称、手机号"/>
            </template> -->
            <template slot-scope="scope">
                {{ scope.row.phone }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { dataScrollLoad } from '@/plugins/plugins'

export default {
  data() {
    return {
      // 短信表格
      tableData: [],
      tableCate: [
        {props: 'title', label: '短信名称', width: '200'},
      ],
      smsType: [],
      // 当前选中的短信类型
      curSmsType: {},
      // 勾选数据
      curPerson: {},

      // 人员表格
      personData: [],
      personCate: [
        {props: 'userName', label: '姓名', width: '200'},
        // {props: 'phone', label: '手机号', width: '150'},
      ],
      
      searchKey: '',
      // 当前选中人员
      batchData: [],
      radio: '',

      // 条件组数据
      condiData: [],
      queryConditionArr: [],
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: {
    batchDel(data) {
      this.batchData = data
    },
    // 发送
    sendOut() {
      // 短信数据  人员数据
      let batchData = this.batchData
      , curPerson = this.curPerson
      , ids = []
      if(!curPerson.id){
        this.$message.error('请选择短信')
        return 
      }
      if(batchData.length == 0) {
        this.$message.error('请勾选人员')
        return 
      }

      batchData.filter(item => ids.push(item.id))

      console.log(batchData, curPerson)
      this.$http.post(this.API.sendMeetingSmsById(this.meetingData.id, this.curPerson.id), ids)
        .then(res => {
          if(res.code == '000'){
            this.$message.success('发送成功!')
          } else {
            this.$message.error(res.msg)
          }
        })
    },

    // 短信类型
    getSmsType() {
      this.$http.get(this.API.findCompanySmsGroup)
        .then(res => {
          if(res.code == '000'){
            this.smsType = res.data.sort((cur, next) => cur.sortNum - next.sortNum)
            // 默认给第一个值
            this.curSmsType = this.smsType[0]

            this.getSms()
          }
        })
    },
    

    // 获取短信
    getSms() {
      let sms = ['SMS_186952058', 'SMS_205821314', 'SMS_186967052', 'SMS_186952054', 'SMS_186942209', 'SMS_186942205', 'SMS_186942203', 'SMS_192720251', 'SMS_205473967', 'SMS_192720251', 'SMS_205821314', 'SMS_205473967']
      this.$http.get(this.API.findAllSms(1, 999))
        .then(res => {
          if(res.code == '000'){
            this.tableData = res.data.filter(item=> sms.includes(item.id) && item).sort((cur, next) => cur.sortNum - next.sortNum)
          } else {
            this.tableData = []
          }
        })
    },
    // 修改短信类型
    editSmsType(item){
      console.log(item)
      this.curSmsType = this.smsType[item]
      this.getSms()
    },

    // 选择 人员
    select(item) {
      this.curPerson = item
    },

    // 选中条件组
    clickCondi(idx){
      let item = this.condiData[idx]
      // 判断是否全体参会人  添加人员
      // if(this.meetingData.id == this.groupId) {
      //   item.condition.filter(item => item.value == '部门' ? item.fieldName = 'oldDepartmentName' : '')
      // } else {
        item.condition.filter(item => item.value == '部门' ? item.fieldName = 'departmentName' : '')
      // }
      this.queryConditionArr = item.condition
      this.getAtten()
    },
    // 获取条件组 数据
    getCondi() {
      this.$http.get(this.API.selectConditionGroup('adduser'))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter(item => item.condition = JSON.parse(item.condition))
            this.condiData = res.data
          }
        })
    },

    // 获取参会分组
    getAtten(){
      let obj = {
        contanUserIdArr: [],
        ifContanUserIdArr: false,
        queryConditionArr: this.queryConditionArr
      }
      this.$http.post(this.API.findByMeetingIdAndPage(this.meetingData.id, this.meetingData.id, 1, 99999, this.searchKey), obj)
        .then(res => {
          if(res.code == '000'){
            res.data.filter(item => item.radio = false)

            let table_scroll = document.querySelector('.person .el-table__body-wrapper')
            dataScrollLoad(table_scroll, res.data, 1, 50, (data) => {
              this.personData = data
            })
            
          } else {
            this.personData = []
          }
        })
    }
  },
  mounted() {
    // 获取短信类型
    this.getSms()

    // 获取全体参会人
    this.getAtten()

    this.getCondi()
  }
}
</script>

<style scoped lang='less'>
.dispose {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  .top {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;

    .search {
      width: 300px;
    }
  }
  
  .bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .sms {
      width: calc(50% - 50px);
      height: 480px;
    }

    .btn { 
      width: 60px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
    }

    .person {
      width: calc(50% - 50px);
      height: 480px;
    }
  }

}
</style>
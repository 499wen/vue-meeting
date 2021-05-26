<template>
  <div class="addsms">
    <el-table ref="singleTable"
      :data="tableData" border :height="height">
      <el-table-column align="center" :resizable='false' label="全选" width="50">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.select" @change="batchDel(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="groupName" label="短信类型" :width="200"
        align="center" :resizable="false">
      </el-table-column>
      <el-table-column align="center" :resizable='false' label="短信">
        <template slot-scope="scope">
          <div class="check-person check-sms">
            <div v-for="(item, idx) in scope.row.meetingSMSCenters" :key="idx">
              <el-checkbox v-model="item.select" class="sm-ck singRow" :title='item.title' @change="singleCheck(item, scope.row)">
                {{ item.title }}
              </el-checkbox>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: ['row'],
  data() {
    return {
      // table
      height: 480,
      tableData: [],
      tableCate: [
        {props: 'groupName', label: '短信类型', width: ''}
      ],
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: {
    batchDel(row) {
      console.log(row)
      row.meetingSMSCenters.filter(item => item.select = row.select)
    },
    singleCheck(item, row) {
      if(!item.select ){
        row.select = false
      }
    },
    // 获取短信类型 
    getSmsType(){
      let sms = ['SMS_192720251', 'SMS_205821314', 'SMS_205473967']

      this.$http.get(this.API.findSelectSmsAndAll(this.meetingData.id, this.row.id))
        .then(res => {
          if(res.code == '000' && res.data){
            let arr = [], obj = res.data
            for(let i in obj){
              let filter = obj[i].filter(item => !sms.includes(item.id) && item)
              filter.filter(item => item.select = false)
              arr.push({ groupName: i, meetingSMSCenters: filter, select: false})
            }
            // arr.filter(item => {
            //   item.meetingSMSCenters.filter(i => i.select = false)
            // })
            this.tableData = arr
          } else {
            this.tableData = []
          }

          console.log(this.tableData)
        })
    },
  },
  mounted() {
    this.getSmsType()
  }
}
</script>

<style scoped lang='less'>
.addsms {
  .el-table td .check-person {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }

  .singRow {
    margin-right: 10px;
    padding: 2px 0;
    // margin-bottom: 5px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .singRow .el-checkbox__label{
    width: 128px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
  }

  .check-sms .el-checkbox__label{
    width: 140px !important;
  }

  .check-person > div {
    display: flex;
    align-items: center;
  }
}
</style>
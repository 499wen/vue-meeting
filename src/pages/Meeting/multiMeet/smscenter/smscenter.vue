<template>
  <div class="smscenter">
    <!-- 功能 -->
    <div class="sms-func">
      <el-button round size='small' type="primary">个性短信配置</el-button>
      <el-button round size='small' type="success">短信发送记录</el-button>
    </div>

    <!-- 主体 -->
    <div class="sms-body">
      <!-- table -->
      <div class="table">
        <el-table ref="singleTable" @cell-mouse-enter='mouseTable'
          :data="tableData" border :height="height">
          <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
            v-for="(item, idx) in tableCate" :key="idx"
            align="center" :resizable="false">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="参会人分组" width='500'>
            <template slot-scope="scope">
              <div v-if="scope.row.allData" class="check-person">
                <div>
                  <el-checkbox v-model="scope.row.allData.is_select" title='全体参会人' class="sm-ck singRow" @change="all(scope.row)">全体参会人</el-checkbox>
                </div>
                <div v-for="(item, idx) in scope.row.data" :key="idx">
                  <el-checkbox v-model="item.is_select" class="sm-ck singRow" :title='item.confereeGroupName' @change="single(scope.row, idx)">
                    {{ item.confereeGroupName }}
                  </el-checkbox>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagin">
        <el-button size="small" round type="primary" @click="determine">保存</el-button>
      </div>

    </div>

    <!-- 短信表格 -->
    <div class="sms-table" :style="style" v-show="hoverBool">
      <hoverTable ref="hoverTable" v-if="hoverBool" :smsRow='smsRow' @update='updateData'></hoverTable>
    </div>
  </div>
</template>

<script>
import smscenter from './smscenter.js'

export default smscenter
</script>

<style scoped lang='less'>
@import url('./smscenter.less');
</style>

<style lang='less'>
.singRow {
  margin-right: 10px;
  margin-bottom: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.singRow .el-checkbox__label{
  width: 80px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
}
</style>
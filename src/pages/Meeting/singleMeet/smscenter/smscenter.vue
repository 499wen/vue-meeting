<template>
  <div class="smscenter">
    <!-- 主体 -->
    <div class="sms-body">
      <!-- 参会人 -->
      <div class="sms-tree">
        <div class="tree-head">参会人分组管理</div>
        <el-tree
          ref='smsTree'
          :data="data"
          :props="treeProps" 
          node-key="id"
          default-expand-all
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click='treeClick'
          :render-content="renderContent">
        </el-tree> 
      </div>
      <!-- 短信 -->
      <div class="sms-table">
        <!-- 功能 -->
        <div class="func-sms">
          <el-button v-preventReClick round size='small' type="primary" @click="addSms">添加短信</el-button>
          <el-button v-preventReClick round size='small' type="danger" @click="removeSms">移除短信</el-button>
          <el-button v-preventReClick round size='small' type="primary" @click="dispose">人工发送短信</el-button>
          <!-- <el-button v-preventReClick round size='small' type="success" @click="sendRecord">短信发送记录</el-button> -->
        </div>
        <!-- table -->
        <div class="table">
          <el-table ref="singleTable" @selection-change="batchDel"
            :data="tableData" border :height="height">
            <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' type="selection" width="50"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="groupName" label="短信类型" 
              align="center" :resizable="false">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="title" label="短信名称" 
              align="center" :resizable="false">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 人工发送短信 -->
    <el-dialog title="人工发送短信" :visible.sync="dispose_child" width="60%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <dispose ref="dispose" v-if="dispose_child"></dispose>
      <div class="dialog-btn">
        <el-button v-preventReClick @click="cancel" size="small" type="danger" round>关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 短信发送记录 -->
    <el-dialog title="短信发送记录" :visible.sync="sendRecord_child" width="60%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <sendRecord ref="sendRecord" v-if="sendRecord_child"></sendRecord>
      <div class="dialog-btn">
        <el-button v-preventReClick @click="cancel" size="small" type="danger" round>关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 添加短信 -->
    <el-dialog title="添加短信" :visible.sync="addsms_child" width="60%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <addsms ref="addsms" v-if="addsms_child" :row='curAttenGroup'></addsms>
      <div class="dialog-btn">
        <el-button v-preventReClick @click="determine" size="small" type="primary" round>保 存</el-button>
        <el-button v-preventReClick @click="cancel" size="small" type="danger" round>关 闭</el-button>
      </div>
    </el-dialog>

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
</style>
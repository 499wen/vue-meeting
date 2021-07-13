<template>
  <div class="payDetailed">
    <div class="header-opera">
      <div class="tap"> 
        <span>支付明细</span>
      </div>
    </div>

    <div class="content">
      <!-- 总结 -->
      <div class="summary">
        <div class="detail">
          <span class="money-sum">充值金额总汇</span>
          <span >充值合计：</span>
        </div>
        <div class="amount-of-money">
          <span class="number">1.05</span>
        </div>
      </div>

      <div class="data">
        <!-- 表格 -->
        <div class="table">
          <el-table ref="singleTable"
            :data="tableData" border :height="height">
            <el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
              v-for="(item, idx) in tableCate" :key="idx"
              align="center" :resizable="false">
            </el-table-column>
            <!-- <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="状态" width='100'>
              <template slot-scope="scope">
                <span>{{scope.row.status}}</span>
                <el-button v-preventReClick size='small' round type="primary" @click="openDetailed(scope.row)">明细</el-button>
              </template>
            </el-table-column> -->
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

    <el-dialog title="明细" :visible.sync="detailed_child" width="60%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <detailed ref="detailed" v-if="detailed_child" :row='row'></detailed>
      <div class="dialog-btn">
        <el-button v-preventReClick @click="cancel" size="small" type="danger" round>关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import payDetailed from './payDetailed.js'

export default payDetailed
</script>

<style scoped lang='less'>
@import url('./payDetailed.less');
</style>
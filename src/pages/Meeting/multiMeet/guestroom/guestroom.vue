<template>
  <div class="guestroom">
    <!-- tree -->
    <div class="atte-tree">
      <div class="tree-head">全部酒店</div>
      <el-tree
        :data="data"
        :props="treeProps"
        node-key="id"
        default-expand-all
        @node-click='treeClick'
        :expand-on-click-node="false"
        :highlight-current="true"
        :render-content="renderContent">
      </el-tree>
    </div>
    <!-- table 参会人数据 -->
    <div class="atte-data">
      <!-- 数据操作 -->
      <div class="data-oper">
        <div class="data-add">
          <el-button v-preventReClick round size='small' type="primary" @click="addRoomBtn">添加客房</el-button>
          <el-button v-preventReClick round size='small' type="primary" @click="onekeyCheckin">一键安排入住</el-button>
          <el-button v-preventReClick round size='small' type="danger" @click="onekeyRemove">一键清空人员</el-button>
          <el-button v-preventReClick round size='small' type="danger" @click="removeRoom">移除客房</el-button>  
        </div>
        <div class="data-query">
          <el-input size="small" placeholder="请输入房间号" v-model="searchKey" @keyup.native.enter="searchBtn">
            <el-button v-preventReClick slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
          </el-input>
        </div>
      </div>

      <!-- 表格 -->
      <div class="show-data">
        <div class="table-child">
          <el-table ref="singleTable" @selection-change="batchDel"
            :data="tableData" border :height="height">
            <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' type="selection" width="50"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
              v-for="(item, idx) in tableCate" :key="idx"
              align="center" :resizable="false">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="状态" width='240'>
              <template slot-scope="scope">
                <span>{{scope.row.personStr}}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="操作" width='200'>
              <template slot-scope="scope">
                <el-button v-preventReClick size="mini" @click="btnSetCheckIn(scope.row)" type="primary" round>入住安排</el-button>
                <el-button v-preventReClick size="mini" @click="btnClearUser(scope.row)" type="danger" round>清空</el-button>
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
    </div>

    <!-- 添加客房 - dialog-->
    <el-dialog title="添加客房" :visible.sync="addRoom_child" width="20%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <addRoom ref="addRoom" v-if="addRoom_child"></addRoom>
      <div class="dialog-btn">
        <el-button v-preventReClick type="primary" @click="addTo" size="small" round>添 加</el-button>
        <el-button v-preventReClick @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>

    <!-- 入住安排 -->
    <el-dialog title="入住安排" :visible.sync="checkin_child" width="40%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <checkin ref="checkin" v-if="checkin_child" ></checkin>
      <div class="dialog-btn">
        <el-button v-preventReClick type="primary" @click="addCheck" size="small" round>添 加</el-button>
        <el-button v-preventReClick @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import guestroom from './guestroom.js'

export default guestroom
</script>

<style scoped lang='less'>
.guestroom {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;

  .atte-tree {
    width: 16%;
    height: 100%;
    margin-right: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px; 
    box-sizing: border-box;

    .tree-head {
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #fff;
      background-color: #e67c7c;
      font-size: 14px;
    }
  }

  .atte-data {
    width: calc(84% - 20px);
    height: 100%;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    padding: 5px 10px 5px 10px;

    .data-oper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 5px;

      .data-add {}
      .data-query {
        display: flex;
        justify-content: flex-end;

        .spacing {
          margin-right: 10px;
        }
      }
    }

    .show-data {
      width: 100%;
      height: calc(100% - 37px);
      box-sizing: border-box;

      .table-child {
        width: 100%;
        height: calc(100% - 37px);
      }

      .pagin {
        padding-top: 5px;
      }
    }
  }
}
</style>
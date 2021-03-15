<template>
  <div class="attendee">
    <!-- tree -->
    <div class="atte-tree">
      <div class="tree-head">全部酒店</div>
      <el-tree
        :data="data"
        :props="treeProps"
        node-key="id"
        @node-click='treeClick'
        :render-content="renderContent">
      </el-tree>
    </div>
    <!-- table 参会人数据 -->
    <div class="atte-data">
      <!-- 数据操作 -->
      <div class="data-oper">
        <div class="data-add">
          <el-button round size='small' type="primary" @click="addRoomBtn">添加客房</el-button>
          <el-button round size='small' type="primary">一件安排入住</el-button>
          <el-button round size='small' type="danger">一键清空人员</el-button>
          <el-button round size='small' type="danger">移除客房</el-button>  
        </div>
        <div class="data-query">
          <el-input size="small" placeholder="请输入房间号" v-model="searchKey" @keyup.native.enter="searchBtn">
            <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
          </el-input>
        </div>
      </div>

      <!-- 表格 -->
      <div class="show-data">
        <div class="table-child">
          <el-table ref="singleTable" @cell-mouse-enter='hoverTable'
            :data="tableData" border :height="height">
            <el-table-column align="center" :resizable='false' type="selection" width="50"></el-table-column>
            <el-table-column type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
            <el-table-column :prop="item.props" :label="item.label" :width="item.width"
              v-for="(item, idx) in tableCate" :key="idx"
              align="center" :resizable="false">
            </el-table-column>
            <el-table-column align="center" :resizable='false' label="状态" width='240'>
              <template slot-scope="scope">
                <span>{{scope.row.status}}暂无入住人员</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :resizable='false' label="操作" width='200'>
              <template slot-scope="scope">
                <el-button size="mini" @click="btnSetCheckIn(scope.row)" type="primary" round>入住安排</el-button>
                <el-button size="mini" @click="btnClearUser(scope.row)" type="danger" round>清空</el-button>
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
        <el-button type="primary" @click="addTo" size="small" round>添 加</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addRoom from './addRoom/addRoom.vue' // 添加客房

export default {
  components: {
    addRoom
  },
  data() {
    return {
      // tree
      data: [
        { id: 1, label: '暮云酒店'}
      ],
      treeProps: {
        children: 'children',
        label: 'label'
      },

      searchKey: '',

      // table
      height: null,
      tableData: [{hotelBuildingName: '酒店大楼'}],
      tableCate: [
        { label: "酒店大楼", props: "hotelBuildingName", width: '' },
        { label: "房间号", props: "roomNumber", width: '100' },
        { label: "房间类型", props: "typeName", width: '120' },
        { label: "房间等级", props: "roomGrade", width: '120' }
      ],

      total: 0,
      pageNum: 1,
      pageSize: 10,

      // 子组件 - 开关
      addRoom_child: false
    }
  },
  methods: {

    // 安排入住 - 单间
    btnSetCheckIn() {
      
    },
    // 清空人员 - 单间
    btnClearUser() {

    },

    // 搜索按钮
    searchBtn(){
      console.log('触发')
    },
    // tree - 点击触发
    treeClick(node, data){
      
    },
    // tree - 树结构
    renderContent(h, { node, data, store }) {
      return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>)
    },
    // tree - 添加
    append(data, e){
      e.preventDefault();
      e.stopPropagation();
    },
    // tree - 删除
    remove(node, data, e){
      e.preventDefault();
      e.stopPropagation();
    },

    // tree - 编辑
    edit(node, data, e){
      e.preventDefault();
      e.stopPropagation();
    },

    // 分页方法
    sizeChange(val){
      this.pageSize = val
    },
    curChange(val){
      this.pageNum = val
    },

    addRoomBtn (){
      this.addRoom_child = true
    },

    // 子组件 - 按钮
    addTo(){

    },
    cancel() {

    }
  },
  mounted() {
    var dom = document.querySelector('.table-child')
    this.height = dom.offsetHeight
  }
}
</script>

<style scoped lang='less'>
.attendee {
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
<template>
  <div class="attendee">
    <!-- tree -->
    <div class="atte-tree">
      <div class="tree-head">参会人分组管理</div>
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
          <el-button round size='small' type="primary" @click="addAtteBtn">添加参会人</el-button>
          <el-button round size='small' type="danger">移除参会人</el-button>
          <el-button round size='small' type="primary">手动录入</el-button>
        </div>
        <div class="data-query">
          <el-button class="spacing" size='small'>导出参会人</el-button>
          <!-- 条件组查询 -->
          <el-dropdown trigger="click" class="spacing">
            <el-button size="small">
              条件组查询<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-input size="small" placeholder="请输入会议名称" v-model="searchKey" @keyup.native.enter="searchBtn">
            <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
          </el-input>
        </div>
      </div>

      <!-- 表格 -->
      <div class="show-data">
        <div class="table-child">
          <el-table ref="singleTable"
            :data="tableData" border :height="height">
            <el-table-column align="center" :resizable='false' type="selection" width="50"></el-table-column>
            <el-table-column type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
            <el-table-column :prop="item.props" :label="item.label" :width="item.width"
              v-for="(item, idx) in tableCate" :key="idx"
              align="center" :resizable="false">
            </el-table-column>
            <el-table-column align="center" :resizable='false' label="状态" width='100'>
              <template slot-scope="scope">
                <span>{{scope.row.status}}</span>
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

    <!-- 添加参会人 - dialog-->
    <el-dialog title="添加参会人" :visible.sync="addAtte_child" width="50%" center height='100%'
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <addAtte ref="addAtte" v-if="addAtte_child"></addAtte>
      <div class="dialog-btn">
        <el-button type="primary" @click="addTo" size="small" round>添 加</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addAtte from './addAtte/addAtte.vue' // 添加参会人

export default {
  components: {
    addAtte
  },
  data() {
    return {
      // tree
      data: [
        { id: 1, label: '全体参会人',
          children: []
        }
      ],
      treeProps: {
        children: 'children',
        label: 'label'
      },

      searchKey: '',

      // table
      height: null,
      tableData: [],
      tableCate: [
        {props: 'userName', label: '姓名', width: ''},
        {props: 'phone', label: '手机号', width: ''},
        {props: 'departmentName', label: '部门', width: ''},
        {props: 'characterId', label: '角色', width: ''},
        {props: 'attribute1', label: '组别', width: ''},
      ],

      total: 0,
      pageNum: 1,
      pageSize: 10,

      // 子组件 - 开关
      addAtte_child: false
    }
  },
  methods: {
    // 搜索按钮
    searchBtn(){
      console.log('触发')
    },
    // tree - 点击触发
    treeClick(node, data){
      
    },
    // tree - 树结构
    renderContent(h, { node, data, store }) {
      let html;
      if(node.level == 1){
        html = (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ (e) => this.append(data, e) } icon="el-icon-circle-plus-outline"></el-button>
            </span>
          </span>)
      } else {
        html = (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ (e) => this.remove(node, data, e) } icon="el-icon-delete"></el-button>
              <el-button size="mini" type="text" on-click={ (e) => this.edit(node, data, e) } icon="el-icon-edit"></el-button>
            </span>
          </span>)
      }
      return html;
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

    addAtteBtn (){
      this.addAtte_child = true
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
/** 此文件用于记录 element-ui 细节上的修改处理 */

/**
 * SecretId: AKIDJO7atw6odCYWFi7nDNHwSiT6UHoFoDiw 
   SecretKey: A6E6ffP2aIkvsTYNzQbVAaMUM0OVLvFI
 * 顶部导航栏 样式
 *  <div class="header-opera special">
      <div class="tap">
        <span>会议日程</span> 
      </div>

      <div class="look-more" @click="more">查看更多>>></div>
    </div>

    .header-opera 基本样式 
    .special 去除外边距
 */

/**
 * el-button 按钮颜色
 * 添加 #66b1ff, 查看 #67c23a, 编辑 #e6a23c, 删除 #f56c6c
 *     primary, success, warning, danger
 * 圆角 round size='small'
 */


/**
 * el-table 
 * border 添加边框
 * :resizable="false" 禁止拖动表头
 * align="center" 居中
 * @selection-change="batchDel" 勾选回调
 * :show-overflow-tooltip="true"  溢出显示title
 * html:
 *  <el-table ref="singleTable"
      :data="tableData" border :height="height">
      <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' type="selection" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
        v-for="(item, idx) in tableCate" :key="idx"
        align="center" :resizable="false">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="状态" width='100'>
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
    </el-table>

  js: 
    height: null,
    tableData: [],
    tableCate: [
      {props: 'userName', label: '姓名', width: ''},
      {props: 'phone', label: '手机号', width: ''},
      {props: 'departmentName', label: '部门', width: ''},
      {props: 'characterId', label: '角色', width: ''},
      {props: 'attribute1', label: '组别', width: ''},
    ]
 * 
 * 铺满父盒子
 */ 
var dom = document.querySelector('.table')
this.height = dom.offsetHeight


/**
 * el-dialog 加上以下3个属性 使其最大高度不会溢出
 * 
 * :close-on-click-modal='false' 
 * :close-on-press-escape='false'
 * custom-class='dialog' top='80px'
 * append-to-body 嵌套时使用
 * 注：按钮不与组件一起写
 *    <el-dialog title="添加人员" :visible.sync="addPeroson_child" width="60%" center
        :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
        <AddPerson ref="AddPerson" v-if="addPeroson_child"></AddPerson>
        <div class="dialog-btn">
          <el-button type="primary" @click="submitForm('userForm')" size="small" round>添 加</el-button>
          <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
        </div>
      </el-dialog>
 */


/**
 * el-pagination 分页
 * 
 * html  所占高度42px (1920 * 1080)
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

  js
    total: 0,
    pageNum: 1,
    pageSize: 1000

    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val
    },
    curChange(val){
      this.pageNum = val
    }
 */

/**
 * el-ui $confirm 使删除按钮在右边显示
 * 
 *  this.$confirm('是否删除该餐厅?', '提示', {  
      closeOnPressEscape: false,
      closeOnClickModal: false,
      cancelButtonClass: 'btn_custom_cancel',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
          
    }).catch(() => {})
 */

 /**
  * el-tree  树形结构
  * default-expand-all 默认展开
  * this.$refs.tree.setCurrentKey(Id值) 默认高亮
  * html 
      <el-tree
        :data="data"
        :props="treeProps"
        node-key="id"
        ref='tree'
        @node-click='treeClick'
        :expand-on-click-node="false"
        :highlight-current="true"
        :render-content="renderContent">
      </el-tree>

    js
      data: [
        { id: 1, label: '一级 1',
          children: []
        }
      ],
      treeProps: {
        children: 'children',
        label: 'label'
      },

      // tree - 点击触发
      treeClick(data, node){
        
      },
      // tree - 树结构
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ (e) => this.append(data, e) } icon="el-icon-circle-plus-outline"></el-button>
              <el-button size="mini" type="text" on-click={ (e) => this.remove(node, data, e) } icon="el-icon-delete"></el-button>
              <el-button size="mini" type="text" on-click={ (e) => this.edit(node, data, e) } icon="el-icon-edit"></el-button>
            </span>
          </span>);
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

    使tree 默认高亮
      document.querySelector('.el-tree-node__content').click()

  * 
  */

/**
 * el-input 列表搜索
 *  html:
      <el-input size="small" placeholder="请输入会议名称" v-model="searchKey" @keyup.native.enter="searchBtn">
        <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
      </el-input>
    
    js: 
      searchKey: '',

      // 搜索按钮
      searchBtn(){
        console.log('触发')
      },
 */


 /**
  * 会议
  * 
  */
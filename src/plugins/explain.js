/** 此文件用于记录 element-ui 细节上的修改处理 */

/**
 * el-button 按钮颜色
 * 添加 #66b1ff, 查看 #67c23a, 编辑 #e6a23c, 删除 #f56c6c
 *     primary, success, warning, danger
 * 圆角 round size='small'
 */


/**
 * el-table 
 * :resizable="false" 禁止拖动表头
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
 * 
 * eg：按钮不与组件一起写
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
    pageSize: 10

    // 分页方法
    sizeChange(val){
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
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      cancelButtonClass: 'btn_custom_cancel',
      type: 'warning'
    }).then(() => {
          
    }).catch(() => {})
 */
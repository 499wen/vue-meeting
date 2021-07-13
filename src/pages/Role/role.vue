<template>
  <div class="role">
    <div class="header-opera">
      <div class="tap">
        <span>权限管理</span> 
      </div>

      <el-button v-preventReClick size="small" round @click="addRole" type="primary"> 添加角色 </el-button>
    </div>

    <!-- 表格 -->
    <div class="table">
      <el-table :data="tableData" :height='height' border>
        <el-table-column :show-overflow-tooltip="true" :resizable="false" align='center' type="index" label="序号" width="50"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :resizable="false"  align='center'
        v-for="(item,index) in tableCate"
        :key="index"
        :prop="item.value" :label="item.label" :width="item.width"
        ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :resizable="false"  align='center' label="操作" width="400">
          <template slot-scope="scope">
            <el-button v-preventReClick size="small" type="warning" @click="handleEdit(scope.row)" round>编辑</el-button>
            <el-button v-preventReClick size="small" type="primary" @click="addUsers(scope.row)" round>添加成员</el-button>
            <el-button v-preventReClick size="small" type="danger" @click="deleteUsers(scope.row)" round>删除成员</el-button>
            <el-button v-preventReClick size="small" type="danger" @click="handleDelete(scope.row)" round>删除</el-button>
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


    <!-- 添加角色 -->
    <el-dialog
    title="添加角色" :visible.sync="addRoleOpen" :close-on-click-modal='false' 
    :close-on-press-escape='false' width="10%" custom-class='dialog' center top="80px">
      <Addrole ref="Addrole" v-if="addRoleOpen" @close='close'></Addrole>
      <div class="dialog-btn">
        <el-button v-preventReClick type="primary" size='small' round @click="addRoleRole">添 加</el-button>
        <el-button v-preventReClick size='small' round @click="close">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog
    title="编辑角色" :visible.sync="editRoleOpen" :close-on-click-modal='false' 
    :close-on-press-escape='false' width="30%" custom-class='dialog' center>
      <EditRole ref="EditRole" v-if="editRoleOpen" @close='close' :row='row'></EditRole>
      <div class="dialog-btn">
        <el-button v-preventReClick type="primary" size='small' round @click="preser">保 存</el-button>
        <el-button v-preventReClick size='small' round @click="close">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加成员 --> 
    <el-dialog
    title="添加成员" :visible.sync="addMember" :close-on-click-modal='false' 
    :close-on-press-escape='false' width="50%" custom-class='dialog' center>
      <AddMember ref="AddMember" v-if="addMember" @close='close'></AddMember>
      <div class="dialog-btn">
        <el-button v-preventReClick type="primary" @click="submitForm()" size="small" round>添加选中人员</el-button>
        <el-button v-preventReClick @click="close" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>

    <!-- 删除成员 -->
    <el-dialog
    title="删除成员" :visible.sync="delMember" :close-on-click-modal='false' 
    :close-on-press-escape='false' width="30%" custom-class='dialog' center>
      <DelMember ref="DelMember" v-if="delMember" @close='close' :row='row'></DelMember>
      <div class="dialog-btn">
        <el-button v-preventReClick type="primary" size='small' round @click="preseMember">移除选中人员</el-button>
        <el-button v-preventReClick size='small' round @click="close">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import role from './role.js'

export default role
</script>

<style scoped lang='less'>
.role {
    width: 100%;
    height: 100%;

    .table {
      width: 100%;
      height: calc(100% - 97px);
    }
}
</style>
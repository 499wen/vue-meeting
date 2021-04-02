<template>
  <div>
    <el-input v-model="roleName" placeholder="请输入角色名称"></el-input>
    <div class="tree">
      <div class="tree-jurisd">
        <div>请选择菜单权限</div>
        <el-tree
          ref="jurisTree"
          :data='jurisdData'
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
        </el-tree> 
      </div>
      <div class="tree-depart">
        <div>请选择部门权限</div>
        <el-tree
          ref='departTree'
          :data='departData'
          :props="departProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
        </el-tree>
      </div>
    </div>
    
  </div>
</template>

<script>
import addRole from './addRole.js'

export default addRole
</script>

<style scoped lang='less'>
.tree {
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  display: flex;
  align-content: flex-start;

  & > div {
    width: 50%;
    padding-right: 10px;
    box-sizing: border-box;
  }
}

.dialog-btn {
  padding-top: 10px;
  width: 100%;
  text-align: center;
}
</style>
<template>
    <div>
      <el-input v-model="roleName" placeholder="请输入角色名称"></el-input>
      <div class="tree">
        <div class="tree-jurisd">
          <div>请选择功能权限</div>
          <el-tree
            :data='jurisdData'
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
          </el-tree> 
        </div>
        <div class="tree-depart">
          <div>请选择部门权限</div>
          <el-tree
            :data='departData'
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
export default {
    data() {
        return {
          roleName: '',
          jurisdData: [
            {
              id: 1,
              label: '一级 1',
              children: [{
                id: 4,
                label: '二级 1-1',
                children: []
              },{
                id: 5,
                label: '二级 1-1',
                children: []
              }]
            }
          ],
          departData: [
            {
              id: 1,
              label: '一级 1',
              children: [{
                id: 4,
                label: '二级 1-1',
                children: []
              }]
            }
          ]
        }
    },
    methods: {
        // 取消
        cancel(){
          this.$emit('close', '取消')
        },
    }
}
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
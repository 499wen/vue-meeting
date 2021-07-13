<template>
  <div class="save-main">
    <div class="container">
      <!-- 容器顶部 -->
      <div class="c-top">
        <el-button v-preventReClick title="删除条件组" type="danger" size='small' @click="delCondition">删除条件组</el-button>
      </div>

      <div class="c-body">
        <!-- 容器主体 - 表格 -->
        <div class="c-table">
          <el-table :data="preGroup" border :height="height"
            @selection-change="selectionTable" @row-click='handleSelectionChange'>
            <el-table-column :show-overflow-tooltip="true" align="center" type="selection" width="55"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" v-for="(item, idx) in tableLable" :key="idx"
                  :prop="item.fieldName"  :label="item.name"></el-table-column>
          </el-table>
        </div>  
        <!-- 容器主体 - 编辑 -->
        <div class="edit-condition">
          <div class="custom">
              
            <div class="condition">
              <el-input placeholder="请输入条件组名称" :disabled="!editBool" v-model="param.queryBuilderName"></el-input>
            </div>

            <el-row class="condis-item" v-for="(item,index) in param.queryConditionList" :key="index">
              <el-col :span="2">
                <el-button v-preventReClick type="danger" icon="el-icon-delete" size='small' :disabled="!editBool" circle  title="删除条件" @click="removeCondis(index)"></el-button>
              </el-col>
              <el-col :span="2" class="condis-condies" v-show="index > 0" >
                <el-select :disabled="!editBool" v-model="item.logicalSymbol" placeholder="请选择条件类型">
                  <el-option size="mini" v-for="item in condies"
                  :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-col>
              <el-col :span="5" class="condis-condies" :offset=" index > 0 ? 0 : 2 ">
                <el-select :disabled="!editBool" v-model="item.fieldName" placeholder="请选择字段">
                  <el-option v-for="item in properties" :key="item.value"
                  :label="item.lable" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="5" class="condis-condies">
                <el-select :disabled="!editBool" v-model="item.conditionalSign" placeholder="请选择操作符">
                  <el-option v-for="item in oprates" :key="item.value"
                  :label="item.lable" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="10" class="condis-condies">
                <el-input v-model="item.value" placeholder="请输入值" :disabled="!editBool"></el-input>
              </el-col>
            </el-row>
            <el-row class="tc">
              <!-- 默认 -->
              <div v-if="bool">
                <el-button v-preventReClick type="success" size='small' icon="el-icon-plus" title="添加条件" @click="addCondis">添加条件</el-button>
                <el-button v-preventReClick type="primary" size='small' icon="el-icon-circle-check" title="查询" @click="preservation('new')">保存</el-button>
              </div>
              <!-- 点击条件组 -->
              <div v-else>
                <div v-if="!editBool">
                  <el-button v-preventReClick type="primary" size='small' icon="el-icon-edit" title="查询" @click="edit">编辑</el-button>
                  <el-button v-preventReClick type="info" size='small' icon="el-icon-circle-close" title="查询" @click="signOutEdit">退出编辑</el-button>
                </div>
                <div v-else>
                  <el-button v-preventReClick type="primary" size='small' icon="el-icon-circle-check" title="查询" @click="preservation('update')">保存</el-button>
                  <el-button v-preventReClick type="success" size='small' icon="el-icon-plus" title="添加条件" @click="addCondis">添加条件</el-button>
                  <el-button v-preventReClick type="info" size='small' icon="el-icon-circle-close" title="查询" @click="signOutEdit">退出编辑</el-button>
                </div>
              </div>
            </el-row>
          </div>
        </div>
      </div>
    </div> 

  </div>
</template>

<script>
import conditionGroup from "./conditionGroup.js";

export default conditionGroup
</script>

<style lang="less" scoped> 
@import url('./conditionGroup.less');
</style>

<style>
.save-main .el-input__icon {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.el-select-dropdown__list {
    max-height: 220px !important;
    height: auto !important;
}
</style>
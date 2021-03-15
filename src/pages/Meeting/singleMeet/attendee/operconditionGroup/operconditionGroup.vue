<template>
  <div class="save-main">
    <div class="container">

      <div class="c-body">
        <!-- 容器主体 - 编辑 -->
        <div class="edit-condition">
          <div class="custom">
              
            <div class="condition">
              <el-input placeholder="请输入条件组名称"  v-model="param.queryBuilderName"></el-input>
            </div>

            <el-row class="condis-item" v-for="(item,index) in param.queryConditionList" :key="index">
              <el-col :span="2">
                <el-button type="danger" icon="el-icon-delete" size='small'  circle  title="删除条件" @click="removeCondis(index)"></el-button>
              </el-col>
              <el-col :span="2" class="condis-condies" v-show="index > 0" >
                <el-select  v-model="item.logicalSymbol" placeholder="请选择条件类型">
                  <el-option size="mini" v-for="item in condies"
                  :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-col>
              <el-col :span="4" class="condis-condies" :offset=" index > 0 ? 0 : 2 ">
                <el-select  v-model="item.fieldName" placeholder="请选择字段">
                  <el-option v-for="item in properties" :key="item.value"
                  :label="item.lable" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="4" class="condis-condies">
                <el-select  v-model="item.conditionalSign" placeholder="请选择操作符">
                  <el-option v-for="item in oprates" :key="item.value"
                  :label="item.lable" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8" class="condis-condies">
                <el-input v-model="item.value" placeholder="请输入值" ></el-input>
              </el-col>
            </el-row>
            <el-row class="tc">
              <!-- 默认 -->
              <el-button type="success" size='small' icon="el-icon-plus" title="添加条件" @click="addCondis">添加条件</el-button>
            </el-row>
          </div>
        </div>
      </div>
    </div> 

  </div>
</template>

<script>
import operconditionGroup from "./operconditionGroup.js";

export default operconditionGroup
</script>

<style lang="less" scoped> 
@import url('./operconditionGroup.less');
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
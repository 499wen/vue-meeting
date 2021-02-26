<template>
  <div class="companyInfo">
    <!-- tab -->
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="个人资料" name="first">

        <el-form ref="form" :model="form" label-width="80px" class="per-data">
          <div class="form-left">
            <el-form-item label="活动名称">
              <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="活动名称">
              <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="活动名称">
              <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="活动名称">
              <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
            
          </div>
          <div class="image"></div>
        </el-form>

      </el-tab-pane>
      <el-tab-pane label="单位信息" name="second">单位信息</el-tab-pane>
      <el-tab-pane label="修改密码" name="third">修改密码</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      form: {}
    }
  }
}
</script>

<style lang='less'>
.per-data {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
  flex-wrap: wrap;

  .form-left {
    width: calc(100% - 130px);
    display: flex;
    justify-content: space-between;
    align-content: flex-start;
    flex-wrap: wrap;

    .el-form-item {
      width: 45%;
    }
  }

  .image {
    width: 112px;
    height: 197px;
    border: 1px dashed #ccc;
    border-radius: 3px;
  }
}
</style>
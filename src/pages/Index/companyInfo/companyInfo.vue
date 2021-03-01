<template>
  <div class="companyInfo">
    <!-- tab -->
    <el-tabs v-model="activeName" type="card">

      <!-- 个人资料 -->
      <el-tab-pane label="个人资料" name="first">

        <el-form ref="form" :model="form" label-width="60px" class="per-data">
          <div class="form-left">
            <el-form-item label="姓名">
              <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-input v-model="form.sex" size="small"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="form.phone" size="small"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email" size="small"></el-input>
            </el-form-item>
          </div>
          <div class="image"></div>
          <el-form-item class="btn">
            <el-button type="primary" size='small' round>保 存</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>

      <!-- 单位信息 -->
      <el-tab-pane label="单位信息" name="second">
        <el-form ref="form" :model="form" label-width="100px" class="per-data">

          <div class="form-left">
            <el-form-item label="部门名称">
              <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="单位电话">
              <el-input v-model="form.sex" size="small"></el-input>
            </el-form-item>
            <el-form-item label="单位地址">
              <el-input v-model="form.phone" size="small"></el-input>
            </el-form-item>
            <!-- <el-form-item label="邮箱">
              <el-input v-model="form.email" size="small"></el-input>
            </el-form-item> -->
          </div>

          <el-form-item class="btn">
            <el-button type="primary" size='small' round>保 存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 修改密码 -->
      <el-tab-pane label="修改密码" name="third">
        <el-form ref="form" :model="form" label-width="100px">

            <el-form-item label="旧密码">
              <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="form.sex" size="small"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="form.phone" size="small"></el-input>
            </el-form-item>
            <!-- <el-form-item label="邮箱">
              <el-input v-model="form.email" size="small"></el-input>
            </el-form-item> -->

          <el-form-item class="btn">
            <el-button type="primary" size='small' round>保 存</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>
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
    // width: calc(100% - 130px);
    // padding-right: 80px;
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-content: flex-start;
    flex-wrap: wrap;
    box-sizing: border-box;

    .el-form-item {
      width: 45%;
    }
  }

  .image {
    width: 112px;
    height: 112px;
    border: 1px dashed #ccc;
    border-radius: 3px;
    margin-left: 20px;
  }

}
.btn {
  width: calc(100% - 130px);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
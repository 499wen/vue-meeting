<template>
  <div class="approval">
    <el-form :model="form">
      <el-row>
        <el-col :span="24">
          <el-form-item label="请假人:" :label-width="formLabelWidth">{{form.userName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="请假人手机:" :label-width="formLabelWidth">{{ form.user && form.user.phone}}</el-form-item>
        </el-col>
      </el-row> 
      <el-row>
        <el-col :span="24">
          <el-form-item label="会议名称:" :label-width="formLabelWidth">{{form.meetingName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="请假事由:" :label-width="formLabelWidth">{{form.leaveReason}}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="审批意见" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.approvalOpinions" placeholder="请输入审批意见(可选):"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['form'],
  data() {
    return {
      formLabelWidth: '6.25rem'
    }
  },
  methods: {
    // 不同意
    notApplyAgree() {

    },
    // 同意
    applyAgree() {

    }
  }
}
</script>

<style scoped lang='less'>
.approval {

}
</style>
<template>
  <div class="manualImport">
    <div class="entryBox">
      <el-form ref="form" :model="form" class="form " label-width="80px" :rules='rules'>
        <div class="flex">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入姓名"></el-input>
          </el-form-item>

          <el-form-item label="性别" prop="sex" class="sex">
            <el-radio-group v-model="form.sex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="flex">
          <el-form-item label="手机" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机"></el-input>
          </el-form-item>

          <el-form-item label="人员类别" prop="externalCode">
            <el-radio-group v-model="form.externalCode">
              <el-radio label="0">内部人员</el-radio>
              <el-radio label="1">外部人员</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        

        <!-- <el-form-item label="参会分组">
          <el-select v-model="form.confereeGroupId" placeholder="请选择分组">
            <el-option :label="item.confereeGroupName" :value="item.id" v-for="(item, idx) in groupList" :key="idx"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>

<script>
let checkMeetPhone = (rule, value, callback) => {
    var reg = /^1[3456789]\d{9}$/
    if(!reg.test(value)){ 
        return callback(new Error("手机号码有误"));
    } 
    callback();
  };

export default {
  data() {
    return {
      form: {
          userName: '', // 姓名
          phone: '', // 手机
          sex: '男', // 性别
          externalCode: '0', // 内外部 外部人员标识:0--内部人员, 1--外部人员
          confereeGroupId: '', // 分组
      },
      rules: {
          userName: [
            { required: true, message: '请输入姓名', trigger: 'change' }
          ],
          phone: [
              { required: true, message: '请输入手机', trigger: 'change' },
              { validator: checkMeetPhone, trigger: "blur" }
          ],
          sex: [
              { required: true, message: '请选择性别', trigger: 'change' }
          ], 
          externalCode: [
              { required: true, message: '请选择人员类别', trigger: 'change' }
          ],
          depart: [
              { required: true, message: '请选择部门', trigger: 'change' }
          ],
      },
    }
  }
}
</script>

<style  lang='less'>
.manualImport {
  .flex {
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    
    // div {
    //   width: 50%;
    //   display: inline-block;
    // }
  }
}
</style>
<template>
  <div class="init">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="80px">
      <el-form-item prop="loginName" label="登录名">
        <el-input v-model="ruleForm2.loginName" auto-complete="off" placeholder="请输入用户名"
          clearable></el-input>
      </el-form-item>
      <el-form-item prop="password" label="新密码">
        <el-input type="password" v-model="ruleForm2.password" auto-complete="off"
          placeholder="请输入密码6-16位，建议是英文、数字组合" show-password></el-input>
      </el-form-item>
      <el-form-item prop="againNewPassword" label="确认密码">
        <el-input type="password" v-model="ruleForm2.againNewPassword" auto-complete="off"
          placeholder="请重复输入一次密码" show-password></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {

    /*验证输入两次密码是不是一样*/
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != this.ruleForm2.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    /*验证输入两次密码是不是一样*/
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != this.ruleForm.psnewPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    /*验证不能输入特殊字符*/
    var validateuser = (rule, value, callback) => {
      if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/gi.test(value)) {
        callback(new Error("不能输入特殊字符"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {},
      rules2: {
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur",},
          { validator: validateuser, trigger: "blur",},
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur",},
          { min: 6, max: 16, message: "新密码长度在 6 到 16 个字符", trigger: "blur"},
          { validator: validateuser, trigger: "blur"},
        ],
        againNewPassword: [
          { validator: validatePass2, required: true, trigger: "blur"},
        ]
      },
    }
  }
}
</script>

<style scoped lang='less'>
.init {

}
</style>
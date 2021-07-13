<template>
  <div class="companyInfo">
    <!-- tab -->
    <el-tabs v-model="activeName" type="card">

      <!-- 个人资料 -->
      <el-tab-pane label="个人资料" name="first">

        <el-form ref="form" :model="form" label-width="80px" class="per-data" :rules="rulesInfo">
          <div class="form-left">
            <el-form-item label="名称" prop="customerName">
              <el-input v-model="form.customerName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio v-model="form.sex" label="男">男</el-radio>
              <el-radio v-model="form.sex" label="女">女</el-radio>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="form.phone" size="small"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" size="small"></el-input>
            </el-form-item>
          </div>
          <div class="image">
            <img v-if="form.photoFileSaveName" :src="API.echoImage(form.photoFileSaveName, 'HeadFile')" @error="errImg(form.photoFileSaveName, 'HeadFile', $event)"/>
            <img v-else src="@/assets/images/defaultImg.png" alt="">
            <input type="file" name="" id="" class="hide" @change="updateLoad" ref="file">
          </div>
          <div class="btn">
            <el-button v-preventReClick type="primary" size='small' round @click="saveInfo">保 存</el-button>
          </div>
        </el-form>

      </el-tab-pane>

      <!-- 单位信息 -->
      <el-tab-pane label="单位信息" name="second" v-if="false">
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

          <div class="btn">
            <el-button v-preventReClick type="primary" size='small' round>保 存</el-button>
          </div>
        </el-form>
      </el-tab-pane>

      <!-- 修改密码 -->
      <el-tab-pane label="修改密码" name="third">
        <el-form ref="pwd" :model="pass" label-width="100px" :rules="rules">

            <el-form-item label="旧密码" prop='oldPassword'>
              <el-input v-model="pass.oldPassword" size="small"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop='password'>
              <el-input v-model="pass.password" size="small"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop='checkPass'>
              <el-input v-model="pass.checkPass" size="small"></el-input>
            </el-form-item>
            <!-- <el-form-item label="邮箱">
              <el-input v-model="form.email" size="small"></el-input>
            </el-form-item> -->

          <div class="btn">
            <el-button v-preventReClick type="primary" size='small' round @click="editPwd">保 存</el-button>
          </div>
        </el-form>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if (this.pass.checkPass !== '') {
            this.$refs.pwd.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.pass.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      activeName: 'first',
      form: {
        sex: '男',
        loginName: '',
        phone: '',
        email: '',
        photoFileSaveName: ''
      },
      pass: {
        oldPassword: '',
        password: '',
        checkPass: ''
      },
      rulesInfo: {
        customerName: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' }
        ],
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'change' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    // 上传图片
    updateLoad(e){
      // 文件数据
      let file = this.$refs.file, files
      files = file.files[0]

      this.fileUpload(files, 'HeadFile', res => {
        if(res.code == '000'){
          this.$message.success(res.msg)
          this.form.photoFileSaveName = res.data.saveFileName
        } else {
          this.$message.error(res.msg)
        }

        file.value = ''
      })
    },
    // 修改信息
    saveInfo() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let obj = this.form

          console.log(obj)
          // return 
          this.$http.post(this.API.updateInfo, obj)
            .then(res => {
              if(res.code == '000'){
                this.$message.success('修改成功!')
                this.$emit('close')
                this.$emit('initInfo')
              } else {
                this.$message.error(res.msg)
              }
            })
        } 
      });
    },
    // 修改密码 - 提交
    editPwd() {
      this.$refs.pwd.validate((valid) => {
        if (valid) {
          let obj = {
            password: this.pass.password,
            oldPassword: this.pass.oldPassword,
            loginName: this.loginInfo.customerName
          }
          this.$http.post(this.API.updatePassword, obj)
            .then(res => {
              if(res.code == '000'){
                this.$message.success('修改成功!')
                this.$emit('close')
              } else {
                this.$message.error(res.msg)
              }
            })
        } 
      });
    }
  },
  mounted() {
    // 获取公司信息
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'))

    this.form = {
      sex: this.loginInfo.sex || '男',
      customerName: this.loginInfo.customerName,
      phone: this.loginInfo.phone,
      email: this.loginInfo.email,
      photoFileSaveName: this.loginInfo.photoFileSaveName,
      id: this.loginInfo.id
    }
    console.log(this.loginInfo)
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
    width: 56px;
    height: 56px;
    // border: 1px dashed #ccc;
    border-radius: 50%;
    margin-left: 20px;
    border: 1px dashed #ccc;
    box-sizing: border-box;
    position: relative;
    transition: border .3s;
	
    & > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .image:hover {
    border-color: #409eff;
  }

}
.btn {
  width: 100%;
  // width: calc(100% - 130px);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<template>
  <div class="login">
    <!-- logo -->
    <img class='login-logo' src='../../assets/images/login-logo.png' />
    
    <!-- text -->
    <div class="text">
      <img class='login-text' src='../../assets/images/login-text.png' />
    </div>

    <!-- card -->
    <div class="login-card" v-show="!bind">
      <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="验证码登录" name="verCode">
              <el-input placeholder="请输入手机号" prefix-icon="el-icon-phone" v-model="ruleForm.phone">
              </el-input>
              <el-input placeholder="请输入验证码" class="auto-hight" prefix-icon="el-icon-paperclip" @keyup.native.enter="login" v-model="ruleForm.smsCheckCode">
                  <el-button v-preventReClick slot="append" class="btn" @click="getVerCode">{{ verCodeText }}</el-button>
              </el-input>
              
          </el-tab-pane>
          <el-tab-pane label="用户名登录" name="loginName">
              <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="ruleForm.loginName">
              </el-input>
              <el-input type="password" placeholder="请输入密码" class="auto-hight" prefix-icon="el-icon-lock" @keyup.native.enter="login" v-model="ruleForm.password">
              </el-input>
          </el-tab-pane>
          <el-tab-pane label="微信登录" name="wechatLogin">
              <div id="img"></div>
          </el-tab-pane>
      </el-tabs>

      <!-- 自动登录 -->
      <!-- <el-checkbox v-model="autoLogin">自动登录(7天)</el-checkbox> -->

      <!-- 登录按钮 -->
      <div class="login-btn" v-if="activeName != 'wechatLogin'">
        <el-button v-preventReClick class="login-btn-b" @click="login()">登 录</el-button>
      </div>

      <!-- 其它功能 -->
      <div class="login-func" v-show="activeName != 'wechatLogin'">
        <span class="regist" @click="goRegist">注册账号</span>
        <span class="other" @click="downApp">下载APP</span>
        <span class="other" @click="openH5">H5移动端</span>
      </div>

      <!-- 显示二维码 弹出框 -->
      <div class="eject-box" v-if="qrcodeOpen">
        <show-qrcode v-if='qrcodeOpen' :title='title' :showType='type' @close='close'></show-qrcode>
      </div>
    </div>
    
    <!-- 底部 -->
    <div class="login-button">
      <div class="company">
        <span class="info">广州会智智能科技有限公司</span>
        <span class="info">https://www.hzics.com</span>
        <span class="info">TEL:020-34798277</span>
      </div>
      <div>
        <span class="keep-on-record">版权所有:广州会智智能科技有限公司</span>
        <span class="keep-on-record">粤ICP备案:75558621-4</span>
      </div>
    </div>

    <!-- 防止浏览器 保存密码机制 -->
    <div class="hidden">
      <input type="text" name="" id="" autocomplete="off">
      <input type="password" name="" id="" autocomplete="off">
    </div>

    <!-- 绑定 -->
    <el-dialog title="绑定微信" :visible.sync="bind" width="25%" center :modal='false'
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="smsCheckCode">
          <el-input placeholder="请输入验证码" class="auto-hight" @keyup.native.enter="submitForm" v-model="form.smsCheckCode">
            <el-button v-preventReClick slot="append" class="btn" @click="getVerCodeBind">{{ verCode }}</el-button>
          </el-input>
        </el-form-item>
        
      </el-form>
      <div class="dialog-btn">
        <el-button v-preventReClick type="primary" @click="submitForm" size="small" round>绑 定</el-button>
      </div>
    </el-dialog>
    <!-- 幕布 -->
    <div id="mask" v-show="bind"></div>
  </div>
</template>

<script>
import ShowQrcode from './showQrcode/showQrcode'
import { setCookie, delCookie, getCookie } from '../../plugins/cookie'
import { getSearch } from '@/plugins/plugins.js'
import $ from 'jquery'

export default {
  components: {
    'show-qrcode': ShowQrcode
  },
  data() {
    return {
      form: {
        phone: '',
        smsCheckCode: '',
        openId: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
        ],
        smsCheckCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ]
      },
      
      activeName: 'verCode',
      ruleForm: {
        phone: '',
        smsCheckCode: '',
        loginName: '',
        password: ''
      },
      autoLogin: false,
      qrcodeOpen: false,
      title: '',
      type: '',
      verCodeText: '获取验证码',
      verCode: '获取验证码',

      bind: false, // 绑定
    }
  },
  methods: {
    // 绑定
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let obj = this.form
          this.$http.post(this.API.loginByWxBind, obj)
            .then(res => {
              console.log(res)
              if(res.code == '000'){
                if(this.autoLogin){
                  setCookie('autoLogin', 1, 7)
                }
                // 保存token本地
                localStorage.setItem('token', res.data.token)
                localStorage.removeItem('bind')
                localStorage.removeItem('openId')

                this.$router.push('/home')
              } else {
                this.$message.error(res.msg)
              }
            })
        }
      });
    },
    handleClick(tab, event) {
      console.log(this.activeName);
      if(this.activeName == 'wechatLogin'){
        localStorage.removeItem('bind')
        localStorage.removeItem('openId')
        this.getCode()
      }
    },
    // 绑定 获取验证码
    getVerCodeBind() {
      let s = 60
      if (!(/(^1[3|2|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/.test(this.form.phone))) { 
        this.$message.error('请输入正确的手机号')
        return false
      }

      this.$http.post( this.API.bindingPhon(this.form.phone))
        .then(res => {
          if(res.code == '000'){
            this.$message.success('验证码发送成功！')
            this.verCode = s + 'S 后重试'
            let handle = setInterval(() => {
                s--
                this.verCode = s + 'S 后重试'
                if(s <= 0){
                  clearInterval(handle);
                  s = 60
                  this.verCode = '获取验证码'
                }
            },1000)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    checkPhone(phone){ 
      if(!(/(^1[3|2|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/.test(phone))){ 
          return false; 
      }
      return true
    },
    // 获取验证码
    getVerCode(){
      let s = 60
      if (!(/(^1[3|2|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/.test(this.ruleForm.phone))) { 
        this.$message.error('请输入正确的手机号')
        return false
      }

      this.$http.get( this.API.verificationCode(this.ruleForm.phone))
        .then(res => {
          if(res.code == '000'){
            this.$message.success('验证码发送成功！')
            this.verCodeText = s + 'S 后重试'
            let handle = setInterval(() => {
                s--
                this.verCodeText = s + 'S 后重试'
                if(s <= 0){
                    clearInterval(handle);
                    s = 60
                    this.verCodeText = '获取验证码'
                }
            },1000)
          } else {
            this.$message.error(res.msg)
          }
        })
    },

    // 登录
    login (){
      let url = null, data = null,
      {phone, smsCheckCode, loginName, password} = this.ruleForm
      // 验证表单
      if(!this.veriForm()) return 
      
      if(this.activeName == 'verCode'){
          url =  this.API.loginByPhone
          data = {phone, smsCheckCode}
      } else {
          url =  this.API.loginByLoginNameAndPassword
          data = {loginName, password}
      }
      this.$http.post(url, data)
        .then(res => {
          if(res.code == '000'){
            if(this.autoLogin){
              setCookie('autoLogin', 1, 7)
            }
            // 保存token本地
            localStorage.setItem('token', res.data.token)
            localStorage.removeItem('bind')
            localStorage.removeItem('openId')

            this.$router.push('/')
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    // 验证
    veriForm(){
      let {phone, smsCheckCode, loginName, password} = this.ruleForm

      if(this.activeName == 'verCode'){
        if (!(/^1[0-9]{10}$/.test(phone))) { 
          this.$message.error('请输入正确的手机号')
          return false
        }
        if(!smsCheckCode.trim()){
          this.$message.error('请输入验证码')
          return false
        }
      } else {
        if(!loginName.trim()){
          this.$message.error('请输入用户名')
          return false
        }
        if(!password.trim()){
          this.$message.error('请输入密码')
          return false
        }
      }

      return true
    },
    // 下载App
    downApp(){
        this.title = '扫码下载App'
        this.type = 'App'
        this.qrcodeOpen = true
    },
    // 进入H5
    openH5(){
        this.title = '扫码进入H5移动端'
        this.type = 'H5'
        this.qrcodeOpen = true
    },
    // 关闭
    close(){
        this.qrcodeOpen = false
    },
    // 去注册
    goRegist(){
        this.$router.push('/regist')
    },

    // 获取code
    getCode () {
      let code = getSearch().code
      console.log(code)

      // 生成二维码 用户扫码授权
      new WxLogin({
        // self_redirect: true,
        id: "img",
        appid: "wx8ca24e48b1e86fa1",
        scope: "snsapi_login",
        redirect_uri: "https://mt.smart-hwt.com",
        
        state: "STATE",
        // style: "white",
        href: "https://my-vue-starter-1305256445.cos.ap-guangzhou.myqcloud.com/css/wechatQrcode.css"
      });

      // 修改二维码样式
      setTimeout(() => {
        // console.log($("iframe").contents().find(".impowerBox")[0])
        console.dir($("iframe")[0])
      }, 1000)

    },

    // 获取openId
    getOpenId(code){

    }
  },
  mounted() {
    // this.getCode()
    setTimeout(() => {
      let openId = localStorage.getItem('openId')
      console.log(openId)
      if(openId) {
        this.bind = true
        this.form.openId = openId
      }
    }, 1000)

    
    // 判断是否存在cookie
    setTimeout(() => {
      if(localStorage.getItem('token')){
        this.$router.push('/advertisement')
      }
    }, 0)
  }
}
</script>

<style scoped lang='less'>
.login {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../../assets/images/login-bgi.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center center;

    .login-logo {
        width: 281px;
        height: 62px;
        margin-top: 40px;
        margin-left: 40px;
    }

    .text {
        margin-top: 20px;
        width: 100%;
        text-align: center;
        
        .login-text {
            width: 805px;
            height: 87px;
        }
    }

    .login-card {
        width: 480px;
        height: 300px;
        margin: 100px auto;
        border-radius: 5px;
        background-color: #fff;
        padding: 5px 15px;
        box-sizing: border-box;
        position: relative;

        .auto-hight {
            margin-top: 15px;
            margin-bottom: 15px;
            height: 40px ;
        }

        .login-btn {
            width: 100%;
            margin-top: 15px;
            text-align: center;

            .login-btn-b {
                margin: 0 auto;
                background-color: #054592;
                color: #fff;
                // width: 64px;
                // height: 36px;
                // line-height: 36px;
                // box-sizing: border-box;
                // text-align: center;
                // border-radius: 5px;
                // cursor: pointer;
                // font-size: 15px;
            }

            // .login-btn-b:hover {
            //     background-color: #054492cc;
            // }

            .login-btn-b:active {
                background-color: #054492cc;
            }
        }

        .auto-btn {
            height: 30px;
        }

        .verCode {
            width: 100%;
            display: flex;
            justify-content: flex-start;

            .btn {
                height: 100%;
            }
        }

        .login-func {
            width: 100%;
            padding: 0 10px;
            box-sizing: border-box;
            margin-top: 20px;

            & > span {
                margin-right: 20px;
                cursor: pointer;
            }

            .regist {
                font-size: 16px;
                color: #054592;
            }

            .other {
                font-size: 14px;
                color: #0ea3ff;
            }
        }
        
        .eject-box {
            width: 100%;
            height: 100%;
            border-radius: 5px;
            background-color: #fff;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1000;
        }
    }



    .login-button {
        position: fixed;
        bottom: 20px;
        // margin-top: 270px;
        width: 100%;
        height: 50px;
        color: #fff;
        text-align: center;

        .company {
            margin-bottom: 5px;
        }

        .info {
            padding: 0 20px;
            font-size: 16px;
            position: relative;
            display: inline-block;
        }

        .info:before {
            content: '';
            background-color: #fff;
            width: 2px;
            height: 100%;
            position: absolute;
            top: 0;
            right: -1px;
        }

        .info:nth-last-child(1):before {
            opacity: 0;
        }

        .keep-on-record {
            font-size: 12px;
            padding: 0 20px;
        }
    }

    .hidden {
        position: absolute;
        top: -10000px;
    }
}
#img {
  width: 100%;
  height: 210px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.demo-form {
  padding: 20px;
  padding-bottom: 0;
  box-sizing: border-box;
}

#mask {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 1000;
  background-color: rgba(0, 0, 0, .4);
}
</style>

<style lang='less'>
.login .el-dialog {
  margin-top: 17rem !important;
}
</style>
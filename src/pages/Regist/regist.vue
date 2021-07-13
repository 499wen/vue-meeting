<template>
  <div class="regist">
    <!-- logo -->
    <img class='regist-logo' src='../../assets/images/login-logo.png' />
    
    <!-- text -->
    <div class="text">
      <img class='regist-text' src='../../assets/images/login-text.png' />
    </div>

    <!-- 注册 - 表单 --> 
    <div class="regist-form">
      <div class="regist-title">注 册</div>
      <el-form class="form" :model="registerForm" ref="registerForm" :rules="rules" label-width="78px">
        <el-form-item label="版 本" prop="systemEditionId" >
          <el-select v-model="registerForm.systemEditionId" size="small"> 
            <el-option v-for="item in editList" :key="item.id"
            :label="item.systemEditionName" :value="item.id"></el-option>
          </el-select>
          <a href="https://www.hzics.com" target="_bland" style="margin-left:0.938rem">了解详情</a>
        </el-form-item>
        <el-form-item label="单位名称" prop="companyName">
          <el-input v-model="registerForm.companyName" clearable @focus="focusOut('companyName')" @blur="blurOut" size="small"></el-input>
        </el-form-item>
        <el-form-item label="姓 名" prop="customerName">
          <el-input v-model="registerForm.customerName" clearable @focus="focusOut('customerName')" @blur="blurOut" size="small"></el-input>
        </el-form-item>
        <el-form-item label="行 业" prop="trade" >
          <el-select v-model="registerForm.trade" size="small">
            <el-option v-for="item in tradeList" :key="item.value"
            :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="registerForm.phone" clearable @focus="focusOut('phone')" @blur="blurOut" size="small"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="registerForm.email" clearable @focus="focusOut('email')" @blur="blurOut" size="small"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode">
          <el-input v-model="registerForm.checkCode" clearable size="small">
            <el-button v-preventReClick slot="append" @click="getCheckCode" :disabled="retryCount>0">{{retryCount>0?retryCount+'S 后重试':'获取验证码'}}</el-button>
          </el-input>
        </el-form-item>

        <div class="submit">
          <div class="submit-btn">
            <el-button v-preventReClick class="submit-btn-el" @click="apply" round size="small"> 提交申请 </el-button>
          </div>
          <div class="alr-exist">
            已有账号 <span @click="goLogin">去登录</span>
          </div>
        </div>
      </el-form>
    </div>

    <!-- 底部 -->
    <div class="regist-button">
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
  </div>
</template>

<script>
import regist from './regist.js'

export default regist
</script>

<style scoped lang='less'>
@import url('./regist.less');
</style>

<style lang="less">
.el-notification {
  top: 40% !important;
  left: 50%;
  margin-left: 260px;
}
</style>
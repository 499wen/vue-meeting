<template>
  <div class="index">
    <!-- nav 左侧导航栏 -->
    <div class="left-nav">
      <div class="logo">
        <img src="@/assets/images/hzLogo.png" alt="">
      </div>
      <div>
        <el-col :span="24">
          <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          router
          @open="handleOpen" 
          @close="handleClose"
          background-color="#234060"
          text-color="#fff"
          active-text-color="#ffd04b">
          <!-- <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu> -->
          <el-menu-item index="/home">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/meeting">
            <i class="el-icon-menu"></i>
            <span slot="title">会议管理</span>
          </el-menu-item>
          <el-menu-item index="/short_message">
            <i class="el-icon-menu"></i>
            <span slot="title">短信中心</span>
          </el-menu-item>
          <el-menu-item index="/approval_subscribe">
            <i class="el-icon-menu"></i>
            <span slot="title">预约审批</span>
          </el-menu-item>
          <el-menu-item index="/approval_atten">
            <i class="el-icon-menu"></i>
            <span slot="title">参会审批</span>
          </el-menu-item>
          <el-menu-item index="/reportForm">
            <i class="el-icon-menu"></i>
            <span slot="title">统计报表</span>
          </el-menu-item>
          <el-menu-item index="/hotel">
            <i class="el-icon-menu"></i>
            <span slot="title">酒店管理</span>
          </el-menu-item>
          <el-menu-item index="/onferRoom">
            <i class="el-icon-menu"></i>
            <span slot="title">会议室管理</span>
          </el-menu-item>
          <el-menu-item index="/restaurant" >
            <i class="el-icon-document"></i>
            <span slot="title">餐厅管理</span>
          </el-menu-item>
          <el-menu-item index="/person" >
            <i class="el-icon-document"></i>
            <span slot="title">人员管理</span>
          </el-menu-item>
          <el-menu-item index="/role">
            <i class="el-icon-setting"></i>
            <span slot="title">权限管理</span>
          </el-menu-item>



          <!-- <el-submenu :index="item.path" v-for="(item, idx) in router" :key="idx">
              <el-submenu index="1-4" v-if="item.children && item.children.length">
                  <template slot="title">{{ item.name }}</template>
                  <el-menu-item :index="child.path" v-for="(child, index) in item.children" :key='index'>{{ child.name }}</el-menu-item>
              </el-submenu>
              <template slot="title" v-else>
                  <i class="el-icon-location"></i>
                  <span>{{ item.name }}</span>
              </template>
          </el-submenu> -->
          </el-menu>

        </el-col>
      </div>
    </div>

    <!-- header 右侧信息栏 -->
    <div class="right-info">
      <div class="header">
        <!-- 公司信息 -->
        <div class="company-info">
          <div class="company-row">
            <span class="company-name">{{ loginInfo.companyName }}</span>
            <span class="company-download" @click="open('H5')">H5移动端</span>
            <span class="company-download" @click="open('APP')">下载APP</span>
          </div>
          <div class="login-user" @click="company_info">
            <img src="@/assets/images/hztLogo.png" alt="">
            <span>{{ loginInfo.loginName }}</span>
          </div>
        </div>

        <!-- 日历 登录退出 -->
        <div class="calendar-logout">
          <div class="calendar">
            <span>{{ date }}</span>
            <span>{{ days }}</span>
          </div>
          
          <el-menu                    
          active-background-color="#b3d4fc"
          active-text-color="#fff"
          background-color="#054592"
          class="main-setting-menu"
          mode="horizontal"
          text-color="#fff">
            <el-submenu class="main-setting-submenu" index="1">
              <template slot="title">
                <i class="el-icon-setting"></i>
              </template>
              <el-menu-item index="2-2">
                <div id="logout" @click="logout">
                <i class="el-icon-switch-button"></i> 注销
                </div>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </div>
      <!-- 主体界面 -->
      <div class="body">
        <router-view />
      </div>
    </div>

    <!-- 公司信息 -->
    <el-dialog title="公司信息" :visible.sync="companyInfo_child" width="10%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <companyInfo ref="companyInfo" v-if="companyInfo_child"></companyInfo>
    </el-dialog>

    <!-- 设置登录信息 -->
    <el-dialog title="初始化登录名和密码" :visible.sync="init_child" width="10%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <init ref="init" v-if="init_child"></init>
      <div class="dialog-btn">
        <el-button type="primary" @click="submitForm()" size="small" round>保 存</el-button>
      </div>  
    </el-dialog>

    <!-- H5 - APP -->
    <el-dialog :title="H5title" :visible.sync="H5_app" width="480px" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <div class="ls-image">
        <img src="@/assets/images/H5.png" alt="" v-if="H5_type == 'H5'">
        <img src="@/assets/images/qrcode.png" alt="" v-else>
      </div>
      <div class="dialog-btn"></div>
    </el-dialog>
  </div>
</template>

<script>
import index from './index.js'

export default index
</script>

<style scoped lang='less'>
@import url('./index.less');
</style>

<style lang="less">
.left-nav .el-menu-item {
  font-size: 16px;
}
</style>
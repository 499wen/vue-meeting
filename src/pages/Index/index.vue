<template>
  <div class="index">
    <!-- nav 左侧导航栏 -->
    <div class="left-nav">
      <div class="logo">
        <img src="@/assets/images/hzLogo.png" alt="">
      </div>
      <div class="nav-menu">
        <el-col :span="24">
          <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          :router='true'
          @select="handleOpen" 
          background-color="#234060"
          text-color="#fff"
          :unique-opened='true'
          active-text-color="#ffd04b">

          <el-menu-item index="/home" v-show="false">
            <i class="el-icon-setting"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/meet" v-show="false">
            <i class="el-icon-setting"></i>
            <span slot="title">会议管理</span>
          </el-menu-item>
          
          <div v-for="(item, idx) in router" :key="idx">
            <!-- 一级 -->
            <el-submenu :index="item.menuUrl + ''" v-if="item.children">
              <template slot="title">
                <i :class="`iconfont icon-${item.img}`"></i>
                <span>{{ item.menuName }}</span>
              </template>
                <!-- 二级 -->
                <el-menu-item-group v-for="(child, index) in item.children" :key="index">
                  <el-menu-item :index="'/'+child.menuUrl" class="child-menu">{{ '  '+child.menuName }}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <!-- 一级 -->
            <el-menu-item :index="'/'+item.menuUrl" v-else>
              <i :class="`iconfont icon-${item.img}`"></i>
              <span slot="title">{{ item.menuName }}</span>
            </el-menu-item>
          </div>
          
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
          </div>
          <div class="login-user">
            <div class="company-download" @click="open('H5')">
              <img src="@/assets/images/qrcodelogo.png" alt="">
              <span>H5移动端</span>
            </div>
            <div class="company-download" @click="open('APP')">
              <img src="@/assets/images/qrcodelogo.png" alt="">
              <span>会务通APP</span>
            </div>
            <img v-if="loginInfo.photoFileSaveName" :src="API.echoImage(loginInfo.photoFileSaveName, 'HeadFile')" @error="errImg(loginInfo.photoFileSaveName, 'HeadFile', $event)"/>
            <img src="@/assets/images/hztLogo.png" alt="" v-else>

            <span>{{ loginInfo.customerName }}</span>
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
                <div id="logout" @click="company_info">
                <i class="el-icon-edit"></i> 修改信息
                </div>
              </el-menu-item>
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
    <el-dialog title="公司信息" :visible.sync="companyInfo_child" width="30%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <companyInfo ref="companyInfo" v-if="companyInfo_child" @close='companyInfo_child = false' @initInfo='getCustomer'></companyInfo>
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
.left-nav{
  .el-menu-item {
    font-size: 16px;
    
  }

  .el-submenu__title {
    font-size: 16px;
  }

  .iconfont {
    color: #fff;
    margin-right: 5px;
    font-size: 18px;
    vertical-align: middle;
  }

  .child-menu {
    padding-left: 60px !important;
    font-size: 15px;
    // height: 30px;
  }
} 


</style>
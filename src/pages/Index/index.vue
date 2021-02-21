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
                    default-active="2"
                    class="el-menu-vertical-demo"
                    router
                    @open="handleOpen" 
                    @close="handleClose"
                    background-color="#234060"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航一</span>
                        </template>
                        <el-submenu index="1-4">
                            <template slot="title">选项4</template>
                            <el-menu-item index="1-4-1">选项1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="/home">
                        <i class="el-icon-menu"></i>
                        <span slot="title">首页</span>
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
                    <span class="company-name">单位</span>
                    <div class="login-user">
                        <img src="@/assets/images/hztLogo.png" alt="">
                        <span>翘翘</span>
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
                                <div id="logout">
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
    </div>
</template>

<script>
import { selfTime } from '@/plugins/plugins'

export default {
    data(){
        return {
            date: '',
            days: '',
            router: []
        }
    },
    methods: {
        // 展开导航
        handleOpen(data){
            console.log('handleOpen', data)
        },
        // 关闭导航
        handleClose(data){
            console.log('handleClose', data)
        }
    },
    created() {
        let curSj = new Date().getTime()
        this.date = selfTime(curSj, false)
        switch(new Date().getDay()){
            case 1: 
                this.days = '星期一'; break
            case 2: 
                this.days = '星期二'; break
            case 3: 
                this.days = '星期三'; break
            case 4: 
                this.days = '星期四'; break
            case 5: 
                this.days = '星期五'; break
            case 6: 
                this.days = '星期六'; break
            case 0: 
                this.days = '星期日'; break
        }


        let routes = this.$router.options.routes
        routes.filter(item => item.name == '框架' && this.router.push(...item.children))
    }
}
</script>

<style scoped lang='less'>
.index {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: flex-start;

    .left-nav {
        width: 200px;
        height: 100%;
        box-sizing: border-box;
        background-color: #234060;

        .logo {
            width: 100%;
            height: 110px;
            border-bottom: 2px solid #000;
            text-align: center;
            line-height: 110px;

            img {
                width: 138px;
                height: 63px;
                vertical-align: middle;
            }
        }
    }

    .right-info {
        width: calc(100% - 200px);
        height: 100%;
        box-sizing: border-box;

        .header {
            width: 100%;
            height: 80px;
            box-sizing: border-box;
            background: linear-gradient(to right, #234060,  #064592);
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0 50px;

            .company-info {
                flex: 1;
                height: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-right: 50px;

                .company-name {
                    font-size: 28px;
                    color: #fff;
                }

                .login-user {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    font-size: 18px;
                    color: #fff;

                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        margin-right: 10px;
                    }
                }
            }

            .calendar-logout {
                width: 200px;
                height: 100%;
                display: flex;
                align-items: center;
                font-size: 16px;

                .calendar {
                    display: flex;
                    flex-wrap: wrap;
                    text-align: center;
                    width: 100%;
                    color: #fff;

                    span {
                        width: 100%;
                    }
                }

                .main-setting-menu {
                    border-bottom: 0 !important;
                    height: 80px;

                    .main-setting-submenu {
                        margin-top: 10px;

                        .el-icon-setting {
                            color: #fff;
                        }
                    }
                }
            }
        }

        .body {
            width: 100%;
            height: calc(100% - 80px);
            padding: 10px;
            box-sizing: border-box;
        }
    }
}
</style>
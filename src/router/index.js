import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import axios from '../plugins/axios.js'
import API from '../API/api.js'
import { setCookie, delCookie, getCookie } from '@/plugins/cookie'

import { getSearch } from '@/plugins/plugins.js'

Vue.use(VueRouter);

const routes = [
  {
    path: '/qrcode',
    name: '二维码',
    component: () => import('../components/qrcode/qrcode.vue')
  },
  {
    path: '/regist',
    name: '注册',
    component: () => import(/* webpackChunkName: "regist" */ '../pages/Regist/regist.vue'),
  },

  { 
    path: '/login',
    name: '登录',
    component: () => import(/* webpackChunkName: "login" */ '../pages/Login/login.vue'),
  },
  {
    path: '/demo',
    name: 'demo',
    meta: '/demo',
    component: () => import(/* webpackChunkName: "home" */ '../demo/demo.vue'),
  },

  {
    path: '/',
    name: '框架',
    component: () => import(/* webpackChunkName: "index" */ '../pages/Index/index.vue'),
    redirect: '/home',
    children: [
      /**
       * 首页
       */
      {
        path: '/home',
        name: '首页',
        meta: '/home',
        component: () => import(/* webpackChunkName: "home" */ '../pages/Home/home.vue'),
      },
      {
        path: '/info_more',
        name: '首页-查看更多',
        meta: '/home',
        component: () => import(/* webpackChunkName: "home" */ '../pages/Home/info_more/info_more.vue'),
      },
      /**
       * 会议管理
       */
      {
        path: '/meet',
        name: '会议管理',
        meta: '/meet',
        component: () => import(/* webpackChunkName: "home" */ '../pages/Meeting/meetList.vue'),
      },
      {
        path: '/singleMeet',
        name: '会议管理-单级会议',
        meta: '/meet',
        component: () => import(/* webpackChunkName: "home" */ '../pages/Meeting/singleMeet/singleMeet.vue'),
      },
      {
        path: '/multiMeet',
        name: '会议管理-多级会议',
        meta: '/meet',
        component: () => import(/* webpackChunkName: "home" */ '../pages/Meeting/multiMeet/multiMeet.vue'),
      },
      /**
       * 权限管理
       */
      {
        path: '/role',
        name: '权限',
        meta: '/role',
        component: () => import(/* webpackChunkName: "role" */ '../pages/Role/role.vue'),
      },

      /**
       * 基础设置 - 酒店管理
       */
      {
        path: '/hotel',
        name: '酒店',
        meta: '/hotel',
        component: () => import(/* webpackChunkName: "hotel" */ '../pages/Hotel/hotel.vue'),
        children: []
      },
      {
        path: '/addHotel',
        name: '添加酒店',
        meta: '/hotel',
        component: () => import(/* webpackChunkName: "addHotel" */ '../pages/Hotel/addHotel/addHotel.vue'),
      },
      {
        path: '/editHotel',
        name: '修改酒店',
        meta: '/hotel',
        component: () => import(/* webpackChunkName: "editHotel" */ '../pages/Hotel/editHotel/editHotel.vue'),
      },
      
      /**
       * 基础设置 - 餐厅管理
       */
      {
        path: '/restaurant',
        name: '餐厅',
        meta: '/restaurant',
        component: () => import(/* webpackChunkName: "restaurant" */ '../pages/Restaurant/restaurant.vue'),
        children: []
      },
      {
        path: '/addRestaurant',
        name: '添加餐厅',
        meta: '/restaurant',
        component: () => import(/* webpackChunkName: "addRestaurant" */ '../pages/Restaurant/addRestaurant/addRestaurant.vue'),
      },
      {
        path: '/editRestaurant',
        name: '修改餐厅',
        meta: '/restaurant',
        component: () => import(/* webpackChunkName: "editRestaurant" */ '../pages/Restaurant/editRestaurant/editRestaurant.vue'),
      },

      /**
       * 基础设置 - 会议室管理 
       */
      {
        path: '/meetingRoomManager',
        name: '会议室',
        meta: '/meetingRoomManager',
        component: () => import(/* webpackChunkName: "onferRoom" */ '../pages/OnferRoom/onferRoom.vue'),
        children: []
      },
      {
        path: '/addOnferRoom',
        name: '添加会议室',
        meta: '/meetingRoomManager',
        component: () => import(/* webpackChunkName: "addOnferRoom" */ '../pages/OnferRoom/addOnferRoom/addOnferRoom.vue'),
      },
      {
        path: '/editOnferRoom',
        name: '修改会议室',
        meta: '/meetingRoomManager',
        component: () => import(/* webpackChunkName: "editOnferRoom" */ '../pages/OnferRoom/editOnferRoom/editOnferRoom.vue'),
      },

      /**
       * 基础设置 - 短信中心
       */
      {
        path: '/vueSmsCenter',
        name: '短信中心',
        meta: '/vueSmsCenter',
        component: () => import(/* webpackChunkName: "short_message" */ '../pages/Short_message/short_message.vue'),
      },

      /**
       * 基础设置 - 人员管理
       */
      {
        path: '/person',
        name: '人员管理',
        meta: '/person',
        component: () => import(/* webpackChunkName: "person" */ '../pages/Person/person.vue'),
        children: []
      },

      /**
       * 会务管理 - 参会审批 Approval_atten
       */
      {
        path: '/approve',
        name: '参会审批',
        meta: '/approve',
        component: () => import(/* webpackChunkName: "approval_atten" */ '../pages/Approval_atten/approval_atten.vue'),
        children: []
      },

      /**
       * 会务管理 - 请假审批 LeaveApprove
       */
      {
        path: '/leaveApprove',
        name: '请假审批',
        meta: '/approve',
        component: () => import(/* webpackChunkName: "leaveApprove" */ '../pages/LeaveApprove/leaveApprove.vue'),
        children: []
      },

      /**
       * 会议室预约 - 预约审批 approval_subscribe
       */
      {
        path: '/reviewApprove',
        name: '预约审批',
        meta: 'reviewApprove',
        component: () => import(/* webpackChunkName: "approval_subscribe" */ '../pages/Approval_subscribe/approval_subscribe.vue'),
        children: [] 
      },

      /**
       * 数据统计 - 统计报表 
       */
      {
        path: '/statistical',
        name: '统计报表',
        meta: '/statistical',
        component: () => import(/* webpackChunkName: "reportForm" */ '../pages/ReportForm/reportForm.vue'),
        children: []
      },
    ]
  },
  
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// 监听路由
router.beforeEach((to, from, next) => {
  let param = getSearch(),
  bind = localStorage.getItem('bind') || null

  if(to.path != '/login') next()
  else if(param.code && !bind ) {
    localStorage.setItem('bind', 1)
    console.log(param.code)

    // code 换取 openid
    axios.post(API.loginBywx(param.code))
      .then(res => {
        console.log(res)
        if(res.code == '000') {
          /**
           * data == null  未绑定
           */
          if(!res.data) {
            localStorage.setItem('openId', res.openId)
            next({ name: '登录'})
          } else {
            // 保存token本地
            localStorage.setItem('token', res.data.token)
            localStorage.removeItem('bind')

            next({name: '首页'})
          }
        } else {
          next({ name: '登录'})
        }
      })
  } else {
    next()
  }

})

export default router;

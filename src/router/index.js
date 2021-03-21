import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes = [
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
        path: '/meeting',
        name: '会议管理',
        meta: '/meeting',
        component: () => import(/* webpackChunkName: "home" */ '../pages/Meeting/meetList.vue'),
      },
      {
        path: '/singleMeet',
        name: '会议管理-单级会议',
        meta: '/meeting',
        component: () => import(/* webpackChunkName: "home" */ '../pages/Meeting/singleMeet/singleMeet.vue'),
      },
      {
        path: '/multiMeet',
        name: '会议管理-多级会议',
        meta: '/meeting',
        component: () => import(/* webpackChunkName: "home" */ '../pages/Meeting/multiMeet/multiMeet.vue'),
      },
      /**
       * 权限管理
       */
      {
        path: '/role',
        name: '权限',
        meta: '/meeting',
        component: () => import(/* webpackChunkName: "role" */ '../pages/Role/role.vue'),
      },

      /**
       * 基础设置 - 酒店管理
       */
      {
        path: '/hotel',
        name: '酒店',
        meta: '/meeting',
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
       * 基础设置 - 酒店管理
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
       * 基础设置 - 酒店管理 
       */
      {
        path: '/onferRoom',
        name: '会议室',
        meta: '/onferRoom',
        component: () => import(/* webpackChunkName: "onferRoom" */ '../pages/OnferRoom/onferRoom.vue'),
        children: []
      },
      {
        path: '/addOnferRoom',
        name: '添加会议室',
        meta: '/onferRoom',
        component: () => import(/* webpackChunkName: "addOnferRoom" */ '../pages/OnferRoom/addOnferRoom/addOnferRoom.vue'),
      },
      {
        path: '/editOnferRoom',
        name: '修改会议室',
        meta: '/onferRoom',
        component: () => import(/* webpackChunkName: "editOnferRoom" */ '../pages/OnferRoom/editOnferRoom/editOnferRoom.vue'),
      },

      /**
       * 基础设置 - 短信中心
       */
      {
        path: '/short_message',
        name: '短信中心',
        meta: '/short_message',
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
        path: '/approval_atten',
        name: '参会审批',
        meta: '/approval_atten',
        component: () => import(/* webpackChunkName: "approval_atten" */ '../pages/Approval_atten/approval_atten.vue'),
        children: []
      },

      /**
       * 会议室预约 - 预约审批 approval_subscribe
       */
      {
        path: '/approval_subscribe',
        name: '预约审批',
        meta: '/approval_subscribe',
        component: () => import(/* webpackChunkName: "approval_subscribe" */ '../pages/Approval_subscribe/approval_subscribe.vue'),
        children: [] 
      },

      /**
       * 数据统计 - 统计报表 
       */
      {
        path: '/reportForm',
        name: '统计报表',
        meta: '/reportForm',
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
// router.beforeEach((to, from, next) => {
  
// })

export default router;

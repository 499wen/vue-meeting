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
      {
        path: '/home',
        name: '首页',
        component: () => import(/* webpackChunkName: "home" */ '../pages/Home/home.vue'),
      },
      {
        path: '/role',
        name: '权限',
        component: () => import(/* webpackChunkName: "role" */ '../pages/Role/role.vue'),
      },

      /**
       * 基础设置 - 酒店管理
       */
      {
        path: '/hotel',
        name: '酒店',
        component: () => import(/* webpackChunkName: "hotel" */ '../pages/Hotel/hotel.vue'),
        children: []
      },
      {
        path: '/addHotel',
        name: '添加酒店',
        component: () => import(/* webpackChunkName: "addHotel" */ '../pages/Hotel/addHotel/addHotel.vue'),
      },
      {
        path: '/editHotel',
        name: '修改酒店',
        component: () => import(/* webpackChunkName: "editHotel" */ '../pages/Hotel/editHotel/editHotel.vue'),
      },
      
      /**
       * 基础设置 - 酒店管理
       */
      {
        path: '/restaurant',
        name: '餐厅',
        component: () => import(/* webpackChunkName: "restaurant" */ '../pages/Restaurant/restaurant.vue'),
        children: []
      },
      {
        path: '/addRestaurant',
        name: '添加餐厅',
        component: () => import(/* webpackChunkName: "addRestaurant" */ '../pages/Restaurant/addRestaurant/addRestaurant.vue'),
      },
      {
        path: '/editRestaurant',
        name: '修改餐厅',
        component: () => import(/* webpackChunkName: "editRestaurant" */ '../pages/Restaurant/editRestaurant/editRestaurant.vue'),
      },

      /**
       * 基础设置 - 酒店管理 
       */
      {
        path: '/onferRoom',
        name: '会议室',
        component: () => import(/* webpackChunkName: "onferRoom" */ '../pages/OnferRoom/onferRoom.vue'),
        children: []
      },
      {
        path: '/addOnferRoom',
        name: '添加会议室',
        component: () => import(/* webpackChunkName: "addOnferRoom" */ '../pages/OnferRoom/addOnferRoom/addOnferRoom.vue'),
      },
      {
        path: '/editOnferRoom',
        name: '修改会议室',
        component: () => import(/* webpackChunkName: "editOnferRoom" */ '../pages/OnferRoom/editOnferRoom/editOnferRoom.vue'),
      },

      /**
       * 基础设置 - 短信中心
       */
      {
        path: '/short_message',
        name: '短信中心',
        component: () => import(/* webpackChunkName: "short_message" */ '../pages/Short_message/short_message.vue'),
      },

      /**
       * 基础设置 - 人员管理
       */
      {
        path: '/person',
        name: '人员管理',
        component: () => import(/* webpackChunkName: "person" */ '../pages/Person/person.vue'),
        children: []
      },

      /**
       * 会务管理 - 参会审批 Approval_atten
       */
      {
        path: '/approval_atten',
        name: '参会审批',
        component: () => import(/* webpackChunkName: "approval_atten" */ '../pages/Approval_atten/approval_atten.vue'),
        children: []
      },

      /**
       * 会议室预约 - 预约审批 approval_subscribe
       */
      {
        path: '/approval_subscribe',
        name: '预约审批',
        component: () => import(/* webpackChunkName: "approval_subscribe" */ '../pages/Approval_subscribe/approval_subscribe.vue'),
        children: []
      },
    ]
  },
  
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

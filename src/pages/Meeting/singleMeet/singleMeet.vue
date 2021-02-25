<template>
  <div class="single-meet">
    <div class="header-opera special">
      <div class="tap">
        <span>会议管理</span>
        <span>{{tabFunc}}</span>
      </div>
    </div>

    <!-- 主体 -->
    <div class="single-body">
      <!-- tab 栏 -->
      <div class="func-list">
        <span v-for="(item, idx) in tabList" :key="idx"
          :class="item.select && 'select'" @click="choiceTab(idx)"> {{ item.name }} </span>
      </div>

      <!-- 内容 -->
      <div class="content">
        <!-- 基本信息 -->
        <basicInfo ref='basicInfo' v-if="tabFunc == '基本信息'"></basicInfo>
        <!-- 参会人管理 -->
        <attendee ref='attendee' v-if="tabFunc == '参会人管理'"></attendee>
        <!-- 会议室预约 -->
        <meetRoom ref='meetRoom' v-if="tabFunc == '会议室预约'"></meetRoom>
        <!-- 通知消息管理 -->
        <smscenter ref='smscenter' v-if="tabFunc == '通知消息管理'"></smscenter>
        <!-- 餐饮管理 -->
        <restaurant ref='restaurant' v-if="tabFunc == '餐饮管理'"></restaurant>
        <!-- 邀请函 -->
        <invitation ref='invitation' v-if="tabFunc == '邀请函'"></invitation>
        <!-- 住宿管理 -->
        <guestroom ref='guestroom' v-if="tabFunc == '住宿管理'"></guestroom>
      </div>
    </div>


  </div>
</template>

<script>
import basicInfo from './basicInfo/basicInfo.vue' // 基本信息
import attendee from './attendee/attendee.vue' // 参会人管理
import meetRoom from './meetRoom/meetRoom.vue' // 会议室预约
import smscenter from './smscenter/smscenter.vue' // 通知消息管理
import invitation from './invitation/invitation.vue' // 邀请函
import guestroom from './guestroom/guestroom.vue' // 住宿管理
import restaurant from './restaurant/restaurant.vue' // 餐饮管理

export default {
  components: {
    basicInfo,
    attendee,
    meetRoom,
    smscenter,
    invitation,
    guestroom,
    restaurant,
  },
  data() {
    return {
      // tab
      tabFunc: '通知消息管理',
      tabList: [
        {name: '基本信息', eng: 'basicInfo', select: true},
				{name: '参会人管理', eng: 'attendee', select: false},
				{name: '会议室预约', eng: 'meetRoom', select: false},
				{name: '通知消息管理', eng: 'smscenter', select: false},
				{name: '邀请函', eng: 'invitation', select: false},
				{name: '住宿管理', eng: 'guestroom', select: false},
				{name: '餐饮管理', eng: 'restaurant', select: false},
				// {name: '车辆管理', eng: 'vehicletask', select: false},
				// {name: '会务组管理', eng: 'meetingaffairs', select: false},
				// {name: '会务组报到', eng: 'report', select: false},
      ]
    }
  },
  methods: {
    // 选择tab
    choiceTab(index) {
      this.tabFunc = this.tabList[index].name
      this.tabList.filter((item, idx) => idx == index ? item.select = true : item.select = false)
    }
  }
}
</script>

<style scoped lang='less'>
.single-meet {
  width: 100%;
  height: 100%;

  .single-body {
    width: 100%;
    height: calc(100% - 40px);

    .func-list {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 2px solid #ccc;
      box-sizing: border-box;
      margin-bottom: 10px;

      & > span {
        height: 100%;
        padding: 0 15px;
        box-sizing: border-box;
        line-height: 40px;
        font-size: 15px;
        color: #333;
        cursor: pointer;
      }

      .select {
        color: #409efe;
        position: relative;
      }

      .select:before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        height: 2px;
        width: 100%;
        background-color: #409efe;
      }
    }

    .content {
      width: 100%;
      height: calc(100% - 50px);
    }
  }
}
</style>
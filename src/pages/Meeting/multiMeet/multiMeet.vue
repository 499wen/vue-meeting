<template>
  <div class="single-meet">
    <div class="header-opera special">
      <div class="tap">
        <span>会议管理(多)</span>
        <span v-if="meetingData.meetingName">{{meetingData.meetingName}}</span>
        <span>{{tabFunc}}</span>
      </div>
    </div>
    <div class="multi-meet">

      <div class="meet-tree">
        <div class="header">会议列表</div>
        <div class="meet-tree-multi">
          <el-tree
            :data="data"
            :props="treeProps"
            node-key="id"
            ref='tree'
            default-expand-all
            @node-click='treeClick'
            :expand-on-click-node="false"
            :highlight-current="true"
            :render-content="renderContent">
          </el-tree>
        </div>
      </div>
      <!-- 主体 -->
      <div class="single-body">
        <!-- tab 栏 -->
        <div class="func-list">
          <span v-for="(item, idx) in tabList" :key="idx"
            :class="item.select && 'select'" @click="choiceTab(item.eng)"> {{ item.name }} </span>
        </div>

        <!-- 内容 --> 
        <div class="content" v-if="block">
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

  </div>
</template>

<script>
import multiMeet from './multiMeet.js'

export default multiMeet
</script>

<style scoped lang='less'>
@import url('./multiMeet.less');
</style>
<template>
  <div class="meeting">
    <div class="header-opera">
      <div class="tap">
        <span>会议管理</span>
      </div> 

      <div class="opera">
        <el-input size="small" placeholder="请输入会议名称" v-model="searchKey" @keyup.native.enter="searchBtn" style="width: 300px">
          <el-button v-preventReClick slot="append" icon="el-icon-search" @click="searchBtn" type="primary"></el-button>
        </el-input>
        <el-button v-preventReClick size="small" @click="createMeet" type="warning"  class="add-hotel"> 新建会议 </el-button>
      </div> 
    </div> 

    <!-- 主体 -->
    <div class="meet-body">
      <!-- 导航选择 -->
      <div class="nav">
        <span :class="item.select && 'select'" @click="tab_list(idx)"
          v-for="(item, idx) in navList" :key="idx">{{ item.name }}</span>
      </div>

      <!-- 会议列表 -->
      <div class="meet-list" v-if="tableData.length != 0">
        <div class="meet-single" v-for="(item, idx) in tableData" :key="idx">

          <!-- 盒子拆分 - 左右结构 -->
          <div class="box-left">
            <!-- 会议封面 -->
            <div class="meet-cover">
              <img :src="API.echoImage(item.photoFileId, 'MeetingImage')" alt="" v-if="item.photoFileId">
              <img src="../../assets/images/avatar.png" alt="" v-else>

              <!-- 提示
               未发布: #2ba2ff 默认, 已发布: #60cfb9 .published, 进行中: #ffd04b .ongoing, 已结束: #6f6f6f .over -->
              <div :class="['meet-tips', 
              item.tipsLeft == '已发布' && 'published',
              item.tipsLeft == '进行中' && 'ongoing', 
              item.tipsLeft == '未发布' && item.tips == '已过期' && 'over',
              item.tipsLeft == '已结束' && 'over']">{{ item.tipsLeft }}</div>
            </div>

            <!-- 会议基本信息 -->
            <div class="basic-info">
              <div class="clumn">{{ item.meetingName }}</div>
              <div class="clumn">会议时间: {{ item.beginTime }} 至 {{ item.endTime }}</div>
              <div class="clumn">会议地址: {{ item.address }}</div>
            </div>

          </div>

          <div class="box-right">
            <!-- 会议 - 功能 -->
            <div class="meet-func">
              <div class="icon" v-show="data.isShow == '1'"
                v-for="(data, idx) in funcBtnUse" :key="idx" :style="data.isUse != '1' && `cursor: not-allowed;color: #aaa;`"
                @click="meet_func(item, data)"
              > 
                <img :src="imgIcon(data.icon)" alt />
                {{ data.buttonName }}
              </div>
            </div>

            <!-- 会议 - 按钮 -->
            <div class="meet-btn">
              <el-button v-preventReClick :class="['btn', 'disabled',
              item.tips == '已发布' && 'published',
              item.tips == '进行中' && 'ongoing', 
              item.tips == '已过期' && 'over',
              item.tips == '已结束' && 'over']" size="mini" v-if="item.tips != '未发布'" round >{{ item.tips }}</el-button>
              <el-button v-preventReClick class="btn" type="warning" size="mini" v-else round @click="SendingNotice(item, item.releaseCode, item.beginDate)">发布会议</el-button>
              <!-- <el-button v-preventReClick class="btn" size="mini" round>发送邀请函</el-button> -->
              <!-- <el-button v-preventReClick class="btn" size="mini" round>会议驾驶舱</el-button>
              <el-button v-preventReClick class="btn" size="mini" round>复制会议</el-button> -->
              <!-- <el-button v-preventReClick class="btn" size="mini" round v-if="item.tips == '已发布'">通知参会人</el-button> -->
            </div>
          </div>
        </div>
      </div>
      <div class="meet-list no-meet" v-else> 
        <span v-show="tips == '1'">未添加会议。。。</span>
        <span v-show="tips == '2'">无已结束会议。。。</span>
        <span v-show="tips == '3'">无未发布会议。。。</span>
        <span v-show="tips == '4'">无已发布会议。。。</span>
        <span v-show="tips == '0'">无进行中会议。。。</span>
      </div>

      <!-- 分页 -->
      <div class="pagin">
        <el-pagination
        background
        @size-change="sizeChange"
        @current-change="curChange"
        :current-page="pageNum"
        :page-sizes="[20, 50, 100, 300]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
      </div>

      <!-- 选择 会议创建类型 -->
      <el-dialog title="选择会议类型" :visible.sync="addMeeting" width="10%" center
        :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
        <div class="dialog-btn">
          <el-button v-preventReClick type="primary" @click="single_stage" size="small" round>单级会议</el-button>
          <el-button v-preventReClick @click="multi_stage" size="small" type="danger" round>多级会议</el-button>
        </div>
      </el-dialog>
    </div> 
  </div>
</template>

<script>
import meetList from './meetList.js'

export default meetList
</script>

<style scoped lang='less'>
@import url('./meetList.less');
</style>
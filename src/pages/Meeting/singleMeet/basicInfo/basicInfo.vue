<template>
  <div class="basicInfo">

    <div class="form">
      <!-- 表单 -->
      <div class="form-left">
        <div class="newly-build">
          <div class="form-title">新建会议</div>
          <div class="form-body">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="145px">
              <div class="a-part">
                <el-form-item label="会议名称" prop="meetingName">
                  <el-input size="small" v-model="addForm.meetingName" :disabled='meetIsEnd' placeholder="请输入会议名称"></el-input>
                </el-form-item>
                <el-form-item label="会议图片" prop='capacity'>
                  <div class="avatar-uploader">
                    <div class="avatar">
                      <img v-if="addForm.photoFileId" :src="API.echoImage(addForm.photoFileId, 'MeetingImage')" @error="errImg(addForm.photoFileId, 'MeetingImage', $event)"/>
                      <img v-else src="@/assets/images/meetImg.png" alt="">
                      <input type="file" name="" id="" class="hide" @change="updateLoad" ref="file" :disabled='meetIsEnd'>
                    </div>
                    
                    <div class="self-explain" style="">
                      <div>建议尺寸：564*376</div>
                      <div>大小：300KB以下</div>
                    </div>
                  </div>

                </el-form-item> 
                <el-form-item label="会议地址" prop="address">
                  <el-input id="suggestId" size="small" v-model="addForm.address" @input="addressFact" placeholder="请输入会议地址" :disabled='meetIsEnd'></el-input>
                </el-form-item> 
                <el-form-item label="会议内容">
                  <el-input class="textarea" v-model="addForm.content" :autosize="{ minRows: 5, maxRows: 5}" type="textarea" placeholder="请输入会议描述" :disabled='meetIsEnd'></el-input>
                </el-form-item> 

                <!-- --------------- 选择会议时间 --------------- -->
                <el-col :span="12" class="">
                  <el-form-item label="会议时间" prop="beginDate" class="equal-width">
                    <el-date-picker :start-placeholder='`2020-11-17 16:20`' type="datetime"
                      v-model="addForm.beginDate" format="yyyy-MM-dd HH:mm" size="small" :disabled='meetIsEnd'></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="至" prop="endDate" class="equal-width">
                    <el-date-picker :start-placeholder='`2020-11-17 16:20`' type="datetime"
                      v-model="addForm.endDate" format="yyyy-MM-dd HH:mm" size="small" :disabled='meetIsEnd'></el-date-picker>
                  </el-form-item>
                </el-col>

                <!-- --------------- 选择签到时间 --------------- -->
                <el-col :span="12">
                  <el-form-item label="签到时间" prop="checkBeginTime" class="equal-width">
                    <el-date-picker :start-placeholder='`2020-11-17 16:20`' type="datetime"
                      v-model="addForm.checkBeginTime" format="yyyy-MM-dd HH:mm" size="small" :disabled='meetIsEnd'></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="至" prop="checkEndTime" class="equal-width">
                    <el-date-picker :start-placeholder='`2020-11-17 16:20`' type="datetime"
                      v-model="addForm.checkEndTime" format="yyyy-MM-dd HH:mm" size="small" :disabled='meetIsEnd'></el-date-picker>
                  </el-form-item>
                </el-col>

                <!-- --------------- 选择迟到时间 --------------- -->
                <el-col :span="12">
                  <el-form-item label="迟到时间" prop="layTime" class="equal-width">
                    <el-date-picker :start-placeholder='`2020-11-17 16:20`' type="datetime"
                      v-model="addForm.layTime" format="yyyy-MM-dd HH:mm" size="small" :disabled='meetIsEnd'></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="早退时间" prop="leaveTime" class="equal-width">
                    <el-date-picker :start-placeholder='`2020-11-17 16:20`' type="datetime"
                      v-model="addForm.leaveTime" format="yyyy-MM-dd HH:mm" size="small" :disabled='meetIsEnd'></el-date-picker>
                  </el-form-item>
                </el-col>
              </div> 
              <!-- ---------------- 折叠板 ---------------- -->
              <el-col :span='24'>
                <el-collapse v-model="collapse" class="collapse" @change="collapseChange" >
                  <!-- 会议配置 -->
                  <el-collapse-item title="会议配置" name="会议配置">
                    <el-form-item label="通知参会方式">
                      <div class="set-margin">
                        <el-radio @change="invitationWayChange" label="2" :disabled='meetIsEnd'
                          v-model="addForm.invitationWay" title="以“会议邀请函”形式发送给公司外部人员“会议通知”"
                        >短信+邀请函通知</el-radio>
                        <el-radio v-model="addForm.invitationWay" label="0" :disabled='meetIsEnd'
                          @change="invitationWayChange" title="只发送给公司内部人员“会议通知”短信"
                        >短信通知</el-radio>
                        <el-radio @change="invitationWayChange" label="1" :disabled='meetIsEnd'
                          v-model="addForm.invitationWay" title="以“会议邀请函”形式发送给公司外部人员“会议通知”"
                        >邀请函通知</el-radio>
                        <el-radio @change="invitationWayChange" label="3" :disabled='meetIsEnd'
                          v-model="addForm.invitationWay" title="以“会议邀请函”形式发送给公司外部人员“会议通知”"
                        >不发送短信</el-radio>
                      </div>
                    </el-form-item> 

                    <el-form-item label="无名单人员申请参会">
                      <div class="set-margin">
                        <el-col :span="24" v-if="addForm.invitationWay >= 1">
                          <el-radio v-model="addForm.strangersJoinIn" :label="1" :disabled="meetIsEnd" style="letter-spacing: 14px;"
                          title="无名单人员通过邀请函二维码扫描，打开邀请函，并填入姓名、手机号等相关信息推送报名信息，系统后台即时能接收并统计">准许</el-radio>
                          <el-radio v-model="addForm.strangersJoinIn" :label="0" :disabled="meetIsEnd">不准许</el-radio>
                        </el-col>
                        <el-col :span="24" v-else>
                          <el-radio v-model="addForm.strangersJoinIn" :label="1" :disabled="true" style="letter-spacing: 14px;"
                          title="无名单人员通过邀请函二维码扫描，打开邀请函，并填入姓名、手机号等相关信息推送报名信息，系统后台即时能接收并统计">准许</el-radio>
                          <el-radio v-model="addForm.strangersJoinIn" :label="0" :disabled="true">不准许</el-radio>
                        </el-col>
                      </div>
                    </el-form-item> 

                    <el-form-item label="邀请自助报名审批">
                      <div class="set-margin">
                        <el-col :span="24">
                          <el-radio :disabled="meetIsEnd" label="1"
                            v-model="addForm.meetingInviteApproveCode" title=""
                          >自动通过</el-radio>
                          <el-radio :disabled="meetIsEnd" label="0"
                            v-model="addForm.meetingInviteApproveCode" title=""
                          >人工审批</el-radio>
                        </el-col>
                      </div>
                    </el-form-item> 

                    <el-form-item label="参会人应到基数">
                      <div class="set-margin">
                        <el-col :span="24">
                          <el-radio v-model="addForm.IsAttendanceNumber" :label="1" :disabled="meetIsEnd">以确认参会人员为准</el-radio>
                          <el-radio v-model="addForm.IsAttendanceNumber" :label="0" :disabled="meetIsEnd">以邀请/通知人员为准</el-radio>
                          <el-checkbox :disabled="meetIsEnd" fill='#e67c7c' name='type'
                            label="包含请假人员" v-model="doesTheNumberLeave"
                          ></el-checkbox>
                        </el-col>
                      </div>
                    </el-form-item> 

                    <el-form-item label="请假审批方式">
                      <div class="set-margin">
                        <el-col :span="24">
                          <el-radio :disabled="meetIsEnd" :label="1"
                            v-model="addForm.leaveApprovalMethod"
                          >自动通过</el-radio>
                          <el-radio
                            :disabled="meetIsEnd" :label="0"
                            v-model="addForm.leaveApprovalMethod"
                          >人工审批</el-radio>
                        </el-col>
                      </div>
                    </el-form-item> 

                    <el-form-item label="二维码签到选项">
                      <div class="set-margin">
                        <el-col :span="24">
                          <el-radio :disabled="meetIsEnd" :label="'0'"
                            v-model="addForm.signType"
                          >参会人二维码</el-radio>
                          <el-radio
                            :disabled="meetIsEnd" :label="'1'"
                            v-model="addForm.signType"
                          >会议码</el-radio>
                        </el-col>
                      </div>
                    </el-form-item> 
                  </el-collapse-item>

                  <!-- 更多信息 -->
                  <el-collapse-item title="更多信息" name="更多信息">
                    <el-form-item label="会议组织">
                      <div class="set-margin" v-for="(item, idx) in addForm.sponsorArrJsonStr" :key="idx">
                        <el-input placeholder="请输入内容" size="small" v-model="item.value" class="sm-input" :disabled="meetIsEnd">
                          <el-select v-model="item.type" slot="prepend" placeholder="请选择组织类型" class="sm-select" :disabled="meetIsEnd">
                            <el-option label="主办方" value="organizer"></el-option>
                            <el-option label="协办方" value="coOrganizer"></el-option>
                          </el-select>
                        </el-input>
                        <el-button size="small" class="sm-del" @click="delSponsor(idx)" :disabled="meetIsEnd">删除</el-button>
                      </div>
                      <div class="set-margin">
                        <el-button size="small" class="sm-select" @click="addSponsor" :disabled="meetIsEnd">添加会议组织</el-button>
                      </div>
                    </el-form-item> 

                    <el-form-item label="会议联系人">
                      <div class="set-margin c-card">
                        <div class="card" v-for="(item, idx) in addForm.contactJson" :key='idx'>
                          <div class="card-single">
                            <div class="label-name">姓 名</div>
                            <el-input v-model="item.name" size="small" :disabled="meetIsEnd"></el-input>
                          </div>
                          <div class="card-single">
                            <div class="label-name">职 务</div>
                            <el-input v-model="item.duty" size="small" :disabled="meetIsEnd"></el-input>
                          </div>
                          <div class="card-single">
                            <div class="label-name">手 机</div>
                            <el-input v-model="item.handPhone" size="small" :disabled="meetIsEnd"></el-input>
                          </div>
                          <div class="card-single">
                            <div class="label-name">电 话</div>
                            <el-input v-model="item.teltPhone" size="small" :disabled="meetIsEnd"></el-input>
                          </div>
                          <div class="card-single">
                            <el-button size="small" class="sm-select" @click="delContact(idx)" :disabled="meetIsEnd">删除联系人</el-button>
                          </div>
                        </div>
                      </div>
                      <div class="set-margin">
                        <el-button size="small" class="sm-select" @click="addContact" :disabled="meetIsEnd">添加联系人</el-button>
                      </div>
                    </el-form-item> 

                    <el-form-item label="注意事项">
                      <div class="set-margin">
                        <el-input class="textarea" v-model="addForm.mattersNeedAttention" :disabled="meetIsEnd" :autosize="{ minRows: 5, maxRows: 5}" type="textarea" placeholder="请输入注意事项"></el-input>
                      </div>
                    </el-form-item>

                    <el-form-item label="会议议程">
                      <div class="set-margin" v-for="(item, idx) in addForm.meetingProduce" :key="idx">
                        <div class="label-agenda">议程{{ idx + 1 }}:</div>
                        <el-input size="small" v-model="item.value" class="sm-input" :disabled="meetIsEnd">
                        </el-input>
                        <el-button size="small" class="sm-del" @click="delProduce(idx)" :disabled="meetIsEnd">删除</el-button>
                      </div>
                      <div class="set-margin">
                        <el-button size="small" class="sm-select" @click="addProduce" :disabled="meetIsEnd">添加会议议程</el-button>
                      </div>
                    </el-form-item> 

                  </el-collapse-item>
                </el-collapse>
              </el-col>


            </el-form>
          </div>
        </div>
        <div class="submit-btn">
          <el-button type="danger" round size='small' @click="edit" v-show="addForm.timeNow < addForm.endDate">修 改</el-button>
          <el-button type="danger" round size='small' @click="save" :disabled="meetIsEnd">确 认</el-button>
        </div>
      </div>
      
      <!-- 平面图 -->
      <div class="form-right">
        <div class="right-box">
          <div class="intro-duce">会议平面图</div>
          <div class="img-pmt">
            <img v-if="addForm.meetingRoomId" :src="API.echoImage(addForm.meetingRoomId, 'MeetingPlane')" class="avatar-duce" @error="errImg(addForm.meetingRoomId, 'MeetingPlane', $event)"/>
            <img v-else src="@/assets/images/meetplan.png" class="avatar-duce" alt="">
            <input type="file" name="" id="" class="hide" @change="updateLoad_pml" ref="file_pmt" :disabled="meetIsEnd">
          </div>
        </div>
        <div class="right-box">
          <div class="intro-duce">会议地址</div>
          <div class="img" id="baidu-map">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import basicInfo from './basicInfo.js'

export default basicInfo
</script>

<style scoped lang='less'>
@import url('./basicInfo.less');
</style>

<style lang='less'>


.textarea {
  .el-textarea__inner{ //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }
}

.avatar-duce {
  width: 100%;
  height: 100%;
}

.equal-width .el-date-editor{
  width: 100%;
}

.form .el-form-item {
  margin-bottom: 15px;
}

.form .el-form-item__error {
  padding-top: 0;
}

.collapse {
  border-bottom: none;
}

.collapse .el-collapse-item {
  margin-bottom: 10px;
}

.collapse .el-collapse-item__header {
  background-color: #eee;
  padding-left: 10px;
  font-weight: 700;
  font-size: 15px;
  height: 36px;
  line-height: 36px;
  box-sizing: border-box;
}

.collapse .el-collapse-item__content {
  background-color: #eee;
  padding-right: 50px;
  padding-bottom: 0;
}

.collapse .el-collapse-item__wrap {
  overflow: inherit;
  border-bottom: none;
}

.collapse .el-input-group__prepend {
  background-color: #fff;
}

.a-part {
  width: 100%;
  box-sizing: border-box;
  padding-right: 50px;
}
.set-margin {
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  padding-left: 25px;
  box-sizing: border-box;

  .sm-del {
    margin-left: 5px;
  }

  .sm-select {
    width: 100px;
  }

  .sm-input {
    width: 400px;
  }
}

.c-card {
  height: auto;
  flex-wrap: wrap;

  .card {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 1px 1px 8px 1px #ccc;
    // height: 100px;
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 5px;

    .card-single {
      width: 48%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .label-name {
        width: 40px;
      }

      .el-input {
        width: calc(100% - 45px);
      }
    }

    .card-single:nth-last-child(1) {
      margin-top: 10px;
    }
  }
}

.label-agenda {
  width: 56px;
}

</style>
import basicInfo from './basicInfo/basicInfo.vue' // 基本信息
import attendee from './attendee/attendee.vue' // 参会人管理
import meetRoom from './meetRoom/meetRoom.vue' // 会议室预约
import smscenter from './smscenter/smscenter.vue' // 通知消息管理
import invitation from './invitation/invitation.vue' // 邀请函
import guestroom from './guestroom/guestroom.vue' // 住宿管理
import restaurant from './restaurant/restaurant.vue' // 餐饮管理

import { mapState, mapMutations } from 'vuex'

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
      tabFunc: '基本信息',
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
      ],
      // 显示模块
      block: false
    }

  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: {
    // vuex 保存会议数据
    ...mapMutations([
      'setMeetingData'
    ]),
    // 选择tab
    choiceTab(eng) {
      // 判断会议
      if(eng != 'basicInfo' && !this.meetingData.id) {
        this.$message.info('请先保存会议!')
        return 
      }
      this.tabList.filter((item, idx) => {
        if(item.eng == eng){
          item.select = true 
          this.tabFunc = item.name
        } else {
          item.select = false
        }
      })
    },

    // 获取会议信息
    getMeetInfo(data){
      this.$http.get(this.API.singleMeeting(data.meetingId))
      .then(res => {
        if(res.code == '000'){
          // 处理数据
          res.data.sponsorArrJsonStr = JSON.parse(res.data.sponsorArrJsonStr);
          res.data.contactJson = JSON.parse(res.data.contactJson);
          res.data.meetingProduce = JSON.parse(res.data.meetingProduce) 

          // 保存当前会议数据
          this.setMeetingData(res.data)

          setTimeout(() => {
            // 判断模块
            this.block = true
            this.choiceTab(data.select)
          }, 0)
        }
      })
    }
  },
  created() {
    let tab = this.$route.query
    if(tab.select){
      console.clear()
      console.log(`%cID: ${tab.meetingId}`, 'color: red;font-size: 18px')
      // 获取会议信息
      this.getMeetInfo(tab)
    } else {
      // 判断模块
      this.block = true
      this.choiceTab('basicInfo')
    }
  }
}
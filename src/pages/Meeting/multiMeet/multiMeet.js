import basicInfo from './basicInfo/basicInfo.vue' // 基本信息
import attendee from './attendee/attendee.vue' // 参会人管理
import meetRoom from './meetRoom/meetRoom.vue' // 会议室预约
import smscenter from './smscenter/smscenter.vue' // 通知消息管理
import invitation from './invitation/invitation.vue' // 邀请函
import guestroom from './guestroom/guestroom.vue' // 住宿管理
import restaurant from './restaurant/restaurant.vue' // 餐饮管理

import { mapState, mapMutations, mapActions } from 'vuex'
import { defaultMeetData } from './default.js'
import handle from '../public.js'

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
      block: false,

      // tree
      data: [
        { id: 1, meetingName: '一级 1',
          meetings: []
        }
      ],
      treeProps: {
        children: 'meetings',
        label: 'meetingName'
      },
      curTree: {}
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
    ...mapActions([
      'aboutMeetingData'
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

    // tree - 点击触发
    treeClick(data, node){
      console.log(data, node)
      // 复制当前显示数据 (取出 meetings属性)
      let copyData = JSON.parse(JSON.stringify(data))
      delete copyData.meetings

      this.aboutMeetingData(copyData)
      let name = this.tabFunc
      setTimeout(() => {
        // 点击其它会议  触发过渡效果
        this.tabFunc += '  '
        setTimeout(() => {
          this.tabFunc = name
        }, 200)
      }, 200)
    },
    // tree - 树结构
    renderContent(h, { node, data, store }) {
      let html
      if(node.level == 1){
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button v-preventReClick size="mini" type="text" on-click={ (e) => this.append(data, e) } icon="el-icon-circle-plus-outline"></el-button>
            </span>
          </span>)
      }
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
        </span>);
    },
    // tree - 添加
    append(data, e){
      e.preventDefault();
      e.stopPropagation();
      console.log(this.curTree)

      if(this.tabFunc == '基本信息'){
        let child = this.$refs.basicInfo
        console.log(child.addForm)
        
        if(JSON.stringify(this.curTree) != JSON.stringify(child.addForm)){
          this.$confirm('是否清空当前信息?', '提示', {  
            closeOnPressEscape: false,
            closeOnClickModal: false,
            cancelButtonClass: 'btn_custom_cancel',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 会议上级id
            child.addForm = defaultMeetData(this.data[0].id)
          }).catch(() => {})
        } else {
          // 会议上级id
          child.addForm = defaultMeetData(this.data[0].id)
        }
      }

    },

    // 获取会议信息
    getMeetInfo(data){
      this.$http.get(this.API.multiMeeting(data.meetingId))
      .then(res => {
        if(res.code == '000'){
          // 处理数据 App创建会议 以下属性为空字符串
          data.sponsorArrJsonStr = data.sponsorArrJsonStr ? JSON.parse(data.sponsorArrJsonStr) : handle('sponsorArrJsonStr')
          data.contactJson = data.contactJson ? JSON.parse(data.contactJson) : handle('contactJson')
          data.meetingProduce = data.meetingProduce ? JSON.parse(data.meetingProduce) : handle('meetingProduce')
          res.data.meetings = res.data.meetings || []
          this.data = [JSON.parse(JSON.stringify(res.data))]
          
          delete res.data.meetings
          // 保存当前会议数据
          this.setMeetingData(res.data)

          this.curTree = res.data

          setTimeout(() => {
            // 判断模块
            this.block = true
            this.choiceTab(data.select)
            this.$refs.tree.setCurrentKey(data.meetingId)
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
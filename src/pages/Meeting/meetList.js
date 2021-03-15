import { selfTime } from '@/plugins/plugins.js'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      searchKey: '',
      navList: [
        {name: '全部会议', select: true, tips: ''},
        {name: '未发布', select: false, tips: ''},
        {name: '已发布', select: false, tips: ''},
        {name: '进行中', select: false, tips: ''},
        {name: '已结束', select: false, tips: ''}
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 10,

      // icon
      funcBtnUse: [
        {name: '基本信息', scription: 'basicInfo', icon: '/baseInformation.png', id: '110001', num: 1, isShow: '1', isUse: '1'},
        {name: '参会人管理', scription: 'attendee', icon: '/attendPersonal.png', id: '110003', num: 2, isShow: '1', isUse: '1'},
        {name: '会议室预约', scription: 'meetRoom', icon: '/roomReservation.png', id: '110012', num: 3, isShow: '1', isUse: '1'},
        {name: '会议通知管理', scription: 'smscenter', icon: '/notice.png', id: '110004', num: 4, isShow: '1', isUse: '1'},
        {name: '会议邀请函', scription: 'invitation', icon: '/meetingInvite.png', id: '110002', num: 5, isShow: '1', isUse: '1'},
        {name: '会议排位管理', scription: ' ', icon: '/ConferenceSeating.png', id: '110005', num: 6, isShow: '1', isUse: '1'},
        {name: '会议住宿管理', scription: 'guestroom', icon: '/stayManagement.png', id: '110007', num: 7, isShow: '1', isUse: '1'},
        {name: '会议用餐管理', scription: 'restaurant', icon: '/eatmanage.png', id: '110008', num: 8, isShow: '1', isUse: '1'},
        {name: '会议车辆管理', scription: 'vehicletask', icon: '/carmanagement.png', id: '110009', num: 9, isShow: '1', isUse: '0'},
        {name: '会务组管理', scription: 'meetingaffairs', icon: '/groupManage.png', id: '110010', num: 10, isShow: '1', isUse: '1'},
        {name: '会议资料管理', scription: ' ', icon: '/ziliaomanagment.png', id: '110006', num: 11, isShow: '1', isUse: '0'},
        {name: '参会统计', scription: 'statistics', icon: '/attendCensus.png', id: '110011', num: 12, isShow: '1', isUse: '1'},
        {name: '会务组报道', scription: 'report', icon: '/attendCensus.png', id: '110013', num: 12, isShow: '1', isUse: '0'},
      ],

      // 数据
      tableData: [],

      // el-dialog 
      addMeeting: false
    }
  },
  methods: {
    ...mapMutations([
      'setMeetingData'
    ]),
    // 选择会议功能
    meet_func(data, func){
      if(!func.scription.trim()){
        this.$message.info('暂不开放')
        return 
      }

      // 获取会议数据
      this.$http.get(this.API.singleMeeting(data.id))
      .then(res => {
        console.log(res)
        if(res.code == '000'){
          // 处理数据
          res.data.sponsorArrJsonStr = JSON.parse(res.data.sponsorArrJsonStr);
          res.data.contactJson = JSON.parse(res.data.contactJson);
          res.data.meetingProduce = JSON.parse(res.data.meetingProduce) 

          // 保存当前会议数据
          this.setMeetingData(res.data)

          this.$router.push({
            path: '/singleMeet',
            query: {
              meetingId: data.id,
              select: func.scription
            }
          })
        }
      })
    },
    // 显示logo
    imgIcon(url){
			return require('@/assets/images' + url)
		},
    // 新建单级会议 - 按钮
    single_stage(){
      // 清空 vuex 中的会议数据
      this.setMeetingData({})
      this.$router.push('/singleMeet')
    },
    // 新建多级会议 - 按钮
    multi_stage(){

    },
    // 选择 nav列表
    tab_list(index){
      this.navList.filter((item, idx) => idx == index ? item.select = true : item.select = false)
    },

    // 分页方法
    sizeChange(val){
      this.pageSize = val
    },
    curChange(val){
      this.pageNum = val
    },

    // 搜索按钮
    searchBtn(){
      this.getAllMeet()
    },

    // 获取全部会议
    getAllMeet() {
      this.$http.get(this.API.findMeetingById(this.pageNum, this.pageSize, this.searchKey))
        .then(res => {
          if(res.code == '000' && res.data){
            let curTime = new Date().getTime()
            res.data.filter(item => {
              if(item.beginDate < curTime && item.endDate > curTime){
                item.tips = item.releaseCode == 1 ? '进行中' : '未发布'
              } else if(item.endDate < curTime){
                item.tips = item.releaseCode == 1 ? '已结束' : '未发布'
              } else {
                item.tips = item.releaseCode == 1 ? '已发布' : '未发布'
              }

              item.beginTime = selfTime(item.beginDate, true)
              item.endTime = selfTime(item.endDate, true)
            })
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = res.total
          }
        })
    }
  },
  mounted() {
    // 获取全部会议
    this.getAllMeet()
  }
}
import addRoom from './addRoom/addRoom.vue' // 添加客房
import checkin from './checkin/checkin.vue'
import { mapState } from 'vuex'

export default {
  components: {
    addRoom,
    checkin
  },
  data() {
    return {
      // tree
      data: [
        // { id: 1, hotelName: '暮云酒店'}
      ],
      treeProps: { children: 'child', label: 'hotelName' },

      searchKey: '',

      // table
      height: null,
      tableData: [],
      tableCate: [
        { label: "酒店大楼", props: "hotelBuildingName", width: '' },
        { label: "房间号", props: "roomNumber", width: '100' },
        { label: "房间类型", props: "typeName", width: '120' },
        { label: "房间等级", props: "roomGrade", width: '120' }
      ],
      
      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      // 当前tree
      curTree: null,
      // 勾选的数据
      delRows: [],
      // 当前安排的客房
      curCheck: null,

      // 子组件 - 开关
      addRoom_child: false,
      checkin_child: false
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: {
    // 安排入住 - 单间
    btnSetCheckIn(data) {
      this.curCheck = data
      this.checkin_child = true
    },
    // 清空人员 - 单间
    btnClearUser(data) {
      if(data.invites && data.invites.length > 0){}
      else {
        this.$message.info('没有入住人员！')
        return 
      }
      
      this.$confirm('是否清空入住人员?', '提示', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.doBtnClearUser(data.invites)
      }).catch(() => {})
    },
    doBtnClearUser(person){
      let ids = []
      person.filter(item => ids.push(item.id))
      this.$http.post(this.API.singleRemoveRoom, ids)
        .then(res => {
          if(res.code == '000'){
            this.$message.success('已清空!')
            this.getAddRoom()
          } else {
            this.$message.error(res.msg)
          }
        })
    },

    // 搜索按钮
    searchBtn(){
      this.pageNum = 1
      console.log('触发')
    },
    // tree - 点击触发
    treeClick(data, node){
      // 只触发第三级
      if(node.level == 3){
        this.curTree = data
        this.getAddRoom()
      }
    },
    // tree - 树结构
    renderContent(h, { node, data, store }) {
      return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>)
    },

    // 表格勾选回调
    batchDel(val){
      this.delRows = val
    },

    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val

      this.getAddRoom()
    },
    curChange(val){
      this.pageNum = val

      this.getAddRoom()
    },
    // 添加客房
    addRoomBtn (){
      this.addRoom_child = true
    },
    // 一键安排入住
    onekeyCheckin(){
      this.$http.post(this.API.onekeyCheckin(this.meetingData.id))
        .then(res => {
          if(res.code == '000') {
            this.$message.success('入住成功！')
            this.getAddRoom()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    // 一键清空人员
    onekeyRemove(){
      this.$http.post(this.API.onekeyRemove(this.meetingData.id))
        .then(res => {
          if(res.code == '000') {
            this.$message.success('人员已清空!')
            this.getAddRoom()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    // 移除客房
    removeRoom(){
      if(this.delRows.length == 0) {
        this.$message.info('请勾选客房')
        return 
      }

      this.$confirm('是否删除选中的客房?', '提示', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.doRemoveRoom()
      }).catch(() => {})
    },
    doRemoveRoom() {
      let ids = []
      this.delRows.filter(item => ids.push(item.id))
      this.$http.post(this.API.removeRoom, ids)
        .then(res => {
          if(res.code == '000'){
            this.$message.success('移除成功！')
            this.getAddRoom()
          } else {
            this.$message.error(res.msg)
          }
        })
    },

    // 子组件 - 按钮
    addTo(){
      let child = this.$refs.addRoom
      , selectRoom = child.selectRoom
      , selectedData = child.selectedData
      , floorId = child.addRoomForm.floor
      , arr = []

      child.$refs.addForm.validate(ret => {
        if (ret) {
          selectRoom.filter(item => arr.push({
            ...selectedData,
            hotelRoomId: item.id,
            floorId
          }))

          this.$http.post(this.API.addListByMeetingId(this.meetingData.id), arr)
            .then(res => {
              if(res.code == '000'){
                this.$message.success('添加成功！')
                this.addRoom_child = false
                this.getHotels()
              } else {
                this.$message.error(res.msg)
              }
            })
        }
      })
    },
    addCheck() {
      let child = this.$refs.checkin,
        selectData = child.selectData,
        curCheck = this.curCheck,
        time = child.time

        if(!selectData){
          this.$message.error('请选择人员!')
          return 
        }
        if(!time){
          this.$message.error('请选择入住时间!')
          return 
        }
      let st = new Date(time[0]).getTime(),  
          et = new Date(time[1]).getTime(),
          param = {
            meetingId: selectData.meetingId,
            meetingInviteId: selectData.id,
            userId: selectData.userId,
            meetingHotelRoomId: curCheck.id,
            hotelRoomId: curCheck.hotelRoomId,
            hotelId: curCheck.hotelId,
            hotelBuildingId: curCheck.hotelBuildingId,
            floor: curCheck.floor
          }
      
      this.$http.post(this.API.singleRoomAddPerson(st, et), param)
        .then(res => {
          if(res.code == '000'){
            this.$message.success('添加成功！')
            this.checkin_child = false
            this.getAddRoom()
          } else {
            this.$message.error(res.msg)
          }
        })
      // singleRoomAddPerson
    },
    cancel() {
      this.checkin_child = false
      this.addRoom_child = false
    },


    // 获取酒店数据
    getHotels() {
      this.$http.get(this.API.findfloorAndRoomByMeetingId(this.meetingData.id))
        .then(res => {
          console.log(res)
          if(res.code == '000' && res.data) {
            res.data.filter((one, i) => {
              one.child.filter((two, index) => {
                two.child.filter((three, idx) => {
                  if(i == 0 && index == 0 && idx == 0) this.curTree = three
                  three.name = three.hotelName
                  three.hotelName = '第' + three.hotelName + '层'
                })
              })
            })
            this.data = res.data

            this.getAddRoom()
          } else {
            this.data = []
          }
        })
    },
    // 获取住房数据
    getAddRoom(){
      console.log(this.curTree)
      var roomGrade = ['普通套房', '豪华套房', '总统套房']
      this.$http.get(this.API.selectMeetingRoomByFloorId(this.curTree.id, this.pageNum, this.pageSize))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter(item => {
              item.typeName = item.hotelRoomType == 1 ? '单人房' : '双人房'
              item.roomGrade = roomGrade[item.hotelRoomGrade]

              // 是否有入住人员
              if(item.invites){
                var personStr = ``
                item.invites.filter((child, index, total) => {
                  personStr += child.userName + ` ( ${child.sex} )`
                  index == (total.length - 1) ? '' : personStr += `, `
                })
                item.personStr = personStr
              } else {
                item.personStr = '暂无入住人员'
              }
            })
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    },
  },
  mounted() {
    // 获取表格高度
    var dom = document.querySelector('.table-child')
    this.height = dom.offsetHeight
    
    // 获取酒店数据
    this.getHotels()
  }
}
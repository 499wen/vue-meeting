import dispose from './dispose/dispose.vue'
import sendRecord from './sendRecord/sendRecord.vue'
import $ from 'jquery'
import { mapState, mapMutations } from 'vuex'
 
export default {
  components: {
    dispose,
    sendRecord
  },
  data() { 
    return {
      test: '1',
      // table
      height: null,
      tableData: [],
      tableCate: [
        {props: 'groupName', label: '短信类型', width: ''}
      ],

      style: {},

      // 全体参会人  其余参会人
      allData: {},
      data: [],

      // 选中的row 整条数据
      smsRow: '',

      // 子级组件开关
      dispose_child: false,
      sendRecord_child: false
    }
  },
  computed: {
    ...mapState([
      'meetingData',
      'attendeeData'
    ])
  },
  methods: {
    // vuex 设置参会人数据
    ...mapMutations([
      'setAttendeeData'
    ]),
    // 发送记录
    sendRecord() {
      this.sendRecord_child = false
    },
    // 短信配置
    dispose() {
      this.dispose_child = true
    },

    // 选择全体参会人
    all(item){
      if(item.allData.is_select){
        item.data.filter(item => item.is_select = false)
      }
    },
    // 其他参会人
    single(item, idx){
      if(item.data[idx].is_select){
        item.allData.is_select = false
      }
    },

    // 保存短信
    determine(){
      // 提交数据， 短信选中数据， 参会人选中数据
      let saveData = [], smsList = [], person = []

      this.tableData.filter(item => {
        // 获取参会人数据
        if(item.allData.is_select){
          person.push(item.allData)
        } else {
          item.data.filter(i => i.is_select && person.push(i))
        }

        // 获取短信数据
        item.meetingSMSCenters.filter(i => i.select && smsList.push(i))
      })
      // 判断是否有勾选
      if(smsList.length == 0){
        this.$message.info('请选择短信！')
        return 
      }
      if(person.length == 0) {
        this.$message.info('请选择分组！')
        return 
      }

      // 合成数据
      smsList.filter(item => {
        person.map(i => {
          if(item.groupId == i.groupId){
            saveData.push({
              confereeGroupId: i.id,
              smsTemplateId: item.id,
              triggerCondition: item.triggerCondition,
              triggerTime: item.triggerTime,
              triggerTimeMigrationAmount: item.triggerTimeMigrationAmount
            })
          }
        })
      })

      if(saveData.length == 0) {
        this.$message.info('请根据对应关系选择！')
        return 
      }

      console.log(JSON.stringify(saveData, false, 2))
      this.$http.post(this.API.saveSmsByMeetingId(this.meetingData.id), saveData)
        .then(res => {
          console.log(res)
          if(res.code == '000') {
            this.$message.success('添加成功!')
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    // 获取短信
    getSms() {
      let map = new Map(), groupName, smsArr = []
      this.$http.get(this.API.findAllSms(1, 999))
        .then(res => {
          if(res.code == '000' && res.data) {
            res.data.filter(item => {
              groupName = map.get(item.groupName)
              if(groupName){
                groupName.push(item)
                map.set(item.groupName, groupName)
              } else {
                map.set(item.groupName, [item])
              }
            })

            console.log(map)
            map.forEach((val, key) => {
              smsArr.push({

              })
            })
          }
        })
    },
    // 获取短信类型 
    getSmsType(){
      this.$http.get(this.API.findSelectSmsAndAll(this.meetingData.id))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter(item => {
              item.allData = JSON.parse(JSON.stringify(this.allData))
              item.data = JSON.parse(JSON.stringify(this.data))

              // 制造新数据
              item.allData.groupId = item.gid
              if(item.confereeGroupIds && item.confereeGroupIds.includes(item.allData.id)) {
                item.allData.is_select = true
              }
              item.data.filter(i => {
                if(item.confereeGroupIds && item.confereeGroupIds.includes(i.id)) {
                    i.is_select = true
                }

                // 制造新数据
                i.groupId = item.gid
              })

              // 制造新数据
              item.meetingSMSCenters.filter(i => {
                i.groupId = item.gid
                i.select = i.smsIsUse == 1 ? true : false
              })
            })
            this.tableData = res.data
          } else {
            this.tableData = []
          }

          console.log(this.tableData)
        })
    },

    // 子组件方法
    cancel() {
      this.dispose_child = false
      this.sendRecord_child = false
    },

    // 获取参会人
    getAtten(){
      // 调用接口获取数据 并更新vuex数据
      this.$http.get(this.API.getConfereeGroupAll(this.meetingData.id))
      .then(res => {
        if(res.code == '000' && res.data) {
          // 手动补充属性 children
          res.data.filter(item => item.children = [])
          this.setAttendeeData(res.data)
          this.handleGroup()

          // 获取短信
          this.getSmsType()
        }
      })
      
    },

    // 处理参会人分组数据
    handleGroup(){
      this.attendeeData.filter(item => {
        item.is_select = false
        if(item.confereeGroupName == '全体参会人'){
          item.is_select = false
          this.allData = item
        } else {
          this.data.push(item)
        }
      })
    }
  },
  created() {
    // 获取参会人数据 判断 vuex 中attendeeData不存在数据
    if(this.attendeeData) {
      this.handleGroup()
    } else {
      this.getAtten()
    }
  },
  mounted() {
    // 获取表格高度
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight
    
    // this.getSms()

    // 获取短信
    this.getSmsType()
    console.log(this.attendeeData)
  }
}
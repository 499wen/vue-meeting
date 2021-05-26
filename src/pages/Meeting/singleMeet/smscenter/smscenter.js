import dispose from './dispose/dispose.vue'
import sendRecord from './sendRecord/sendRecord.vue'
import addsms from './addsms/addsms.vue'
import { mapState, mapMutations } from 'vuex'
import { toTree, exportToExcel, Load } from '@/plugins/plugins.js'
 
export default {
  components: {
    dispose,
    sendRecord,
    addsms
  },
  data() { 
    return {
      test: '1',
      // table
      height: null,
      tableData: [],
      tableCate: [
        {props: 'groupName', label: '短信类型', width: ''},
        {props: 'title', label: '短信名称', width: ''},
      ],
      // 表格选中的数据
      batchData: [],
      // tree
      data: [
        { id: 1, label: '全体参会人',
          children: []
        }
      ],
      treeProps: {
        children: 'children',
        label: 'confereeGroupName'
      },

      style: {},

      // 当前选择 参会组
      curAttenGroup: {},

      // 选中的row 整条数据
      smsRow: '',

      // 子级组件开关
      dispose_child: false,
      sendRecord_child: false,
      addsms_child: false
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: {
    // tree - 树结构
    renderContent(h, { node, data, store }) {
      let html = (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>)

      return html;
    },
    // tree - 点击触发
    treeClick(data, node){
      this.curAttenGroup = data
      
      // 查询短信
      this.getSmsType()
    },
    // 发送记录
    sendRecord() {
      this.sendRecord_child = true
    },
    // 短信配置
    dispose() {
      this.dispose_child = true
    },
    batchDel(data) {
      this.batchData = data
    },
    // 移除短信
    removeSms() {
      let ids = [], batchData = this.batchData
      if(batchData.length == 0) {
        this.$message.error('请选择短信!')
        return 
      }

      batchData.filter(item => ids.push(item.cid))

      this.$confirm('是否移除选中的短信?', '提示', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.API.delectSmsByGroupId, ids)
        .then(res => {
          if(res.code == '000'){
            this.$message.success('移除成功！')
            this.getSmsType()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
      
    },

    // 添加短信
    addSms() {
      this.addsms_child = true
    },

    // 保存短信
    determine(){
      // 提交数据， 短信选中数据， 参会人选中数据
      let child = this.$refs.addsms, 
      saveData = [], smsList = []

      child.tableData.filter(item => {
        // 获取短信数据
        item.meetingSMSCenters.filter(i => i.select && smsList.push(i))
      })

      // 判断是否有勾选
      if(smsList.length == 0){
        this.$message.info('请选择短信！')
        return 
      }

      // 合成数据
      smsList.filter(item => {
        saveData.push({
          confereeGroupId: this.curAttenGroup.id,
          smsTemplateId: item.id,
          triggerCondition: item.triggerCondition,
          triggerTime: item.triggerTime,
          triggerTimeMigrationAmount: item.triggerTimeMigrationAmount
        })
      })

      console.log(JSON.stringify(saveData, false, 2), this.curAttenGroup.id)
      // return 
      this.$http.post(this.API.saveSmsByMeetingId(this.meetingData.id, this.curAttenGroup.id), saveData)
        .then(res => {
          console.log(res)
          if(res.code == '000') {
            this.$message.success('添加成功!')
            this.addsms_child = false
            this.getSmsType()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    // 获取短信
    getSms() {
      return
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
    // 获取短信
    getSmsType(){
      this.$http.get(this.API.findAddSmsByGroupId(this.curAttenGroup.id))
        .then(res => {
          if(res.code == '000' && res.data){
            let obj = res.data, data = []
            for(let i in obj){
              data.push(...obj[i])
            }
            this.tableData = data
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
      this.addsms_child = false
    },

    // 获取参会人分组
    getAttenGroup() {
      this.$http.get(this.API.getConfereeGroupAll(this.meetingData.id))
        .then(res => {
          if(res.code == '000' && res.data) {
            // 手动补充属性 children
            res.data.filter(item => item.children = [])
            this.data = toTree(res.data)
            this.curAttenGroup = this.data[0]
            
            // 获取短信
            this.getSmsType()
            setTimeout(() => {
              this.$refs.smsTree.setCurrentKey(this.meetingData.id)
            }, 500)
          }
        })
    },
  },
  created() {
  },
  mounted() {
    // 获取表格高度
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight
    
    // 获取参会人
    this.getAttenGroup()

    // // 获取短信
    // this.getSmsType()
    // console.log(this.attendeeData)
  }
}
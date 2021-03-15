import hoverTable from './hoverTable/hoverTable.vue'
import $ from 'jquery'
import { mapState, mapMutations } from 'vuex'
 
export default {
  components: {
    hoverTable
  },
  data() {
    return {
      // table
      height: null,
      tableData: [],
      tableCate: [
        {props: 'groupName', label: '短信类型', width: ''}
      ],

      style: {},
      hoverBool: false,

      // 全体参会人  其余参会人
      allData: null,
      data: [],

      // 选中的row 整条数据
      smsRow: ''
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
    // 子组件更新 选中短信
    updateData(data){
      let oldData
      this.tableData.filter(item => item.typeCode == this.smsRow.typeCode ? oldData = item.meetingSMSCenters : '')

      for(let i = 0; i < data.length; i ++){
        for(let j = 0; i < oldData.length; j ++){
          if(data[i] == oldData[j].id){
            oldData[j].smsIsUse = 1
            break;
          }
        }
      }
    },
    // 鼠标移动表格中
    mouseTable(row, column, cell){
      console.log(row, this.hoverBool)
      // 防止重复触发
      if(this.hoverBool) return 
      this.smsRow = row
      
      cell.parentNode.onmousemove = (e) => {
        let parent = $(cell.parentNode),
          widowHeight = $(document).height(),
          top = parent.offset().top + parent.height(),
          bottom = widowHeight - parent.offset().top
        
        // 显示子短信
        this.hoverBool = true
 
        /**
         * 触摸table-row
         *    默认
         *      box向下显示
         * 
         *    接近window底部   
         *      box向上显示
         */
        if(widowHeight - top > 450){
          this.style = {
            'top': (top) + 'px',
            'width': parent.width() + 'px',
            'max-height': (widowHeight - top) + 'px',
          }
        } else {
          this.style = {
            'bottom': (bottom) + 'px',
            'width': parent.width() + 'px',
          }
        }
      }
      
      /**
       * contains:
       *   判断dom包含关系
       */
      cell.parentNode.onmouseout = (e) => {
        if((e.toElement && e.toElement.getAttribute("class") != 'sms-table') && !cell.parentNode.contains(e.toElement)){
          this.hoverBool = false
        }
      }

      // 获取子集短信 dom
      let childSms = $('.sms-table')[0]
      childSms.onmouseout = (e) => {
        let obj = e.toElement || e.relatedTarget
        if(!childSms.contains(obj)){
          this.hoverBool = false
        }
      }

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
        item.meetingSMSCenters.filter(i => i.smsIsUse && smsList.push(i))
      })
      // 判断是否有勾选
      if(smsList.length == 0){
        this.$message.info('请选择短信！')
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

      console.log(JSON.stringify(saveData, false, 2))
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
              item.meetingSMSCenters.filter(i => i.groupId = item.gid)
            })
            this.tableData = res.data
          } else {
            this.tableData = []
          }

          console.log(this.tableData)
        })
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
          item.is_select = true
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
    
    // 获取短信
    this.getSmsType()
    console.log(this.attendeeData)
  }
}
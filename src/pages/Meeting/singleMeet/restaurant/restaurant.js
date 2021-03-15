import { selfTime } from '@/plugins/plugins.js'
import { mapState } from 'vuex'

// 获取餐厅配置
function Ct(type, date){
  var cateringBeginDate, cateringEndDate
  if(type == 'breakfast'){
    cateringBeginDate = date + 6*60*60*1000 // 6点
    cateringEndDate = date + 8*60*60*1000 // 8点
  } else if(type == 'lunch'){
    cateringBeginDate = date + 11*60*60*1000 // 11点
    cateringEndDate = date + 13*60*60*1000 // 13点
  } else if(type == 'dinner'){
    cateringBeginDate = date + 18*60*60*1000 // 18点
    cateringEndDate = date + 20*60*60*1000 // 20点
  }
  return {
    cateringBeginDate,
    cateringEndDate,  // cateringEndDate
    ct: [ 
      {
        person: [],
        info: '已选择0人', 
        rest: ''
      }
    ], 
  }
}

// 获取某日三餐配置
function Tmeals(n = 0, date = new Date(new Date().toLocaleDateString()).getTime()){
  date += 24*60*60*1000 * n
  
  return {
    date, // 时间
    eat: {
      breakfast: true,
      lunch: true,
      dinner: true
    }, // 吃
    breakfast: new Ct('breakfast', date),  // 早餐
    lunch: new Ct('lunch', date),  // 午餐
    dinner: new Ct('dinner', date),  // 晚餐
  }
}

export default {
  data() {
    return {
      card: [
        new Tmeals
      ],

      a: '已选择0人',

      addPersonBox: false,
      radio: '1',
      group: [],
      groupVal: '',
      input3: '',
      tableData: [],
      tableData1: [],
      tableCate: [
        {name: '姓名', description: 'userName'},
        {name: '电话', description: 'phone'},
        {name: '部门', description: 'departmentName'},
      ],
      chrId: '', // 参会人树状id,
      pageNum: 1,
      ctList: [],
      curPerson: [],
      curPerson1: [],

      pidx: '', 
      cidx: '',
      can: '',
      rest: '',

      requestApi: false, // 是否有请求数据
      meetIsEnd: false, 

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= (Date.now() - 3600 * 24 * 1000);
        },
      },
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: {
    // 处理时间
    formatDate(date) {
      if(typeof date != 'number'){
          return ''
      }
  
      date = new Date(date);
      var h = date.getHours();
      var m1 = date.getMinutes(); 
      var s = date.getSeconds();
      h = h < 10 ? ("0" + h) : h;
      m1 = m1 < 10 ? ("0" + m1) : m1;
      s = s < 10 ? ("0" + s) : s;
  
      return h + ":" + m1 + ":" + s
    },
    // 获取当前时间
    getCurTime(time){
      // 当天0时 时间戳
      var ling = new Date(new Date().toLocaleDateString()).getTime()
      if(time == ling){
        return this.formatDate(new Date().getTime(), false) + ' - 23:59:59' 
      }

      return '00:00:00 - 23:59:59'
    },
    // 时间过期 - 禁用
    disabled(time){
      return time < new Date(new Date().toLocaleDateString()).getTime()
    },
    upadteTime(time, item){
      console.log(time,item)
      item.date = new Date(time).getTime()

      console.log(this.card)
    },
    // 选择餐厅 - 不可重复选择
    selectCh(can, pidx, cidx){
      var arr = [], curData = this.card[pidx][can].ct[cidx].rest
      this.card[pidx][can].ct[cidx].rest = ''
      this.card[pidx][can].ct.filter(item => arr.push(item.rest))
      
      if(arr.includes(curData)){
        this.$message.info('不能重复选择餐厅！')
        return 
      }
      this.card[pidx][can].ct[cidx].rest = curData
    },
    // 选择参会人 - 树 
    personCha(data){
      this.getChrPerson(data)
    },
    // 打开人员框 
    handleIconClick(item, can, pidx, cidx){
      if(!this.card[pidx][can].ct[cidx].rest){
        this.$message.error('请选择餐厅!')
        return 
      }

      this.pidx = pidx
      this.cidx = cidx
      this.can = can
      this.tableData = JSON.parse(JSON.stringify(item.person))
 
      console.log('diani', this.chrId)
      this.addPersonBox = true
      this.getChrPerson(this.chrId)
    },

    // 获取参会人 - 人员
    getChrPerson(id){ 
      this.$http.get(this.API.findByMeetingIdAndPage(id, this.pageNum, 999))
          .then(res => {
            if(res.code == '000'){
              var obj = new Map()
              this.tableData1 = []
              this.tableData.filter(item => obj.set(item.userId, item))

              res.data.filter(item => {
                var o = {
                  userId: item.userId,
                  meetingInviteId: item.id,
                  phone: item.phone,
                  departmentName: item.departmentName,
                  userName: item.userName
                }
                if(!obj.get(item.userId)){
                  this.tableData1.push(o)
                } else {
                  if(!obj.get(item.userId).userName){
                    obj.set(item.userId, o)
                    this.tableData = []
                    obj.forEach((value, key) => {
                      this.tableData.push(value)
                    })
                  }
                }
              })
            }
          })
    },
    // 移除人员
    removePerson(){
      var obj = new Map(), arr = []
      this.tableData.filter((item, idx) => {
        obj.set(item.userId, item)
      })
      this.curPerson.filter(item => obj.delete(item.userId))

      obj.forEach(function(value,key){
        arr.push(value)
      });
      // 给左边更新数据
      this.tableData = arr
      // 给右边添加数据
      this.tableData1.push(...this.curPerson)
    },
    // 添加人员
    addPerson(){
      var obj = new Map(), arr = []
      this.tableData1.filter((item, idx) => {
        obj.set(item.userId, item)
      })
      this.curPerson1.filter(item => {
        obj.delete(item.userId)
      })
      obj.forEach(function(value,key){
        arr.push(value)
      });
      console.log(arr)
      // 给左边更新数据
      this.tableData1 = arr
      // 给右边添加数据
      this.tableData.push(...this.curPerson1)
    },
    // 保存人员
    savePerson(){
      this.card[this.pidx][this.can].ct[this.cidx].person = this.tableData
      this.card[this.pidx][this.can].ct[this.cidx].info = `已选择${this.tableData.length}人`

      console.log(this.tableData)
      this.addPersonBox = false
    },
    handleSelectionChange(val){
      this.curPerson = val
    },
    handleSelectionChange1(val){
      this.curPerson1 = val
    },
    toStr(arr){
      arr.filter(item => item = JSON.stringify(item))
      return arr
    },
    // 移除餐厅 - 早餐
    removeBreakfast(idx){
      console.log('早餐')
      var lang = this.card[idx].breakfast.ct.length
      console.log(lang)
      if(lang){
        this.card[idx].breakfast.ct.splice(lang - 1, 1)
      }
    },
    // 移除餐厅 - 午餐
    removeLunch(idx){
      console.log('午餐')
      var lang = this.card[idx].lunch.ct.length
      console.log(lang)
      if(lang){
        this.card[idx].lunch.ct.splice(lang - 1, 1)
      }
    },
    // 移除餐厅 - 晚餐
    removeDinner(idx){
      console.log('晚餐')
      var lang = this.card[idx].dinner.ct.length
      console.log(lang)
      if(lang){
        this.card[idx].dinner.ct.splice(lang - 1, 1)
      }
    },

    // 添加餐厅 - 早餐
    addBreakfast(idx){
      console.log('早餐')
      this.card[idx].breakfast.ct.push({
        person: [],
        info: '已添加0人',
        rest: ''
      })
    },
    // 添加餐厅 - 午餐
    addLunch(idx){
      console.log('午餐')
      this.card[idx].lunch.ct.push({
        person: [],
        info: '已添加0人',
        rest: ''
      })
    },
    // 添加餐厅 - 晚餐
    addDinner(idx){
      console.log('晚餐')
      this.card[idx].dinner.ct.push({
        person: [],
        info: '已添加0人',
        rest: ''
      })
    },
    // 添加新的一天餐厅
    addMeals(){
      // 没有数据 什么都是白给
      if(this.card.length){
        // 获取最后一天时间
        var lastTime = this.card[this.card.length - 1].date
        console.log(lastTime)
        if(false){
          // 不复制
          this.card.push(new Tmeals(this.card.length, lastTime))
        } else {
          // 复制
          var obj = JSON.parse(JSON.stringify(this.card[this.card.length - 1]))
          obj.date += 3600 * 24 * 1000
          this.card.push(obj)
        }
      } else {
        this.card.push(new Tmeals)
      }
    },
    
    // 处理时间戳
    setTimeC(date, curDate = 0){
      return new Date(date).getTime() + curDate
    },

    // mockData 模拟数据
    mockData(item, meal, obj, date, bool){
      if(!bool) return false
      var arr = []
      item.person.filter(i => {
        arr.push({
          userId: i.userId,
          phone: i.phone,
          meetingInviteId: i.meetingInviteId
        })
      })
      if(typeof obj.cateringBeginDate != 'number') obj.cateringBeginDate = new Date(obj.cateringBeginDate).getTime()
      if(typeof obj.cateringEndDate != 'number') obj.cateringEndDate = new Date(obj.cateringEndDate).getTime()

      // 根据每日的时间 更新时间戳
      // console.log(obj.cateringBeginDate, new Date(new Date(obj.cateringBeginDate).toLocaleDateString()).getTime(), date )
      obj.cateringBeginDate = obj.cateringBeginDate - new Date(new Date(obj.cateringBeginDate).toLocaleDateString()).getTime() + date 
      obj.cateringEndDate = obj.cateringEndDate - new Date(new Date(obj.cateringEndDate).toLocaleDateString()).getTime() + date 
      console.log('obj.cateringEndDate--', selfTime(obj.cateringEndDate))
      var obj = {
        "restaurantId": item.rest, // 餐饮id
        "meal": meal, // 0 1 2 - 早中晚
        "meetingId": this.meetingId, // 会议id
        "cateringBeginDate": obj.cateringBeginDate,
        "cateringEndDate": obj.cateringEndDate,
        "diningInformationUserList": arr
      }
      // console.log(this.requestApi, item.id)
      this.requestApi ? obj.id = item.id : ''
      return obj
    },

    // 处理回显数据
    handleEcho(item, o){
      var obj = {
        id: item.id,
        rest: item.restaurantId,
        info: '已选择0人',
        person: []
      }
      if(item.persons && item.persons.length){
        obj.person = item.persons
        obj.info = `已选择${obj.person.length}人`
      }
      if(item.meal == '0'){
        // 早餐
        o.breakfast.cateringBeginDate = item.cateringBeginDate
        o.breakfast.cateringEndDate = item.cateringEndDate
        o.eat.breakfast = true
        if(!o.breakfast.ct[0].id) o.breakfast.ct = []

        o.breakfast.ct.push(obj)
      } else if(item.meal == '1'){
        // 午餐
        o.lunch.cateringBeginDate = item.cateringBeginDate
        o.lunch.cateringEndDate = item.cateringEndDate
        o.eat.lunch = true
        if(!o.lunch.ct[0].id) o.lunch.ct = []

        o.lunch.ct.push(obj)
      } else if(item.meal == '2'){
        // 晚餐
        o.dinner.cateringBeginDate = item.cateringBeginDate
        o.dinner.cateringEndDate = item.cateringEndDate
        o.eat.dinner = true
        if(!o.dinner.ct[0].id) o.dinner.ct = []

        o.dinner.ct.push(obj)
      }
      
      return o
    },
    // 保存
    prese(){
      var card = this.card, arr = []
      console.log(this.card)
      card.filter(item => {
        // 处理时间戳
        item.date = item.date && this.setTimeC(item.date)
        // item.breakfast.cateringBeginDate = item.breakfast.cateringBeginDate && this.setTimeC(item.breakfast.cateringBeginDate, item.date)
        // item.breakfast.cateringEndDate = item.breakfast.cateringEndDate && this.setTimeC(item.breakfast.cateringEndDate, item.date)
        // 早餐
        item.breakfast.ct.filter((i, idx, obj) => {
          arr.push(this.mockData(i, '0', item.breakfast, item.date, item.eat.breakfast))
        })
        // 午餐
        item.lunch.ct.filter((i, idx, obj) => {
          arr.push(this.mockData(i, '1', item.lunch, item.date, item.eat.lunch))
        })
        // 晚餐
        item.dinner.ct.filter((i, idx, obj) => {
          arr.push(this.mockData(i, '2', item.dinner, item.date, item.eat.dinner))
        })
      })

      arr = arr.filter(item => item)
      console.log(arr)
      // return 
      if(this.requestApi){
        this.$http.post(this.API.updateCatering, arr)
        .then(res => {
          if(res.code == '000'){
            console.log(res)
            this.$message.success('保存成功！')
            this.initPage()
          }
        })
      } else {
        this.$http.post(this.API.saveCatering, arr)
            .then(res => {
              if(res.code == '000'){
                console.log(res)
                this.$message.success('保存成功！')
                this.initPage()
              }
            })
      }
    },
    // 初始化数据
    initPage (){
      this.meetingId = this.meetingData.id

      this.$http.get(this.API.selectCateringByMeetingId(this.meetingId))
      .then(res => {
        console.log(res)
        if(res.code == '000' && res.data && res.data.length){
          var obj = new Map()
          this.requestApi = true
          // 区分同一天的数据
          res.data.filter(item => {
            item.dayC = new Date(new Date(item.cateringBeginDate).toLocaleDateString()).getTime()
          })
  
          // 处理数据回显
          res.data.filter(item => {
            if(!obj.get(item.dayC)){
              var o = Tmeals(0, item.dayC)
              o.eat = {
                breakfast: false,
                lunch: false,
                dinner: false
              }
  
              obj.set(item.dayC, this.handleEcho(item, o))
            } else {
              var o = obj.get(item.dayC)
  
              obj.set(item.dayC, this.handleEcho(item, o))
            }
          })
          this.card = []
          obj.forEach((value, key) => {
            this.card.push(value)
          })
        }
      })

      this.getCtList()
      this.getChrData()
    },
    // 获取参会人
    getChrData(){
      // 参会人 - 树
      this.$http.get(this.API.getConfereeGroupAll(this.meetingId))
          .then(res => {
            console.log(res)
            if(res.code == '000'){
              res.data.filter(item => {
                if(item.confereeGroupName == '全体参会人'){
                  this.chrId = item.id
                }
              })
              this.group = res.data
              this.groupVal = '全体参会人'
            }
          })
    },
    // 获取餐厅列表
    getCtList(){
      this.$http.get(this.API.selectRestaurantAll(1, 9999, ''))
      .then(res => {
        console.log(res)
        if(res.code == '000'){
          // res.data.filter(item => this.ctList = item)
          // res.data.filter((item, idx)=> item.restaurantName += idx )
          this.ctList = res.data
        }
      })
    },
    // 监听
    eat(val, item){

      var arr = [], card = this.card 
      card.filter((item, idx) => {
        var eat = item.eat

        // 记录要删除 下标
        if(!eat.breakfast && !eat.lunch && !eat.dinner){
          arr.push(idx)
        }
        if(idx != 0){
        } else {
    
          if((!eat.breakfast && !eat.lunch) || (!eat.breakfast && !eat.dinner) || (!eat.lunch && !eat.dinner)){
            this.$message
            return 
            this.$confirm('是否清空所有餐厅！', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              arr.push(idx)
            })
          }
          
        }

      })

      console.log(arr)
      for(let i = 0; arr.length && i < arr.length; i++){
        card.splice(arr[i], 1)
        break;
      }
    }
  },
  created() {
    this.initPage()
  },
  mounted() {
    this.getChrData()
    // this.card[0].lunch.ct = []
  },
  // 监听
  watch: {
    'card': function(val){
      var arr = []
      val.filter((item, idx) => {
        var eat = item.eat
        if(!eat.breakfast && !eat.lunch && !eat.dinner){
          arr.push(idx)
        }
      })

      console.log(arr)
    }
  }
}
import conditionGroup from '../conditionGroup/conditionGroup.vue'
import { dataScrollLoad } from '@/plugins/plugins.js'
import { mapState } from 'vuex'

export default {
  props: ['groupId'],
  components: {
    conditionGroup
  },
  data() {
    return {
      // table
      height: null,
      tableData: [],
      tableCate: [
        {props: 'userName', label: '姓名', width: ''},
        {props: 'phone', label: '手机号', width: ''},
        {props: 'departmentName', label: '部门', width: ''},
        {props: 'characterId', label: '角色', width: ''},
        {props: 'type', label: '人员类型', width: ''},
        {props: 'attribute1', label: '组别', width: ''}, 
      ],

      // 分页
      total: 0,
      pageNum: 1, 
      pageSize: 500,

      // 获取人员参数 
      photoFlag: 2, // 0有头像 1 无头像人员 2 全部
      externalCode: 'all', // all 公司下 external 外部 internal 内部下部门
      deparmentId: '', // 部门id
      searchKey: '',
      type: '全部人员', 

      // 选中的table数据
      selectData: [],

      // 条件组数据
      condiData: [],
      queryConditionArr: [],

      // 子集组件开关
      condi_child: false,

      // 勾选全部数据
      allData: false
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  
  methods: {
    // 选中全部
    chioceAll() {
      if(this.allData) {
        // 去除表单选中
        this.$refs.multipleTable.clearSelection();
        this.allData = true

        let obj = {
          contanUserIdArr: [],
          ifContanUserIdArr: false,
          queryConditionArr: this.queryConditionArr
        }, api
        if(this.groupId == this.meetingData.id) {
          api = this.API.findMeetingEnableInviteUser(this.meetingData.id, this.pageNum, 9999999, this.searchKey, this.externalCode)
        } else {
          let externalCode 
          switch(this.externalCode) {
            case 'all' : externalCode = '2'; break;
            case 'internal' : externalCode = '0'; break;
            case 'external' : externalCode = '1'; break;
          }
          api = this.API.findByMeetingIdAndPage(this.meetingData.id, this.meetingData.id, this.pageNum, 9999999, this.searchKey, externalCode, 'ok')
        }
        this.$http.post(api, obj)
          .then(res => {
            if (res.code == "000") {
              this.selectData = res.data
            }
            
          })
      }
    },
    // 自定义条件 
    custom(){ 
      this.condi_child = true
    },
    // 选中人员类型
    personType(info) {
      this.type = info
      switch(info) {
        case '全部人员' : this.externalCode = 'all'; break;
        case '内部人员' : this.externalCode = 'internal'; break;
        case '外部人员' : this.externalCode = 'external'; break;
      }

      this.getProson()
    },
    // 选中条件组
    clickCondi(idx){
      let item = this.condiData[idx]
      // 判断是否全体参会人  添加人员
      if(this.meetingData.id == this.groupId) {
        item.condition.filter(item => item.value == '部门' ? item.fieldName = 'oldDepartmentName' : '')
      } else {
        item.condition.filter(item => item.value == '部门' ? item.fieldName = 'departmentName' : '')
      }
      this.queryConditionArr = item.condition
      this.getProson()
    },
    // table 勾选添加
    batchAdd(select){
      // console.log(select)
      this.allData = false
      this.selectData = select
    },
    // 搜索按钮
    searchBtn(){
      this.getProson()
    },
    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val
      this.getProson()
    },
    curChange(val){
      this.pageNum = val
      this.getProson()
    },

    // 子集组件方法
    addTo(){

    },
    cancel(){
      this.condi_child = false
      this.getCondi()
    },

    // 获取人员
    getProson() {
      let obj = {
        contanUserIdArr: [],
        ifContanUserIdArr: false,
        queryConditionArr: this.queryConditionArr
      }, api
      if(this.groupId == this.meetingData.id) {
        api = this.API.findMeetingEnableInviteUser(this.meetingData.id, this.pageNum, this.pageSize, this.searchKey, this.externalCode)
      } else {
        let externalCode 
        switch(this.externalCode) {
          case 'all' : externalCode = '2'; break;
          case 'internal' : externalCode = '0'; break;
          case 'external' : externalCode = '1'; break;
        }
        api = this.API.findByMeetingIdAndPage(this.meetingData.id, this.meetingData.id, this.pageNum, this.pageSize, this.searchKey, externalCode, 'ok')
      }
      this.$http.post(api, obj)
        .then(res => {
          if (res.code == "000") {
            res.data.filter(item => item.type = item.externalCode == '0' ? '内部人员' : '外部人员')
            this.total = res.total
            this.tableData = res.data
          } else {
            this.total = 0;
            this.tableData = [];
          }
        }).catch(err => {
          this.total = 0;
          this.tableData = [];
        })
      
      
    },

    // 获取条件组 数据
    getCondi() {
      this.$http.get(this.API.selectConditionGroup('adduser'))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter(item => item.condition = JSON.parse(item.condition))
            this.condiData = res.data
          }
        })
    }
  },
  mounted() {
    // 表格高度
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取公司信息
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    this.deparmentId = this.loginInfo.companyId

    // 获取人员数据
    this.getProson()

    // 获取条件组数据
    this.getCondi()
  }
}
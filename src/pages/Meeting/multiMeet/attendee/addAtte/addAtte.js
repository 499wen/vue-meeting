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
        {props: 'attribute1', label: '组别', width: ''}, 
      ],

      // 分页
      total: 0,
      pageNum: 1, 
      pageSize: 100,

      // 获取人员参数 
      photoFlag: 1, // 1 无头像人员 2 有头像
      externalCode: '', // '' 公司下 1 内部与外部 0内部下部门
      deparmentId: '', // 部门id
      searchKey: '',

      // 选中的table数据
      selectData: [],

      // 条件组数据
      condiData: [],
      queryConditionArr: [],

      // 子集组件开关
      condi_child: false
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: {
    // 自定义条件 
    custom(){ 
      this.condi_child = true
    },
    // 选中条件组
    clickCondi(idx){
      let item = this.condiData[idx]
      this.queryConditionArr = item.condition
      this.getProson()
    },
    // table 勾选添加
    batchAdd(select){
      // console.log(select)
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
      }, api, parentMeetingId

      // 一级会议
      if(!this.meetingData.parentMeetingId){
        api = this.API.conditionQuerys(this.deparmentId, this.pageNum, this.pageSize, this.externalCode, this.searchKey, this.photoFlag)
        this.$http.post(api, obj)
        .then(res => {
          this.hdPerson(res)
        }).catch(err => {
          this.total = 0;
          this.tableData = [];
        })
      } else {
        // 子级会议
        parentMeetingId = this.meetingData.parentMeetingId
        api = this.API.findByMeetingIdAndPage(parentMeetingId, this.pageNum, this.pageSize)
        this.$http.post(api, obj)
        .then(res => {
          this.hdPerson(res)
        }).catch(err => {
          this.total = 0;
          this.tableData = [];
        })
      }
      
    },
    // 人员数据处理
    hdPerson(res){
      if (res.code == "000") {
        let data = res.data;

        // 二次分页处理
        let table_scroll = document.querySelector('.addAtte .el-table__body-wrapper')
        this.total = res.count || res.total
        dataScrollLoad(table_scroll, data, 1, 30, (res) => {
          this.tableData = res
        })

      } else {
        this.total = 0;
        this.tableData = [];
      }
    },

    // 获取条件组 数据
    getCondi() {
      this.$http.get(this.API.selectConditionGroup('adduser'))
        .then(res => {
          console.log(res)
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
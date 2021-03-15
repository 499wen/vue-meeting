// import { mapState } from 'vuex'

let properties = [
  {
    value: 'userName',
    lable: '姓名',
  },
  {
    value: 'sex',
    lable: '性别',
  },
  {
    value: 'phone',
    lable: '手机号',
  },
  {
    value: 'email',
    lable: '电子邮箱',
  },

  {
    value: 'oldDepartmentName',
    lable: '部门',
  },
  {
    value: 'ranksId',
    lable: '级别',
  },
  {
    value: 'duties',
    lable: '职务',
  },
  {
    value: 'characterId',
    lable: '角色',
  },
  {
    value: 'attribute1',
    lable: '组别',
  },

  // {
  //     value:'type',
  //     lable:'类别',
  // },
  // {
  //     value:'attribute1',
  //     lable:'属性1',
  // },
  // {
  //     value:'attribute2',
  //     lable:'属性2',
  // },
  // {
  //     value:'attribute3',
  //     lable:'属性3',
  // },
  // {
  //     value:'attribute4',
  //     lable:'属性4',
  // },
]
let condies = ['and', 'or']
let oprates = [
  {
    lable: '=',
    value: 'eq'
  },
  {
    lable: '≠',
    value: 'ne'
  },
  {
    lable: '>',
    value: 'gt'
  },
  {
    lable: '≥',
    value: 'ge'
  },
  {
    lable: '<',
    value: 'lt'
  },
  {
    lable: '≤',
    value: 'le'
  },
]
function AddCondis() {
  return {
    fieldName: 'userName',
    conditionalSign: 'eq',
    value: '',
    logicalSymbol: 'and'
  }
}

export default {
  // components: {
  //   SearchUser
  // },
  data() {
    return {
      preGroup: [],
      checkData: [],
      delCon: [],
      centerDialogVisible: false,

      properties,
      condies,
      oprates,
      param: {
        queryConditionList: []
      },
      departs: [],
      departProps: {
        expandTrigger: 'hover',
        value: 'id',
        label: 'departmentName',
        children: 'child',
        emitPath: false,
        checkStrictly: true,
      },

    };
  },
  methods: {
    // 查看条件组内容
    handleSelectionChange(val) {
      console.log("查看条件组内容", JSON.stringify(val, null, 2))
      this.checkData = {
        queryBuilderName: val.confereeGroupName,
        queryConditionList: JSON.parse(val.jsonQuery)
      }
      console.log(this.checkData)
      this.editBool = true
    },

    addCondis: function () {
      this.param.queryConditionList.push(AddCondis())
    },//addCondis
    removeCondis: function (index) {
      this.param.queryConditionList.splice(index, 1)
    },//removeCondis

  },
  mounted() {

  },
  watch: {
    param: function (val) {
      if (this.param.length > 0) {
        this.param[0].condis = 'and'
      }
    },//param
    checkData: function(val){
      this.param = val
  }, // checkData
  },
};
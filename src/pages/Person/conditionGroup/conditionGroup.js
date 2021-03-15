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
      height: null,
      tableLable: [
        { name: "条件组名称", fieldName: "queryBuilderName" }
        // { name: "部门", fieldName: "departmentId" }
        // { name: "职务", fieldName: "duties" },
        // { name: "手机号", fieldName: "phone" },
        // { name: "email", fieldName: "email" },
        // { name: "角色", fieldName: "characterId" },
        // { name: "组别", fieldName: "groups" },
        // { name: "级别", fieldName: "ranksId" },
        // { name: "类别", fieldName: "type" },
        // { name: "属性1", fieldName: "attribute1" }, //attribute1
        // { name: "属性2", fieldName: "attribute2" }, //attribute2
        // { name: "属性3", fieldName: "attribute3" }, //attribute3
        // { name: "属性4", fieldName: "attribute4" } //attribute4
      ],
      preGroup: [],
      checkData: [],
      delCon: [],
      centerDialogVisible: false,

      properties: properties,
      condies: condies,
      oprates: oprates,
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

      name: '',
      bool: true,
      editBool: true,

    };
  },
  methods: {
    setsearchcondition: function (val) {
      console.log(val);
      //   this.searchCondition = val;
      //   this.searchKey = "";
      //   this.searchData();
    }, //setsearchcondition
    // 查看条件组内容
    handleSelectionChange(val) {
      console.log("查看条件组内容", JSON.stringify(val, null, 2))
      this.checkData = JSON.parse(JSON.stringify(val))
      this.param = JSON.parse(JSON.stringify(val))
      if (val.queryBuilderName) {
        this.bool = false
        this.editBool = false
      }
    },
    // 勾选条件组
    selectionTable(val) {
      console.log(val)
      this.delCon = val
    },
    // 删除条件组
    delCondition() {
      let that = this
      if (!this.delCon.length) {
        this.$message("请输入勾选需要删除的条件组！")
        return
      }

      that.$confirm('确认删除选中的条件组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        that.confirmEdit()
      }).catch(() => {})
    },
    // 确认删除
    confirmEdit() {
      var data = [],
        ids = this.delCon.map(item => {
          // data.push({
          //   id: item.id,
          //   groupName: item.queryBuilderName,
          //   condition: JSON.stringify(item.queryConditionList)
          // })
          data.push(item.id)
        }), that = this

      this.$http.post(this.API.delectConditionGroup, data)
        .then(res => {
          console.log(res);
          if (res.code == '000') {
            that.preGroup = that.preGroup.filter((item, idx) => ids.indexOf(item.id) == -1)
            that.$message.success('删除成功!')

            this.centerDialogVisible = false
            this.signOutEdit()
            this.intData()
            this.$emit('initCondition')
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    // 初始化数据
    intData() {
      let that = this
      // 获取条件组
      this.$http
        .get(this.API.selectConditionGroup('persons'))
        .then(res => {
          console.log(res);
          if (res.code == "000" && res.data) {
            var arr = []
            res.data.filter(item => {
              arr.push({
                queryConditionList: JSON.parse(item.condition),
                queryBuilderName: item.groupName,
                id: item.id
              })
            })
            that.preGroup = arr
          }
        })
        .catch(res => {
          console.log(res);
        });

      this.$emit('initCondition')
    },
    addCondis: function () {
      this.param.queryConditionList.push(AddCondis())
    },//addCondis
    removeCondis: function (index) {
      this.param.queryConditionList.splice(index, 1)
    },//removeCondis
    search: function () {
      console.log(this.param)
      this.setsearchcondition(this.param)
    },//search
    cleanCondis: function () {
      this.param.queryConditionList = []
    },//cleanCondis

    // 保存
    preservation(type) {
      console.log(this.param)
      let that = this
      if (!this.param.queryBuilderName || !this.param.queryBuilderName.trim()) {
        this.$message("请输入条件组名称！")
        return
      }

      if (this.param.queryConditionList.length == 0) {
        this.$message("请添加查询条件！")
        return
      }

      if (!this.bool && this.editBool) {
        var data = {
          id: this.param.id,
          groupName: this.param.queryBuilderName,
          condition: JSON.stringify(this.param.queryConditionList),
          types: 'persons'
        }
      } else {
        // 处理数据 condition
        this.param.queryConditionList.map((item, idx) => this.param.queryConditionList[idx].sequenceNumber = '' + idx)
        var data = {
          groupName: this.param.queryBuilderName,
          condition: JSON.stringify(this.param.queryConditionList),
          types: 'persons'
        }
      }

      if (type == 'new') {
        this.$http.post(this.API.saveConditionGroup, data)
          .then(res => {
            if (res.code == '000') {
              that.$message.success('保存成功！')
              that.intData()

              // 清空数据
              that.param.queryConditionList = []
              that.param.queryBuilderName = ''
            }
          })
          .catch(res => {
            console.log(res);
          });
      } else {
        console.log(data)
        // return 
        this.$http.post(this.API.updateConditionGroup, data)
          .then(res => {
            if (res.code == '000') {
              that.$message.success('保存成功！')
              this.signOutEdit()
              that.intData()

              // 清空数据
              that.param.queryConditionList = []
              that.param.queryBuilderName = ''
            }
          })
          .catch(res => {
            console.log(res);
          });
      }

      this.intData()
    }, // preservation
    // 修改
    edit() {
      this.editBool = true
    },
    // 退出编辑
    signOutEdit() {
      this.editBool = true
      this.bool = true
      this.param = {
        queryConditionList: []
      }
      this.name = ''
    }
  },
  mounted() {
    // 表格高度
    var dom = document.querySelector('.c-table')
    this.height = dom.offsetHeight
    // 获取条件组
    this.intData()

  },
  watch: {
    param: function (val) {
      console.log(val)
      if (this.param.length > 0) {
        this.param[0].condis = 'and'
      }
    },//param

  },
};
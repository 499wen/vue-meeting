import AddPerson from './addPeroson/addPeroson.vue' // 添加人员
import ExcelImportPeroson from './excelImportPerson/excelImportPerson.vue' // 添加人员
import EditPeroson from './editPeroson/editPeroson.vue' // 修改人员
import UpdatePhoto from './updatePhoto/updatePhoto.vue' // 上传图片
import NoPhotos from './noPhotos/noPhotos.vue' // 人员无照片匹配
import conditionGroup from './conditionGroup/conditionGroup.vue' // 条件组
import { dataScrollLoad, exportToExcel } from '@/plugins/plugins.js'

import COS from 'cos-js-sdk-v5'
import $ from 'jquery'
// var COS = require('cos-js-sdk-v5');

export default {
  components: {
    AddPerson,
    EditPeroson,
    NoPhotos,
    conditionGroup,
    UpdatePhoto,
    ExcelImportPeroson
  },
  data() {
    return {
      data: [],
      treeProps: {
        children: 'children',
        label: 'departmentName'
      },

      // table
      height: null, 
      tableData: [],
      tableCate: [
        // { prop: 'attribute2', label: '编号', width: '110' },
        // { prop: 'userName', label: '姓名', width: '110' },
        { prop: 'sex', label: '性别', width: '70' },
        { prop: 'phone', label: '手机号码', width: '120' },
        { prop: 'email', label: '电子邮箱', width: '180' },
        { prop: 'departmentName', label: '部门', width: '' },
        { prop: 'ranksId', label: '级别', width: '110' },
        { prop: 'duties', label: '职务', width: '150' },
        { prop: 'characterId', label: '角色', width: '110' },
        { prop: 'attribute1', label: '组别', width: '110' }
      ],

      // 分页
      pageNum: 1,
      pageSize: 100,
      total: 0,
      searchKey: '',

      // 获取人员参数 
      photoFlag: 2, // 0有头像 1 无头像人员 2 全部
      externalCode: '', // '' 公司下, 1 外部, 0 内部
      deparmentId: '', // 部门id

      // 勾选后数据
      batchdata: [],

      // 条件组数据
      condiData: [],
      queryConditionArr: [],
      tjgroup: '条件组查询', 

      // 标记 -- 重名数据
      isdouble: false,

      // 各子组件开关
      addPeroson_child: false,
      editPeroson_child: false,
      noPhotos_child: false,
      condi_child: false,
      updatePhoto_child: false,
      importPeroson_child: false,

      // 子组件参数
      editPersonId: '',
      showNum: 0,

      // 进度值
      percentage: 0,
      mask: false
    }
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
      this.tjgroup = item.groupName
      this.getProsonData()
    },
    // tree - 点击触发
    treeClick(data, node){
      // console.log(node, data)
      this.tjgroup = '条件组查询'

      this.pageNum = 1
      this.photoFlag = 2
      this.searchKey = ''
      this.queryConditionArr = []
      if(node.level == 1){
        this.deparmentId = this.loginInfo.companyId
        this.externalCode = ''
      } else if(node.level == 2){
        this.externalCode = data.id
        this.deparmentId = this.loginInfo.companyId
        // console.log(this.externalCode)
      } else if(node.level > 2){
        this.deparmentId = data.id
        this.externalCode = 0
      }
      
      this.getProsonData()
    },
    // tree - 树结构
    renderContent(h, { node, data, store }) {
      let html;
      // // console.log(node,node.level)
      if (node.level == 1) {
          html = (<span class="custom-tree-node" >
              <span class="tree-title"> {node.label} </span> <span class="node-tool-bar" >
        </span> </span>);
      } else if(node.level == 2){
          html = (<span class="custom-tree-node" >
          <span class="tree-title"> {node.label} </span> <span class="node-tool-bar" >
            {
              data.departmentName == '内部人员' 
              ? <el-button type="text" class="el-icon-circle-plus-outline" title="添加"
                              on-click={(e) => this.append(data, e)} > </el-button>
              : ''
            }
            </span> </span>);
      } else if(node.level == 3){
          html = (<span class="custom-tree-node" >
            <span class="tree-title"> {node.label} </span> <span class="node-tool-bar" >
                <el-button type="text"
                    class="el-icon-edit-outline"
                    title="重命名"
                    on-click={(e) => this.edit(data, e)} >
                </el-button>

                <el-button type="text"
                    class="el-icon-delete"
                    title="删除"
                    on-click={(e) => this.remove(data, node, e)} >
                </el-button> </span> </span>);
      }
      return html;
    },
    // tree - 添加
    append(data, e){
      e.preventDefault();
      e.stopPropagation();
      let _this = this, arr = this.data[0].children[0].children
      this.$prompt('请输入部门名称', `您将在: ${data.departmentName} 下添加一个新部门`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.{1,20}/,
        inputErrorMessage: '请输入新部门的名称',
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        inputValidator: function(val) {
          // // console.log(val)
          let bool = false
          arr.filter(item => item.departmentName == val ? bool = true : bool = false)
          return bool ? '该名称已存在' : true
        }
      }).then(({ value }) => {
        if (value) {
          if (value.indexOf("-") >= 0 || value.indexOf("/") >= 0 || value.indexOf("\\") >= 0) {
            this.$message.error('部门名称不能包含 \'-\'，\'/\'和\'\\\'字符！'); 
            return false
          }
        }
        let depart = {
            departmentName: value,
            parentId: this.data[0].companyId
        }
        _this.doAddDepart(depart)
      }).catch(info => {});
    },
    doAddDepart: function (val) {
      // console.log("doAddDepart:", val);
      this.$http.post(this.API.addDepartmentForCompany, val)
        .then(res => {
          // console.log(res);
          if (res.code == "000") {
            this.initDepartData();
            this.$message.success("操作成功");
          } else {
            this.$message.info(res.msg);
          }
        }).catch(res => {
          // console.log(res);
        });
    }, //doAddDepart
    // tree - 删除
    remove(data, node, e){
      e.preventDefault();
      e.stopPropagation();
      // console.log(data)
      this.$confirm('是否删除该部门?', '提示', {
        closeOnPressEscape: false,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn_custom_cancel',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.API.delDpeartmentForCompany, [data.id])
        .then(res => {
          if (res.code == "000") {
            this.initDepartData();
            this.$message.success("删除成功");
          } else {
            this.$message.info(res.msg);
          }
        })
      }).catch(() => {})
    },

    // tree - 编辑
    edit(data, e){
      e.preventDefault();
      e.stopPropagation();
      let _this = this, arr = this.data[0].children[0].children
      // console.log(arr)
      this.$prompt('请输入新的部门名称', `修改部门：${data.departmentName} 的名称`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.{1,20}/,
          inputErrorMessage: '请输入部门名称',
          closeOnPressEscape: false,
          closeOnClickModal: false,
          cancelButtonClass: 'btn_custom_cancel',
          inputValidator: function(val) {
            // console.log(val)
            let bool = false
            arr.filter(item => item.departmentName == val.trim() ? bool = true : bool = false)
            if(bool){
              return '该名称已存在'
            } else if(!val.trim()) {
              return '请输入部门名称'
            }
          }
        }).then(({ value }) => {
          if(value){
            if(value.indexOf("-")>=0 || value.indexOf("/")>=0 || value.indexOf("\\") >=0){
              this.$message.error('部门名称不能包含 \'-\'，\'/\'和\'\\\'字符！'); 
              return false
            }
          }
          data.name = value
          _this.editAddDepart(data)
        }).catch(() => {}); 
    },//renameDepart
    editAddDepart(val){
      this.$http.post(this.API.editDepartmentNameForCompany(val.id, val.parentId, val.name))
        .then(res => {
        if (res.code == "000") {
          this.initDepartData();
          this.$message.success("操作成功");
        } else {
          this.$message.info(res.msg);
        }
      })
    },

    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val
      this.getProsonData()
    },
    curChange(val){
      this.pageNum = val
      this.getProsonData()
    },
    // 打开自定义条件组
    openBox(){

    },
    // 输入框搜索
    searchBtn() {
      this.pageNum = 1
      this.getProsonData()
    },
    // 自定匹配
    autoPhoto() {
      this.$http.post(this.API.photoMatching)
        .then(res => {
          if(res.code == '000'){
            this.$message.success('匹配完成！')
            this.getProsonData()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    // 添加人员 - 下拉
    addPersonL(command){
      if(command == 'a'){
        this.addPeroson_child = true
      } else if(command == 'b') {
        this.importPeroson_child = true
      } else if(command == 'c'){
        // 处理数据 取出id
        let id = []
        this.batchdata.filter(item => id.push(item.id))
        if(id.length == 0){
          this.$message.error('请勾选人员!')
          return 
        }

        this.$confirm('是否删除选中的人员数据?', '提示', {  
          closeOnPressEscape: false,
          closeOnClickModal: false,
          cancelButtonClass: 'btn_custom_cancel',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.API.delHzUser, id)
            .then(res => {
              if(res.code == '000'){
                this.$message.success('删除成功！')
                this.pageNum = 1
                this.getProsonData()
              } else {
                this.$message.error(res.msg)
              }
            })
        }).catch(() => {})
      } else if(command == 'd') {
        this.$confirm('是否删除所有人员数据?', '提示', {  
          closeOnPressEscape: false,
          closeOnClickModal: false,
          cancelButtonClass: 'btn_custom_cancel',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.API.delectAllUser)
            .then(res => {
              if(res.code == '000') {
                this.$message.success('删除成功！')
                this.pageNum = 1
                this.getProsonData()
              } else {
                this.$message.error(res.msg)
              }
            })
        })
      } else if(command == 'e'){
        this.photoFlag = 2
        this.queryDuplicate()
      } else if(command == 'f') {
        this.exportPerson()
      }
    },

    // 相片管理 - 下拉
    handleCommand(command){
      if(command == 'a'){
        this.updatePhoto_child = true
      } else if(command == 'b'){
        this.autoPhoto()
      } else if(command == 'c'){
        this.noPhotos_child = true
      } else if(command == 'e') {
        this.iptCpdPackage()
      }
    },
    // 导出人员
    exportPerson(){
      let tHeader = ['姓名'], filterVal = ['userName'], tableData,
      obj = {
        contanUserIdArr: [],
        ifContanUserIdArr: false,
        queryConditionArr: this.queryConditionArr
      }
      this.tableCate.filter(item => {
        tHeader.push(item.label)
        filterVal.push(item.prop)
      })
      
      
      // 重名数据
      if(this.isdouble) {
        this.$http.get(this.API.findDuplicateName(1, 99999, this.externalCode, this.deparmentId))
        .then(res => {
          // console.log(res)
          if (res.code == "000") {
            tableData = res.data
          } else {
            tableData = [];
          }
          exportToExcel(tableData, '导出人员', tHeader, filterVal, res => { })
        })
      } else {
        // 其它数据
        this.$http.post(this.API.conditionQuerys(this.deparmentId, 1, 99999, this.externalCode, this.searchKey, this.photoFlag), obj)
        .then(res => {
          if (res.code == "000") {
            tableData = res.data
          } else {
            tableData = [];
          }
          exportToExcel(tableData, '导出人员', tHeader, filterVal, res => { })
        })
      }
      
    },
    // 导入相片压缩包
    iptCpdPackage(){
      // // 解压给出缓冲时间
      // let load = this.$loading({
      //   lock: true,
      //   text: '正在解压。。。',
      //   customClass: 'loading-color',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0)',
      //   target: document.querySelector('body')
      // })
      // return 
      let fileDom = document.createElement('input')
      fileDom.type = 'file'
      fileDom.onchange = () => {
        let files = fileDom.files[0]
        console.log(files)
        
        let name = files.name,
        size = files.size,
        suffix = name.substr(name.lastIndexOf('.')),
        suffixArr = ['.zip', '.tar', '.rar']

        if(!suffixArr.includes(suffix)){
          this.$message.error('只支持 zip, tar, rar 文件类型!')
          return
        }

        if(size > 1024 * 1024 * 300) {
          this.$message.error('文件太大，请上传不超过300M！')
          return 
        }

        this.mask = true
        
        //实例化COS对象
        var cos = new COS({
          SecretId: 'AKIDFqEMDofJBviSxLFObXNUN0aJp4nHivqX ', //密钥id
          SecretKey: 'tY3KWR6UdgU4Nq4wlOWbS5qNRFnHYcTT'//密钥的key
        });
      
        cos.putObject({
          Bucket: 'compressed-package-1305256445', /* 存储同名称，必须字段 */
          Region: 'ap-nanjing',     /* 存储桶所在地域，必须字段 */
          Key: name,      /* 文件名称，必须字段 */
          Body: files, // 上传文件对象
          StorageClass: 'STANDARD',
          onProgress: (progressData) => {
            console.log(JSON.stringify(progressData));
            this.percentage = progressData.percent * 100
          }
        }, (err, data) => {
          let res = err || data

          // if(this.percentage >= 100) this.mask = false
          if(res.statusCode == 200) {
            this.$http.post(this.API.uploadZip(name))
              .then(resu => {
                console.log(resu)
                if(resu.code == '000'){
                  this.mask = false
                  this.percentage = 0
                  this.$message.success('上传成功！')
                }

              }).catch(error => {
                this.mask = false
              })
          }
          // console.log(err || data);
        });
      }

      fileDom.click()
    },
    // 重名
    queryDuplicate(){
      this.isdouble = true
      this.$http.get(this.API.findDuplicateName(this.pageNum, this.pageSize, this.externalCode, this.deparmentId))
        .then(res => {
          // console.log(res)
          if (res.code == "000") {
            this.total = res.count
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
    // 编辑
    updateUser(data){
      this.editPersonId = data.id
      this.editPeroson_child = true
    },

    // 勾选人员
    batchDel(data){
      this.batchdata = data
    },

    /**
     * 子集组件 - 按钮
     */
    setShowNum(num){
      this.showNum = num
    },
    imgUploadAll(e){
      let child = this.$refs.UpdatePhoto
      child.imgUploadAll()
    },
    relation() {
      let child = this.$refs.NoPhotos,
      userId = child.userId,
      fileInfoId = child.fileInfoId

      if(!userId) {
        this.$message.error('请勾选人员!')
        return 
      }
      if(!fileInfoId) {
        this.$message.error('请勾选相片!')
        return 
      }

      this.$http.post(this.API.matchingUserPhoto(userId, fileInfoId))
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            this.$message.success('关联成功！')
            // this.noPhotos_child = false
            // 获取人员
            child.pageNum = 1
            child.getNoPerosn()

            // 获取图片
            child.ipageNum = 1
            child.getNoPhoto()
          } else {
            this.$message.success(res.msg)
          }
        })
    },

    // 关闭组件
    closeComponent() {
      this.importPeroson_child = false
      this.getProsonData()
    },


    // 保存 - 添加人员
    submitForm(){
      let child = this.$refs.AddPerson, from = {...child.user}
      child.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.$http.post(this.API.addUser, from)
            .then(res => {
              if(res.code == '000'){
                this.$message.success('添加成功！')
                this.addPeroson_child = false
                this.getProsonData()
              } else {
                this.$message.error(res.msg)
              }
            })
        } else { 
          // console.log('error submit!!--submitForm');
          return false;
        }
      }); 
    },
    // 保存 - 修改人员
    editSave(){
      let child = this.$refs.EditPerson, from = {...child.user}
      child.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.$http.post(this.API.updateUser, from)
            .then(res => {
              if(res.code == '000'){
                this.$message.success('修改成功！')
                this.editPeroson_child = false
                this.getProsonData()
              } else {
                this.$message.error(res.msg)
              }
            })
        } else { 
          // console.log('error submit!!--editSave');
          return false;
        }
      });
    },
    cancel() {
      this.addPeroson_child = false
      this.editPeroson_child = false
      this.noPhotos_child = false
      this.updatePhoto_child = false
      this.importPeroson_child = false

      this.showNum = 0
      this.pageNum = 1
      this.getProsonData()
    },
    close() {
      this.condi_child = false
      this.getCondit()
    },


    // 获取部门
    initDepartData() {
      this.$http.get(this.API.findCompanyDepartment)
      .then(res => {
        // console.log(res)
        if(res.code == '000'){
          let arr = []
          res.data.filter(item => {
            if(item.departmentName == item.companyName){
              // this.deparmentId = item.companyId
              this.data = [
                {
                  companyId: item.companyId,
                  departmentName: item.companyName,
                  id: item.id,
                  children: [
                    { departmentName: '内部人员', id: 0, children: []}, 
                    { departmentName: '外部人员', id: 1 }, 
                  ]
                }
              ]
            } else {
              arr.push(item)
            }
          })
        
          this.data[0].children[0].children = arr;
          
          setTimeout(() => {
            this.$refs['person-tree'].setCurrentKey(this.deparmentId)
            document.querySelector('.el-tree-node__content').style = `
              background-color: #e67c7c;
              color: #fff
            `
          }, 300)
        }
      })
    },

    // 获取人员数据
    getProsonData(){
      let obj = {
        contanUserIdArr: [],
        ifContanUserIdArr: false,
        queryConditionArr: this.queryConditionArr
      }
      // 不是获取重名数据 -- 标记
      this.isdouble = false
      this.$http.post(this.API.conditionQuerys(this.deparmentId, this.pageNum, this.pageSize, this.externalCode, this.searchKey, this.photoFlag), obj)
        .then(res => {
          console.log(res)
          if (res.code == "000") {
            this.total = res.count
            this.tableData = res.data
          } else {
            this.total = 0;
            this.tableData = [];
          }
        }).catch(res => {
          console.log(res)
          this.total = 0;
          this.tableData = [];
        })
    },

    // 获取条件组数据
    getCondit() {
      this.$http.get(this.API.selectConditionGroup('persons'))
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
    
    // 公司信息
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    this.deparmentId = this.loginInfo.companyId

    // 获取部门
    this.initDepartData()

    // 获取人员
    this.getProsonData()

    // 获取条件组
    this.getCondit()

  }
}
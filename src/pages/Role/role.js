import { dataScrollLoad } from '@/plugins/plugins'
import Addrole from './addRole/addRole.vue'
import EditRole from './editRole/editRole.vue'
import AddMember from './addMember/addMember.vue'
import DelMember from './delMember/delMember.vue'

export default {
  components: {
    Addrole,
    EditRole,
    AddMember,
    DelMember
  },
  data() {
    return {
      // 表格
      tableCate: [
        { label: "角色名称", value: "roleName", width: '200' },
        { label: "成员", value: "member" }
      ],
      tableData: [],
      tableData1: [
        {roleName: '系统管理员', member: '翘翘12'},
      ],
      height: null,
      // 编辑
      row: {},

      // 各子集组件 开关
      addRoleOpen: false,
      editRoleOpen: false,
      addMember: false,
      delMember: false,

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100
    }
  },
  methods: {
    // 编辑
    handleEdit(data){
      this.row = data
      this.editRoleOpen = true
    },
    // 添加成员
    addUsers(data) {
      this.row = data
      this.addMember = true
    },
    // 删除成员
    deleteUsers(data){
      this.row = data
      this.delMember = true
    },
    // 删除列
    handleDelete(data){
      this.$confirm('是否删除该条数据?', '提示', {
          closeOnPressEscape: false,
          closeOnClickModal: false,
          cancelButtonClass: 'btn_custom_cancel',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.API.delRole(data.id))
            .then(res => {
              if(res.code == '000') {
                this.$message.success('删除成功!')
                this.getRolelist()
              } else {
                this.$message.error(res.msg)
              }
            })
        }).catch(err => {})
    },
    // 添加角色
    addRole(){
      this.addRoleOpen = true
    },
    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val
    },
    curChange(val){
      this.pageNum = val
    },

    /**
     * 各子集组件按钮
     */
    close(){
      this.addRoleOpen = false
      this.editRoleOpen = false
      this.addMember = false
      this.delMember = false
    },
    addRoleRole() {
      let child = this.$refs.Addrole
      let obj = {
        roleName: child.roleName,
        menuIds: child.$refs.jurisTree.getCheckedKeys(),
        departmentIds: child.$refs.departTree.getCheckedKeys()
      }

      if(!obj.roleName.trim()){
        this.$message.error('请输入角色名称!')
        return 
      }
      if(obj.menuIds.length == 0){
        this.$message.error('请选择菜单权限!')
        return 
      }
      if(obj.departmentIds.length == 0){
        this.$message.error('请选择部门权限!')
        return 
      }
      
      this.$http.post(this.API.addRole, obj)
        .then(res => {
          if(res.code == '000'){
            this.$message.success('添加成功!')
            this.addRoleOpen = false
            this.getRolelist()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    preser() {
      let child = this.$refs.EditRole
      let obj = {
        roleName: child.roleName,
        menuIds: child.$refs.jurisTree.getCheckedKeys(),
        departmentIds: child.$refs.departTree.getCheckedKeys(),
        id: this.row.id
      }

      if(!obj.roleName.trim()){
        this.$message.error('请输入角色名称!')
        return 
      }
      if(obj.menuIds.length == 0){
        this.$message.error('请选择菜单权限!')
        return 
      }
      if(obj.departmentIds.length == 0){
        this.$message.error('请选择部门权限!')
        return 
      }
      
      this.$http.post(this.API.updateRole, obj)
        .then(res => {
          if(res.code == '000'){
            this.$message.success('添加成功!')
            this.editRoleOpen = false
            this.getRolelist()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    submitForm() {
      let child = this.$refs.AddMember
      , batch = child.batch
      if(batch.length == 0){
        this.$message.error('请勾选人员')
        return 
      }

      this.$http.post(this.API.roleBindCustomer(this.row.id), batch)
        .then(res => {
          if(res.code == '000'){
            this.$message.success('添加成功!')
            this.addMember = false
            this.getRolelist()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    preseMember() {
      let child = this.$refs.DelMember
      , batch = child.batch
      , ids = []
      if(batch.length == 0){
        this.$message.error('请勾选人员')
        return 
      }

      batch.filter(item => ids.push(item.id))

      this.$confirm('是否移除选中人员?', '提示', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.API.roleDelectCostomer(this.row.id), ids)
        .then(res => {
          if(res.code == '000'){
            this.$message.success('删除成功!')
            this.delMember = false
            this.getRolelist()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
    },
    // 获取权限列表
    getRolelist() {
      this.$http.get(this.API.selectRole)
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            res.data.filter(item => {
              item.member = ''
              if(item.Customers){
                item.Customers.filter(i => {
                  item.member += i.customerName + ' '
                })
              } else {
                item.member = '无'
              }
            })
            this.tableData = res.data
          } else {
            this.tableData = []
          }
        })
    }
  },
  mounted() {
    // 获取表格高度
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取权限列表
    this.getRolelist()
  }
}
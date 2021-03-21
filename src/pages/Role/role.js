import { dataScrollLoad } from '@/plugins/plugins'
import Addrole from './addRole/addRole'
import EditRole from './editRole/editRole'
import AddMember from './addMember/addMember'
import DelMember from './delMember/delMember'

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
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
        {roleName: '系统管理员', member: '翘翘12'},
      ],
      height: null,

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
    handleEdit(){
      this.editRoleOpen = true
    },
    // 添加成员
    addUsers() {
      this.addMember = true
    },
    // 删除成员
    deleteUsers(){
      this.delMember = true
    },
    // 删除列
    handleDelete(){
      this.$confirm('是否删除该条数据?', '提示', {
          closeOnPressEscape: false,
          closeOnClickModal: false,
          cancelButtonClass: 'btn_custom_cancel',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
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
      // let 
    },
    preser() {

    },
    submitForm() {

    },
    preseMember() {

    }
  },
  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    var table_scroll = document.querySelector('.el-table__body-wrapper')
    dataScrollLoad(table_scroll, this.tableData1, 1, 30, (res) => {
        this.tableData = res
    })
  }
}
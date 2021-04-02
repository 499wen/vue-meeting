import { toTree } from '@/plugins/plugins.js'

export default {
  data() {
      return {
        roleName: '',
        // 功能权限
        jurisdData: [],
        treeProps: {
          children: 'children',
          label: 'menuName'
        },

        // 公司部门
        departData: [],
        departProps: {
          children: 'children',
          label: 'departmentName'
        },
      }
  },
  methods: {
    // 获取部门列表
    getDepart() {
      this.$http.get(this.API.findCompanyDepartment)
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            this.departData = toTree(res.data)
          }
        })
    },
    // 获取权限列表
    getMeum(){
      // 排除
      let arr = ['f7019026a79742979f9e60f07da8af15'
          , 'a8d85ed898874fffb611877b071d05d5'
          , '45e79259621c40bdba10e9965228fe90'
          , '133c0146f6db482b967a9db950099055']
      this.$http.get(this.API.getCustomerMenus)
        .then(res => {
          if(res.code == '000'){
            let data = res.menuArr.filter((item, idx) => {
              item.menuUrl == '#' ? item.menuUrl += idx : ''
              return !arr.includes(item.id) && item
            })
            this.jurisdData = this.tree(data)
          }
        })
    },
    tree(data) {
      let result = []
      if(!Array.isArray(data)) {
          return result
      }
      data.forEach(item => {
          delete item.children;
      });
      let map = {};
      data.forEach(item => {
          map[item.id] = item;
      });
      data.forEach(item => {
          let parent = map[item.parent];
          if(parent) {
              (parent.children || (parent.children = [])).push(item);
          } else {
              result.push(item);
          }
      });
      return result;
    },
    // 取消
    cancel(){
      this.$emit('close', '取消')
    },
  },

  mounted() {
    // 获取权限列表
    this.getMeum()

    // 获取部门列表
    this.getDepart()
  }
}
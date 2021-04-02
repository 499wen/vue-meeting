import companyInfo from './companyInfo/companyInfo.vue'
import init from './init/init.vue'
import { selfTime, toTree } from '@/plugins/plugins'
import { delCookie } from '@/plugins/cookie.js'

export default {
  components: {
    companyInfo,
    init
  },
  data(){
    return {
      date: '',
      days: '',
      router: [],
      
      // 公司信息
      loginInfo: {},

      H5_app: false,
      H5title: '',
      H5_type: 'H5',

      // 默认选中menu
      defaultActive: '',

      // 子集组件 开关
      companyInfo_child: false,
      init_child: false,
      
    }
  },
  methods: {
    // h5 app
    open(type){
      this.H5_app = true
      this.H5_type = type
      if(type == 'H5'){
        this.H5title = '扫码进入H5移动端'
      } else {
        this.H5title = '扫码开始下载会务通APP'
      }
    },
    // 监听刷新页面
    listenPage() {
      let that = this
      window.onbeforeunload = function (e) {
        e = e || window.event;
        // that.$router.push('/')
        location.href = '/'
        if (e) {
          e.returnValue = '关闭提示';
        }
        return '关闭提示';
      };
    },
    // 公司信息
    company_info() {
      return 
      this.companyInfo_child = true
    },
    // 展开导航
    handleOpen(data, ma){
      console.log('handleOpen', data, ma)
    },
    // 关闭导航
    handleClose(data){
      console.log('handleClose', data)
    },

    // 子组件方法
    submitForm() {
      let child = this.$refs.init, params
      child.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          params = {
            loginName: child.ruleForm2.loginName,
            password: child.ruleForm2.password,
          } 

          this.$http.post(this.API.initLoginNameAndPassword, params)
            .then(res => {
              console.log(res)
              if(res.code == '000'){
                this.$message.success(res.msg)
                this.init_child = false
              } else {
                this.$message.error(res.msg)
              }
            })
        }
      })
    },

    // 退出登录
    logout(){
      this.$confirm('是否退出该账号?', '提示', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCookie('autoLogin')
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(() => {})
      
    },

    // 获取权限列表
    getMeum(){
      // 排除
      let arr = ['0ba5b5d9de6e42c589c1dd5c233960c5'
          , '24dfe17b51cf4058b6f221ce6b3d5dd9'
          , 'f7019026a79742979f9e60f07da8af15'
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
            this.router = this.toTree(data)

            this.defaultActive = this.$route.meta
            // this.defaultActive = '/home'
            console.log(this.defaultActive, this.router)
          }
        })
    },
    toTree(data) {
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
    // 获取公司信息
    getCustomer() {
      // 获取权限列表
      this.getMeum()

      // 获取公司信息
      this.$http.get(this.API.getCustomer)
        .then(res => {
          if(res.code == '000'){
            this.loginInfo = res.data
            if(!res.data.loginName) {
              this.init_child = true
            }
            localStorage.setItem('loginInfo', JSON.stringify(res.data))
          }
        })
    }
  },
  created() {
    let curSj = new Date().getTime()
    this.date = selfTime(curSj, false)
    switch(new Date().getDay()){
      case 1: 
          this.days = '星期一'; break
      case 2: 
          this.days = '星期二'; break
      case 3: 
          this.days = '星期三'; break
      case 4: 
          this.days = '星期四'; break
      case 5: 
          this.days = '星期五'; break
      case 6: 
          this.days = '星期六'; break
      case 0: 
          this.days = '星期日'; break
    }

    let routes = this.$router.options.routes
    routes.filter(item => item.name == '框架' && this.router.push(...item.children))

    // 获取公司信息
    this.getCustomer()
  },
  mounted() {
    // 监听用户进入页面
    document.addEventListener('visibilitychange', (e) => {
      let token = localStorage.getItem('token')
      console.log(document.hidden)
      if(!token) this.$router.push('/login')
      else if(!document.hidden) {
          // 获取公司信息
          this.getCustomer()
      }
    })
  }
}
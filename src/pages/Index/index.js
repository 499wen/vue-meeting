import companyInfo from './companyInfo/companyInfo.vue'
import init from './init/init.vue'
import { selfTime } from '@/plugins/plugins'
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
    handleOpen(data){
      console.log('handleOpen', data)
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
      this.$confirm('是否推出该账号?', '提示', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCookie('autoLogin')
        this.$router.push('/login')
      }).catch(() => {})
      
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
  },
  mounted() {
    // this.listenPage()
    console.log(this.$route)
    this.defaultActive = this.$route.meta
  }
}
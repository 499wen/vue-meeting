import companyInfo from './companyInfo/companyInfo.vue'
import init from './init/init.vue'
import version from './version/version.vue'
import { selfTime, toTree } from '@/plugins/plugins'
import { delCookie } from '@/plugins/cookie.js'
import QRCode from 'qrcodejs2'
import $ from 'jquery'
import costCenter from '../CostCenter/costCenter.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    companyInfo,
    init,
    version
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

      // 所有版本
      allVersion: [],
      // 余额
      balance: '',
      // 总金额
      totalMoney: 0,
      // 订单id
      id: '',
      
      // 按钮
      btnUse: [
        {buttonName: '基本信息', scription: 'basicInfo', icon: '/baseInformation.png', buttonId: '110001', num: 1, isShow: '1', isUse: '1'},
        {buttonName: '参会人管理', scription: 'attendee', icon: '/attendPersonal.png', buttonId: '110003', num: 2, isShow: '1', isUse: '1'},
        {buttonName: '会议室预约', scription: 'meetRoom', icon: '/roomReservation.png', buttonId: '110012', num: 3, isShow: '1', isUse: '1'},
        {buttonName: '通知消息管理', scription: 'smscenter', icon: '/notice.png', buttonId: '110004', num: 4, isShow: '1', isUse: '1'},
        {buttonName: '会议邀请函', scription: 'invitation', icon: '/meetingInvite.png', buttonId: '110002', num: 5, isShow: '1', isUse: '1'},
        {buttonName: '签到配置', scription: 'appSign', icon: '/meetingInvite.png', buttonId: '110002', num: 6, isShow: '1', isUse: '1'},
        {buttonName: '会议排位管理', scription: ' ', icon: '/ConferenceSeating.png', buttonId: '110005', num: 7, isShow: '1', isUse: '0'},
        {buttonName: '会议住宿管理', scription: 'guestroom', icon: '/stayManagement.png', buttonId: '110007', num: 8, isShow: '1', isUse: '1'},
        {buttonName: '会议用餐管理', scription: 'restaurant', icon: '/eatmanage.png', buttonId: '110008', num: 9, isShow: '1', isUse: '1'},
        {buttonName: '会议车辆管理', scription: 'vehicletask', icon: '/carmanagement.png', buttonId: '110009', num: 10, isShow: '1', isUse: '0'},
        {buttonName: '会务组管理', scription: 'meetingaffairs', icon: '/groupManage.png', buttonId: '110010', num: 11, isShow: '1', isUse: '0'},
        {buttonName: '会议议程管理', scription: ' ', icon: '/ziliaomanagment.png', buttonId: '110006', num: 12, isShow: '1', isUse: '0'},
        {buttonName: '参会统计', scription: ' ', icon: '/attendCensus.png', buttonId: '110011', num: 13, isShow: '1', isUse: '0'},
        {buttonName: '会务组报道', scription: 'report', icon: '/attendCensus.png', buttonId: '110013', num: 14, isShow: '1', isUse: '0'},
      ],
      // 子集组件 开关
      companyInfo_child: false,
      init_child: false,
      version_child: false,
      qrcode_child: false
    }
  },
  methods: {
    // vuex 保存会议数据
    ...mapMutations([
      'setButtonRole'
    ]),
    // 进入费用中心
    costcenter() {
      this.$router.push('/costcenter')
    },
    // 充值
    recharge() {
      this.$prompt('输入充值金额(保留2位小数)', '提示', {
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /(^[0-9]\d{0,3}$)|(^\.\d{1,2}$)|(^[0-9]\d{0,3}\.\d{1,2}$)/,
        // /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^([^0][0-9]+|0)$/
        inputErrorMessage: '输入格式有误！'
      }).then(({ value }) => {

        this.$http.post(this.API.userRecharge, {
          fee: value * 100
        }).then(res => {
            if(res.code == '000') {
              this.qrcode_child = true
              setTimeout(() => {
                this.$refs.qrcode.innerHTML = ''; //清除二维码方法一
                var qrcode = new QRCode(this.$refs.qrcode, {
                  text: res.data.code_url, //页面地址 ,如果页面需要参数传递请注意哈希模式#
                  width: 120,
                  height: 120,
                  colorDark: '#000000',
                  colorLight: '#ffffff'
                })
                // qrcode.clear(); // 清除二维码方法二
                // this.payResult(sid)
                this.resultRecharge(res.id)
              }, 500)
            } else {
              this.$message.error(res.msg)
            }
          })
      }).catch(err => {})
    },
    // 充值结果
    resultRecharge(id){
      $.ajax({
        url: this.API.getWxRechargeCode(id),
        type: 'post',
        dataType: 'json',
        headers: {
          token: localStorage.getItem('token')
        },
        success: (res) => {
          if(res.code == '000'){
            this.$message.success(res.msg)
            this.qrcode_child = false

            this.getcost()
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    },
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
      // return 
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
    cgForm() {
      let child = this.$refs.version, id = child.cur.id, 
        couponId = child.ruleForm.couponId

      console.log(child.cur)
      // return 
      child.$refs.ruleForm.validate((valid) => {
        if (valid) {

          this.$http.post(this.API.getWxPay(id, couponId))
            .then(res => {
              console.log(res)
              if(res.code == '000'){
                this.id = res.id
                this.qrcode_child = true
                setTimeout(() => {
                  this.$refs.qrcode.innerHTML = ''; //清除二维码方法一
                  var qrcode = new QRCode(this.$refs.qrcode, {
                    text: res.data.code_url, //页面地址 ,如果页面需要参数传递请注意哈希模式#
                    width: 120,
                    height: 120,
                    colorDark: '#000000',
                    colorLight: '#ffffff'
                  })
                  // qrcode.clear(); // 清除二维码方法二
                  this.payResult(id)
                }, 500)
              } else {
                this.$message.error(res.msg)
              }
            })
        }
      })
    },
    // 支付调用结果
    payResult (sid){
      $.ajax({
        url: this.API.getWxPayCode(this.id, sid),
        type: 'post',
        dataType: 'json',
        headers: {
          token: localStorage.getItem('token')
        },
        success: (res) => {
          if(res.code == '000'){
            this.$message.success(res.msg)
            this.qrcode_child = false

            // 更新数据
            this.getcost()
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    },
    cancel() {
      this.version_child = false
    },
    // 总金额
    money(val) {
      this.totalMoney = val
    },

    // 变更版本
    changeVersion() {
      this.version_child = true
    },

    // 获取明细数据
    getcost() {
      this.$router.go(0);
      return 

      this.getBalance()
      if(this.$route.path == '/costcenter'){
        costCenter.methods.getcost()
      }
      
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
            this.router = this.toTree(data).sort((cur, next) => cur.menuOrder - next.menuOrder)

            this.defaultActive = this.$route.meta
            // this.defaultActive = '/home'
            // console.log(this.defaultActive, this.router)
          }
        }).catch(err=> {
          console.log(err)
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
    // 查询余额
    getBalance(){
      this.$http.get(this.API.findBalance)
      .then(res => {
        if(res.code == '000'){
          this.balance = res.data.balance
        }
      })
    },
    // 获取所有版本
    getVersion() {
      this.$http.get(this.API.findAllByPageAndCustomType)
      .then(res => {
        if(res.code == '000'){

          this.allVersion = res.data
        }
      })
    },
    // 权限按钮
    getButton() {
      let arr = []
      this.$http.get(this.API.findCompanyButton)
        .then(res => {
          if(res.code == '000'){
            res.data.filter(its => {
              this.btnUse.filter(i => i.buttonName == its.buttonName && arr.push({...its, icon: i.icon, scription: i.scription}))
            })
            
            this.setButtonRole(arr)
          }
        })
    },
    // 获取公司信息
    init() {
      // 获取权限列表
      this.getMeum()

      // 获取公司信息
      this.getCustomer()

      // 查询余额
      this.getBalance()

      // 获取所有版本
      this.getVersion()

      // 权限按钮
      this.getButton()
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
    console.log(this.router)
    routes.filter(item => item.name == '框架' && this.router.push(...item.children))

    // 获取公司信息
    this.init()
  },
  mounted() {
    // 监听用户进入页面
    document.addEventListener('visibilitychange', (e) => {
      // 登录，注册页面不执行
      let token = localStorage.getItem('token'),
      path = this.$route.path
      if(path == '/login' || path == '/regist') return 

      if(!token) this.$router.push('/login')
      else if(!document.hidden) {
        // 获取公司信息
        this.init()
      }
    })

    // 监听路由变化
    window.onhashchange = (e) => {
      console.log('路由变化')
    }
  },
  watch:{
    $route(to,from){
      console.log(to.path, this.defaultActive);
      // if(to.path == '/costcenter')
        // this.defaultActive = '/costcenter'
    }
  },
}
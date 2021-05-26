import { checkPhone, validateuser, validatNumer, checkMail} from './verification'
import { Notification } from 'element-ui'

export default {
  data() {
    return {
      registerForm:{
        customerName:'',
        phone:'',
        email:'',
        trade:'',
        companyName:'',
        checkCode:'',
        systemEditionId:'',
      },
      tradeList:[
        { label:'党政单位', value:'党政单位'},
        { label:'行政事业单位', value:'行政事业单位'},
        { label:'国家企业', value:'国家企业'},
        { label:'民营企业', value:'民营企业'},
        { label:'外资企业', value:'外资企业'},
        { label:'广告、会展企业', value:'广告、会展企业'},
        { label:'系统集成公司', value:'系统集成公司'}
      ],
      rules:{
        phone:[
          {required: true, validator:checkPhone,trigger:'blur'},
        ],
        companyName:[
          { required: true, message: '请输入完整的正确单位名称，否则可能无法审批', trigger: 'blur' },
          {validator: validateuser, trigger: 'blur'}
        ],
        customerName:[
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        checkCode:[
          { required: true, message: '请输入正确的验证码', trigger: 'blur' },
          {validator: validatNumer, trigger: 'blur'}
        ],
        trade:[
          { required: true, message: '请输入行业', trigger: 'blur' },
        ],
        email:[
          {required: true, validator:checkMail,trigger:'blur'},
        ],
        systemEditionId:[
          { required: true, message: '请选择版本', trigger: 'blur' },
        ],
      },
      retryCount:0,
      editList:[
        { id: '350140919636299776', systemEditionName: '基础版本'}
      ]
    }
  },
  methods: {
    // 获取焦点
    focusOut(type){
      let msg
      switch (type) {
          case 'companyName': 
              msg = '单位名称请填写单位全称，否则在系统应用当中显示的单位名称会出席错误或不严谨的单位信息。'
              break;
          case 'customerName':
              msg = '请填制真实姓名，单位注册人默认为系统管理员及会议管理员，如填制不完整或虚名，发送给参会人的信息会出现误差'
              break;
          // case 'trade':
          //     msg = '请填制真实姓名，单位注册人默认为系统管理员及会议管理员，如填制不完整或虚名，发送给参会人的信息会出现误差'
          //     break;
          case 'phone':
              msg = '手机号码用于身份验证及发送、接收会议信息，请填制真实有效手机信息，否则会出现接收不到信息等状况。'
              break;
          case 'email':
              msg = '电子邮箱用于身份验证及发送、接收会议信息，请填制真实有效邮箱信息，否则会出现接收不到信息等状况。'
              break;
      }

      Notification({
          title: '注意',
          message: msg,
          duration: 0,
          type: 'warning',
          showClose: false,
      });
    },
    blurOut(type) {
        Notification.closeAll()
    },
    // 去登陆
    goLogin(){
        this.$router.push('/login')
    },
    // 获取验证码  https://service-4equ2nsy-1258215038.gz.apigw.tencentcs.com/release/smsCheckedCodeForRegister?phone=17301998329
    getCheckCode(){
      let pattern=/^1[0-9]{10}$/
      if(!pattern.test(this.registerForm.phone)){
        this.$message.error('请输入手机号码')
        return
      }

      this.retryCount=60
      this.$http.get( this.API.smsCheckedCode(this.registerForm.phone))
        .then(res => {
          if(res.code == '000'){
            this.$message.success('验证码己成功发送,请注意查收')
            let handle = setInterval(() => {
              this.retryCount--
              if(this.retryCount <= 0){
                clearInterval(handle);
              }
            },1000)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    // 提交申请
    apply(){
      let registerForm = this.registerForm

      this.$refs.registerForm.validate((valid)=>{
        if(valid) {
          this.$http.post( this.API.register, registerForm)
            .then(res => {
              if(res.code == '000') {
                this.$confirm('您的账号正在审核中, 请耐心等待。。。', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    // 注册成功之后跳转到登陆页面
                    setTimeout(() =>{ 
                      this.$router.push('/login')
                    }, 500)
                  }
                })
              } else {
                this.$message.error(res.msg)
              }
            })
        }
      })
    },

    // 获取版本号
    getCustomType() {
      this.$http.get(this.API.getCustomType)
        .then(res => {
          console.log(res)
          if(res.code == '000') {
            this.editList = res.data
          }
        })
    }
  },

  mounted() {
    // 获取版本号
    this.getCustomType()
  }
}
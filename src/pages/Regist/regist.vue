<template>
    <div class="regist">
        <!-- logo -->
        <img class='regist-logo' src='../../assets/images/login-logo.png' />
        
        <!-- text -->
        <div class="text">
            <img class='regist-text' src='../../assets/images/login-text.png' />
        </div>

        <!-- 注册 - 表单 -->
        <div class="regist-form">
            <div class="regist-title">注 册</div>
            <el-form class="form" :model="registerForm" ref="registerForm" :rules="rules" label-width="78px">
                <el-form-item label="版 本" prop="systemEditionId" >
                    <el-select v-model="registerForm.systemEditionId"> 
                        <el-option
                        v-for="item in editList"
                        :key="item.id"
                        :label="item.systemEditionName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <a href="https://www.hzics.com" target="_bland" style="margin-left:0.938rem">了解详情</a>
                </el-form-item>
                <el-form-item label="单位名称" prop="companyName">
                    <el-input v-model="registerForm.companyName" clearable></el-input>
                </el-form-item>
                <el-form-item label="姓 名" prop="customerName">
                    <el-input v-model="registerForm.customerName" clearable></el-input>
                </el-form-item>
                <el-form-item label="行 业" prop="trade" >
                    <el-select v-model="registerForm.trade">
                        <el-option
                        v-for="item in tradeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="registerForm.phone" clearable></el-input>
                </el-form-item>
                <el-form-item label="电子邮件" prop="email" >
                    <el-input v-model="registerForm.email" clearable></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="checkCode">
                    <el-input v-model="registerForm.checkCode" clearable>
                        <el-button slot="append" @click="getCheckCode" :disabled="retryCount>0" >{{retryCount>0?retryCount+'S 后重试':'获取验证码'}}</el-button>
                    </el-input>
                </el-form-item>

                <div class="submit">
                    <div class="submit-btn">
                        <el-button class="submit-btn-el" @click="apply"> 提交申请 </el-button>
                    </div>
                    <div class="alr-exist">
                        已有账号 <span @click="goLogin">去登录</span>
                    </div>
                </div>
            </el-form>
        </div>

        <!-- 底部 -->
        <div class="regist-button">
            <div class="company">
                <span class="info">广州会智智能科技有限公司</span>
                <span class="info">https://www.hzics.com</span>
                <span class="info">TEL:020-34798277</span>
            </div>
            <div>
                <span class="keep-on-record">版权所有:广州会智智能科技有限公司</span>
                <span class="keep-on-record">粤ICP备案:75558621-4</span>
            </div>
        </div>
    </div>
</template>

<script>
import { checkPhone, validateuser, validatNumer, checkMail} from './verification'

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
                {
                    label:'党政单位',
                    value:'党政单位',
                },
                {
                    label:'行政事业单位',
                    value:'行政事业单位',
                },
                {
                    label:'国家企业',
                    value:'国家企业',
                },
                {
                    label:'民营企业',
                    value:'民营企业',
                },
                {
                    label:'外资企业',
                    value:'外资企业',
                },
                {
                    label:'广告、会展企业',
                    value:'广告、会展企业',
                },
                {
                    label:'系统集成公司',
                    value:'系统集成公司',
                },
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
        }
    }
}
</script>

<style scoped lang='less'>
.regist {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../../assets/images/login-bgi.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center center;
    
    .regist-logo {
        width: 281px;
        height: 62px;
        margin-top: 40px;
        margin-left: 40px;
    }

    .text {
        margin-top: 20px;
        width: 100%;
        text-align: center;
        
        .regist-text {
            width: 805px;
            height: 87px;
        }
    }

    .regist-form {
        width: 480px;
        background-color: #fff;
        margin: 10px auto;
        border-radius: 10px 10px 5px 5px;

        .regist-title {
            width: 100%;
            border-radius: 5px 5px 0 0;
            background-color: #054592;
            color: #fff;
            height: 50px;
            line-height: 50px;
            font-size: 18px;
            text-align: center;
        }

        .form {
            padding: 20px 10px;

            .submit {
                width: 100%;
                display: flex;
                align-items: center;

                .submit-btn {
                    flex: 1;
                    text-align: center;

                    .submit-btn-el {
                        background-color: #054592;
                        color: #fff;
                    }
                }

                .alr-exist {
                    font-size: 16px;

                    & > span {
                        color: #00F;
                        cursor: pointer;
                    }
                }
            }
        }
    }


    .regist-button {
        position: fixed;
        bottom: 20px;
        // margin-top: 270px;
        width: 100%;
        height: 50px;
        color: #fff;
        text-align: center;

        .company {
            margin-bottom: 5px;
        }

        .info {
            padding: 0 20px;
            font-size: 16px;
            position: relative;
            display: inline-block;
        }

        .info:before {
            content: '';
            background-color: #fff;
            width: 2px;
            height: 100%;
            position: absolute;
            top: 0;
            right: -1px;
        }

        .info:nth-last-child(1):before {
            opacity: 0;
        }

        .keep-on-record {
            font-size: 12px;
            padding: 0 20px;
        }
    }
}
</style>
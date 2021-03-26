// 添加人员js
function User() {
	return { 
		userName: '', //姓名 
		sex: '男', //性别
		birthday: 0, //生日
		nation: '', //民族 
		political: '', //政治面貌
		party: '', //党派
		companyId: '', //工作单位
		education: '', //学历
		oldDepartmentName: '', //部门bthc3l3rm5p9151j3ih0
		duties: '', //职务
		characterId: '', //角色
		ranksId: '', //级别
		phone: '', //手机
		email: '', //email
		weChat: '', //微信
		qq: '', //QQ
		homeAddress: '', //家庭住址
		photoFileId: '', //头像ID
		groups: '', //组别
		type: '', //类别
		attribute1: '', // 组别
		attribute2: '', //属性2
		attribute3: '', //属性3
		attribute4: '', //属性4
		externalCode: '0',
		photoFileSaveName: '', // 头像 (包含后缀)
	}
}

export default {
  props: ['personId'],
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      }
      setTimeout(() => {
        let partent = new RegExp(/^1[0-9]{10}$/)
        if (!partent.test(value)) {
          callback(new Error('请输入有效的手机号'));
        } else {
          callback();
        }
      }, 500);
    };
    return {
        user: new User(),
        userRules: {
          userName: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          sex: [{
            required: true,
            message: '请选择性别',
            trigger: 'blur'
          }],
          birthday: [{
            type: 'date',
            required: true,
            message: '请选择出生日期',
            trigger: 'blur'
          }],
          phone: [{
              validator: checkPhone,
              trigger: 'blur'
            },
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            }
          ],
        },
        sexOptions: [
          {
            value: '男'
          },
          {
            value: '女'
          }
        ],
        educationOptions: [{
            value: '大专'
          },
          {
            value: '本科'
          },
          {
            value: '硕士'
          },
          {
            value: '博士'
          },
          {
            value: '其它'
          },
        ],
        headers: {},
    }
  },
  methods: {
    // 上传头像
    upload(){
      let file = this.$refs.avatar, files
      files = file.files[0]
      
      this.fileUpload(files, 'HeadFile', res => {
        if(res.code == '000'){
          this.$message.success('上传成功！')
          this.user.photoFileSaveName = res.data.saveFileName
        } else {
          this.$message.error(res.msg)
        }

        file.value = ''
      })
    },

    // 获取生日
    getBirthday(birthday){
      this.user.birthday = new Date(birthday).getTime()
    },
    // 获取人员数据
    getPersonData(){
      let id = this.personId
      this.$http.get(this.API.singleClomnData(id))
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            this.user = res.data
          }
        })
    }

  },
  mounted() {
    this.getPersonData()
  }
}
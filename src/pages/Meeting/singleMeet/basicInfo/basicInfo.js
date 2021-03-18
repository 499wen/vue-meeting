import { mapMutations, mapState } from 'vuex'
import { tips_blur } from '@/plugins/plugins.js'

let token = localStorage.getItem('token'),
  formbody = null, // 新建盒子 dom对象
  map = null // 地图对象
function rulesPerson(data){
  var value = null
  if(typeof data == 'number'){
    value = ['包含请假人员']
  } else { 
    var doesTheNumberLeave = 0
    if(data.includes('包含请假人员')){
      doesTheNumberLeave = 1
    }

    value = doesTheNumberLeave
  }

  return value
}

export default {
  data() {
    //检验会议开始时间 
    var checkBeginDate = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请先选择会议开始时间"));
      }
      //当前时间 
      let timestamp = new Date().getTime(); 
      //会议开始时间 
      let timestamp2 = new Date(value).getTime();

      //判断让会议开始时间不能早于当前时间 
      if (timestamp > timestamp2) {
        this.addForm.beginDate = ''
        return callback(new Error("会议开始时间不能早于当前时间"));
      } 
      callback();
    };
    //校验会议结束时间
    var checkEndDate = (rule, value, callback) => {
      if (!this.addForm.beginDate) {
        return callback(new Error("请先选择会议开始时间"));
      }
      if (!value) {
        return callback(new Error("请选择会议结束时间"));
      }
      //会议开始时间
      let beginDate = this.addForm.beginDate; 
      let timestamp = new Date(beginDate).getTime();
      //会议结束时间
      let timestamp2 = new Date(value).getTime();
      //判断让会议结束时间不能早于会议开始时间
      if (timestamp >= timestamp2) {
        this.addForm.endDate = ''
        return callback(new Error("会议结束时间不能早于等于会议开始时间"));
      }
      callback();
    };
    //校验签到开始时间
    var checkCheckBeginTime = (rule, value, callback) => {
      //若不为空
      if (value != null && value != "") {
        //签到开始时间
        let timestamp = new Date(value).getTime();
        //会议开始时间
        let beginDate = this.addForm.beginDate;
        let timestamp2 = new Date(beginDate).getTime();

        //判断让会议开始时间不能早于当前时间 
        // if (timestamp < new Date().getTime()) {
        //   this.addForm.checkBeginTime = ''
        //   return callback(new Error("签到开始时间不能早于当前时间"));
        // }

        //签到开始时间不能晚于会议开始时间
        if (timestamp > timestamp2) {
          this.addForm.checkBeginTime = "";
          return callback(new Error("签到开始时间不能晚于会议开始时间"));
        }
      }
      callback();
    };
    //校验签到结束时间
    var checkCheckEndTime = (rule, value, callback) => {
      //若不为空
      if (value != null && value != "") {
        if (!this.addForm.checkBeginTime) {
          // 没有签到开始时间
          this.addForm.checkEndTime = "";
          return callback(new Error("请选择签到开始时间"));
        } else {

          //签到开始时间
          let checkBeginTime = this.addForm.checkBeginTime;
          let timestamp = new Date(checkBeginTime).getTime();
          //签到结束时间
          let timestamp2 = new Date(value).getTime();
          //会议结束时间
          let endDate = this.addForm.endDate;
          let timestamp3 = new Date(endDate).getTime();
          //签到结束时间不能早于或等于签到开始时间
          if (timestamp >= timestamp2) {
            this.addForm.checkEndTime = "";
            return callback(new Error("签到结束时间不能早于或等于签到开始时间"));
          } else {
            //签到结束时间不能晚于或等于会议结束时间
            if (timestamp2 > timestamp3) {
              this.addForm.checkEndTime = "";
              return callback(new Error("签到结束时间不能晚于会议结束时间"));
            }
          }
        }
      } else {
        // 有签到开始没有签到结束时间
        if (this.addForm.checkBeginTime != null && this.addForm.checkBeginTime != "") {
          this.addForm.checkEndTime = "";
          return callback(new Error("请选择签到结束时间"));
        }
      }
      callback();
    };
    //校验报道开始时间
    var checkOrganizingRegisterStartTime = (rule, value, callback) => {
      //若不为空
      if (value != null && value != "") {
        if (!this.addForm.beginDate) {
          this.addForm.organizingRegisterStartTime = ''
          return callback(new Error("请先选择会议开始时间"));
        }
        //当前时间
        let timestamp = new Date().getTime();
        //会议开始时间
        let beginDate = this.addForm.beginDate;
        let timestamp2 = new Date(beginDate).getTime();
        //报道开始时间
        let timestamp3 = new Date(value).getTime();
        //判断让报道开始时间不能早于当前时间
        if (timestamp > timestamp3) {
          this.addForm.organizingRegisterStartTime = ''
          return callback(new Error("报道开始时间不能早于当前时间"));
        } else {
          //报道开始时间不能晚于会议开始时间
          if (timestamp3 >= timestamp2) {
            this.addForm.organizingRegisterStartTime = ''
            return callback(new Error("报道开始时间不能晚于或等于会议开始时间"));
          }
        }
      }
      callback();
    };
    //校验报道结束时间
    var checkOrganizingRegisterEndTime = (rule, value, callback) => {
      //若不为空
      if (value != null && value != "") {
        if (!this.addForm.beginDate) {
          this.addForm.organizingRegisterEndTime = ''
          return callback(new Error("请先选择会议开始时间"));
        }
        if (!this.addForm.organizingRegisterStartTime) {
          // 没有报到开始时间
          this.addForm.organizingRegisterEndTime = ''
          return callback(new Error("请选择报道开始时间"));
        }

        //会议开始时间
        let beginDate = this.addForm.beginDate;
        let timestamp2 = new Date(beginDate).getTime();
        //报道开始时间
        let organizingRegisterStartTime = this.addForm.organizingRegisterStartTime;
        let timestamp3 = new Date(organizingRegisterStartTime).getTime();
        //报道结束时间
        let timestamp4 = new Date(value).getTime();
        //判断让报道结束时间不能早于或等于报道开始时间
        if (timestamp3 >= timestamp4) {
          this.addForm.organizingRegisterEndTime = ''
          return callback(new Error("判断让报道结束时间不能早于或等于报道开始时间"));
        } else {
          //报道结束时间不能晚于会议开始时间
          if (timestamp4 >= timestamp2) {
            this.addForm.organizingRegisterEndTime = ''
            return callback(new Error("报道结束时间不能晚于或等于会议开始时间"));
          }
        }
      } else {
        // 有报道开始没有报道结束时间
        if (this.addForm.organizingRegisterStartTime != null && this.addForm.organizingRegisterStartTime != "") {
          this.addForm.organizingRegisterEndTime = "";
          return callback(new Error("请选择报道结束时间"));
        }
      }
      callback();
    };
    // 校验迟到时间
    var checkLayTime = (rule, value, callback) => {
      //若不为空
      if (value != null && value != "") {
        if (!this.addForm.beginDate) {
          return callback(new Error("请先选择会议开始时间"));
        }
        if (!this.addForm.endDate) {
          return callback(new Error("请先选择会议结束时间"));
        }
        //会议开始时间
        let beginDate = this.addForm.beginDate;
        let timestamp = new Date(beginDate).getTime();
        //迟到时间
        let timestamp2 = new Date(value).getTime();
        //会议结束时间
        let endDate = this.addForm.endDate;
        let timestamp3 = new Date(endDate).getTime();

        //迟到时间不能早于会议开始时间
        if (timestamp > timestamp2) {
          this.addForm.layTime = "";
          return callback(new Error("迟到时间不能早于会议开始时间"));
        } else {
          //迟到时间不能晚于或等于会议结束时间
          if (timestamp2 >= timestamp3) {
            this.addForm.layTime = "";
            return callback(new Error("迟到时间不能晚于或等于会议结束时间"));
          }
        }
      }
      callback();
    };
    // 校验早退时间
    var checkLeaveTime = (rule, value, callback) => {
      if (value != null && value != "") {
        if (!this.addForm.beginDate) {
          return callback(new Error("请先选择会议开始时间"));
        }
        if (!this.addForm.endDate) {
          return callback(new Error("请先选择会议结束时间"));
        }
        //会议开始时间
        let beginDate = this.addForm.beginDate;
        let timestamp = new Date(beginDate).getTime();
        //早退时间
        let timestamp2 = new Date(value).getTime();
        //会议结束时间
        let endDate = this.addForm.endDate;
        let timestamp3 = new Date(endDate).getTime();

        //早退时间不能早于或等于会议开始时间
        if (timestamp >= timestamp2) {
          this.addForm.leaveTime = "";
          return callback(new Error("早退时间不能早于或等于会议开始时间"));
        } else {
          //早退时间不能晚于或等于会议结束时间
          if (timestamp2 >= timestamp3) {
            this.addForm.leaveTime = "";
            return callback(new Error("早退时间不能晚于或等于会议结束时间"));
          }
        }
      }
      callback();
    };

    return {
      doesTheNumberLeave: ['包含请假人员'],
      addForm: {
        address: "",//会议地址
        meetingId: "",
        photoFileId: "",
        meetingName: "", //会议名称，
        meetingRoomId: "", //会议名称，
        type: "", //会议类型
        content: "", //会议内容
        beginDate: "",// 会议开始时间
        endDate: "",// 会议结束时间
        checkBeginTime: "", // 签到开始时间
        checkEndTime: "",// 签到结束时间
        parentMeetingId: "", //上级会议ID
        organizingRegisterStartTime: "", //会务组报到开始时间
        organizingRegisterEndTime: "", //会务组报到结束时间
        layTime: "", //迟到时间
        leaveTime: "", //早退时间
        longitude: "", //经度
        latitude: "", //纬度
        invitationWay: '0',
        leaveApprovalMethod: 1, // 请假审批方式
        strangersJoinIn: 0, 
        IsAttendanceNumber: 1,
        doesTheNumberLeave: '',
        sponsorArrJsonStr: [
          { type: "organizer", value: ""}
        ], //会议组织
        contactJson: [ 
          {
            name: "", //姓名
            duty: "", //职责 
            handPhone: "", //手机
            telePhone: "" //电话
          }
        ], //会议联系方式Json
        mattersNeedAttention: "", //注意事项
        meetingProduce: [
          { value: "" }
        ], //会议议程
        meetingInviteApproveCode: "1"
      },
      rules: {
        meetingName: [
          { required: true, message: "请输入会议名称", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请输入会议地址", trigger: "blur"}
        ],
        beginDate: [
          { required: true, validator: checkBeginDate, trigger: "blur" }
        ],
        endDate: [
          {required: true, validator: checkEndDate, trigger: "blur"}
        ],
        checkBeginTime: [
          { required: true, message: "请选择签到开始时间", trigger: "blur"},
          { validator: checkCheckBeginTime, trigger: "blur"}
        ],
        checkEndTime: [
          { required: true, message: "请选择签到结束时间", trigger: "blur"},
          { validator: checkCheckEndTime, trigger: "blur" }
        ],
        organizingRegisterStartTime: [
          { validator: checkOrganizingRegisterStartTime, trigger: "blur"}
        ],
        organizingRegisterEndTime: [
          { validator: checkOrganizingRegisterEndTime, trigger: "blur"}
        ],
        layTime: [
          { validator: checkLayTime, trigger: "blur"}
        ],
        leaveTime: [
          { validator: checkLeaveTime, trigger: "blur"}
        ]
      },
      headers: {},

      // 折叠板
      collapse: '',

      // 过期开关
      meetIsEnd: false,
      // 登录信息
      loginInfo: {},
      // del
      select: ''
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: {
    // vuex --- 
    ...mapMutations([
      'setMeetingData', 'setTest'
    ]),
    // 添加会议议程
    addProduce(){
      this.addForm.meetingProduce.push({ value: "" })
      console.log(formbody.scrollTop)
      formbody.scrollTop = 999999
    },
    // 删除会议议程
    delProduce(idx){
      this.addForm.meetingProduce.splice(idx, 1)
    },
    // 添加联系人
    addContact(){
      this.addForm.contactJson.push({
        name: "", //姓名
        duty: "", //职责
        handPhone: "", //手机
        telePhone: "" //电话
      })
      formbody.scrollTop += 140
    },
    // 删除联系人
    delContact(idx){
      this.addForm.contactJson.splice(idx, 1)
    },
    // 添加会议组织
    addSponsor(){
      this.addForm.sponsorArrJsonStr.push(
        { type: "organizer", value: ""}
      )
      formbody.scrollTop += 50
    },
    // 删除会议组织
    delSponsor(idx){
      this.addForm.sponsorArrJsonStr.splice(idx, 1)
    },
    // 修改 参会方式
    invitationWayChange(e){
      if(e == 0){
        this.addForm.strangersJoinIn = 0
      }
    },
    // 折叠板 change 事件
    collapseChange(activeNames){
      setTimeout(() => {
        formbody = document.querySelector('.form-body')
        formbody.scrollTop = 9000000
      }, 400)
    },
    // 添加会议
    save(){
      this.$refs['addForm'].validate((valid) => {
        if(valid){
          let form = JSON.parse(JSON.stringify(this.addForm))
          this.handle(form)
        }
      })
    },
    handle(param){
      param.leaveApprovalMethod = Number(param.leaveApprovalMethod)
      // 多级会议
      // if(this.query.meetingType == 1) {
      //   param.isMultistage = '1'
      // }
      param.beginDate = new Date(param.beginDate).getTime();
      param.endDate = new Date(param.endDate).getTime();

      // 时间转为时间戳
      if (param.checkBeginTime) param.checkBeginTime = new Date(param.checkBeginTime).getTime();
      if (param.checkEndTime) param.checkEndTime = new Date(param.checkEndTime).getTime();
      if (param.organizingRegisterStartTime) param.organizingRegisterStartTime = new Date(param.organizingRegisterStartTime).getTime();
      else param.organizingRegisterStartTime = 0
      if (param.organizingRegisterEndTime) param.organizingRegisterEndTime = new Date(param.organizingRegisterEndTime).getTime();
      else param.organizingRegisterEndTime = 0
      if (param.layTime) param.layTime = new Date(param.layTime).getTime();
      else param.layTime = 0
      if (param.leaveTime) param.leaveTime = new Date(param.leaveTime).getTime();
      else param.leaveTime = 0
      
      for (let i in this.query) {
        param[i] = this.query[i]
      }
      param.sponsorArrJsonStr = JSON.stringify(param.sponsorArrJsonStr);
      param.contactJson = JSON.stringify(param.contactJson);
      param.meetingProduce = JSON.stringify(param.meetingProduce);

      param.doesTheNumberLeave = rulesPerson(this.doesTheNumberLeave)
      param.latitude = String(param.latitude)
      param.longitude = String(param.longitude)

      this.$http.post(this.API.saveMeeting, param)
        .then((res) => {
          if(res.code == '000') {
            this.$message.success('添加成功!')

            this.addForm.id = res.data
            this.setMeetingData(this.addForm)
            // 初始化参会人分组
            this.initGroup(res.data)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    // 初始化参会人分组
    initGroup(meetIngId){
      this.$http.post(this.API.initMeetingAllConfereeGroup(meetIngId))
        .then(res => {})
    },
    // 上传封面 
    uploadSuccess(res){

    },
    // 上传状态
    beforeAvatarUpload(){

    },

    // 获取实时地址
    addressFact(val){
      map.centerAndZoom(val, 18)
      map.addOverlay(new BMap.Marker(val));    // 添加标注
    },
    map() {
      let that = this
      map = new BMap.Map("baidu-map")
      map.centerAndZoom(this.addForm.address || "广州市",18);                   // 初始化地图,设置城市和地图级别。
    
      var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {"input" : "suggestId"
        ,"location" : map
      });
    
      var myValue;
      ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
      var _value = e.item.value;
        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        
        // 赋值给vue 
        that.addForm.address = myValue
        setPlace();
      });
    
      function setPlace(){
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun(){
          var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
          map.centerAndZoom(pp, 18);
          map.addOverlay(new BMap.Marker(pp));    // 添加标注
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }
    }
  },
  mounted() {
    // 获取登录公司信息
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    this.addForm.departmentId = this.loginInfo.companyId

    console.log(this.meetingData)

    // 获取地图
    this.map()

    if(this.meetingData.id){
      setTimeout(() => {
        // 回显数据
        this.addForm = this.meetingData
        this.doesTheNumberLeave = rulesPerson(this.meetingData.doesTheNumberLeave)
        map.centerAndZoom(this.addForm.address, 18)
        map.addOverlay(new BMap.Marker(this.addForm.address));    // 添加标注
  
        setTimeout(() => {
          tips_blur()
        }, 500)
      }, 500)
    }

    // this.$http.post(this.API.addHotelByCustomer, this.addForm)
    //     .then((res: any) => {
    //       console.log(res)
    //     })
  }
}
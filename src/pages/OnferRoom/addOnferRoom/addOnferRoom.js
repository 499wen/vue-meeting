let token = localStorage.getItem('token')

function G(id) {
  return document.getElementById(id);
}

export default {
  data() {
    return {
      ruleForm: {
				id: '',
				photoFileId: '',//会场图文件ID
				drawingOfSiteFileId: '',//平面图文件ID
				name: '', //会议室名称
				type: '', //类型：0-方形, 1-椭圆, 2-圆桌形
				maximumCapacity: '', //最大容纳人数
				// deleteStateCode:'',//是否被删除的状态
				address: '', //会议室地址
				notes:'',//备注信息
				longitude: 38.912046,//经度
				latitude: 115.572521,//纬度
				projector: 0, //设备: 投影
				bigScreen: 0, //设备: 液晶大屏
				microphone: 0, //设备: 话筒
				wirelessMicrophone: 0, //设备: 无线话筒
				simultaneousInterpretation: 0, //设备: 同声传译
				electronicTable: 0, //设备: 电子桌牌
				loudspeaker: 0, //设备: 音箱
				time: ["00:00:00", "23:59:59"],
				appointmentApplyApprovalMode: null, // 审批模式 1自动通过 0人工审批
      },
      rules: {
				maximumCapacity: [
          { required: true,	message: '请选择容纳人数', trigger: 'blur' }
        ],
				name: [
          { required: true, message: '请输入会议室名称', trigger: 'blur' }
        ],
				type: [
          { required: true, message: '请选择会议室类型', trigger: 'blur' }
        ],
				address: [
          { required: true, message: '请输入会议室地址', trigger: 'blur' }
        ],
				appointmentApplyApprovalMode: [
          { required: true, message: '请选择审批模式', trigger: 'blur' }
        ],
      },
      // 复选框数据
			checkboxList: [
				{ value: '0', label: '投影仪', },
				{ value: '1', label: '液晶大屏', },
				{ value: '2', label: '话筒', },
				{ value: '3', label: '无线话筒', },
				{ value: '4', label: '同声传译', },
				{ value: '5', label: '电子桌牌', },
				{ value: '6', label: '音箱', },
      ],
      equipmentType: [],
      
      headers: {},
      dayNum: '2016-9-10',
    }
  },
  methods: {
    // 添加
    save(){
      this.$refs.ruleForm.validate((valid) => {
        if(valid){
          // 取出数据
          let form = this.handleAddData()

          this.$http.post(this.API.saveRoom, form)
            .then(res => {
              if(res.code == '000') {
                this.$message.success('添加成功!')
                this.$router.go(-1)
              } else {
                this.$message.error(res.msg)
              }
            })
        }
      })
    },

    // 处理数据
    handleAddData(){
      let form = {...this.ruleForm}, { time } = form, equipmentType = this.equipmentType

      // 处理时间
			if(time){
				var st = this.dayNum + ' ' + time[0], et = this.dayNum + ' ' + time[1]
				form.openStartTime = new Date(st).getTime() - new Date(new Date(st).toLocaleDateString()).getTime()
				form.openEndTime = new Date(et).getTime() - new Date(new Date(et).toLocaleDateString()).getTime()
			}
			
      delete form.time

      // 处理设备
      let equi = [
        { name: '投影仪', type: 'projector' },
        { name: '液晶大屏', type: 'bigScreen' },
        { name: '话筒', type: 'microphone' },
        { name: '无线话筒', type: 'wirelessMicrophone' },
        { name: '同声传译', type: 'simultaneousInterpretation' },
        { name: '电子桌牌', type: 'electronicTable' },
        { name: '音箱', type: 'loudspeaker' },
      ]

      equi.filter(item => equipmentType.includes(item.name) ? form[item.type] = '1' : form[item.type] = '0')
			form.appointmentApplyApprovalMode = String(form.appointmentApplyApprovalMode)
      
      return form
    },
    // 选择时间
    sj(val){
			this.ruleForm.time = val
		},
    // 上传封面 
    uploadSuccess(res){

    },
    // 上传状态
    beforeAvatarUpload(){

    },
    map() {
      var map = new BMap.Map("baidu-map"), that = this
      map.centerAndZoom("北京",18);                   // 初始化地图,设置城市和地图级别。
    
      var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {"input" : "suggestId"
        ,"location" : map
      });
    
      var myValue;
      ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
      var _value = e.item.value;
        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        
        // 赋值给vue 
        that.ruleForm.address = myValue
        setPlace();
      });
    
      function setPlace(){
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun(){
          var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
          map.centerAndZoom(pp, 18);
          map.addOverlay(new BMap.Marker(pp));    //添加标注
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }
    }
  },
  mounted() {
    this.map()
    // console.log(this.$http)
    // this.$http.post(this.API.addHotelByCustomer, this.ruleForm)
    //     .then((res: any) => {
    //       console.log(res)
    //     })
  }
}
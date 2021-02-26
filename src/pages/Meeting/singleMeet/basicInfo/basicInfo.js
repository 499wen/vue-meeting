  let token = localStorage.getItem('token')

function G(id) {
  return document.getElementById(id);
}

export default {
  data() {
    return {
      addForm: {
        restauranAddress: "", // 地址
        restaurantName: '', // 会议名称
        restaurantPhoto: "" , // 封面
        restaurantType: '', // 类型
        restaurantPresentation: '', // 介绍
        gpsLat: 32.013, // 
        gpsLng: 24.1123,
        planeFigure: '', // 平面图
      },
      cover: '',
      rules: {
        restaurantName: [
          { required: true, message: '请输入会议名称', trigger: 'blur' },
        ],
        restauranAddress: [
          { required: true, message: '请输入会议地址', trigger: 'blur' }
        ]
      },
      headers: {},

      // 折叠板
      collapse: '',

      // 过期开关
      meetIsEnd: false,


      // del
      select: ''
    }
  },
  methods: {
    // 折叠板 change 事件
    collapseChange(activeNames){
      setTimeout(() => {
        let formbody = document.querySelector('.form-body')
        formbody.scrollTop = 9000000
      }, 400)
    },
    // 添加会议
    save(){
      this.$refs['addForm'].validate((valid) => {
        if(valid){
          this.$http.post(this.API.saveRestaurant, this.addForm)
            .then((res) => {
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
        that.addForm.restauranAddress = myValue
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
    // this.$http.post(this.API.addHotelByCustomer, this.addForm)
    //     .then((res: any) => {
    //       console.log(res)
    //     })
  }
}
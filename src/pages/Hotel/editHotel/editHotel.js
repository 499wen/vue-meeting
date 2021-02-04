let token = localStorage.getItem('token')

function G(id) {
  return document.getElementById(id);
}

export default {
  data() {
    return {
      ruleForm: {
        hotelName: "", //酒店名称
        address: "", //详细地址
        capacity: null, //容纳人数
        gpsLat: "", //纬度
        gpsLng: "", //经度
        imageUrl: "", //酒店图片
        remark: "" //描述
      },
      cover: '',
      rules: {
        hotelName: [
          { required: true, message: '请输入酒店名称', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: '请输入容纳人数', trigger: 'blur' }
        ],
        restaurantType: [
          { required: true, message: '请输入酒店类型', trigger: 'blur' }
        ],
        restaurantPhoto: [
          { required: true, message: '请添加酒店封面', trigger: 'blur' }
        ]
      },
      headers: {},
      hotelId: null
    }
  },
  methods: {
    // 添加酒店
    save_hotel(){
      this.$refs['ruleForm'].validate((valid) => {
        if(valid){
          this.$http.post(this.API.updateHotelByCustomer, this.ruleForm)
            .then((res) => {
              if(res.code == '000') {
                this.$message.success('修改成功!')
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
      map.centerAndZoom("北京天安门", 18);                   // 初始化地图,设置城市和地图级别。
    
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

    },
    // 获取酒店数据
    getData(){
      let id = this.hotelId
      this.$http.get(this.API.findHotelById(id))
        .then(res => {
          if(res.code == '000'){
            this.ruleForm = res.data

            setTimeout(() => {
              this.tips_blur()
            }, 300)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    // 地址栏获取数据失去焦点
    tips_blur (){
      let tipsArr = document.querySelectorAll('.tangram-suggestion-main')
      for(let i = 0; i < tipsArr.length; i ++){
        tipsArr[i].style.display = 'none'
      }
    }
  },
  mounted() {
    this.hotelId = this.$route.query.id
    this.map()

    setTimeout(() => {
      this.getData()
    }, 1000)
  }
}
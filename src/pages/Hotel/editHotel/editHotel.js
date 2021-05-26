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
        hotelImageUrl: "", //酒店图片
        remark: "", //描述
        hotelPlaneImageUrl: '', // 平面图
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
    // 修改酒店
    save_hotel(){
      let form = {...this.ruleForm}
      form.capacity = Number(form.capacity)
      this.$refs['ruleForm'].validate((valid) => {
        if(valid){
          this.$http.post(this.API.updateHotelByCustomer, form)
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
    // 上传图片
    updateLoad(e){
      // 文件数据
      let file = this.$refs.file, files
      files = file.files[0]

      this.fileUpload(files, 'HotelImage', res => {
        if(res.code == '000'){
          this.$message.success(res.msg)
          this.ruleForm.hotelImageUrl = res.data.saveFileName
        } else {
          this.$message.error(res.msg)
        }

        file.value = ''
      })
    },
    // 上传平面图
    updateLoad_pml() {
      // 文件数据
      let file = this.$refs.file_pmt, files
      files = file.files[0]

      this.fileUpload(files, 'HotelPlane', res => {
        if(res.code == '000') {
          this.$message.success(res.msg)
          this.ruleForm.hotelPlaneImageUrl = res.data.saveFileName
        } else {
          this.$message.error(res.msg)
        }

        file.value = ''
      })
    },
    map() {
      var map = new BMap.Map("baidu-map"), that = this
      map.centerAndZoom(that.ruleForm.address, 18);                   // 初始化地图,设置城市和地图级别。
    
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
            this.map()
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
    

    setTimeout(() => {
      this.getData()
    }, 1000)
  }
}
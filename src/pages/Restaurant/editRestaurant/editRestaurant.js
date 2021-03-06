let token = localStorage.getItem('token')

export default {
  data() {
    return {
      id: '',
      ruleForm: {
        restauranAddress: "", // 地址
        restaurantName: '', // 餐厅名称
        maxPeopleNumber: '', // 容纳人数
        restaurantPhoto: "" , // 封面
        restaurantType: '', // 类型
        restaurantPresentation: '', // 介绍
        gpsLat: '', // 
        gpsLng: '',
        planeFigure: '', // 平面图
      },
      cover: '',
      rules: {
        restaurantName: [
          { required: true, message: '请输入餐厅名称', trigger: 'blur' },
        ],
        restauranAddress: [
          { required: true, message: '请输入餐厅地址', trigger: 'blur' }
        ],
        maxPeopleNumber: [
          { required: true, message: '请输入容纳人数', trigger: 'blur' }
        ],
        restaurantType: [
          { required: true, message: '请输入餐厅类型', trigger: 'blur' }
        ],
        restaurantPhoto: [
          { required: true, message: '请添加餐厅封面', trigger: 'blur' } 
        ]
      },
      headers: {}
    }
  },
  methods: { 
    // 提交 修改 
    save(){
      this.$refs['ruleForm'].validate((valid) => {
        if(valid){
          this.$http.post(this.API.updateRestaurant, this.ruleForm)
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
    succ(){
      console.log('成功!')
    },
    // 上传图片
    updateLoad(e){
      // 文件数据
      let file = this.$refs.file, files
      files = file.files[0]

      this.fileUpload(files, 'Restaurant', res => {
        if(res.code == '000'){
          this.$message.success(res.msg)
          this.ruleForm.restaurantPhoto = res.data.saveFileName
        } else {
          this.$message.error(res.msg)
        }

        file.value = ''
      })
    },

    // 上传平面图
    updateLoad_pml(){
      // 文件数据
      let file = this.$refs.file_pmt, files
      files = file.files[0]

      this.fileUpload(files, 'RestaurantPlane', res => {
        if(res.code == '000') {
          this.$message.success(res.msg)
          this.ruleForm.planeFigure = res.data.saveFileName
        } else {
          this.$message.error(res.msg)
        }
        file.value = ''
      })
    },
    map() {
      var map = new BMap.Map("baidu-map"), that = this
      console.log('地址', that.ruleForm.restauranAddress)
      map.centerAndZoom(that.ruleForm.restauranAddress,18);                   // 初始化地图,设置城市和地图级别。
    
      var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {"input" : "suggestId"
        ,"location" : map
      });
    
      var myValue;
      ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
      var _value = e.item.value;
        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        
        // 赋值给vue
        that.ruleForm.restauranAddress = myValue
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
    // 获取餐厅数据
    getData(){
      let id = this.id
      this.$http.get(this.API.selectRestaurantById(id))
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
    this.id = this.$route.query.id

    setTimeout(() => {
      this.getData()
    }, 100)
  }
}
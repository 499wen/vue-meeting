import addRoom from './addRoom/addRoom.vue'
import editRoom from './editRoom/editRoom.vue'

export default {
  props: ['building'],
  components: {
    addRoom,
    editRoom
  },
  data() {
    return {
      // tree
      data: [
        { id: 1, floor: '全部楼层',
          children: []
        }
      ],
      treeProps: {
        children: 'children',
        label: 'floor'
      },

      searchKey: '',

      // table
      tableData: [],
      tableCate: [
        {props: 'roomNumber', label: '房间号', width: ''},
        {props: 'roomType', label: '房间类型', width: ''},
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      // 当前处理的楼层
      curFloor: null,
      // 当前处理的房间
      editItem: null,

      // 子集组件 开关
      addRoom_child: false,
      editRoom_child: false
    }
  },
  methods: {
    // 点击 tree
    treeClick(data){
      console.log(data)
      this.curFloor = data
      this.searchData()
    },
    // tree - 树
    renderContent(h, { node, data, store }) {
      if(node.level == 1){
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" class="el-icon-circle-plus-outline" on-click={ (e) => this.append(data, e) }></el-button>
            </span>
          </span>);
      } else {
        return (
          <span class="custom-tree-node">
            <span>第{node.label}层</span>
            <span>
              <el-button size="mini" type="text" class="el-icon-delete" on-click={ (e) => this.remove(node, data, e) }></el-button>
            </span>
          </span>);
      }
    },
    // tree - 添加
    append(data, e){
      e.stopPropagation();
      e.preventDefault(); 
      console.log(data)
      var num = []
      data.children.filter(item => num.push(item.floor))

      this.$prompt('请输入楼层', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        inputValidator: (val) => {
          val = val.trim()
          if(!val){
            return '请输入楼层' 
          } else if(Number(val) != val){
            return '请输入数字'
          } else if(num.includes(Number(val))){
            return '楼层重复!'
          }
        }
      }).then(({ value }) => {
        this.addFloor(value)
      }).catch((err) => {})
    }, 
    // 添加楼层
    addFloor(val){
      var obj = {
        "hotelBuildingId": this.building.id,
        floor: Number(val)
      }
      this.$http.post(this.API.addFloor, obj)
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            this.$message.success('添加成功!')
            this.getTree()
          } else {
            this.$message.info(res.msg)
          }
        })
    },
    // tree - 删除
    remove(node, data, e){
      e.stopPropagation();
      e.preventDefault();
      this.$confirm('是否删除该楼层?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {

        this.delFloor(data.id)
      }).catch(() => {})
    },
    // 删除楼层
    delFloor(id){
      this.$http.post(this.API.deleteFloorById(id))
        .then(res => {
          if(res.code == '000'){
            this.$message.success('删除成功!');
            this.pageNum = 1
            this.getTree()
          } else {
            this.$message.info(res.msg)
          }
        })
    },

    // 添加房间 - 按钮
    addRoom(){
      let floor = this.data[0].children
      // if(!floor.length){
      //   this.$message.error('请先添加楼层!')
      //   return
      // }
      if(!this.curFloor.id || this.curFloor.id == 1){
        this.$message.error('请选择楼层!')
        return
      }
      this.addRoom_child = true
    },

    // 编辑房间
    editRoomBtn(row){
      row.type = String(row.type)
      this.editItem = {...row}

      this.editRoom_child = true
    },

    // 删除房间
    delRoom(id){
      this.$confirm('是否删除该房间?', '提示', {
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.$http.post(this.API.delectHotelRoomById(id))
          .then(res => {
            console.log(res)
            if(res.code == '000'){
              this.$message.success('删除成功！')
              this.pageNum = 1
              this.searchData()
            } else {
              this.$message.error(res.msg)
            }
          })
      }).catch({})
    },

    // 搜索按钮
    searchBtn(){
      this.searchData()
    },

    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val
      this.searchData()
    },
    curChange(val){
      this.pageNum = val
      this.searchData()
    },

    // 子组件 方法
    submitForm() {
      let child = this.$refs.addRoom, 
        form = {...child.form}

      child.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let url = null
          for(let i in form){
            if(i != 'hotelRoomType' && i != 'hotelRoomGrade' && i != 'hotelBuildId')
              form[i] = form[i] && Number(form[i])
          }
          if(child.addType == '1'){
            delete form.startRoomNumber
            delete form.generateNumber
            delete form.eachCapacity
            
            form.hotelRoomGrade = Number(form.hotelRoomGrade)
            form.hotelBuildingId = this.building.id
            url = this.API.addHotelRoom(this.curFloor.id)
          } else {
            delete form.roomNumber
            delete form.hotelRoomGrade

            form.eachCapacity = form.hotelRoomType
            url = this.API.massProductionByHotel(this.curFloor.id)
            form = [form]
          }
          
          this.$http.post(url, form)
            .then(res => {
              console.log(res)
              if(res.code == '000'){
                this.$message.success('添加成功!')
                this.searchData()
                this.total = res.total
                this.addRoom_child = false
                
              } else {
                this.$message.info(res.msg)
              }
            })
        } 
      });
    },
    editSave() {
      let child = this.$refs.editRoom, form = child.editItem
      child.$refs['form1'].validate((valid) => {
        if (valid) {
          form.floor = form.floor && Number(form.floor)
          form.hotelRoomType = form.hotelRoomType && Number(form.hotelRoomType)
          form.roomNumber = form.roomNumber && Number(form.roomNumber)

          this.$http.post(this.API.updateHotelRoom, form)
            .then(res => {
              console.log(res)
              if(res.code == '000'){
                this.$message.success('修改成功!')
                this.editRoom_child = false
                this.searchData()
              } else {
                this.$message.info(res.msg)
              }
            })
        }
      })
    },
    cancel(){
      this.addRoom_child = false
      this.editRoom_child = false
    },

    // 搜索数据
    searchData(){
      // return 
      // pageHotelRoomByLike(this.hotel.hotelId, this.hotel.id, this.pageNum, this.pageSize, this.searchKey, this.rType)
      this.$http.get(this.API.getRoom(this.curFloor.id, this.pageNum, this.pageSize, this.searchKey))
        .then(res => {
          console.log(res)
          // 双：双人房 单：单人房
          if(res.code == '000'){
            res.data.filter(item => {
              // item.type = item.type == '单' ? '单人房' : '双人房'
              item.roomType = item.hotelRoomType == '1' ? '单人房' : '双人房'
            })
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    },
    // 获取楼层
    getTree(){
      this.$http.get(this.API.selectFloorByHotelId(this.building.id))
        .then(res => {
          if(res.code == '000') {
            res.data = res.data.sort((cur, next) => cur.floor - next.floor)
            this.data[0].children = res.data
            this.curFloor = res.data[0]

            // 查询房间
            this.searchData()
          } else {
            this.data[0].children = []
          }
        })
    }
  },

  mounted() {
    // 获取楼层
    this.getTree()

    // 默认高亮
    this.$refs['room-tree'].setCurrentKey('1')
  }
}
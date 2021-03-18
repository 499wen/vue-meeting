<template>
  <div class="room">
    <div class="data-show">
      <!-- tree - 树结构 -->
      <div class="data-show-tree">
        <el-tree
          :data="data"
          :props="treeProps"
          node-key="id"
          default-expand-all
          @node-click='treeClick'
          :expand-on-click-node="false"
          :highlight-current="true"
          :render-content="renderContent">
        </el-tree>
      </div>

      <!-- 表格数据 -->
      <div class="data-show-table">
        <div class="room-top"> 
          <el-input size="small" placeholder="请输入会议名称" v-model="searchKey" @keyup.native.enter="searchBtn" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
          </el-input>
          <el-button type="primary" size="small" @click="addRoom">添加房间</el-button>
        </div>

        <!-- table -->
        <el-table ref="singleTable"
          :data="tableData" border :height="400">
          <el-table-column align="center" :resizable='false' type="selection" width="50"></el-table-column>
          <el-table-column type="index" width="50" label="序号" align="center" :resizable="false"></el-table-column>
          <el-table-column :prop="item.props" :label="item.label" :width="item.width"
            v-for="(item, idx) in tableCate" :key="idx"
            align="center" :resizable="false">
          </el-table-column>
          <el-table-column align="center" :resizable='false' label="操作" width='160'>
            <template slot-scope="scope">
              <el-button @click="editRoomBtn(scope.row)" type="primary" size="small" round>编辑</el-button>
              <el-button @click="delRoom(scope.row.id)" type="danger" size="small" round>删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagin">
          <el-pagination
          background
          @size-change="sizeChange"
          @current-change="curChange"
          :current-page="pageNum"
          :page-sizes="[10, 50, 100, 300]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 添加房间 -->
    <el-dialog title="添加房间" :visible.sync="addRoom_child" width="10%" center append-to-body
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <addRoom ref="addRoom" v-if="addRoom_child"></addRoom>
      <div class="dialog-btn">
        <el-button type="primary" @click="submitForm()" size="small" round>添 加</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改房间 -->
    <el-dialog title="修改房间" :visible.sync="editRoom_child" width="10%" center append-to-body
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <editRoom ref="editRoom" v-if="editRoom_child" :editItem='editItem'></editRoom>
      <div class="dialog-btn">
        <el-button type="primary" @click="editSave()" size="small" round>修 改</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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
      pageSize: 1000,

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
  }
}
</script>

<style scoped lang='less'>
.room {
  .data-show {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-content: flex-start;

    .data-show-tree {
      border: 1px solid #ccc;
      width: 180px;
      padding-top: 10px;
      margin-right: 20px;
      box-sizing: border-box;
    }

    .data-show-table {
      border: 1px solid #ccc;
      padding: 10px;
      width: calc(100% - 200px);
      box-sizing: border-box;

      .room-top {
        width: 100%;
        padding-left: 50%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        box-sizing: border-box;
        margin-bottom: 10px;

        .room-search {
          width: 30%;
          display: flex;
          min-width: 500px;
        }
      }
    }
  }
}
</style>
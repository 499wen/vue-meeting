<template>
  <div class="noPhotos">
    <div class="no-person">
      <!-- 内外部 -->
      <div class="no-type">
        <el-switch class="switch" v-model="internal" active-color="#234060" inactive-color="#ccc" inactive-text="内部人员"></el-switch>
        <el-switch class="switch" v-model="external" active-color="#234060" inactive-color="#ccc" inactive-text="外部人员"></el-switch>
      </div>

      <!-- table -->
      <div class="table">
        <el-table ref="singleTable"
          :data="tableData" border :height="height">
          <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' label="选择" width='60'>
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="chioce(scope.row.id)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" :prop="item.props" :label="item.label" :width="item.width"
            v-for="(item, idx) in tableCate" :key="idx"
            align="center" :resizable="false">
          </el-table-column>
        </el-table>
      </div>

      <!-- 数据总和 -->
      <div class="data-total">{{ total }}人</div>
    </div>
    <div class="no-image">
      <div class="no-title">
        <span>未匹配照片</span>
        <el-button v-preventReClick size="mini" @click="delAll">删除全部照片</el-button>
      </div>

      <!-- 存放照片 -->
      <div class="deposit-photo">
        <div class="phtot-box" v-for="(item, idx) in imgList" :key="idx">
          <!-- 照片 -->
          <img :src="API.echoImage(item.saveFileName, 'HeadFile')" alt="" class="photo">

          <!-- 名字 -->
          <span class="photo-name">{{ item.photoName }}</span>

          <!-- 选择按钮 -->
          <el-checkbox v-model="item.checked" class="chioce" @change="imgCheck($event, idx, item.checked)"></el-checkbox>

        </div>
      </div>

      <!-- 照片总和 -->
      <div class="img-total">{{ itotal }}张</div>
    </div>
  </div>
</template>

<script>
import { dataScrollLoad } from '@/plugins/plugins.js'
let bool = true

export default {
  data() {
    return {
			internal: true, // 内部人员
      external: true, // 外部人员
      
      // 分页
      pageNum: 1,
      pageSize: 99999,
      total: 0,

      // table
      height: null,
      tableData: [],
      tableCate: [
        {props: 'userName', label: '姓名', width: '80'},
        {props: 'departmentName', label: '部门', width: ''},
      ],
      userId: '',

      // 图片数据
      ipageNum: 1,
      ipageSize: 99999,
      itotal: 0,
      imgList: [
        // {checked: false}, {checked: false}, {checked: false}
      ],
      fileInfoId: ''
    }
  },
  methods: {
    // 删除全部照片
    delAll(){
      this.$confirm('是否删除全部照片?', '提示', {  
        closeOnPressEscape: false,
        closeOnClickModal: false,
        cancelButtonClass: 'btn_custom_cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.API.deleteNotMatchingPhoto)
          .then(res => {
            if(res.code == '000') {
              this.$message.success('删除成功!')
              this.ipageNum == 1
              this.imgList = []
            } else {
              this.$message.error(res.msg)
            }
          })
      }).catch(() => {})
    },
    // 选择相片
    imgCheck(val, rowIndex, row){
      // console.log(val, rowIndex, row)
      const data = this.imgList;
      for (let index in data) {
        if (index == rowIndex) {
          data[index].checked = val;
          this.fileInfoId = data[index].id
        } else {
          data[index].checked = false;
        }
      }
      this.imgList = data;
    },
    // 选择人员
    chioce(id){
      this.userId = id
      this.tableData.filter(item => id == item.id ? item.select = true : item.select = false)
    },

    // 获取人员数据
    getNoPerosn(){
      if(this.pageNum == 1) this.tableData = []
      let type = this.internal ?
        this.external ? "all" : "internal" : 
        "external";
      this.$http.get(this.API.findAllUserNoPhotoForCompany(type, this.pageNum, 99, ''))
        .then(res => {
          console.log(res)
          if(res.code == '000' && res.data){
            res.data.filter(item => {
              item.select = false
              !item.departmentName ? item.departmentName = this.loginInfo.companyName : ''
            })
            this.total = res.total
            this.tableData.push(...res.data)
          } else {
            this.tableData = []
            this.total = 0
          }
          bool = true
        })
    },


    // 获取相片数据
    getNoPhoto(){
      if(this.ipageNum == 1) this.imgList = []
      this.$http.get(this.API.getNotMatchingPhoto(this.ipageNum, 20))
        .then(res => {
          if(res.code == '000') {
            res.data.filter(item => {
              item.checked = false
              item.photoName = item.originalName.substr(0, item.originalName.lastIndexOf('.'))
            })
            // 二次分页处理
            this.itotal = res.count
            this.imgList.push(...res.data)

          } else {
            this.itotal = 0
            this.imgList = []
          }

          bool = true
        })
    },
    // dom scroll 监听
    imgScroll() {
      let _dom = document.querySelector('.deposit-photo'),
      that = this
      _dom.onscroll = function(e){
        let total = that.itotal, totalData = that.imgList
        // 数据不够 不执行逻辑
        if(total > totalData.length && bool){
          
          let scrollHeight = _dom.clientHeight,
              scrollTop = _dom.scrollTop,
              totalHeight = _dom.scrollHeight

          // 滚动条距底20长度 触发
          if((totalHeight - scrollHeight - scrollTop) <= 20){
            bool = false
            that.ipageNum ++
            // 分割数据
            // callBack(totalData.slice(0, num * size))
            that.getNoPhoto()
          }

        }    
      }
    },

    // dom scroll 监听
    domScroll() {
      let _dom = document.querySelector('.noPhotos .el-table__body-wrapper'),
       that = this
      _dom.onscroll = function(){
        
        let total = that.total, totalData = that.tableData
        // 数据不够 不执行逻辑
        if(total > totalData.length && bool){
          let scrollHeight = _dom.clientHeight,
              scrollTop = _dom.scrollTop,
              totalHeight = _dom.scrollHeight

          // 滚动条距底20长度 触发
          if((totalHeight - scrollHeight - scrollTop) <= 20){
            bool = false
            that.pageNum ++
            // 分割数据
            // callBack(totalData.slice(0, num * size))
            that.getNoPerosn()
          }

        }    
      }
    }
  },
	watch: {
		internal: function(val) {
			this.pageNum = 1
			if (!val) {
				this.external = true;
			}

			this.getNoPerosn();
		}, //internal
		external: function(val) {
			this.pageNum = 1
			if (!val) {
				this.internal = true;
			}

			this.getNoPerosn();
    }, //external


  },
  mounted() {
    let dom = document.querySelector('.deposit-photo')
    this.height = dom.offsetHeight

    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'))

    // 获取人员
    this.getNoPerosn()

    // 获取图片
    this.getNoPhoto()

    setTimeout(() => {
      // 人员表格 dom监听
      this.domScroll()
      this.imgScroll()
    }, 1000);
  }
}
</script>

<style scoped lang='less'>
.noPhotos {
  width: 100%;
  height: 520px;
  display: flex;
  justify-content: space-between;
  align-content: flex-start;

  .no-person {
    width: 360px;
    height: 100%;

    .no-type {
      width: 100%;
      margin-bottom: 10px;

      .switch {
        margin-right: 10px;
      }
    }

    .table {
      width: 100%;
      height: calc(100% - 70px);
    }

    .data-total {
      width: 100%;
      height: 30px;
      margin-top: 10px;
      background-color: #ffa500;
      text-align: center;
      line-height: 30px;
      color: #fff;
      font-size: 15px;
    }
  }

  .no-image {
    width: calc(100% - 370px);
    height: 100%;

    .no-title {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      font-size: 16px;
    }

    .no-title:before {
      content: '';
      width: 100px;
      height: 5px;
    }

    .deposit-photo {
      width: 100%;
      height: calc(100% - 70px);
      border: 1px solid #ccc;
      box-sizing: border-box;
      padding: 10px;
      display: flex;
      justify-content: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
      overflow-y: auto;

      .phtot-box {
        width: 100px;
        height: 190px;
        position: relative;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        align-content: flex-start;

        .photo {
          width: 100%;
          height: 160px;
        }

        .photo-name {
          width: 100%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .chioce {
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }

    .img-total {
      width: 100%;
      height: 30px;
      margin-top: 10px;
      background-color: #ffa500;
      text-align: center;
      line-height: 30px;
      color: #fff;
      font-size: 15px;
    }

  }
}
</style>
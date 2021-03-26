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
          <el-table-column :show-overflow-tooltip="true" align="center" :resizable='false' type="selection" width="50"></el-table-column>
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
        <el-button size="mini">清空全部照片</el-button>
      </div>

      <!-- 存放照片 -->
      <div class="deposit-photo">
        <div class="phtot-box" v-for="(item, idx) in imgList" :key="idx">
          <!-- 照片 -->
          <img src="" alt="" class="photo">

          <!-- 名字 -->
          <span class="photo-name">崖域</span>

          <!-- 选择按钮 -->
          <el-checkbox v-model="item.checked" class="chioce" @change="imgCheck($event, idx, item.checked)"></el-checkbox>

        </div>
      </div>

      <!-- 照片总和 -->
      <div class="img-total">{{ total }}张</div>
    </div>
  </div>
</template>

<script>
import { dataScrollLoad } from '@/plugins/plugins.js'

export default {
  data() {
    return {
			internal: true, // 内部人员
      external: false, // 外部人员
      
      // 分页
      pageNum: 1,
      pageSize: 50,
      total: 0,

      // table
      height: 430,
      tableData: [],
      tableCate: [
        {props: 'userName', label: '姓名', width: '80'},
        {props: 'departmentName', label: '部门', width: ''},
      ],

      // 图片数据
      imgList: [
        {checked: false}, {checked: false}, {checked: false}
      ]
    }
  },
  methods: {
    // 获取人员数据
    getNoPerosn(){
      let type = this.internal ?
        this.external ?
        "all" :
        "internal" : 
        "external";
      this.$http.get(this.API.findAllUserNoPhotoForCompany(type, this.pageNum, this.pageSize, ''))
        .then(res => {
          console.log(res)
          if(res.code == '000' && res.data){
            res.data.filter(item => !item.departmentName ? item.departmentName = this.loginInfo.companyName : '')
            this.total = res.total
            let table_scroll = document.querySelector('.el-table__body-wrapper')
            dataScrollLoad(table_scroll, res.data, this.pageNum, this.pageSize, (result) => {
              this.tableData = result
            })
          }
        })
    },

    // 
    imgCheck(val, rowIndex, row){
      console.log(val, rowIndex, row)
      const data = this.imgList;
			for (let index in data) {
				if (index == rowIndex) {
					data[index].checked = val;
				} else {
					data[index].checked = false;
				}
			}
			this.imgList = data;
    }
  },
	watch: {
		internal: function(val) {
			this.pageNum = 1
			if (!val) {
				this.external = true;
			}

			// this.getNameData();
		}, //internal
		external: function(val) {
			this.pageNum = 1
			if (!val) {
				this.internal = true;
			}

			// this.getNameData();
		}, //external
  },
  mounted() {
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'))

    this.getNoPerosn()
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
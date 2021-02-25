<template>
  <div class="addAtte">
    <el-form ref="addForm" :model="addRoomForm" :rules="addFormRules" label-width="80px" class="head">
      <el-form-item label="选择酒店" prop="hotelRoomId" size="small">
          <el-cascader :props="props" :options="options" v-model='addRoomForm.hotelRoomId' @change="setHotelRoomId"></el-cascader>
      </el-form-item>
    </el-form>

    <!-- table -->
    <div class="data-atte">
      <div class="table">
        <el-table ref="singleTable"
          :data="tableData" border :height="height">
          <el-table-column align="center" :resizable='false' type="selection" width="50"></el-table-column>
          <el-table-column :prop="item.props" :label="item.label" :width="item.width"
            v-for="(item, idx) in tableCate" :key="idx"
            align="center" :resizable="false">
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagin">
        <el-pagination
        background
        @size-change="sizeChange"
        @current-change="curChange"
        :current-page="pageNum"
        :page-sizes="[20, 50, 100, 300]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchKey: '',

      // table
      height: null,
      tableData: [],
      tableCate: [
        { label: "房间号", props: "roomNumber", width: '' },
        { label: "房间类型", props: "typeName", width: '' },
        { label: "房间等级", props: "roomGrade", width: '' }
      ],

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 10,

      // 表单验证
      addRoomForm:{
        //会议ID
        meetingId: "",
        //酒店名称/Id
        hotelRoomId: "",
      },
      //添加客房表单校验
      addFormRules:{
        hotelRoomId: [
          { required: true, message: "请选择酒店大楼", trigger: 'blur' }
        ],
      },

      // 联级选择
      options: [{value: 1, label: '指南'}],
      props: {
        lazy: true,
        vue: null,
        lazyLoad (node, resolve) {
          const { level } = node, vue = this.vue
          console.log(level, node.value)
          vue.selectedData.hotelId = node.value

          // 第二级 - 酒店大楼
          vue.levelChild(node.value, url => {
            console.log(url)
            vue.$http.get( url ).then(res => {
              if(res.code == '000'){
                const nodes = res.data
                  .map(item => ({
                    value: item.id,
                    label: item.roomNumber || item.hotelBuildingName,
                    leaf: level >= 2
                  }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                setTimeout(() => {
                  resolve(nodes);
                }, 500);
              }
            })
          }) 

          // 第三级 - 大楼层数 
          vue.getFloorCeng(node.value, url => {
            console.log(url)
            vue.$http.get( url ).then(res => {
              if(res.code == '000'){
                const nodes = res.data
                  .map(item => ({
                    value: item.id,
                    label: '第' + item.floor + '层',
                    leaf: level >= 2
                  }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                setTimeout(() => {
                  resolve(nodes);
                }, 500);
              }
            })
          })
        }
      },
    }
  },
  methods: {

    // 搜索按钮
    searchBtn(){
      console.log('触发')
    },
    // 分页方法
    sizeChange(val){
      this.pageSize = val
    },
    curChange(val){
      this.pageNum = val
    }
  },
  mounted() {
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight
  }
}
</script>

<style scoped lang='less'>
.addAtte {
  width: 100%;
  height: 100%;

  .head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .data-atte {
    width: 100%;
    height: 524px;

    .table {
      width: 100%;
      height: calc(100% - 42px);
    }
  }
}
</style>
<template>
  <div class="person">
    <div class="header-opera">
      <div class="tap"> 
        <span>基础设置</span>
        <span>人员管理</span>
      </div>
    </div>

    <div class="operat"> 
      <div class="search-box right-10px" >
        <el-input size="small" placeholder="输入姓名、拼音、手机进行搜索" v-model="searchKey"  @keyup.enter.native='searchBtn'>
          <el-button slot="append" icon="el-icon-search" @click="searchBtn" size="small"></el-button>
        </el-input>
      </div>

      <el-dropdown @command="addPersonL" class="right-10px" placement='bottom-start'>
        <el-button type="warning" size="small">
          人员管理
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">单人添加</el-dropdown-item>
          <el-dropdown-item command="b">excel导入人员</el-dropdown-item>
          <el-dropdown-item command="c">删除勾选人员</el-dropdown-item>
          <el-dropdown-item command="d">删除全部人员</el-dropdown-item>
          <el-dropdown-item command="e">重名人员</el-dropdown-item>
          <el-dropdown-item command="f">导出查询人员</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown @command="handleCommand" class="right-10px" placement='bottom-start'>
        <el-button type="warning" size="small">
          相片管理
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">上传相片</el-dropdown-item>
          <el-dropdown-item command="b">相片匹配</el-dropdown-item>
          <el-dropdown-item command="c">无相片人员</el-dropdown-item>
          <el-dropdown-item command="e">导入相片压缩包</el-dropdown-item> 
          <!-- <el-dropdown-item command="d">导出全部相片</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown> 

      <!-- 人员查询 - 条件组  --> 
        <el-dropdown trigger="click" class="spacing right-10px" @command='clickCondi' placement='bottom'>
          <el-button size="small">
            <div class="cont">
              <span >{{ tjgroup }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, idx) in condiData" :key="idx" :command='idx'>{{ item.groupName }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="small" @click="custom" class=" right-10px">自定义条件</el-button> 

    </div>

    <!-- 人员 -->
    <div class="list">
      <!-- tree -->
      <div class="list-tree">
        <el-tree
          :data="data"
          ref='person-tree'
          :props="treeProps"
          node-key="id"
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click='treeClick'
          default-expand-all
          :render-content="renderContent">
        </el-tree>
      </div>
      
      <!-- table -->
      <div class="person-data">
        <div class="table">
          <el-table :data="tableData" border :height="height" @selection-change="batchDel">
            <el-table-column :show-overflow-tooltip="true" type="selection" width="55" align="center" :resizable="false"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="attribute2" label="编号" width="80" align="center" :resizable="false"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="userName" label="姓名" width="100" align="center" :resizable="false"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" :resizable="false" align="center" label="头像" width="80">
              <template slot-scope="scope">
                <img v-lazy="`${ API.echoImage(scope.row.photoFileSaveName, 'HeadFile') }`" class="avatar" alt="">
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" :prop="item.prop" :label="item.label" :width="item.width" align="center" :resizable="false"
              v-for="(item, idx) in tableCate" :key="idx"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" :resizable="false" align="center" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="updateUser(scope.row)" class="edit" round size='small'>编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          
        </div>

        <div class="pagin">
          <el-pagination
          background
          @size-change="sizeChange"
          @current-change="curChange" 
          :current-page="pageNum"
          :page-sizes="[50, 100, 300, 500]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 添加人员 -->
    <el-dialog title="添加人员" :visible.sync="addPeroson_child" width="60%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <AddPerson ref="AddPerson" v-if="addPeroson_child" :deparmentId='deparmentId'></AddPerson>
      <div class="dialog-btn">
        <el-button type="primary" @click="submitForm()" size="small" round>添 加</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入人员 -->
    <el-dialog title="Excel导入人员" :visible.sync="importPeroson_child" width="35%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <ExcelImportPeroson ref="ExcelImportPeroson" v-if="importPeroson_child" @close='closeComponent'></ExcelImportPeroson>
      <div class="dialog-btn">
        <el-button @click="cancel" size="small" type="danger" round>关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 修改人员 -->
    <el-dialog title="修改人员" :visible.sync="editPeroson_child" width="60%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <EditPeroson ref="EditPerson" :personId='editPersonId' v-if="editPeroson_child"></EditPeroson>
      <div class="dialog-btn">
        <el-button type="primary" @click="editSave()" size="small" round>保 存</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>

    <!-- 上传相片 -->
    <el-dialog title="上传相片" :visible.sync="updatePhoto_child" width="20%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <UpdatePhoto ref="UpdatePhoto" v-if="updatePhoto_child" @setShowNum='setShowNum'></UpdatePhoto>
      <div class="dialog-btn padding-0">
        <div v-if="showNum != 0" class='tips-num' style="margin-right: 10px">一共上传{{ showNum }}张</div>
        <el-button size="small" type="primary" v-if="showNum != 0" round @click="imgUploadAll($event, 0)">提 交</el-button>
        <el-button @click="cancel" size="small" type="danger" round>关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 无相片匹配 -->
    <el-dialog title="人员照片匹配" :visible.sync="noPhotos_child" width="60%" center
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <NoPhotos ref="NoPhotos" v-if="noPhotos_child"></NoPhotos>
      <div class="dialog-btn">
        <el-button type="primary" @click="relation()" size="small" round>关联相片</el-button>
        <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
      </div>
    </el-dialog>

    <!-- 条件组 -->
    <el-dialog title="条件组" :visible.sync="condi_child" width="60%" center append-to-body :before-close="close"
      :close-on-click-modal='false' :close-on-press-escape='false' custom-class='dialog' top='80px'>
      <conditionGroup ref="conditionGroup" v-if="condi_child"></conditionGroup>
      <div class="dialog-btn">
        <el-button @click="close" size="small" type="danger" round>关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 进度条 -->
    <div class="mask" v-if="mask">
      <div class="prog">
        <el-alert title="上传进度" type="success" :closable='false' v-if="percentage < 100">
          <el-progress :text-inside="true" :stroke-width="15" :percentage="percentage"></el-progress>
        </el-alert>
        <el-alert title="正在解压..." type="success" :closable='false' v-else>
          <!-- <el-progress :text-inside="true" :stroke-width="15" :percentage="100"></el-progress> -->
        </el-alert>
      </div>
    </div>
    
  </div>
</template>

<script>
import Person from './person.js'

export default Person
</script>

<style scoped lang='less'>

.person {
  width: 100%;
  height: 100%;

  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    background-color: rgba(0, 0, 0, .4);
    z-index: 99;

    .prog {
      width: 500px;
      height: 100px;
      margin-top: 80px;
    }
  }
}

.person .operat {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  // padding-left: 240px;
  box-sizing: border-box;

  .search-box {
    width: 220px;
    margin-right: 20px !important;
  }

  .right-10px {
    margin-right: 10px;
  }

  .cont {
    width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    justify-content: space-between;
  }

}

.person .list {
  width: 100%;
  height: calc(100% - 92px);
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;

  .list-tree {
    width: 240px;
    padding-right: 20px;
    box-sizing: border-box;
    height: 100%;
  }

  .person-data {
    width: calc(100% - 240px);
    height: 100%;

    .table {
      width: 100%;
      height: calc(100% - 42px);

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        vertical-align: middle;
        margin: 0 auto;
        border-style: none;
      }
    }
  }
}

.tips-num {
  margin-bottom: 10px
}

.padding-0 {
  padding-top: 0
}

.auto-photo {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>

<style lang='less'>
.mask {
  .el-alert__content {
    width: 100%  !important;
  }
}

.loading-color {
  color: #67c23a;
}
</style>
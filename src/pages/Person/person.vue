<template>
    <div class="person">
      <div class="header-opera">
        <div class="tap"> 
          <span>基础设置</span>
          <span>人员管理</span>
        </div>
      </div>

      <div class="operat">
        <!-- 人员查询 - 条件组  --> 
        <el-dropdown trigger="click">
          <el-button size="small">
            条件组查询<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

				<div class="right-10px" @click="openBox">
					<el-button size="small">自定义条件</el-button>
				</div>

        <!-- :id="searStatus ? 'bae' : ''" -->
				<div class="search-box right-10px" >
					<el-input size="small" placeholder="输入姓名、拼音、手机进行搜索" v-model="searchKey"  @keyup.enter.native='doSeacKey'>
						<el-button slot="append" icon="el-icon-search" @click="doSeacKey"></el-button>
					</el-input>
				</div>

        <div>
          <el-button type="warning" @click="auto" class="right-10px" size="small">部门匹配</el-button>
          <el-button-group>
            <el-dropdown @command="addPersonL">
              <el-button type="warning" style="border-radius: 5px 0 0 5px;" size="small">
                添加人员
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">单个添加</el-dropdown-item>
                <el-dropdown-item command="b">excel导入</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown @command="handlePhoto">
              <el-button type="warning" style="border-radius: 0" size="small">
                删除人员
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">删除勾选人员</el-dropdown-item>
                <el-dropdown-item command="b">删除全部人员</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown @command="handleCommand">
              <el-button type="warning" style="border-radius: 0" size="small">
                相片管理
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">上传相片</el-dropdown-item>
                <el-dropdown-item command="c">相片匹配</el-dropdown-item>
                <el-dropdown-item command="d">导出全部相片</el-dropdown-item>
                <el-dropdown-item command="f">导出查询人员</el-dropdown-item>
                <el-dropdown-item command="b">导入相片压缩包</el-dropdown-item> 
              </el-dropdown-menu>
            </el-dropdown> 

            <el-dropdown @command="screenCommand">
              <el-button type="warning" size="small">
                筛选 
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">重名人员</el-dropdown-item>
                <el-dropdown-item command="b">无相片人员</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button-group>
        </div> 
      </div>

      <!-- 人员 -->
      <div class="list">
        <!-- tree -->
        <div class="list-tree">
          <el-tree
            :data="data"
            :props="treeProps"
            node-key="id"
            :render-content="renderContent">
          </el-tree>
        </div>
        
        <!-- table -->
        <div class="person-data">
          <div class="table">
            <el-table :data="tableData" border :height="height">
              <el-table-column type="selection" width="55" align="center" :resizable="false"></el-table-column>
              <el-table-column :resizable="false" align="center" label="头像" width="80">
                <template slot-scope="scope">
                  <img v-lazy="`${scope.row.photoFileSaveName}`" class="avatar" alt="">
                  <!-- <div v-if="!scope.row.photoFileSaveName">
                    <el-avatar :key="scope.row.id" src="../assets/tareve.png"></el-avatar> 
                  </div>
                  <img v-else class="authsrc" style="width: 40px; height: 40px" :authsrc="`${api}/${scope.row.companyId}/${scope.row.photoFileSaveName}`" alt="" > -->
                </template>
              </el-table-column>
              <el-table-column :prop="item.prop" :label="item.label" align="center" :resizable="false"
                v-for="(item, idx) in tableCate" :key="idx"></el-table-column>
              <el-table-column :resizable="false" align="center" label="操作" width="100">
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
        <AddPerson ref="AddPerson" v-if="addPeroson_child"></AddPerson>
        <div class="dialog-btn">
          <el-button type="primary" @click="submitForm()" size="small" round>添 加</el-button>
          <el-button @click="cancel" size="small" type="danger" round>取 消</el-button>
        </div>
      </el-dialog>
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
}

.person .operat {
  width: 100%;
  display: flex;

  .search-box {
    width: 300px;
  }

  .right-10px {
    margin-right: 10px;
  }
}

.person .list {
  width: 100%;
  height: calc(100% - 98px);
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
</style>
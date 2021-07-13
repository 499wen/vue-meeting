<template>
  <div class="detailed">
    <div class="self-main"> 
      <div class="chartContent">
        <el-button v-preventReClick @click="tabBtn" type="primary" plain size='mini'> 切换 </el-button>
        <el-button v-preventReClick @click="openScreens" v-if='!open' type="primary" plain size='mini'> 打开第二屏 </el-button>
        <el-button v-preventReClick @click="closeScreens" v-else type="primary" plain size='mini'> 关闭第二屏 </el-button>
      </div>
      <div class="chartContent">
          <el-col :span="qhTab" class="self-col" v-if="columnData.id">
            <div id="circularChart" :style="{width: '400px', height: '400px'}"></div>
            <div class="chartZi">
              <span style="padding-right: 10px">邀请人数: {{ inviteNumber }}人</span>
              <div class="chartZi2">
                <span style="padding-right: 10px" class="color">
                  <div class="bgc"></div>
                  <div>
                    <span class="label">已确认:</span>
                    <span class="person-num">{{ noneNum }}人</span>
                    <span>({{ inviteNumber == 0 ? 0 : (noneNum * 100 / inviteNumber).toFixed(2) }}%)</span>
                  </div> 
                </span>
                <span style="padding-right: 10px" class="color">
                  <div class="bgc" style="background-color: #2f4554"></div>
                  <div>
                    <span class="label">未确认:</span>
                    <span class="person-num">{{ actualNum }}人</span>
                    <span>({{ inviteNumber == 0 ? 0 : (actualNum * 100 / inviteNumber).toFixed(2) }}%)</span>
                  </div> 
                </span>
                <span style="padding-right: 10px" class="color">
                  <div class="bgc" style="background-color: #61a0a8"></div>
                  <div>
                    <span class="label">请假:</span>
                    <span class="person-num">{{ yingdaoNum }}人</span>
                    <span>({{ inviteNumber == 0 ? 0 : (yingdaoNum * 100 / inviteNumber).toFixed(2) }}%)</span>
                  </div> 
                </span>
              </div>
            </div>
          </el-col>
          <el-col :span="qhTab" class="self-col" v-else>
            <div id="circularChart" :style="{width: '400px', height: '400px'}"></div>
            <div class="chartZi">
              <span style="padding-right: 10px">邀请人数: 0人</span>
              <div class="chartZi2">
                <span style="padding-right: 10px" class="color">
                  <div class="bgc"></div>
                  <span>已确认: 0人 (0%)</span> 
                  <div>
                    <span class="label">已确认:</span>
                    <span class="person-num">0人</span>
                    <span>(0%)</span>
                  </div> 
                </span>
                <span style="padding-right: 10px" class="color">
                  <div class="bgc" style="background-color: #2f4554"></div>
                  <div>
                    <span class="label">未确认:</span>
                    <span class="person-num">0人</span>
                    <span>(0%)</span>
                  </div> 
                </span>
                <span style="padding-right: 10px" class="color">
                  <div class="bgc" style="background-color: #61a0a8"></div>
                  <div>
                    <span class="label">请假:</span>
                    <span class="person-num">0人</span>
                    <span>(0%)</span>
                  </div> 
                </span>
              </div>
            </div>
          </el-col>
          <el-col :span="qhTab" class="self-col" v-if="columnData.id">
            <div id="myChart" :style="{width: '420px', height: '400px'}"></div>
            <div class="chartZi"> 
              <span style="padding-right: 10px">应到人数: {{shouldArrive}}人</span>
              <span style="padding-right: 10px">已到人数: {{attendance}}人</span>
              <span style="padding-right: 10px">未到人数: {{missingNumber}}人</span>
              <!-- <span style="padding-right: 10px">请假: {{leaveForConfirmAttendanceNumber}}人</span> -->
            </div>
          </el-col>
          <el-col :span="qhTab" class="self-col" v-else>
            <div id="myChart" :style="{width: '420px', height: '400px'}"></div>
            <div class="chartZi"> 
              <span style="padding-right: 10px">应到人数: 0人</span>
              <span style="padding-right: 10px">已到人数: 0人</span>
              <span style="padding-right: 10px">未到人数: 0人</span>
              <!-- <span style="padding-right: 10px">请假: {{leaveForConfirmAttendanceNumber}}人</span> -->
            </div>
          </el-col>

          <el-col :span="24" v-if="qhTab == 12 ? true : false" class="self-col">
            <el-table :data="personData" style="width: 98%; margin-right: 2%" height='400' border>
              <el-table-column
                v-for="(item, idx) in personCate" :key="idx"
                :prop="item.description"
                :label="item.name"
                align="center"
                :show-overflow-tooltip="true"
                :resizable="false"
              ></el-table-column>
              <el-table-column label="操作" align="center" :resizable="false">
                <template slot-scope="scope" style="width: 10%">
                  <div v-show="scope.row.leaveState == 0 && scope.row.statusCode != 3">
                    <el-button v-preventReClick size="mini" @click="repairSign(scope.row)" type="primary">补签</el-button>
                  </div>
                  <!-- <div v-show="scope.row.leaveState == 0 && scope.row.statusCode == 0">
                    <el-button v-preventReClick size="mini" @click="confirmMeet(scope.row)" type="primary">确认参会</el-button>
                  </div> -->
                  <div v-show="scope.row.leaveState == 0 && scope.row.statusCode == 3">
                    <el-button v-preventReClick size="mini" @click="signWithdrawal(scope.row)" type="primary">撤销</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagin" v-if="(!personData)||personData.length!==0">
              <el-pagination
                background
                @size-change="filterSize" 
                @current-change="filterCurrent"
                :current-page="filterTable.pageNum"
                :page-sizes="[1, 5, 10, 20, 30, 40]"
                :page-size="filterTable.pageSize"
                layout="total,  prev, pager, next, jumper"
                :total="filterTable.total"
              ></el-pagination>
            </div>
          </el-col>
      </div>
      
    </div>
    <div class="chartBtn">
      <!-- <el-button v-preventReClick @click="close" type="primary">关闭</el-button> -->
    </div>
  </div>
</template>

<script>
import detailed from './detailed.js'

export default detailed
</script>

<style scoped lang='less'>
@import url('./detailed.less');
.detailed {
  .label {
    display: inline-block;
    width: 46px;
    text-align: right;
    text-align-last: justify;
    margin-right: 5px;
  }

  .person-num {
    display: inline-block;
    margin-right: 5px;
  }
}
</style>
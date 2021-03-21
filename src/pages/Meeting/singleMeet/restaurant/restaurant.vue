<template>
  <div class='restaurant'>
    <div class="rest-main" style="overflow-y:auto">
      <div class="card" v-for="(item, idx) in card" :key="idx">

        <!-- 标题 -->
        <div class="title">

            <div class="block">
              <el-date-picker :picker-options='pickerOptions' size='mini' :disabled='disabled(item.date) || meetIsEnd' v-model="item.date" type="date" placeholder="选择日期" @input="upadteTime($event, item)"> </el-date-picker>
            </div>
            <div class="chioce">
              <el-checkbox :disabled='disabled(item.date) || meetIsEnd' v-model="item.eat.breakfast" @change="eat($event, item.eat.breakfast)">早餐</el-checkbox>
              <el-checkbox :disabled='disabled(item.date) || meetIsEnd' v-model="item.eat.lunch" @change="eat($event, item.eat.lunch)">午餐</el-checkbox>
              <el-checkbox :disabled='disabled(item.date) || meetIsEnd' v-model="item.eat.dinner" @change="eat($event, item.eat.dinner)">晚餐</el-checkbox>
            </div> 
 
        </div>
  
        <!-- 内容 --> 
        <div class="body">
          <!-- 早餐 -->
          <div class="breakfast" v-if="item.eat.breakfast" > 
            <div class="title"> <div>早餐</div> </div>

            <!-- 表单 -->
            <el-form ref="form" label-width="80px" class="form">
              <el-form-item label="就餐时间">
                <el-col :span="11">
                  <el-time-picker :picker-options='{selectableRange: getCurTime(item.date)}' size='mini' placeholder="选择时间" :disabled='disabled(item.date) || meetIsEnd' v-model="item.breakfast.cateringBeginDate" style="width: 100%;"></el-time-picker>
                </el-col>
                <el-col class="line" :span="2" style="padding:0">至</el-col>
                <el-col :span="11">
                  <el-time-picker :picker-options='{selectableRange: getCurTime(item.date)}' size='mini' placeholder="选择时间" :disabled='disabled(item.date) || meetIsEnd' v-model="item.breakfast.cateringEndDate" style="width: 100%;"></el-time-picker>
                </el-col>
              </el-form-item>

              <!-- 餐厅 -->
              <div class="rest-ct" v-for="(b, bidx) in  item.breakfast.ct" :key="bidx">
                <el-form-item label="选择餐厅" class="self-form-item">
                  <el-select @change="selectCh('breakfast', idx, bidx)" v-model="b.rest" placeholder="请选择餐厅" size='mini' :disabled='disabled(item.date) || meetIsEnd'>
                    <el-option :label="ct.restaurantName" :value="ct.id" v-for="(ct, index) in ctList" :key="index"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="选择人员" class="self-form-item">
                  <el-input :disabled='disabled(item.date) || meetIsEnd' v-model="b.info" size='mini'>
                    <i class="el-icon-edit el-icon-circle-plus-outline pointer" v-if="!meetIsEnd" slot="suffix" @click="handleIconClick(b, 'breakfast', idx, bidx)"> </i>
                    <i class="el-icon-edit el-icon-circle-plus-outline not-allowed" v-else slot="suffix" @click="handleIconClick(b, 'breakfast', idx, bidx)"> </i>
                  </el-input>
                </el-form-item>
              </div>

              <div class="remove" v-if='false'>
                <el-button size='mini' type="danger" @click="removeBreakfast(idx)" :disabled='disabled(item.date) || meetIsEnd'>移除餐厅</el-button>
              </div>
              <div class="add" v-if='false'>
                <el-button size='mini' type="primary" @click="addBreakfast(idx)" :disabled='disabled(item.date) || meetIsEnd'>添加餐厅</el-button>
              </div>

            </el-form>

          </div>
          <div class="breakfast" style="border: none" v-else></div>

          <!-- 午餐 -->
          <div class="lunch" v-if="item.eat.lunch">
            <div class="title"> <div>午餐</div> </div>

            <!-- 表单 -->
            <el-form ref="form" label-width="80px" class="form"> 
              <el-form-item label="就餐时间">
                <el-col :span="11">
                  <el-time-picker :disabled='disabled(item.date) || meetIsEnd' :picker-options='{selectableRange: getCurTime(item.date)}' size='mini' placeholder="选择时间" v-model="item.lunch.cateringBeginDate" style="width: 100%;"></el-time-picker>
                </el-col>
                <el-col class="line" :span="2" style="padding:0">至</el-col>
                <el-col :span="11">
                  <el-time-picker :picker-options='{selectableRange: getCurTime(item.date)}' size='mini' placeholder="选择时间" :disabled='disabled(item.date) || meetIsEnd' v-model="item.lunch.cateringEndDate" style="width: 100%;"></el-time-picker>
                </el-col>
              </el-form-item>

              <!-- 餐厅 -->
              <div class="rest-ct" v-for="(l, lidx) in item.lunch.ct" :key="lidx">
                <el-form-item label="选择餐厅" class="self-form-item">
                  <el-select v-model="l.rest" placeholder="请选择餐厅" size='mini'  :disabled='disabled(item.date) || meetIsEnd'>
                    <el-option :label="ct.restaurantName" :value="ct.id" v-for="(ct, index) in ctList" :key="index"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="选择人员" class="self-form-item">
                  <el-input :disabled='disabled(item.date) || meetIsEnd' v-model="l.info" size='mini'>
                    <i class="el-icon-edit el-icon-circle-plus-outline pointer" v-if="!meetIsEnd" slot="suffix" @click="handleIconClick(l, 'lunch', idx, lidx)"> </i>
                    <i class="el-icon-edit el-icon-circle-plus-outline not-allowed" v-else slot="suffix" @click="handleIconClick(l, 'lunch', idx, lidx)"> </i>
                  </el-input>
                </el-form-item>
              </div>

              <div class="remove" v-if='false'>
                <el-button size='mini' type="danger" @click="removeLunch(idx)"  :disabled='disabled(item.date) || meetIsEnd'>移除餐厅</el-button>
              </div>
              <div class="add" v-if='false'>
                <el-button size='mini' type="primary" @click="addLunch(idx)"  :disabled='disabled(item.date) || meetIsEnd'>添加餐厅</el-button>
              </div>

            </el-form>

          </div>
          <div class="lunch" style="border: none" v-else></div>

          <!-- 晚餐 -->
          <div class="dinner" v-if="item.eat.dinner">
            <div class="title"> <div>晚餐</div> </div>

            <!-- 表单 -->
            <el-form ref="form" label-width="80px" class="form">
              <el-form-item label="就餐时间">
                <el-col :span="11">
                  <el-time-picker :picker-options='{selectableRange: getCurTime(item.date)}' size='mini' placeholder="选择时间" :disabled='disabled(item.date) || meetIsEnd' v-model="item.dinner.cateringBeginDate" style="width: 100%;"></el-time-picker>
                </el-col>
                <el-col class="line" :span="2" style="padding:0">至</el-col>
                <el-col :span="11">
                  <el-time-picker :picker-options='{selectableRange: getCurTime(item.date)}' size='mini' placeholder="选择时间" :disabled='disabled(item.date) || meetIsEnd' v-model="item.dinner.cateringEndDate" style="width: 100%;"></el-time-picker>
                </el-col>
              </el-form-item>

              <!-- 餐厅 --> 
              <div class="rest-ct"  v-for="(d, didx) in item.dinner.ct" :key="didx">
                <el-form-item label="选择餐厅" class="self-form-item">
                  <el-select v-model="d.rest" placeholder="请选择餐厅" size='mini' :disabled='disabled(item.date) || meetIsEnd'>
                    <el-option :label="ct.restaurantName" :value="ct.id" v-for="(ct, index) in ctList" :key="index"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="选择人员" class="self-form-item">
                  <el-input :disabled='disabled(item.date) || meetIsEnd' v-model="d.info" size='mini'>
                    <i class="el-icon-edit el-icon-circle-plus-outline pointer" v-if="!meetIsEnd" slot="suffix" @click="handleIconClick(d, 'dinner', idx, didx)"> </i>
                    <i class="el-icon-edit el-icon-circle-plus-outline not-allowed" v-else slot="suffix" @click="handleIconClick(d, 'dinner', idx, didx)"> </i>
                  </el-input>
                </el-form-item>
              </div> 

              <div class="remove" v-if='false'>
                <el-button size='mini' type="danger" @click="removeDinner(idx)" :disabled='disabled(item.date) || meetIsEnd'>移除餐厅</el-button>
              </div>
              <div class="add" v-if='false'>
                <el-button size='mini' type="primary" @click="addDinner(idx)" :disabled='disabled(item.date) || meetIsEnd'>添加餐厅</el-button>
              </div>

            </el-form>

          </div>
          <div class="dinner" style="border: none" v-else></div>

        </div>

      </div>

      <div class="addCard">
        <el-button type="warning" size='mini' @click="addMeals" :disabled="meetIsEnd">添加</el-button>
      </div>

      <!-- 添加用餐人员 -->
      <el-dialog title="添加人员" :visible.sync="addPersonBox" :close-on-click-modal='false' width="80%">
        <div class="top-nav">
          <!-- <el-radio v-model="radio" label="1">内部人员</el-radio>
          <el-radio v-model="radio" label="2">外部人员</el-radio> -->

          <el-select @change="personCha" v-model="groupVal" placeholder="所有分组" size="mini" style="margin-right: 20px">
            <el-option
              v-for="item in group"
              :key="item.id"
              :label="item.confereeGroupName"
              :value="item.id">
            </el-option>
          </el-select>
          <!-- <div>
            <el-input placeholder="请输入内容" v-model="input3" class="input-with-select" size="mini">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div> -->
        </div>

        <div class="table-value">
          <div class="table-public">
            <el-table
              :data="tableData"
              height="500"
              border
              @selection-change="handleSelectionChange"
              style="width: 100%">
              <el-table-column :show-overflow-tooltip="true" type="selection" width="55"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" 
                v-for="(item, idx) in tableCate" :key="idx"
                :prop="item.description" :label="item.name"
                width="">
              </el-table-column>
            </el-table>
            <div class="showPerson">{{ tableData.length }}人</div>
          </div>
          <div class="table-center">
            <el-button class="c-btn" @click="removePerson()">&gt;</el-button>
            <el-button class="c-btn" @click="addPerson()">&lt;</el-button>
            <el-button class="c-btn" type="warning" @click="savePerson()" :disabled="meetIsEnd">保存</el-button>
          </div>
          <div class="table-public">
            <el-table
              @selection-change="handleSelectionChange1"
              :data="tableData1"
              height="500"
              border
              style="width: 100%">
              <el-table-column :show-overflow-tooltip="true" type="selection" width="55"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" 
                v-for="(item, idx) in tableCate" :key="idx"
                :prop="item.description" :label="item.name"
                width="">
              </el-table-column>
            </el-table>
            <div class="showPerson person-right">{{ tableData1.length }}人</div>
          </div>
        </div>

        <!-- <span slot="footer" class="dialog-footer"> 
          <el-button @click="addPersonBox = false">取 消</el-button>
          <el-button type="primary" @click="addPersonBox = false">确 定</el-button>
        </span> -->
      </el-dialog>
    </div>
    <div class="prese">
      <el-button type="warning" size='mini' @click="prese" :disabled="meetIsEnd">保存餐厅信息</el-button>
    </div>
  </div>
</template>

<script>
import restaurant from './restaurant.js'
export default restaurant
</script>

<style lang="less">
@import url('./restaurant.less');
</style>
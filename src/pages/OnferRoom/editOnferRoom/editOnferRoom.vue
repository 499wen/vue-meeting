<template>
  <div class="addHotel">
    <div class="header-opera">
      <div class="tap">
        <span>基础设置</span>
        <span>会议室管理</span>
        <span>修改会议室</span>
      </div>
    </div>

    <div class="form">
      <!-- 表单 -->
      <div class="form-left">
        <div class="newly-build">
          <div class="form-title">修改会议室</div>
          <div class="form-body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <el-form-item label="会议室名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入会议室名称"></el-input>
              </el-form-item> 
              <el-form-item label="会议室类型" prop='type'>
                <el-select v-model="ruleForm.type" placeholder="请选择容纳人数">
                  <el-option label="方形" value="0"></el-option>
                  <el-option label="椭圆" value="1"></el-option>
                  <el-option label="圆桌形" value="2"></el-option>
                </el-select>
              </el-form-item> 
              <el-form-item label="容纳人数" prop='maximumCapacity'>
                <el-select v-model="ruleForm.maximumCapacity" placeholder="请选择容纳人数">
                  <el-option label="100" value="100"></el-option>
                  <el-option label="500" value="500"></el-option>
                  <el-option label="1000" value="1000"></el-option>
                  <el-option label="2000" value="2000"></el-option>
                  <el-option label="3000" value="3000"></el-option>
                </el-select>
              </el-form-item> 
              <el-form-item label="会议室图片">
                <div class="avatar-uploader">
                  <div class="avatar">
                    <img v-if="ruleForm.photoFileId" :src="API.echoImage(ruleForm.photoFileId, 'MeetingRoomImage')" @error="errImg(ruleForm.photoFileId, 'MeetingRoomImage', $event)"/>
                    <img v-else src="@/assets/images/defaultImg.png" alt="">
                    <input type="file" name="" id="" class="hide" @change="updateLoad" ref="file">
                  </div>
                  
                  <div class="self-explain" style="">
                    <div>建议尺寸：564*376</div>
                    <div>大小：300KB以下</div>
                  </div>
                </div>
              </el-form-item> 

              <el-form-item label="会议室开放时段" prop="time" size="mini">
                <el-time-picker
                  is-range
                  v-model="ruleForm.time"
                  value-format="HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  @input="sj"
                ></el-time-picker>
              </el-form-item>

              <el-form-item label="会议室地址" prop="address">
                <el-input id="suggestId" v-model="ruleForm.address" placeholder="请输入会议室地址"></el-input>
              </el-form-item> 

              <el-form-item label="会议室设备">
                <el-checkbox-group
                    v-model="equipmentType"
                    class="ml15"
                    style="line-height: 20px; padding-top: 0.625rem;"
                  >
                    <el-checkbox
                      v-for="checkbox in checkboxList"
                      :label="checkbox.label"
                      :key="checkbox.value"
                    >{{checkbox.label}}</el-checkbox>
                  </el-checkbox-group>   
              </el-form-item> 

              <el-form-item label="备注">
                  <el-input type="textarea" v-model="ruleForm.notes" placeholder="请输入备注信息" rows="5"></el-input>
              </el-form-item> 

            </el-form>
          </div>
        </div>
        <div class="submit-btn">
          <el-button type="danger" round size='small' @click="save">确认修改</el-button>
        </div>
      </div>
      
      <!-- 平面图 -->
      <div class="form-right">
        <div class="right-box">
          <div class="intro-duce">会议室平面图</div>
          <div class="img-pmt">
            <img v-if="ruleForm.drawingOfSiteFileId" :src="API.echoImage(ruleForm.drawingOfSiteFileId, 'MeetingRoomPlane')" class="avatar-duce" @error="errImg(ruleForm.drawingOfSiteFileId, 'MeetingRoomPlane', $event)"/>
            <img v-else src="@/assets/images/defaultPmt.png" class="avatar-duce" alt="">
            <input type="file" name="" id="" class="hide" @change="updateLoad_pml" ref="file_pmt">
          </div>
        </div>
        <div class="right-box">
          <div class="intro-duce">会议室地址</div>
          <div class="img" id="baidu-map">
            
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import editOnferRoom from './editOnferRoom.js'

export default editOnferRoom
</script>

<style scoped lang='less'>
@import url('./editOnferRoom.less');
</style>

<style lang='less'>
.avatar-uploader {
  height: 100%;
  width: 100%;
}

.avatar-uploader .el-upload {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;

  .self-explain {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;

    div {
      width: 100%;
      text-align: left;
      line-height: 25px;
    }
  }
}

.avatar {
  width: 200px;
  height: 132px;
  border-radius: 5px;
  margin-right: 20px;
  border: 1px dashed #999;
}

.textarea {
  .el-textarea__inner{ //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }
}

.avatar-duce {
  width: 100%;
  height: 100%;
}
</style>
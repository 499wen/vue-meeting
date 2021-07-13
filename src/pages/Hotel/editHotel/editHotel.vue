<template>
  <div class="addHotel">
    <div class="header-opera">
      <div class="tap">
        <span>基础设置</span>
        <span>酒店管理</span>
        <span>修改酒店</span>
      </div>
    </div>

    <div class="form">
      <!-- 表单 -->
      <div class="form-left">
        <div class="newly-build">
          <div class="form-title">修改酒店</div>
          <div class="form-body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
              <el-form-item label="酒店名称" prop="hotelName">
                <el-input v-model="ruleForm.hotelName" placeholder="请输入酒店名称"></el-input>
              </el-form-item> 
              <el-form-item label="容纳人数" prop='capacity'>
                <el-select v-model="ruleForm.capacity" placeholder="请选择容纳人数">
                  <el-option label="100" value="100"></el-option>
                  <el-option label="500" value="500"></el-option>
                  <el-option label="1000" value="1000"></el-option>
                  <el-option label="2000" value="2000"></el-option>
                  <el-option label="3000" value="3000"></el-option>
                </el-select>
              </el-form-item> 
              <el-form-item label="酒店图片" prop='capacity'>
                <div class="avatar-uploader">
                  <div class="avatar">
                    <img v-if="ruleForm.hotelImageUrl" :src="API.echoImage(ruleForm.hotelImageUrl, 'HotelImage')" @error="errImg(ruleForm.hotelImageUrl, 'HotelImage', $event)"/>
                    <img v-else src="@/assets/images/defaultImg.png" alt="">
                    <input type="file" name="" id="" class="hide" @change="updateLoad" ref="file">
                  </div>
                  
                  <div class="self-explain" style="">
                    <div>建议尺寸：564*376</div>
                    <div>大小：300KB以下</div>
                  </div>
                </div>
              </el-form-item> 

              <el-form-item label="酒店地址" prop="address">
                <el-input id="suggestId" ref='address' v-model="ruleForm.address" placeholder="请输入酒店地址"></el-input>
              </el-form-item> 
              <el-form-item label="酒店描述">
                <el-input class="textarea" v-model="ruleForm.remark" :autosize="{ minRows: 5, maxRows: 5}" type="textarea" placeholder="请输入酒店描述"></el-input>
              </el-form-item> 

            </el-form>
          </div>
        </div>
        <div class="submit-btn">
          <el-button v-preventReClick type="danger" round size='small' @click="save_hotel">确认修改</el-button>
        </div>
      </div>
      
      <!-- 平面图 -->
      <div class="form-right">
        <div class="right-box">
          <div class="intro-duce">酒店平面图</div>
          <div class="img-pmt">
            <img v-if="ruleForm.hotelPlaneImageUrl" :src="API.echoImage(ruleForm.hotelPlaneImageUrl, 'HotelPlane')" class="avatar-duce"  @error="errImg(ruleForm.hotelPlaneImageUrl, 'HotelPlane', $event)"/>
            <img v-else src="@/assets/images/defaultPmt.png" class="avatar-duce" alt="">
            <input type="file" name="" id="" class="hide" @change="updateLoad_pml" ref="file_pmt">
          </div>
        </div>
        <div class="right-box">
          <div class="intro-duce">酒店地址</div>
          <!-- 地图 -->
          <div class="img" id="baidu-map"></div>
        </div>
      </div> 

    </div>
  </div>
</template>

<script>
import editHotel from './editHotel.js'

export default editHotel
</script>

<style scoped lang='less'>
@import url('./editHotel.less');
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
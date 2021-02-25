<template>
  <div class="basicInfo">

    <div class="form">
      <!-- 表单 -->
      <div class="form-left">
        <div class="newly-build">
          <div class="form-title">新建会议</div>
          <div class="form-body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
              <el-form-item label="会议名称" prop="restaurantName">
                <el-input v-model="ruleForm.restaurantName" placeholder="请输入会议名称"></el-input>
              </el-form-item> 
              <el-form-item label="会议类型" prop='restaurantType'>
                <el-select v-model="ruleForm.restaurantType" placeholder="请选择会议类型">
                  <el-option label="酒店" value="酒店"></el-option>
                  <el-option label="中会议" value="中会议"></el-option> 
                  <el-option label="西会议" value="西会议"></el-option>
                  <el-option label="自助餐" value="自助餐"></el-option>
                </el-select>
              </el-form-item> 
              <el-form-item label="容纳人数" prop='maxPeopleNumber'>
                <el-select v-model="ruleForm.maxPeopleNumber" placeholder="请选择容纳人数">
                  <el-option label="100" :value="100"></el-option>
                  <el-option label="500" :value="500"></el-option>
                  <el-option label="1000" :value="1000"></el-option>
                  <el-option label="2000" :value="2000"></el-option>
                  <el-option label="3000" :value="3000"></el-option>
                </el-select>
              </el-form-item> 
              <el-form-item label="会议图片" prop='capacity'>
                <el-upload
                  :action="`API.url + API.router.uploadHotelImage`" 
                  :on-success="uploadSuccess"
                  :before-upload="beforeAvatarUpload"
                  :show-file-list="false"
                  :headers="headers"
                  class="avatar-uploader"
                >
                  <img v-if="ruleForm.restaurantPhoto" :src="cover" class="avatar" />
                  <img v-else src="@/assets/images/defaultImg.png" class="avatar" alt="">
                  <div class="self-explain" style="">
                    <div>建议尺寸：564*376</div>
                    <div>大小：300KB以下</div>
                  </div>
                </el-upload>
              </el-form-item> 

              <el-form-item label="会议地址" prop="restauranAddress">
                <el-input id="suggestId" v-model="ruleForm.restauranAddress" placeholder="请输入会议地址"></el-input>
              </el-form-item> 
              <el-form-item label="会议描述">
                <el-input class="textarea" v-model="ruleForm.restaurantPresentation" :autosize="{ minRows: 5, maxRows: 5}" type="textarea" placeholder="请输入会议描述"></el-input>
              </el-form-item> 

            </el-form>
          </div>
        </div>
        <div class="submit-btn">
          <el-button type="danger" round size='small' @click="save">确认添加</el-button>
        </div>
      </div>
      
      <!-- 平面图 -->
      <div class="form-right">
        <div class="right-box">
          <div class="intro-duce">会议平面图</div>
          <div class="img">
            <el-upload
              :action="`API.url + API.router.uploadHotelImage`" 
              :on-success="uploadSuccess"
              :before-upload="beforeAvatarUpload"
              :show-file-list="false"
              :headers="headers"
              class="avatar-uploader"
            >
              <img v-if="ruleForm.planeFigure" :src="cover" class="avatar-duce" />
              <img v-else src="@/assets/images/defaultPmt.png" class="avatar-duce" alt="">
            </el-upload>
          </div>
        </div>
        <div class="right-box">
          <div class="intro-duce">会议地址</div>
          <div class="img" id="baidu-map">
            
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import basicInfo from './basicInfo.js'

export default basicInfo
</script>

<style scoped lang='less'>
@import url('./basicInfo.less');
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
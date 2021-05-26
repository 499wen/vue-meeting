<template>
  <div class="updatePhoto"> 
    <div class="form-group">
      <div class="control-form">
        <div class="tips-">
          <label class="exportExcelFile" for="exportExcelFile">
            选择文件
            <input accept="image/png,image/jpeg,image/gif,image/jpg"
              multiple ref="exportExcelFile" id="exportExcelFile"
              @focus="focusImg" @input="clickImgUpdate" @change="addImg"
              type="file"/>
          </label>
          <div class="sm-text">
            <p class="help-block">
              (建议图片格式为：JPEG/PNG，每张大小不超过200kb)
            </p>

            <!-- <el-button size='small' v-if="this.gl.length && this.showNum == 0" @click="exportToExcel">导出excel</el-button> -->

            <div class="person-type" v-if="false">
              <el-radio-group v-model="radio" @change="radioGroup" fill="red">
                <el-radio label="internal">内部人员</el-radio>
                <el-radio label="external">外部人员</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div v-if="showNum != 0" style="margin-right: 10px">一共上传{{ showNum }}张</div>  
    <el-button size="small" type="primary" v-if="showNum != 0" @click="imgUploadAll($event, 0)">提交</el-button> -->
  </div>
</template>

<script>
import updatePhoto from './updatePhoto.js'
export default updatePhoto;
</script>

<style lang="less" scoped>
.updatePhoto {

  .sm-text {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .exportExcelFile {
      position: relative;
      display: block; 
      -webkit-appearance: none;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      margin-right: 10px;
      transition: .1s;
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      border: 1px solid #054592;
      padding: 9px 15px;
      font-size: 12px;
      border-radius: 3px;
      color: #fff;
      background-color: #054592;

      input {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
    }
  .upload-imgs{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    justify-content: flex-start;
    max-height: 600px;

    li{
      position: relative;
			width: 140px;
			height: 220px;
      font-size: 14px;
      display: inline-block;
      margin: 0 10px 15px 10px;
      border: 1px dashed #ccc;
      text-align: center;
      vertical-align: middle; 
      &:hover{
        border-color: #eee;
        .add{background-color: #eee;}
        .img .close{display: block;position: absolute;right: -6px;top: -10px;line-height: 1;font-size: 22px;color: #aaa;}
      }
    }
    .add{
      display: block;background-color: #ccc;color: #ffffff;height: 94px;padding: 8px 0;
      .iconfont{padding: 10px 0;font-size: 40px;}
    }
    .upload{position: absolute;top: 0;bottom: 0;left: 0;right: 0;width: 118px;height: 118px;}
    .img{
			width: 126px;
			height: 160px;
      margin: 10px auto;
      background: #ededed;
      img{
        vertical-align: middle;
        width: 100%;
      }
      .close{display: none;}
    }
  }
  .uploadimgBtn{
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 40px;      

      .res-tips {
        margin-left: 10px;
        font-size: 14px;
      }
  }
  .dropbox {
      border: 2px dashed #ddd;
      min-height: 200px;
      max-height: 385px;
      overflow-y: auto;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      text-align: center;
      color: #054592;
  }

  .tips- {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin-bottom: 10px;
  }

}


</style>
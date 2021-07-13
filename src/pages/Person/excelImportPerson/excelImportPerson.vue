<template>
  <div class="excelImportPerson">
    <div class="type">
      <el-radio v-model="radio" label="internal">内部人员</el-radio>
      <el-radio v-model="radio" label="external">外部人员</el-radio>
    </div>
    <div class="label">
      <el-button v-preventReClick type="primary" @click="downloadFile" >下载模板文件</el-button>
      <span class="text">请下载模板文件，按模板文件格式编辑后在上传！</span>
    </div>
    <div class="label">
      <div class="file">
        <el-button v-preventReClick type="success">选择导入人员</el-button>
        <input type="file" name="" id="" class="hide" @change="importExcel" ref="file">
      </div>
      <span class="text">请选择要上传的excel文件开始上传！(最多10000条数据)</span>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
let load = null

export default {
  data() {
    return {
      radio: 'internal'
    }
  },
  methods: {
    // 下载模板文件
    downloadFile() {
      var aDom = document.createElement('a')
      aDom.href = 'https://excel-1305256445.cos.ap-guangzhou.myqcloud.com/%E5%8D%95%E4%BD%8D%20-%20%E4%BA%BA%E5%91%98%E8%A1%A8%E6%A0%BC.xlsx'
      aDom.click()
    },
    // 导入excel
    importExcel(){
      // 文件数据
      let file = this.$refs.file, files, that = this
      files = file.files[0]

      console.log(files)
      if(!this.is_excel(files.name)){
        this.$message.error('请上传excel文件!')
        return 
      }
      // return 

      // 创建 文件储存对象
      let reader = new FileReader();
      reader.readAsArrayBuffer(files);
      let blob = null;

      // 文件加载
      reader.onload = (e) => {
        // 加载
        load = this.$loading({ lock: true, text: "Loading...", background: 'rgba(0, 0, 0, 0.5)'})
        
        // 创建 blob对象
        if (typeof e.target.result === 'object') {
          blob = new Blob([e.target.result])
        } else {
          blob = e.target.result
        }

        // 将文件上传后端
        $.ajax({
          url: this.API.fileExcel(files.name, this.radio),
          data: blob,
          type: "Post",
          "headers": {
            "Content-Type": "image/png",
            token: localStorage.getItem('token')
          },
          dataType: "json",
          processData: false,//用于对data参数进行序列化处理 这里必须false
          contentType: false, //必须
          success: function (res) {
            if(res.code == '000') {
              that.$message.success(res.msg)
              setTimeout(() => {
                that.$emit('close')
              }, 1000)
            } else {
              that.$message.error(res.msg)
            }
            file.value = ''
            load.close()
          },
          error(err) {
            console.log(err)
            that.$message.error('上传失败！请刷新重试。')
            load.close()
          }
        })
      }

    },
    // 判断是否 excel 文件
    is_excel(fileName) {
      let suffixArr = ['.xls', '.xlsx'],
      sfx = fileName.lastIndexOf('.'),
      ext = fileName.substr(sfx)

      if(suffixArr.includes(ext))
        return true
      else 
        return false
    }
  }
}
</script>

<style scoped lang='less'>
.excelImportPerson {

  .type {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .label {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .text {
      margin-left: 10px;
      font-size: 17px;
      color: #333;
    }

    .file {
      position: relative;
    }
  }
}
</style>
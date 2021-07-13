<template>
  <div>
     <el-upload
      action="http://host:/apilzy/rental/house/web/rentalRoom/excel/importTenant"
      :headers='headers'
      :data='param'
      :on-success="handlePreview">
      <el-button v-preventReClick size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data() {
    return {
      headers: {
        token: '',
        'Content-Type': 'multipart/form-data'
      },
      param: {
        
      }
    }
  },
  methods: {
    // 请求成功后的回调
    handlePreview(res) {
      console.log(res)
    }
  },

}
</script>
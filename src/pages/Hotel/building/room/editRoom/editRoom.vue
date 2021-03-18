<template>
  <div class="addRoom">
    <el-form ref="form1" :model="editItem" label-width="80px" :rules='rules'>
      <el-form-item label="房间类型" prop="hotelRoomType">
        <el-radio-group v-model="editItem.hotelRoomType">
          <el-radio :label="1">单人间</el-radio>
          <el-radio :label="2">双人间</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="房间等级">
        <el-col :span="11">
          <el-select v-model="editItem.hotelRoomGrade" placeholder="请选择房间等级">
            <el-option label="普通套房" :value="0"></el-option>
            <el-option label="豪华套房" :value="1"></el-option>
            <el-option label="总统套房" :value="2"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['editItem'],
  data() {
    return {
      // form
      // editItem: {},
      rules: {
        hotelRoomType: [
          { required: true, message: '请选择房间类型', trigger: 'blur' }
        ]
      },

      // 添加方式
      addType: '1', 
    }
  },
  methods: {
    // 房间类型
    addTypeChange(e){
      this.addType = e
    },
  }
}
</script>

<style scoped lang='less'>
.addRoom {

}
</style>
<template>
  <div class="addRoom">
    <el-form ref="ruleForm" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="添加方式">
        <el-radio-group v-model="addType" @change="addTypeChange">
          <el-radio label="1" value=''>单个添加</el-radio>
          <el-radio label="2" value=''>批量添加</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="房间类型" prop="hotelRoomType">
        <el-radio-group v-model="form.hotelRoomType">
          <el-radio :label="1">单人间</el-radio>
          <el-radio :label="2">双人间</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="房间等级"  v-if="addType == 1">
        <el-col :span="15">
          <el-select v-model="form.hotelRoomGrade" placeholder="请选择房间等级">
            <el-option label="普通套房" :value="0"></el-option>
            <el-option label="豪华套房" :value="1"></el-option>
            <el-option label="总统套房" :value="2"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="房间号" v-if="addType == 1" prop="roomNumber">
        <el-col :span="15">
          <el-input v-model="form.roomNumber"></el-input>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="房间容量（人）" v-if="addType == 2" prop="eachCapacity">
        <el-col :span="15">
          <el-input-number v-model="form.eachCapacity" controls-position="right" :min="1" :max='4'></el-input-number>
        </el-col>
      </el-form-item> -->
      <el-form-item label="开始房间号" v-if="addType == 2" prop="startRoomNumber" >   
        <el-col :span="15"  prop="startRoomNumber">
          <el-input v-model="form.startRoomNumber"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="生成房间数量" v-if="addType == 2" prop="generateNumber" >   
        <el-input-number v-model="form.generateNumber" controls-position="right" :min="1"></el-input-number>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
let rules = {
    floor: [
      { required: true, message: '请选择楼层', trigger: 'blur' }
    ],
    hotelRoomType: [
      { required: true, message: '请选择房间类型', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请选择房间类型', trigger: 'blur' }
    ],
    roomNumber: [
        { required: true, message: '请输入房间号', trigger: 'blur' }
    ],
    startRoomNumber: [
      { required: true, message: '请输入开始房间号', trigger: 'blur' }
    ],
    eachCapacity: [
      { required: true, message: '请输入房间容纳人数', trigger: 'blur' }
    ],
    generateNumber: [
      { required: true, message: '请输入生成数量', trigger: 'blur' }
    ], 
  } 
export default {
  data() {
    return {
      // form
      form: { 
        hotelRoomType: 1, // 房间类型 string
        roomNumber: '', // 房间号 int
        hotelRoomGrade: 0, // 房间等级 int

        startRoomNumber: '', // 房间起始 int
        eachCapacity: 1, // 房间容纳人数 int
        generateNumber: '', // 生成数量 int
      },
      rules,

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
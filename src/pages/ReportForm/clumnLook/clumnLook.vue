<template>
  <div class="clumnLook">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label="选择类型" prop='type'>
        <el-select v-model="form.type" placeholder="请选择类型" size="small">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label" 
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择分组" prop='group' v-if="form.type == '02'">
        <el-select v-model="form.group" placeholder="请选择分组" size="small">
          <el-option
            v-for="item in group"
            :key="item.id"
            :label="item.confereeGroupName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="查看方式" prop='outputWay' v-if="form.type == '02'">
        <el-radio-group v-model="form.outputWay">
          <el-radio label="1" class="radio">仅分组</el-radio>
          <el-radio label="2" class="radio">先分组再分类</el-radio>
          <br>
          <el-radio label="3" class="radio">仅分类</el-radio>
          <el-radio label="4" class="radio">先分类再分组</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否打印明细">
        <el-radio-group v-model="form.particulars" >
          <el-radio label="1">是</el-radio>  
          <el-radio label="0">否</el-radio>  
        </el-radio-group> 
      </el-form-item>
      <el-form-item label="活动性质" v-if="form.particulars == 1">
          <el-checkbox label="是否打印迟到人员名单" v-model="form.beLate"></el-checkbox>
          <el-checkbox label="是否打印缺席人员名单" v-model="form.missing"></el-checkbox>
          <el-checkbox label="是否打印请假人员名单" v-model="form.leave"></el-checkbox>
          <el-checkbox label="是否打印手机号" v-model="form.phoneNumber"></el-checkbox>
      </el-form-item>
    </el-form> 
  </div>
</template>

<script>
export default {
  props: ['row'],
  data() {
    return {
      checkTrue: false,
      checkedCities: [], //选中的数组
      downloadVisible: false, //下载弹窗
      // 下载选择
      cities: [
        { name: '手机电话', id: 'phone' },
        { name: '迟到人员', id: 'lay' },
        { name: '缺席人员', id: 'absent' },
        { name: '请假人员', id: 'leave' }
      ],
      form: {
        group: '',
        type: '', // 类型
        outputWay: '', // 分组
        particulars: '', // 是否打印明细
        beLate: true, // 是否打印迟到人员名单
        missing: true, // 是否打印缺席人员名单
        leave: true, // 是否打印请假人员名单
        phoneNumber: true, // 是否打印手机号
      },
      rules: {
        outputWay: [
          { required: true, message: '请选择打印方式', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择打印类型', trigger: 'blur' }
        ],
        group: [
          { required: true, message: '请选择分组', trigger: 'blur' }
        ]
      },
      handmeetingId: '', // 会议id
      options: [
        { value: '01', label: '部门'},
        { value: '02', label: '分组'},
      ],
      group: [],
    }

  },
  mounted() {
    this.handmeetingId = this.row.id
    // 获取参会人分组
    this.getGroup()
  }, 
  methods: {
    // 获取参会人分组
    getGroup(){
      this.$http.get(this.API.getConfereeGroupAll(this.handmeetingId))
        .then(res =>{
          if(res.code == '000'){
            this.group = res.data
          } else {
            this.group = []
          }
        })
    },
    close() {
      this.$emit('hidedownloadReportdialog', false);
    },
    showCheck(val) {
      if (!this.checkTrue) {
        this.checkedCities === val ? this.checkedCities : []
      }
    },
    //选择项值
    handleCheckedCitiesChange(value) {
      console.log(value)
      this.checkedCities = value
      console.log(this.checkedCities)
    },
    wordSubmit2() {
      var form = {...this.form}, url
      for(let i in form){
        if(i != 'outputWay' && i != 'group' && form[i]) form[i] = '1' 
        else if(i != 'outputWay' && i != 'group') form[i] = '0' 
      }
      console.log(form)
      let  {outputWay, particulars, beLate, missing, leave, phoneNumber} = form
      console.log(outputWay, particulars, beLate, missing, leave, phoneNumber, this.handmeetingId)

      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 02 分组, 01 部门
          if(this.form.type == '02'){
            var group = form.group
            url = this.API.downloadBbByMeetingId(
              this.handmeetingId, outputWay, particulars, beLate, missing, leave, phoneNumber, group
            )
          } else {
            url = this.API.downloadBbByDeparmentId(
              this.handmeetingId, particulars, beLate, missing, leave, phoneNumber
            )
          }

          this.$http.get(url).then(res => {
            if(res.code == '000'){
              var aDom = document.createElement('a')
              aDom.setAttribute('download', '报表')
              aDom.href = '/zhenapi/hzbase/statisticalStatement/downloadBbByRandomId/' + res.data.randomId
              aDom.click()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
  }
}
</script>

<style scoped lang='less'>
.clumnLook {
  .chatContent .el-form-item__content {
    /* display: flex; */
    text-align: left;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }

  .radio {
    margin-top: 12px;
    margin-bottom: 12px;
  }
}
</style>
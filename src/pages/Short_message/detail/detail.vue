<template>
  <div class="detail">
    <div class="form">
      <el-form ref="form" :model="item" label-width="140px" :rules='rules'>
        <el-form-item label="标题:">
          <span>{{ item.title }}</span>
        </el-form-item>
        <el-form-item label="内容:">
          <span>{{ item.content }}</span>
        </el-form-item>
        <el-form-item label="短信模板:">
          <div class="radio-group">
            <span style="margin-right: 20px" v-for="(key, val) in item.str" :key="val">{{ val }} : {{ key }}</span>
          </div>
        </el-form-item>
        
        <el-form-item label="模板编号:">
          <span>{{ item.templateCode }}</span>
        </el-form-item>
        <el-form-item label="触发情况:">
          <el-radio-group v-model="item.triggerCondition" class="radio-group" :disabled='item.configurable == 0' prop='triggerCondition'>
            <el-radio :label="0">默认</el-radio>
            <el-radio :label="1">会议开始时间前</el-radio>
            <el-radio :label="2">会议开始时间后</el-radio>
            <el-radio :label="3">会议结束时间前</el-radio>
            <el-radio :label="4">会议结束时间后</el-radio>
            <el-radio :label="5">会议开始前一天</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="触发时间:" v-if="item.triggerCondition == 5" prop='triggerTime'>
          <el-col :span="11">
            <el-time-select
              :disabled='item.configurable == 0'
              v-model="item.triggerTime"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:59'
              }"
              placeholder="选择时间:">
            </el-time-select>
          </el-col>
        </el-form-item>
        <el-form-item label="时间偏移量(分钟):" prop='triggerTimeMigrationAmount'>
            <el-input-number style="text-align: left" :disabled='item.configurable == 0' v-model="item.triggerTimeMigrationAmount" :controls='false' :min="0">
            </el-input-number>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: ['detail'],
  data() {
    return {
      // item: {
      //   title: '', // 标题
      //   content: '', // 内容 
      //   smsTemplateId: '', // 短信模板
      //   templateCode: '', // 模板编号
      //   configurable: '', // 可配置  0-不可配置, 1-可配置
      //   triggerCondition: '', // 触发情况 0-默认, 1-会议开始时间前, 2-会议开始时间后, 3-会议结束时间前, 4-会议结束时间后, 5-会议开始前一天
      //   triggerTime: '', // 触发时间: 当触发情况为 “会议开始前一天”时，此字段存储 "0:00~24:00" 之内的毫秒值
      //   triggerTimeMigrationAmount: '', // 触发时间偏移量分钟数
      // },
      item: {},

      rules: {
        triggerCondition: [
          { required: true, message: '请选择触发情况', trigger: 'change' }
        ],
        triggerTime: [
          { required: true, message: '请选择触发时间', trigger: 'change' }
        ],
        triggerTimeMigrationAmount: [
          { required: true, message: '请输入时间偏移量', trigger: 'change' }
        ],
      },
      loginInfo: {}
    }
  },

  mounted() {
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'))

    this.$http.get(this.API.findSmsTemplateById(this.detail.cid))
      .then(res => {
        if(res.code == '000' && res.data){
          let data = res.data, 
            triggerTime = data.triggerTime,
            item = this.detail

          if (!triggerTime) {
            triggerTime = ''
          } else {
            var m = Math.floor(triggerTime / 1000 / 3600), s = (triggerTime / 1000) % 60
            data.triggerTime =
              (m < 10 ? ("0" + m) : m)
              + ':' +
              (s < 10 ? ("0" + s) : s)
          }
    
          this.item = {
            smsTemplateId: item.id,
            companyId: this.loginInfo.companyId,
            id: item.cid, 
            triggerTime: data.triggerTime,
            configurable: data.configurable,
            triggerCondition: data.triggerCondition,
            templateCode: item.id,
            title: data.title,
            content: data.content,
            triggerTimeMigrationAmount: data.triggerTimeMigrationAmount,
            str: {}
          }
          var arr = data.param_config_json_str.split(';')
          arr.filter(i => {
            var o = i.split('-')[0], t = i.split('-')[1]
            this.item.str[o] = t
          })
        }
      })
  }
}
</script>

<style scoped lang='less'>

</style>
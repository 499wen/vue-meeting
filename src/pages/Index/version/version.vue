<template>
  <div class="version">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="变更版本" prop="version">
        <el-select v-model="ruleForm.version" size="small" placeholder="请选择变更版本" @change="verChange">
          <el-option v-for="(item, idx) in allVersion" :key="idx"
            :label="item.systemEditionName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠码">
        <el-input v-model="ruleForm.couponId" class="input-with-select" size="small">
          <el-button slot="append" @click="verif">检验</el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['allVersion'],
  data(){
    return {
      ruleForm: {
        version: '',
        couponId: '',
      },
      rules: {
        version: [
          { required: true, message: '请选择变更版本', trigger: 'blur' },
        ],
      },

      cur: ''
    }
  },
  methods: {
    verChange(id) {
      console.log(id)
      this.cur = this.allVersion.filter(its => its.id == id && its )[0]
      let price = this.cur.systemEditionPrice
      this.$emit('money', price)
    },

    // 检验
    verif() {
      let sid = this.cur.sid, couponId = this.ruleForm.couponId
      this.$http.post( this.API.check(sid, couponId))
        .then(res => {
          console.log(res)
          if(res.code == '000'){
            this.$message.success('检验成功!')
            this.$emit('money', res.data)
          } else {
            this.$message.error(res.msg)
          }
        })
    }
  }
}
</script>

<style scoped lang='less'>
.version {
  width: 100%;
  height: 100%;

}
</style>
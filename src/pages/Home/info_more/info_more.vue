<template>
  <div class="info_more">
    <div class="header-opera">
      <div class="tap">
        <div :class="item.select && 'select'" @click="tabList(idx)"
         v-for="(item, idx) in list" :key="idx">{{ item.name }}</div> 
      </div>

      <div class="look-more" @click="back">返回首页</div>
    </div>

    <!-- 会议信息 -->
    <div class="body" v-show="list[0].select">
      <meetInfo v-if="list[0].select"></meetInfo>
    </div>
    <div class="body" v-show="list[1].select">
      <leaveMess v-if="list[1].select"></leaveMess>
    </div>
  </div>
</template>

<script>
import meetInfo from './meet_info/meet_info_child.vue'
import leaveMess from './leave_mess/leaveMess.vue'

export default {
  components: {
    meetInfo,
    leaveMess
  },
  data() {
    return {
      list: [
        {name: '会议信息', select: false},
        {name: '请假消息', select: false}
      ],
    }
  },
  methods: {
    // 返回首页
    back(){
      this.$router.go(-1)
    },
    // 切换list
    tabList(index){
      this.list.filter((item, idx) => idx == index ? item.select = true : item.select = false)
    },
  },
  created() {
    let name = this.$route.query.msg
    this.list.filter(item => item.name == name ? item.select = true : item.select = false)
  },
  mounted() {
  }
}
</script>

<style scoped lang='less'>
.info_more {
  width: 100%;
  height: 100%;

  .tap {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    & > div {
      padding: 0 5px;
      margin: 0 10px;
      position: relative;
      cursor: pointer;
    }

    .select:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: 0px;
      left: 0;
      background-color: #234060;
    }
  }

  .body {
    height: calc(100% - 50px);
    width: 100%;

  }
}

</style>
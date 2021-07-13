<template>
  <div class="appSign">
    <!-- 模板 -->
    <div class="taoi">
      <div class="model-box">
        <div :class="['single', its.select && 'select']" v-for="(its, idx) in model" :key="idx" @click="chioce(idx)">

          <!-- 模型一 -->
          <div class="one" v-if="idx == 0">
            <!-- 会议名称 -->
            <div class="meet-name">会议名称: xxx会议</div>

            <!-- 签到人员信息 -->
            <div class="person-info">
              <div class="photo"></div>
              <div class="info">
                <span>姓名：xxx</span>
              </div>
            </div>

            <!-- 签到数据 -->
            <div class="sign-data">
              <span>应到人数：112人</span>
              <span>已签到：12人</span>
            </div>
          </div>

          <!-- 模型二 -->
          <div class="two" v-if="idx == 1">
            <!-- 会议名称 -->
            <div class="meet-name">会议名称: xxx会议</div>

            <!-- 签到人员信息 -->
            <div class="person-info">
              <div class="info">
                <span>姓名：xxx</span>
              </div>
              <div class="photo"></div>
            </div>

            <!-- 签到数据 -->
            <div class="sign-data">
              <span>应到人数：112人</span>
              <span>已签到：12人</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 底图 -->
    <div class="base-map">
      <div class="map-box">
        <div :class="['single', its.select && 'select']" v-for="(its, idx) in baseMap" :key="idx" @click="chioceMap(idx)">
          <img :src="API.echoImage(its.img, 'app')" alt="" @error="errImg(its.img, 'app', $event)">
        </div>

        <!-- 上传 -->
        <div class="single upload">
          <input type="file" name="" id="file" @change="uploadMap" ref="file">
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import appSign from './appSign.js'

export default appSign
</script>

<style scoped lang='less'>
@import url('./appSign.less');
</style>
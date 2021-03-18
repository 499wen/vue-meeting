import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /**
     * 会议管理
     */
    meetingData: {}, // 当前会议数据
    attendeeData: null, // 参会人数据

    /**
     * 首页
     */
    notheldMeet: [], // 未召开会议
    calendarTime: null, // 日历 (时间戳)
  },
  mutations: {
    // 设置会议数据
    setMeetingData(state, data){
      state.meetingData = data
    },

    // 设置参会人数据
    setAttendeeData(state, data){
      state.attendeeData = data
    },

    // 首页 - 未召开会议
    setNotheldMeet(state, data) {
      state.notheldMeet = data
    },
    // 设置当前选中的时间戳
    setCalendarTime(state, data) {
      state.calendarTime = data
    }
  },
  actions: {
  }, 
  modules: {
  },
});

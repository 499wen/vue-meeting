import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    meetingData: {}, // 当前会议数据
    attendeeData: null, // 参会人数据
  },
  mutations: {
    // 设置会议数据
    setMeetingData(state, data){
      state.meetingData = data
    },

    // 设置参会人数据
    setAttendeeData(state, data){
      state.attendeeData = data
    }
  },
  actions: {
  }, 
  modules: {
  },
});

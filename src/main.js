import Vue from 'vue';
import App from './App.vue';
import router from './router'; 
import store from './store/index.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI); 
import ResetMessage from './plugins/resetMessage.js'
Vue.prototype.$message = ResetMessage

// 引入axios
import $http from './plugins/axios.js'
Vue.prototype.$http = $http

// 引入axios
import './API/api.js'

// 引入图片懒加载
import vueLazy from 'vue-lazyload'
Vue.use(vueLazy, {
  error: require('@/assets/images/avatar.png'),
  loading: require('@/assets/images/avatar.png')
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
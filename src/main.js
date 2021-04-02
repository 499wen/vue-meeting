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

// 挂载axios
import $http from './plugins/axios.js'
Vue.prototype.$http = $http

// 挂载echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 挂载接口对象
import Api from './API/api.js'
Vue.prototype.API = Api

// 挂载文件上传服务
import { fileUpload, errImg } from './plugins/file_upload.js'
Vue.prototype.fileUpload = fileUpload
Vue.prototype.errImg = errImg

// 引入图片懒加载
import vueLazy from 'vue-lazyload'
Vue.use(vueLazy, {
  error: require('@/assets/images/avatar.png'),
  loading: require('@/assets/images/avatar.png')
})

// 引入 vue-worker
import VueWorker from 'vue-worker'
Vue.use(VueWorker)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
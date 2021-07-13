import Vue from 'vue'
import router from '@/router'
import { delCookie } from '@/plugins/cookie.js'


//引入axios
import axios from 'axios';
import { Loading, Message } from 'element-ui';
import _ from 'lodash'; 

//loading对象
let loading;
  
//当前正在请求的数量
let needLoadingRequestCount = 0;
// 定时器
let dsQi = null, s = 0,
    dsQi2 = null, s2 = 0
//显示loading
axios.defaults.timeout= 600000
function showLoading(target) {
  // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
  // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
  if (needLoadingRequestCount === 0 && !loading) {
    loading = Loading.service({
      lock: true,
      text: "Loading...",
      background: 'rgba(0, 0, 0, 0.5)',
      target: target || "body"
    });
  }
  needLoadingRequestCount++;
}


//隐藏loading
function hideLoading() {
  needLoadingRequestCount--;
  needLoadingRequestCount = Math.max(needLoadingRequestCount, 0); //做个保护
  if (needLoadingRequestCount === 0) {
    //关闭loading
    toHideLoading();
  }
}

//防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
var toHideLoading = _.debounce(()=>{
  try{
    loading.close();
    loading = null;
  }catch(error){
  }
}, 300);


//配置axios拦截器
let instance = axios.create({
  headers: { 
    'content-type': 'application/json; charset=utf-8;',
    // 'Access-Control-Allow-Origin': '*',
    // 'X-Alt-Referer': "https://mt.smart-hwt.com/"
    // Authorization: '12'
  }
})
//请求拦截器
instance.interceptors.request.use(
  
  config=>{
    config = config || {}
    let token=localStorage.getItem('token')
    // config.headers['content-type'] = 'application/json; charset=utf-8'

    if(token){
      //每次请求前，如果token存在则在请求头上添加token
      config.headers.token = token
      // config.headers.Authorization = token
    }

    // console.log(config)
    showLoading()
    return config;
  },
  err=>{
    // console.log('err', err)
    hideLoading()
    if(err.headers.showLoading !== false){
      hideLoading();
        s += 1
      // clearInterval(dsQi)
      // Message.error('加载超时。请重新刷新页面11231！')
    }
    Message.error('请求超时!');
    return Promise.resolve(err);
    // return Promise.reject(err)
  }

)
//响应拦截器
instance.interceptors.response.use(
  response=>{
    // console.log(response)
    // 判断是否过期
    if(response.data.code == -1){
      localStorage.removeItem('token')
      delCookie('autoLogin')
      router.push('/login')
    }
    
    if(response.status == 200) {
        hideLoading();
    }
    return response.data
  },
  err=>{
    // console.log(err)
    if(err == 'Error: timeout of 5000ms exceeded at createError'){
      hideLoading()
      Message.error('已超时，请检查网络是否流畅！')
    } else 
    if(err=="Error: Request failed with status code 500"){
      hideLoading()
    //  Message.error('加载超时。请重新刷新页面！')
    }else{
      switch (err.response && err.response.status) {

        case 400:
            Message.error('请求错误!')
          break

          case 403:
            Message.error('没有权限，拒绝访问')
          break
          case 404:
            Message.error( `请求地址出错: ${err.response.config.url}`)
          break
          case 408:
            Message.error('请求超时。请重新刷新页面！')
          break
          case 500:
            Message.error('请检查网络是否流畅。重新刷新页面！')
          break
          case 501:
            Message.error('服务未实现')
          break
          case 502:
            Message.error('网关错误')
          break
          case 503:
            Message.error('服务不可用')
          break
          case 504:
            Message.error('网关超时')
          break
          case 505:
            Message.error('HTTP版本不受支持')
          break
          default:
      }
    }

    //  设置5S定时 超过给出提示
    if(err.config.headers.showLoading !== false){
      hideLoading();
    }
    if(err.response.status == 401){
      //说明没有权限，需要进行登陆操作
      console.log('没有权限！')
      console.log(parent)
      window.parent.postMessage('401','*');
      return Promise.reject(err)
    }
    if(err.response && err.response.data && err.response.data.message) {
      var jsonObj = JSON.parse(err.response.data.message);
      Message.error(jsonObj.message);
       return Promise.reject(err);
    }else{
      Message.error(err.message);
      return Promise.reject(err);
    } 
   
    
  }
)


export default instance
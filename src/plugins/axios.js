import Vue from 'vue'

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
axios.defaults.timeout=5000
function showLoading(target) {
  // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
  // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
  if (needLoadingRequestCount === 0 && !loading) {
    loading = Loading.service({
      lock: true,
      text: "Loading...",
      background: 'rgba(255, 255, 255, 0.5)',
      target: target || "body" 
    });
    // setTimeout(() => {
    //   hideLoading()
    //   alert('加载时间过长。请刷新页面再进行请求！')
    // }, 5000)
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
    'content-type': 'application/json;charset=UTF-8',
    // 'token': "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDI4ODBhYzcyMzRjY2NkMDE3MjM0ZGYzMTcwMDAyYSJ9.ha_86lMqcLBv3HciEwV_XJMiwOghKKvcrWZ2kwJl2vk"
  }
})
//请求拦截器
instance.interceptors.request.use(
  
  config=>{
    config = config || {}
    let token=localStorage.getItem('token')
    if(token){
      //每次请求前，如果token存在则在请求头上添加token
      config.headers.token=token
      config.headers.Authorization=token
    }
    if(config.headers.showLoading !== false){

          showLoading(config.headers.loadingTarget);
             // console.log('定时器的位置')
          
            //   console.log('500000服务器'); 
            //   dsQi = setTimeout(() => {
            //       s += 1
            //        if(s ){
            //         // clearInterval(dsQi)
            //         toHideLoading()
            //         Message.error('加载超时。请重新刷新页面111！')
                    
            //        }
            // }, 3000)
     
    }
    return config;
  },
  err=>{
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
    
     //判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
    if(response.config.headers.showLoading !== false){
      toHideLoading();
     
    }
    return response.data
  },
  err=>{
    if(err=="Error: Request failed with status code 500"){
      toHideLoading()
    //  Message.error('加载超时。请重新刷新页面！')
    }else{
      switch (err.response.status) {
        // case 500:
        //     console.log('500服务器'); 
        //       dsQi2 = setTimeout(() => {
        //           toHideLoading()
        //           Message.error('加载失败。请重新刷新页面！')
                
        //     }, 3000)
        //   break;

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
   

      // http://www.cppcns.com/ruanjian/java/221703.html
    // if(err.response.hasOwnProperty('status')){
    //   console.log('500服务器'); 
    //   toHideLoading()
    //   Message.error('加载超时。请重新刷新页面！')
    // }
    // switch (err.response.status==undefined||) {
    //   case 500:
    //     console.log('500服务器'); 
    //       dsQi2 = setTimeout(() => {
    //           toHideLoading()
    //           Message.error('加载超时。请重新刷新页面！')
            
    //     }, 3000)
    //   break;
    // }

  
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
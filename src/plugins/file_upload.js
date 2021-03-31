import $ from 'jquery'
import API from '../API/api.js'
import { Loading, Message } from 'element-ui';
let loading = null

/**
 * @param {*} file Object 文件对象
 *         name: "Snipaste.png"
 *         size: 17840
 *         type: "image/png"
 * @param {*} type 文件保存类型
 *         HeadFile  头像
 *         Card  证卡
 *         CustomerHeadImage  管理员头像
 *         HotelPlane  酒店平面图
 *         HotelImage  酒店封面
 *         Invitation  邀请函
 *         MeetingImage  会议
 *         MeetingPlane  会议平面图
 *         MeetingRoomImage 会议室图片
 *         MeetingRoomPlane  会议室平面图
 *         RestaurantPlane  餐厅平面图
 *         Restaurant  餐厅图片
 *          
 * @param {*} callBack 函数回调
 *         res
 *  this.fileUpload(file, res => {
      console.log(res)
    })
 */
export function fileUpload(file, type, callBack) {
  // 取出文件相关数据
  let param = {
    name: file.name,
    type
  }

  // 创建 文件储存对象
  let reader = new FileReader();
  reader.readAsArrayBuffer(file);
  let blob = null;

  // 文件加载
  reader.onload = (e) => {
    // 加载
    loading = Loading.service({
      lock: true,
      text: "Loading...",
      background: 'rgba(0, 0, 0, 0.5)',
      target: "body"
    })

    // 创建 blob对象
    if (typeof e.target.result === 'object') {
      blob = new Blob([e.target.result])
    } else {
      blob = e.target.result
    }
    // console.log(Object.prototype.toString.call(blob));
    console.log(serialize(param))
    // 将文件上传后端
    $.ajax({
      url: API.uploadFile + serialize(param),
      data: blob,
      type: "Post",
      "headers": {
        "Content-Type": "image/png",
        token: localStorage.getItem('token')
      },
      dataType: "json",
      // cache: false,//上传文件无需缓存
      processData: false,//用于对data参数进行序列化处理 这里必须false
      contentType: false, //必须
      success: function (res) {
        callBack(res)
        loading.close();
        loading = null
      },
      error(err) {
        Message.error('上传失败！请刷新重试。')
        loading.close();
        loading = null
      }
    })
  }

  // 对象序列化
  function serialize(obj) {
    if(!Object.keys(obj).length) return
    let string = ''

    for(let i in obj){
      string += i + '=' + obj[i] + '&'
    }
    string = string.substr(0, string.length - 1)

    return string
  }
}

/**
 * 当图片显示出问题
 *  @error="errImg(name, 'HeadFile', $event)"
 * @param {*} name 
 *        错误地址
 * @param {*} type
 *        HeadFile  头像
 *        Card  证卡
 *        CustomerHeadImage  管理员头像
 *        HotelPlane  酒店平面图
 *        HotelImage  酒店封面
 *        Invitation  邀请函
 *        MeetingImage  会议
 *        MeetingPlane  会议平面图  
 *        MeetingRoomImage 会议室图片
 *        MeetingRoomPlane  会议室平面图
 *        RestaurantPlane  餐厅平面图
 *        Restaurant  餐厅图片
 * @param {*} e 
 *        event对象
 */
export function errImg(name, type, e) {
  setTimeout(() => {
    let self = e.target
    if(!self.dataset.cont) {
      self.dataset.cont = 1
    } else {
      self.dataset.cont++
    }
  
    if(self.dataset.cont <= 60){
      self.src = this.API.echoImage(name, type)
    } else {
      self.dataset.cont = 0
    }
  
    self.onload = () => {
      self.dataset.cont = 0
    }
  }, 1000)
}
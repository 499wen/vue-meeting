import $ from 'jquery'
import API from '../API/api.js'

/**
 * @param {*} file Object 文件对象
 *         name: "Snipaste.png"
 *         size: 17840
 *         type: "image/png"
 * @param {*} callBack 函数回调
 *         res
 *  this.fileUpload(file, res => {
      console.log(res)
    })
 */
export default function fileUpload(file, callBack) {
  // 判断文件类型
  let isimgs = file.type.indexOf('image') > -1, type
  if(isimgs){
    type = 'HeadFile'
  }
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
    // 创建 blob对象
    if (typeof e.target.result === 'object') {
      blob = new Blob([e.target.result])
    } else {
      blob = e.target.result
    }
    // console.log(Object.prototype.toString.call(blob));

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
      },
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
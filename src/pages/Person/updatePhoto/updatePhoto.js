import { Load } from '@/plugins/plugins.js'
import $ from 'jquery'
let reload = null, token = localStorage.getItem('token')

class FileImg {
  self = null
  n = 1
  func = {}

  constructor(self, data) {
    this.self = self
    var dsq = 1, num = 500, imgsLt = this.self.imgs.length

    for (let i = 1; i <= Math.ceil(data.length / num); i++) {
      this.func['a' + i] = data.slice((i - 1) * num, num * i)
    }

    var t = setInterval(() => {
      if (data.length == (this.self.imgs.length - imgsLt)) {
        clearInterval(t)
        this.self.showNum = this.self.imgs.length
        // 设置showNum
        this.$emit('setShowNum', this.showNum)
        this.self.load.hide()
        
        console.log(new Date().getTime())

      } else {
        this.showDocument(this.func['a' + this.n])
      }
    }, dsq * 500)
  }
 
  /**
   * url: 图片地址
   * bool: 隐藏(删除)
   * cf: 重复
   * err: 失败
   */
  showDocument(data) {
    for (let i = 0; data && i < data.length; i++) {
      this.self.imgs.push({
        url: this.self.getObjectURL(data[i]),
        bool: true,
        cf: false,
        err: false,
        files: data[i]
      })
    }
    this.n++
  }
}

export default {
  name: 'compressImage',
  props: {
    externalCode: String
  },
  data() {
    return {
      formData: new FormData(), 
      imgs: [], // 预览数据
      process: [], // 进程数据
      //   imgLen:0, 
      dialogVisible: false,
      dialogImageUrl: '',
      headers: {
        Authorization: token,
        token
      },
      fil: [],
      switchBtn: false,
      nameList: [],
      radio: 'internal',
      url: '',
      show: false,
      imgsNum: 0,
      load: {
        n: 0,
        obj: null,
        show(text){
          this.n ++
          if(!this.obj)
            this.obj = new Load(text)
        },
        hide(){
          this.obj.close()
          this.obj = null
        },
        execution: false
      },
      showNum: 0,

      /**
       *    err: 上传失败
       *    cf: 图片重复
       *    noImg: 不是图片类型
       *    sizeToBig: 尺寸过大
       */
      gl: [], // 上传结束后过滤的数据
      tableCate: [
        { name: '图片名称', descption: 'name' },
        { name: '原因', descption: 'reason' }
      ]
    }
  },
  methods: {
    // 测试
    exportExcel(){
      console.log('exportExcel')
    },
    // 1.外部人员  2.内部人员
    radioGroup(e) {
      console.log(e)
      this.radio = e
    },
    //查看大图 
    dialogImg(file) {
      this.dialogImageUrl = file
      // return
      this.dialogVisible = true
    },
    // 删除单个图片
    delSingleImg(idx) {
      var val = this.imgs
      this.$confirm('是否删除当前照片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        val[idx].bool = false
        this.showNum -= 1
        // 设置showNum
        this.$emit('setShowNum', this.showNum)
      })
    },
    // 上传文件获取焦点
    focusImg(event){
      var file = this.$refs.exportExcelFile,
          files = file.files
      console.log(files, Object.values(files).length)
      
      if(!this.load.execution){
        this.load.show()
        this.load.execution = true
        reload = null
      } else {
        setTimeout(() => {
          if(!reload){
            this.load.execution = false
            this.load.hide()
            file.blur()
          }
        }, 1000)
      }
    },
    // 上传文件监听文件数据
    clickImgUpdate(event){
      var file = this.$refs.exportExcelFile,
          files = file.files
      file.blur()
      console.log(files)
      if(Object.values(files).length){
        console.log('inputImg-')
        this.load.execution = false
        
        reload = true
      }
    },
    addImg(event) {
      // return 
      console.log(event)
      this.load.show()
      let inputDOM = this.$refs.exportExcelFile.files, fil = {}
      if (Object.keys(inputDOM).length) {
        
        for (let i in inputDOM) {
          // console.log(typeof inputDOM[i])
          // 图片类型 => Object
          if (typeof inputDOM[i] == 'object') {
            let size = Math.floor(inputDOM[i].size / 1024);
            if (size <= 200) {
              // alert('请选择200KB以内的图片！');
              // this.$message.warning('请选择200KB以内的图片！')
              // return false
              fil[i] = inputDOM[i]
            } else {
              this.gl.push({
                sizeToBig: true,
                reason: '大小超过200kb',
                files: inputDOM[i]
              })
            }
          } else {
            this.gl.push({
              noImg: true,
              reason: '不是符合图片类型',
              files: inputDOM[i]
            })
          }
        }

        if(!Object.values(fil).length){
          this.load.hide()
          return 
        }
        
        // 通过DOM取文件数据
        this.fil = this.fil.concat(Object.values(fil));
        this.showNum = this.fil.length
        // 设置showNum
        this.$emit('setShowNum', this.showNum)
        // 初始化上传状态
        this.$refs.exportExcelFile.value = ''
      } else {
        this.load.hide()
      }

    },
    // 图片显示
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) { // basic
        // console.log('1',window.createObjectURL(file))
        url = window.createObjectURL(file)
      } else if (window.URL != undefined) { // mozilla(firefox)
        // console.log('2',window.URL.createObjectURL(file))
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) { // webkit or chrome
        // console.log('3',window.webkitURL.createObjectURL(file))
        url = window.webkitURL.createObjectURL(file)
      }
      // console.log('url',url)
      return url;
    },
    // 单个上传图片
    submit(val, key) {
      let formData = new FormData()
      formData.append('file', val.files)

      // 判断文件大小
      if (+val.size / 1024 > 300) {
        // this.$message.error('图片太大,上传失败! 请选择300KB以内的图片！')
        return
      }

      this.$http.post(this.API.matchingUserPhotoFiles(this.radio), formData).then(res => {
        try{
          if (res.statusCode == '000' || res.msg == '头像绑定人员失败') {
            this.$message.success('上传成功!')
            val.bool = false
          } else if (res.statusCode == '001' && res.msg == '失败') {
            this.$message.error('上传失败!')
            val.err = true
            val.cf = false
          } else if(res.statusCode == '003'){
            this.$message.info('图片重复上传!')
            val.err = false
            val.cf = true
          }

          console.log(val)
        } catch(err){

        }

      });
    },
    // 上传图片请求
    loadRequest(file, callBack){
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
        
        // 将文件上传后端
        $.ajax({
          url: this.API.matchingUserPhotoFiles(this.radio, file.name),
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
          error(err) {
            console.log('上传失败！请刷新重试。')
            callBack('error')
          }
        })
      }
    },

    /**
     * 
     * @param {*} arr 
     *    当前进程所有数据 Array
     * @param {*} callBack 
     *    回调每个进程结束状态 Func
     * 
     * api返回值 [Y: 返回, N: 不返回] -> [返回数据]Array
     *    000: 上传成功！头像绑定人员成功   Y -> successArr
     *    001: 出现错误 
     *          1.msg: 上传失败  Y -> cfArr
     *          2.msg: 上传成功！头像绑定人员失败 
     *    003：上传失败！图片重复 Y -> errArr
     * 
     */
    // worker api
    apiWorker(arr, callBack) {
      var that = this, cfArr = [], errArr = [], successArr = []
      console.log(arr)
      // return 
      function lx(n = 0, arr) {
        try{
          that.loadRequest(arr[n], res => {
            try{
              if(res == 'error'){
                errArr.push(n)

                // 监听轮询状态
                if (n < arr.length - 1) {
                  n++
                  lx(n, arr)
                } else {
                  callBack(cfArr, errArr, successArr)
                }
              } else {
                if(res.code == '003'){
                  cfArr.push(n)
                } else if(res.code == '001'){
                  errArr.push(n)
                } else if(res.code == '000'){
                  successArr.push(n)
                }
      
                // 监听轮询状态
                if (n < arr.length - 1) {
                  n++
                  lx(n, arr)
                } else {
                  callBack(cfArr, errArr, successArr)
                }
              }
            } catch(err) {
              errArr.push(n)

              // 监听轮询状态
              if (n < arr.length - 1) {
                n++
                lx(n, arr)
              } else {
                callBack(cfArr, errArr, successArr)
              }
            }
          })
        } catch(err) {
          errArr.push(n)

          // 监听轮询状态
          if (n < arr.length - 1) {
            n++
            lx(n, arr)
          } else {
            callBack(cfArr, errArr, successArr)
          }
        }

      }

      lx(0, arr)

    },
    /**
     * 全部成功 - 执行
     *    success: Array (保存线程结束 标记)
     *    sign: Number (线程结束时 标记)
     *    num: Number (线程数量)
     * 
     *    cfArr: Array[id] (重复图片)
     *    errArr: Array[id] (上传失败)
     *    successArr: Array[id] (上传成功)
     *    numOfPre: Number (每个线程平均的数据量)
     */
    allSuccess(success, sign, num, cfArr, errArr, successArr, numOfPre) {
      success.push(sign)
      // console.log(cfArr, errArr, successArr)

      this.imgs.filter(item => item.cf = true)
      // 重复
      for(let i = 0; i < cfArr.length; i++){
        var cfData = this.imgs[(sign - 1) * numOfPre + cfArr[i]]
        cfData.cf = true
        cfData.reason = '图片重复'
        cfData.err = false
      }

      console.log(errArr)
      // 失败
      for(let i = 0; i < errArr.length; i++){
        var errData = this.imgs[(sign - 1) * numOfPre + errArr[i]]
        errData.err = true
        errData.reason = '上传失败'
        errData.cf = false
      }

      // 成功
      for(let i = 0; i < successArr.length; i++){
        var succData = this.imgs[(sign - 1) * numOfPre + successArr[i]]
        succData.bool = false
      }

      if (success.length == num) {
        this.$message.success('上传结束！')
        this.emptyData()
        console.log('全部结束')
        // load.hide()
      } else {
        return success
      }
    },
    // 清空数据
    emptyData(){
      console.log('emptyData')
      this.showNum = 0
      // 设置showNum
      this.$emit('setShowNum', this.showNum)
      
      this.fil = []
      this.imgs = []
      this.gl = this.gl.concat(this.imgs.filter(item => (item.err || item.cf) && item))
      console.log(this.gl.length, this.gl)
    },
    // 全部上传 n = 0
    /**
     *  if  上传数量小于 num 
     *          一个进程
     *  else  
     *          十个进程
     */
    imgUploadAll(e) {
      this.load.show('图片正在上传，请稍等。。。')

      var val = [], success = [], num = 10, that = this
      this.imgs.filter( item => item.bool && val.push(item.files))

      if (val.length <= num) {
        this.worker.postMessage('img01', [val]).then(res => this.apiWorker(res, (cfArr, errArr, successArr) => {
          success = that.allSuccess(success, 1, 1, cfArr, errArr, successArr, 10)
        }))
      } else {
        // 将数据分批放到workder中
        var n = Math.floor(val.length / num)
        this.worker.postMessage('img01', [val.slice(0, n)]).then(res => this.apiWorker( res, (cfArr, errArr, successArr) => {
          success = that.allSuccess(success, 1, num, cfArr, errArr, successArr, n)
        }))
        this.worker.postMessage('img02', [val.slice(n, n * 2)]).then(res => this.apiWorker(res, (cfArr, errArr, successArr) => {
          success = that.allSuccess(success, 2, num, cfArr, errArr, successArr, n)
        }))
        this.worker.postMessage('img03', [val.slice(n * 2, n * 3)]).then(res => this.apiWorker(res, (cfArr, errArr, successArr) => {
          success = that.allSuccess(success, 3, num, cfArr, errArr, successArr, n)
        }))
        this.worker.postMessage('img04', [val.slice(n * 3, n * 4)]).then(res => this.apiWorker(res, (cfArr, errArr, successArr) => {
          success = that.allSuccess(success, 4, num, cfArr, errArr, successArr, n)
        }))
        this.worker.postMessage('img05', [val.slice(n * 4, n * 5)]).then(res => this.apiWorker(res, (cfArr, errArr, successArr) => {
          success = that.allSuccess(success, 5, num, cfArr, errArr, successArr, n)
        }))
        this.worker.postMessage('img06', [val.slice(n * 5, n * 6)]).then(res => this.apiWorker(res, (cfArr, errArr, successArr) => {
          success = that.allSuccess(success, 6, num, cfArr, errArr, successArr, n)
        }))
        this.worker.postMessage('img07', [val.slice(n * 6, n * 7)]).then(res => this.apiWorker(res, (cfArr, errArr, successArr) => {
          success = that.allSuccess(success, 7, num, cfArr, errArr, successArr, n)
        }))
        this.worker.postMessage('img08', [val.slice(n * 7, n * 8)]).then(res => this.apiWorker(res, (cfArr, errArr, successArr) => {
          success = that.allSuccess(success, 8, num, cfArr, errArr, successArr, n)
        }))
        this.worker.postMessage('img09', [val.slice(n * 8, n * 9)]).then(res => this.apiWorker(res, (cfArr, errArr, successArr) => {
          success = that.allSuccess(success, 9, num, cfArr, errArr, successArr, n)
        }))
        this.worker.postMessage('img10', [val.slice(n * 9)]).then(res => this.apiWorker(res, (cfArr, errArr, successArr) => {
          success = that.allSuccess(success, 10, num, cfArr, errArr, successArr, n)
        }))
      }

    },
  },
  mounted() {
  },
  watch: {
    fil: function (val) {
      if (val && val.length) {
        this.imgs = []
        val.filter(item => {
          this.imgs.push({
            url: this.getObjectURL(item),
            bool: true,
            cf: false,
            err: false,
            files: item
          })
        })
        console.log(this.imgs.length)
        

        // 分10个进程
        this.worker = this.$worker.create([
          { message: 'img01', func: data => data},
          { message: 'img02', func: data => data},
          { message: 'img03', func: data => data},
          { message: 'img04', func: data => data},
          { message: 'img05', func: data => data},
          { message: 'img06', func: data => data},
          { message: 'img07', func: data => data},
          { message: 'img08', func: data => data},
          { message: 'img09', func: data => data},
          { message: 'img10', func: data => data},
        ])
      }


      setTimeout(() => {
        // new FileImg(this, val)
        this.load.hide()
      }, 1000)
    }
  }
}
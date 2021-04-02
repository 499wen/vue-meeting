import $, { data } from "jquery";
import QRCode from "qrcodejs2";
import html2canvas from 'html2canvas'
import { mapState } from 'vuex'
let qrcodeUrl
// import selfQrcode from '../../plugins/self-qrcode'

import {
  hideBox, 
  eachPageData,
  idMap,
  nodeStyleMap, 
  nodes,
  drop, 
  initNode,
  reduction,  
  addSubmitForm, 
  imageDrag,
  imageDragover
} from "./control.js";  
 
var token = localStorage.getItem("token"), t = null,
loading = {
	show(){
		window.parent.postMessage({method: 'loading', action: 'show'}, '*')
	},
	hide(){
		window.parent.postMessage({method: 'loading', action: 'hide'}, '*')
	}
}

export default {
  props: ["meetId", "meetIsEnd"], //props
  data() {
    return {
      /**
       * dataCollection 结构
       * [
       *  { 
       *    page: '1',  // 页码标识
       *    dataPre: [], // 每页对应的元素映射
       *    eleList: [], // 保存每页的元素列
       *    model: {}, // 模板相应数据
       *    formAttr: { // 表单相应数据
              'enable': false, // 使用表单标记
              'sex': false, // 性别
              'company': false, // 单位
              'department': false, // 部门
              'post': false, // 职务
              'email': false, // 电子邮件
              'userName': true, // 姓名
            },
       *  }
       * ]
       * 
       */
      dataCollection: [
        {
          page: 1,
          dataPre: [],
          eleList: [],
          model: {
            height: 720,
            width: 375,
            img: '',
            pattern: 'multiPage'
          },
          formAttr: {
            'enable': true, // 使用表单标记
            'sex': true, // 性别
            'company': true, // 单位
            'department': true, // 部门
            'post': true, // 职务
            'email': true, // 电子邮件
            'userName': true, // 姓名
          },
        }
      ], // 数据收集
      curPage: 1, // 当前页数
      activeName: [],
      location: window.location.host,
      headers: {
        Authorization: token,
        token
      },
      popupVisible: false, //控制选择背景图弹出层的隐藏与显示
      popupModel: false, // 控制模板弹出层的隐藏与显示
      isLongPage: true, //是否为长页模式
      longPageHeight: 720, //长页的长度，单位px
      longPageHeightArray: [],
      tempScreenY: 0, //鼠标的Y轴坐标
      isElongate: false, //是否处于拉伸长页状态
      longInterval: null, //拉伸长页的定时器
      codeVisible: false, //控制二维码的显示与隐藏
      needForm: false,
      showStyle: true,
      showKey: 0,
      address: "",

      isImage: false,

      // 接收当前元素的 数据对象
      defaultStyle: {},

      // 当前选中的 元素dom
      tNode: "",

      shadowDirection: 0,
      pageContent: [],
      formConfigVisible: false, //控制表单设置的隐藏与显示
      formConfig: {
        userName: true,
        sex: false,
        workplace: true,
        department: true,
        duties: true,
        email: true
      },
      eleColumn: '1',
      // letterProduction: {
      // 	imgList: ['封面'],
      // },
      isLoad:false, //是否已加载过一次，为true则不调用initPage内的接口
      content: "内容",
      switchImg: 0,
      idList: [], // 存放id
      //idMap:{},		// 存放id在第几页
      tempStyle: {
        list: [{
          id: "",
          name: "酷炫紫",
          imgSrc: "../../public/static/images/temp-m-01.jpg",
          titColor: "#fff",
          msgColor: "#fff",
          indexTitTop: 100,
          indexTitSize: 28,
          inxexMsgTop: 300,
          indexMsgSize: 16,
          mainTitTop: 75,
          mainTitSize: 24,
          mainMsgTop: 150,
          mainMsgSize: 13
        }]
      },
      tempData: {
        list: [{
          id: 1,
          title: "",
          msg: ""
        }],
        // selBg取数组中第一个数据
        // selBg: {
        //   id: "",
        //   imgSrc: require('../../assets/temp-01.jpg')
        // },
        webTitle: "",
        selKey: 0
      },
      invitaModel: [],
      meetingId: '', // b4YV4XMBqsHl2Dc3yhxB Bu3L5XMBa3qYx5S9GpUS
      selectModel: null,
      id: null,
      bgImage: [],
      selectImg: null,
      zoom: 100,
      loginInfo: {
        companyId: '3312381215'
      }
    };
  },
  created() {
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    this.meetingId = this.meetingData.id
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  mounted() {
    console.log(this.$parent.$parent)
    // 请求数据
    this.initPage()
    
    var dom = document.querySelector("#phone-item")
    // 移入事件
    dom.onmousemove = () => {
      document.oncontextmenu = function (event) {
        console.log('move')
        return false
      }
    }

    // 移出事件
    dom.onmouseout = () => {
      document.oncontextmenu = function (event) {
        console.log('out')
        return true
      }
    }


    if(false){

      // 模拟数据
      var dataCollection = JSON.parse(localStorage.getItem('dataCollection')) || 
      [{
          page: 1,
          dataPre: [],
          eleList: [],
          model: {
            height: 649,
            width: 375,
            img: '',
            pattern: 'multiPage'
          },
          formAttr: { 
            'enable': true, // 使用表单标记
            'sex': true, // 性别
            'company': true, // 单位
            'department': true, // 部门
            'post': true, // 职务
            'email': true // 电子邮件
          },
      }]
      

      // 数据初始化 
      this.dataCollection = dataCollection 
      this.curPage = 1
      
      // 还原元素
      reduction(this)
    }
  },

  watch: {
    // 监听defaultStyle下的fontFamily，即字体  : "",
    "defaultStyle.fontFamily": function(val) {
      this.defaultStyle.fontFamily = val
      $(this.tNode).css("font-family", val);
    },
    //监听defaultStyle下的fontSize，即字体大小
    "defaultStyle.fontSize": function(val) {
      this.defaultStyle.fontSize = val
      $(this.tNode).css("font-size", val);
    },
    //监听defaultStyle下的fontSize，即字体距离
    "defaultStyle.lineSpa": function(val) {
      this.defaultStyle.lineSpa = val
      $(this.tNode).css("letter-spacing", val);
    },

    "defaultStyle.lineHeight": function(val) {
      this.defaultStyle.lineHeight = val
      $(this.tNode).css("lineHeight", val / 10);
    },
    "defaultStyle.opacity": function(val) {
      if (val <= 1) {
        val = val * 100
      }
      this.defaultStyle.opacity = val
      $(this.tNode).css("opacity", val / 100);
    },
    "defaultStyle.textAlign": function(val) {
      this.defaultStyle.textAlign = val
      $(this.tNode).css("text-align", val);
    },

    "defaultStyle.fontWeight": function(val) {
      if (val) {
        $(this.tNode).css("font-weight", "bolder");
      } else {
        $(this.tNode).css("font-weight", "normal");
      }
    },
    "defaultStyle.textDecoration": function(val) {
      if (val) {
        $(this.tNode)
          .find(".invite-text-box-text")
          .css("text-decoration", "underline");
      } else {
        $(this.tNode)
          .find(".invite-text-box-text")
          .css("text-decoration", "none");
      }
    },
    "defaultStyle.fontStyle": function(val) {
      if (val) {
        $(this.tNode)
          .find(".invite-text-box-text")
          .css("font-style", "italic");
      } else {
        $(this.tNode)
          .find(".invite-text-box-text")
          .css("font-style", "normal");
      }
    },

    //监听defaultStyle下的fontSize，即字体大小
    "defaultStyle.borderStyle": function(val) {
      this.defaultStyle.borderStyle = val
      $(this.tNode).css("border-style", val);
    },

    //监听defaultStyle下的fontSize，即字体大小
    "defaultStyle.borderWidth": function(val) {
      this.defaultStyle.borderWidth = val
      $(this.tNode).css("border-width", val);
    },

    //监听defaultStyle下的fontSize，即字体大小
    "defaultStyle.borderRadius": function(val) {
      this.defaultStyle.borderRadius = val
      $(this.tNode).css("border-radius", val);
    },

    "defaultStyle.shadowDim": function() {
      this.setShadow();
    },
    "defaultStyle.shadowWidth": function(val) {
      if (val == 0) {
        $(this.tNode).css("box-shadow", "0px 0px ");
      } else {
        this.setShadow();
      }
    }, //shadowWidth
    "defaultStyle.shadowColor": function() {
      this.setShadow();
    }, //shadowColor
    "defaultStyle.shadowDirectionV": function() {
      this.setShadow();
    }, //shadowDirectionV
    "defaultStyle.shadowDirectionH": function() {
      this.setShadow();
    }, //shadowDirectionH

  },
  methods: {
    // 字体颜色
    textColorFilter(e){
      console.log(e)
      this.defaultStyle.textColor = e
      $(this.tNode).css("color", e)
    },
    // 边框颜色
    borderColorFilter(e){
      this.defaultStyle.borderColor = e
      $(this.tNode).css("border-color", e);
    },
    // 阴影颜色
    shadowColorFilter(e){
      this.defaultStyle.shadowColor = e
    },
    // 关闭背景 
		closeBgi(){
      this.selectImg = null
      console.log(this.selectImg)
      // 清空模板按钮选中样式
      for(let item of $('.bgimage')){
        item.checked = false
      }
			this.popupVisible = false
    },
    // 关闭模板
    closeModel(){
      this.selectModel = null
      // 清空模板按钮选中样式
      for(let item of $('.radio')){
        item.checked = false
      }
      this.popupModel = false
    },
    // 下载二维码
    preseQrcode(){
      html2canvas($('#hideImg')[0], {
        // canvas: canvas2,
        backgroundColor: null, // 解决生成的图片有白边
        useCORS: true, // 允许图片跨域
        dpi: window.devicePixelRatio, // dpi  如果模糊的话 就把dpi和scale缩放的值调大 dpi越高生成的图片越大
      }).then((canvas) => {
        var aDom = document.createElement('a'), src = canvas.toDataURL()
        , meetName = this.$store.state.meetingData.meetingName
        aDom.href = src
        aDom.setAttribute('download', meetName + '-邀请函')
        aDom.click()

        // 清除二维码
        var qrcode = this.$refs.hideImg
        $(qrcode).empty()
      });
    },
    addDom(){
      // 引入jquery plugins/self-qrcode
      var jq = document.createElement('script'), jqQrcode = document.createElement('script')
      jq.src = '../../plugins/jquery.js'
      jqQrcode.src = '../../plugins/self-qrcode.js'

      var body = document.body
      body.appendChild(jq)
      body.appendChild(jqQrcode)

    },
    // 水平居中
    levelCenter(){
      var screenWidth = 375 / 2,
          eleWidth = $(this.tNode).width() / 2

      this.defaultStyle['el-x'] = screenWidth - eleWidth
      $(this.tNode).css({
        transform: `translate(${this.defaultStyle['el-x']}px, ${this.defaultStyle['el-y']}px)`
      })

      console.log(screenWidth, eleWidth)
    },
    // 标题颜色
    tipsColor(color) {
      // 新属性
      this.defaultStyle['tipsColor'] = color
      $(this.tNode).find('.white').css({
        color
      })

      console.log($(this.tNode).find('.white'))
      console.log(this.dataCollection[0].dataPre, color)
    },
    // 内容颜色
    cteColor(color) {
      this.defaultStyle['cteColor'] = color
      $(this.tNode).find('input').css({
        color
      })
    },
    // 边框颜色
    borderColor(color) {
      this.defaultStyle['borderColor'] = color
      $(this.tNode).find('input').css({
        borderColor: color
      })
    },
    // 边框背景颜色
    borderBgcolor(color) {
      this.defaultStyle['borderBgcolor'] = color
      $(this.tNode).find('input').css({
        backgroundColor: color
      })
    },
    // 按钮背景颜色
    btnBgcolor(color) {
      this.defaultStyle['btnBgcolor'] = color
      $(this.tNode).find('.btn').css({
        backgroundColor: color
      })
    },
    // 等宽
    dengWidth(){
      // 新属性
      this.defaultStyle['tipsColor'] = 'skyblue'
      $(this.tNode).find('.white').css({
        color: 'skyblue'
      })


      this.defaultStyle['el-x'] = 0
      this.defaultStyle['width'] = '100%'
      $(this.tNode).css({
        width: this.defaultStyle['width'],
        transform: `translate(${this.defaultStyle['el-x']}px, ${this.defaultStyle['el-y']}px)`
      })

      
      console.log(this.dataCollection[0].dataPre, this.defaultStyle)
    },
    createDom(msg){
      var newDom = document.createElement('div')
      newDom.style = `
        position: fixed;
        top:50px;
        left: 50%;
        width: 
      `
    },
    // 局部放大，缩小邀请函
    deformation(e, type){
      console.log(e)
      var dom = document.querySelector('.content-middle'),
          big = document.querySelector('.big > img'),
          small = document.querySelector('.small > img')
          console.log(big, small)
      if(type == 'enlarge'){
        small.style.cursor = 'pointer'
        if(this.zoom < 200){
          this.zoom += 25
        } else {
          e.path[0].style.cursor = 'not-allowed'
        }
      } else if(type == 'narrow'){
        big.style.cursor = 'pointer'
        if(this.zoom > 100){
          this.zoom -= 25
        } else {
          e.path[0].style.cursor = 'not-allowed'
        }
      }
      
      dom.style.zoom = this.zoom / 100
    },
    targDiv(){
      this.popupModel = true
      window.onmousemove = null
      window.onmousemove = function (e){
        // console.log(e.toElement)
        if(e.toElement.classList.contains('popup_titile')){
          var left, top, x, y, downX, downY
          // console.log(e)
          $('.popup_bg')[1].onmousedown = (ev) => {
            downX = ev.pageX
            downY = ev.pageY
            
            if(ev.toElement.classList.contains('popup_titile')){
              $('.popup_bg')[1].onmousemove = (el) => {
                
                left = +$('.white_box').css('left').replace('px', '')
                top = +$('.white_box').css('top').replace('px', '')
                x = el.pageX - downX
                y = el.pageY - downY
                $('.white_box').css('left', left + x + 'px')
                $('.white_box').css('top', top + y + 'px')
                
                downX = el.pageX
                downY = el.pageY
              }
    
              $('.popup_bg')[1].onmouseup = () => {
                $('.popup_bg')[1].onmousedown = null
                $('.popup_bg')[1].onmousemove = null
              }
            }
          }
  
        }
      }
    },

    box_move(e){
      if(e.toElement.classList.contains('popup_titile')){
        // console.log(e)
        $(e.path[0]).mousedown((ev) => {
          console.log(ev.pageX, ev.pageY)
        })

      }
      // $('.popup_titile').mousemove((e) => {
      //   console.log(e.pageX, e.pageY)
      // })
    },
    modelTest(){
      console.log($('.radio'))
      for(let item of $('.radio')){
        item.checked = false
      }
      // this.selectModel
    },

    initPage(){
      // this.addDom()
      $('.phone-item').empty()

      console.log('-----------------------------------'+this.meetingId)

      if(!this.meetingId) return 
      let that = this

      // 请求模板
      this.initModel()

      // 背景图片
      this.initBgImage()
  

      // 请求邀请函
      this.$http.get(this.API.selectInvitationByMeetingId(this.meetingId))
        .then(res => {
          console.log(res);
          if(res.code == '000' && res.data){
            // 数据初始化
            this.id = res.data.id
            this.dataCollection = JSON.parse(res.data.dataVal)
            this.curPage = 1
            console.log(this.dataCollection)
            // 还原元素
            reduction(this)
          }
        });
    },
    initBgImage(){
      var that = this
      this.$http.get(this.API.selectCompanyByBackGroup).then(res => {
        console.log(res)
        if(res.code == '000' && res.data.length){
          that.bgImage = res.data
          console.log( that.bgImage)
          // that.dataCollection[that.curPage - 1].model.img = res.data[0].imgId
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 打开二维码
    openQrcode(){
      // 清除二维码
      var qrcode = this.$refs.qrcode, hideImg = this.$refs.hideImg
      $(qrcode).empty()

      // 保存邀请函
      var id = this.save(false)
      qrcodeUrl = 'https://my-vue-starter-1305256445.cos-website.ap-guangzhou.myqcloud.com/qrcode?data=' + this.meetingId + '&cId=' + this.loginInfo.companyId
      console.log(qrcodeUrl)

      // 生成二维码
      new QRCode(qrcode, {
        text: qrcodeUrl,
        width: 130,
        height: 130,
        colorDark: '#000000',
        colorLight: '#ffffff'
      })

      var ficDom = document.createElement('img')
      ficDom.src = require('@/assets/images/logo.png')
      ficDom.style = `width: 30px; height: 30px; position: absolute; top: 50px; left: 50px; `
      qrcode.appendChild(ficDom)
      this.codeVisible = !this.codeVisible

      // 生成一份大的
      new QRCode(hideImg, {
        text: qrcodeUrl,
        width: 300,
        height: 300,
        colorDark: '#000000',
        colorLight: '#ffffff'
      })

      var bigDom = document.createElement('img')
      bigDom.src = require('@/assets/images/logo.png')
      bigDom.style = `width: 60px; height: 60px; position: absolute; top: 120px; left: 120px; `
      hideImg.appendChild(bigDom)
    },
    // 删除背景图
    delBgimg(){
      if(!this.selectImg || !this.selectImg.imgId){
        this.$message.info('请选择一张图片')
        return 
      }
      // if(this.bgImage.length == 1){
      //   this.$message.info('至少存在一张图片')
      //   return 
      // }

      this.$confirm('是否删除该背景?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.API.delectCompanyByBackGroup, [this.selectImg.imgId]).then(res => {
          console.log(res)
          try{
            if(res.code == '000'){
              this.$message.success('删除成功！')
              this.initBgImage()
              // this.bgImage.filter((item, idx) => {
  
              //   // item.imgId == this.selectImg.imgId && this.bgImage.splice(idx, 1)
              //   if(item.imgId == this.selectImg.imgId) {
              //     console.log(item.imgId)
              //   }
              // })
    
              // this.dataCollection[this.curPage - 1].model.img = this.bgImage[0].imgId
              this.selectImg = null
    
              // 清空模板按钮选中样式
              for(let item of $('.bgimage')){
                item.checked = false
              }
              
            }
          } catch(err){
            this.$message.info('网络繁忙！请刷新重试')
          }
  
        })
      }).catch({})


    },
    // 删除模板
    delModel() {
      if(!this.selectModel || !this.selectModel.id){
        this.$message.info('请选择模板！')
        return 
      }
      let that = this,
      id = this.selectModel.id

      this.$confirm('是否删除此模板?', '提示', {
        cancelButtonClass: 'btn_custom_cancel',
        type: 'warning'
      }).then(() => {
        loading.show()
        // 确认
        this.$http.post(this.API.delTemplate, [id]).then(res => {
          console.log(res)
          try{
            that.$message.success('删除成功！')
            that.invitaModel.filter( (item, idx) => item.id == id && that.invitaModel.splice(idx, 1))
            that.selectModel = null
  
            // 清空模板按钮选中样式
            for(let item of $('.radio')){
              item.checked = false
            }
            loading.hide()
          } catch(err) {
            loading.hide()
            that.$message.info('网络繁忙！请刷新重试')
          }
        }).catch(err => {
          console.log(err)
          loading.hide()
        })
      })

    },
    // 选中模板 - 按钮
    modelBtn(){
      // console.log
      $('.phone-item').empty()
      this.dataCollection = JSON.parse(this.selectModel.dataVal)
      console.log( this.dataCollection )
      this.curPage = 1
      
      // 还原元素
      reduction(this)
      this.closeModel()
    },
    // 选择模板
    changeBgModel(idx){
      this.selectModel = this.invitaModel[idx]
    },
    /**
     * 邀请函页面模式(弃用)
     *  功能机制:
     *    multiPage: 多页模式
     *        可以增加多个页面, 在移动端以轮播的方式一页一页翻看. 不能设置页面高度
     * 
     *    longPage: 长页模式
     *        只有一个页面, 在移动端以滚动条的方式滑动. 可以设置页面高度
     * 
     */
    pattern(e, type){
      let self = e.path[0]
      this.dataCollection[0].model.pattern = type

      console.log(e.path[0])
      // 移出 select
      $('.select').removeClass('select')

      // 给点击的dom 添加select
      self.classList.add('select')
      if(type == 'multiPage'){

      } else if(type == 'longPage'){

      }
    },
    // 保存模板
    presModel(e){
      loading.show()

      console.log(this.dataCollection)
      var meetingInviteTemplates = {
        dataVal: JSON.stringify(this.dataCollection), // 
      }
      // return 
      // HTML5canvas 生成图片
      var that = this
      var opts = {
          logging: true, // 启用日志记录以进行调试 (发现加上对去白边有帮助)
          allowTaint: false, // 否允许跨源图像污染画布
          backgroundColor: null, // 解决生成的图片有白边
          useCORS: true // 如果截图的内容里有图片,解决文件跨域问题
      }
      // eslint-disable-next-line no-undef   https://mybucket-resized-1305256445.cos.ap-guangzhou.myqcloud.com/356642515878678528/HeadFile/c1ctdhjj8oj09lkqspqg.png
      html2canvas($('.phone-long')[0], opts).then((canvas) => {
        var ImageURL = canvas.toDataURL('image/png')
        var myfile = that.dataURLtoFile(ImageURL, Date.now() + '.png');

        this.fileUpload(myfile, 'Invitation', res => {
          console.log(res)
          if(res.code == '000') {
            meetingInviteTemplates.imgId = res.data.saveFileName
            that.$http.post(that.API.saveTemplate, meetingInviteTemplates).then(resu => {
              try{
                console.log(resu)
                that.$message.success('保存成功！')
                that.initModel()

              }catch(err) {
                that.$message.info('网络繁忙！请刷新重试')
              }
              
            }).catch(err => {
              console.log(err)

            })
          } else {
            this.$message.error(res.msg)
          }
        })
        // console.log(myfile)
        return
        var formFile = new FormData();
        formFile.append('file', myfile);
        $.ajax({
            url: this.API.url + this.API.router.imgupload,
            type: "POST",
            processData: false,
            contentType: false,
            headers: {
              Authorization: token,
              token
            },
            data: formFile,
            success: function (result) {
              console.log(result)
              meetingInviteTemplates.imgId = result.data.id + '.' + result.data.fileType
                // return
                that.$http.post(that.API.saveTemplate, meetingInviteTemplates).then(res => {
                  try{
                    console.log(res)
                    that.$message.success('保存成功！')
                    that.initModel()
  
                    loading.hide()
                  }catch(err) {
                    loading.hide()
                    that.$message.info('网络繁忙！请刷新重试')
                  }
                  
                }).catch(err => {
                  console.log(err)

                  loading.hide()
                })
            }
        })
      })


    },
    dataURLtoFile(base64Str, fileName) {
      var arr = base64Str.split(','),
      mime = arr[0].match(/:(.*?);/)[1], //base64解析出来的图片类型
      bstr = atob(arr[1]), //对base64串进行操作，去掉url头，并转换为byte atob为window内置方法
      len = bstr.length,
      ab = new ArrayBuffer(len), //将ASCII码小于0的转换为大于0
      u8arr = new Uint8Array(ab); //
      while (len--) {
      u8arr[len] = bstr.charCodeAt(len)
      };
      // 创建新的 File 对象实例[utf-8内容，文件名称或者路径，[可选参数，type：文件中的内容mime类型]]
      return new File([u8arr], fileName, {
      type: mime
      })
    },
    // 上传背景图片
    bgiUpload(){
      // 文件数据
      let file = this.$refs.file, files
      files = file.files[0]

      this.fileUpload(files, 'Invitation', res => {
        if(res.code == '000'){
          this.$message.success(res.msg)
          let meetingInviteImgs = {imgId: res.data.saveFileName}
          this.bgImage.push({imgId: res.data.saveFileName})
    
          this.$http.post(this.API.saveCompanyByBackGroup, meetingInviteImgs).then(resu => {
            if(resu.code == '200'){
              // that.bgImage.push(...res.data)
            }
          })
        } else {
          this.$message.error(res.msg)
        }
        file.value = ''
      })

      
    },
    changeZindex: function(val) {
      console.log('置顶， 置底')
      $(this.tNode).css('z-index', val)
      this.defaultStyle['z-index'] = val
    },
    // 用户选择默认的字体颜色或背景颜色
    setColor: function(colorType, val) {
      if (colorType == "text") {
        this.defaultStyle.textColor = val;
        $(this.tNode).css("color", val);
      } else if (colorType == "back") {
        this.defaultStyle.backColor = val;
        $(this.tNode).css("background-color", val);
      } else if (colorType == "border") {
        this.defaultStyle.borderColor = val;
        $(this.tNode).css("border-color", val);
      } else if (colorType == "shadow") {
        this.defaultStyle.shadowColor = val;
      }
    },
    // 当鼠标在伸缩盒子上按下
    elongateDown: function(e) {
      console.log(e.target, e.screenY)
      // this.tempScreenY = e.screenY;
      // this.isElongate = true;
      let this_ = this, defaultY = e.screenY
      $('.justify-center')[0].onmousemove = function(e){
        // 清空定时器
        t && clearInterval(t)
        /**
         * defaultY < e.screenY ? 
         *    模板拉长  :
         *    模板变短 (最短649)
         */

        if(e.screenY > defaultY){
          // 记录上一次的值 
          this_.dataCollection[this_.curPage - 1].model.height += 2
        } else if(e.screenY < defaultY){
          if(this_.dataCollection[this_.curPage - 1].model.height > 720){
            this_.dataCollection[this_.curPage - 1].model.height -= 2
          }
        }
        defaultY = e.screenY
        $('.content-middle').scrollTop(10000000000000)
      }
        
        
        // t = setInterval(() => {

        // }, 10)
      

      $('.justify-center')[0].onmouseup = function(e){
        if(t){
          clearInterval(t)
        }
        $('.justify-center')[0].onmousemove = null
        $('.justify-center')[0].onmouseup = null
      }

      /**
       * 鼠标移出 .justify-center 时关闭定时器
       *    判断移出的dom   内部dom不关闭, 外部dom关闭
       */
      $('.justify-center')[0].onmouseout = function(e){
        
        if(e.toElement == null){
          if(t){
            clearInterval(t)
          }
          $('.justify-center')[0].onmousemove = null
          $('.justify-center')[0].onmouseout = null
        } else {
          var leaveDom = [...e.toElement.classList]
          var cla = ['not_select', ]
          var bool = []
  
          cla.map(item => leaveDom.map(i => item == i && bool.push(true)))
          
          if(bool[0]){
            if(t){
              clearInterval(t)
            }
            $('.justify-center')[0].onmousemove = null
            $('.justify-center')[0].onmouseout = null
          }
        }
      }

    },
    // 当鼠标在伸缩盒子上按下 
    elongateMove: function(e) { 
      // 长页高度改变的值，值越大，改变速度越快 
      let changePX = 5;
      let this_ = this;
      if (this_.isElongate) {
        if (e.screenY >= this_.tempScreenY) {
          this_.longPageHeight = this_.longPageHeight+changePX;
          clearInterval(this_.longInterval);
          this_.longInterval = setInterval(() => {
            this_.longPageHeight = this_.longPageHeight+changePX;
            let cta = document.querySelector(".iContent");
            cta.scrollTop = cta.scrollHeight;
            this.longPageHeightArray[this.showKey] = this_.longPageHeight
          }, 1);
        } else {
          let cta = document.querySelector(".iContent");
          if (this_.longPageHeight <= 649) {
            cta.scrollTop = 0;
            return;
          }
          this_.longPageHeight = this_.longPageHeight-changePX;
          clearInterval(this_.longInterval);
          this_.longInterval = setInterval(() => {
            if (this_.longPageHeight <= 649) {
              clearInterval(this_.longInterval);
              cta.scrollTop = 0;
              return;
            }
            this_.longPageHeight = this_.longPageHeight-changePX;
            cta.scrollTop = cta.scrollHeight;
            this.longPageHeightArray[this.showKey] = this_.longPageHeight
          }, 1);
        }
        this_.tempScreenY = e.screenY;
        //longPageHeightArray


      }
    },
    //  当鼠标松开 
    elongateUp: function(e) {},
    //  formConfig改变时刷新form表单
    initForm: function(val, need = 'update') {
      // addSubmitForm(this);
      if(val){
        var dom = document.querySelector("." + val) 
        var bool = this.dataCollection[this.curPage - 1].formAttr[val]

        console.log(dom)
        // var formParent = document.querySelector('.formTemplate .invite-text-box-text')
        if(bool){
          dom.style.display = 'flex'
        } else {
          dom.style.display = 'none'
        }
        
        if(need == 'update'){
          // 更新 dataCollection.dataPre
          var single = null
          var dataPre = this.dataCollection[this.curPage - 1].dataPre
	        var eleList = this.dataCollection[this.curPage - 1].eleList

          console.log(dataPre, eleList)
          eleList.filter((item, idx) => item.nodeValue == '表单' ? single = idx : '')
          console.log(single)
          
          // return  
          if(single != null){
            console.log(dataPre[single].value.formAttr[val])
          }
          //   dataPre[single].value.formAttr[val] = !dataPre[single].value.formAttr[val]

          // single = null
          // dataPre.filter(item => item.type == '表单' ? item[val] = 'bool' : '')
        }
      } else {
        // var enable = this.dataCollection[curPage - 1].formAttr.enable
        // if(!enable){
        //   document.querySelector('.del').click()
        // } 
      }
    },
    // 打开选择背景图片的弹出层
    imgPopupToggle: function() {
      this.popupVisible = true;
      window.onmousemove = null
      window.onmousemove = function (e){
        // console.log(e.toElement)
        if(e.toElement.classList.contains('popup_titile')){
          var left, top, x, y, downX, downY
          // console.log(e)
          $('.popup_bg')[0].onmousedown = (ev) => {
            downX = ev.pageX
            downY = ev.pageY
            console.log(ev)
            if(ev.toElement.classList.contains('popup_titile')){
              $('.popup_bg')[0].onmousemove = (el) => {
                left = +$('.white_box').css('left').replace('px', '')
                top = +$('.white_box').css('top').replace('px', '')
                x = el.pageX - downX
                y = el.pageY - downY
                // console.log(x, y)
                $('.white_box').css('left', left + x + 'px')
                $('.white_box').css('top', top + y + 'px')
    
                downX = el.pageX
                downY = el.pageY
              }
    
              $('.popup_bg')[0].onmouseup = () => {
                $('.popup_bg')[0].onmousedown = null
                $('.popup_bg')[0].onmousemove = null
              }
            }
            
          }
  
        }
      }
    },
    changeBgImg(idx) {
      let img;
      img = this.bgImage[idx].imgId
      console.log(this.bgImage, img)

      this.selectImg = this.bgImage[idx]
    },
    // 选择图片
    chioceImgRe(){
      console.log(this.selectImg)
      this.dataCollection[this.curPage - 1].model.img = this.selectImg.imgId
      this.selectImg = null

      this.closeBgi()
    },
    // 
    // 设置浏览器右键不触发
    rclick(event){
      if (event.button == 2){
        event.returnvalue = false;
        console.log('设置浏览器右键不触发')
      }
    },
    setShadow: function() {
      if (this.defaultStyle.shadowWidth == 0) {
        return;
      }
      let shadow =
        this.defaultStyle.shadowDirectionV +
        "px " +
        this.defaultStyle.shadowDirectionH +
        "px " +
        this.defaultStyle.shadowDim +
        "px " +
        this.defaultStyle.shadowWidth +
        "px " +
        this.defaultStyle.shadowColor;
      $(this.tNode).css("box-shadow", shadow);
    }, //setShadow
    selectItem: function(id) {
      $(".check").removeClass("check");
      //1.判断是哪个页面 展示该页面 然后click
      // var key = idMap.get(id);
      // if (key !== this.showKey) {
      //   this.contentClick(key);
      // }

      $("#" + id).click();
      $("#itemId" + id).addClass("check");
    },

    contentClick: function(index) {
      // 清空模板中的元素 dom
      $('.phone-item').empty()

      // 更新页码
      this.curPage = index + 1

      this.codeVisible = false

      // 还原元素
      reduction(this)
    },
    // 重置数据
    empty(){
      // 清空 tNode
      this.tNode = null

      this.defaultStyle = {}

      // 清空模板中的元素 dom
      $('.phone-item').empty()
    },

    showSubmitForm: function() {
      this.formConfigVisible = true;
      addSubmitForm(this);
      // this.$confirm("是否启用表单?", "提示", {
      // cancelButtonClass: 'btn_custom_cancel',
      // 	type: "warning"
      // }).then(() => { 
      // 	this.needForm = true;
      // 	addSubmitForm(this);
      // });
    },

    updateSubmitForm: function(node) {
      //是否显示表单控件
      let _this = this;
      let nodes;

      //用户名
      nodes = $(node).find(".userName");
      for (let i = 0; i < nodes.length; i++) {
        $(nodes[i]).css("display", "flex");
      }

      //性别
      nodes = $(node).find(".sex");
      if (_this.formConfig.sex) {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "flex");
        }
      } else {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "none");
        }
      }

      //单位
      nodes = $(node).find(".workplace");
      if (_this.formConfig.workplace) {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "flex");
        }
      } else {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "none");
        }
      }

      //部门
      nodes = $(node).find(".department");
      if (_this.formConfig.department) {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "flex");
        }
      } else {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "none");
        }
      }

      //职务
      nodes = $(node).find(".duties");
      if (_this.formConfig.duties) {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "flex");
        }
      } else {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "none");
        }
      }

      //电子邮件
      nodes = $(node).find(".email");
      if (_this.formConfig.email) {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "flex");
        }
      } else {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "none");
        }
      }
    }, //updateSubmitForm

    uploadImage: function() {
      // 文件数据
      let file = this.$refs.file_pmt, files
      files = file.files[0]

      this.fileUpload(files, 'Invitation', res => {
        if(res.code == '000') {
          this.defaultStyle.url = this.API.echoImage(res.data.saveFileName, 'Invitation')
          // $(this.tNode).find('.invite-text-box-text').css('background-image','url("'+res.src+'")')
          $(this.tNode).css("background-image", 'url("' + this.defaultStyle.url + '")');
          $(this.tNode)
            .find(".tip")
            .css("display", "none");
        } else {
          this.$message.error(res.msg)
        }

        file.value = ''
      })
      
    }, //uploadImage
    uploadVedio: function(res) {
      console.log(res);
      if (res.statusCode == "000") {
        this.defaultStyle.url = `/fileserve/invitationFile/invitation/${this.loginInfo.companyId}/` + res.data.id + '.' + res.data.fileType;

        // $(this.tNode).find('.invite-text-box-text').css('background-image','url("'+res.src+'")')
        $(this.tNode).find('source').attr('src', this.defaultStyle.url);
        console.log($(this.tNode).find("video")[0])
        $(this.tNode).find("video")[0].load()
      }
      // this.$refs.elupload.clearFiles();
    },
    uploadAudio: function(res) {
      console.log(res);
      if (res.statusCode == "000") {
        this.defaultStyle.url = `/fileserve/invitationFile/invitation/${this.loginInfo.companyId}/` + res.data.id + '.' + res.data.fileType;

        // $(this.tNode).find('.invite-text-box-text').css('background-image','url("'+res.src+'")')
        $(this.tNode).find('source').attr('src', this.defaultStyle.url);
        $(this.tNode).find("audio")[0].load()
      }
      // this.$refs.elupload.clearFiles();
    },

    imageDrag: function(event) {
      event = event || window.event;
      event.dataTransfer.setData("text", "image");
    },
    imageDragover: function(event) {
      event = event || window.event;
      event.preventDefault();
    },
   vdDrag: function(event) {
      event = event || window.event;
      event.dataTransfer.setData("text", "vedio");
    },
    vdDragover: function(event) {
      event = event || window.event;
      event.preventDefault();
    },
    vfDrag: function(event) {
      event = event || window.event;
      event.dataTransfer.setData("text", "audio");
    },
    vfDragover: function(event) {
      event = event || window.event;
      event.preventDefault();
    },
    scoreDrag: function(event) {
      event = event || window.event;
      event.dataTransfer.setData("text", "score");
    },
    scoreDragover: function(event) {
      event = event || window.event;
      event.preventDefault();
    },
    save: function(bool = true) {
      let _this = this
      if(bool){
        loading.show()
      }
      
      console.log(_this.dataCollection)
      let data = {
        dataVal: JSON.stringify(_this.dataCollection),
        meetingId: this.meetingId
      }

      if(this.id) {
        data.id = this.id
        // data.beginTime = this.beginTime
      }

      localStorage.setItem('dataCollection', data.meetingInvitation)

      if(data.id){
        this.$http
        .post(this.API.updateInvitation,  data)
        .then(res => {
          console.log(res);
          try{
            if(res.code == "000"){
              if(bool){
                _this.$message.success("保存成功");
              }
              console.log(res.data)
              this.id = !this.id ? res.data : res.data.id
            }else{
              if(bool){
                _this.$message.error("保存失败，请重试");
                
              } 
            }
            loading.hide()
          } catch(err){
            loading.hide()
          }

          // _this.generateQrCode();
        }).catch(err => {
            loading.hide()
        });
      } else {
        this.$http
        .post(this.API.saveInvitation,  data)
        .then(res => {
          console.log(res);

          if(res.code == "000"){
            if(bool){
              _this.$message.success("保存成功");
              loading.hide()
            }
            console.log(res.data)
            this.id = !this.id ? res.data : res.data.id
          }else{
            if(bool){
              _this.$message.error("保存失败，请重试");
              loading.hide()
            } 
          }
          // _this.generateQrCode();
        }).catch(err => {
          console.log(err)
          loading.hide()
        });
      }
      // return    + (this.id ? '?id='+this.id : '')

    }, //save
    generateQrCode() {
      // 获取二维码父盒子的宽度并将其设置为二维码的高宽
      let obj = document.getElementById("qrcode");
      let codeW = parseInt(window.getComputedStyle(obj, null).width);
      console.log(codeW);
      let qrcode = new QRCode("qrcode", {
        width: codeW, //图像宽度
        height: codeW, //图像高度
        colorDark: "#000000", //前景色
        colorLight: "#ffffff", //背景色
        typeNumber: 4,
        correctLevel: QRCode.CorrectLevel.H //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
      });


      var qrCodeUrl =
        window.location.host +
        "/meet/#/invitationMessage?meetingId=" +
        this.meetId;
      qrcode.makeCode(qrCodeUrl); //生成二维码
      obj.title = '';

    },
    getMatchedStrs: function(str, showKey) {
      var pattern = /id=\"(.*?)\"/g;
      var result = str
        .match(pattern)
        .toString()
        .replace(/id=/g, "")
        .replace(/"/g, "");
      var resultArray = result.split(",");
      resultArray.forEach((item, index) => {
        idMap.set(resultArray[index], showKey);
      });
    },
    initModel(){
      let that = this
      console.log('initModel')
      this.$http.get(this.API.getTemplate).then(res => {
        console.log(res)
        if(res.code == '000')
          that.invitaModel = res.data
      }).catch(err => {
        console.log(err)
        that.invitaModel = []
      })
    },
    dropTest: function(event) {
      drop(event, this);
    },

    //添加页面
    addPage() {

      // 重置数据
      this.empty()
      console.log()
      // 添加新页 数据
      this.dataCollection.push(eachPageData(this, this.dataCollection.length + 1))

      // 修改当前所在页
      this.curPage = this.dataCollection.length
      // 增添背景图
      // this.dataCollection[this.curPage - 1].model.img = this.bgImage[0].imgId
    },
    // 删除页面
    deletePage(idx) {
      let that = this
      // 提示
      this.$confirm('是否删除该页面?', '提示', {
        cancelButtonClass: 'btn_custom_cancel',
        type: 'warning'
      }).then(() => {
        // 确认
        // 删除 dataCollection 对应列
        that.dataCollection.filter((item, index) => 
          index == idx && that.dataCollection.splice(index, 1)
        )

        // 修改 对应的page 值
        that.dataCollection.filter(( item, index) => item.page = index + 1)

        // 判断idx 与 curPage大小关系
        if(idx < that.curPage){
          that.contentClick(idx - 1)
        }

      }).catch(() => {
          // 取消
      });

    },
    clickTag: function(e) {
      hideBox();
    },
    allowDrop: function(ev) {
      console.log("allowDrop");
      ev.preventDefault();
    },
    textDrag: function(event) {
      console.log("文本元素 ");
      event = event || window.event;

      event.dataTransfer.setData("text", "invite-text");
    },
    textDragover: function(event) {
      console.log("文本元素 textDragover");

      event = event || window.event;
      event.preventDefault();
    },
    initTemplateCss: function(node) {
      if ($(node).hasClass("formTemplate")) {
        this.showStyle = false;
      } else {
        this.showStyle = true;
      }
      //从nodeStyleMap获取该node的样式，否则解析节点  填充属性
      this.tNode = node;
      var defaultStyle = nodeStyleMap.get(node.id);
      if (defaultStyle === undefined) {
        // 初始化样式值    defaultStyle代表当前选中控件的所有属性,当回显保存数据的时候这个对象是空的,所以需要在此初始化
        defaultStyle = {};
        defaultStyle.textColor = $(node).css("color");
        defaultStyle.fontFamily = $(node).css("font-family")
        defaultStyle.fontSize = $(node).css("font-size")
        defaultStyle.lineSpa =Number($(node).css("letter-spacing").replace("px",""))
        defaultStyle.lineHeight = Number($(node).css("line-height").replace("px",""))
        defaultStyle.opacity = $(node).css("opacity")
        defaultStyle.textAlign = $(node).css("text-align")
        defaultStyle.borderColor = $(node).css("border-color")
        defaultStyle.borderStyle = $(node).css("border-style")
        defaultStyle.borderRadius = Number($(node).css("border-radius").replace("px",""))
        defaultStyle.borderWidth = Number($(node).css("border-width").replace("px",""))
        var boxShadow = $(node).css("box-shadow")
        var boxShadowArray = boxShadow.split(/\*|\-|\+|\s/);
        var shadowWidth = boxShadowArray[boxShadowArray.length - 1 ] || 0;
        var shadowDim = boxShadowArray[boxShadowArray.length - 2 ] || 0;
        var shadowDirectionH = boxShadowArray[boxShadowArray.length - 3 ] || 0;
        var shadowDirectionV = boxShadowArray[boxShadowArray.length - 4 ] || 0;
        defaultStyle.shadowWidth= Number(shadowWidth.replace("px",""))
        defaultStyle.shadowDim= Number(shadowDim.replace("px",""))
        defaultStyle.shadowDirectionV=   Number(shadowDirectionV.replace("px",""))
        defaultStyle.shadowDirectionH=   Number(shadowDirectionH.replace("px",""))
        defaultStyle.shadowColor=boxShadow.replace(shadowWidth,"").replace(shadowDim,"").replace(shadowDirectionV,"").replace(shadowDirectionH,"")
        if ($(node).css("background-color") === 'rgba(0, 0, 0, 0)') {
          defaultStyle.backColor = "#FFFFFF";
        } else {
          defaultStyle.backColor = $(node).css("background-color")
        }
        if (
          $(this.tNode)
          .find(".invite-text-box-text")
          .css("font-style") == "italic"
        ) {
          defaultStyle.fontStyle = true;
        } else {
          defaultStyle.fontStyle = false;
        }
        if (
          $(this.tNode)
          .find(".invite-text-box-text")
          .css("text-decoration").indexOf("underline") != -1
        ) {
          defaultStyle.textDecoration = true;
        } else {
          defaultStyle.textDecoration = false;
        }
        if ($(node).css("font-weight") == 700) {
          defaultStyle.fontWeight = true;
        } else {
          defaultStyle.fontWeight = false;
        }
        nodeStyleMap.set(node.id, defaultStyle);
      }
      this.defaultStyle = defaultStyle;
      if ($(node).hasClass("imageTemplate")) {
        this.isImage = true;
      } else {
        this.isImage = false;
      }
    }
  },
  destroyed() {
    return ;
    var aa = confirm('是否保存邀请函?')
    if(aa){
      this.save()
    }
  }
};
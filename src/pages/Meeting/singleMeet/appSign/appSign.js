import { mapState } from 'vuex'

export default {
  data() {
    return {
      model: [
        {select: true},
        {select: false},
      ],
      baseMap: [],
      id: ''
    }
  },
  computed: {
    ...mapState([
      'meetingData'
    ])
  },
  methods: { 
    // 选择图片
    uploadMap(){
      // 文件数据
      let file = this.$refs.file, files
      files = file.files[0]

      this.fileUpload(files, 'app', res => {
        console.log(res)
        if(res.code == '000'){
          this.$message.success(res.msg)
          this.baseMap.push({select: false, img: res.data.saveFileName})
        } else {
          this.$message.error(res.msg)
        }

        file.value = ''
      })
    },
    // 选中背景
    chioceMap(idx){
      this.baseMap.filter((its, i) => i == idx ? its.select = true : its.select = false)

      this.save()
    },
    // 选中模板
    chioce(idx) {
      this.model.filter((its, i) => i == idx ? its.select = true : its.select = false)

      this.save()
    },
    // 保存
    save() {
      let isUse = this.model.map((its, idx) => its.select && idx).filter(its => typeof its == 'number' && its+'')[0],
        photoId = '';
        this.baseMap.filter(its => its.select ? photoId = its.img : '')

      let obj = {
        companyId: this.meetingData.id,
        isUse,
        photoId: photoId || ''
      }
      this.id ? obj.id = this.id : ''
      console.log(obj)
      this.$http.post(this.API.addOrUpdateModel, obj)
        .then(res => {
          console.log(res)
        })
    }
  },
  created() {
    this.$http.get(this.API.findAppPhoto)
      .then(res => {
        console.log(res)
        if(res.code == '000'){
          res.data.filter(its => this.baseMap.push({ select: false, img: its.saveFileName }))

          console.log(this.baseMap)
        }
      })
  },
  mounted() {
    setTimeout(() => {
      this.$http.get(this.API.findAppModel(this.meetingData.id))
      .then(res => {
        console.log(res)
        if(res.code == '000'){
          this.baseMap.filter(its => its.img == res.data.photoId ? its.select = true : its.select = false)
          this.model.filter((its, idx) => idx == res.data.isUse ? its.select = true : its.select = false)
          this.id = res.data.id
        }
      })
    }, 200)
  }
}
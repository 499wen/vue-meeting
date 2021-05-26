import clumnLook from './clumnLook/clumnLook.vue'
import detailed from './detailed/detailed.vue'
import { selfTime } from '@/plugins/plugins.js'

export default {
  components: {
    clumnLook,
    detailed
  },
  data() {
    return {
      // table
      tableData: [],
      height: null,

      // 分页
      total: 0,
      pageNum: 1,
      pageSize: 100,

      // 选中 row
      row: {},

      // 子集组件 开关
      clumnLook_child: false,
      detailed_child: false
    }
  },
  methods: {
    // 导出报表
    clumnLook(data){
      this.row = data
      this.clumnLook_child = true
    },
    // 查看 数据可视化
    detailed(data){
      this.row = data
      this.detailed_child = true
    },
    // 分页方法
    sizeChange(val){
      this.pageNum = 1
      this.pageSize = val

      this.getAttenData()
    },
    curChange(val){
      this.pageNum = val

      this.getAttenData()
    },

    // 子组件 方法
    exportBb() {
      let child = this.$refs.clumnLook, form = {...child.form}, url
      for(let i in form){
        if(i != 'outputWay' && i != 'group' && form[i]) form[i] = '1' 
        else if(i != 'outputWay' && i != 'group') form[i] = '0' 
      }

      let {outputWay, particulars, beLate, missing, leave, phoneNumber} = form
      console.log(outputWay, particulars, beLate, missing, leave, phoneNumber, child.handmeetingId)

      child.$refs['form'].validate((valid) => {
        if (valid) {
          // 02 分组, 01 部门
          if(child.form.type == '02'){
            var group = form.group
            url = this.API.downloadBbByMeetingId(
              child.handmeetingId, outputWay, particulars, beLate, missing, leave, phoneNumber, group
            )
          } else {
            url = this.API.downloadBbByDeparmentId(
              child.handmeetingId, particulars, beLate, missing, leave, phoneNumber
            )
          }

          this.$http.post(url).then(res => {
            console.log(res)
            if(res.code == '000'){
              var aDom = document.createElement('a')
              aDom.setAttribute('download', '报表')
              aDom.href = 'https://docxs-1305256445.cos.ap-guangzhou.myqcloud.com/' + res.data
              aDom.click()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    cancel(){
      this.clumnLook_child = false
    },
    close() {
      // 清除定时器
      let child = this.$refs.detailed
      clearInterval(child.t)
      child.t = null

      // 关闭弹框
      this.detailed_child = false
    },

    // 获取参会人报到数据
    getAttenData(){
      this.$http.get(this.API.findMeetingStatistical(this.pageNum, this.pageSize, ''))
        .then(res => {
          if(res.code == '000' && res.data){
            res.data.filter((item, idx) => {
              var time = selfTime(new Date(item.beginDate).getTime())
              var st = selfTime(new Date(item.beginDate).getTime(), true, true, true)
              var et = selfTime(new Date(item.endDate).getTime(), true, true, true)
              item.number = idx + 1
              item.time = time
              item.beginAndEndDate = st + ' - ' + et;
            })
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    }
  },
  mounted() {
    // table
    var dom = document.querySelector('.table')
    this.height = dom.offsetHeight

    // 获取参会人报到数据
    this.getAttenData()


    // 分10个进程
    this.worker = this.$worker.create([
      { message: 'img01', func: data => data},
      { message: 'img02', func: data => data},
    ])

    this.worker.postMessage('img01', ['第一个work']).then(res => {
      console.log(res)
    })
    this.worker.postMessage('img02', ['第二个work']).then(res => {
      console.log(res)
    })
  }
}
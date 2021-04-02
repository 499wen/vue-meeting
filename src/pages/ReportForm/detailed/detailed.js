var noVueAll = null, noVueSingle = null, t = null

export default {
  props: ['row'],
  name: 'HelloWorld',
  data() {
    return {
        qhTab: 24,
        personData: [],
        filterTable: {
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        personCate: [
            {name: '姓名', description: 'userName'},
            // {name: '性别', description: 'sex'},
            {name: '电话', description: 'phone'},
            // {name: '类别', description: 'groupName'},
            // {name: '职位', description: 'duties'},
            {name: '参会确认状态', description: 'state'}, 
            // {name: '签到时间', description: 'signTime'}, 
        ],
        dataList: [],
        allTable: {
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        dataCate: [
            {name: '姓名', description: 'userName'},
            // {name: '性别', description: 'sex'},
            {name: '电话', description: 'phone'},
            // {name: '类别', description: 'groupName'},
            // {name: '职位', description: 'duties'},
            {name: '参会确认状态', description: 'state'},
            {name: '签到状态', description: 'signState'}, 
        ],
        pageSize: 10,
        pageNum: 1,
        totalRecord: 0,
        //柱状图
        lineTotal: 0, // 柱状图总人数
        myChart: null, 
        drawOption: {
            title: {
                text: '参会分析',
                subtext: '单位（人）',
                left: 10,
                fontWeight: 'light',
                fontSize: 16
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}",
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            color: ['#3398DB'],   //修改柱状 颜色
            legend: {
                data: []
            },
            xAxis: [
                {
                    type: 'category',
                    //接口请求数据
                    data: ['实到', '未到'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    max: 200
                }
            ],
            series: [
                {
                    name: '直接访问',
                    type: 'bar',
                    barWidth: 30,
                    label: {
                        formatter: '{b|{b}}\n{c}  {per|{d}%}',
                    },
                    itemStyle: {
                        normal: {
    　　　　　　　　　　　　　　//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                            color: function(params) {
                                // build a color map as your need. #dfd92e
                                var colorList = [
                                  '#C1232B','#B5C334','#F4E001','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            },
    　　　　　　　　　　　　　　//以下为是否显示，显示位置和显示格式的设置了
                            label: {
                                show: true,
                                position: 'top',
                                formatter: (datas) => {
                                    if(datas.data == 0 ) return
                                    // console.log(this)
                                    var res = ''
                                        res += datas.data + '\n';
                                        res += (datas.data / this.lineTotal * 100).toFixed(2) + '% ';
                                    //  console.log(res)
                                      return res
                                },
                                // formatter: '{c}\n{a}%'
                            }
                        }
                    },
                }
            ]
        },
        //饼图 
        circularChart: null,
        circularOption: {
            title: {
                text: '会议邀请',
                left: 10,
                fontWeight: 'blod',
                fontSize: 16
            },
            legend: {
                show: true,
                type: 'scroll',
                orient: 'vertical',
                right: 0,
                top: 0,
                bottom: 20,
                data: ['已确认 30%', '未确认', '请假'],
                textStyle: {
                    color: '#333'
                }
            },
            //设置饼状图每个颜色块的颜色
            // color : [ 'red', 'orange', 'yellow'],
            tooltip: {
                trigger: 'item',
                // formatter: "{a} <br/>{b} : {c} ({d}%)"
                formatter: (datas) => {
                    // console.log(datas)
                    
                    var name = datas.name.indexOf(' ') > -1 ? datas.name.substr(0, datas.name.indexOf(' ')) : datas.name,
                    res = datas.seriesName + '<br/>'
                    res += name + ' : '
                    res += datas.value + ' ('
                    res += datas.percent + '%)'

                    return res
                }
            },
            series: [
                {
                    hoverAnimation:false,
                    name: '会议邀请',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    label: {
                        // formatter: '{b}\n{c}  {per|({d}%)}    ',
                        formatter: '{b|{b}}\n{c}  {per|{d}%}    ',
                        rich: {
                            per: {
                                color: '#333',
                            },
                            //设置文字大小
                            b: {
                                fontSize: 14
                            }
                        },
                        position: 'center',
                        show: false
                    },
                    
                    data: [
                        {value: '25', name: '已签到'},
                        {value: '25', name: '未签到'},
                        {value: '25', name: '请假'},
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        },
        actualNum: 1, // 已确认
        noneNum: 2,  // 未确认
        yingdaoNum: 3,  // 请假
        shouldArrive: '',
        inviteNumber: '',
        attendance: '', // 已签到
        missingNumber: '', // 未签到
        leaveForConfirmAttendanceNumber: '', // 请假
        chartData: {},
        columnData: {},
        tip: '未确认', // 手动分页标识

        Is: null, // 等于 不等于
        Does: null, // 包含 不包含
        t: null
    }
  },
  watch: {
    columnData(val){
      console.log(val)
      this.columnData = val
    }
  },
  mounted() {
    console.log(this)
    
    this.initData(this.row.id)
  },
  methods: {
      // 
      initData(meetId){
          this.meetId = meetId
          this.getData()
          this.t = setInterval(() => {
              this.getData()
          }, 10000)
      },
      getData(){
          this.$http.get(this.API.singleStatistical(this.meetId))
          .then(res => {
              console.log(res)
              if(res.code == '000' && res.data){
                  this.columnData = res.data.length ? res.data[0] : {}

                  this.getChart()
              } else {
                  this.$message.error(res.msg)
              }
          })
      },
      // 请求全部得数据
      requestAllData(){
          var meetId = this.columnData.id
          this.$http.get(this.API.findMeetingStatisticalDataByMeeting(meetId, this.allTable.pageNum, 9999))
          .then(res => {
              console.log(res)
              if(res.code == '000' && res.data){
                  res.data.filter(item => {
                      item.state = this.statusTab(item.statusCode, item.leaveState)
                  })
                  noVueSingle = res.data
              } else {
                  noVueSingle = []
              }
          })
      },
      // 分页 - 过滤数据
      filterSize(val){
          this.filterTable.pageNum = 1
          this.filterTable.pageSize = val
          this.selfPaginationFilter()
      },
      filterCurrent(val){
          this.filterTable.pageNum = val
          this.selfPaginationFilter()
      },
      // 手动分页 - 过滤数据 tip
      selfPaginationFilter(){
          console.log(this.tip)
          console.log(noVueSingle)
          var filterData = []
          noVueSingle.filter(item => item.state.indexOf(this.tip) > -1 && filterData.push({...item}))
          filterData.filter(item => item.state = this.tip)
          for(let i = 0; i <= Math.ceil(filterData.length / this.filterTable.pageSize); i++){
              if((i + 1) == this.filterTable.pageNum){
                  this.personData = filterData.slice(i, this.filterTable.pageSize * (i + 1))
              }
          }

          this.filterTable.total = filterData.length
      },

      // 分页 - 全部数据
      allSize(val){
          this.allTable.pageNum = 1
          this.allTable.pageSize = val
          this.getDataMeet()
      },
      allCurrent(val){
          this.allTable.pageNum = val
          this.getDataMeet()
      },

      tabBtn(){
          this.qhTab = this.qhTab == 12 ? 24 : 12
      },

      close() {
          this.$emit('hideregisterdialog', false);
      },
      //柱状图
      drawLine() {
          console.log(this.columnData, '112')
          // 柱状图 总人数
          this.shouldArrive = this.columnData.shouldArrive
          this.attendance = this.columnData.actualNumberOfPeople 
          this.missingNumber = this.columnData.notYet 

          this.drawOption.yAxis[0].max = this.shouldArrive
          // this.leaveForConfirmAttendanceNumber = this.columnData.leaveForConfirmAttendanceNumber
          
          console.log(this.attendance, this.missingNumber)
          this.lineTotal = (this.attendance + this.missingNumber ) 
          // 基于准备好的dom，初始化echarts实例
          this.myChart = this.$echarts.init(document.getElementById('myChart'));
          // 绘制图表
          // this.drawOption.xAxis[0].data = this.chartData.category; //分类
          // this.drawOption.series[0].data = this.chartData.already; //已签到人数
          // this.drawOption.series[1].data = this.chartData.not; //未签到人数
          // this.drawOption.legend.data = this.chartData.name; //类别

          // this.drawOption.series[0].data = ['已签到', '未签到', '请假']
          this.drawOption.series[0].data = [
              // this.shouldArrive,
              this.attendance,
              this.missingNumber,
              // this.leaveForConfirmAttendanceNumber 
          ]
          this.myChart.setOption(this.drawOption);
          console.log(this.circularOption.series[0].data)

          this.myChart.on('click', this.lineConsole)
      },
      // 柱形图 点击效果
      lineConsole(param){
          console.log(param)
          // return 
          var data = [
              { name: '实到', fild: '已签到'},
              { name: '未到', fild: '未到'}
          ], { fild } = data.filter(item => item.name == param.name ? this.tip = item.fild : '')
          console.log(this.tip)
          if(this.qhTab == 12){
              this.selfPaginationFilter()
          }
      },
      //饼图
      /**
       * 3 已签到
       * 5 6 7 请假 
       * 其它 未签到
       */
      circularMet() {
          // 将比例算出
          var total = this.columnData.inviteNumber ,
          percent1 = this.columnData.confirmAttendanceNum ,
          percent2 = this.columnData.unconfirmedAttendanceNum,
          percent3 = this.columnData.leaveNumber,
          bl1 = '已确认 ' + ` ${percent1}人 (` + (percent1 != 0 ? (percent1 / total * 100).toFixed(2) + '%' : '0%') + `)`,
          bl2 = '未确认 ' + ` ${percent2}人 (` + (percent2 != 0 ? (percent2 / total * 100).toFixed(2) + '%' : '0%') + `)`,
          bl3 = '请假 ' + ` ${percent3}人 (` + (percent3 != 0 ? (percent3 / total * 100).toFixed(2) + '%' : '0%') + `)`
          // this.circularOption.legend.data = [ bl1, bl2, bl3]
          console.log()

          // 0--未确认 1--已确认 2--已报到 3--已签到 4--不参加 5--事假 6--病假 7--休假
          var signArr = ['未确认', '已确认', '已报到', '已签到', '不参加', '事假', '病假', '休假'],
              dataList = []
          this.circularChart = this.$echarts.init(document.getElementById('circularChart'));

          this.circularOption.series[0].data = [
              {value: percent1, name: bl1, fild: 'confirmAttendanceNum'},
              {value: percent2, name: bl2, fild: 'unconfirmedAttendanceNum'},
              {value: percent3, name: bl3, fild: 'leaveNumber'},
          ]

          this.noneNum = percent1;  // 已确认
          this.actualNum = percent2; // 未确认
          this.yingdaoNum = percent3; // 请假
          this.inviteNumber = total // 总人数

          this.circularChart.setOption(this.circularOption);

          this.columnData.meetingInvites && this.columnData.meetingInvites.filter(item => {
              item.User.state = signArr[item.statusCode]
              item.User.signTime = signArr[item.statusCode] == '已确认' ? item.signInTime : ''
              item.User.sex = item.sex
              dataList.push(item.User)
          })
          this.dataList = dataList || []

          this.circularChart.on('click', this.eConsole)

          // 不允许 右上角title隐藏
          this.circularChart.on('legendselectchanged', function(params) {
              var option = this.getOption()
              option.legend[0].selected[params.name] = true

              this.setOption(option)
          })
      },
      // 扇形图 点击事件
      eConsole(param){
          console.log('扇形图 点击事件', param)
          // this.circularOption.series[0].data.filter( (item, idx) => 
          //     param.dataIndex == idx ? item.selected = true : item.selected = false
          // )
          
          if(this.qhTab == 12){
              // param.data.fild
              var arr = [
                  { label: '未确认', value: 'unconfirmedAttendanceNum'},
                  { label: '已确认', value: 'confirmAttendanceNum'},
                  { label: '请假', value: 'leaveNumber'},
              ]

              arr.filter(item => item.value == param.data.fild ? this.tip = item.label : '')
              console.log(this.tip)
              this.selfPaginationFilter()
          }

          this.circularChart.setOption(this.circularOption);
      },

      // 图表数据请求
      getChart() {
          this.Does = this.columnData.doesTheNumberLeave
          this.Is = this.columnData.IsAttendanceNumber
          //柱状图
          this.circularMet();
          // 柱状图
          this.drawLine()

          this.requestAllData()


          // 查询数据相关会议
          this.getDataMeet()
      },
      
      // 查询数据相关会议
      getDataMeet(){
          var meetId = this.columnData.id
          this.$http.get(this.API.findMeetingStatisticalDataByMeeting(meetId, this.allTable.pageNum, this.allTable.pageSize))
              .then(res => {
                  console.log(res)
                  if(res.code == '000' && res.data){
                      res.data.filter(item => {
                          item.signState = item.statusCode == 3 ? '已签到' : '未签到'
                          item.state = this.statusTab(item.statusCode, item.leaveState)
                          item.endMeet = new Date().getTime() < this.columnData.endDate && new Date().getTime() >= this.columnData.beginDate ? true : false
                      })
                      this.dataList = res.data
                      this.allTable.total = res.total
                  } else {
                      this.dataList = []
                      this.allTable.total = 0
                  }
              })
      },
      //补签
      repairSign(val) {
          this.$confirm('确定要进行补签吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              var meetingId = this.columnData.id,
              arr = [
                  { 
                      phone: val.phone,
                      meetingId,
                      userId: val.id,
                      isLay: '1',
                      createTime: new Date().getTime()
                  }
              ]
              this.$http.post(this.API.meetSign(meetingId, 1), arr).then(res => {
                  console.log(res)
                  
                  if(res.code == '000'){
                      this.$message({ type: 'success', message: '补签成功!' });
                      this.columnData.attendance =+ 1
                      this.columnData.missingNumber =- 1
                      val.statusCode = 3
                      // this.getDataMeet();
                  } else {
                      this.$message({ type: 'info', message: res.msg });
                      // this.getDataMeet();
                  }
              }).catch(err => {
                  //出现异常
                  this.$message.error(err.message);
              })
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消补签'
              });
          });
      },
      /**
       * statusCode
       * 123 已确认
       * 0 未确认
       * 3 已签到
       * 
       * leaveState
       * 0--未请假 1--事假 2--病假 3--休假
       */
      statusTab(statusCode, leaveState){
          const Is = this.Is, Does = this.Does

          if(leaveState == 0){
              if(statusCode == 0){
                  return '未确认未签到'
              } else if(statusCode == 1 ){
                  return '未到已确认'
              } else if(statusCode == 3){
                  return '已签到已确认'
              } else if(statusCode != 3 ){
                  return '未签到已确认'
              } else {
                  return '已确认'
              }
          } else {
              return '请假'
          }
      },
      statusTab2(statusCode, leaveState){
          const Is = this.Is, Does = this.Does

          if(leaveState == 0){
              if(statusCode == 0){
                  return '未确认'
              } else if(statusCode == 3){
                  return '已签到'
              } else if(statusCode != 3){
                  return '未签到'
              } else {
                  return '已确认'
              }
          } else {
              return '请假'
          }
      },

  },
  destroyed() {

  }
}

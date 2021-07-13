<template>
  <div class="projection">
    <div class="self-main"> 
      <div class="chartContent">
        <!-- <el-button @click="tabBtn" type="primary" plain size='mini'> 切换 </el-button>
        <el-button @click="openScreens" v-if='!open' type="primary" plain size='mini'> 打开第二屏 </el-button>
        <el-button @click="closeScreens" v-else type="primary" plain size='mini'> 关闭第二屏 </el-button> -->
      </div>
      <div class="chartContent">
          <el-col :span="qhTab" class="self-col" v-if="columnData.id">
            <div id="circularChart" :style="{width: '400px', height: '400px'}"></div>
            <div class="chartZi">
              <span style="padding-right: 10px">邀请人数: {{ inviteNumber }}人</span>
              <div class="chartZi2">
                <span style="padding-right: 10px" class="color">
                  <div class="bgc"></div>
                  <span>已确认: {{ noneNum }}人 ({{ inviteNumber == 0 ? 0 : (noneNum * 100 / inviteNumber).toFixed(2) }}%)</span> 
                </span>
                <span style="padding-right: 10px" class="color">
                  <div class="bgc" style="background-color: #2f4554"></div>
                  <span>未确认: {{ actualNum }}人 ({{ inviteNumber == 0 ? 0 : (actualNum * 100 / inviteNumber).toFixed(2) }}%)</span>
                </span>
                <span style="padding-right: 10px" class="color">
                  <div class="bgc" style="background-color: #61a0a8"></div>
                  <span>请假: {{yingdaoNum}}人 ({{ inviteNumber == 0 ? 0 : (yingdaoNum * 100 / inviteNumber).toFixed(2) }}%)</span>
                </span>
              </div>
            </div>
          </el-col>
          <el-col :span="qhTab" class="self-col" v-else>
            <div id="circularChart" :style="{width: '400px', height: '400px'}"></div>
            <div class="chartZi">
              <span style="padding-right: 10px">邀请人数: 0人</span>
              <div class="chartZi2">
                <span style="padding-right: 10px" class="color">
                  <div class="bgc"></div>
                  <span>已确认: 0人 (0%)</span> 
                </span>
                <span style="padding-right: 10px" class="color">
                  <div class="bgc" style="background-color: #2f4554"></div>
                  <span>未确认: 0人 (0%)</span>
                </span>
                <span style="padding-right: 10px" class="color">
                  <div class="bgc" style="background-color: #61a0a8"></div>
                  <span>请假: 0人 (0%)</span>
                </span>
              </div>
            </div>
          </el-col>
          <el-col :span="qhTab" class="self-col" v-if="columnData.id">
            <div id="myChart" :style="{width: '420px', height: '400px'}"></div>
            <div class="chartZi"> 
              <span style="padding-right: 10px">应到人数: {{shouldArrive}}人</span>
              <span style="padding-right: 10px">已到人数: {{attendance}}人</span>
              <span style="padding-right: 10px">未到人数: {{missingNumber}}人</span>
              <!-- <span style="padding-right: 10px">请假: {{leaveForConfirmAttendanceNumber}}人</span> -->
            </div>
          </el-col>
          <el-col :span="qhTab" class="self-col" v-else>
            <div id="myChart" :style="{width: '420px', height: '400px'}"></div>
            <div class="chartZi"> 
              <span style="padding-right: 10px">应到人数: 0人</span>
              <span style="padding-right: 10px">已到人数: 0人</span>
              <span style="padding-right: 10px">未到人数: 0人</span>
              <!-- <span style="padding-right: 10px">请假: {{leaveForConfirmAttendanceNumber}}人</span> -->
            </div>
          </el-col>
      </div>
      
    </div>
  </div>
</template>

<script>
var noVueAll = null, noVueSingle = [], t = null, loading, connectionIdx = 0

export default {
  name: 'HelloWorld',
  data() {
    return {
        qhTab: 24,
        dataList: [],
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
                            shadowColor: 'rgba(0, 0, 0, 0)'
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

        Is: null, // 等于 不等于
        Does: 5, // 包含 不包含
        t: null,
        row: {}, // 会议参会信息

        // 分屏
        presentationRequest: null,
        presentationConnection: null,
        open: false
    }
  },
  watch: {
    columnData(val){
      console.log(val)
      this.columnData = val
    }
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
      },
      //饼图
      /**
       * 3 已签到
       * 5 6 7 请假 
       * 其它 未签到
       */
      circularMet() {
          // 将比例算出
          var total = this.columnData.inviteNumber,
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
      },

      // 图表数据请求
      getChart() {
          this.Does = this.columnData.doesTheNumberLeave
          this.Is = this.columnData.IsAttendanceNumber
          //柱状图
          this.circularMet();
          // 柱状图
          this.drawLine()

          noVueSingle = []
          loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          // this.requestAllData()
      },

      // 接收参数
      addConnection(connection) {
        connection.connectionId = ++connectionIdx;

        connection.addEventListener('message', (event) => {
          console.log(event.data)
          const data = JSON.parse(event.data);
          // 保存会议参会情况
          this.row = data.row
          // 保存token
          localStorage.setItem('token', data.token)

          // 请求数据
          this.initData(data.row.id)

          connection.send('Received message 1');
        });

        connection.addEventListener('close', (event) => {
          console.log('断开链接！')
        });
      }
  },
  created() {
    //文档载入后，监听连接
    document.addEventListener('DOMContentLoaded', () => {
      console.log(11)
      if (navigator.presentation.receiver) {
        console.log(navigator.presentation)
        navigator.presentation.receiver.connectionList.then(list => {
          console.log('00')
          console.log(list)
          list.connections.map(connection => this.addConnection(connection));
          list.addEventListener('connectionavailable', (event) => {
            console.log('来了')
            this.addConnection(event.connection);
          });
        });
      }
    });
  },
  mounted() {
    console.log(this)
    // id
    // this.initData('c3im20u9oueumkh4ah60')
    
  },
}
</script>

<style lang="less" scoped>
.projection {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .self-col {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .chartContent {
    width: 100%;
    display: flex;
    margin-bottom: 10px;
  }

  .chartZi {
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: flex-start;

    .chartZi2 {
      width: 60%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
    }
  }
}
</style>
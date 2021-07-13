import { selfTime, exportToExcel } from '@/plugins/plugins.js'
import $http from '@/plugins/axios.js'
import { Message } from 'element-ui';
import API from '@/API/api.js'

export function exportFile(curData, tableCate, code = '') {
  console.log(curData, code)
  if(curData.tips == '版本'){
    version(tableCate)
  } else if(curData.tips == '短信'){
    let title = curData.groupName + '明细'
    sms(tableCate, code, title)
  }
}

// 短信
function sms(tableCate, code, title) {
  $http.get(API.smsStatistics(1, 99999, code))
    .then(res => {
      console.log(res)
      if(res.code == '000') {

        let tHeader = [], filterVal = []
        tableCate.filter(its => {
          tHeader.push(its.label)
          filterVal.push(its.props)
        })

        exportToExcel(res.data, title, tHeader, filterVal, res => {
          Message.success('导出成功!')
        })
      }
    })
}

// 版本
function version(tableCate) {
  $http.get(API.findSysReplace(1, 99999))
    .then(res => {
      console.log(res)
      if(res.code == '000') {

        let tHeader = [], filterVal = []
        tableCate.filter(its => {
          tHeader.push(its.label)
          filterVal.push(its.props)
        })

        exportToExcel(res.data, '版本费用明细', tHeader, filterVal, res => {
          Message.success('导出成功!')
        })
      }
    })
}
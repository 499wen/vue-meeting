import { Loading } from 'element-ui'

/**
 * 时间戳转换日期
 * @param date 时间戳(ms) 
 * @param complete 返回日期是否包含时间 (默认不包含)
 * @param chinese 中文格式
 * @param minusOne eg: 1615651200000 - 1617120000000 -> 2021-03-14 00:00 至 23:59
 */

export function selfTime(date, complete = false, chinese = false, minusOne = false) {
    if(typeof date != 'number'){
        return ''
    }
    if(isNaN(date)){
        return ''
    }
  
    date = new Date(date);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate(); 
    var h = date.getHours();
    var m1 = date.getMinutes();
    var s = date.getSeconds();
    m = m < 10 ? ("0" + m) : m;
    d = d < 10 ? ("0" + d) : d;
    h = h < 10 ? ("0" + h) : h;
    m1 = m1 < 10 ? ("0" + m1) : m1;

    if(minusOne && h == '00' && m1 == '00'){
      h = '23'
      m1 = '59'
    }

    if(chinese){
        return complete 
                ?  y + "年" + m + "月" + d + "日 " + h + ":" + m1
                :  y + "年" + m + "月" + d + "日"
    } else {
        return complete 
                ?  y + "-" + m + "-" + d + " " + h + ":" + m1
                :  y + "-" + m + "-" + d
    }
}

/**
 * 监听scroll滚动条 数据预加载
 * @param _dom 被监听dom
 * @param totalData 被执行数据
 * @param num 次数
 * @param size 每次增加数量
 * @param callBack 回调
 * let table_scroll = document.querySelector('.el-table__body-wrapper')
 * dataScrollLoad(table_scroll, res.data, 1, 20, (res) => {
 *   this.tableData = res
 *   this.total = res.total
 * })
 */
export function dataScrollLoad(_dom, totalData, num, size,  callBack) {
    // dom scroll 监听 
    _dom.onscroll = function(){
        // 数据不够 不执行逻辑
        if((totalData.length + size) > (num * size)){
            let scrollHeight = _dom.clientHeight,
                scrollTop = _dom.scrollTop,
                totalHeight = _dom.scrollHeight

            // 滚动条距底20长度 触发
            if((totalHeight - scrollHeight - scrollTop) <= 20){
                num ++
                // 分割数据
                callBack(totalData.slice(0, num * size))
            }

        }    
    }

    // 首次主动触发
    if(num == 1){
        callBack(totalData.slice(0, num * size))
    }
}


export function map(params) {
    var map = new BMap.Map("baidu-map");
    map.centerAndZoom("北京",18);                   // 初始化地图,设置城市和地图级别。
  
    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
      {"input" : "suggestId"
      ,"location" : map
    });
  
    var myValue;
    ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
    var _value = e.item.value;
      myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
      
      setPlace();
    });
  
    function setPlace(){
      map.clearOverlays();    //清除地图上所有覆盖物
      function myFun(){
        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        map.addOverlay(new BMap.Marker(pp));    //添加标注
      }
      var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
      });
      local.search(myValue);
    }
}


// 地址栏获取数据失去焦点
export function tips_blur (){
  let tipsArr = document.querySelectorAll('.tangram-suggestion-main')
  for(let i = 0; i < tipsArr.length; i ++){
    tipsArr[i].style.display = 'none'
  }
}


/**
 * 将数组解析成树结构
 * @param {*} data 数据
 */
export function toTree(data) {
    let result = []
    if(!Array.isArray(data)) {
        return result
    }
    data.forEach(item => {
        delete item.children;
    });
    let map = {};
    data.forEach(item => {
        map[item.id] = item;
    });
    data.forEach(item => {
        let parent = map[item.parentId];
        if(parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            result.push(item);
        }
    });
    return result;
}

/**
 * 导出excel
 * @param {*} personData 导出数据
 * @param {*} title 导出文件名
 * @param {*} tHeader excel标题 
 * @param {*} filterVal 标题对应字段
 * @param {*} callBack 回调 - 处理加载
 */
export function exportToExcel(personData, title, tHeader, filterVal, callBack) {
  //excel数据导出
  require.ensure([], () => {
    const {
      export_json_to_excel
    } = require("@/plugins/Export2Excel.js");

    const data = formatJson(filterVal, personData);
    export_json_to_excel(tHeader, data, title);
    setTimeout(() => {
      callBack()
    }, 500)
  });
}
function formatJson(filterVal, jsonData) { 
    return jsonData.map(v => filterVal.map(j => v[j]));
}

/**
 * 将el-loading 简化
 */
export class Load {
  constructor (){
    this.load = Loading.service({
      lock: true,
      text: '正在加载中。。。',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.6)'
    })
  }

  close() {
    this.load.close()
  }
}
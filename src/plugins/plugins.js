/**
 * 时间戳转换日期
 * @param date 时间戳(ms) 
 * @param complete 返回日期是否包含时间 (默认不包含)
 * @param chinese 中文格式
 */

export function selfTime(date, complete = false, chinese = false) {
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
 * document.querySelector('.el-table__body-wrapper')
 * dataScrollLoad(table_scroll, res.data, 1, 20, (res) => {
 *   this.tableData = res
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
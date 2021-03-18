
class CheckMeet {

  constructor (self){
    window.self = self
    console.log(window.self)
  }

  checkBeginDate(rule, value, callback) {
    let self = window.self
    console.log(value)
    if (!value) {
      return callback(new Error("请先选择会议开始时间"));
    }
    //当前时间 
    let timestamp = new Date().getTime(); 
    //会议开始时间 
    let timestamp2 = new Date(value).getTime();
    console.log(timestamp > timestamp2)
    //判断让会议开始时间不能早于当前时间 
    if (timestamp > timestamp2) {
      this.addForm.beginDate = ''
      return callback(new Error("会议开始时间不能早于当前时间"));
    } 
    callback();
  }
}

export default CheckMeet
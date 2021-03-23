//  处理当前模块 公共数据
export default function handle(params) {
  if(params == 'sponsorArrJsonStr'){
    return [{type: "organizer", value: ""}]
  } else if(params == 'contactJson'){
    return [{ duty: "", handPhone: "", name: "", telePhone: ""}]
  } else if( params == 'meetingProduce') {
    return [{value: ""}]
  }
}
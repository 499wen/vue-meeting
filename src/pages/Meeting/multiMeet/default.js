export const defaultMeetData = (id) => {
  let companyId = JSON.parse(localStorage.getItem('loginInfo')).companyId
  return {
    address: "",//会议地址
    meetingId: "",
    photoFileId: "",
    meetingName: "", //会议名称，
    meetingRoomId: "", //会议名称，
    type: "", //会议类型
    content: "", //会议内容
    departmentId: companyId,
    beginDate: "",// 会议开始时间
    endDate: "",// 会议结束时间
    checkBeginTime: "", // 签到开始时间
    checkEndTime: "",// 签到结束时间
    parentMeetingId: "", //上级会议ID
    organizingRegisterStartTime: "", //会务组报到开始时间
    organizingRegisterEndTime: "", //会务组报到结束时间
    layTime: "", //迟到时间
    leaveTime: "", //早退时间
    longitude: "", //经度
    latitude: "", //纬度
    invitationWay: '0',
    leaveApprovalMethod: 1, // 请假审批方式
    strangersJoinIn: 0, 
    isMultistage: '1', // 多级会议
    meetingType: '1',
    topLevelId: id, // 
    parentMeetingId: id, // 上级会议id
    IsAttendanceNumber: 1,
    doesTheNumberLeave: '',
    sponsorArrJsonStr: [
      { type: "organizer", value: ""}
    ], //会议组织
    contactJson: [ 
      {
        name: "", //姓名
        duty: "", //职责 
        handPhone: "", //手机
        telePhone: "" //电话
      }
    ], //会议联系方式Json
    mattersNeedAttention: "", //注意事项
    meetingProduce: [
      { value: "" }
    ], //会议议程
    meetingInviteApproveCode: "1"
  }
}
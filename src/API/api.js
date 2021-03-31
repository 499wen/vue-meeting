const gzKey = '/gzapi' // 广州
// const gzKey = `https://service-ij14wquc-1305256445.gz.apigw.tencentcs.com`

export default {
  /**
   * 模块之外
   */
  getCustomer: `${gzKey}/release/getCustomer`, // 获取公司信息
  uploadFile: `${gzKey}/release/uploadFile?`, // 上传图片 问号不能去掉
  fileExcel: (name, type) => `https://service-ij14wquc-1305256445.gz.apigw.tencentcs.com/release/excel?actionCode=0&fileName=${name}&type=${type}`, // 上传excel人员
  echoImage: (id, type) => {
    let loginInfo = JSON.parse(localStorage.getItem('loginInfo')),
      url = `https://mybucket-resized-1305256445.cos.ap-guangzhou.myqcloud.com`

    return `${url}/${loginInfo.companyId}/${type}/${id}`
  }, // 回显图片

  /**
   * 注册
   */
  smsCheckedCode: phone => `${gzKey}/release/smsCheckedCodeForRegister?phone=${phone}`, // 获取验证码
  register: `${gzKey}/release/apply`, // 注册

  /**
   * 登录 
   */
  loginByPhone: `${gzKey}/release/loginByPhone`, // 验证码 - 登录
  verificationCode: phone => `${gzKey}/release/verificationCode?phone=${phone}`, // 获取登录验证码
  loginByLoginNameAndPassword: `${gzKey}/release/loginByLoginNameAndPassword`, // 账号密码登录

  initLoginNameAndPassword: `/hzbase/customer/initLoginNameAndPassword`, // 提交修改后用户信息

  /**
   * 首页
   */
  findleaveInfo: (state, pageNum, pageSize) => `${gzKey}/release/findByAuthorityOfCompanyAdministratorAndPage?approvalState=${state}&pageNum=${pageNum}&pageSize=${pageSize}`, // 请假消息 state: 0-待审批, 1-已审批, 2-查所有  
  findMeetingStatistical: (pageNum, pageSize, searchKey) => `${gzKey}/release/findMeetingStatisticalData2s?searchKey=${searchKey}&pageNum=${pageNum}pageSize=${pageSize}`, // 会议信息 - 参会人报到数据  code

  /**
   * 基础设置 - 酒店管理
   */
  addHotelByCustomer: `${gzKey}/release/addHotelByCustomer`,  // 添加酒店
  updateHotelByCustomer: `${gzKey}/release/updateHotelByCustomer`, // 修改酒店
  findHotelByCompanyId: (pageNum, pageSize) => `${gzKey}/release/findHotelByCompanyId?pageNum=${pageNum}&pageSize=${pageSize}`, // 查询酒店
  findHotelById: id => `${gzKey}/release/findHotelById?id=${id}`, // 查询酒店 - 查询单个
  deleteHotelById: id => `${gzKey}/release/deleteHotelById?id=${id}`, // 删除酒店

  addListByHotelId: hotelId => `${gzKey}/release/addListByHotelId?hotelId=${hotelId}`, // 添加大楼
  findByHotelIdAndPage: hotelId => `${gzKey}/release/findByHotelIdAndPage?hotelId=${hotelId}`, // 查询大楼
  delBuilding: id => `${gzKey}/release/deleteHotelBuildingById?id=${id}`, // 删除大楼
  updateListByHotelId: hotelId => `${gzKey}/release/updateListByHotelId?hotelId=${hotelId}`, // 修改大楼

  selectFloorByHotelId: buildingId => `${gzKey}/release/selectFloorByHotelId?hotelId=${buildingId}`, // 查询楼层
  addFloor: `${gzKey}/release/addFloor`, // 添加楼层
  deleteFloorById: id => `${gzKey}/release/deleteFloorById?id=${id}`, // 删除楼层

  getRoom: (floorId, pageNum, pageSize, searchKey) => `${gzKey}/release/selectHotelRoomByFloorId?floorId=${floorId}&pageNum=${pageNum}&pageSize=${pageSize}&searchKey=${searchKey}`, // 查询房间
  addHotelRoom: floorId =>  `${gzKey}/release/addHotelRoom?floorId=${floorId}`, // 单个添加房间
  massProductionByHotel: floorId => `${gzKey}/release/massProductionByHotelBuildingId?floorId=${floorId}`, // 批量添加房间
  delectHotelRoomById: roomId => `${gzKey}/release/delectHotelRoomById?id=${roomId}`, // 删除房间
  updateHotelRoom: `${gzKey}/release/updateHotelRoom`, // 修改房间

  /**
   * 基础设置 - 餐厅管理
   */
  selectRestaurantAll: (pageNum, pageSize, searchKey) => `${gzKey}/release/selectRestaurantAll?searchKey=${searchKey}&pageNum=${pageNum}&pageSize=${pageSize}`, // 查询所有餐厅
  saveRestaurant: `${gzKey}/release/saveRestaurant`, // 添加餐厅
  selectRestaurantById: id => `${gzKey}/release/selectRestaurantById?id=${id}`, // 查询餐厅 - 查询单个
  updateRestaurant: `${gzKey}/release/updateRestaurant`, // 修改餐厅
  delectRestaurantById: id => `${gzKey}/release/delectRestaurantById?id=${id}`, // 删除餐厅
  
  /**
   * 基础设置 - 会议室管理
   */
  saveRoom: `${gzKey}/release/saveRoom`, // 添加会议室
  selectRoomByCompany: (pageNum, pageSize, searchKey) => `${gzKey}/release/selectRoomByCompanyId?searchKey=${searchKey}&pageNum=${pageNum}&pageSize=${pageSize}`, // 查询所有会议室
  selectRoomById: id => `${gzKey}/release/selectRoomById?id=${id}`, // 查询会议室 - 查询单个
  updateRoomById: `${gzKey}/release/updateRoomById`, // 修改会议室
  delectRoomById: id => `${gzKey}/release/delectRoomById?id=${id}`, // 删除会议室

  /**
   * 基础设置 - 人员管理 
   */
  addDepartmentForCompany: `${gzKey}/release/addDepartmentForCompany`, // 添加部门
  findCompanyDepartment: `${gzKey}/release/findCompanyDepartment`, // 获取部门
  delDpeartmentForCompany: `${gzKey}/release/delDpeartmentForCompany`, // 删除部门
  editDepartmentNameForCompany: (id, parentId, departmentName) => `${gzKey}/release/editDepartmentNameForCompany?id=${id}&parentId=${parentId}&departmentName=${departmentName}`, // 修改部门

  conditionQuerys: (deparmentId, pageNum, pageSize, externalCode, searchKey, photoFlag) => `${gzKey}/release/conditionQuerys?deparmentId=${deparmentId}&pageNum=${pageNum}&pageSize=${pageSize}&externalCode=${externalCode}&searchKey=${searchKey}&photoFlag=${photoFlag}`, // 查询人员
  addUser: `${gzKey}/release/addUser`, // 添加人员
  updateUser: `${gzKey}/release/updateUser`, // 修改人员
  delHzUser: `${gzKey}/release/delHzUser`, // 删除勾选人员
  delectAllUser: `${gzKey}/release/delectAllUser`, // 删除全部人员
  singleClomnData: id => `${gzKey}/release/findPersonById?id=${id}`, // 查询人员 - 单条数据 

  deleteNotMatchingPhoto: `${gzKey}/release/deleteNotMatchingPhoto`, // 删除多余的照片
  matchingUserPhoto: (userId, fileInfoId) => `${gzKey}/release/matchingUserPhoto?userId=${userId}&fileInfoId=${fileInfoId}`, // 关联人员与相片
  getNotMatchingPhoto: (pageNum, pageSize) => `${gzKey}/release/getNotMatchingPhoto?num=${pageNum}&size=${pageSize}`, // 查询相片匹配 相片
  findAllUserNoPhotoForCompany: (type, pageNum, pageSize, search) => `${gzKey}/release/findAllUserNoPhotoForCompany?type=${type}&num=${pageNum}&size=${pageSize}&searchKey=${search}`, // 查询相片匹配 人员
  findDuplicateName: (pageNum, pageSize, externalCode, deparmentId) => `${gzKey}/release/findDuplicateName?num=${pageNum}&size=${pageSize}&externalCode=${externalCode}&departmentId=${deparmentId}`, // 重名人员

  matchingUserPhotoFiles: (type, fileName) => `${gzKey}/release/matchingUserPhotoFiles?type=${type}&fileName=${fileName}`, // 批量上传头像
  /**
   * 会议管理
   */
  findMeetingAddByMeetingId: meetId => `${gzKey}/release/findMeetingAddByMeetingId?meetingId=${meetId}&searchKey=&examineAndApprove=2&typeCode=0&triggerType=1&pageNum=1&pageSize=1000&count=`, // 会议发布 - 是否添加短信
  meetingReleaseById: meetId => `${gzKey}/release/meetingReleaseById?id=${meetId}`, // 发布会议

  findMeetingById: (pageNum, pageSize, searchKey) => `${gzKey}/release/meetings?pageNum=${pageNum}&pageSize=${pageSize}&searchKey=${searchKey}`, // 查询全部会议
  meetingsPageAndStateCode: (code, pageNum, pageSize, searchKey) => `${gzKey}/release/meetingsPageAndStateCode?stateCode=${code}&pageSize=${pageSize}&pageNum=${pageNum}&searchKey=${searchKey}`, // 根据分页查询会议 进行中 - 0  未发布 - 3  已发布 - 4 已结束 2 code
  saveMeeting: `${gzKey}/release/saveMeeting`, // 保存会议 - 修改 - 共用
  singleMeeting: meetId => `${gzKey}/release/findMeetingById?id=${meetId}`, // 根据会议id查询 单级会议
  multiMeeting: meetId => `${gzKey}/release/multistageMeetingId?meetingId=${meetId}`, // 根据会议id查询 单级会议
  
  initMeetingAllConfereeGroup: meetId => `${gzKey}/release/initMeetingAllConfereeGroup?meetingId=${meetId}`, // 初始化全体参会人
  getConfereeGroupAll: meetId => `${gzKey}/release/findConfereeGroupAllByMeetingId?meetingId=${meetId}`, // 查询参会人分组 - 树
  updateConfereeGroup: `${gzKey}/release/updateConfereeGroup`, // 修改参会人分组
  addByParentId: `${gzKey}/release/addByParentId`, // 添加参会人分组
  deleteConfereeGroup: id => `${gzKey}/release/deleteConfereeGroup?id=${id}`, // 删除参会人分组 

  // saveSuperiorMeetingInvite: groupId => `${gzKey}/release/saveSuperiorMeetingInvite?confereeGroupId=${groupId}`, // 多级会议 添加参会人

  findMeetingEnableInviteUser: (meetId, pageNum, pageSize, searchKey) => `${gzKey}/release/findMeetingEnableInviteUser?pageNum=${pageNum}&pageSize=${pageSize}&externalCode=all&photoFlag=2&searchKey=${searchKey}&meetingId=${meetId}`, // 全体参会人 - 查询未添加人员
  findByMeetingIdAndPage: (groupId, pageNum, pageSize) => `${gzKey}/release/findByMeetingIdAndPage?confereeGroupId=${groupId}&pageNum=${pageNum}&pageSize=${pageSize}`, // 参会分组查询人员  
  addWholeatten: groupId => `${gzKey}/release/addByConfereeGroupIdAndUserIds?confereeGroupId=${groupId}`, // 添加人员至全体参会人分组中
  meetingInviteDeleteByIds: `${gzKey}/release/meetingInviteDeleteByIds`, // 删除参会人

  selectConditionGroup: type => `${gzKey}/release/selectConditionGroup?type=${type}`, // 查询条件组 adduser：参会人  persons: 人员  
  updateConditionGroup: `${gzKey}/release/updateConditionGroup`, // 修改条件组 
  saveConditionGroup: `${gzKey}/release/saveConditionGroup`, // 添加条件组  
  delectConditionGroup: `${gzKey}/release/delectConditionGroup`, // 删除条件组

  getTemplate: `${gzKey}/release/selectInvitationTemplate`, // 查询模板 - 邀请函 
  delTemplate: `${gzKey}/release/delectInvitationTemplate`, // 批量删除模板 - 邀请函  
  saveTemplate: `${gzKey}/release/saveInvitationTemplate`, // 保存模板 - 邀请函 
  saveInvitation: `${gzKey}/release/saveInvitation`, // 保存邀请函 
  updateInvitation: `${gzKey}/release/updateInvitation`, // 修改邀请函 
  selectInvitationByMeetingId: meetId => `${gzKey}/release/selectInvitationByMeetingId?meetingId=${meetId}`, // 查询邀请函 
  saveCompanyByBackGroup: `${gzKey}/release/saveCompanyByBackGroup`, // 添加背景 - 邀请函 
  selectCompanyByBackGroup: `${gzKey}/release/selectCompanyByBackGroup`, // 查询背景 - 邀请函 
  delectCompanyByBackGroup: `${gzKey}/release/delectCompanyByBackGroup`, // 删除背景 - 邀请函 

  bookingMeetingRoom: `${gzKey}/release/bookingMeetingRoom`, // 会议室预约  
  selectRoomByBettwnDate: (pageNum, pageSize) => `${gzKey}/release/conferenceRoomBooking?page=${pageNum}&size=${pageSize}`, // 查询会议室 

  selectCateringByMeetingId: meetId => `${gzKey}/release/selectCateringByMeetingId?meetingId=${meetId}`, // 查询餐饮信息
  saveCatering: `${gzKey}/release/saveCatering`, // 第一次添加餐饮数据 
  updateCatering: `${gzKey}/release/updateCatering`, // 更新餐饮数据

  findSelectSmsAndAll: meetId => `${gzKey}/release/findSelectSmsAndAll?meetingId=${meetId}`, // 根据会议id查询 短信
  saveSmsByMeetingId: meetId => `${gzKey}/release/saveSmsByMeetingId?meetingId=${meetId}`, // 添加短信

  accordMeetRoom: (meetId, floorId, pageNum, pageSize) => `${gzKey}/release/findMeetingNotAddHotelRoomsByMeetingId?meetingId=${meetId}&floorId=${floorId}&pageNum=${pageNum}&pageSize=${pageSize}`, // 根据会议id查询房间  
  findfloorAndRoomByMeetingId: meetId => `${gzKey}/release/findfloorAndRoomByMeetingId?meetingId=${meetId}`, // 查询已添加的酒店
  addListByMeetingId: meetId => `${gzKey}/release/addListByMeetingId?meetingId=${meetId}`, // 添加客房
  selectMeetingRoomByFloorId: (floorId, pageNum, pageSize) => `${gzKey}/release/selectMeetingRoomByFloorId?floorId=${floorId}&pageNum=${pageNum}&pageSize=${pageSize}`, // 查询客房
  onekeyCheckin: meetId => `${gzKey}/release/automaticCheckInByMeetingId?meetingId=${meetId}`, // 一键安排入住
  onekeyRemove: meetId => `${gzKey}/release/deleteByMeetingId?meetingId=${meetId}`, // 一键清空人员
  removeRoom: `${gzKey}/release/deleteHotelRoomByIds`, // 移除客房
  singleRemoveRoom: `${gzKey}/release/deleteMeetingHotelRoomMeetingInviteByIds`, // 单个移除客房

  noCheckPerson: (groupId, meetId, pageNum, pageSize) => `${gzKey}/release/findMeetingInvitesByMeetingIdPageNotHotel?confereeGroupId=${groupId}&meetingId=${meetId}&pageNum=${pageNum}&pageSize=${pageSize}`, // 查询未安排入住的人
  singleRoomAddPerson: (st, et) => `${gzKey}/release/addByMeetingHotelRoomIdAndMeetingInviteId?startTime=${st}&endTime=${et}`, // 单个房间添加人员
  
  /**
   * 预约审批
   */
  selectByStateCodeAlready: (code, pageNum, pageSize) => `${gzKey}/release/selectByStateCodeAlready?stateCode=${code}&page=${pageNum}&size=${pageSize}`, // 查询全部审批数据
  selectByStateCode: (pageNum, pageSize) => `${gzKey}/release/selectByStateCode?page=${pageNum}&size=${pageSize}`, // 查询预约审批数据
  approvalBinDing: `${gzKey}/release/conferenceRoomApproval`, // 审批

  /**
   * 基础设置 - 短信管理
   */
  findCompanySmsGroup: `${gzKey}/release/findCompanySmsGroup`, // 查询短信所有分组
  findCompanySmsType: (typeCode, pageNum, pageSize) => `${gzKey}/release/findCompanySmsType?typeCode=${typeCode}&pageNum=${pageNum}&pageSize=${pageSize}`, // 根据分组id查询短信 
  findAllSms: (pageNum, pageSize) => `${gzKey}/release/findAllSmsTemplateByCompanyIdAndPage?pageNum=${pageNum}&pageSize=${pageSize}`, // 查询所有短信
  updateSmsIsUse: (smsId, isUse) => `${gzKey}/release/updateSmsIsUse?id=${smsId}&isUse=${isUse}`, // 短信开关
  findSmsTemplateById: smsId => `${gzKey}/release/findSmsTemplateById?id=${smsId}`, // 根据短信id 查询详情 
  saveCompanySmsTemplateConfig: `${gzKey}/release/saveCompanySmsTemplateConfig`, // 保存详情

} 


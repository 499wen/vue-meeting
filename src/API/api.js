import Vue from 'vue'
const gzKey = '/gzapi', // 广州
      shKey = '/shapi'  // 上海
const Api = {
  /**
   * 模块之外
   */
  getCustomer: `${shKey}/release/getCustomer`, // 获取公司信息

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


  /**
   * 基础设置 - 酒店管理
   */
  addHotelByCustomer: `${gzKey}/release/addHotelByCustomer`,  // 添加酒店
  updateHotelByCustomer: `${gzKey}/release/updateHotelByCustomer`, // 修改酒店
  findHotelByCompanyId: (pageNum, pageSize) => `${gzKey}/release/findHotelByCompanyId?pageNum=${pageNum}&pageSize=${pageSize}`, // 查询酒店
  findHotelById: id => `${gzKey}/release/findHotelById?id=${id}`, // 查询酒店 - 查询单个
  deleteHotelById: id => `${gzKey}/release/deleteHotelById?id=${id}`, // 删除酒店

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
  singleClomnData: id => `${gzKey}/release/findPersonById?id=${id}`, // 查询人员 - 单条数据 

  findAllUserNoPhotoForCompany: (type, pageNum, pageSize, search) => `${gzKey}/release/findAllUserNoPhotoForCompany?type=${type}&num=${pageNum}&size=${pageSize}&searchKey=${search}`, // 查询相片匹配 人员
  findDuplicateName: (pageNum, pageSize, externalCode, deparmentId) => `${gzKey}/release/findDuplicateName?num=${pageNum}&size=${pageSize}&externalCode=${externalCode}&deparmentId=${deparmentId}`, // 重名人员

  /**
   * 会议管理
   */
  findMeetingById: (pageNum, pageSize, searchKey) => `${gzKey}/release/meetings?pageNum=${pageNum}&pageSize=${pageSize}&searchKey=${searchKey}`, // 查询全部会议
  saveMeeting: `${gzKey}/release/saveMeeting`, // 保存会议 - 修改 - 共用
  singleMeeting: meetId => `${gzKey}/release/findMeetingById?id=${meetId}`, // 根据会议id查询 会议

  initMeetingAllConfereeGroup: meetId => `${gzKey}/release/initMeetingAllConfereeGroup?meetingId=${meetId}`, // 初始化全体参会人
  getConfereeGroupAll: meetId => `${gzKey}/release/findConfereeGroupAllByMeetingId?meetingId=${meetId}`, // 查询参会人分组 - 树
  updateConfereeGroup: `${gzKey}/release/updateConfereeGroup`, // 修改参会人分组
  addByParentId: `${gzKey}/release/addByParentId`, // 添加参会人分组
  deleteConfereeGroup: id => `${gzKey}/release/deleteConfereeGroup?id=${id}`, // 删除参会人分组

  findByMeetingIdAndPage: (groupId, pageNum, pageSize) => `${gzKey}/release/findByMeetingIdAndPage?confereeGroupId=${groupId}&pageNum=${pageNum}&pageSize=${pageSize}`, // 参会分组查询人员
  addWholeatten: groupId => `${gzKey}/release/addByConfereeGroupIdAndUserIds?confereeGroupId=${groupId}`, // 添加人员至全体参会人分组中

  selectConditionGroup: type => `${gzKey}/release/selectConditionGroup?type=${type}`, // 查询条件组 adduser：参会人  persons: 人员 
  updateConditionGroup: `${gzKey}/release/updateConditionGroup`, // 修改条件组 
  saveConditionGroup: `${gzKey}/release/saveConditionGroup`, // 添加条件组  
  delectConditionGroup: `${gzKey}/release/delectConditionGroup`, // 删除条件组

  getTemplate: `${shKey}/release/selectInvitationTemplate`, // 查询模板 - 邀请函 
  delTemplate: `${shKey}/release/delectInvitationTemplate`, // 批量删除模板 - 邀请函  ?
  saveTemplate: `${shKey}/release/saveInvitationTemplate`, // 保存模板 - 邀请函 ?
  saveInvitation: `${shKey}/release/saveInvitation`, // 保存邀请函 ?
  updateInvitation: `${shKey}/release/updateInvitation`, // 修改邀请函 ?
  selectInvitationByMeetingId: meetId => `${shKey}/release/selectInvitationByMeetingId?meetingId=${meetId}`, // 查询邀请函 
  saveCompanyByBackGroup: `${shKey}/release/saveCompanyByBackGroup`, // 添加背景 - 邀请函 ?
  selectCompanyByBackGroup: `${shKey}/release/selectCompanyByBackGroup`, // 查询背景 - 邀请函 
  delectCompanyByBackGroup: `${shKey}/release/delectCompanyByBackGroup`, // 删除背景 - 邀请函 ?

  bookingMeetingRoom: `${shKey}/release/bookingMeetingRoom`, // 会议室预约  
  selectRoomByBettwnDate: (pageNum, pageSize) => `${shKey}/release/conferenceRoomBooking?page=${pageNum}&size=${pageSize}`, // 查询会议室 

  selectCateringByMeetingId: meetId => `${shKey}/release/selectCateringByMeetingId?meetingId=${meetId}`, // 查询餐饮信息
  saveCatering: `${shKey}/release/saveCatering`, // 第一次添加餐饮数据 
  updateCatering: `${shKey}/release/updateCatering`, // 更新餐饮数据 error

  findSelectSmsAndAll: meetId => `${shKey}/release/findSelectSmsAndAll?meetingId=${meetId}`, // 根据会议id查询 短信

  /**
   * 预约审批
   */
  selectByStateCodeAlready: (code, pageNum, pageSize) => `${shKey}/release/selectByStateCodeAlready?stateCode=${code}&page=${pageNum}&size=${pageSize}`, // 查询全部审批数据
  selectByStateCode: (pageNum, pageSize) => `${shKey}/release/selectByStateCode?page=${pageNum}&size=${pageSize}`, 

  /**
   * 基础设置 - 短信管理
   */
  findCompanySmsGroup: `${shKey}/release/findCompanySmsGroup`, // 查询短信所有分组
  findCompanySmsType: (typeCode, pageNum, pageSize) => `${shKey}/release/findCompanySmsType?typeCode=${typeCode}&pageNum=${pageNum}&pageSize=${pageSize}`, // 根据分组id查询短信 
  findAllSms: (pageNum, pageSize) => `${shKey}/release/findAllSmsTemplateByCompanyIdAndPage?pageNum=${pageNum}&pageSize=${pageSize}`, // 查询所有短信
  updateSmsIsUse: (smsId, isUse) => `${shKey}/release/updateSmsIsUse?id=${smsId}&isUse=${isUse}`, // 短信开关
  findSmsTemplateById: smsId => `${shKey}/release/findSmsTemplateById?id=${smsId}`, // 根据短信id 查询详情 error

} 

Vue.prototype.API = Api
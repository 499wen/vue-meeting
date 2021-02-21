import Vue from 'vue'
const Key = '/api'
const Api = {
    /**
     * 注册
     */
    smsCheckedCode: phone => `${Key}/release/smsCheckedCodeForRegister?phone=${phone}`, // 获取验证码
    register: `${Key}/release/apply`, // 注册

    /**
     * 登录
     */
    loginByPhone: `${Key}/release/loginByPhone`, // 验证码 - 登录
    verificationCode: phone => `${Key}/release/verificationCode?phone=${phone}`, // 获取登录验证码


    /**
     * 基础设置 - 酒店管理
     */
    addHotelByCustomer: `${Key}/release/addHotelByCustomer`,  // 添加酒店
    updateHotelByCustomer: `${Key}/release/updateHotelByCustomer`, // 修改酒店
    findHotelByCompanyId: (pageNum, pageSize) => `${Key}/release/findHotelByCompanyId?pageNum=${pageNum}&pageSize=${pageSize}`, // 查询酒店
    findHotelById: id => `${Key}/release/findHotelById?id=${id}`, // 查询酒店 - 查询单个
    deleteHotelById: id => `${Key}/release/deleteHotelById?id=${id}`, // 删除酒店

    /**
     * 基础设置 - 餐厅管理
     */
    selectRestaurantAll: (pageNum, pageSize, searchKey) => `${Key}/release/selectRestaurantAll?searchKey=${searchKey}&pageNum=${pageNum}&pageSize=${pageSize}`, // 查询所有餐厅
    saveRestaurant: `${Key}/release/saveRestaurant`, // 添加餐厅
    selectRestaurantById: id => `${Key}/release/selectRestaurantById?id=${id}`, // 查询餐厅 - 查询单个
    updateRestaurant: `${Key}/release/updateRestaurant`, // 修改餐厅
    delectRestaurantById: id => `${Key}/release/delectRestaurantById?id=${id}`, // 删除餐厅
    
    /**
     * 基础设置 - 会议室管理
     */
    saveRoom: `${Key}/release/saveRoom`, // 添加会议室
    selectRoomByCompany: (pageNum, pageSize, searchKey) => `${Key}/release/selectRoomByCompanyId?searchKey=${searchKey}&pageNum=${pageNum}&pageSize=${pageSize}`, // 查询所有会议室
    selectRoomById: id => `${Key}/release/selectRoomById?id=${id}`, // 查询会议室 - 查询单个
    updateRoomById: `${Key}/release/updateRoomById`, // 修改会议室
    delectRoomById: id => `${Key}/release/delectRoomById?id=${id}`, // 删除会议室

    /**
     * 基础设置 - 人员管理 
     */
    addDepartmentForCompany: `${Key}/release/addDepartmentForCompany`, // 添加部门
    findCompanyDepartment: `${Key}/release/findCompanyDepartment`, // 获取部门
    delDpeartmentForCompany: `${Key}/release/delDpeartmentForCompany`, // 删除部门
    editDepartmentNameForCompany: (id, parentId, departmentName) => `${Key}/release/editDepartmentNameForCompany?id=${id}&parentId=${parentId}&departmentName=${departmentName}`, // 修改部门
} 

Vue.prototype.API = Api
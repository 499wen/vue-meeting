export const checkPhone = function (rule, value, callback) {
    let pattern = /^1[0-9]{10}$/;
    if (pattern.test(value)) {
        callback(undefined);
    } else {
        callback(new Error('请输入正确的手机号'));
    }
}
export const checkMail = function (rule, value, callback) {
    let pattern = /^.{1,}@.{1,}\.(com|cn|org)$/
    if (pattern.test(value)) {
        callback(undefined);
    } else {
        callback(new Error('请输入正确的邮箱地址'));
    }
}

export const checkName = function (rule, value, callback) {
    if (!value) {
        callback(new Error('请输入正确的姓名,最少两个字'));
    }
    if (value.length < 2) {
        callback(new Error('请输入正确的姓名,最少两个字'));
    }
    let pattern = /先生|小姐|女士/
    if (pattern.test(value)) {
        callback(new Error('请输入正确的姓名,不要输入：先生、女士、小姐。'));
    } else {
        callback(undefined);
    }
}

/*企业名不能输入特殊字符*/
export const validateuser = (rule, value, callback) => {
    // ^[A-Za-z0-9\u4e00-\u9fa5]+$  //不包括空格，替换掉下方正则即不允许输入空格
    if (!(/^[\u4E00-\u9FA5A-Za-z0-9 ]+$/gi.test(value))) {
        callback(new Error('不能输入特殊字符'));
    } else {
        callback(undefined);
    }
};

//验证码只能输入数字
export const validatNumer = (rule, value, callback) => {
    if (/[^\d]/g.test(value)) {
        callback(new Error('只能输入数字'));
    } else if (value.length < 4) {
        callback(new Error('请输入4位数字验证码'));
    } else {
        callback(undefined);
    }
};
/*是否用户名的字数为5*/
export function validateUsername(rule, value, callback) {
  if (value.trim().length<2) {
    callback(new Error('用户名不能为空'))
  } else {
    callback()
  }
}
/*是否真实姓名为汉字*/
export function validateCardName(rule, value, callback) {
  const chinese = /^[\u4e00-\u9fa5]+$/;
  const reCheck = chinese.test(value);
  if (!value) {
    callback(new Error('身份证真实姓名不能为空'));
  }else if (!reCheck) {
    callback(new Error('请输入真实姓名为正确的汉字'));
  }else {
    callback();
  }
}
/*是否企业名字汉字*/
export function validateChinese(rule, value, callback) {
  const chinese = /^[\u4e00-\u9fa5]+$/;
  const reCheck = chinese.test(value);
  if (!value) {
    callback(new Error('企业名称不能为空'));
  }else if (!reCheck) {
    callback(new Error('请输入企业名称为正确的汉字'));
  }else {
    callback();
  }
}
/*是否企业地址为汉字*/
export function validateAddress(rule, value, callback) {
  const chinese = /^[\u4e00-\u9fa5]+$/;
  const reCheck = chinese.test(value);
  if (!value) {
    callback(new Error('企业地址不能为空'));
  }else if (!reCheck) {
    callback(new Error('请输入企业地址为正确的汉字'));
  }else {
    callback();
  }
}
/*是否验证码的字数为6*/
export function validateVerifyNum(rule, value, callback) {
  const reg = /^.{6}[0-9]*$/;
  const regNum = /^[0-9]*[1-9][0-9]*$/;
  const rsCheck = regNum.test(value);
  if (!value) {
    callback(new Error('验证码不能为空'));
  } else if (!rsCheck) {
    callback(new Error('请输入正整数'));
  }else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的验证码'));
    }else {
      callback();
    }
  }
}
/*是否合法IP地址*/
export function validateIP(rule, value,callback) {
  if(value==''||value==undefined||value==null){
    callback();
  }else {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的IP地址'));
    } else {
      callback();
    }
  }
}
/* 是否手机号码或者固话*/
export function validatePhoneTwo(rule, value, callback) {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
  if (value == '' || value == undefined || value == null) {
    callback();
  } else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的电话号码或者固话号码'));
    } else {
      callback();
    }
  }
}
/* 是否固话*/
export function validateTelphone(rule, value,callback) {
  const reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
  if(value==''||value==undefined||value==null){
    return callback(new Error('固话号码不能为空'));
  }else {
    if ((!reg.test(value))) {
      callback(new Error('请输入正确的固话（格式：区号+号码,如010-1234567）'));
    } else {
      callback();
    }
  }
}
/* 是否手机号码*/
export function validatePhone(rule, value,callback) {
  const reg = /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/;
  const regNum = /^[0-9]*[1-9][0-9]*$/;
  const rsCheck = regNum.test(value);
  if (!value) {
    callback(new Error('手机号码不能为空'));
  } else if (!rsCheck) {
    callback(new Error('请输入正整数'));
  }else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的手机号码'))
    }else {
      callback();
    }
  }
}
/* 是否身份证号码*/
export function validateIdNo(rule, value,callback) {
  const reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if(value==''||value==undefined||value==null){
    return callback(new Error('身份证号码不能为空'));
  }else {
    if ((!reg.test(value))) {
      callback(new Error('请输入正确的身份证号码'));
    } else {
      callback();
    }
  }
}
/* 是否个人邮箱*/
export function validateEMail(rule, value,callback) {
  const reg =/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
  if(value==''||value==undefined||value==null){
    return callback(new Error('邮箱不能为空'));
  }else{
    if (!reg.test(value)){
      callback(new Error('请输入正确的电子邮箱'));
    } else {
      callback();
    }
  }
}
/* 是否企业邮箱*/
export function validateEMailQy(rule, value, callback) {
  const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-z]+$/;
  if (!value) {
    return callback(new Error('企业邮箱不能为空'));
  }else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的电子邮箱'));
    }else {
      callback();
    }
  }
}
/*验证是否密码*/
export function validatePass(rule, value, callback) {
  const reg = /^[a-zA-Z0-9]{6,16}$/;
  if (!value) {
    callback(new Error('密码不能为空'));
  }else {
    if (!reg.test(value)) {
      callback(new Error('密码不能含有非法字符，长度在6~16之间'));
    }else {
      callback();
    }
  }
}
/*验证是否企业机构代码*/
/*
统一代码由十八位的阿拉伯数字或大写英文字母（不使用I、O、Z、S、V）组成。
         第1位：登记管理部门代码（共一位字符）
         第2位：机构类别代码（共一位字符）
         第3位~第8位：登记管理机关行政区划码（共六位阿拉伯数字）
         第9位~第17位：主体标识码（组织机构代码）（共九位字符）
         第18位：校验码​（共一位字符）
*/
export function validateRecode(rule, value, callback) {
  const reg = /^(1[129]|5[1239]|9[123]|Y1)\d{6}[\dA-Z]{8}[X\d][\dA-Z]$/;
  if (!value) {
    callback(new Error('企业机构代码不能为空'));
  }else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的企业机构代码'))
    }else {
      callback();
    }
  }
}
/*验证是否上传照片前*/
export function validateUpload(rule, value, callback) {
  if (!value) {
    callback(new Error('图片不能为空'))
  } else {
    callback()
  }
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/*验证内容是否英文数字以及下划线*/
export function isPassword(rule, value, callback) {
  const reg =/^[_a-zA-Z0-9]+$/;
  if(value==''||value==undefined||value==null){
    callback();
  } else {
    if (!reg.test(value)){
      callback(new Error('密码仅由英文字母，数字以及下划线组成'));
    } else {
      callback();
    }
  }
}

/*自动检验数值的范围*/
export function checkMax20000(rule, value, callback) {
  if (value == '' || value == undefined || value == null) {
    callback();
  } else if (!Number(value)) {
    callback(new Error('请输入[1,20000]之间的数字'));
  } else if (value < 1 || value > 20000) {
    callback(new Error('请输入[1,20000]之间的数字'));
  } else {
    callback();
  }
}

//验证数字输入框最大数值,32767
export function checkMaxVal(rule, value,callback) {
  if (value < 0 || value > 32767) {
    callback(new Error('请输入[0,32767]之间的数字'));
  } else {
    callback();
  }
}
//验证是否1-99之间
export function isOneToNinetyNine(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[1-9][0-9]{0,1}$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数，值为【1,99】'));
      } else {
        callback();
      }
    }
  }, 0);
}

// 验证是否整数
export function isInteger(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    }
  }, 0);
}

// 验证是否整数,非必填
export function isIntegerNotMust(rule, value, callback) {
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    }
  }, 1000);
}

// 验证是否是[0-1]的小数
export function isDecimal(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入[0,1]之间的数字'));
    } else {
      if (value < 0 || value > 1) {
        callback(new Error('请输入[0,1]之间的数字'));
      } else {
        callback();
      }
    }
  }, 100);
}

// 验证是否是[1-10]的小数,即不可以等于0
export function isBtnOneToTen(rule, value, callback) {
  if (typeof value == 'undefined') {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数，值为[1,10]'));
    } else {
      if (!(value == '1' || value == '2' || value == '3' || value == '4' || value == '5' || value == '6' || value == '7' || value == '8' || value == '9' || value == '10')) {
        callback(new Error('请输入正整数，值为[1,10]'));
      } else {
        callback();
      }
    }
  }, 100);
}
// 验证是否是[1-100]的小数,即不可以等于0
export function isBtnOneToHundred(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入整数，值为[1,100]'));
    } else {
      if (value < 1 || value > 100) {
        callback(new Error('请输入整数，值为[1,100]'));
      } else {
        callback();
      }
    }
  }, 100);
}
// 验证是否是[0-100]的小数
export function isBtnZeroToHundred(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入[1,100]之间的数字'));
    } else {
      if (value < 0 || value > 100) {
        callback(new Error('请输入[1,100]之间的数字'));
      } else {
        callback();
      }
    }
  }, 100);
}

// 验证端口是否在[0,65535]之间
export function isPort(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (value == '' || typeof(value) == undefined) {
      callback(new Error('请输入端口值'));
    } else {
      const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入在[0-65535]之间的端口值'));
      } else {
        callback();
      }
    }
  }, 100);
}
// 验证端口是否在[0,65535]之间，非必填,isMust表示是否必填
export function isCheckPort(rule, value, callback) {
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (value == '' || typeof(value) == undefined) {
      //callback(new Error('请输入端口值'));
    } else {
      const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入在[0-65535]之间的端口值'));
      } else {
        callback();
      }
    }
  }, 100);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}
/*保留2为小数*/
export function validatetoFixedNew(str) {
  return str ;
}
/* 验证key*/
// export function validateKey(str) {
//     var reg = /^[a-z_\-:]+$/;
//     return reg.test(str);
// }

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

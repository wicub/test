function isEmpty(val){
  switch (typeof(val)){
    case 'string':
      return $.trim(val).length == 0 ? true : false;
      break;
    case 'number':
      return val == 0;
      break;
    case 'object':
      return val == null;
      break;
    case 'array':
      return val.length == 0;
      break;
    default:
      return true;
  }
}
function isNumber(val){
  var reg = /^[\d|\.|,]+$/;
  return reg.test(val);
}

function isInt(val){
  if (val === ""){
    return false;
  }
  var reg = /\D+/;
  return !reg.test(val);
}

function isEmail(email){
  var reg1 = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
  return reg1.test(email);
}

function isTel(tel){
  var reg = /^[\d|\-|\s|\_]+$/; //只允许使用数字-空格等
  return reg.test( tel );
}

function isTime(val){
  var reg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;
  return reg.test(val);
}
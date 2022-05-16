const mongoose = require('mongoose')

const isvalid = (value) => {
  if (typeof value != 'string'){return false}
     
  if (typeof value === 'undefined' || typeof value === null){return false}
      
  if (typeof value === 'string' && value.trim().length == 0){return false}
     
  return true
}

const isValidEmail = function(email) {
    return  (/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))
  }

  const isValidPhone = function(phone){
    return (/^[6-9]\d{9}$/.test(phone))
}

const isValidObjectId= function(ObjectId){
  return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidSize = function (title) {
  return ["S", "XS","M","X", "L","XXL", "XL"].indexOf(title) !== -1
}

const isValidArray = function (object){
  if (typeof (object) === "object") {
      object = object.filter(x => x.trim())
      if (object.length == 0) {
          return false;
      }
      else {return true;}
      }
    }
  
    const validForEnum = function (value) {
      let enumValue = ["S", "XS", "M", "X", "L", "XXL", "XL"]
      for (let x of value) {
          if (enumValue.includes(x) == false) {
              return false
          }
      }
      return true;
  }

  const validPinCode = function(value){
    return /^[1-9][0-9]{5}$/.test(value)
  }
module.exports.isvalid = isvalid
module.exports.isValidEmail = isValidEmail
module.exports.isValidPhone=isValidPhone
module.exports.isValidObjectId = isValidObjectId
module.exports.isValidArray=isValidArray
module.exports.isValidSize=isValidSize
module.exports.validForEnum=validForEnum
module.exports.validPinCode=validPinCode

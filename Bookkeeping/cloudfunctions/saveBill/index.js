// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// const bills = db.collection('bills');

// 云函数入口函数
exports.main = async(event, context) => {
  console.log(event);
  var billInOut = event.billInOut;
  var billDate = event.billDate;
  var billAccount = event.billAccount;
  var billType = event.billType;
  var billMark = event.billMark;
  var billTime = event.billTime;
  var billMoney = event.billMoney;
  var billWeekDay = event.billWeekDay;

  db.collection('bills').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        billInOut: billInOut,
        billDate: billDate,
        billAccount: billAccount,
        billType: billType,
        billMark: billMark,
        billTime: billTime,
        billMoney: billMoney,
        billWeekDay: billWeekDay
      }
    })
    .then(res => {
      console.log(res);
      return res;
    })
    .catch(err=>{
      console.error(err);
      return err;
    })

}
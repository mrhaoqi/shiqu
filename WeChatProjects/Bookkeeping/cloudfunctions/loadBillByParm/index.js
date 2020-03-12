// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const _ = db.command

  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID;

  const curDate = event.curDate;

  const billId = event.billId;

  const year = event.year;
  const month = event.month;
  const inOutAccount = event.inOutAccount;
  const inType = event.inType;
  const outType = event.outType;

  const pageNum = event.pageNum
  const pageLimit = event.pageLimit




  console.log(billId, 'billId')
  console.log(curDate, 'curDate')
  console.log(year, 'year')
  console.log(month, 'month')
  console.log(inOutAccount)
  console.log(inType)
  console.log(outType)
  console.log(pageNum, 'pageNum')
  console.log(pageLimit, 'pageLimit')

  var billTypeParm = []
  if (typeof(inType) != "undefined") {
    billTypeParm.concat(inType)
  }
  if (typeof(outType) != "undefined") {
    billTypeParm.concat(outType)
  }

  console.log(billTypeParm)

  const bills = db.collection('bills')

  try {
    if (typeof(curDate) != "undefined") {
      return await bills.where({
        _openid: openid,
        billDate: curDate
      }).orderBy('billTime', 'desc').get()
    } else {
      var skipNum = 0
      var limitNum = 999999999
      if (typeof(pageNum) != "undefined" && typeof(pageLimit) != "undefined") {
        skipNum = (pageNum - 1) * pageLimit
        limitNum = pageLimit
      }
      var parm = {
        _openid: openid
      }
      if (typeof(billId) != "undefined") {
        parm["_id"] = billId
      }
      if (typeof(year) != "undefined") {
        parm["billYear"] = _.in(year)
      }
      if (typeof(month) != "undefined") {
        parm["billMonth"] = _.in(month)
      }
      if (typeof(inOutAccount) != "undefined") {
        parm["billAccount"] = _.in(inOutAccount)
      }
      if (billTypeParm.length > 0) {
        parm["billType"] = _.in(billTypeParm)
      }
      console.log(parm)

      return await bills.where(parm)
        .orderBy('billYear', 'desc')
        .orderBy('billMonth', 'desc')
        .orderBy('billDay', 'desc')
        .orderBy('billTime', 'desc')
        .skip(skipNum)
        .limit(limitNum) // 限制返回数量
        .get()


    }
  } catch (e) {
    console.error(e)
  }
}
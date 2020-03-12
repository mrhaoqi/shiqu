// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID;

  const inOut = event.inOut;

  console.log(openid)
  console.log(inOut)

  try {
    return await db.collection('billType').where({
      _openid: openid,
      billTypeInOut: inOut
    }).orderBy('_id', 'desc').get()
  } catch (e) {
    console.error(e)
  }
}
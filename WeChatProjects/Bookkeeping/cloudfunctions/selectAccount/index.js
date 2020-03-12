// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID;
  console.log(openid)

  try {
    return await db.collection('account').where({
      _openid: openid
    }).orderBy('_id', 'desc').get()
  } catch (e) {
    console.error(e)
  }
}
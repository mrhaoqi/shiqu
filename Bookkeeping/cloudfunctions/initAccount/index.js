// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const accounts = [{
    accountName: '余额宝',
    accountMoney: '0.00'
  }, {
    accountName: '支付宝零钱',
    accountMoney: '0.00'
  }, {
    accountName: '微信零钱',
    accountMoney: '0.00'
  }, {
    accountName: '现金',
    accountMoney: '0.00'
  }]

  for (var i = 0; i < accounts.length; ++i) {
    await db.collection('account').add({
      // data 字段表示需新增的 JSON 数据
      data: accounts[i]
    })
  }

}
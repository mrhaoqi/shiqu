// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//引入reques-promise包
var rp = require('request-promise');

// 云函数入口函数
exports.main = async (event, context) => {

  return rp(`https://api.apiopen.top/getJoke?page=${event.page}&count=${event.count}&type=text`)
    .then(function (res) {
      console.log(res);
      return res;
    })
    .catch(function (err) {
      console.error(err);
    });
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

const userCollection = db.collection('user');

// 云函数入口函数
exports.main = async (event, context) => {
 try{
   return await userCollection.where({
     name: '李红',
     age: 20
   }).remove();
 }catch(e){
   console.log(e);
 }
}
// pages/cloud/cloud.js
const db = wx.cloud.database();
const usercollection = db.collection('user');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[]

  },
  insertdata:function(){
    // db.collection('user').add({
    //   data:{
    //     name:'王五',
    //     age:19
    //   },
    //   success:res=>{
    //     console.log(res);
    //   },
    //   fail:err=>{
    //     console.log(err);
    //   }
    // })

    //promise写法
    db.collection('user').add({
      data:{
        name: '李红',
        age:20
      }
    }).then(res=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    })
  },
  deletedata: function () {
    usercollection.doc('890198e15d3bf24503dd296c79382ef4').remove().then(res=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    })
  },
  updatedata: function () {
    usercollection.doc('26b301645d3bf24903dc6a0c51d0996e').update({
      data:{name:'李必'}
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })

  },
  selectdata: function () {
    usercollection.where({
      name:'李红'
    }).get().then(res=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    })
  },
  runsum:function(){
    wx.cloud.callFunction({
      name:'sum',
      data:{
        a:1,
        b:2
      }
    }).then(res=>{
      console.log(res.result.sum);
    }).catch(err=>{
      console.log(err);
    })
  },
  getCurUserOpenID:function(){
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },
  batchDelete:function(){
    wx.cloud.callFunction({
      name: 'batchDelete'
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },
  uploadImg:function(){
    wx.chooseImage({
      count: 1,//最多9
      sizeType: ['original', 'compressed'],//原图、压缩
      sourceType: ['album', 'camera'],//相册、拍摄
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        wx.cloud.uploadFile({
          cloudPath:new Date().getTime()+'.png',
          filePath: tempFilePaths[0]
        }).then(res=>{
          console.log(res.fileID);
          db.collection('image').add({
            data:{
              fileID: res.fileID
            }
          }).then(res=>{
            console.log(res);
            
          }).catch(err=>{
            console.log(err);
          })
        }).catch(err=>{
          console.log(err)
        })
      }
    })

  },
  getImg:function(){
    wx.cloud.callFunction({
      name: 'login'
    }).then(res=>{
      db.collection('image').where({
        _openid:res.result._openid
      }).get().then(res2=>{
        console.log(res2);
        this.setData({
          images:res2.data
        });
        console.log(this.data.images);
      })
    })
  },
  downloadImg: function(event){
    wx.cloud.downloadFile({
      fileID: event.target.dataset.fileid,
      success: res => {
        console.log(res.tempFilePath);
        //保存图片到手机相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功'
            })
          }
        })
      },
      fail:err=>{
        console.log(err);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
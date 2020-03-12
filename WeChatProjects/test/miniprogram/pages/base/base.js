// pages/base/base.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:'hello world',
    img:'/images/code-func-sum.png',
    arr:['aa','bb','cc','dd'],
    list:[
      {
        name:'zhangsan',
        age:18
      },{
        name:'lisi',
        age:19
      }, {
        name: 'wangwu',
        age: 20
      }
    ],
    isLogin:false,
    countNum:0

  },

  onTapHandler:function(){
    // this.data.countNum++;
    this.setData({
      countNum:this.data.countNum+1
    });
  },
  onTapBoxHandler: function (event){
    console.info('box tap')
    console.info(event)
    console.info(event.target.dataset.id)
  },
  onTapChildHandler:function(){
    console.info('child tap')
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
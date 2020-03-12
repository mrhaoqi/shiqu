// miniprogram/pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: []
  },

  loadData: function() {
    wx.cloud.callFunction({
      name: 'movielst',
      data: {
        "page": this.data.movieList.length / 10 + 1,
        "count": 10
      }
    }).then(res => {
      console.log(res);
      this.setData({
        movieList: this.data.movieList.concat(JSON.parse(res.result).result)
      });
    }).catch(err => {
      console.log(err);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title: '加载中...',

    })
    this.loadData();
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
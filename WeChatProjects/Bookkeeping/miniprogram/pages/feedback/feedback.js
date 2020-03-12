// miniprogram/pages/zichan/zichan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yearColumns: ['2018', '2019'],

    monthChecked: true,
    monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    monthResult: [],

    accountChecked: false,
    accountList: ['微信', '支付宝余额宝', '支付宝余额', '花呗', '信用卡A'],
    accountResult: [],

    outMoneyChecked: false,
    outMoneyList: ['吃饭', '衣服', '房租', '公共交通', '旅行'],
    outMoneyResult: [],

    inMoneyChecked: false,
    inMoneyList: ['奖金', '工资', '基金', '股票', '退款', '工资', '基金', '股票'],
    inMoneyResult: []
  },
  doFilter:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  //年份picker变化
  onYearChange(event) {
    const { picker, value, index } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
  },

  //月份筛选开关
  onMonthCheckedChange(event) {
    // 需要手动对 checked 状态进行更新
    console.log(event.detail)
    this.setData({ monthChecked: event.detail });
  },
  //月份多选
  onMonthChange(event) {
    console.log(event.detail)
    this.setData({
      monthResult: event.detail
    });
  },

  //账户名称筛选开关
  onAccountCheckedChange(event) {
    // 需要手动对 checked 状态进行更新
    console.log(event.detail)
    this.setData({ accountChecked: event.detail });
  },
  //账户名称多选
  onAccountChange(event) {
    console.log(event.detail)
    this.setData({
      accountResult: event.detail
    });
  },

  //支出类型筛选开关
  onOutMoneyCheckedChange(event) {
    // 需要手动对 checked 状态进行更新
    console.log(event.detail)
    this.setData({ outMoneyChecked: event.detail });
  },
  //支出类型多选
  onOutMoneyChange(event) {
    console.log(event.detail)
    this.setData({
      outMoneyResult: event.detail
    });
  },

  //收入类型筛选开关
  onInMoneyCheckedChange(event) {
    // 需要手动对 checked 状态进行更新
    console.log(event.detail)
    this.setData({ inMoneyChecked: event.detail });
  },
  //收入类型多选
  onInMoneyChange(event) {
    console.log(event.detail)
    this.setData({
      inMoneyResult: event.detail
    });
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

    wx.stopPullDownRefresh();
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
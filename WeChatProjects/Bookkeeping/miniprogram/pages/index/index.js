// miniprogram/pages/index/index.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenGetUserBtn: true,
    active: 0,
    billTypes: [{
        billTypeInOut: '支出',
        billTypeName: '购物'
      },
      {
        billTypeInOut: '支出',
        billTypeName: '交通'
      },
      {
        billTypeInOut: '支出',
        billTypeName: '话费'
      },
      {
        billTypeInOut: '支出',
        billTypeName: '房租'
      },
      {
        billTypeInOut: '收入',
        billTypeName: '工资'
      },
      {
        billTypeInOut: '收入',
        billTypeName: '奖金'
      },
      {
        billTypeInOut: '收入',
        billTypeName: '退款'
      }
    ],
    accounts: [{
      accountName: '微信零钱',
      accountMoney: '0.00'
    },{
      accountName: '银行卡A',
      accountMoney: '0.00'
    },{
      accountName: '余额宝',
      accountMoney: '0.00'
    }, {
      accountName: '支付宝零钱',
      accountMoney: '0.00'
    },  {
      accountName: '现金',
      accountMoney: '0.00'
    }],
    openid: '',
    credits: [{
      accountName: '花呗',
      accountMoney: '0.00'
    }, {
      accountName: '京东白条',
      accountMoney: '0.00'
    }, {
      accountName: '信用卡A',
      accountMoney: '0.00'
    }],
  },
  nextStep() {
    if (this.data.active >= 4) {
      this.setData({
        hiddenGetUserBtn: false,
        active: ++this.data.active
      });
    } else {
      this.setData({
        active: ++this.data.active
      });
    }
  },
  onGetUserInfo: function(e) {
    console.log(e.detail.userInfo, 99)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;

      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'countuser'
      }).then(res => {
        console.log(res.result.total, 'countuser')
        if (res.result.total == 0) {//用户表没有这个openID，第一次授权
          //插入登录的用户的相关信息到数据库
          wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'login',
            // 传递给云函数的event参数
            data: {}
          }).then(res => {
            console.log(res)
            this.setData({
              openid: res.result.openid
            })
          }).catch(err => {
            // handle error
          })
          //插入登录的用户的相关配置
          for (var i = 0; i < this.data.billTypes.length; ++i) {
            db.collection('billType').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                billTypeInOut: this.data.billTypes[i].billTypeInOut,
                billTypeName: this.data.billTypes[i].billTypeName
              }
            })
          }

          for (var i = 0; i < this.data.accounts.length; ++i) {
            db.collection('account').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                accountName: this.data.accounts[i].accountName,
                accountMoney: this.data.accounts[i].accountMoney
              }
            })
          }

          for (var i = 0; i < this.data.credits.length; ++i) {
            db.collection('credit').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                accountName: this.data.credits[i].accountName,
                accountMoney: this.data.credits[i].accountMoney
              }
            })
          }
        }

      })

      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: '/pages/zhangben/zhangben'
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        console.log(res, 1);

        console.log(res.authSetting['scope.userInfo'], 2);
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              console.log(res, 3);
              //从数据库获取用户信息
              // that.queryUsreInfo();
              //用户已经授权过
              wx.switchTab({
                url: '/pages/zhangben/zhangben'
              })
            }
          });
        }
      }
    })

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

    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
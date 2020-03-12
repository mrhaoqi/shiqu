// miniprogram/pages/shezhi/shezhi.js
import Dialog from 'vant-weapp/dialog/dialog';
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    whereMoneyCredit: '', //信用额度
    whereMoneyAccount: '', //账户资产
    whereMoneyCreditColumns: [],
    whereMoneyAccountColumns: [],
    outBillTypeList: [],
    inBillTypeList: [],
    isreadonly: true,
    activeNames: '0',
    billTypeAddPopupShow: false,
    whereMoneyAddPopupShow: false,
    newBillType: '',
    inOut: '', //支出out/收入in
    creditAccount: '', //信用credit、账户account
    whereMoneyWhere: '',
    whereMoneyMoney: ''
  },
  deleteBillType:function(e){
    var len_out = this.data.outBillTypeList.length
    var len_in = this.data.inBillTypeList.length
    var billTypeInOut = e.target.dataset.inout;
    if (billTypeInOut == 'out' && len_out == 1) {
      Dialog.alert({
        message: '至少保留一个类型'
      });
      return;
    }
    if (billTypeInOut == 'in' && len_in == 1 ) {
      Dialog.alert({
        message: '至少保留一个类型'
      });
      return;
    }
    var billTypeId = e.target.dataset.id; 
    db.collection('billType').doc(billTypeId).remove()
      .then(res => {
        if (billTypeInOut=='in'){
          this.loadInBillType()
        }
        if (billTypeInOut == 'out') {
          this.loadOutBillType()
        }
        console.log(res)
        wx.showToast({
          title: res.errMsg,
        })
      })
      .catch(err => {
        console.error(err)
      })
  },
  deleteAccount: function(e) {
    var len = this.data.whereMoneyAccountColumns.length
    if (len == 1) {
      Dialog.alert({
        message: '至少保留一个账户'
      });
      return;
    }
    var accountId = e.target.dataset.id;
    db.collection('account').doc(accountId).remove()
      .then(res => {
        this.loadAccount()
        console.log(res)
        wx.showToast({
          title: res.errMsg,
        })
      })
      .catch(err => {
        console.error(err)
      })
  },
  deleteCredit: function (e) {
    var len = this.data.whereMoneyCreditColumns.length
    if (len == 1) {
      Dialog.alert({
        message: '至少保留一个账户'
      });
      return;
    }
    var creditId = e.target.dataset.id;
    db.collection('credit').doc(creditId).remove()
      .then(res => {
        this.loadCredit()
        console.log(res)
        wx.showToast({
          title: res.errMsg,
        })
      })
      .catch(err => {
        console.error(err)
      })
  },
  whereMoneyAdd: function(e) {
    var btnCreditAccount = e.target.dataset.creditaccount;
    this.setData({
      whereMoneyAddPopupShow: true,
      creditAccount: btnCreditAccount
    });
  },
  billTypeAdd: function(e) {
    var btnInOut = e.target.dataset.inout;
    console.log(e, 1)
    this.setData({
      billTypeAddPopupShow: true,
      inOut: btnInOut == 'in' ? '收入' : '支出'
    });
  },
  closeAddWhereMoney: function() {
    this.setData({
      whereMoneyAddPopupShow: false
    });
  },
  closeAddNewBillType: function() {
    this.setData({
      billTypeAddPopupShow: false
    });
  },
  // 新账户资产、信用资产文本框
  onNewWhereMoneyWhereChange: function(event) {
    // event.detail 为当前输入的值 账户名称
    this.setData({
      whereMoneyWhere: event.detail
    });
  },
  onNewWhereMoneyMoneyChange: function(event) {
    // event.detail 为当前输入的值 账户余额、信用额度
    this.setData({
      whereMoneyMoney: event.detail
    });
  },
  //确认新建资产
  okAddWhereMoney: function() {
    var creditAccountTmp = this.data.creditAccount; //信用credit、账户account
    var newWhereMoney = {
      name: this.data.whereMoneyWhere,
      money: this.data.whereMoneyMoney
    };
    console.log(newWhereMoney, 'lqw')
    if ("credit" == creditAccountTmp) {

      db.collection('credit').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          accountName: this.data.whereMoneyWhere,
          accountMoney: this.data.whereMoneyMoney
        }
      }).then(res => {

        this.loadCredit();
        this.setData({
          whereMoneyCreditColumns: this.data.whereMoneyCreditColumns,
          whereMoneyAddPopupShow: false,
          whereMoneyWhere: '',
          whereMoneyMoney: ''
        });

        wx.showToast({
          title: '添加成功',
        })
      }).catch(err => {
        wx.showToast({
          title: '添加失败',
        })
      })
    } else if ("account" == creditAccountTmp) {
      db.collection('account').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          accountName: this.data.whereMoneyWhere,
          accountMoney: this.data.whereMoneyMoney
        }
      }).then(res => {
        this.loadAccount();
        this.setData({
          whereMoneyAddPopupShow: false,
          whereMoneyWhere: '',
          whereMoneyMoney: ''
        });

        wx.showToast({
          title: '添加成功',
        })
      }).catch(err => {
        wx.showToast({
          title: '添加失败',
        })
      })


    } else {
      console.error("WRONG credit / account...")
      this.setData({
        whereMoneyAddPopupShow: false,
        whereMoneyWhere: '',
        whereMoneyMoney: ''
      });
    }

  },
  //新账单类型文本框
  onNewBillTypeChange: function(event) {
    // event.detail 为当前输入的值
    console.log(event.detail, 2);
    this.setData({
      newBillType: event.detail
    });
  },
  //新类型增加确认按钮
  okAddNewBillType: function(e) {
    var btnInOut = this.data.inOut;
    console.log(btnInOut, 3)
    var newBillTypeTemp = this.data.newBillType;
    db.collection('billType').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        billTypeName: newBillTypeTemp,
        billTypeInOut: btnInOut
      }
    }).then(res => {
      wx.showToast({
        title: '添加成功',
      })
    }).catch(err => {
      wx.showToast({
        title: '添加失败',
      })
    })

    if ("收入" == btnInOut) {
      this.setData({
        newBillType: '',
        billTypeAddPopupShow: false
      });
      this.loadInBillType()
    } else if ("支出" == btnInOut) {
      this.setData({
        newBillType: '',
        billTypeAddPopupShow: false
      });
      this.loadOutBillType()
    } else {
      console.error("WRONG IN / OUT...")
    }
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  onLongTap: function() {
    this.setData({
      isreadonly: false
    });
  },
  gotoXinyong: function() {
    wx.navigateTo({
      url: '../xinyong/xinyong',
    })
  },
  gotoZichan: function() {
    wx.navigateTo({
      url: '../zichan/zichan',
    })
  },

  loadInBillType: function () {
    wx.cloud.callFunction({
      name: 'selectBillType',
      data:{
        inOut:'收入'
      }
    }).then(res => {
      console.log(res, 'loadInBillType')
      this.setData({
        inBillTypeList: res.result.data
      })
      return res.result.data
    }).catch(err => {
      // handle error
      return null
    })
  }, 
  loadOutBillType: function () {
    wx.cloud.callFunction({
      name: 'selectBillType',
      data: {
        inOut: '支出'
      }
    }).then(res => {
      console.log(res, 'loadOutBillType')
      this.setData({
        outBillTypeList: res.result.data
      })
      return res.result.data
    }).catch(err => {
      // handle error
      return null
    })
  },
  loadAccount: function() {
    wx.cloud.callFunction({
      name: 'selectAccount'
    }).then(res => {
      console.log(res, 'selectAccount')
      this.setData({
        whereMoneyAccountColumns: res.result.data
      })
      return res.result.data
    }).catch(err => {
      // handle error
      return null
    })
  },
  loadCredit: function() {
    wx.cloud.callFunction({
      name: 'selectCredit'
    }).then(res => {
      console.log(res, 'selectCredit')
      this.setData({
        whereMoneyCreditColumns: res.result.data
      })
    }).catch(err => {
      // handle error
      return null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadAccount()
    this.loadCredit()
    this.loadInBillType()
    this.loadOutBillType()
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
    this.onReady()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.onReady()
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
    wx.showToast({
      title: '刷新~',
    })
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
    return {
      title: "十区记账本",
      path: "pages/index/index",
      imageUrl: "../../images/zhangben.png"
    }
  },
  //swipeCell关闭函数
  onClose(event) {
    const {
      position,
      instance
    } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        instance.close();
        break;
      case 'outside':
        instance.close();
        break;
    }
  }

})
// miniprogram/pages/zhangben/zhangben.js
import Dialog from 'vant-weapp/dialog/dialog';

import Toast from 'vant-weapp/toast/toast';

const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    focusMoney:false,
    creditQkList: [],
    allQK: 0,

    actionSheetShow: false,
    isExpend: true, //false、true
    billType: "支出", //收入、支出
    billTypeColor: "#1989FA", //默认支出蓝色
    currentDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return `${value}日`;
    },
    picktimestamp: '',
    currentDateStr: new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日",
    curMonthDayStr: (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日",
    curWeekDayStr: '',
    billMoney: '',
    billMark: '',
    editBillId: '',

    todayAllIn: '',
    todayAllOut: '',
    todayBillList: [],


    monthOut: 0,
    monthIn: 0,

    whereMoneyCreditColumns: [],
    whereMoneyAccountColumns: [],
    whereMoneyColumns: [],
    whereMoney: '',
    whereMoneyDefaultIndex: 0,

    outBillTypeList: [],
    inBillTypeList: [],
    billTypeList: [],
    billTypeSelected: '',

    showIndex: 0,
    newBillType: '',
    qiankuanshow: false,
    billTypeAddPopupShow: false,
    whereMoneyPopupShow: false,
    datetimePickerPopupShow: false,
    hideAddCycleBtn: true,
    qiankuanActiveNames: ['0']
  },
  showLongToast: function (e) {
    var longBillMark = e.target.dataset.mark;
    Toast(longBillMark);
  },
  onqiankuanActiveChange: function(event) {
    this.setData({
      qiankuanActiveNames: event.detail
    });
  },
  onBillMarkChange: function(event) {
    this.setData({
      billMark: event.detail
    });
  },
  onqiankuanClose: function() {
    this.setData({
      qiankuanshow: false
    });
  },
  showQiankuanList: function() {

    console.log(this.data.whereMoneyCreditColumns, 88888888)
    var tmp = this.data.whereMoneyCreditColumns;
    var creditQkMap = new Map();
    for (var i = 0; i < tmp.length; ++i) {
      creditQkMap.set(tmp[i].accountName, 0)
    }
    console.log(creditQkMap, 'creditQkMap111')
    //所有本月账单
    var curMonth = (new Date().getMonth() + 1) + "月";
    var curYear = new Date().getFullYear() + "年";
    var tmpBillArr;
    wx.cloud.callFunction({
      name: 'loadBillByParm',
      data: {
        year: [curYear],
        month: [curMonth]
      }
    }).then(res => {
      tmpBillArr = res.result.data;
      var allqiankuan = 0
      for (var i = 0; i < tmpBillArr.length; ++i) {
        var billTmp = tmpBillArr[i];
        if (creditQkMap.has(billTmp.billAccount)) {
          if (billTmp.billInOut == '支出') {
            creditQkMap.set(billTmp.billAccount, creditQkMap.get(billTmp.billAccount) + Number(billTmp.billMoney))
          }
          if (billTmp.billInOut == '收入') {
            creditQkMap.set(billTmp.billAccount, creditQkMap.get(billTmp.billAccount) - Number(billTmp.billMoney))
          }
        }
      }
      var creditQkMapObjArr = []
      var totalQk = 0
      for (let [k, v] of creditQkMap) {
        totalQk += v
        creditQkMapObjArr.push({
          'name': k,
          'qk': v
        })
      }
      console.log(JSON.stringify(creditQkMapObjArr), totalQk)

      this.setData({
        creditQkList: creditQkMapObjArr,
        allQK: totalQk
      })
    })
    this.setData({
      qiankuanshow: true
    });
  },
  onDeleteBill: function(e) {
    var billId = e.target.dataset.id;
    db.collection('bills').doc(billId).remove()
      .then(res => {
        this.loadTodayBills();
        console.log(res)
        wx.showToast({
          title: '已删除',
        })
      })
      .catch(err => {
        console.error(err)
      })
  },
  //记一笔确认
  okNewBill: function() {
    if (this.data.billMoney == '') {
      Dialog.alert({
        message: '"金额"不能为空'
      });
      return;
    }
    console.log(this.data.editBillId,'this.data.editBillId')
    if(this.data.editBillId!=''){
      var editBillIdTmp = this.data.editBillId
      var pickDateTmp = this.data.currentDateStr
      var curDate = new Date(); //获取系统当前时间
      db.collection('bills').doc(editBillIdTmp).update({
        data: {
          billInOut: this.data.billType,
          billDate: pickDateTmp,
          billYear: pickDateTmp.substring(0, 5),
          billMonth: pickDateTmp.substring(pickDateTmp.indexOf('年') + 1, pickDateTmp.indexOf('月') + 1),
          billDay: pickDateTmp.substring(pickDateTmp.indexOf('月') + 1, pickDateTmp.length),
          billAccount: this.data.whereMoney,
          billType: this.data.billTypeSelected,
          billMark: this.data.billMark == '' ? '因为' + this.data.billTypeSelected + this.data.whereMoney + this.data.billType + '￥' + parseFloat(this.data.billMoney).toFixed(2) : this.data.billMark,
          billTime: curDate.getHours() + ':' + (curDate.getMinutes() <= 9 ? '0' + curDate.getMinutes() : curDate.getMinutes()),
          billMoney: parseFloat(this.data.billMoney).toFixed(2),
          billWeekDay: this.data.curWeekDayStr
        }
      })
        .then(res=>{
          this.setData({
            editBillId:'',
            billType: '支出',
            currentDateStr: curDate.getFullYear() + "年" + (curDate.getMonth() + 1) + "月" + curDate.getDate() + "日",
            whereMoney: this.data.whereMoneyColumns[0],
            billMoney: '',
            billTypeSelected: this.data.billTypeList[0],
            billMark: '',
            billTypeColor: "#1989FA",
            currentDate: new Date().getTime(),
            showIndex: 0,
            isExpend: true,
            popupShow: false
          });
          console.log(res);
          this.loadTodayBills();
          wx.showToast({
            title: '修改成功！',
          });
        })
        .catch(err => {
          console.error(err);
          wx.showToast({
            title: '修改失败！',
          });
        });
      return //编辑完，在这里return结束
    }else{
      // 新增，if外下面处理
    }
    var curDate = new Date(); //获取系统当前时间
    console.log(this.data.picktimestamp, "记一笔");
    var pickDateTmp = this.data.currentDateStr
    db.collection('bills').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          billInOut: this.data.billType,
          billDate: pickDateTmp,
          billYear: pickDateTmp.substring(0, 5),
          billMonth: pickDateTmp.substring(pickDateTmp.indexOf('年') + 1, pickDateTmp.indexOf('月') + 1),
          billDay: pickDateTmp.substring(pickDateTmp.indexOf('月') + 1, pickDateTmp.length),
          billAccount: this.data.whereMoney,
          billType: this.data.billTypeSelected,
          billMark: this.data.billMark == '' ? '因为' + this.data.billTypeSelected + this.data.whereMoney + this.data.billType + '￥' + parseFloat(this.data.billMoney).toFixed(2) : this.data.billMark,
          billTime: curDate.getHours() + ':' + (curDate.getMinutes() <= 9 ? '0' + curDate.getMinutes() : curDate.getMinutes()),
          billMoney: parseFloat(this.data.billMoney).toFixed(2),
          billWeekDay: this.data.curWeekDayStr
        }
      })
      .then(res => {
        this.setData({
          billType: '支出',
          currentDateStr: curDate.getFullYear() + "年" + (curDate.getMonth() + 1) + "月" + curDate.getDate() + "日",
          whereMoney: this.data.whereMoneyColumns[0],
          billMoney: '',
          billTypeSelected: this.data.billTypeList[0],
          billMark: '',
          billTypeColor: "#1989FA",
          currentDate: new Date().getTime(),
          showIndex: 0,
          isExpend: true,
          popupShow: false
        });
        console.log(res);
        this.loadTodayBills();
        wx.showToast({
          title: '新增成功！',
        });
      })
      .catch(err => {
        console.error(err);
        wx.showToast({
          title: '新增失败！',
        });
      });


  },
  onNewBillTypeChange: function(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      newBillType: event.detail
    });
  },
  billTypeAdd: function() {
    this.setData({
      billTypeAddPopupShow: true
    });
  },
  closeAddNewBillType: function() {
    this.setData({
      billTypeAddPopupShow: false
    });
  },
  okAddNewBillType: function() {
    this.setData({
      billTypeList: this.data.billTypeList.concat([this.data.newBillType]),
      newBillType: '',
      billTypeAddPopupShow: false
    });
    console.log(this.data.billTypeList);
  },
  onBillTypeItemTap: function(e) {
    var id = e.currentTarget.dataset.id;
    var selected = e.currentTarget.dataset.selected;
    console.log(selected);
    this.setData({
      showIndex: id,
      billTypeSelected: selected
    });

  },
  onWhereMoneyTagTap() {
    this.setData({
      whereMoneyPopupShow: true
    });
  },

  onConfirm(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
    this.setData({
      whereMoney: value,
      whereMoneyPopupShow: false
    });
  },

  onCancel() {
    this.setData({
      whereMoneyPopupShow: false
    });
  },

  onBillMoneyChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      billMoney: event.detail
    });
  },
  onBilllMarkChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      billlMark: event.detail
    });
  },

  openDateTimePicker: function() {
    this.setData({
      datetimePickerPopupShow: true
    });
  },
  /**
   * 获取星期几
   */
  getWeekDay: function(datetime) {
    var weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekdays[datetime.getDay()];
  },
  /**
   * 当日期值变化时触发的事件
   */
  onDateInput: function(event) {
    console.log(event.detail);
    this.setData({
      currentDate: event.detail
    });
  },
  onDateConfirm: function(event) {
    console.log(event.detail, 'timestamp');
    var pickDate = new Date(event.detail);
    console.log(pickDate, 'pickDate');
    console.log(this.getWeekDay(pickDate));
    this.setData({
      picktimestamp: JSON.stringify(event.detail),
      currentDateStr: pickDate.getFullYear() + "年" + (pickDate.getMonth() + 1) + "月" + pickDate.getDate() + "日",
      curWeekDayStr: this.getWeekDay(pickDate),
      datetimePickerPopupShow: false
    });

  },
  onDateCancle: function() {
    this.setData({
      datetimePickerPopupShow: false
    });
  },

  /**
   * 数记一笔表单打开
   */
  openPopup: function(e) {

    // this.onLoad()

    var billId = e.target.dataset.id;
    console.log(billId, 'billId')
    if (typeof(billId) != "undefined") {
      //编辑
      wx.cloud.callFunction({
        name: 'loadBillByParm',
        data: {
          billId: billId
        }
      }).then(res => {
        console.log(res.result.data, '编辑记录')
        var editBill = res.result.data[0]
        var whereMoneyDefaultIndex;
        var tmpWMC = this.data.whereMoneyColumns
        for (let i = 0; i < tmpWMC.length; ++i) {
          if (editBill.billAccount == tmpWMC[i]) {
            whereMoneyDefaultIndex = i
          }
        }
        console.log(whereMoneyDefaultIndex, 'whereMoneyDefaultIndex')
        var formatDate = editBill.billYear.replace('年', '/') + editBill.billMonth.replace('月', '/') + editBill.billDay.replace('日', ' ') + editBill.billTime + ':00'
        console.log(this.data.inBillTypeList, 'this.data.inBillTypeList')
        this.setData({
          billTypeList: editBill.billInOut == '支出' ? this.data.outBillTypeList : this.data.inBillTypeList,
          billTypeSelected: editBill.billType,
          isExpend: editBill.billInOut == '支出' ? true : false,
          billTypeColor: editBill.billInOut == '支出' ? "#1989FA" : "#f44",
          billType: editBill.billInOut,
          whereMoney: editBill.billAccount,
          whereMoneyDefaultIndex: whereMoneyDefaultIndex,
          billMoney: editBill.billMoney,
          currentDateStr: editBill.billDate,
          currentDate: (new Date(formatDate)).getTime(),
          editBillId: editBill._id,
          billMark: editBill.billMark,
          popupShow: true
        });
      })

    } else {
      console.log(this.data.whereMoneyColumns,'this.data.whereMoneyColumns')
      //新增
      this.setData({
        focusMoney:true,
        whereMoney: this.data.whereMoneyColumns[0],
        billTypeList: this.data.outBillTypeList,
        billTypeSelected: this.data.outBillTypeList[this.data.showIndex].billTypeName,
        billMark:'',
        popupShow: true
      });
    }

    // this.setData({
    //   popupShow: true
    // });
  },
  /**
   * 关闭表单
   */
  closePopup: function() {
    this.setData({
      isExpend: true,
      billTypeColor: "#1989FA",
      billType: '支出',
      whereMoney: '',
      whereMoneyDefaultIndex: 0,
      billMoney: '',
      currentDateStr: new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日",
      currentDate: new Date().getTime(),
      editBillId: '',
      billTypeSelected: this.data.outBillTypeList[this.data.showIndex].billTypeName,
      billMark:'',
      popupShow: false
    });
  },
  /**
   * 自定义函数记一笔actionsheet关闭时操作
   */
  popupOnClose() {

  },
  /**
   * 查看更多明细
   */
  checkBillDetails: function() {
    wx.navigateTo({
      url: '../morezhangdan/morezhangdan',
    })
  },
  /**
   * 收支开关变更
   */
  isExpendOnChange: function({
    detail
  }) {
    console.log(detail);
    // 需要手动对 checked 状态进行更新
    this.setData({
      isExpend: detail,
      billType: detail ? "支出" : "收入",
      billTypeColor: detail ? "#1989FA" : "#f44",
      billTypeList: detail ? this.data.outBillTypeList : this.data.inBillTypeList,
      billTypeSelected: detail ? this.data.outBillTypeList[0].billTypeName : this.data.inBillTypeList[0].billTypeName
    });
  },
  loadInBillType: function() {
    wx.cloud.callFunction({
      name: 'selectBillType',
      data: {
        inOut: '收入'
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
  loadOutBillType: function() {
    wx.cloud.callFunction({
      name: 'selectBillType',
      data: {
        inOut: '支出'
      }
    }).then(res => {
      console.log(res, 'loadOutBillType')
      this.setData({
        outBillTypeList: res.result.data,
        billTypeList: res.result.data
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

      var tmp = res.result.data;
      var whereMoneyColumnsTmp = []
      for (var i = 0; i < tmp.length; ++i) {
        whereMoneyColumnsTmp.push(tmp[i].accountName)
      }
      console.log(whereMoneyColumnsTmp, 'whereMoneyColumnsTmp1')
      this.setData({
        whereMoneyAccountColumns: res.result.data
      })
      // loadCredit
      wx.cloud.callFunction({
        name: 'selectCredit'
      }).then(res => {
        console.log(res, 'selectCredit')
        var tmp = res.result.data;
        for (var i = 0; i < tmp.length; ++i) {
          whereMoneyColumnsTmp.push(tmp[i].accountName)
        }
        console.log(whereMoneyColumnsTmp, 'whereMoneyColumnsTmp2')
        this.setData({
          whereMoneyCreditColumns: res.result.data,
          whereMoneyColumns: whereMoneyColumnsTmp
        })
      }).catch(err => {
        // handle error
        return null
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
      var tmp = res.result.data;
      var whereMoneyColumnsTmp = []
      for (var i = 0; i < tmp.length; ++i) {
        whereMoneyColumnsTmp.push(tmp[i].accountName)
      }
      console.log(whereMoneyColumnsTmp, 'whereMoneyColumnsTmp')
      return whereMoneyColumnsTmp
    }).catch(err => {
      // handle error
      return null
    })
  },
  loadTodayBills: function() {

    wx.cloud.callFunction({
      name: 'loadBillByParm',
      data: {
        curDate: new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日"
        // curDate:'2019年8月9日'
      }
    }).then(res => {
      console.log(res.result.data, '123132')
      var tmpBillArr = res.result.data;
      var allIn = 0
      var allOut = 0
      for (var i = 0; i < tmpBillArr.length; ++i) {
        var billTmp = tmpBillArr[i];
        if (billTmp.billInOut == '支出') {
          allIn += Number(billTmp.billMoney)
        }
        if (billTmp.billInOut == '收入') {
          allOut += Number(billTmp.billMoney)
        }
      }
      this.setData({
        curWeekDayStr: this.getWeekDay(new Date()),
        todayAllIn: '' + allIn,
        todayAllOut: '' + allOut,
        todayBillList: tmpBillArr
      })
    }).catch(err => {})
    console.log(this.data.currentDateStr)
    console.log(this.getWeekDay(new Date()))

  },
  loadCurMonthInOutMoney: function() {
    var curMonth = (new Date().getMonth() + 1) + "月";
    var curYear = new Date().getFullYear() + "年";
    //所有本月账单
    var tmpBillArr;
    wx.cloud.callFunction({
      name: 'loadBillByParm',
      data: {
        year: [curYear],
        month: [curMonth]
      }
    }).then(res => {
      console.log(res.result.data, 'loadCurMonthInOutMoney')
      tmpBillArr = res.result.data;
      var allIn = 0
      var allOut = 0
      for (var i = 0; i < tmpBillArr.length; ++i) {
        var billTmp = tmpBillArr[i];
        if (billTmp.billInOut == '支出') {
          allIn += Number(billTmp.billMoney)
        }
        if (billTmp.billInOut == '收入') {
          allOut += Number(billTmp.billMoney)
        }
      }
      this.setData({
        monthOut: allIn,
        monthIn: allOut
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('onLoad')
    this.loadTodayBills()

    this.loadAccount()
    this.loadInBillType()
    this.loadOutBillType()
    this.loadCurMonthInOutMoney()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log(this.data.hideAddCycleBtn, 'onReady')



  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('onShow')
    this.onLoad()
    this.onReady()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('onHide')
    this.setData({
      qiankuanshow: false,
      billTypeAddPopupShow: false,
      whereMoneyPopupShow: false,
      datetimePickerPopupShow: false,
      popupShow: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('onPullDownRefresh')
    this.onLoad()
    this.onReady()
    // wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('onReachBottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log('onShareAppMessage')
  },
  /**
   * 页面滚动监听
   */
  onPageScroll: function(e) {
    console.log(e.scrollTop)


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
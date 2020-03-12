// miniprogram/pages/morezhangdan/morezhangdan.js
import Dialog from 'vant-weapp/dialog/dialog';
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFliterPopup:false,

    yearColumns: ['2018', '2019'],
    yearList: ['2018年', '2019年'],
    yearResult: [],

    monthChecked: false,
    monthList: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    monthResult: [],

    loadmoreTip:'',
    pageSize:10,
    pageNum:1,

    hiddenFilterCycleBtn: false,

  
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
    currentDateStr: new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日",
    datetimePickerPopupShow: false,
    billMoney: '',
    billMark: '',
    whereMoneyPopupShow: false,
    whereMoneyColumns: ['微信零钱', '支付宝余额宝', '花呗', '支付宝余额', '招商信用卡'],
    whereMoney: '',
    billTypeList: ['学习', '吃饭', '购物', '旅行', '充值零钱', '休闲', '娱乐', '人情世故', '美容美妆', '服饰', '服饰1', '化妆品'],
    billTypeSelected: '',
    showIndex: 0,
    billTypeAddPopupShow: false,
    newBillType: '',
    ///////
    scrollTopCurrent: 0, //当前滚动距离
    testarr: [],
    isloading: false,
    ishidden: true,
    recordDateChecked: true,

    preBillList:[],
    billList: []
  },

//筛选
  doFilter:function(){
    this.loadAllBillsByPage(1, this.data.pageSize)
    this.setData({
      pageNum:1,
      showFliterPopup: false
    })
  },
//关闭筛选
  closeFilterPopup:function(){
    this.setData({
      showFliterPopup: false
    })
  },
  //年份多选
  onYearChange(event) {
    console.log(event.detail)
    this.setData({
      yearResult: event.detail
    });
  },
  //月份筛选开关
  onMonthCheckedChange(event) {
    // 需要手动对 checked 状态进行更新
    console.log(event.detail)
    this.setData({
      monthChecked: event.detail
    });
  },
  //月份多选
  onMonthChange(event) {
    console.log(event.detail)
    this.setData({
      monthResult: event.detail
    });
  },

  
  //浮动添加按钮
  tapAddBillBtn: function() {
    //打开记一笔
    this.setData({
      popupShow: true
    });
  },
  //展示过滤弹窗
  showFilterPage: function() {
    this.setData({
      showFliterPopup:true
    })
    // wx.navigateTo({
    //   url: '../feedback/feedback',
    // })
  },
  //删除账单
  onDeleteBill: function(e) {
    var billId = e.target.dataset.id;
    console.log(billId)
    db.collection('bills').doc(billId).remove()
      .then(res => {
        this.loadAllBillsByPage(this.data.pageNum, this.data.pageSize, billId)
        console.log(res)
        wx.showToast({
          title: '已删除'
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
    var curDate = new Date(); //获取系统当前时间
    console.log("记一笔" + this.data.billTypeSelected);
    db.collection('bills').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          billInOut: this.data.billType,
          billDate: this.data.currentDateStr,
          billAccount: this.data.whereMoney,
          billType: this.data.billTypeSelected,
          billMark: this.data.billMark == '' ? '因为' + this.data.billTypeSelected + this.data.whereMoney + this.data.billType + '￥' + this.data.billMoney : this.data.billMark,
          billTime: curDate.getHours() + ':' + (curDate.getMinutes() <= 9 ? '0' + curDate.getMinutes() : curDate.getMinutes()),
          billMoney: this.data.billMoney,
          billWeekDay: this.getWeekDay(curDate)
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
        wx.showToast({
          title: '成功！',
        });
      })
      .catch(err => {
        console.error(err);
        wx.showToast({
          title: '失败！',
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
    wx.showToast({
      title: `选择了'${selected}''`,
    })
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
    var weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    return weekdays[datetime.getDay() - 1];
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
    console.log(event.detail);
    var pickDate = new Date(event.detail);
    console.log(pickDate);
    console.log(this.getWeekDay(pickDate));
    this.setData({
      currentDateStr: pickDate.getFullYear() + "年" + (pickDate.getMonth() + 1) + "月" + pickDate.getDate() + "日",
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
  openPopup: function() {
    this.setData({
      popupShow: true
    });
  },
  /**
   * 关闭表单
   */
  closePopup: function() {
    this.setData({
      popupShow: false
    });
  },
  /**
   * 自定义函数记一笔actionsheet关闭时操作
   */
  popupOnClose() {

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
      billTypeColor: detail ? "#1989FA" : "#f44"
    });
  },
  loadAllBillsByPage: function(pageNum,pageLimit,delBillId) {
    var parm = {
      pageNum: pageNum,
      pageLimit: pageLimit
    }
    console.log(this.data.yearResult,'this.data.yearResult')
    if (this.data.yearResult.length>0){
      parm["year"] = this.data.yearResult
    }
    if (this.data.monthResult.length > 0) {
      parm["month"] = this.data.monthResult
    }
    console.log(parm, 'parm')

    wx.cloud.callFunction({
      name: 'loadBillByParm',
      data: parm
    }).then(res => {
      console.log(res.result.data)
      var returnRes = res.result.data;
      var tmpBillArr = res.result.data;
      console.log(tmpBillArr,'tmpBillArr......')
      if (typeof (delBillId) != "undefined") {//删除在加载
        var thisPreBillList = this.data.preBillList
        for (let i = 0; i < thisPreBillList.length;++i){
          if (thisPreBillList[i]._id == delBillId){
            thisPreBillList.splice(i,1)
          }
        }
        tmpBillArr = thisPreBillList
      }
      if (typeof (delBillId) == "undefined") {//加载
        if (this.data.yearResult.length > 0 || this.data.monthResult.length > 0){
          if (this.data.pageNum == 1) {
          //筛选第一次加载
            this.setData({
              preBillList: tmpBillArr
            })
          }else{
            tmpBillArr = this.data.preBillList.concat(tmpBillArr)
            this.setData({
              preBillList: tmpBillArr
            })
          }
        }else{
          //正常加载
          tmpBillArr = this.data.preBillList.concat(tmpBillArr)
          this.setData({
            preBillList: tmpBillArr
          })
        }
      }

      var yearMonthMap = new Map();
      for (var i = 0; i < tmpBillArr.length; ++i) {
        var yearMonth = tmpBillArr[i].billYear + tmpBillArr[i].billMonth
        if (typeof(yearMonthMap.get(yearMonth)) == "undefined") {
          yearMonthMap.set(yearMonth, [])
        }
        yearMonthMap.get(yearMonth).push(tmpBillArr[i])
      }

      for (let ym of yearMonthMap.keys()) {
        var monthDayhMap = new Map();
        var tmpArr = yearMonthMap.get(ym)
        console.log(ym);
        for (var i = 0; i < tmpArr.length; ++i) {
          var monthDay = tmpArr[i].billMonth + tmpArr[i].billDay
          if (typeof(monthDayhMap.get(monthDay)) == "undefined") {
            monthDayhMap.set(monthDay, [])
          }
          monthDayhMap.get(monthDay).push(tmpArr[i])
        }
        yearMonthMap.set(ym, monthDayhMap)
      }
      console.log(yearMonthMap, 'yearMonthMap');

      let billListTmp = []
      for (let [k, v] of yearMonthMap) {
        let ymobj = Object.create(null);
        ymobj['yearMonth'] = k;
        let mdList = []

        var monthAllIn = 0
        var monthAllOut = 0

        console.log(v,'vvv')

        for (let [kk, vv] of v) {
          let mdobj = Object.create(null);
          mdobj['monthDate'] = kk;
          mdobj['dayBillList'] = vv;
          var dayallIn = 0
          var dayallOut = 0
          var weekDayTmp = ''
          for (var j = 0; j < vv.length; ++j) {
            var billTmp = vv[j]
            if (billTmp.billInOut == '支出') {
              dayallOut += Number(billTmp.billMoney)
              console.log(dayallIn, 'dayallIn')
            }
            if (billTmp.billInOut == '收入') {
              dayallIn += Number(billTmp.billMoney)
              console.log(dayallOut, 'dayallOut')
            }
            weekDayTmp = billTmp.billWeekDay
          }
          monthAllIn += dayallIn
          monthAllOut += dayallOut
          mdobj['weekDay'] = weekDayTmp;
          mdobj['dayInMoney'] = dayallIn;
          mdobj['dayOutMoney'] = dayallOut;
          mdList.push(mdobj);
        }
        ymobj['monthInMoney'] = monthAllIn;
        ymobj['monthOutMoney'] = monthAllOut;
        ymobj['monthBillList'] = mdList;
        billListTmp.push(ymobj)
      }
      console.log(billListTmp, 'billList')
      console.log(this.data.billList, 'billList0')
      console.log(this.data.billList.concat(billListTmp), 'billList1')

      this.setData({
        billList: billListTmp
      })

      return returnRes
      
    }).catch(err => {
      return null;
    })
    console.log(this.data.currentDateStr)
    console.log(this.getWeekDay(new Date()))

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadAllBillsByPage(this.data.pageNum, this.data.pageSize)
    this.setData({
      whereMoney: this.data.whereMoneyColumns[0],
      billTypeSelected: this.data.billTypeList[this.data.showIndex]
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('onready')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('onShow')
    // this.onLoad()
    // this.onReady()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('onHide')
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
    // this.onReachBottom()
    wx.showToast({
      title: "已刷新...",
    });
    wx.stopPullDownRefresh();
  },
  /**
   * 页面滚动监听
   */
  onPageScroll: function(e) {
    // var stc = this.data.scrollTopCurrent;
    // var est = e.scrollTop;
    // console.log((est - stc), est);

    // this.setData({
    //   hiddenFilterCycleBtn: false,
    //   scrollTopCurrent: est
    // });

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(this.data.pageNum, 'this.data.pageNum')
    var parm = {
      pageNum: this.data.pageNum + 1,
      pageLimit: this.data.pageSize
    }
    if (this.data.yearResult.length > 0) {
      parm["year"] = this.data.yearResult
    }
    if (this.data.monthResult.length > 0) {
      parm["month"] = this.data.monthResult
    }

    wx.cloud.callFunction({
      name: 'loadBillByParm',
      data: parm
    }).then(res => {
      console.log(res.result.data.length,'res.result.data')


      if (res.result.data.length > 0) {
        console.log('canload..')
        this.loadAllBillsByPage(this.data.pageNum + 1, this.data.pageSize)
        this.setData({
          pageNum: this.data.pageNum + 1,
          ishidden: false,
          isloading: true,
          loadmoreTip: '加载中...'
        });
      } else {
        console.log("can't load..")
        this.setData({
          ishidden: false,
          isloading: false,
          loadmoreTip: '暂无更多数据'
        });
      }

    })
    
    console.log(`hidden?${this.data.ishidden}--loading?${this.data.isloading}`);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
const app = getApp()
Page({

  data: {
    printName:"",
    printNum:0,
    printKey:"",
    printNumber:"",
    printRemark:"",
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      printName: app.HomeStore.PrintName,
      printNum: app.HomeStore.PrintNum,
      printKey: app.HomeStore.PrintKey,
      printNumber: app.HomeStore.PrintNumber,
      printRemark: app.HomeStore.PrintRemark,
    });
  },
  setPrintName:function(e){
    this.setData({
      printName: e.detail.value
    });
  },
  setPrintNum:function(e){
    this.setData({
      printNum: e.detail.value
    });
  },
  setPrintNumber:function(e){
    this.setData({
      printNumber: e.detail.value
    });
  },
  setPrintKey:function(e){
    this.setData({
      printKey: e.detail.value
    });
  },
  setPrintRemark:function(e){
    this.setData({
      printRemark: e.detail.value
    });
  },
  setOnlickSave:function(){
    var that = this;
    console.log("接口进行");
    var printName = that.data.printName;
    var printNum = that.data.printNum;
    var printKey = that.data.printKey;
    var printNumber = that.data.printNumber;
    var printRemark = that.data.printRemark;
    if (printName.length==0){
      wx.showToast({ title: '请输入打印机名称', icon: 'none', duration: 2000 });
      return false;
    }
    if (printNum.length == 0) {
      wx.showToast({ title: '请输入打印份数', icon: 'none', duration: 2000 });
      return false;
    }
    if (printKey.length == 0) {
      wx.showToast({ title: '请输入打印机KEY', icon: 'none', duration: 2000 });
      return false;
    }
    if (printNumber.length == 0) {
      wx.showToast({ title: '请输入打印机码', icon: 'none', duration: 2000 });
      return false;
    }
    if (printRemark.length == 0) {
      wx.showToast({ title: '请输入打印机备注', icon: 'none', duration: 2000 });
      return false;
    }

    app.request('api/Store/UpdateStorePrint', {
      StoreId: app.HomeStore.Id,
      PrintName: printName,
      PrintKey: printKey,
      PrintNuber: printNumber,
      PrintNum: printNum,
      PrintRemark: printRemark
    }, "POST",
      function (res) {
        console.log("更新状态");
        console.log(res);
        if (res.data.flag) {
          wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
          app.HomeStore.PrintName = printName;
          app.HomeStore.PrintKey = printKey;
          app.HomeStore.PrintNuber = printNumber;
          app.HomeStore.PrintNum = printNum; 
          app.HomeStore.PrintRemark = printRemark;
        } else {
          wx.showToast({ title: '失败', icon: 'none', duration: 2000 });
        }
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      },
      function () {
        wx.showToast({ title: '更新状态失败', icon: 'loading', duration: 2000 });
      })




  }

})
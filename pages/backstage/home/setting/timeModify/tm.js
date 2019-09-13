const app = getApp()
Page({

  data: {
    AMstartDate: '选择日期',
    AMendDate: '选择日期',
    PMstartDate: '选择日期',
    PMendDate: '选择日期',
  },

  bindAMStartDate: function (e) {
    this.setData({
      AMstartDate: e.detail.value
    })
  },
  bindAMEndDate(e) {
    this.setData({
      AMendDate: e.detail.value
    })
  },
  bindPMStartDate: function (e) {
    this.setData({
      PMstartDate: e.detail.value
    })
  },
  bindPMEndDate(e) {
    this.setData({
      PMendDate: e.detail.value
    })
  },
  onLoad: function (options) {
    var that = this;
    console.log("加载");
    var amTimeText = app.HomeStore.amTimeText;
    var pmTimeText = app.HomeStore.pmTimeText;
    if (amTimeText.length>0){
      var amTime = amTimeText.split('-');
      console.log(amTime);
      that.setData({
        AMstartDate: amTime[0],
        AMendDate: amTime[1],
      });
    }
    if (pmTimeText.length > 0) {
      var pmTime = pmTimeText.split('-');
      console.log(pmTime);
      that.setData({
        PMstartDate: pmTime[0],
        PMendDate: pmTime[1],
      });
    }
    
    

  },
  setTiemText:function(){
    var that = this;
    var AMstartDate=that.data.AMstartDate;
    var AMendDate =that.data.AMendDate;
    var PMstartDate =that.data.PMstartDate;
    var PMendDate =that.data.PMendDate;
    console.log(AMstartDate);
    if (AMstartDate =="选择日期"){
      wx.showToast({ title: '请输入上午开始时间', icon: 'none', duration: 2000 });
      return false;
    }
    if (AMendDate == "选择日期") {
      wx.showToast({ title: '请输入上午结束时间', icon: 'none', duration: 2000 });
      return false;
    }
    if (PMstartDate == "选择日期") {
      wx.showToast({ title: '请输入下午开始时间', icon: 'none', duration: 2000 });
      return false;
    }
    if (PMendDate == "选择日期") {
      wx.showToast({ title: '请输入下午结束时间', icon: 'none', duration: 2000 });
      return false;
    }
    app.request('/api/Store/UpdateStoreTime', {
      StoreId: app.HomeStore.Id,
      sBeginTime: AMstartDate,
      sEndTime: AMendDate,
      xBeginTime: PMstartDate,
      xEndTime: PMendDate
    }, "POST",
      function (res) {
        console.log("更新状态");
        console.log(res);
        if (res.data.flag) {
          wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
          app.HomeStore.amTimeText = AMstartDate + ":" + AMendDate;
          app.HomeStore.pmTimeText = PMstartDate + ":" + PMendDate;

        } else {
          wx.showToast({ title: '失败', icon: 'none', duration: 2000 });
        }
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },2000);

      },
      function () {
        wx.showToast({ title: '更新状态失败', icon: 'loading', duration: 2000 });
      })   
  },
  



})
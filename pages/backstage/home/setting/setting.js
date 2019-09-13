const app = getApp()
Page({
  data: {
    HomeStore:{},
  },

  to_modiPwd: function () {
    wx.navigateTo({
      url: '/pages/backstage/home/setting/modifyPwd/mPwd',
    })
  },
  to_shopName:function(){
    wx.navigateTo({
      url: '/pages/backstage/home/setting/modifyName/modifyName',
    })
  },
  to_client: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  switch1Change:function(e){
    console.log(e)
    var IsBusiness = e.detail.value;
    app.request('api/Store/ChangeStoreStatus?storeId=' + app.HomeStore.Id + '&Status='+ IsBusiness, {}, "GET",
      function (res) {
        console.log("更新状态");
        console.log(res);
        if (res.data.flag) {
          wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
          app.HomeStore.IsBusiness = IsBusiness;
        }else{
          wx.showToast({ title: '失败', icon: 'none', duration: 2000 });
        }
      },
      function () {
        wx.showToast({ title: '更新状态失败', icon: 'loading', duration: 2000 });
      })

  },
  toTimeModify: function () {
    wx.navigateTo({
      url: '/pages/backstage/home/setting/timeModify/tm'
    })
  },

  to_modifyPwd: function () {
    wx.navigateTo({
      url: '/pages/backstage/home/setting/modifyPwd/mPwd'
    })
  },
  to_modifyPwd: function () {
    wx.navigateTo({
      url: '/pages/backstage/home/setting/modifyPrinter/mPrinter'
    })
  },

  to_home: function () {
    wx.reLaunch({
      url: '/pages/backstage/home/home'
    })
  },
  to_so: function () {
    wx.reLaunch({
      url: '/pages/backstage/home/storeOperation/so'
    })
  },
  to_setting: function () {
    wx.reLaunch({
      url: '/pages/backstage/home/setting/setting',
    })
  },
  onLoad: function (options) {
    var that = this;
  },
  onShow:function(){
    var that = this;
    that.setData({
      HomeStoreNaem: app.HomeStore
    });
    console.log(app.HomeStore);
  },
  makePhoneCall:function(e){
    
    wx.makePhoneCall({
      phoneNumber: '400-180-6050' 
    })
  }
  
})
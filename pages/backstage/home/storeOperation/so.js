const app = getApp()
Page({

  data: {

  },
  to_scanCode:function(){
    // 允许从相机和相册扫码
    wx.scanCode({
      success(res) {
        console.log(res)
        var orderNo = res.result;
        console.log(orderNo)
        app.request('api/Order/FinishOrder', {
          orderno: orderNo,
          openid: app.openid,
          storeId: app.HomeStore.Id
        }, "POST",
          function (res) {
            console.log("执行中");
            console.log(res);
            if (res.data.flag) {
              wx.showToast({ title: '收货成功', icon: 'success', duration: 2000 });
            } else {
              wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 });
            }
          },
          function () {
            wx.showToast({ title: '扫码失败', icon: 'loading', duration: 2000 });
          }
        );



      }
    })
  },
  to_client: function () {
    wx.switchTab({
      url: '/pages/index/index',
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
  ptDing: function () {
    wx.reLaunch({
      url: '/pages/backstage/home/ptDing/ptDing'
    })
  },
  to_setting: function () {
    wx.reLaunch({
      url: '/pages/backstage/home/setting/setting',
    })
  },

  to_activityMan: function () {
    wx.navigateTo({
      url: '/pages/backstage/home/storeOperation/activityMan/am',
    })
  },
  to_accountChecking: function () {
    wx.navigateTo({
      url: '/pages/backstage/home/storeOperation/accountChecking/ac',
    })
  },
  ptList: function () {
    wx.navigateTo({
      url: '/pages/backstage/ptList/ptList',
    })
  },
  onLoad: function (options) {

  },

  onShow: function () {

  },

})
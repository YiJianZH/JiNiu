const app = getApp()
Page({
  data: {
    tg_img:"/images/bg.png",
    logo_img:"/images/logoNew.png",
    ewm: "",//二维码图片
    title:"邀请新用户扫码关注公众号即可获取丰厚奖励！",
    tg_two:"线上购物商城",
    appUserType:1,
  },

  jumpto:function(){
  
  },
  //事件处理函数  
  changToTest: function () {
      wx.navigateTo({
        url: 'test?id=1'
    })
  },
  onLoad: function () {

    console.log('onLoad')
    var that = this
    if (app.appUserType == 2) {
      //设置背景颜色
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#0066FF',
        animation: {
          duration: 40,
          timingFunc: 'easeIn'
        }
      })
      wx.setBackgroundColor({
        backgroundColor: '#0066FF', // 窗口的背景色为白色
      })
      that.setData({
        appUserType: app.appUserType
      });
    }
    var url = 'api/User/SaleEnconde?orderNo=' +0 + '&openid=' + app.openid + '&position=7';
    app.request(url, {}, 'GET', function (res) {
      if (res.data.flag) {
        that.setData({
          ewm: res.data.msg,
        })
      }
    }, function () { })
  }
})  
const app = getApp()
Page({
  data: {
    tg_img: "/images/tg_a.png",
    logo_img: "/images/logo_image.png",
    ewm: "/images/icon_fahuo.png",
    title: "",
    tg_two: "线上购物商城",
    date: { "r": "0", "g": "0", "b": "0" },
    info: [{ "OrderNo": 0, "userId": 0, "position": 0, "productId": 0 }],
    username: "",
    openid: "",
    city: "",
    latitude: "",
    longitudet: "",
    code: "",

  },

  jumpto: function () {

  },
  //事件处理函数  
  changToTest: function () {
    var that = this;
    wx.navigateTo({
      url: 'test?id=1'
    })
  },
  onLoad: function (option) {
    var that=this;
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
    }
    var usernames='';
    var id=option.id;
    if (id!=null)
    {
      that.setData({
        title:id
      })
    }
   
  },

  GoIndex:function(){
    wx.switchTab({
      url: '../../../pages/index/index',     
    });
  }

})  
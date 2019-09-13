//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    HDList:[]
  },
  //事件处理函数
  bindViewTap: function () {

  },
  onPullDownRefresh: function () {
    this.onLoad()
  },
  onLoad: function () {
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
     
    }
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    });
    var that = this
    var AreaId = app.AreaId;
    app.request('api/Promotion', { show: false, AreaId: AreaId}, "GET",
      function (res) {//hodong_img
        if (res.data.flag == true) {
          that.setData({
            HDList: res.data.list
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 100);
        }
      }, function () {//error
        wx.showToast({ title: '常规活动无数据', icon: 'loading', duration: 2000 });
      }
    );
  },
  OnclickGo:function(e){//点击活动
    app.SUSpromotionId = e.currentTarget.dataset.typid;
    if (app.SUSpromotionId!=0){
      wx.navigateTo({
        url: '../../shop_list/shop_list'
      })
    }
    
  }
  
})
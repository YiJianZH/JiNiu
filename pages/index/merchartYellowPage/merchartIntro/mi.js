const app = getApp()
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

  data: {
    appUserType: 1,
    sid:0,//店铺ID
    storeData:{},//店铺信息
    clis:[],//评论
  },
  onLoad: function (options) {
    var that = this;
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
    console.log(options);
    var sid = options.sid
    if (sid==undefined){
      wx.showToast({
        title: '没有店铺',
        icon: 'loading',
        duration: 2000
      });
      return
      
    }

    that.setData({
      sid: sid
    });
    that.getDataInfor();
    that.getOrderCommentByStoreId();
  },
  //店铺信息
  getDataInfor: function () {
    var that = this;
    var sid = that.data.sid;
    app.request('api/Store/GetDetailInfor?id=' + sid, {}, "GET",
      function (res) {
        console.log("获取商家");
        if (res.data.flag) {
          var storeData = res.data.obj;
          console.log(storeData);
          that.setData({
            storeData: storeData,
          });

          var article = storeData.DesCrible == null ? "" : storeData.DesCrible;
          console.log("article=" + article);

          WxParse.wxParse('article', 'html', article, that, 5);
        }


      },
      function () {
        wx.showToast({
          title: '获取商家无效',
          icon: 'loading',
          duration: 2000
        });
      })

  },
  //店铺评论
  getOrderCommentByStoreId:function(){
    var that = this;
    var sid = that.data.sid;
    app.request('api/Store/GetOrderCommentByStoreId?storeId=' + sid, {}, "GET",
      function (res) {
        console.log("获取商家评论");
        
        if (res.data.flag) { 
          var clis = res.data.list;
          console.log(clis);
          that.setData({
            clis: clis
          });
        }
      },
      function () {
        wx.showToast({
          title: '获取商家无效',
          icon: 'loading',
          duration: 2000
        });
      })
  },
  goPhone:function(e){
    console.log(e);
     var Phone= e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: Phone // 仅为示例，并非真实的电话号码
    })
  }


})
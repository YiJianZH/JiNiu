const app = getApp()
Page({

  data: {
    appUserType:1,
    isOnlick:true,
    oid:0,
    Store:{},
    Storelist:[],
    Level:0,
    ComText:'',
    _num: 0,
  },
  clickNum: function (e) {
    console.log(e.target.dataset.num)
    this.setData({
      _num: e.target.dataset.num,
      Level: e.target.dataset.num
    })
   
  }, 

  onLoad: function (options) {
    var that = this
    that.setData({
      appUserType: app.appUserType
    });
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
     
    }else{
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#47b34e',
        animation: {
          duration: 40,
          timingFunc: 'easeIn'
        }
      })
    }
    console.log(options);
    var oid = options.oid;
    if (oid!=undefined){
      that.setData({
        oid: oid
      });
      that.getData(oid);
    }
    
  },
  onShow: function () {
    var that = this
    that.setData({
      isOnlick: true
    });
  },
  //店铺信息
  getData: function (totleNumber){
    var that = this
    app.request('api/Store/GetOrderStoreDetail?totleNumber=' + totleNumber, {}, "GET",
      function (res) {
        console.log(res.data);
        if (res.data.flag) {
          that.setData({
            Storelist: res.data.lisobj
          });
        }
      }, function (e) {//error
        wx.showToast({ title: '店铺无信息', icon: 'loading', duration: 2000 });
      });
   
   
    
  },
  //评分
  butLevel:function(e){
    console.log("点击");
    console.log(e.currentTarget.dataset.tid);
    var Level = e.currentTarget.dataset.tid+1;
    console.log("Level=" + Level);
    this.setData({
      Level: Level
    });
  },
  //获取评论
  setText:function(e){
    var that = this
    that.setData({
      ComText: e.detail.value
    });

  },
  butOnclik:function(e){
    var that = this
    wx.showLoading({
      title: '提交中',
    })


    if (that.data.isOnlick){
      that.setData({
        isOnlick:false
      });
      console.log("点击提交");
      var Level = that.data.Level;
      var ComText = that.data.ComText;
      console.log(Level);
      console.log(ComText);

      if (Level == 0) {
        console.log("1111");
        wx.hideLoading();
        
        wx.showToast({ title: '请评论打分', icon: 'loading', duration: 2000 });
        that.setData({
          isOnlick: true
        });
        return false;
      }
      if (ComText.length == 0) {
        console.log("222");
        wx.hideLoading();
        wx.showToast({ title: '请输入评论', icon: 'loading', duration: 2000 });
        that.setData({
          isOnlick: true
        });
        return false;
      }
      
      app.request('api/Order/SetOrderComment', {
        OpenId: app.openid,
        TotleNumber: that.data.oid,
        CommentLevel: Level,
        CommentText: ComText
      }, "POST",
        function (res) {
          console.log(res.data);
          if (res.data.flag) {
            wx.hideLoading();
            wx.showToast({ title: '评论成功', icon: 'loading', duration: 2000 });
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },2000);
          }
        }, function (e) {//error
          wx.hideLoading();
          wx.showToast({ title: '评论失败', icon: 'loading', duration: 2000 });
        });
      that.setData({
        isOnlick: true
      });

    }
  


  }

})
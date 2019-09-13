const app = getApp()
Page({
  data: {
    yj_a:"我的余额(元)",
    yj_b:"",
    yj_c:"充值",
    yj_d:"提现",
    imge:"",
    recharge:"",
    isrecharge:false,
    withdraw:"",
    iswithdraw:false,
    yj:[],
    currIndex:1,
    appUserType:1,
  },

 
  onLoad: function () {
   var that=this
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
   //获取我的余额
    var moneyurl = 'api/User/' + app.openid + '?marketId=' + app.Market.Id;
   var Money=0.00;
   app.request(moneyurl,{},'Get',function(res){
     if(res.data.flag)
     {
       Money = res.data.model.Money
     }
     that.setData({
       yj_b: Money.toFixed(2),
     })
   },function(){})
    //获取充值/提现日志
   var reurl ='api/Bonus?page='+1+'&pageSize=5&openid='+app.openid+'&Origin=1';
   app.request(reurl,{},'GET',function(res){
     if(res.data.flag)
     {
       var list = res.data.list;
       for (var i = 0; i < list.length;i++){
         list[i].Numerical = list[i].Numerical.toFixed(2)
       }
       that.setData({
         yj: list,
       })
     }
   },function(){})
  
  },
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    var that = this
    //重新请求初始数据
    var reurl = 'api/Bonus?page=' + 1 + '&pageSize=5&openid=' + app.openid + '&Origin=1';
    app.request(reurl, {}, 'GET', function (res) {
      if (res.data.flag) {
        that.setData({
          yj: res.data.list,
          currIndex:1,
        })
      }
    }, function () { })

    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  // 上拉加载回调接口
  onReachBottom: function () {    
    var that = this
    var totle = that.data.currIndex;
    //请求数据
    totle++;
    var reurl = 'api/Bonus?page=' + totle+ '&pageSize=5&openid=' + app.openid + '&Origin=1';
    app.request(reurl, {}, 'GET', function (res) {
      if (res.data.flag) {
        var list = that.data.yj
        for(var i=0;i<res.data.list.length;i++)
        {
        list.push(res.data.list[i]);
        }
        that.setData({
          yj: list,
          currIndex: totle,
        })
      }
    }, function () { })
    

  },
  
  
})  
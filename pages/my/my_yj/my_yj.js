const app = getApp()
Page({
  data: {
    yj_a:"我的佣金(元)",
    yj_b:"",
    yj_d:"提现",
    recharge:"",
    isrecharge:false,
    withdraw:"",
    isNull:true,
    iswithdraw:false,
    searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: true,  //“没有数据”的变量，默认false，隐藏  
    yj:[
      { Id: "", Numerical: "", CreateTime: "", Source: "", PayOut:""},
     
    ],
    currIndex:1,
    
  },
 //加载
  onLoad: function () {
    console.log('onLoad')
    var that = this
    that.setData({
      yj: null,
    })
    //获取佣金
    var url = 'api/User/' + app.openid + '?marketId=' + app.Market.Id
    app.request(url, {}, 'GET', function (res) {
      that.setData({
        yj_b: res.data.model.Money.toFixed(2),
      })
    }, function () { })
   
    //获取记录
    var recordurl = 'api/Bonus?page=' + 1 + '&pageSize=4&openid=' + app.openid + '&Origin=0';
    app.request(recordurl, {}, 'GET', function (res) {
      if (res.data.flag) {
        that.setData({
          yj: res.data.list,
          isNull: true
        })
      }else{
        that.setData({
          isNull: false
        })
      }
      
    }, function () {
      that.setData({
        isNull: false
      })
    })
  
  },
 
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    var that = this
    //重新请求初始数据
    that.onLoad();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  // 上拉加载回调接口
  onReachBottom: function () {

    var that = this
    //请求数据
    var totle = that.data.currIndex;
    totle++;
    that.setData({
      currIndex: totle,
    })
    var url = 'api/Bonus?page=' + totle + '&pageSize=4&openid=' + app.openid + '&Origin=0';
    app.request(url, {}, 'GET', function (res) {
      var list = that.data.yj
      if (res.data.list != null && res.data.list.length > 0) {
        for (var i = 0; i < res.data.list.length; i++) {
          list.push(res.data.list[i])
        }
        that.setData({
          yj: list,
        })
      }
     
    }, function () {
    })

  },
  //充值金额
  rechargeMoney: function (e) {
    var Num =/^[0-9]*$/
    if (!Num.test(e.detail.value)) {
      wx.showToast({
        title: '请输入正数',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    this.setData({
      recharge: e.detail.value
    })
  },
  //充值
  recharge:function()
  {
    var that=this
    if (that.data.recharge == null || that.data.recharge == "")
    {
      wx.showToast({
        title: '请输入充值金额',
        icon: 'loading',
        duration: 2000
      });
      return false;
    }
    //微信支付
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
        //通知后台更改金额
        var url = 'api/Bonus'
        app.request(url, { numerical: that.data.recharge, openid: app.openid }, 'POST', function (res) {
          if (!res.data.flag) {
            wx.showToast({
              title: '充值成功',
              icon: 'success',
              duration: 2000
            });
            that.setData({
              isrecharge: false,

            })
            //获取佣金
            var url = 'api/User/' + app.openid + '?marketId=' + app.Market.Id
            app.request(url, {}, 'GET', function (res) {
              that.setData({
                yj_b: res.data.model['Money'],
              })
            }, function () { })
            //获取记录
            var recordurl = 'api/Bonus?page=' + 1 + '&pageSize=4&openid=' + app.openid
            app.request(recordurl, {}, 'GET', function (res) {
              that.setData({
                yj: res.data.list,
              })
            }, function () { })
          }
        }, function () { })
      },
      'fail': function (res) {
      }
    })   
  },
  //充值按钮
  rechargeButton:function(){
    
    var that=this
  
    that.setData({
      isrecharge: true,
      iswithdraw: false,
    })

  },
  //提现金额
  withdrawMoney: function (e) {
    var Num = /^[0-9]*$/
    if (!Num.test(e.detail.value)) {
      wx.showToast({
        title: '请输入正数',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    this.setData({
      withdraw: e.detail.value
    })
  },
  //充值按钮
  withdrawButton: function () {
    var that = this
    that.setData({
      isrecharge: false,
      iswithdraw: true,
    })
  },
  //关闭弹窗
  closeWindow:function(){
    var that = this
    that.setData({
      isrecharge: false,
      iswithdraw: false,
    })
  },
  ti:function(){
    wx.navigateTo({
      url: '/pages/my/ti/ti',
    })
  }
})  
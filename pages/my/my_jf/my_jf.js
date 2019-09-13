const app = getApp()
Page({
  data: {
    back:"/images/jf_a.png",
    tx:"/images/jf_b.png",
     jf:[
       { Money:"0",Id:"0",Origin: "商品兑换", Integral: "-10", CreateTime: "2017-11-10    15：25：34" }
     ],
     searchLoading: true, //"上拉加载"的变量，默认true，隐藏  
     searchLoadingComplete: true,  //“没有数据”的变量，默认true，隐藏  
     currIndex:"1",
     Integral:"",
     isNull:true,
     RtenBat:true
  },
  //事件处理函数  
  changToTest: function () {
    wx.navigateTo({
      url: '../../pages/my_bj/my_bj'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    console.log('a:' + that.data.back)
    console.log('b:' + that.data.tx)
    that.setData({
      jf:null
    })
    var page = that.data.currIndex
    that.BangData(page);
    
    //获取积分
    var url = 'api/User/' + app.openid + '?marketId=' + app.Market.Id;
    app.request(url, {}, 'GET', function (res) {
      that.setData({
        Integral: res.data.model.Integral,
      })
    }, function () { })
  },
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    var that = this
    // 显示导航栏loading  
    wx.showNavigationBarLoading();
    // 调用接口加载数据  
    that.onLoad();
    // 隐藏导航栏loading  
    wx.hideNavigationBarLoading();
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新  
    wx.stopPullDownRefresh();
  },
  // 上拉加载  
  onReachBottom(e) {  
    var that = this
    if (that.data.RtenBat) {
      //请求数据
      var totle = this.data.currIndex;
      if (that.data.jf!=null) {
        totle++;
      }else{
        totle=1
      }
      
      that.setData({
        currIndex: totle,
        RtenBat:false,
        searchLoading: false
      })
      that.BangData(totle);
    }
    
  },
  //绑定数据
  BangData: function (page){
    var that = this
    that.setData({
      isNull:true
    });
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    });
    //积分列表
    var url = 'api/Integral/Record?page=' + page + '&pageSize=4&openid=' + app.openid;
    app.request(url, {}, 'GET', function (res) {
      if (res.data.flag) {
        that.setData({
          jf: res.data.list,
        })
      }
      else {
       
        if (page == 1) {
          that.setData({
            isNull: false,
          })
          that.setData({
            jf: null,
          })
        }
      }
      if (page != 1) {
        that.setData({
          searchLoadingComplete: false,
          RtenBat: true,
          searchLoading: true
        })
        setTimeout(function () {
          that.setData({
            searchLoadingComplete: true
          })
        }, 3000);
      }
      
      setTimeout(function () {
        wx.hideLoading()
      }, 100);
     
    }, function () {
      setTimeout(function () {
        wx.hideLoading()
      }, 100);
     })
  }




})  
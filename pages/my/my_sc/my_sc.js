const app = getApp()
Page({
  data: {
    shop: [],
    _num: 1,
    curNav: 1,
    currIndex: 1,
    IsNAN: false,
    RtenBat:true,
    searchLoading: true, //"上拉加载"的变量，默认true，隐藏  
    searchLoadingComplete: true,  //“没有数据”的变量，默认true，隐藏  
  },
  //事件处理函数  
  changToTest: function () {
    wx.navigateTo({
      url: '../../pages/shop_page/shop_page'
    })
  }, onShow: function () {
    var that = this
    console.log('onLoad')
    var page = that.data.currIndex
    that.BangData(page);
  },
  onLoad: function () {
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
    }
    console.log('onLoad')
    var page = that.data.currIndex
    that.BangData(page);
  },
  //加载数据
  BangData:function(page){
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    });
    var that = this
   
    var url = 'api/Collect?page=' + page+ '&pageSize=10&openid=' + app.openid
    app.request(url, {}, 'GET', function (res) {
      console.log(res);
      if (res.data.flag) {
        var list=[];
        for (var i = 0; i < res.data.list.length; i++) {
           list[i] = ({
            Title: res.data.list[i].Title,
            Picture: res.data.list[i].Picture,
            Price: res.data.list[i].Price.toFixed(2),
            Unit: res.data.list[i].Unit,
            UnitId: res.data.list[i].UnitId,
            Id: res.data.list[i].Id,
             IsStoreBusiness: res.data.list[i].IsStoreBusiness
          });
        }
        console.log(list);
        that.setData({
          IsNAN: false,
          shop: list,
          searchLoading:true,
          RtenBat:true,
        })
      }
      else {
        if (page==1){
          that.setData({
            shop: null,
            IsNAN: true,
            searchLoadingComplete:false,
            RtenBat: true,
            searchLoading: true
          })
          setTimeout(function () {
            that.setData({
              searchLoadingComplete: true
            })
          }, 2000);
        } else {
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
        
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 100);
    }, function () {

    })
  },
  Del: function (event) {
    var that = this
    let Id = event.currentTarget.dataset.co_id;

    wx.showModal({
      title: '提示',
      content: '是否取消收藏？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var url = 'api/Collect?pid=' + Id + '&openid=' + app.openid
          app.request(url, {}, 'DELETE', function (res) {
            if (res.data.flag) {
              wx.showToast({
                title: '已取消收藏',
                icon: 'success',
                duration: 2000
              })
              //刷新
              that.onLoad();
            }
          }, function () {
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
       
      }
    })

   
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
    console.log("加载");
    var that = this
    if (that.data.RtenBat){
      //请求数据
      var totle = that.data.currIndex;
      totle++;
      that.setData({
        currIndex: totle,
        RtenBat: false,
        searchLoading: false
      })
      that.BangData(totle);
    }
   
  },
  //加入购物车
  Join: function (event) {
    var that = this
    var unId = 0;
    let Id = event.currentTarget.dataset.joinid;
    let isb = event.currentTarget.dataset.isb;
    if (isb){
      var list = that.data.shop
      for (var i = 0; i < list.length; i++) {
        if (list[i]['Id'] == Id) {
          unId = list[i]['UnitId'];
        }
      }
      app.joinCart(Id, unId, {})
    }

    
  }
})  
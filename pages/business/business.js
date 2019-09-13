//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    appUserType:1,
    bs_one_a: "../../images/sj_a.png",
    dizhi: "遂宁市船山区河东新区鼎盛国际银座18层",
    call: "08258191116",
    md: "门店介绍",
    text: "欢迎光临本店，本店新开张，诚信经营，信誉至上。本店商品均有质量保证，不断更新菜品，满足消费者需求，提供优质服务...",
    Name: "",
    masgestye: true,
    Connector: "",
    Address: "",
    Phone: "",
    Description: "",
    Logo: "",
    SupplierSwiper: [],
    Id: "",
    StoreInfo:{},
    sp_li: [],
  },
  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  //滚动监听
  scroll: function (e) {
    // console.log(e) ;
    var that = this, scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  onLoad: function (option) {
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
      this.setData({
        appUserType: app.appUserType
      });



    }
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    });
    var that = this
    
    var supId = option.id;
    that.setData({
      Id:supId
    })
    app.request('api/Store/GetDetail?id=' + supId, {}, "GET",
      function (res) {
        console.log("商家");
        console.log(res);
        if (res.data.flag == true) {
          var list = res.data.obj;
          var StoreInfo={
            Name: list.Name,
            Phone: list.Phone,
            CoverImage: list.CoverImage,
            Address: list.Address,
          };
          var article = list.DesCrible == null ? "" : list.DesCrible;
          console.log("article=" + article);
         
          WxParse.wxParse('article', 'html', article, that, 5);
    
          that.setData({
            StoreInfo: StoreInfo
          })
          
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 100);
      }, function () {//error
        wx.showToast({ title: '无数据', icon: 'loading', duration: 2000 });
      }
    );
    that.GetBanner();
    that.GetProduct();
  },
  GetPhone: function () {//打电话
    var that = this
    var phone = that.data.Phone
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })

  },
  //获取轮播图
GetBanner:function(){
  var that = this;
  app.request('api/Banner/GetStoreBanner?storeId=' + that.data.Id + '&openid=' + app.openid, {}, "GET",
    function (res) {
      if (res.data.flag == true) {
        var list = res.data.list;
        var banner=[];
        for(var i=0;i<list.length;i++)
        {
          banner.push({
            Id: list[i].Id,
            IsJump: list[i].IsJump,
            Picture: list[i].Picture,
            Url: list[i].Url,
          })
        }
        that.setData({
          SupplierSwiper: banner
        })
      }
    }, function () {//error
      wx.showToast({ title: '无数据', icon: 'loading', duration: 2000 });
    }
  );
},
//获取推荐产品
  GetProduct: function () {
    var that = this;
    app.request('api/Store/GetStoreProduct?id=' + that.data.Id, {}, "GET",
      function (res) {
        if (res.data.flag == true) {
          var list = res.data.list;
          var newList = [];
          console.log("推荐");
          console.log(list);
          for (var i = 0; i < list.length; i++) {
            newList.push({
              Id: list[i].Id,
              Title: list[i].Title,
              Cover: list[i].Picture,
              Price: list[i].Price,
              Unite: list[i].Unit,
              UnitId: list[i].UnitId,
            })
          }
         
          that.setData({
            sp_li: newList
          })
        }
      }, function () {//error
        wx.showToast({ title: '无数据', icon: 'loading', duration: 2000 });
      }
    );
  },
  //推荐产品加入购物车
  JoinCart: function (e) {
    var that = this
    var pid = e.currentTarget.dataset.id;
    var unitid = e.currentTarget.dataset.unit;

    var numUrl = 'api/Product/GetInventory?id=' + unitid;
    app.request(numUrl, {}, 'GET', function (res) {

      if (res.data.flag) {
        if (res.data.msg < that.data.num) {
          wx.showToast({ title: '库存不足', icon: 'loading', duration: 2000 });
          return;
        }
        var url = 'api/Cart/list'
        app.request(url, { "pid": pid, "unitid": unitid, num: that.data.num, openid: app.openid }, 'POST', function (res) {
          if (res.data.flag) {
            wx.showToast({ title: '已加入购物车', icon: 'success', duration: 2000 })
          } else {
            wx.showToast({ title: '加入购物车失败', icon: 'loading', duration: 2000 })
          }

        }, function () {
          error(); //失败回调
        })
      }



    }, function () { })


  },

  //跳转产品详情
  GoDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop_list/shop_page/shop_pege?id=' + id,
    })
  },
//跳转链接
  GoUrl:function(e){
var that=this;
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  }

})  
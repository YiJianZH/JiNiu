//获取应用实例
const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    IsBusines:false,
    flag: true,
    ProductId: "",
    movies: [],
    SetImage: false,
    kg: "1kg",
    IsPublish: true,
    Title: "",
    masgetye: true,
    Deputy: "",
    Description: "",
    Unit_Id: "",
    Unit_Name: "",
    Unit_Price: "",
    Unit_Inventory: "",
    Unit_OldPrice: "",
    Unit_Picture: "", //规格图片
    IsCollect: "",
    Unit: [],
    Tuijian: [],
    SupplierName: "",
    SupplierId: "",
    SupplierImg: "",
    curNav: 1,
    curIndex: 0,
    num: 1,
    Initiation:1,
    minusStatus: "disabled",
    _num: 0,
    IsPlay: false,
    IsPlaying: false,
    Video: "",
    StoreId:0,
    appUserType:1,
  },
  a: function () {
    this.setData({ flag: false, IsPlay: false })
  },
  b: function () {
    this.setData({ flag: true, IsPlay: true })
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    var Initiation = this.data.Initiation;
    if (num > Initiation) {
      num--;
    }
    var minusStatus = num <= Initiation ? 'disabled' : 'normal';
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    num++;
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  /*结束*/
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
  onLoad: function (options) {
    app.ISoptions = true;
    console.log("产品详情");
    console.log(options);
    app.IsCode = true;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    });
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
      this.setData({
        appUserType: app.appUserType
      });
    }

    var pid = options.id;
    that.setData({
      ProductId: pid
    });
    that.GetlistById(pid, function () {
      that.GetTuiJianById(pid);
      that.setData({
        masgetye: false
      });

    });

  },
  
  onShow: function () {
    var that = this
    that.GetList();

  },
  clickNum: function (e) {
    var Unitlist = this.data.Unit;
    var Initiation=1;
    for (var i = 0; i < Unitlist.length; i++) {
      if (Unitlist[i].Id == e.target.dataset.id) {
        Unitlist[i].IsDefault = true;
        console.log(Unitlist[i]);
        if (Unitlist[i].IsRestaurant){
          Initiation = Unitlist[i].Initiation
        }
      } else {
        Unitlist[i].IsDefault = false;
      }
    }
    console.log("111");
    console.log(e.target.dataset);
    this.setData({
      Unit_Id: e.target.dataset.id,
      Unit_Name: e.target.dataset.name,
      Unit_Price: e.target.dataset.price.toFixed(2),
      Unit_OldPrice: e.target.dataset.oprice.toFixed(2),
      Unit_Inventory: e.target.dataset.inventory,
      Unit_Picture: e.target.dataset.picture,
      Unit: Unitlist,
      num: 1,
      Initiation: 1
    })



  },
  GetlistById: function (pid, next) {
    var that = this
    console.log("获取产品=" + pid);
    app.request('api/Product/GetProductById', { Id: pid, OpenId: app.openid }, "POST",
      function (res) {
        console.log(res);
        if (res.data.flag) {

          wx.hideLoading()
          app.Details = true;
          var d = res.data.product;
          if (res.data.product.Description == null) {
            res.data.product.Description = "";
          }
          var ispay = res.data.product.Video == "https://www.yongbox.com" ? false : true;
          if (res.data.product.Video == undefined) {
            ispay = false;
          }

          console.log("ispay=" + ispay);
          console.log("Video=" + res.data.product.Video);
          that.setData({
            IsBusines: res.data.IsBusines,
            movies: res.data.product.Banner,
            Title: res.data.product.Title,
            Deputy: res.data.product.Deputy,
            Description: res.data.product.Description,
            Unit: res.data.product.Unit,
            IsCollect: res.data.product.IsCollect,
            SupplierId: res.data.product.SupplierId,
            SupplierName: res.data.product.SupplierName,
            SupplierImg: res.data.product.SupplierImg,
            IsPublish: res.data.product.IsPublish,
            Video: ispay ? res.data.product.Video : '',
            IsPlay: ispay,
            StoreId: res.data.product.StoreId,
          })
          var untlist = res.data.product.Unit;
          console.log("222");
          console.log(untlist);
          for (var i = 0; i < untlist.length; i++) {
            if (untlist[i].IsDefault) {
              that.setData({
                Unit_Id: untlist[i].Id,
                Unit_Name: untlist[i].Name,
                Unit_Price: untlist[i].Price.toFixed(2),
                Unit_OldPrice: untlist[i].OldPrice.toFixed(2),
                Unit_Inventory: untlist[i].Inventory,
                Unit_Picture: untlist[i].Picture,
                num: 1,
                Initiation: 1
              })
              
            }
          }
          if (that.data.Unit_Id<=0){
            that.setData({
              Unit: untlist,
              Unit_Id: untlist[0].Id,
              Unit_Name: untlist[0].Name,
              Unit_Price: untlist[0].Price.toFixed(2),
              Unit_OldPrice: untlist[0].OldPrice.toFixed(2),
              Unit_Inventory: untlist[0].Inventory,
              Unit_Picture: untlist[0].Picture,
              num: 1,
              Initiation: 1
            })
            
          }
          ///描述HTML
          var article2 = that.data.Description;
          if (article2 != "" && article2 != null) {
            that.setData({
              SetImage: true
            });
          } else {
            that.setData({
              SetImage: false
            });
          }
          console.log("&&&");
          console.log(that.data.SetImage);
          WxParse.wxParse('article', 'html', article2, that, 5);
          setTimeout(function () {
            wx.hideLoading()
          }, 100);
          ///描述HTML
          next();
        }
      }, function (e) {//error
        console.log("错误");
        wx.showModal({
          title: '提示',
          content: '产品已下架',
          success: function (res) {
            wx.reLaunch({
              url: '/pages/index/index',
            });
          }
        })
      });
  },
  GetTuiJianById: function (pid) {
    var that = this
    app.request('api/Product/Recommend', { id: pid }, "GET",
      function (res) {
        console.log(res.data);
        if (res.data.flag) {

          var list = res.data.list
          for (var i = 0; i < list.length; i++) {
            list[i].Price = list[i].Price.toFixed(2);
          }
          that.setData({
            Tuijian: list
          })
        }
      }, function (e) {//error
        wx.showToast({ title: '推荐产品无数据', icon: 'none', duration: 2000 });
      });
  },
  OnclickGWC: function () {//购物车
    var that = this
    if (that.data.IsPublish) {
      var pid = that.data.ProductId;
      var unitid = that.data.Unit_Id;
      var numUrl = 'api/Product/GetInventory?id=' + unitid;
      app.request(numUrl, {}, 'GET', function (res) {

        if (res.data.flag) {
          if (res.data.msg < that.data.num) {
            wx.showToast({ title: '库存不足', icon: 'none', duration: 2000 });
            return;
          }
          var url = 'api/Cart/list'
          app.request(url, { "pid": pid, "unitid": unitid, num: that.data.num, openid: app.openid }, 'POST', function (res) {
            if (res.data.flag) {
              wx.showToast({ title: '已加入购物车', icon: 'success', duration: 2000 })
            } else {
              wx.showToast({ title: '加入购物车失败', icon: 'none', duration: 2000 })
            }

          }, function () {
            error(); //失败回调
          })
        }



      }, function () { })
    } else {
      wx.showToast({ title: '产品已下架！', icon: 'none', duration: 2000 });
    }
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
          wx.showToast({ title: '库存不足', icon: 'none', duration: 2000 });
          return;
        }
        var url = 'api/Cart/list'
        app.request(url, { "pid": pid, "unitid": unitid, num: that.data.num, openid: app.openid }, 'POST', function (res) {
          if (res.data.flag) {
            wx.showToast({ title: '已加入购物车', icon: 'success', duration: 2000 })
          } else {
            wx.showToast({ title: '加入购物车失败', icon: 'none', duration: 2000 })
          }
        }, function () {
          error(); //失败回调
        })
      }
    }, function () { })
  },
  OnclikLJGM: function () {//立即购买
    var that = this
    console.log("立即购买");

    wx.showModal({
      title: '提示',
      content: '是否确定立即购买,如果您有别的购物需求，请先放入购物车',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (that.data.IsPublish) {
            var unitid = that.data.Unit_Id;
            var num = that.data.num;
            var numUrl = 'api/Product/GetInventory?id=' + unitid;
            app.request(numUrl, {}, 'GET', function (res) {
              if (res.data.flag) {
                if (res.data.msg < that.data.num) {
                  wx.showToast({ title: '库存不足', icon: 'none', duration: 2000 });
                  return;
                }
                app.request('api/Order/One', { unitid: unitid, unm: num, openid: app.openid }, "POST",
                  function (res) {
                    if (res.data.flag) {
                      var orderId = res.data.orderId;
                      wx.navigateTo({
                        url: '../../shop_list/shop_order/shop_order?id=' + orderId
                      })
                    } else {
                      wx.showToast({ title: res.data.msg, icon: 'none', duration: 3000 });


                    }

                  }, function (res) {//error
                    console.log(res);
                    wx.showToast({ title: '无数据', icon: 'none', duration: 2000 });
                  });
              }
            }, function () { })
          } else {
            wx.showToast({ title: '产品已下架！', icon: 'none', duration: 2000 });
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })



   
  },
  OnclikSC: function (e) {
    var that = this
    var pid = this.data.ProductId;
    var collest = this.data.IsCollect;
    if (collest) {
      app.cancelCollect(pid,
        function (e) {//error
          that.setData({
            IsCollect: false
          });
        });
    } else {
      app.joinCollect(pid,
        function (e) {//error
          that.setData({
            IsCollect: true
          });
        });
    }
  },
  // 下拉刷新  
  onPullDownRefresh: function () {
    var that = this
    // 显示导航栏loading  
    wx.showNavigationBarLoading();
    // 调用接口加载数据  
    var pid = that.data.ProductId;
    that.GetlistById(pid, function () {
      that.GetTuiJianById(pid);
      that.setData({
        masgetye: false
      });
      // 隐藏导航栏loading  
      wx.hideNavigationBarLoading();
    });

    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新  
    wx.stopPullDownRefresh();

  },
  GetList: function () {
    var that = this
    console.log("1-1");
    var pid = that.data.ProductId;
    that.GetlistById(pid, function () {
      that.GetTuiJianById(pid);
      that.setData({
        masgetye: false
      });
    });
    // if (!app.Details){
    //   setTimeout(function () {
    //     that.GetList();
    //   }, 3000); 
    // }
  },
  //点击播放
  OnBindplay: function (e) {
    var that = this;
    that.setData({
      IsPlay: true,
      IsPlaying: true,
    })
  },
  //播放完成后
  Onbindended: function () {
    var that = this;
    that.setData({
      IsPlay: true,
      IsPlaying: false,
    })
  },

  //关闭播放
  ClosePlay: function () {
    var that = this;
    that.setData({
      IsPlaying: false,
    })

  },
  
  business: function (e) {
    var that=this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/business/business?id=' + that.data.StoreId,
    })
  },
  GWCSubmit:function(e){
    console.log("点击");
    var fId = e.detail.formId;
    console.log("formId=" + fId);
    app.request('api/User/SaveFromId?fromId=' + fId + '&openId=' + app.openid, {}, "GET",
      function (res) {
        console.log("formId添加成功");
      },
      function (error) { //error

      }
    );
  },
  LJGMSubmit:function(e){
    console.log("点击");
    var fId = e.detail.formId;
    console.log("formId=" + fId);
    app.request('api/User/SaveFromId?fromId=' + fId + '&openId=' + app.openid, {}, "GET",
      function (res) {
        console.log("formId添加成功");
      },
      function (error) { //error

      }
    );
  }
})  
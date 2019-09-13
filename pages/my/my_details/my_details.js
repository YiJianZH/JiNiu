//shop_cart.js
//获取应用实例
const app = getApp()

Page({
  data: {   
    appUserType:1,
    markers: [],
    SelfShop: "",
    MarketName: "",
    MarketPhone: "",
    RiderName: "",
    RiderPhone: "",
    RiderDistance: "",
    RiderLat: "",
    RiderLng: "",
    flag: true,
    flaga: true,
    order_back: [{
      Id: "",
      Reason: ""
    }],
    tc_a: "退换货",
    tc_img: "/images/sp_aa.png",
    tc_b: "退换货原因",
    order_back: [{
      Id: "",
      Reason: ""
    }],
    name: "",
    orderStatus: "",
    UserDeliveryTime: "",
    call: "",
    address: "",
    UserLat: "",
    UserLng: "",
    back_img: "/images/xd_back.png",
    orderNo: "",
    time: "2017-11-23 15：53：00",
    goodsCode: "",
    productTitle: "商品信息",
    orderId: "",
    yh: "优惠券",
    Coupon: "-￥5.00",
    xf: "消费小计",
    IsRestaurant:false,
    DiscountMoney:0.00,
    IsOverdays: true,
    DeliveryCost: 0.00,
    DeliveryType: 0,
    CouponMoney: 0.00,
    PayMoney: 0.00,
    Money: 0.00,
    _num: 0,
    reasons: "",
    MoneyDetail: [{
        dd: "优惠金额",
        de: "-￥5.00"
      },
      {
        dd: "运费",
        de: "￥0.00"
      },
      {
        dd: "实付金额",
        de: "￥95.66"
      }
    ],
    Detail: [{
      Id: "",
      Picture: "",
      UnitName: "",
      ProductName: '泰国金枕头榴莲',
      Price: '16.9',
      Num: 1,
      pUnitName: "500g"
    }],
    back_a: "",
    phoneNumber: "18877779999",
    distance: "500m"
  },

  callup: function() {
    var that = this;
    if (that.data.RiderPhone.length > 1) {
      wx.makePhoneCall({
        phoneNumber: that.data.RiderPhone
      })
    } else {
      wx.showToast({
        title: '骑手没有电话',
        icon: 'none',
        duration: 2000
      })
    }

  },

  goPhone: function(e) {
    console.log(e);
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone // 仅为示例，并非真实的电话号码
    })
  },
  a: function() {
    if (this.data.orderStatus < 4) {
      return;
    }
    this.setData({
      flag: false
    })
  },
  b: function() {
    this.setData({
      flag: true
    })
  },
  c: function() {
    if (this.data.orderStatus != 5) {
      return;
    }
    this.setData({
      flaga: false
    })
  },
  d: function() {
    this.setData({
      flaga: true
    })
  },

  menuClick: function(event) {
    let Id = event.currentTarget.dataset.num;
    this.setData({
      _num: Id,
      reasons: this.data.order_back[Id].Reason,
    })

  },
  calling: function() {
    wx.makePhoneCall({
      phoneNumber: '08258191116', //真实电话号码 
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },
  changetel: function(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  //退货提交
  backSub: function() {
    var that = this
    var isre = false
    var istel = false

    var ids = that.data.orderId;
    var telepnone = that.data.tel
    var myreg = /^1[345789]\d{9}$/;
    if (that.data.reasons == "" || that.data.reasons == null) {
      wx.showToast({
        title: '请选择原因',
        icon: 'success',
        duration: 2000
      })
      return;
    } else {
      isre = true
    }
    if (that.data.tel == null && that.data.tel == "") {

      wx.showToast({
        title: '请填写电话',
        icon: 'success',
        duration: 2000
      })
      return;

    } else if (!myreg.test(telepnone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return;
    } else {
      istel = true
    }

    if (isre && istel) {
      var url = 'api/Order/Return'
      app.request(url, {
        reason: that.data.reasons,
        phone: that.data.tel,
        id: ids,
        openid: app.openid
      }, 'PUT', function(res) {
        that.d()
        if (res.data.flag) {
          wx.showToast({
            title: '退货已提交',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function() {
            wx.navigateTo({
              url: '../../../pages/my/my_order/my_order?id=5'
            })
          }, 3000)


        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
        }

      }, function() {})
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onPullDownRefresh: function() {
    this.onLoad()
  },
  onLoad: function(options) {
    console.log("onload")
    console.log(options)
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
      that.setData({
        appUserType: app.appUserType
      });


    }
    //调用实用的方法获取全局数据
    app.getUserInfo(function(userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    var orderid = options.id
    var orderNo = options.orderNo
    that.setData({
      orderId: orderid,
      orderNo: orderNo
    })
    console.log("orderId=" + orderid);
    console.log("orderNo=" + orderNo);
    
    //window.style = "yellow"
    //加载页面数据
    var url = 'api/Order/Detail?id=' + orderid + '&openid=' + app.openid + '&orderNo=' + orderNo
    app.request(url, {}, 'GET', function(res) {
      console.log(res);
      if (res.data.flag) {
        var model = res.data.model
        for (var i = 0; i < model.Detail.length; i++) {
          model.Detail[i].Price = model.Detail[i].Price.toFixed(2);
        }
        var moneydetail = that.data.MoneyDetail
        for (var i = 0; i < 3; i++) {
          if (moneydetail[i].dd == "优惠金额") {
            moneydetail[i].de = "-￥" + model.CouponMoney.toFixed(2)
          } else if (moneydetail[i].dd == "￥" + "运费") {
            moneydetail[i].de = model.DeliveryCost.toFixed(2)
          } else if (moneydetail[i].dd == "实付金额") {
            moneydetail[i].de = "￥" + model.PayMoney.toFixed(2)
          }
        }
        var PayMoney = ((model.DeliveryCost * 1) + (model.PayMoney * 1)).toFixed(2);
        console.log(res.data);
        console.log("^^^^^^^^");
        // model.RiderLat = "29.82816935207553";
        // model.RiderLng = "121.52521324704604";
        if (model.RiderLat!=null){

          
          var markers= [{
                iconPath: '/images/song.png',
                id: 2,
                latitude: model.RiderLat,
                longitude: model.RiderLng,
                width: 50,
                height: 50
              }];

          that.setData({
            markers :markers
          });

              
        }
        
        that.setData({
          
          IsRestaurant: res.data.IsRestaurant,
          SelfShop: res.data.SelfShop,
          DiscountMoney: model.DiscountMoney,
          MarketName: app.Market.Name,
          MarketPhone: app.Market.Phone,
          RiderName: model.RiderName,
          RiderPhone: model.RiderPhone,
          RiderDistance: model.RiderDistance,
          UserDeliveryTime: model.UserDeliveryTime,
          RiderLat: model.RiderLat,
          RiderLng: model.RiderLng,
          name: model.UserName,
          call: model.UserPhone,
          address: model.UserAddress,
          UserLat: model.UserLat,
          UserLng: model.UserLng,
          orderStatus: model.Status,
          orderNo: model.OrderNo,
          time: model.CreateTime,
          DeliveryType: model.DeliveryType,
          DeliveryCost: model.DeliveryCost.toFixed(2),
          CouponMoney: model.CouponMoney.toFixed(2),
          PayMoney: PayMoney,
          Money: model.TotalMoney.toFixed(2),
          goodsCode: res.data.result,
          StoreDetail: model.StoreDetail,
          Detail: model.Detail,
          MoneyDetail: moneydetail,
          IsOverdays: model.IsOverdays
        })
        console.log("%%%%%%%%%%");
        console.log("goodsCode=" + res.data.result);
        console.log(that.data.StoreDetail);
        //获取收货二维码
        var codeurl = 'api/Order/GetGoodsEncode?orderNo=' + that.data.orderNo;
        app.request(codeurl, {}, 'GET', function (res) {
          if (res.data.flag) {
            if (that.data.orderStatus == 4) {
              that.setData({
                back_a: res.data.msg
              })
            }
          }
        }, function () { })
        var a = 1
      }
     
    }, function() {})


    //获取退换货理由
    that.reasons();

  },

  //取消订单
  cancel: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否取消订单？',
      success: function(res) {
        if (res.confirm) {
          var url = 'api/Order/Cancel?id=' + that.data.orderId + '&openid=' + app.openid
          app.request(url, {}, 'DELETE', function(res) {
            if (res.data.flag) {
              wx.showToast({
                title: '已取消订单',
                icon: 'success',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '取消订单失败',
                icon: 'error',
                duration: 2000
              })
            }
            setTimeout(function() {
              wx.navigateTo({
                url: '../../../pages/my/my_order/my_order'
              })

            }, 3000)

          }, function() {})

        } else {
          return;
        }
      }
    })



  },

  //确认收货
  goods: function() {
    var that = this
    var url = 'api/Order/Finish'
    app.request(url, {
      id: that.data.orderId,
      openid: app.openid
    }, 'POST', function(res) {
      if (res.data.flag) {
        wx.showToast({
          title: '已收货',
          icon: 'success',
          duration: 2000
        })

      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })

      }
      setTimeout(function() {
        wx.navigateTo({
          url: '../../../pages/my/my_order/my_order'
        })
      }, 3000)

    }, function() {})
  },
  //删除订单
  del: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除订单？',
      success: function(res) {
        if (res.confirm) {
          var url = 'api/Order/' + that.data.orderId + '?openid=' + app.openid
          app.request(url, {}, 'DELETE', function(res) {
            wx.showToast({
              title: '已删除',
              icon: 'success',
              duration: 2000
            })
            wx.navigateTo({
              url: '../../../pages/my/my_order/my_order'
            })
          }, function() {})

        } else {
          return;
        }
      }
    })
  },
  //继续支付
  GoPay: function() {
    var that = this;
    wx.navigateTo({
      url: '../../shop_list/shop_order/shop_order?id=' + that.data.orderId
    })
  },
  //获取退换货理由
  reasons: function() {
    var that = this

    var url = 'api/Order/Reason'
    app.request(url, {}, 'GET', function(res) {

      if (res.data.flag) {
        that.setData({
          order_back: res.data.model,
        })

      }

    }, function() {})

  },

  GetCode: function() {
    //获取收货二维码
    var codeurl = 'api/User/Enconde?orderNo=' + that.data.orderNo + '&openid=' + app.openid + '&position=4';
    app.request(codeurl, {}, 'GET', function(res) {
      if (res.data.flag) {
        if (that.data.orderStatus == 5) {
          that.setData({
            back_a: res.data.msg
          })
        }
      }
    }, function() {})

  },
  backgoods: function(event) {


    this.setData({
      flag: false
    })
    this.reasons()
    let Id = event.currentTarget.dataset.backid;
    this.setData({
      status: true,
      flag: false,
      back_Id: Id,
    })
  },
  dao: function(e) {
    console.log(e);
    var UserLat = this.data.UserLat;
    var UserLng = this.data.UserLng;
    var RiderLat = this.data.RiderLat;
    var RiderLng = this.data.RiderLng;
   
    wx.navigateTo({
      url: '/pages/index/dao/dao?UserLat=' + UserLat + '&UserLng=' + UserLng + '&RiderLat=' + RiderLat + '&RiderLng=' + RiderLng,
    })
  }

})
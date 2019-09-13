//shop_cart.js
//获取应用实例
const app = getApp()

Page({
  data: {
    appUserType:1,
    QuanXuan: "/images/cart_a.png",
    TotalMoney: 0.00,
    TotalNuber:0, //购物车里的总个数
    Cartlist: [],
    page: 1,
    IsNull: false,
    IsRun: true,
    IsLog: true,
    ISnow:true,
    masgetype: true,
    selectid: [{
      id: 0,
      Num: 0
    }]
  },
  /* 点击减号 */
  bindMinus: function (e) {
    var that = this
    console.log("减");
    if (that.data.IsRun) {
      that.setData({
        IsRun: false
      })
      if (that.data.Cartlist != null) {
        var index = e.currentTarget.dataset.index;
        var nuber = that.data.Cartlist[index].Num - 1;
        var totalNum = that.data.TotalNuber - 1;
        if (nuber > 0) {
          that.data.Cartlist[index].Num = nuber;
          var TotalMoney = that.data.TotalMoney * 1; //计算价格
          if (that.data.Cartlist[index].img == "/images/cart_b.png") {
            if (that.data.Cartlist[index].Num == 0) {
              that.data.Cartlist[index].img = "/images/cart_a.png";
            }
            TotalMoney = (TotalMoney * 1) - (that.data.Cartlist[index].Price * 1);
          }
          if (TotalMoney != 0) {
            TotalMoney = TotalMoney.toFixed(2);
          } else {
            that.data.Cartlist[index].img = "/images/cart_a.png";
          }
          var list = that.data.Cartlist;
          var mesg = app.SetCartNum(that.data.Cartlist[index].Id, nuber,
            function () {
              that.setData({
                Cartlist: list,
                TotalMoney: TotalMoney,
                IsRun: true,
                TotalNuber: totalNum
              })
            }
          );
          wx.setTabBarBadge({
            index: 2,
            text: totalNum.toString()
          })
        }
       
      }
    }

  },
  /* 点击加号 */
  bindPlus: function (e) {
    var that = this
    console.log("加");

      var index = e.currentTarget.dataset.index;
      var nuber = that.data.Cartlist[index].Num + 1;
      var totalNum = that.data.TotalNuber + 1;
      if (that.data.Cartlist != null) {
        var list = that.data.Cartlist;
        var mesg = app.SetCartNum(that.data.Cartlist[index].Id, nuber,
          function () {
            that.data.Cartlist[index].Num = nuber;
            var TotalMoney = that.data.TotalMoney * 1; //计算价格
            if (that.data.Cartlist[index].img == "/images/cart_b.png") {
              TotalMoney = (TotalMoney * 1) + (that.data.Cartlist[index].Price * 1);
            }
            if (TotalMoney != 0) {
              TotalMoney = TotalMoney.toFixed(2);
            }
            that.setData({
              Cartlist: list,
              TotalMoney: TotalMoney,
              IsRun: true,
              TotalNuber: totalNum
            })

            wx.setTabBarBadge({
              index: 2,
              text: totalNum.toString()
            })
          });
      }
    
  },
  onShow: function () {
    if (!app.IS_Masge) {
      wx.showLoading({
        title: '该区域暂未开通！',
      })
      return;
    }
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
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#47b34e',
        animation: {
          duration: 40,
          timingFunc: 'easeIn'
        }
      })
    }

    that.GetList(1);
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
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#47b34e',
        animation: {
          duration: 40,
          timingFunc: 'easeIn'
        }
      })
    }

    if (!app.IS_Masge) {
      wx.showLoading({
        title: '该区域暂未开通！',
      })
      return;
    }
    
    //that.GetList(1);
    // 生命周期函数--监听页面加载
    // showView: (options.showView == "true" ? true : false),
    
  },
  clickNum: function (e) {
    console.log(e.target.dataset.num)
    this.setData({
      _num: e.target.dataset.num
    })
  },
  GetList: function (page) { //获取所有数据
    var that = this
    var pageSize =99999;
    console.log("page=" + page);
    var openid = app.openid;
    console.log("11");
    console.log(app.storeId);
    var TotalNuber = 0;
    app.request('api/Cart/GetUserCartList', {
      page: page,
      pageSize: pageSize,
      openid: openid,
      marketid: app.storeId
    }, "POST",
      function (res) {
        console.log("page=" + page);
        console.log(res);
        if (res.data.flag == true) {
          var Cartlistimg = [];
          var TotalMoney = 0; //计算价格
          if (page > 1) {
            console.log("*********");
            console.log(that.data.Cartlist);
            Cartlistimg = that.data.Cartlist;
            TotalMoney = that.data.TotalMoney; //计算价格
          }
          var index = Cartlistimg.length;
          console.log("index=" + index);
          console.log(res.data.list);
          
          for (var i = 0; i < res.data.list.length; i++) {
            
            Cartlistimg[i + index] = ({
              masgetype: false,
              Id: res.data.list[i].Id,
              UnitId: res.data.list[i].UnitId,
              UnitName: res.data.list[i].UnitName,
              ProductName: res.data.list[i].ProductName,
              Price: res.data.list[i].Price.toFixed(2),
              OldPrice: res.data.list[i].OldPrice.toFixed(2),
              Num: res.data.list[i].Num,
              PictureId: res.data.list[i].PictureId,
              ProductId: res.data.list[i].ProductId,
              IsBusiness: res.data.list[i].IsBusiness,
              img: "/images/cart_b.png"
            });
            console.log("Price:" + Cartlistimg[i].Price);
            console.log("Num:" + Cartlistimg[i].Num);
            TotalNuber += Cartlistimg[i].Num;
            console.log("TotalNuber:" + TotalNuber);
            TotalMoney = (TotalMoney * 1) + (Cartlistimg[i].Price * Cartlistimg[i].Num);
            console.log("TotalMoney:" + TotalMoney);
          }

          console.log(Cartlistimg);
          that.setData({
            masgetype: false,
            Cartlist: Cartlistimg,
            IsLog: true,
            IsNull:false,
            QuanXuan: "/images/cart_b.png",
            TotalMoney: TotalMoney.toFixed(2),
            TotalNuber: TotalNuber
          })
        } else {
          if (page > 1) {
            that.setData({
              masgetype: false,
              IsLog: false,
              IsNull: false,
             
            })
          } else {
            that.setData({
              Cartlist: [],
              masgetype: false,
              IsLog: false,
              IsNull: true,
              TotalMoney: "0.00",
              TotalNuber:0
            })
          }    
        }
        console.log("----zdh 479 totalNum" + that.data.TotalNuber);
        wx.setTabBarBadge({
          index: 2,
          text: that.data.TotalNuber.toString()
        })
      },
      function () { //error
        wx.showToast({
          title: '购物车无数据',
          icon: 'loading',
          duration: 2000
        });
      }
    );
  },

  CartOnclick: function (event) { //点击选择
    var id = event.currentTarget.dataset.id; //编号
    var pri = event.currentTarget.dataset.pri; //价格
    var mun = event.currentTarget.dataset.mun; //数量
    var pid = event.currentTarget.dataset.pid; //产品编号
    var index = event.currentTarget.dataset.index;
    var TotalMoney = this.data.TotalMoney * 1; //计算价格


    if (this.data.Cartlist[index].img == "/images/cart_a.png") {
      this.data.Cartlist[index].img = "/images/cart_b.png";
      if (mun == 0) {
        mun = 1;
        this.data.Cartlist[index].Num = mun;
      }
      TotalMoney = (TotalMoney * 1) + (pri * mun);
    } else {
      this.data.Cartlist[index].img = "/images/cart_a.png";
      TotalMoney = (TotalMoney * 1) - (pri * mun);
    }
    var magg = true;
    var list = this.data.Cartlist
    for (var i = 0; i < list.length; i++) {
      if (list[i].img == "/images/cart_a.png") {
        magg = false;
      }
    }
    if (TotalMoney != 0) {
      TotalMoney = TotalMoney.toFixed(2);
    }
    var list = this.data.Cartlist;

    if (magg) {
      this.setData({
        Cartlist: list,
        TotalMoney: TotalMoney,
        QuanXuan: "/images/cart_b.png"
      })
    } else {
      this.setData({
        Cartlist: list,
        TotalMoney: TotalMoney,
        QuanXuan: "/images/cart_a.png"
      })
    }

  },
  QuanXuanOnck: function () { //全选
    var list = this.data.Cartlist;
    var TotalMoney = 0; //计算价格
    var QuanXuan = "";
    if (this.data.QuanXuan == "/images/cart_a.png") {
      for (var i = 0; i < list.length; i++) {
        list[i].img = "/images/cart_b.png";
        TotalMoney = (TotalMoney * 1) + (list[i].Price * list[i].Num);
      }
      QuanXuan = "/images/cart_b.png";
    } else {
      TotalMoney = this.data.TotalMoney * 1; //计算价格
      for (var i = 0; i < list.length; i++) {
        list[i].img = "/images/cart_a.png";
        TotalMoney = (TotalMoney * 1) - (list[i].Price * list[i].Num);
      }
      QuanXuan = "/images/cart_a.png";
    }
    if (TotalMoney != 0) {
      TotalMoney = TotalMoney.toFixed(2);
    }
    this.setData({
      Cartlist: list,
      QuanXuan: QuanXuan,
      TotalMoney: TotalMoney
    })
  },
  formSubmit:function(e){
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

  buttonSman: function () { //提交订单

    


    var list = this.data.Cartlist;
    var tid = "";
    var IsBusiness =true;
    for (var i = 0; i < list.length; i++) {
      if (list[i].img == "/images/cart_b.png") {
        if (tid == "") {
          tid = tid + list[i].Id;
        } else {
          tid = tid + "," + list[i].Id;
        }
        if (!list[i].IsBusiness){
          IsBusiness=false;
        }
      }
    }
   
    if (!IsBusiness) {
      wx.showToast({
        title: '有打烊店铺，请重新选择！',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (tid == "") {
      wx.showToast({
        title: '请选择产品',
        icon: 'loading',
        duration: 2000
      });
    } else {
      //跳转
      var cartids = tid
      console.log("tid=" + tid);
      app.request('api/Order/More', {
        "cartids": cartids,
        "openid": app.openid
      }, "POST",
        function (res) {
          console.log("12312312");
          console.log(res);
          if (res.data.flag == true) {
            var orderId = res.data.orderId;
            app.PreferentialId = 0; //优惠券id
              app.PreferentialPrice = 0;//优惠券金额

              wx.navigateTo({
                url: '../../shop_list/shop_order/shop_order?id=' + orderId ,
              })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success: function (e) {
                if (e.confirm) {
                  console.log('用户点击确定')
                } else if (e.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        function (error) { //error
          wx.showToast({
            title: '下单失败',
            icon: 'loading',
            duration: 2000
          });
        }
      );
    }
  },
  OnClikeDel: function (e) { //删除购物车产品
    var that = this
    var id = e.currentTarget.dataset.caid; //编号

    //记录是否全选
    var isSelectAll = that.data.QuanXuan;

    //执行删除
    wx.showModal({
      title: '提示',
      content: '是否删除该商品？',
      success: function (res) {
        if (res.confirm) {
          app.request('api/Cart/' + id, {}, "DELETE",
            function (res) {
              if (res.data.flag) {
                //重新计算总价
                that.setData({
                  TotalMoney: 0.00,
                  QuanXuan: "/images/cart_a.png",
                })
              }
              that.GetList(1);
            },
            function (error) { //error
              wx.showToast({
                title: '删除失败',
                icon: 'loading',
                duration: 2000
              });
            }
          );
        } else {
          return;
        }
        
      }
    })



  },
  // 下拉刷新  
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
  onReachBottom(e) {
    let that = this;
    if (that.data.IsLog) {
      console.log("翻页");
      var page = that.data.page + 1;
      that.setData({
        page: page
      });
      that.GetList(page);
    } else {
      console.log("没有了");
    }
  },

})
const app = getApp()
Page({
  data: {
    pageIndex: 1,
    icon_SH: false,
    currentTab: 0,
    TypeList: [],
    isRull: true,
    ProductList: [],
  },

  next_btn: function() {
    wx.navigateTo({
      url: '/pages/backstage/home/batchMan/hasSelected/hs',
    })
  },

  set_iconSH: function(e) {
    var that = this;
    console.log(e);
    var pid = e.currentTarget.dataset.pid;
    var tid = e.currentTarget.dataset.tid;
    var list = that.data.ProductList;
    for (var i = 0; i < list.length; i++) {
      if (pid == list[i].Id) {
        if (tid == 1) {
          console.log("选择");
          //选择
          list[i].select = true;
          //保存选择
          app.HomSelectPordt.push(list[i]);

        } else {
          console.log("取消");
          //取消
          list[i].select = false;
          //删除保存选择
          for (var t = 0; t < app.HomSelectPordt.length; t++) {
            if (list[i].Id == app.HomSelectPordt[t].Id) {
              app.HomSelectPordt.splice(t, 1);
            }
          }
        }
        console.log(app.HomSelectPordt);
      }
    }

    that.setData({
      ProductList: list
    });


  },
  switchRightNav: function(e) {
    console.log(e)
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
      that.getProductList(1);
    }
  },
  onLoad: function(options) {
    var that = this;
    app.request('api/Category/GetStoreTypeList?sid=' + app.HomeStore.Id, {}, "GET",
      function(res) {
        console.log("获取分类");
        console.log(res.data.list);
        if (res.data.flag) {
          var list = res.data.list;
          that.setData({
            TypeList: list,
            currentTab: 0
          });
          that.getProductList(1);
        }
      },
      function() {
        wx.showToast({
          title: '获取分类无效',
          icon: 'loading',
          duration: 2000
        });
      })

  },
  onShow: function() {
    var that = this;

  },
  getProductList: function(page) {
    var that = this;
    app.request('api/Product/GetStoreProductByType', {
        pageIndex: page,
        pageSize: 20,
        TypeId: that.data.currentTab,
        OpenId: app.openid,
        StoreId: app.HomeStore.Id
      }, "POST",
      function(res) {
        console.log("获取产品");
        console.log(res.data);
        if (res.data.flag) {
          var list = res.data.list;
          var plist = [];
          if (page > 1) {
            plist = that.data.ProductList;
          }
          for (var p = 0; p < list.length; p++) {
            var tlist = list[p].ProductList;
            for (var y = 0; y < tlist.length; y++) {
              tlist[y].Price = tlist[y].Price.toFixed(2);
              tlist[y].InPrice = tlist[y].InPrice.toFixed(2);
              plist.push(tlist[y]);
            }
          }
          console.log(plist);
          that.setData({
            ProductList: plist,
            isRull: true,
            pageIndex: page
          });
        } else {
          that.setData({
            ProductList: [],
            isRull: false,
          });
        }
        setTimeout(function() {
          wx.hideLoading()
        }, 200)
      },
      function() {
        wx.showToast({
          title: '获取产品无效',
          icon: 'loading',
          duration: 2000
        });
        setTimeout(function() {
          wx.hideLoading()
        }, 200)
      })
  },
  //翻页
  lower: function(e) {
    var that = this;
    console.log("翻页");
    if (that.data.currentTab == 0) {
      if (that.data.isRull) {
        var page = that.data.pageIndex + 1;
        that.getProductList(page);
      }

    }
  },
  //全选/返选
  SelectAll: function() {
    var that = this;
    var list = that.data.ProductList;
    var isSelect = false;
    if (list.length > 0) {
      isSelect = list[0].select;
    }
    for (var i = 0; i < list.length; i++) {

      if (!isSelect) {
        list[i].select = true;
        //保存选择
        app.HomSelectPordt.push(list[i]);
      } else {
        list[i].select = false;
        //删除保存选择
        for (var t = 0; t < app.HomSelectPordt.length; t++) {
          if (list[i].Id == app.HomSelectPordt[t].Id) {
            app.HomSelectPordt.splice(t, 1);
          }
        }
      }

    }
    that.setData({
      ProductList: list
    })
  },
  //批量上架
  AllUp: function() {
    var that = this;
    var list = that.data.ProductList;
    var pid = "";
    for (var i = 0; i < list.length; i++) {
      if (pid.length == 0) {
        if (list[i].select) {
          pid += list[i].Id;
        }

      } else {
        if (list[i].select) {
          pid += "," + list[i].Id;
        }
      }
    }
    if (pid.length == 0) {
      wx.showToast({
        title: '请勾选产品',
      })
      return;
    } else {
      that.UpLowProduct(pid, 1);
    }
  },
  //批量下架
  AllLow: function() {
    var that = this;
    var list = that.data.ProductList;
    var pid = "";
    for (var i = 0; i < list.length; i++) {
      if (pid.length == 0) {
        if (list[i].select) {
          pid += list[i].Id;
        }

      } else {
        if (list[i].select) {
          pid += "," + list[i].Id;
        }
      }
    }
    if (pid.length == 0) {
      wx.showToast({
        title: '请勾选产品',
      })
      return;
    } else {
      that.UpLowProduct(pid, 2);
    }

  },
  //产品批量上下架，单个也可以
  //pid:产品id以逗号分开
  //status：1上架 2下架
  UpLowProduct: function (pid, status) {
    var that=this;
    var url = 'api/Product/SetListUpperDownShelf'
    app.request(url, {
      pid: pid,
      status: status
    }, 'GET', function (res) {
      wx.showToast({
        title: res.data.msg,
        icon: 'success',
        duration: 2000
      })
      that.getProductList(1);
    }, function () {

    })
  },



})
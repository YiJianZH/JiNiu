const app = getApp()
Page({
  data: {
    toView: "",
    TypeList: [],
    ProductList: [],
    currentTab: 0, 
    NameText: "",//搜索名称

  },

  setSH: function (e) {
    var that = this;
    var list = that.data.ProductList;
    var ptid = e.currentTarget.dataset.ptid;
    var pidx = e.currentTarget.dataset.pidx;
    var tidx = e.currentTarget.dataset.tidx;
    if (ptid==1){
      list[pidx].ProductList[tidx].isSelected=true;
      //保存选择
      app.HomCouponPordt.push(list[pidx].ProductList[tidx]);
    }else{
      list[pidx].ProductList[tidx].isSelected = false;
      //删除保存选择
      for (var t = 0; t < app.HomCouponPordt.length; t++) {
        if (list[pidx].ProductList[tidx].Id == app.HomCouponPordt[t].Id) {
          app.HomCouponPordt.splice(t, 1);
        }
      }
    }
    that.setData({
      ProductList: list
    });
    
  },
  switchRightNav: function (e) {
    console.log(e)
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
      console.log("currentTab=" + that.data.currentTab);
      that.GetDataList(1);

    }
  },
  toggle_third: function () {
    var that = this;
    console.log(e);
    var cid = e.currentTarget.dataset.cid
    that.setData({
      toView: 'pit' + cid
    });
  },
  onShow: function (e) {
    var that = this;
    that.GetDataList(1);
  },
  onLoad: function (e) {
    var that = this;
    app.request('api/Category/GetStoreTypeList?sid=' + app.HomeStore.Id, {}, "GET",
      function (res) {
        console.log("获取分类");
        console.log(res.data.list);
        if (res.data.flag) {
          var list = res.data.list;
          that.setData({
            TypeList: list,
          });

        }
      },
      function () {
        wx.showToast({
          title: '获取商家无效',
          icon: 'loading',
          duration: 2000
        });
      })

  },
  GetDataList: function (page) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    var pageSize = that.data.pageSize;
    if (that.data.currentTab == 0) {
      pageSize = 20
    } else {
      pageSize = 99999
    }
    app.request('api/Product/GetStoreProductByType', {
      pageIndex: page,
      pageSize: pageSize,
      TypeId: that.data.currentTab,
      OpenId: app.openid,
      StoreId: app.HomeStore.Id,
      Name: that.data.NameText
    }, "POST",
      function (res) {
        console.log("获取产品");
        console.log(res.data);
        if (res.data.flag) {
          var list = res.data.list;
          var pnuber = res.data.nbuer;
          for (var p = 0; p < list.length; p++) {
            for (var y = 0; y < list[p].ProductList.length; y++) {
              list[p].ProductList[y].Price = list[p].ProductList[y].Price.toFixed(2);
              list[p].ProductList[y].InPrice = list[p].ProductList[y].InPrice.toFixed(2);
              list[p].ProductList[y].isSelected=false;
              for (var t = 0; t < app.HomCouponPordt.length; t++) {
                if (list[p].ProductList[y].Id == app.HomCouponPordt[t].Id) {
                  list[p].ProductList[y].isSelected = true;
                }
              }
            }
          }
          

          if (page > 1) {
            var itemlist = list[0].ProductList;
            var tlist = that.data.ProductList;
            if (itemlist.length > 0) {
              console.log("添加");
              that.setData({
                isRull: true,
                pageIndex: page
              });
              var timetlist = tlist.ProductList;
              var index = timetlist.length;
              for (var i = 0; i < itemlist.length; i++) {
                timetlist[i + index] = itemlist[i]
              }
              tlist.ProductList = timetlist;
              list = tlist;
            } else {
              console.log("没有数据");
              that.setData({
                isRull: false
              });
              list = tlist;
            }
          }
          that.setData({
            ProductList: list,
            productNuber: pnuber
          });

        }

        setTimeout(function () {
          wx.hideLoading()
        }, 200)
      },
      function () {
        wx.showToast({ title: '获取产品无效', icon: 'loading', duration: 2000 });
        setTimeout(function () {
          wx.hideLoading()
        }, 200)
      })


  },
  setNameText: function (e) {
    this.setData({
      NameText: e.detail.value
    });
  },
  onclikSelect: function () {
    var that = this;
    that.GetDataList(1);
  },
  OnlickOK:function(){
    wx.navigateBack({
      delta: 1
    })
  }

})
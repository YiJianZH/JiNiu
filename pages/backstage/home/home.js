const app = getApp()
Page({
  data: {
    _num: 1, 
    homeTrue:true,
    toView: "",
    TypeList: [],
    ProductList:[],
    currentTab: 0,
    productNuber:0,
    NameText:"",//搜索名称
    pop_sh: true,
    pageIndex: 1,
    pageSize: 20,
    isRull:true,
    UpdateProud:{},//修改对象
    TProud: {},//暂时显示对象
    batchPopSH: true,
    x: 0,
    y: 0,
    PFlist: [{ Nuber: 0, Discount: 0 }],

  },
  clickNum: function (e) {
    var that = this;
    console.log(e.target.dataset.num)
    that.setData({
      _num: e.target.dataset.num
    })

    
    that.GetDataList(1);
  },

  to_client: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //批量上架
  cancelBatchAdd: function () {
    var that = this;
    console.log("批量上架");
    wx.showModal({
      title: '提示',
      content: '确定全部批量上架？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '执行中...',
          })
          var productId="";
          var list = that.data.ProductList[0].ProductList;
          for (var i = 0; i <list.length;i++){
            if (productId==""){
              productId += list[i].Id;
            }else{
              productId +=","+ list[i].Id;
            }

          }
          console.log("productId=" + productId);
          if (productId==""){
            wx.showToast({ title: '没有上架产品', icon: 'loading', duration: 2000 });
            return false;
          }
          app.request('api/Product/SetListUpperShelf?pid=' + productId, {}, "GET",
            function (res) {
              console.log("上架中");
              console.log(res);
              setTimeout(function () {
                wx.hideLoading()
              }, 2000)
              if (res.data.flag) {
                wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
              }else{
                wx.showToast({ title: '失败', icon: 'success', duration: 2000 });
              }
              setTimeout(function () {
                that.setData({
                  batchPopSH: true
                })
                that.GetDataList(1);
              }, 2000)
            },
            function () {
              setTimeout(function () {
                wx.hideLoading()
              }, 2000)
              wx.showToast({ title: '上架不成功', icon: 'loading', duration: 2000 });
            }
          );




        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


    
  },
  shangjia: function (productId){
    var that = this;

  },
  onShow: function (e) {
    var that = this;
    that.GetDataList(1);
  },
  onLoad:function(e){
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
      }
    )

    that.setData({
      x: app.WX,
      y: app.WY-400
    });
  },
  GetDataList: function (page){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    var pageSize = that.data.pageSize;
    if (that.data.currentTab==0){
      pageSize=20
    } else{
      pageSize = 99999
    }
    app.request('api/Product/GetStoreProductByType' , {
      pageIndex: page,
      pageSize: pageSize,
      TypeId: that.data.currentTab,
      OpenId: app.openid,
      StoreId: app.HomeStore.Id,
      Name: that.data.NameText,
      isRestaurant: that.data._num
    }, "POST",
      function (res) {
        console.log("获取产品");
        console.log(res.data);
        if (res.data.flag) {
          var list = res.data.list;
          var pnuber = res.data.nbuer;
          for (var p = 0; p < list.length;p++){
            for (var y = 0; y < list[p].ProductList.length; y++) {
              list[p].ProductList[y].Price = list[p].ProductList[y].Price.toFixed(2);
              list[p].ProductList[y].InPrice = list[p].ProductList[y].InPrice.toFixed(2);
            }
          }
          
          if (page>1){
            var itemlist = list[0].ProductList;
            var tlist = that.data.ProductList;
            
            if (itemlist.length>0){
              console.log("添加");
              that.setData({
                isRull:true,
                pageIndex: page
              });
              console.log(tlist);
              var timetlist = tlist[0].ProductList;
              console.log(timetlist);
              var index = timetlist.length;
              
              for (var i = 0; i < itemlist.length;i++){
                timetlist[i + index] = itemlist[i]
              }
              tlist.ProductList = timetlist;
              list = tlist;
            }else{
              console.log("没有数据");
              that.setData({
                isRull: false
              });
              list = tlist;
            }
          }
          console.log("!!!!!!!!!!!!!");
          console.log(list);
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
        wx.showToast({title: '获取产品无效',icon: 'loading',duration: 2000});
        setTimeout(function () {
          wx.hideLoading()
        }, 200)
      })

   
  },
  to_home: function () {
    wx.reLaunch({
      url: '/pages/backstage/home/home'
    })
  },
  to_so: function () {
    wx.reLaunch({
      url: '/pages/backstage/home/storeOperation/so'
    })
  },
  to_setting: function () {
    wx.reLaunch({
      url: '/pages/backstage/home/setting/setting',
    })
  },
  //设置库存
  setting_btna: function (e) {
    var that = this;
    console.log(e);
    var pidx = e.currentTarget.dataset.pidx;
    var tidx = e.currentTarget.dataset.tidx;
    var proud = that.data.ProductList[pidx].ProductList[tidx];
    console.log(proud);
    that.setData({
      pop_sh: false,
      UpdateProud: proud,
      TProud: proud
    })
  },
  switchRestaurant:function(){
    var that = this;
    var proud = that.data.UpdateProud;
    if (proud.IsRestaurant){
      proud.IsRestaurant=false;
    }else{
      proud.IsRestaurant = true;
    }
    that.setData({
      UpdateProud: proud,
    })
  },
  //设置库存
  pop_hide: function () {
    this.setData({
      pop_sh: true
    })
  },
  onclikSelect:function(){
    var that = this;
    that.GetDataList(1);
  },
  setNameText:function(e){
    this.setData({
     NameText:e.detail.value
    });
  },
  to_newGoods: function () {
    wx.navigateTo({
      url: '/pages/backstage/home/newGoods/nd',
    })
  },
  to_goods_man: function () {
    wx.navigateTo({
      url: '/pages/backstage/home/batchMan/bm',
    })
  },
  switchRightNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      if (e.currentTarget.dataset.current==-1){
        this.setData({
          batchPopSH: false
        })
      }else{
        this.setData({
          batchPopSH: true
        })
      }
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
      console.log("currentTab=" + that.data.currentTab);
      that.GetDataList(1);

    }
  },
  //点击三级分类
  toggle_third: function (e) {
    var that = this;
    console.log(e);
    var cid = e.currentTarget.dataset.cid
    that.setData({
      toView: 'pit' + cid
    });
  },
  //翻页
  lower:function(e){
    var that = this;
    console.log("翻页");
    if (that.data.currentTab==0){
      if (that.data.isRull){
        var page = that.data.pageIndex + 1;
        that.GetDataList(page);
      }
      
    }
  },
  setUpdatePrice:function(e){
    var Price = e.detail.value;
    console.log(Price);
    var UpdateProud = this.data.UpdateProud;
    UpdateProud.Price = Price;
    this.setData({
      UpdateProud: UpdateProud
    });
  },
  setUpdateInPrice:function(e){
    var InPrice = e.detail.value;
    var UpdateProud = this.data.UpdateProud;
    UpdateProud.InPrice =InPrice;
    this.setData({
      UpdateProud: UpdateProud
    });
  },
  setUpdateInventory:function(e){
    var Inventory = e.detail.value;
    var UpdateProud = this.data.UpdateProud;
    UpdateProud.Inventory = parseInt(Inventory);
    this.setData({
      UpdateProud: UpdateProud
    });
  },
  setUpdateSafeStock:function(e){
    var SafeStock = e.detail.value;
    var UpdateProud = this.data.UpdateProud;
    UpdateProud.SafeStock = parseInt(SafeStock);
    this.setData({
      UpdateProud: UpdateProud
    });
  },
  setUpdateUnit:function(e){
    var Unit = e.detail.value;
    var UpdateProud = this.data.UpdateProud;
    UpdateProud.Unit = Unit;
    this.setData({
      UpdateProud: UpdateProud
    });
  },
  //修改
  OnlickUpdate:function(){
    var that = this;
    var UpdateProud = that.data.UpdateProud;
    if (UpdateProud.Price<=0){
      wx.showToast({title: '请输入正确的价格',icon: 'none',duration: 2000 });
      return false;
    }
    if (UpdateProud.Inventory <= 0) {
      wx.showToast({ title: '请输入正确的库存', icon: 'none', duration: 2000 });
      return false;
    }
    app.request('api/Product/UpdateUnitByUid', {
      uid: UpdateProud.UnitId,
      uname: UpdateProud.Unit,
      price: UpdateProud.Price,
      inventory: UpdateProud.Inventory,
      safeStock: UpdateProud.SafeStock,
      inPrice: UpdateProud.InPrice,
      isRestaurant: UpdateProud.IsRestaurant
    }, "POST",
      function (res) {
        console.log("修改中");
        console.log(res);
        if (res.data.flag) {
          wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
          setTimeout(function(){
            that.setData({
              pop_sh: true
            })
            that.onShow();
          },2000)
        }
      },
      function () {
        wx.showToast({title: '修改不成功',icon: 'loading',duration: 2000});
      }
    );

  },
  setUpper_btna:function(e){
    var that = this;
    var pid = e.currentTarget.dataset.pid
    app.request('api/Product/SetUpperShelf?pid=' + pid+'&tid=1', {}, "GET",
      function (res) {
        console.log("上架中");
        console.log(res);
        if (res.data.flag) {
          wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
          setTimeout(function () {
            that.setData({
              pop_sh: true
            })
            that.onShow();
          }, 2000)
        }
      },
      function () {
        wx.showToast({ title: '上架不成功', icon: 'loading', duration: 2000 });
      }
    );

  },
  setDeletUnit:function(e){
    var that = this;
    console.log(e);
    var uid = e.currentTarget.dataset.uid;
    wx.showModal({
      title: '删除',
      content: '是否确定删除该规格？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.request('api/Product/DeleteUnitById?uid=' + uid, {}, "GET",
            function (res) {
              console.log("删除中");
              console.log(res);
              if (res.data.flag) {
                wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
                setTimeout(function () {
                  that.setData({
                    pop_sh: true
                  })
                  that.onShow();
                }, 2000)
              }
            },
            function () {
              wx.showToast({ title: '删除不成功', icon: 'loading', duration: 2000 });
            }
          );

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //单个产品下架
  setlow_btna:function(e){
    var id = e.currentTarget.dataset.pid;
    var url = 'api/Product/SetListUpperDownShelf'
    app.request(url, {
      pid: id,
      status: 2
    }, 'GET', function (res) {
      wx.showToast({
        title: res.data.msg,
        icon: 'success',
        duration: 2000
      })
      that.GetDataList(1);
    }, function () {

    })

   
  },
  ptDing:function(){
    wx.navigateTo({
      url: '/pages/backstage/home/ptDing/ptDing',
    })
  },
  
  popHide:function(){
    this.setData({
      homeTrue: true
    })
  },
  AddPFist:function(){
    var PFlist = this.data.PFlist;
    PFlist.push({ Nuber: 0, Discount: 0 });
    this.setData({
      PFlist: PFlist
    });
  },
  //保存规格批发价格
  PostPFist:function(){
    var that = this;
    var PFlist = that.data.PFlist;
    var lsit= [];
    for (var i = 0; i <PFlist.length;i++){
      if (PFlist[i].Nuber > 0 && PFlist[i].Discount>0){
        lsit[i] = { nuber: PFlist[i].Nuber, discount: PFlist[i].Discount }
      }
      
    }
    var UpdateProud = that.data.UpdateProud;
    var jsonList = JSON.stringify(lsit);

    app.request('api/Product/UpdateJsonUnidtPFZK', {
      UidtId: UpdateProud.UnitId,
      PFZKList: jsonList,
    }, "POST",
      function (res) {
        console.log("保存");
        console.log(res);
        wx.showToast({ title: res.data.msg, icon: 'none', duration: 2000 });

        var PFlist=[{ Nuber: 0, Discount: 0 }];
        that.setData({
          homeTrue: true,
          PFlist: PFlist
        })
      },
      function () {
       
      }
    );


  },

  //编辑数量
  setNuber:function(e){
    console.log(e);
    var PFlist = this.data.PFlist;
    var idx = e.currentTarget.dataset.idx;
    var value = e.detail.value;
    PFlist[idx].Nuber = value;
    console.log(PFlist);
    this.setData({
      PFlist: PFlist
    });
  },
  //编辑折扣
  setDiscount:function(e){
    console.log(e);
    var PFlist = this.data.PFlist;
    var idx = e.currentTarget.dataset.idx;
    var value = e.detail.value;
    PFlist[idx].Discount = value;
    console.log(PFlist);
    this.setData({
      PFlist: PFlist
    });
  }

  



})
const app = getApp()
Page({
  data: {
    ProductList: [],
  },
  saveBack: function () {
    var that = this;
    var jsonList= JSON.stringify(that.data.ProductList);
    app.request('api/Product/UpdateJsonProduct', {
      StoreId: app.HomeStore.Id,
      OpenId: app.openid,
      UidtList: jsonList,
      Id: 0
    }, "POST",
      function (res) {
        console.log("获取");
        console.log(res);
        if (res.data.flag) {
          wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
          
        }else{
          wx.showToast({ title: '失败', icon: 'none', duration: 2000 });
        }
        app.HomSelectPordt=[];
        setTimeout(function(){
          wx.reLaunch({
            url: '/pages/backstage/home/home'
          })
        },2000)
        
      },
      function () {
        wx.showToast({ title: '获取分类无效', icon: 'loading', duration: 2000 });
      })

  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      ProductList: app.HomSelectPordt
    });
  },
  onShow: function () {
    var that = this;
  },
  setPrice:function(e){
    var that = this;
    var pindx = e.currentTarget.dataset.pindx;
    var Price = e.detail.value;
    var list = that.data.ProductList;
    list[pindx].Price = Price
    that.setData({
      ProductList: list
    });
  },
  setTitle: function (e) {
    var that = this;
    var pindx = e.currentTarget.dataset.pindx;
    var Title = e.detail.value;
    var list = that.data.ProductList;
    list[pindx].Title = Title
    that.setData({
      ProductList: list
    });
  },

  setInventory:function(e){
    var that = this;
    var pindx = e.currentTarget.dataset.pindx;
    var Inventory = e.detail.value;
    var list = that.data.ProductList;
    list[pindx].Inventory = Inventory
    that.setData({
      ProductList: list
    });
  },
  setInPrice:function(e){
    var that = this;
    var pindx = e.currentTarget.dataset.pindx;
    var InPrice = e.detail.value;
    var list = that.data.ProductList;
    list[pindx].InPrice = InPrice
    that.setData({
      ProductList: list
    });
  },
  setSafeStock:function(e){
    var that = this;
    var pindx = e.currentTarget.dataset.pindx;
    var SafeStock = e.detail.value;
    var list = that.data.ProductList;
    list[pindx].SafeStock = SafeStock
    that.setData({
      ProductList: list
    });
  }
})
const app = getApp()
Page({
  data: {
    listTrue:true,
    StoreId:0,//店铺ID
    listLi:[],
    update:{},
  },
  onLoad: function (options) {
    var that = this;
    console.log(app.HomeStore);
    that.setData({
      StoreId: app.HomeStore.Id
    }); 
  },
  onShow:function(){
    var that = this;
    that.GetDataList(1);
  },
  GetDataList: function (page){
    var that = this;
    app.request('api/Store/GetStoreDiscount?page=' + page + '&pageSize=10&StoreId=' + that.data.StoreId, {}, "GET",
      function (res) {
        console.log(res);
        if (res.data.flag){
          var list = res.data.list;
          
          that.setData({
            listLi: list
          });

        }
      },
      function (error) { //error

      }
    );
  },
  setSatisfyPrice:function(e){
    console.log(e);
    var value = e.detail.value;
    var update = this.data.update;
    update.SatisfyPrice = value;
    this.setData({
      update: update
    });
  },
  setProportion: function (e) {
    console.log(e);
    var value = e.detail.value;
    var update = this.data.update;
    update.Proportion = value;
    this.setData({
      update: update
    });
  },
  //编辑
  showClick:function(e){
    this.setData({ listTrue: false }) 
    console.log(e);
    var list = this.data.listLi;
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      update: list[idx]
    });

  },
  hideClick: function () {
    this.setData({ listTrue: true })
  },
  Adddate:function(){
    this.setData({ listTrue: false })
    this.setData({
      update: {}
    });
  },
  delectClick:function(e){
    var that = this;
    console.log("删除");
    console.log(e);
    var list = that.data.listLi;
    var idx = e.currentTarget.dataset.idx;
    app.request('api/Store/DelectStoreDiscount?Id=' + list[idx].Id, {}, "GET",
      function (res) {
        console.log(res);
        if (res.data.flag) {
          wx.showToast({ title: "成功！", duration: 2000 });
        } else {
          wx.showToast({ title: "失败", duration: 2000 });
        }
       
        that.GetDataList(1);
      },
      function (error) { //error

      }
    );



  },

  //保存
  SaveData:function(e){
    var that = this;
    console.log(that.data.update);
    var entity = that.data.update;
    if (entity.SatisfyPrice<=0){
      wx.showToast({ title: "折扣条件输入错误", duration: 2000 });
      return ;
    }
    if (entity.Proportion <= 0) {
      wx.showToast({ title: "折扣比例输入错误", duration: 2000 });
      return;
    }
    var id = entity.Id;
    if (id>0){
      console.log("修改");
      app.request('api/Store/UpdateStoreDiscount', {
        Id: entity.Id,
        TypeId: entity.TypeId,
        SatisfyPrice: entity.SatisfyPrice,
        Proportion: entity.Proportion
      }, "POST",
        function (res) {
          console.log(res);
          if (res.data.flag) {
            wx.showToast({ title: "成功！",duration: 2000});
          }else{
            wx.showToast({ title: "失败", duration: 2000 });
          }
          that.setData({ listTrue: true })
          that.GetDataList(1);
        },
        function (error) { //error
        });
    }else{
      console.log("新增");
      app.request('api/Store/AddStoreDiscount', {
        StoreId: that.data.StoreId,
        TypeId: 2,
        SatisfyPrice: entity.SatisfyPrice,
        Proportion: entity.Proportion
      }, "POST",
        function (res) {
          console.log(res);
          if (res.data.flag) {
            wx.showToast({ title: "成功！", duration: 2000 });
          } else {
            wx.showToast({ title: "失败", duration: 2000 });
          }
          that.setData({ listTrue: true })
          that.GetDataList(1);
        },
        function (error) { //error
        });
    }


  }

})
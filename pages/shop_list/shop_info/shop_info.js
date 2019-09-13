
//获取应用实例
const app = getApp()
Page({
  data: {
    Productlist:[],
    Nuber:0
  },


  //事件处理函数  
  changToTest: function () {
    wx.navigateTo({
      url: '../../pages/shop_page/shop_page'
    })
  },
  onLoad: function (option) {
    var that = this
    var orderId = option.id;
    that.BangData(orderId);
  },
  BangData: function (orderId){
    var that = this
    app.request('api/Order/Productlist?id=' + orderId, {}, "GET",
      function (res) {
        if (res.data.flag) {
          console.log(res.data.model);
          var model = res.data.model;
          for(var i=0;i<model.length;i++)
          {
            model[i].Price = model[i].Price.toFixed(2);
            model[i].OldPrice = model[i].OldPrice.toFixed(2);           

          }

          var list= [];
          console.log("model");
          console.log(model);
          for (var i = 0; i < model.length; i++) {
            var indx=0;
            console.log("SupplierId=" + model[i].SupplierId);
            for (var t = 0; t < list.length;t++){

              if (list[t].id == model[i].SupplierId) {
                indx=t;
              }
            }
            console.log("indx=" + indx);
            console.log(list);
            console.log(list.length);
            if (list.length>0){
              if (indx==0){
                if (list[0].id == model[i].SupplierId) {
                  console.log("添加55");
                  console.log(indx);
                  console.log(list[indx].Plist);
                  var sPlist = list[indx].Plist;
                  sPlist.push(model[i]);
                  console.log(sPlist);

                  list[indx].Plist = sPlist;
                }else{
                  console.log("新增11");
                  var sPlist = [];
                  sPlist.push(model[i]);
                  list.push({ id: model[i].SupplierId, name: model[i].SupplierName, Plist: sPlist });
                }

              }else{
                console.log("添加");
                console.log(indx);
                console.log(list[indx].Plist);
                var sPlist = list[indx].Plist;
                sPlist.push(model[i]);
                console.log(sPlist);

                list[indx].Plist = sPlist;
              }
              
            

            }else{
              console.log("新增22");
              var sPlist = [];
              sPlist.push(model[i]);
              list.push({ id: model[i].SupplierId, name: model[i].SupplierName, Plist: sPlist });
            }

          }
          console.log("11111");
          console.log(list);


          that.setData({
            Productlist: list,
            Nuber: res.data.model.length
          }); 
        }
      }, function (e) {//error
        wx.showToast({ title: '无数据', icon: 'loading', duration: 2000 });
      });
  },
 
})  
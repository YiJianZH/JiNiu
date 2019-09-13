//shop_cart.js
//获取应用实例
const app = getApp()

Page({
  data: {   
    OrderNo:"",
    Detail:[],
    DeliveryType:0,
    DeliveryCost:0,
    TotalMoney:0,//总金额
    PayMoney:0,//支付金额
    CouponMoney: 0,//优惠金额
    State:"",
    UserDeliveryTime:"",

  },

  
  onLoad: function(options) {
    console.log("onload")
    console.log(options)
    var that = this
    //调用实用的方法获取全局数据
   
    var orderid = options.oid

    var url = 'api/Order/GetDetail?id=' + orderid 
    app.request(url, {}, 'GET', function(res) {
      console.log(res);
      if (res.data.flag) {
        var model = res.data.model
        console.log(model);
        console.log("^^^^^^^^");
        var list = model.Detail;
        for (var i = 0; i < list.length;i++){
          list[i].Price = (parseFloat(list[i].Price) * parseFloat(list[i].Num)).toFixed(2)
        }


        that.setData({
          Detail: list,
          DeliveryType: model.DeliveryType,
          DeliveryCost: model.DeliveryCost.toFixed(2),
          TotalMoney: model.TotalMoney.toFixed(2),//总金额
          PayMoney: model.PayMoney.toFixed(2),//支付金额
          CouponMoney: model.CouponMoney.toFixed(2),//优惠金额
          State: model.State,
          UserDeliveryTime: model.UserDeliveryTime,
        });
       
        
       
      }
     
    }, function() {})
  },


})
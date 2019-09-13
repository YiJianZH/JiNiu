const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    ShareInfo:"",//分享说明
    newCouponList:[],//新手优惠券
    txt:[
      { pay: '90', payb: '5', txt:"新用户领券"},
      { pay: '90', payb: '5', txt: "新用户领券" },
      { pay: '90', payb: '5', txt: "新用户领券" },
      { pay: '90', payb: '5', txt: "新用户领券" }
    ],
    couponMoney:"0.00"
  },

  
  onShow: function () {
  
  },
  onLoad: function (options) {
   var that=this;
    that.GetShareInfo();
    that.GetFirstCoupon();
  },
//获取分享说明
GetShareInfo:function(){
  var that=this;
  app.request('api/Coupon/GetShareCoupon', {}, "GET",
    function (res) {
      console.log("获取分享说明");
      console.log(res);
      if (res.data.flag) {      
        ///描述HTML
        var article2 = res.data.msg;       
        WxParse.wxParse('article', 'html', article2, that, 5);
      }

    },
    function () {

    })

},
  //获取新手优惠券
  GetFirstCoupon: function () {
    var that = this;
     var Money=0;
    app.request('api/Coupon/GetProfitCoupon', { types: 1 }, "GET",
      function (res) {
        console.log("获取新手优惠券");
        console.log(res);
        if (res.data.flag) {
          var list = res.data.list;
          var newList = [];
          for (var i = 0; i < list.length; i++) {
            if(i<3)
            {
              newList.push({
                Id: list[i].Id,
                Price: parseFloat(list[i].Price).toFixed(0),
                Title: list[i].Title,
                BeginTime: list[i].BeginTime,
                IsPublish: list[i].IsPublish,
                Num: list[i].Num,
                ProductId: list[i].ProductId,
                CouponSendType: list[i].CouponSendType,
                CouponType: list[i].CouponType,
                Endline: list[i].Endline,
                Explanation: list[i].Explanation,
                FullNum: list[i].FullNum,
                FullPrice: parseFloat(list[i].FullPrice).toFixed(0),
                ProductType: list[i].ProductType,
                IsUsed: list[i].IsUsed
              })
              Money += parseFloat(list[i].FullNum) * parseFloat(list[i].Price)
            }
           
          }


          that.setData({
            newCouponList: newList,
            couponMoney: Money.toFixed(0)
          })
        }

      },
      function () {

      })

  },
  //面对面分享
  ShareFace:function()
  {
    wx.navigateTo({
      url: '/pages/my/my_tg/my_tg',
    })
  }
})



//shop_money.js
//获取应用实例
const app = getApp()


Page({
  data: {
    imga:"/images/zf_qr.png",
    zfcc:"支付成功",
    ts:"温馨提示：",
    p:"请在对应订单中查看收货二维码，工作人员送货上门时，请向工作人员出示收货二维码。注意事项，一旦工作人员扫描二维码后，该订单即为已送货，请在出示二维码前确认好商品情况，扫码后平台概不负责。",
    OrderNumber:"",
    DeliveryTime:"2017-12-12  10:25:20",
    OrderAmount:0,
    Timeout:5,
    Mseger:true
  },
  /*结束*/
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onPullDownRefresh: function () {
    this.onLoad()
  }, onShow: function () {
    var that = this
    if(that.data.Mseger==false){
      //跳转页面 
      wx.switchTab({
        url: '../../../pages/my/my',
        success: function (res) { var msge1 = res; },
        fail: function (res2) { var msge2 = res2; }
      });
    }   
  },
  onLoad: function (option) {
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
    }
    var orderId = option.orderId; 
    var AmountPayable = option.AmountPayable; 
    that.setData({
      OrderNumber: orderId,
      OrderAmount: AmountPayable
    });
    ///跳转
    setTimeout(function () {
      //跳转页面 
      wx.redirectTo({
        url: '../../../pages/my/my_order/my_order?id=2'
      })
      that.setData({
        Mseger:false
      });
    }, 5000)
    //时间提示
    that.SetDataTime(4);
  },
  SetDataTime: function (i) {
    var that = this
    if(i==0){
      return;
    }
    //修改时间
    setTimeout(function () {
      that.setData({
        Timeout: i
      });
      i--;
      that.SetDataTime(i);
    }, 1000)
  }
})
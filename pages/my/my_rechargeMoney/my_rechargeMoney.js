const app = getApp()
Page({
  data: {
    isRecharge: true,
    reTitleIn: '充值金额（元）',
    Money: 0,
    auTitleIn: '提现金额（元）',
    reMoney: 0,
    rtunmag: true,
    auMoneyIn: '',
    currIndex: 1,
    isclick: false,
    appUserType:1,
  },



  onLoad: function (options) {
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
      wx.setBackgroundColor({
        backgroundColor: '#0066FF', // 窗口的背景色为白色
      })
      that.setData({
        appUserType: app.appUserType
      });
    }
    var id = options.id
  
    if (id == 2)//1 充值 2 提现
    {
      that.setData({
        isRecharge: false,
      })
    }

    //获取金额
    var moneyurl = 'api/User/' + app.openid + '?marketId=' + app.Market.Id;
    app.request(moneyurl, {}, 'Get', function (res) {
      if (res.data.flag) {
        that.setData({
          Money: res.data.model.Money.toFixed(2),
        })
      }
    }, function () { })
  },

  //填写充值金额
  rechargeMoney: function (e) {
    var moneyin = e.detail.value;
    var Num = /^[0-9]*$/
    if (!Num.test(moneyin)) {
      wx.showToast({
        title: '请输入正数',
        icon: 'success',
        duration: 1500
      })
      
      return false;
    }
    else if (moneyin < 0) {
      wx.showToast({
        title: '金额必须大于0',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    this.setData({
      reMoney: e.detail.value
    })
  },
  //充值部分
  recharge: function (next) {
    var that = this
    if (that.data.isclick) {
      return;
    }
    that.setData({
      isclick: true,
    })
    if (that.data.rtunmag) {
      that.setData({
        rtunmag: false
      });
      if (that.data.isRecharge) {
        //充值
        //判定金额格式
        if (that.data.reMoney == "" || that.data.reMoney == null) {
          wx.showToast({
            title: '请输入金额',
            icon: 'success',
            duration: 1500
          })
          that.setData({
            isclick: false,
          })
          return false;
        }
        else if (that.data.reMoney < 0) {
          wx.showToast({
            title: '金额必须大于0',
            icon: 'success',
            duration: 1500
          })
          that.setData({
            isclick: false,
          })
          return false;
        }
        //后台生成一个订单号
        var No = "";
        var aurl = 'api/Order/GetRechargeNo?openid=' + app.openid;
        app.request(aurl, {}, 'GET', function (res) {
          if (true) {
            No = res.data.msg;
            //获取后台微信支付参数
            var timeStamp = '';
            var nonceStr = '';
            var packages = '';
            var paySign = '';
            //that.data.reMoney
            var burl = 'api/Order/GetPrepayid?openid=' + app.openid + '&total_fee=' + that.data.reMoney;
            app.request(burl, {}, 'GET', function (res) {
              console.log(res);
              if (res.data.flag) {
                wx.requestPayment({
                  'nonceStr': res.data.prepay.nonceStr,
                  'package': res.data.prepay.package,
                  'signType': 'MD5',
                  'timeStamp': res.data.prepay.timeStamp,
                  'paySign': res.data.prepay.paySign,
                  success: function (res) {
                    console.log(res);
                    if (res.errMsg == "requestPayment:ok") {
                
                        wx.showToast({
                          title: '支付成功！',
                          icon: 'success',
                          duration: 2000
                        });
                    
                    } else {
                      wx.showToast({
                        title: '支付失败',
                        icon: 'loading',
                        duration: 2000
                      });

                    }
                  },
                  fail: function (er) {

                    console.log(er);
                    console.log("关闭")
                    
                  }
                })
              }
            }, function () { })
          }
        }, function () { })
      } else {
        //提现方法
        var mony1 = parseFloat(that.data.reMoney);
        var mony2 = parseFloat(that.data.Money);
        if (mony2 < mony1){
          wx.showToast({
            title: '余额不足！',
            icon: 'loading',
            duration: 1500
          })
          that.setData({
            rtunmag: true,
            isclick: false,
          });
          return;
        }

        var durl = 'api/Bonus/Audit?money=' + that.data.reMoney + '&openid=' + app.openid + '&Source=3';
        app.request(durl, {}, 'GET', function (res) {
          if (res.data.flag) {
            wx.showToast({
              title: '提现申请成功',
              icon: 'success',
              duration: 1500
            })
            that.setData({
              rtunmag: true,
              isclick: false,
            });
            wx.navigateTo({
              url: '../../../pages/my/my_recharge/my_recharge'
            })
          }
        }, function () { })
      }
    }
  },
  orderSign: function (e) {//发送模板消息
    var that = this
    var fId = e.detail.formId;
    var fObj = e.detail.value;
    var money = fObj.txt_noney;
    //处理金额字段
    for (var k = 0; k < money.length; k++){
       var t_min=money[k];
       if (t_min=="."){
         money = money.substring(k-1);
         k = money.length;
       }else{
         if (t_min != 0) {
           money = money.substring(k);
           k = money.length;
         }
       }
    }
    //处理金额字段
    this.setData({
      reMoney: money
    })
    if (that.data.reMoney <= 0) {
      wx.showToast({
        title: '金额必须大于0',
        icon: 'success',
        duration: 1500
      })
      
    } else {
      var template_id = "ecm61lbGhYWVMPtpv1Au2heOucQV0j7uVFwa3dHgcc0";
      var OrderNo = that.data.OrderNo;
      console.log(e.detail.formId);
      that.recharge(function () {
        app.request('api/User/cz_xxmb', { openid: app.openid, formid: fId, orderno: OrderNo, template_id: template_id }, "POST",
          function (res) {
            console.log(res);
          }, function (e) {//error
            console.log("进入错误");
            wx.showToast({ title: e, icon: 'loading', duration: 2000 });
          });
      });
    }

  }
})  
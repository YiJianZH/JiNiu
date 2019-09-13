const app = getApp()
Page({
  data: {
    Money:'0',
    InputMoney:0,
    IsClick:false
  },



  onLoad: function (options) {
 var that=this;
    that.GetRemain();
    },
    //获取我的余额
    GetRemain:function(){
      var that=this;
      //获取佣金
      var url = 'api/User/' + app.openid + '?marketId=' + app.Market.Id
      app.request(url, {}, 'GET', function (res) {
        that.setData({
          Money: res.data.model.Money.toFixed(2),
        })
      }, function () { })
    },
    //输入金额
    InputMoney:function(e){
      var that=this;
      var content=e.detail.value;
        that.setData({
          InputMoney:content
        })
    },
    //申请提现
    ApplyMoney:function(){
      var that=this;
      if(that.data.IsClick)
      {
        return;
      }
      that.setData({
        IsClick:true
      })
      if (parseFloat(that.data.Money) < parseFloat(that.data.InputMoney))
      {
        wx.showToast({
          title: '提现金额不足',
        })
        that.setData({
          IsClick:false
        })
        return;
      }
      if (parseFloat(that.data.InputMoney)<0.01)
      {
        wx.showToast({
          title: '请输入正确值',
        })
        that.setData({
          IsClick: false
        })
        return;

      }
      wx.request({
        url: app.name + 'api/Bonus/Audit',
        method: 'GET',
        data: { money: parseFloat(that.data.InputMoney), openid: app.openid, Source: 3},
        success: function (res) {
          if (res.data.flag) {
            wx.showToast({
              title:"提现成功",
            })
         wx.navigateTo({
           url: '/pages/my/my_yj/my_yj',
         })
          }
          else {
            wx.showToast({
              title: res.data.msg,
            })

          }
        }
      })

    }
})  
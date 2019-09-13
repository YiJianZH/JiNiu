const app = getApp()
Page({
  data: {
    startDate: '选择时间',
    endDate: '选择时间',
    CouponPordt:[],
    Title: "",
    Price: 0.0,
    FullPrice: 0.0,
    CouponType: 4,
    IsPublish: true,
    Num: 0,
    FullNum:0,
    Explanation: "",
  },

  bindStartDate: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  bindEndDate: function (e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  setName:function(e){
    this.setData({
      Title: e.detail.value
    });
  },
  setPrice:function(e){
    this.setData({
      Price: e.detail.value
    });
  },
  setFullPrice:function(e){
    this.setData({
      FullPrice: e.detail.value
    });
  },
  setNum:function(e){
    this.setData({
      Num: e.detail.value
    });
  },
  setFullNum:function(e){
    this.setData({
      FullNum: e.detail.value
    });
  },
  setExplanation:function(e){
    this.setData({
      Explanation: e.detail.value
    });
  },
  to_chooseGoods: function (e) {
    console.log(e); 
    var tid = e.currentTarget.dataset.tid;
    if (tid==1){
      this.setData({
        CouponType: 1
      });
    }else{
      this.setData({
        CouponType: 4
      });
      wx.navigateTo({
        url: '/pages/backstage/home/storeOperation/activityMan/addManjian/chooseGoods/cg'
      })
    }
    
  },
  switch1Change:function(e){
    this.setData({
      IsPublish: e.detail.value
    });
  },
  onLoad: function (options) {
    var that = this;
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var enddey = now.getDate() + 1;
    var day = now.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };
    if (enddey < 10) {
      enddey = '0' + enddey;
    };
    var startDate = year + '-' + month + '-' + day;
    var endData = year + '-' + month + '-' + enddey;
    that.setData({
      startDate: startDate,
      endDate: endData
    });
  },
  onShow:function(){
    var that = this;
    that.setData({
      CouponPordt: app.HomCouponPordt
    });
  },
  OnlickSave:function(){
    var that = this;
    var title = that.data.Title;
    if (title.length == 0) {
      wx.showToast({ title: '请输入名称', icon: 'none', duration: 2000 });
      return false;
    }
    var startDate = that.data.startDate;
    var endDate = that.data.endDate;

    var fullPrice = that.data.FullPrice;
    if (title.length == 0) {
      wx.showToast({ title: '请输入优惠满足价格', icon: 'none', duration: 2000 });
      return false;
    }
    var price = that.data.Price;
    if (title.length == 0) {
      wx.showToast({ title: '请输入优惠价格', icon: 'none', duration: 2000 });
      return false;
    }
    var couponType = that.data.CouponType;
    var productId = "";
    if (couponType==4){
      if (app.HomCouponPordt.length==0){
        wx.showToast({title: '请选择产品',icon: 'none',duration: 2000});
        return false;
      }
      //删除保存选择
      for (var t = 0; t < app.HomCouponPordt.length; t++) {
        if (productId=="") {
          productId = app.HomCouponPordt[t].Id;
        }else{
          productId +=","+ app.HomCouponPordt[t].Id;
        }
      }
    }
    var isPublish = that.data.IsPublish;
    var num = that.data.Num;
    if (num <= 0) {
      wx.showToast({ title: '输入优惠劵数量', icon: 'none', duration: 2000 });
      return false;
    }
    var fullNum = that.data.FullNum;
    if (fullNum <= 0) {
      wx.showToast({ title: '输入优惠劵领取限制数量', icon: 'none', duration: 2000 });
      return false;
    }
    
    var explanation = that.data.Explanation;
    if (explanation.length == 0) {
      wx.showToast({ title: '请输入优惠说明', icon: 'none', duration: 2000 });
      return false;
    }
    app.request('api/Coupon/AddCoupon', {
      StoreId: app.HomeStore.Id,
      Title: title,
      Price: price,
      FullPrice: fullPrice,
      CouponType: couponType,
      ProductId: productId,
      IsPublish: isPublish,
      BeginTime: startDate,
      Endline: endDate,
      Num: num,
      FullNum: fullNum,
      Explanation: explanation
    }, "POST",
      function (res) {
        console.log("添加优惠劵");
        console.log(res);
        if (res.data.flag) {
          wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
          app.HomCouponPordt=[];
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },2000);
        } else {
          wx.showToast({ title: '失败', icon: 'none', duration: 2000 });
        }
      },
      function () {
        wx.showToast({ title: '更新状态失败', icon: 'loading', duration: 2000 });
      })

    
  },
  delectPid:function(e){
    var that = this;
    console.log(e);
    var pid = e.currentTarget.dataset.pid;
    //删除保存选择
    for (var t = 0; t < app.HomCouponPordt.length; t++) {
      if (pid== app.HomCouponPordt[t].Id) {
        app.HomCouponPordt.splice(t, 1);
      }
    }
    that.setData({
      CouponPordt: app.HomCouponPordt
    });


    
  }


})
const app = getApp()
Page({

  data: {
    CouponList:[],
  },

  to_addManjian: function () {
    wx.navigateTo({
      url: '/pages/backstage/home/storeOperation/activityMan/addManjian/addmj',
    })
  },
  onLoad: function (options) {

  },
  onShow: function () {
    var that = this;
    that.getStoreCoupon(1);
  },
  getStoreCoupon: function (page){
    var that = this;
    app.request('api/Coupon/GetStoreCoupon?sid=' + app.HomeStore.Id + '&page=' + page, {}, "GET",
      function (res) {
        console.log("获取优惠劵");
        console.log(res);
        if (res.data.flag) {
          var list = res.data.list;
          if (page>1){
            var tlist = that.data.CouponList
            var indxe = tlist.length;
            for (var i = 0; i < list.length;i++){
              tlist[indxe + i] = list[i];
            }
            list = tlist;
          }

          that.setData({
            CouponList: list
          });
         
          
        }else{
          that.setData({
            CouponList: []
          });

        }
      },
      function () {
        wx.showToast({ title: '获取优惠劵失败', icon: 'loading', duration: 2000 });
      })
  },
  OnlickDelect:function(e){
    var that = this;
    console.log(e);
    var cid = e.currentTarget.dataset.cid
    app.request('api/Coupon/DeleteStoreCoupon?id=' + cid, {}, "DELETE",
      function (res) {
        console.log("获取优惠劵");
        console.log(res);
        if (res.data.flag) {
          wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
          setTimeout(function () {
            that.onShow();
          }, 2000);
        } else {
          wx.showToast({ title: '失败', icon: 'none', duration: 2000 });
        }
      },
      function () {
        wx.showToast({ title: '获取优惠劵失败', icon: 'loading', duration: 2000 });
      })

  },
  onDelect:function(e){
    var that = this;
    var cid = e.currentTarget.dataset.cid;
    app.request('api/Coupon/DeleteStoreCoupon?id=' + cid, {}, "DELETE",
      function (res) {
        console.log("删除优惠劵");
        console.log(res);
        if (res.data.flag) {
          wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
         that.onShow();
        } else {
          wx.showToast({ title: '失败', icon: 'none', duration: 2000 });
        }
      },
      function () {
        wx.showToast({ title: '删除优惠劵失败', icon: 'loading', duration: 2000 });
      })
  }
})
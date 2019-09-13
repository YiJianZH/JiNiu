const app = getApp()
Page({
  data: {
    appUserType:1,
    //全部
    yhj_all: [],
    //待领取
    yhj: [],
    //未使用
    yhj_a: [],
    //已使用
    yhj_b: [],
    currIndex: 1,
    winWidth: 0,
    winHeight: 0, 
    isNull: true,
    // tab切换  
    currentTab: 0,
    getCoupon: [{ id: "", openid: "" }],
  },
  onLoad: function () {

    var that = this;
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
    that.setData({
      yhj_all: null,
      yhj: null,
      yhj_a: null,
      yhj_b: null,
    })
    that.getCoupon(1, 0)
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current, currIndex:1 });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        currIndex: 1 
      })
      that.getCoupon(1, that.data.currentTab)
    }
  },
  getCoupon: function (page, status) {
    var that = this
    console.log("page=" + page);
    that.setData({
      isNull: true
    });
    console.log('请求数据:'+'api/Coupon?page=' + page + '&pageSize=10&status=' + status + '&openid=' + app.openid);
    var url = 'api/Coupon?page=' + page + '&pageSize=10&status=' + status + '&openid=' + app.openid
    app.request(url, {}, 'GET', function (res) {
      console.log(res);
      if (res.data.list != null && res.data.list.length > 0) {
        that.dataSet(page, status, res.data.list)
      }
      else {
        if(page==1)
        {
          that.setData({
            isNull: false
          });
        }
      
        that.dataSet(page, status, "")
      }
    }, function () { })
  },
  dataSet: function (page, status, list) {
    var that = this
    if (page == 1) {

      that.couponData(status, list)
    }
    else {
      var newlist = that.data.yhj_all
      if (status == 1) {
        newlist = that.data.yhj
      }
      else if (status == 2) {
        newlist = that.data.yhj_a
      }
      else if (status == 3) {
        newlist = that.data.yhj_b
      }
      if (list != null && list != "" && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          newlist.push(list[i])
        }
      }
      that.couponData(status, newlist)
    }
  },
  couponData: function (status, newlist) {
    var that = this
    if (status == 0) {
      that.setData({
        yhj_all: newlist,
      })
    }
    else if (status == 1) {
      that.setData({
        yhj: newlist,
      })
    }
    else if (status == 2) {
      that.setData({
        yhj_a: newlist,
      })
    }
    else if (status == 3) {
      that.setData({
        yhj_b: newlist,
      })
    }
  },
  //领用优惠券
  AddCoupon: function (event) {
    var that = this
    let Id = event.currentTarget.dataset.addid;
    /*let price = event.currentTarget.dataset.price;
    app.coupon[0]['Id']=Id
    app.coupon[0]['price'] = price*/
    var url = 'api/Coupon'
    app.request(url, {
      id: Id,
      openid: app.openid
    }, 'POST', function (res) {
      if (res.data.flag) {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
      }
      else {
        wx.showToast({
          title: '已达到领取上限！',
          icon: 'success',
          duration: 2000
        })
      }
      that.getCoupon(1, that.data.currentTab)
    }, function () { })

  },
  //删除优惠券
  Del: function (event) {
    var that = this
    let Id = event.currentTarget.dataset.delid;
    var url = 'api/Coupon/User/' + Id + '?openid=' + app.openid
    app.request(url, {}, 'DELETE', function (res) {
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
      that.getCoupon(1, that.data.currentTab)
    }, function () { })
  },

  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    var that = this
    that.setData({
      currIndex: 1,
    })
    //重新请求初始数据
    that.getCoupon(1, that.data.currentTab)
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  // 上拉加载回调接口
  lower:function(e){
    console.log("翻页");
    var that = this
    //请求数据
    var totle = that.data.currIndex;
    totle++;
    that.setData({
      currIndex: totle,
    })
    that.getCoupon(totle, that.data.currentTab)
  }

})



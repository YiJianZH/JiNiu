const app = getApp()
Page({

  data: {
    currentTab: 0,
    startDate: '',
    endDate: '',
    orderlis:[],
    profit: 0,
    turnover: 0,
    Statistics: [],
    Turnover: 0,
    Income: 0,
    Number: 0
  },

  bindStartDate: function (e) {
   
    //判断时间
    if (this.data.endDate.length>0){
      console.log(e.detail.value);
      console.log(this.data.endDate);
      
      var startDate = new Date(e.detail.value);
      var endDate = new Date(this.data.endDate);
      if (startDate > endDate){
        wx.showToast({
          title: '开始时间不能大于结束时间！', icon: 'none', duration: 2000});
        return ;
      }
    }
    this.setData({
      orderlis: [],
      profit: "0.00",
      turnover: "0.00",
    });
    this.setData({
      startDate: e.detail.value
    })
    if (this.data.currentTab==0){
      //订单统计查询
      this.GetSatrDataList(this.data.startDate, this.data.endDate);
    }else{
      this.GetDataList(this.data.startDate, this.data.endDate);
    }
   

  },
  bindEndDate(e) {
    //判断时间
    if (this.data.endDate.length > 0) {
      console.log();
      console.log(this.data.endDate);

      var startDate = new Date(this.data.startDate);
      var endDate = new Date(e.detail.value);
      if (startDate > endDate) {
        wx.showToast({
          title: '结束时间不能小于开始时间！', icon: 'none', duration: 2000
        });
        return;
      }
    }

    this.setData({
      endDate: e.detail.value
    })
    this.setData({
      orderlis: [],
      profit: "0.00",
      turnover: "0.00",
    });
    if (this.data.currentTab == 0) {
      //订单统计查询
      this.GetSatrDataList(this.data.startDate, this.data.endDate);
    } else {
      this.GetDataList(this.data.startDate, this.data.endDate);
    }
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    app.HomEntity={};

    var now = new Date();
    console.log("now=" + now);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    console.log("month=" + month);
    var enddey = now.getDate() ;
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

    //that.GetDataList(startDate, endData);

    this.GetSatrDataList(this.data.startDate, this.data.endDate);
  },

  //滑动获取选中商品
  getSelectItem: function (e) {
    var that = this;
    //每个商品的宽度
    var itemWidth = e.detail.scrollWidth / that.data.proList.length;
    //滚动宽度
    var scrollLeft = e.detail.scrollLeft;
    //通过Math.round方法对滚动大于一半的位置进行进位
    var curIndex = Math.round(scrollLeft / itemWidth);
    for (var i = 0, len = that.data.proList.length; i < len; ++i) {
      that.data.proList[i].selected = false;
    }
    that.data.proList[curIndex].selected = true;
    that.setData({
      proList: that.data.proList,
      giftNo: this.data.proList[curIndex].id
    });
  },
  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });
  },
  /** 
   * 点击tab切换
   */
  swichNav: function (e) {
    console.log(e)
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  GetDataList: function (beginTime,endTime){
    var that = this;
    app.request('api/Order/GetStoreOrder', {
      StoreId: app.HomeStore.Id,
      BeginTime: beginTime,
      EndTime: endTime
    }, "POST",
      function (res) {
        console.log("获取数据");
        console.log(res);
        if (res.data.flag) {
          var list = res.data.list;
          var profit=0
          var turnover=0;
          for (var i = 0; i < list.length;i++){
            turnover += list[i].Turnover;
            profit += list[i].Profit;
            list[i].Turnover = list[i].Turnover.toFixed(2);
            list[i].Profit = list[i].Profit.toFixed(2);
          }
          that.setData({
            orderlis: res.data.list,
            profit: profit.toFixed(2),
            turnover: turnover.toFixed(2)
          });
        } else {
          that.setData({
            orderlis: [],
            profit: "0.00",
            turnover: "0.00",
          });
        }
      },
      function () {
        wx.showToast({ title: '更新状态失败', icon: 'loading', duration: 2000 });
      })
  },
  gozjmx:function(e){
    console.log(e);
    var idx = e.currentTarget.dataset.idx;
    app.HomEntity = this.data.orderlis[idx];
    wx.navigateTo({
      url: '/pages/backstage/home/storeOperation/accountChecking/innerPage/ip'
    })
  },

  details: function (e) {
    var oid = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '/pages/backstage/home/details/details?oid=' + oid
    })
  },
  GetSatrDataList: function (startTime, endTime) {
    var that = this;
    app.request('api/Order/GetStoreOrderStatistics', {
      startTime: startTime,
      endTime: endTime,
      storeId: app.HomeStore.Id
    }, "POST",
      function (res) {
        console.log("获取统计数据");
        console.log(res);
        if (res.data.flag) {
          var list = res.data.list;
          var Turnover = res.data.Turnover;
          var Income = res.data.Income;
          var Number = res.data.Number;
          for (var i = 0; i < list.length;i++){
            list[i].Turnover = list[i].Turnover.toFixed(2);
            list[i].Profit = list[i].Profit.toFixed(2);
          }
          that.setData({
            Statistics: list,
            Turnover: Turnover.toFixed(2),
            Income: Income.toFixed(2),
            Number: Number
          });
         
        } else {
          that.setData({
            Statistics: [],
            Turnover: "0.00",
            Income: "0.00",
            Number: "0",
          });
        }
      },
      function () {
        wx.showToast({ title: '更新状态失败', icon: 'loading', duration: 2000 });
      })
  },
})
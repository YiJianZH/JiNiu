const app = getApp()
Page({
  data: {
    searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: true, //“没有数据”的变量，默认false，隐藏  
    status: false,
    selectitem: 0,
    IsRten: true, //是否可点击

    //新订单
    order_ul: [],
    //自提单
    order_ula: [],
    //异常单
    order_ulb: [],
    //配送中
    order_ulc: [],
    //已完成
    order_uld: [],
    //全部
    order_ult: [],
    order_back: [{
      Id: "",
      Reason: ""
    }],
    back_Id: "",
    reasons: "",
    tel: "",
    //弹出层
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    tc_a: "退换货",
    tc_b: "退换货原因",
    tc_img: "",
    page: 1,
    flag: true,
    storeId: 0,
  },
  onLoad: function(options) {
    var that = this;
    console.log("获取店铺");
    console.log(app.HomeStore);
    that.setData({
      storeId:app.HomeStore.Id
    });


    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    that.getOrder(1, that.data.currentTab)
  },
  onShow: function() {
    var that = this;
    that.getOrder(1, that.data.currentTab)
  },
  //调用接口赋值方法
  getOrder: function(page, status) {
    var that = this
    that.setData({
      //隐藏图片
      isNull: true
    });
    //提示
    wx.showLoading({
      title: '加载中',
    })
    console.log("storeId=" + that.data.storeId);
    var url = 'api/Order/GetStoreOrderList?page=' + page + '&pageSize=10&status=' + status + '&storeId=' + that.data.storeId + '&marketId=0'
    app.request(url, {}, 'GET', function(res) {
      console.log("page=" + page);
      console.log("status=" + status);
      console.log("数据");
      console.log(res);
      if (res.data.flag) {
        that.setData({
          page: page
        });
        var newlist = res.data.list;
        if (res.data.list != null) {
          for (var i = 0; i < newlist.length; i++) {
            for (var j = 0; j < newlist[i].Detail.length; j++) {
              newlist[i].Detail[j].Price = newlist[i].Detail[j].Price.toFixed(2);
              
            }
          }
        }

        if (page == 1) {
          if (res.data.list == null) {
            that.DatasSet(status, "");
          } else {
            // if (newlist.length<10){
            //   console.log("小于10个显示提示");
            //   that.setData({
            //     IsRten: false,
            //     isNull: true,
            //     searchLoadingComplete: false,
            //     searchLoading: true,
            //   });

            // }else{
            //   that.setData({
            //     isNull: true
            //   })
            // }
            
            that.DatasSet(status, newlist)
          }

        } else {

          var list = that.data.order_ult
          // 新订单
          if (status == 0) {
            list = that.data.order_ul
          } else if (status == 1) {
            //自提单
            list = that.data.order_ula
          } else if (status == 2) {
            //异常单
            list = that.data.order_ulb
          }
          //配送中
          else if (status == 3) {
            list = that.data.order_ulc
          }
          //已完成
          else if (status == 4) {
            list = that.data.order_uld
          }
          var oldlength = list.length;
          if (res.data.list.length > 0) {
            for (var i = 0; i < newlist.length; i++) {
              list[oldlength + i] = newlist[i]
            }
            that.DatasSet(status, list);
          }
        }

      } else { //没数据
        //关闭提示
        setTimeout(function() {
          wx.hideLoading()
        }, 100)

        //初始化
        that.setData({
          IsRten: true,

        });
        if (page != 1) {
          //显示页面提示
          that.setData({
            searchLoadingComplete: false,
            searchLoading: true,
          });

        } else {
          //显示图片
          that.setData({
            isNull: false,
            searchLoadingComplete: true,
            searchLoading: true,
          });
          that.DatasSet(status, "");
        }
        //关闭提示
        // setTimeout(function() {
        //   that.setData({
        //     searchLoadingComplete: true
        //   });
        // }, 3000);
      }
    }, function() {})

  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.setData({
      searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: true, //“没有数据”的变量，默认false，隐藏  
      status: false,
      IsRten: true
    })
    that.getOrder(1, that.data.currentTab)
  },
  //数据赋值方法
  DatasSet: function(status, list) {
    var that = this
    if (list != "") {
      for (var i = 0; i < list.length; i++) {
        var tlist = list[i].Detail
        for (var t = 0; t < tlist.length; t++) {
          tlist[t].Price = (tlist[t].Price * tlist[t].Num).toFixed(2)
        }
        list[i].Detail = tlist
      }
    }

    if (status == 0) { // 新订单
      that.setData({
        order_ul: list,
      })
      console.log(that.data.order_ul);
    } else if (status == 1) { //自提单
      that.setData({
        order_ula: list,
      })
    } else if (status == 2) { //异常单
      that.setData({
        order_ulb: list,

      })
    } else if (status == 3) { //配送中
      that.setData({
        order_ulc: list,

      })
    } else if (status == 4) { //已完成
      that.setData({
        order_uld: list,

      })
    } else if (status == 5) { //全部
      that.setData({
        order_ult: list,
      })
    }

    //初始化
    that.setData({
      IsRten: true,
      searchLoading: true
    });


    setTimeout(function() {
      wx.hideLoading()
    }, 100)
  },

  b: function() {
    this.setData({
      flag: true
    })
  },


  menuClick: function(event) {
    let Id = event.currentTarget.dataset.id;

    this.setData({
      _num: event.target.dataset.id,
      reasons: this.data.order_back[Id].Reason,
    })

  },

  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: true, //“没有数据”的变量，默认false，隐藏  
        currentTab: e.target.dataset.current
      })
    }
    that.getOrder(1, that.data.currentTab)
  },
  lower: function() { //上拉加载
    var that = this;
    if (that.data.IsRten) {
      that.setData({
        IsRten: false,
        searchLoading: false
      });
      var page = that.data.page;
      page++;
      that.getOrder(page, that.data.currentTab)
    }

  },
  

 
  //重置返回跳转页面
  // onUnload: function() {
  //   wx.reLaunch({
  //     url: '/pages/my/my'
  //   })
  // },
  to_home: function () {
    console.log("home");
    wx.reLaunch({
      url: '/pages/backstage/home/home'
    })
  },
  to_so: function () {
    wx.reLaunch({
      url: '/pages/backstage/home/storeOperation/so'
    })
  },
  to_setting: function () {
    wx.reLaunch({
      url: '/pages/backstage/home/setting/setting',
    })
  },
  to_client: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  
})
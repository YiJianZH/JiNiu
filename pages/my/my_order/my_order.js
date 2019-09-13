const app = getApp()
Page({
  data: {
    appUserType:1,
    searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: true,  //“没有数据”的变量，默认false，隐藏  
    status: false,
    selectitem: 0,
    IsRten: true,//是否可点击
    order_ult: [
      { Id: "0", State: "", OrderNo: "", Status: "", Detail: [{ ProductName: "",Num:1, UnitName: "", Price: "", Picture: "", IsOverdays: false }] }
    ],
    order_ul: [
      { Id: "0", State: "", OrderNo: "", Detail: [{ ProductName: "", Num: 1,UnitName: "", Price: "", Picture: "", IsOverdays: false }] }
    ],
    order_ula: [
      { Id: "0", State: "", OrderNo: "", Detail: [{ ProductName: "", Num: 1,UnitName: "", Price: "", Picture: "", IsOverdays: false }] }
    ],
    order_ulb: [
      { Id: "0", State: "", OrderNo: "", Detail: [{ ProductName: "", Num: 1, UnitName: "", Price: "", Picture: "", IsOverdays: false }] }
    ],
    order_ulc: [
      { Id: "0", State: "", OrderNo: "", Detail: [{ ProductName: "", Num: 1,UnitName: "", Price: "", Picture: "", IsOverdays: false }] }
    ],
    order_back: [{ Id: "", Reason: "" }],
    back_Id: "",
    reasons: "",
    tel: "",
    //弹出层
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    currIndex: 1,
    tc_a: "退换货",
    tc_b: "退换货原因",
    tc_img: "",
    page: 1,
    flag: true
  },
  onLoad: function (options) {
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
      order_ult: null,
      order_ul: null,
      order_ula: null,
      order_ulb: null,
      order_ulc: null,

    })
    var pageids = options.id
    if (pageids <= 3) {
      that.setData({
        currentTab: pageids
      })
    }
    else {
      that.setData({
        currentTab: "4"
      })
    }
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
    that.getOrder(1, that.data.currentTab)
  },
  onShow:function(){
    var that = this;
    that.getOrder(1, that.data.currentTab)
  },
  //调用接口赋值方法
  getOrder: function (page, status) {
    var that = this
    that.setData({
      //隐藏图片
      isNull: true
    });
    //提示
    wx.showLoading({
      title: '加载中',
    })
    if (status > 1) {
      status++;
    }
    var url = 'api/Order?page=' + page + '&pageSize=10&status=' + status + '&openid=' + app.openid +'&marketId='+app.Market.Id
    app.request(url, {}, 'GET', function (res) {
      console.log("page=" + page);
      console.log("数据");
      console.log(res);
      if (res.data.flag) {
        that.setData({
          page: page
        });
        var newlist = res.data.list;
        if (res.data.list!=null)
        {       
          for(var i=0;i<newlist.length;i++)
          {
            for (var j = 0; j < newlist[i].Detail.length;j++)
            {
              newlist[i].Detail[j].Price = newlist[i].Detail[j].Price.toFixed(2);
            }
          }   
        }
       
        if (page == 1) {
          if (res.data.list == null) {
            that.DatasSet(status, "");
          } else {
            that.setData({
              isNull: true
            })
            that.DatasSet(status, newlist)
          }

        }
        if (page > 1) {
          var list = that.data.order_ult
          if (status == 1) {
            list = that.data.order_ul
          }
          else if (status == 3) {
            list = that.data.order_ula
          }
          else if (status == 4) {
            list = that.data.order_ulb
          }
          else if (status == 5) {
            list = that.data.order_ulc
          }
          var oldlength = list.length;
          if (res.data.list.length > 0) {
            for (var i = 0; i < newlist.length; i++) {
              list[oldlength + i] = newlist[i]
            }
            that.DatasSet(status, list);
          }
        }

      } else {//没数据
        //关闭提示
        setTimeout(function () {
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
            isNull: false
          });
          that.DatasSet(status, "");
        }
        //关闭提示
        setTimeout(function () {
          that.setData({
            searchLoadingComplete: true
          });
        }, 3000);
      }
    }, function () { })

  },
  /** 
       * 滑动切换tab 
       */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    that.setData({
      status: false,
      IsRten: true
    })
    that.getOrder(1, that.data.currentTab)
  },
  //数据赋值方法
  DatasSet: function (status, list) {
    var that = this
    if (list!=""){
      for (var i = 0; i < list.length; i++) {
        var tlist = list[i].Detail
        for (var t =0; t < tlist.length; t++) {
          tlist[t].Price = (tlist[t].Price * tlist[t].Num).toFixed(2)
        }   
        list[i].Detail = tlist
      }
    }

    if (status == 0) {
      that.setData({
        order_ult: list,
      })
      console.log(that.data.order_ult);
    }
    else if (status == 1) {
      that.setData({
        order_ul: list,
      })
    }
    else if (status == 3) {
      that.setData({
        order_ula: list,

      })
    }
    else if (status == 4) {
      that.setData({
        order_ulb: list,

      })
    }
    else if (status == 5) {
      that.setData({
        order_ulc: list,

      })
    }
    
      //初始化
      that.setData({
        IsRten: true,
        searchLoading: true
      });
    
    
    setTimeout(function () {
      wx.hideLoading()
    }, 100)
  },
  // a: function () {
  //   this.setData({ flag: false })
  // },
  b: function () {
    this.setData({ flag: true })
  },
  //删除订单
  del: function (event) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除订单？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let totleNumber = event.currentTarget.dataset.delid;
          console.log('totleNumber:' + totleNumber)
          app.request('api/Order/Delete', {
            totleNumber: totleNumber,
            openid: app.openid
          }, 'POST', function (res) {
            wx.showToast({
              title: '已删除',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              that.getOrder(1, that.data.currentTab)
            }, 2000)

          }, function () { })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },

  menuClick: function (event) {
    let Id = event.currentTarget.dataset.id;
            
    this.setData({
      _num: event.target.dataset.id,
       reasons: this.data.order_back[Id].Reason,
    })
   
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    that.getOrder(1, that.data.currentTab)
  },
  lower: function () {//上拉加载
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
  //取消订单
  cancel: function (event) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否取消订单？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let Id = event.currentTarget.dataset.cancelid;
          var url = 'api/Order/Delete'
          app.request(url, {
            totleNumber: Id,
            openid: app.openid
          }, 'POST', function (res) {
            if (res.data.flag) {
              wx.showToast({
                title: '已取消订单',
                icon: 'success',
                duration: 2000
              })
              // 调用接口加载数据  
              setTimeout(function () {
                that.getOrder(1, that.data.currentTab);
              }, 2000)
            }
            else {
              wx.showToast({
                title: '取消订单失败',
                icon: 'error',
                duration: 2000
              })
            }
          }, function () { })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //确认收货
  goods: function (event) {
    var that = this
    let TotleNumber = event.currentTarget.dataset.goodsid;
    console.log("收货：" + TotleNumber);
    wx.showModal({
      title: '提示',
      content: '确认收货？',
      success: function (res) {
        if (res.confirm) {
          var url = 'api/Order/Finish'
          app.request(url, {
            totleNumber: TotleNumber,
            openid: app.openid
          }, 'POST', function (res) {
            if (res.data.flag) {

              wx.showToast({
                title: '已收货',
                icon: 'success',
                duration: 2000
              })

              setTimeout(function () {
                that.getOrder(1, that.data.currentTab);
              }, 2000)

            }
            else {
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 2000
              })
            }
          }, function () { })
        }
        }
        })
    
  },
  //获取退换货理由
  reasons: function () {
    var that = this

    var url = 'api/Order/Reason'
    app.request(url, {}, 'GET', function (res) {

      if (res.data.flag) {
        that.setData({
          order_back: res.data.model,
        })

      }

    }, function () { })

  },
  //填写电话
  changetel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  setReason: function (event) {
    var id = event.currentTarget.dataset.num
    this.setData({
      reasons: this.data.order_back[id],
    })
  },
  //退货提交
  backSub: function () {
    var that = this
    var isre = false
    var istel = false
    var telepnone = that.data.tel
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    wx.showModal({
      title: '提示',
      content: '确认退货？',
      success: function (res) {
        if (res.confirm) {
          if (that.data.reasons == "" || that.data.reasons == null) {
            wx.showToast({
              title: '请选择原因',
              icon: 'success',
              duration: 2000
            })
            return;
          }
          else {
            isre = true
          }
          if (that.data.tel == null && that.data.tel == "") {

            wx.showToast({
              title: '请填写电话',
              icon: 'success',
              duration: 2000
            })
            return;

          }
          else if (!myreg.test(telepnone)) {
            wx.showToast({
              title: '手机号有误！',
              icon: 'success',
              duration: 1500
            })
            return;
          }
          else {
            istel = true
          }

          if (isre && istel) {
            var url = 'api/Order/Return'
            app.request(url, {
              reason: that.data.reasons,
              phone: that.data.tel,
              id: that.data.back_Id,
              openid: app.openid
            }, 'PUT', function (res) {
              that.b()
              if (res.data.flag) {
                wx.showToast({
                  title: '退货已提交',
                  icon: 'success',
                  duration: 2000
                })
                that.setData({
                  flag: true
                })
              }
              else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 2000
                })
                that.setData({
                  flag: true
                })
              }

              that.getOrder(1, that.data.currentTab)
            }, function () { })
          }
        }
        }
        })
    
  },
  //继续支付
  GoPay: function (event) {
    let Id = event.currentTarget.dataset.payid;
    wx.navigateTo({
      url: '../../shop_list/shop_order/shop_order?id=' + Id
    })
  },

  backgoods: function (event) {
    var that = this;
    //判定是否超出时间
    let orderNo = event.currentTarget.dataset.backid;
    let oid = event.currentTarget.dataset.oid;
    //读取订单信息
    var url = 'api/Order/Detail?id=' + oid+'&openid=' + app.openid + '&orderNo=' + orderNo
    app.request(url, {}, 'GET', function (res) {
      console.log(res.data);
      if (res.data.model.IsOverdays) {
        wx.showToast({
          title: '已超过退货时间',
          icon: 'success',
          duration: 2000
        })
        return;
      }
      else {
        //弹窗退货原因
        that.setData({ flag: false })
        that.reasons()
        that.setData({
          status: true,
          flag: false,
          back_Id: orderNo,
        })
      }
    })

  },
  //退货提交
  backSub: function () {
    var that = this
    var isre = false
    var istel = false
    var telepnone = that.data.tel
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (that.data.reasons == "" || that.data.reasons == null) {
      wx.showToast({
        title: '请选择原因',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    else {
      isre = true
    }
    if (that.data.tel == null && that.data.tel == "") {

      wx.showToast({
        title: '请填写电话',
        icon: 'success',
        duration: 2000
      })
      return;

    }
    else if (!myreg.test(telepnone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return;
    }
    else {
      istel = true
    }

    if (isre && istel) {
      var url = 'api/Order/Return'
      app.request(url, {
        totleNumber: that.data.back_Id,
        reason: that.data.reasons,
        phone: that.data.tel,
        id: 0,
        openid: app.openid
      }, 'PUT', function (res) {
        that.b()
        wx.showToast({
          title: '退货已提交',
          icon: 'loading',
          duration: 2000
        })
        that.setData({
          flag: true
        })
        setTimeout(function(){
          that.getOrder(1, that.data.currentTab)
        },3000)
        
      }, function (tes) {
        wx.showToast({
          title: tes.data.msg,
          icon: 'none',
          duration: 2000
        })
       })
    }
  },
  pingOrder:function(e){
    console.log("评价");
    console.log(e);
    var oid = e.currentTarget.dataset.delid;
    wx.navigateTo({
      url: '/pages/my/my_order/evaluation/e?oid=' + oid
    })
  },
  //重置返回跳转页面
  onUnload: function () {
    wx.reLaunch({
      url: '/pages/my/my'
    })
  }

})



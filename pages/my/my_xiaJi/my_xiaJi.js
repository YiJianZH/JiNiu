const app = getApp()
Page({
  data: {
    date: '',
    dateA: '',
    _num: 0,
    shareUser: [],
    li: [],
    ShareRecord: [],
    currIndex: 1,
    IsMotre: true,
    IsNone: true,
    IsNoMore: true,
    upShareName:"平台",
    TotleMoney:0,
    ShareMoney:0,
    userTotleMoney:0,
    userShareMoney:0,
  },

  jumpto: function() {

  },

  onLoad: function() {
    console.log('onLoad')
    var that = this;
    that.GetAllUser();
  },
  //获取日志
  GetData: function(page) {
    var that = this;
    wx.request({
      url: app.name + 'api/Order/GetShareRecord',
      method: 'POST',
      data: {
        openid: app.openid,//  'oJojr4mLo8WfRF3oAF_O9L_8KSVw',//  
        shareId: that.data._num,
        page: page,
        size: 5,
        beginTime: that.data.dateA,
        endTime: that.data.date
      },
      success: function(res) {
        that.setData({
          TotleMoney: parseFloat(res.data.TotleMoney).toFixed(2),
          ShareMoney: parseFloat(res.data.ShareMoney).toFixed(2),
        })
        if (res.data.fag) {
       
          if (res.data.list.length > 0) {
            that.setData({
              currIndex: page
            })
            that.DataSet(page, res.data.list);
          }
          else
          {
            if (page == 1) {
              that.setData({
                IsMotre: true,
                IsNone: false,
                IsNoMore: true,
                ShareRecord: []
              })
            } else {
              that.setData({
                IsMotre: false,
                IsNone: true,
                IsNoMore: true,
              })
            }
          }

        } else {
          if (page == 1) {
            that.setData({
              IsMotre: true,
              IsNone: false,
              IsNoMore: true,
              ShareRecord: []
            })
          } else {
            that.setData({
              IsMotre: false,
              IsNone: true,
              IsNoMore: true,
            })
          }

        }
      }
    })

  },
  bindDateChangeA: function(e) {
    var that=this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (that.data.date < e.detail.value && that.data.date.length>0)
    {
      wx.showModal({
        title: '提示',
        content: '起始时间不能大于结束时间',
        success: function (res) {
          return;
        }
      })
      return;
    }
    this.setData({
      dateA: e.detail.value
    })
    this.GetData(1);
  },
  bindDateChange: function(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (that.data.dateA > e.detail.value && that.data.dateA.length > 0) {
    
      wx.showModal({
        title: '提示',
        content: '起始时间不能大于结束时间',
        success: function (res) {
          return;
        }
      })
      return;
    }
    this.setData({
      date: e.detail.value
    })
    this.GetData(1);
  },
  clickNum: function(e) { //套餐选择
    console.log(e.currentTarget.dataset.num)
    var id = e.currentTarget.dataset.num;
    this.setData({
      _num: id
    })
    this.GetData(1);
  },

  //数据加载
  DataSet: function(page, list) {
    var that = this;
    var newList = [];
    if (page > 1) {
      newList = that.data.ShareRecord;
    }
    for (var i = 0; i < list.length; i++) {
      newList.push({
        orderNo: list[i].orderNo,
        Money: parseFloat(list[i].Money).toFixed(2),
        Time: list[i].Time,
        userName: list[i].userName,
        OrderMoney: parseFloat(list[i].OrderMoney).toFixed(2),
      })
    }
    that.setData({
      ShareRecord: newList
    })
    if (list.length >= 5) {
      that.setData({
        IsMotre: false,
        IsNone: true,
        IsNoMore: true,

      })
    } else {
      that.setData({
        IsMotre: true,
        IsNone: true,
        IsNoMore: false,
      })
    }
  },
  //获取更多
  // 下拉刷新回调接口
  onPullDownRefresh: function() {
    var that = this
    // 显示导航栏loading  
    wx.showNavigationBarLoading();
    // 调用接口加载数据  
    that.onLoad();
    // 隐藏导航栏loading  
    wx.hideNavigationBarLoading();
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新  
    wx.stopPullDownRefresh();
  },
  // 上拉加载  
  onReachBottom(e) {
    console.log("加载");
    var that = this
    if (that.data.RtenBat) {
      //请求数据
      var totle = that.data.currIndex;
      totle++;
      that.setData({
        currIndex: totle,
        RtenBat: false,
        searchLoading: false
      })
      that.BangData(totle);
    }

  },
  //获取所有下级用户
  GetAllUser: function() {
    var that = this;
    wx.request({
      url: app.name + 'api/Order/GetSharedUser',
      method: 'GET',
      data: {
        openid: app.openid,//  'oJojr4mLo8WfRF3oAF_O9L_8KSVw',//
      },
      success: function(res) {
        if (res.data.fag) {
          that.setData({
            userTotleMoney: parseFloat(res.data.TotleMoney).toFixed(2) ,
            userShareMoney: parseFloat(res.data.ShareMoney).toFixed(2),
          })
          if (res.data.list.length > 0) {
            var newlist = [];
            var list = res.data.list;
            for (var i = 0; i < list.length; i++) {
              if (i == 0 && that.data._num == 0) {
                that.setData({
                  _num : list[i].Id
                })
               
              }
              newlist.push({
                Id: list[i].Id,
                Name: list[i].Name,
                CreateTime: list[i].CreateTime,
              })
            }
            that.setData({
              shareUser: newlist,
              upShareName: res.data.upShareName == "无" ? "平台" : res.data.upShareName
            })
            that.GetData(1);
          }
          else
          {
            that.setData({              
              IsNone: false,            
            })
            that.setData({
             
              upShareName: res.data.upShareName == "无" ? "平台" : res.data.upShareName
            })
          }

        } else {
          // wx.showToast({
          //   title: res.data.msg,
          // })
          that.setData({
            IsNone: false,
          })
        }
      }
    })

  }

})
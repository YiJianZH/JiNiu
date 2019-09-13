const app = getApp()
Page({
  data: {
    flag: true,
    ul:[
      { OrderNo: "123456789", IsUse:"待兑换"},
    ],
    ula: [
      { OrderNo: "123456789", IsUse: "已兑换" },
    ],
    ulb: [
      { OrderNo: "123456789", IsUse: "已兑换" },
    ],
    cp_title:"",
    cp_sl:"",
    jf:"",
    picture:"",
    //弹出层
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    status:false,
    currIndex:1,
    IsNAN: true
  },
  /*弹出层 */
  a: function () {
    this.setData({ flag: false })
  },
  b: function () {
    var that=this;
    this.setData({ flag: true });
    this.getList(1, 0, "");
  },
  onLoad: function () {
    var that = this;
    that.setData({
      ul:null,
      ula:null,
      ulb:null,
    })
    that.getList(1, 0, "")
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
    that.setData({ currentTab: e.detail.current });

  },

  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.getList(1, e.target.dataset.current,"")
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  getList: function (currIndex, status, success){
    var that=this
    var url = 'api/Integral/Order?page=' + currIndex + '&pageSize=6&openid=' + app.openid + '&status=' + status;
  app.request(url, {}, 'GET', function (res) {
    if (res.data.list != null) {
      that.setData({
        IsNAN: false
      })
    }
    var list = res.data.list
      if (!res.data.flag)
      {
        list=null
      }
     
        if (status == 0) {
          that.setData({
            ulb: list,
          })
        }
        else if (status == 1) {
          that.setData({
            ul: list,
          })
        }
        else if (status == 2) {
          that.setData({
            ula: list,
          })
        
        }
      
  }, function () { })
  },
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    var that = this
    var tab = that.data.currentTab
    //重新请求初始数据
    var url = 'api/Integral/Order?page=' + 1 + '&pageSize=6&openid=' + app.openid + '&status=' + tab;
    that.setData({
      currIndex:1,     
    })
    app.request(url, {}, 'GET', function (res) {
      that.getList(1, tab, "");     
    }, function () {
    })
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  // 上拉加载回调接口
  onReachBottom: function () {
    var that = this
    var tab = that.data.currentTab
    //请求数据
    var totle = that.data.currIndex;
    totle++;
    that.setData({
      currIndex: totle,
    })
    var url = 'api/Integral/Order?page=' + totle + '&pageSize=6&openid=' + app.openid + '&status=' + tab;
    app.request(url, {}, 'GET', function (res) {
     
      var list = that.data.ul
      var tabs = that.data.currentTab
      if (tabs==0)
      {
        list = that.data.ulb
      }
      else if (tabs== 2)
      {
        list = that.data.ula
      }
      
      if (res.data.list != null && res.data.list.length > 0) {
        for (var i = 0; i < res.data.list.length; i++) {
          list.push(res.data.list[i])
        }
        if (tab == 0) {
          that.setData({
            ulb: list,
          })
        }
        else if (tab == 1) {
          that.setData({
            ul: list,
          })
        }
        else if (tab == 2) {
          that.setData({
            ula: list,
          })
        }
      }
    }, function () {
    })

  },
  //获取二维码
  clickButton:function(event){
    this.setData({ flag: false })
    var that=this;
    let Id = event.currentTarget.dataset.orderid;
    var url = 'api/User/Enconde?orderNo=' + Id+'&openid='+app.openid+'&position=2';
    app.request(url,{},'GET',function(res){
      if (res.data.flag)
      {
        that.setData({
          picture:res.data.msg,
        })
      }
    },function(){})
  }
})




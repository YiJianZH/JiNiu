// pages/index/shang/shang.js
const app = getApp()
Page({

  data: {
    li: [],
    //弹出层
    winWidth: 0,
    winHeight: 0,
    // tab切换     
    currIndex: 1,
  },

  onLoad: function(options) {
    var that = this;
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
    that.GetSuply(1);
  },
  ditu: function() {
    wx.navigateTo({
      url: '/pages/index/ditu/ditu',
    })
  },
  business: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/business/business?id=' + id,
    })
  },
  //获取数据
  GetSuply: function(page) {
    var that = this;
    var lat = "";
    var lng = "";
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        lat = res.latitude
        lng = res.longitude
        // const speed = res.speed
        // const accuracy = res.accuracy
        that.GetData(page, lat, lng);
      }
    })

  },
  //获取数据
  GetData: function(page, lat, lng) {
    var that = this;
    app.request('api/Store', {
        lat: lat,
        lng: lng,
        pageIndex: page,
        pageSize: 10
      }, "GET",
      function(res) {
        if (res.data.flag) {
          var list = res.data.list
          if (list.length > 0) {
            that.DataSet(page, list);
            that.setData({
              currIndex: page
            })
          }

        } else {

        }
      },
      function() { //error
        wx.showToast({
          title: '暂无商家信息',
          icon: 'loading',
          duration: 2000
        });
      }
    );
  },

  //赋值
  DataSet: function(page, list) {
    var that = this;
    var newList = [];
    if (page > 1) {
      newList = that.data.li;
    }
    for (var i = 0; i < list.length; i++) {
      newList.push({
        Id: list[i].Id,
        Name: list[i].Name,
      })
    }
    //商家 赋值
    that.setData({
      li: newList
    })

  },
  //加载更多
  GetMore: function() {
    var page = that.data.currIndex;
    page++;
    that.GetSuply(page);
  }

})
const app = getApp()
Page({
  data: {
    appUserType: 1,
    sh_ul: [{
      Id: "",
      Name: "",
      Phone: "",
      Detail: "",
      IsDefault: false,
      sh_ul_img: ""
    }],
    IsNAN: true,
  },

  //事件处理函数  
  changToTest: function() {
    wx.navigateTo({
      url: '../../pages/my_bj/my_bj'
    })
  },
  onLoad: function() {
    var that = this
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
      sh_ul: []
    })
    var url = 'api/Address?openid=' + app.openid
    app.request(url, {}, 'GET', function(res) {
      console.log("___");
      console.log(res);
      if (res.data.list == null) {
        that.setData({
          sh_ul: [],
        })
      } else {
        that.setData({
          IsNAN: false,
        })
      }
      that.setData({
        sh_ul: res.data.list,
        IsNAN: false,
      })
      var a = 1
    }, function() {})

  },
  del: function(event) {
    var that = this
    let Id = event.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否删除地址？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.name + 'api/Address/' + Id + '?openid=' + app.openid,
            data: {},
            method: 'DELETE',
            success: function(res) {
              if (res.data.flag) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })

                wx.request({
                  url: app.name + 'api/Address?openid=' + app.openid,
                  method: 'GET',
                  success: function(res) {
                    if (res.data.list != null) {
                      that.setData({
                        sh_ul: res.data.list,
                        IsNAN: false,
                      })
                    }
                    if (res.data.flag) {
                      that.setData({
                        sh_ul: res.data.list
                      })
                    } else {
                      that.setData({
                        sh_ul: null,
                      })
                      /*
                      wx.showToast({
                        title: '获取信息失败',
                        icon: 'fail',
                        duration: 2000
                      })*/
                      that.setData({
                        sh_ul: res.data.list
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: '失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })

  },
  location: function() {
    var that = this
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var address = res.address

      }
    })
  },
  setDefault: function(event) {
    var that = this
    let Id = event.currentTarget.dataset.updateid;
    var aurl = 'api/Address/Default'
    app.request(aurl, {
      id: Id,
      openid: app.openid
    }, 'Put', function(res) {
      if (res.data.flag) {
        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 2000
        })
        var list = that.data.sh_ul
        for (var i = 0; i < that.data.sh_ul.length; i++) {
          if (that.data.sh_ul[i].Id == Id) {
            list[i].IsDefault = true;
          } else {
            list[i].IsDefault = false;
          }

        }
        that.setData({
          sh_ul: list
        })

      }
    }, function() {})
  },
  toast: function() {
    wx.navigateTo({
      url: '/pages/my/my_sh/my_sh'
    })
  },
})
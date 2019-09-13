const app = getApp()
Page({
  data: {
    sh_ul: [],
    masgestype: true,
    orderId: 0,
    appUserType: 1,
  },
  onShow: function(options) {
    var that = this
    
    that.setData({
      Activity: app.Activity,
      appUserType: app.appUserType
    });
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



    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#47b34e',
        animation: {
          duration: 40,
          timingFunc: 'easeIn'
        }
      })
    }
    var url = 'api/Address?openid=' + app.openid
    app.request(url, {}, 'GET', function(res) {
      if (res.data.flag) {
        that.setData({
          sh_ul: res.data.list,
          masgestype: true
        })
      } else {
        that.setData({
          masgestype: false
        })
        // wx.navigateTo({
        //   url: '../../../pages/my/add_address/add_address?id=' + '-1&orderId=' + that.data.orderId,
        // })
        return;
      }
    }, function() {
      that.setData({
        masgestype: false
      })
    })
  },
  onLoad: function(options) {
    var that = this
    let id = options.id;
    that.setData({
      orderId: id
    })
    // var url = 'api/Address?openid=' + app.openid
    // app.request(url, {}, 'GET', function(res) {
    //   if (res.data.flag) {
    //     that.setData({
    //       sh_ul: res.data.list,
    //       masgestype: true
    //     })
    //   } else {
    //     that.setData({
    //       masgestype: false
    //     })
    //     // wx.navigateTo({
    //     //   url: '../../../pages/my/add_address/add_address?id=' + '-1&orderId=' + id,
    //     // })
    //     return;
    //   }
    // }, function() {
    //   that.setData({
    //     masgestype: false
    //   })
    // })

  },
  setDefault: function(event) { //选择
    var that = this
    var id = event.currentTarget.dataset.updateid; //编号

    var index = event.currentTarget.dataset.index;
    var list = this.data.sh_ul;

    for (var i = 0; i < list.length; i++) {
      list[i].IsDefault = false;
    }
    list[index].IsDefault = true;

    var url = 'api/Address/Default'
    app.request(url, {
      id: id,
      openid: app.openid
    }, 'PUT', function(res) {
      if (res.data.flag == true) {
        app.SHDZ_id = list[index].Id;
        app.SHDZ_name = list[index].Name;
        app.SHDZ_hp = list[index].Phone;
        app.SHDZ_ard = list[index].Detail + "：" + list[index].DetailText;
        that.setData({
          sh_ul: list
        });
      }
    }, function() {})


  },
  OnGoAddress: function() {
    wx.navigateTo({
      url: '../../../pages/my/my_sh/my_sh'
    })
  },
  confirm: function() {
    var that = this;
    if (that.data.orderId > 0) {
      var list = this.data.sh_ul;

      for (var i = 0; i < list.length; i++) {
        if (list[i].IsDefault) {
          app.SHDZ_id = list[i].Id;
          app.SHDZ_name = list[i].Name;
          app.SHDZ_hp = list[i].Phone;
          app.SHDZ_ard = list[i].Detail + "：" + list[i].DetailText;

        }
      }

      var url = 'api/Order/SetAdress?orderId=' + that.data.orderId;
      app.request(url, {}, 'PUT', function(res) {
        console.log(res);
        console.log("%%%%%%");
        if (res.data.flag) {
          wx.redirectTo({
            url: '../../../pages/shop_list/shop_order/shop_order?id=' + that.data.orderId,
          })
        }
      }, function() {})
    }

  },
  //跳转新增
  GoInsert: function() {
    wx.navigateTo({
      url: '/pages/my/add_address/add_address?id=' + '-1&orderId=' + this.data.orderId,
    })
  },

  //跳转编辑
  GoUpdate: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.sh_ul;
    var id = list[index].Id
    wx.navigateTo({
      url: '/pages/my/add_address/add_address?id=' + id + '&orderId=' + this.data.orderId,
    })
  },
  //删除地址
  DeleteAddress: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var list = this.data.sh_ul;
    var id = list[index].Id

    wx.showModal({
      title: '提示',
      content: '是否删除地址？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.name + 'api/Address/' + id + '?openid=' + app.openid,
            data: {},
            method: 'DELETE',
            success: function(res) {
              if (res.data.flag) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
                list.splice(index, 1);
                that.setData({
                  sh_ul: list
                })
                // wx.navigateTo({
                //   url: '../../../pages/my/my_shdz/my_shdz?id=' + that.data.orderId,
                // })
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
  }

})
const app = getApp()

Page({
  data: {
    appUserType:1,
    show: !0,
    form: {
      Id: '',
      Name: '',
      gender: 'male',
      Phone: '',
      Detail: '',
      DetailText:'',
      IsDefault: !1,
      Lat: "",
      Lng: "",
      OpenId: "",
      orderId: 0,
    },
    IsProduct: false,
    IsSave: false,
    multiArray: [['遂宁市'], ['船山区'], ['河东新区']],
    objectMultiArray: [
      [{ id: 0, name: '遂宁市' }],
      [{ id: 0, name: '船山区' }],
      [{ id: 0, name: '河东新区' }]
    ],
    multiIndex: [0, 0, 0],
  },

  onLoad(options) {
    var id = options.id
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
    if (options.orderId != undefined) {
      that.setData({
        orderId: options.orderId
      })
    }
    if (id > 0) {
      var url = 'api/Address/' + id
      app.request(url, {}, 'GET', function (res) {
        console.log(res);
        console.log("&&&&&&&&");
        that.setData({
          form: res.data.model,
        })
        wx.setNavigationBarTitle({
          title: '编辑地址'//页面标题为路由参数
        })

      }, function () { })
    }
    else {
      if (id == '-1') {
        that.setData({
          IsProduct: true
        })
      }
      wx.setNavigationBarTitle({
        title: '新增地址'//页面标题为路由参数
      })

    }

  },





  //微信地图,选地址
  location: function () {
    var that = this
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        that.setData({
          'form.Lat': res.latitude,
          'form.Lng': res.longitude,
          'form.Detail': res.address,
        })
      }
    })
  },

  //设置默认
  changeDef: function (e) {
    this.setData({
      IsDefault: e.detail.value
    })
  },

  //form表单提交
  formSubmit: function (e) {
    var that = this;
    var name = e.detail.value.Name;
    var phone = e.detail.value.Phone;
    var address = e.detail.value.Detail;
    var addressText = e.detail.value.DetailText;
    var IsDefault = e.detail.value.IsDefault;
    console.log("phone=" + phone);
    var myreg = /^1[345789]\d{9}$/;
    if (that.data.IsSave) {
      return;
    }
    that.setData({
      IsSave: true,
    })
    //判定
    if (name.length == 0) {
      wx.showToast({
        title: '收货人为空',
        icon: 'success',
        duration: 1500
      })
      that.setData({
        IsSave: false,
      })
      return;
    }
    if (phone.length == 0) {
      wx.showToast({
        title: '电话为空',
        icon: 'success',
        duration: 1500
      })
      that.setData({
        IsSave: false,
      })
      return;
    }
    if (!myreg.test(phone)) {
      wx.showToast({
        title: '电话错误',
        icon: 'success',
        duration: 1500
      })
      that.setData({
        IsSave: false,
      })
      return;
    }
    if (address.length == 0) {
      wx.showToast({
        title: '请选择收获地址',
        icon: 'success',
        duration: 1500
      })
      that.setData({
        IsSave: false,
      })
      return;
    }
    var month = 'Put';
    if (that.data.form.Id == null || that.data.form.Id == 0) {
      var month = 'POST';
    }
    var qxader = address +"-"+ addressText;
    console.log("地址");
    console.log(qxader);
    //向后抬传数据
    var url = 'api/Address';
    app.request(url, {
      Name: name,
      Detail: address,
      DetailText: addressText,
      Phone: phone,
      IsDefault: IsDefault,
      Lng: that.data.form.Lng,
      Lat: that.data.form.Lat,
      OpenId: app.openid,
      Id: that.data.form.Id

    }, month, function (res) {
      if (res.data.flag) {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 1500
        })
        that.setData({
          IsSave: false
        })
        console.log("1111111");
        console.log(that.data.orderId);
      
        if (that.data.orderId>0) {
          wx.navigateTo({
            url: '../../../pages/my/my_shdz/my_shdz?id=' + that.data.orderId,
          })
        }
        else {
          wx.navigateTo({
            url: '../../../pages/my/my_sh/my_sh'
          })

        }

      }
      else {
        that.setData({
          IsSave: false
        })
      }
    }, function () { })
    that.setData({
      IsSave: false
    })
  },
  //选择区域
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['遂宁市'];
            data.multiArray[2] = ['船山区'];
            break;

        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },

})
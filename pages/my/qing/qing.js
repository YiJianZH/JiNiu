const app = getApp()
Page({
  data: {
    name:"",
    phone:"",
  },

   //申请成为业务员
  ApplyShare: function () {
    var that = this;
    var myreg = /^1[345789]\d{9}$/;
    if(that.data.name.length==0)
    {
      wx.showToast({
        title: '请输入姓名',
      })
      return;
    }
    if (that.data.phone.length == 0) {
      wx.showToast({
        title: '请输入手机号',
      })
      return;
    }
    else if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '手机号错误',
        icon: 'success',
        duration: 1500
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认申请成为业务员？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.name + 'api/User/SaleApply',
            method: 'POST',
            data: { 
              openid: app.openid,
              name:that.data.name,
              phone: that.data.phone,
             },
            success: function (res) {
              if (res.data.flag) {
                wx.showToast({
                  title: "申请成功",
                })
                wx.switchTab({
                  url: '/pages/my/my',
                })
              }
              else {
                wx.showToast({
                  title: res.data.msg,
                })

              }
            }
          })
        }
      }
    })

  },

  InputSave:function(e){
    var that=this;
    var id = e.currentTarget.dataset.id;
    var content=e.detail.value;
    if(id=="name")
    {
that.setData({
  name: content 
})
    }else
    {
      that.setData({
      
        phone: content
      })
    }
  }

})
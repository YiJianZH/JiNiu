const app = getApp()
Page({

  data: {
    newPwd:"",
  },

  
  onLoad: function (options) {
this.setData({
  newPwd: app.HomeStore.Name
})
  },
  setName:function(e){
    console.log(e);
    this.setData({
      newPwd: e.detail.value
    });
  },
  OnlickSave:function(){
    var that = this;
    var pwd = that.data.newPwd;
    if (pwd.length==0){
      wx.showToast({ title: '请输入修改密码', icon: 'none', duration: 2000 });
      return false;
    }

    app.request('api/User/ChangeStoreName' , {
      StoreId: app.HomeStore.Id,
      password: pwd
    }, "POST",
      function (res) {
        console.log("修改中");
        console.log(res);
        if (res.data.flag) {
          wx.showToast({ title: '成功', icon: 'none', duration: 2000 });
        var shop=  app.HomeStore;
          shop.Name = pwd;
          app.HomeStore = shop;
        }else{
          wx.showToast({ title: '失败', icon: 'none', duration: 2000 });
        }
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      },
      function () {
        wx.showToast({ title: '修改无效', icon: 'loading', duration: 2000 });
      })




  }

})
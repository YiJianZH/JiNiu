const app = getApp()
Page({

  data: {
    newPwd:"",
  },

  
  onLoad: function (options) {

  },
  setPwd:function(e){
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

    app.request('api/User/ChangeStoreWord' , {
      StoreId: app.HomeStore.Id,
      password: pwd
    }, "POST",
      function (res) {
        console.log("修改中");
        console.log(res);
        if (res.data.flag) {
          wx.showToast({ title: '成功', icon: 'none', duration: 2000 });
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
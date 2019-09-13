//获取应用实例
const app = getApp()
Page({
  data: {
    userName:"",
    userPwd:"",
    isnolikc:true,
    isSelected: true,
  },

  setSH: function () {
    var that = this;
    that.setData({
      isSelected: !that.data.isSelected
    })
  },
  onLoad: function () {
    var that = this;
    console.log("&&&&&&&&&&&&");
    console.log(app.UserAccount);
    console.log(app.UserPwd);
    that.setData({
      isnolikc: true,
      userName: app.UserAccount,
      userPwd: app.UserPwd,
    });
  },
  onShow:function(){
    var that = this;
    that.setData({
      isnolikc: true
    });
  },
  setname: function (e) {
    var that = this;
    var name = e.detail.value;
    that.setData({
      userName: name
    });

  },
  setpwd: function (e) {
    var that = this;
    var pwd = e.detail.value;
    that.setData({
      userPwd: pwd
    });
  },
  to_home:function(){
    var that = this;
    if(that.data.isnolikc){
      that.setData({
        isnolikc:false
      });
      var name = that.data.userName;
      var pwd = that.data.userPwd;
      if (name.length == 0) {
        wx.showToast({
          title: '请输入账号',
          icon: 'none',
          duration: 2000
        });
        // return false;
      }
      if (pwd.length == 0) {
        wx.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 2000
        });
        // return false;
      }
      console.log("登录中");
      console.log("name=" + name);
      console.log("pwd=" + pwd);

      app.request('api/User/StoreLogin', {
        name: name,
        password: pwd,
        openid: app.openid,
        remember: that.data.isSelected?1:0,
      }, "POST",
        function (res) {
          
          console.log(res);
          if (res.data.flag) {
            app.HomeStore = res.data.storeModel;
            if (app.HomeStore.TypeId==2){
              wx.reLaunch({
                url: '/pages/backstage/home/ptSMDing/ptSMDing'
              }) 
            }
            if (app.HomeStore.TypeId == 3) {
              wx.reLaunch({
                url: '/pages/backstage/home/ptDing/ptDing'
              }) 
            }
            
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            });
            that.setData({
              isnolikc: true
            });
          }
        },
        function () {
          wx.showToast({
            title: '登录不成功',
            icon: 'loading',
            duration: 2000
          });
        }
      )
    }
  }
})

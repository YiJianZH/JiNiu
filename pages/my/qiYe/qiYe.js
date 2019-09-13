const app = getApp()
Page({
  data: {
    msgText:"获取验证码",
    EnterpriseName: "",//企业名称
    EnterpriseAddr: "",//企业地址
    License: "/images/my_fa.png",//营业执照
    DoorPhoto: "/images/my_fa.png",//门头照
    Contacts: "",//联系人
    Telephone: "",//电话
    Code: "",//输入验证码
    Codestr: "",//返回验证码
    Status:0,
    appUserType:1,
  },
  onLoad: function (options){
    var that = this;
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
    that.getEnterpriseApply();
  },
  getEnterpriseApply:function(){
    var that = this;
    //调用接口
    app.request('api/User/GetEnterpriseApply?Openid=' + app.openid, {}, "GET",
      function (res) {
        console.log("获取申请信息");
        console.log(res);
        if (res.data.flag) {
          var entity = res.data.entity;
          that.setData({
            EnterpriseName: entity.EnterpriseName,//企业名称
            EnterpriseAddr: entity.EnterpriseAddr,//企业地址
            License: entity.License,//营业执照
            DoorPhoto: entity.DoorPhoto,//门头照
            Contacts: entity.Contacts,//联系人
            Telephone: entity.Telephone,//电话
            Status: entity.Status,
          });

        }
      },
      function () { //error
        wx.showToast({title: '没有找到数据',icon: 'loading',duration: 2000 });
      }
    );
  },
  setEnterpriseName:function(e){
    this.setData({
      EnterpriseName: e.detail.value
    });

  },
  setEnterpriseAddr:function(e){
    this.setData({
      EnterpriseAddr: e.detail.value
    });
  },
  setCode: function (e) {
    this.setData({
      Code: e.detail.value
    });
  },
  setContacts: function (e) {
    this.setData({
      Contacts: e.detail.value
    });
  },
  setTelephone: function (e) {
    this.setData({
      Telephone: e.detail.value
    });
  },
  getCode:function(){
    var that = this;
    
    var Telephone = that.data.Telephone;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (Telephone.length == 0) {
      wx.showToast({
        title: '手机号必填',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (Telephone.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(Telephone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var nuber = 60;
    that.timeset(nuber);
    app.request('api/User/SendSms?Phone=' + Telephone, {}, "POST",
      function (res) {
        console.log("默认赋值验证码");
        console.log(res);
        if (res.data.flag) {
          //默认赋值验证码
          that.setData({
            Codestr: res.data.msg,
          });
        }
      },
      function () {
        wx.showToast({
          title: '获取类型失败',
          icon: 'success',
          duration: 2000
        })
      })



  },
  //计时
  timeset: function (nuber){
    var that = this;
    that.setData({
      msgText: nuber
    });
    nuber--;
    if (nuber<0){

      clearTimeout(timerTem);
      that.setData({
        msgText: "获取验证码"
      });
    }else{
      var timerTem = setTimeout(function () {
        console.log("执行中nuber=" + nuber);
        that.timeset(nuber);
      }, 1000);
    }
   
  },
  //上传图片
  getUpdateImage:function(e){
    var that = this;
    console.log("Status="+that.data.Status);
    if (that.data.Status!=1){
      console.log(e.currentTarget.dataset.did);
      var did = e.currentTarget.dataset.did;

      wx.chooseImage({
        count: 1, // 最多可以选择的图片张数，默认9
        sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          wx.uploadFile({
            url: app.name + 'api/User/AsyncUpload',
            filePath: res.tempFilePaths[0],
            name: 'file',
            header: { "Content-Type": "multipart/form-data" },
            success: function (res1) {
              var res2 = JSON.parse(res1.data)
              console.log(res2);
              console.log(res2.flag);
              console.log(res2.result);
              if (did == 1) {
                that.setData({
                  License: res2.result
                });
              } else {
                that.setData({
                  DoorPhoto: res2.result
                });
              }

              if (res2.flag) {
                if (did == 1) {
                  that.setData({
                    License: res2.result
                  });
                } else {
                  that.setData({
                    DoorPhoto: res2.result
                  });
                }

              }
              else {
                wx.showToast({
                  title: '上传失败',
                  icon: 'fail',
                  duration: 2000
                })

              }

            }
          })

        },
        fail: function (res1) {
          console.log(res1);
        },
        complete: function (res1) {
          console.log(res1);
        }
      })
    }
  },
  formSubmit1:function(e){
    var that = this;
    console.log("点击提交");
    var EnterpriseName = that.data.EnterpriseName;//企业名称
    var EnterpriseAddr = that.data.EnterpriseAddr;//企业地址
    var License = that.data.License;//营业执照
    var DoorPhoto = that.data.DoorPhoto;//门头照
    var Contacts = that.data.Contacts;//联系人
    var Telephone = that.data.Telephone;//电话
    var Code = that.data.Code;//输入验证码
    var Codestr = that.data.Codestr;//返回验证码

    if (EnterpriseName.length==0){
      wx.showToast({ title: '请输入企业名称',icon: 'none' }, 2000)
      return;
    }
    if (EnterpriseAddr.length == 0) {
      wx.showToast({ title: '请输入企业地址', icon: 'none' }, 2000)
      return;
    }
    if (License.length == 0 || License=="/images/my_fa.png") {
      wx.showToast({ title: '请上传营业执照', icon: 'none' }, 2000)
      return;
    }
    if (DoorPhoto.length == 0 || DoorPhoto == "/images/my_fa.png") {
      wx.showToast({ title: '请上传门头照', icon: 'none' }, 2000)
      return;
    }
    if (Contacts.length == 0) {
      wx.showToast({ title: '请输入联系人', icon: 'none' }, 2000)
      return;
    }
    if (Telephone.length == 0) {
      wx.showToast({ title: '请输入联系电话', icon: 'none' }, 2000)
      return;
    }else{
      var myreg = /^1[345789]\d{9}$/;
      if (!myreg.test(Telephone)) {
        wx.showToast({
          title: '手机号错误',
          icon: 'success',
          duration: 1500
        })
        return;
      }
    }
    if (Code.length == 0) {
      wx.showToast({ title: '请输入验证码', icon: 'none' }, 2000)
      return;
    }else{
      if (Code != Codestr){
        wx.showToast({ title: '验证码不正确', icon: 'none' }, 2000)
        return;
      }
    }

    //调用接口
    app.request('api/User/InseetSQ', {
      Openid: app.openid,
      EnterpriseName: EnterpriseName,
      EnterpriseAddr: EnterpriseAddr,
      License: License,
      DoorPhoto: DoorPhoto,
      Contacts: Contacts,
      Telephone: Telephone
    }, "POST",
      function (res) {
        console.log(res);
        if (res.data.flag) {
          wx.showToast({title: '申请成功',icon: 'none',duration: 2000});

        }else{
          wx.showToast({ title: '申请错误,申请信息可能有变更', icon: 'none', duration: 3000 });
          
        }
        //重新加载
        that.getEnterpriseApply();
      },
      function () { //error
        wx.showToast({
          title: '申请错误',
          icon: 'loading',
          duration: 2000
        });
      }
    );


    

  }
})
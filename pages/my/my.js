const app = getApp()
Page({
  data: {
    Activity: 0,//分享开关
    appUserType:1,
    usetId:0,
    ApplyRepository: false,
    UserEnterprise: false,      
    my_a_img:"../../images/my_f.png",
    bj:"编辑",
    name:"",
    magesstye:true,
    referrer:"",
    id:"12345678904",
    my_tx_img: app.avatarUrl,
    info_li:[
      { jf: "积分", jf_a:"",status:false},
      //{ jf: "佣金", jf_a: "", status: false},
      { jf: "余额", jf_a: "", status: false }
    ],
    fk_a:"待付款",
    fk_a_img:"../../images/my_m.png",
    fk_a_Num:"",
    fk_b:"待发货",
    fk_b_img: "../../images/my_o.png",
    fk_b_Num: "",
    fk_c:"配送中",
    fk_c_img: "../../images/my_o.png",
    fk_c_Num: "",
    fk_d:"全部订单",
    fk_d_img: "../../images/my_b.png",
    fk_d_Num: "",
    logdig:true,//判断多少点击
    SaleStatus: 3,// 业务员状态 1审核中 2已通过 3其他 已拒绝及未申请
  },

  to_backstage: function () {
    wx.navigateTo({
      url: '/pages/backstage/bs'
    })
  },
  formSubmit:function(e){
    console.log("点击");
    var fId = e.detail.formId;
    console.log("formId=" + fId);
    app.request('api/User/SaveFromId?fromId=' + fId + '&openId=' + app.openid, {}, "GET",
      function (res) {
        console.log("formId添加成功");
      },
      function (error) { //error

      }
    );
  },

  onShow:function(){
    var that = this

    //app.openid ="oJojr4qLtBmfKktyMimOnVWUaOFs";//测试
    console.log("IsBooths=" + app.IsBooths);
    that.setData({
      IsBooths: app.IsBooths,
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
      
      

    }else{
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#47b34e',
        animation: {
          duration: 40,
          timingFunc: 'easeIn'
        }
      })
    }
    if (!app.IS_Masge) {
      wx.showLoading({
        title: '该区域暂未开通！',
      })
      return;
    }else{
      var that = this
      that.GetUser();
    }
    
  },
  onLoad: function () {
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
        appUserType:app.appUserType
      });

    }
    if (!app.IS_Masge) {
      wx.showLoading({
        title: '该区域暂未开通！',
      })
      return;
    }
    else {
      
      that.GetUser();
    }
  },
  GetUser:function(){
    var that = this
    var picture = '';
    
    console.log("openid=" + app.openid);
    wx.request({
      url: app.name + 'api/User/' + app.openid + '?marketId=' + app.Market.Id,
      method: 'GET',
      success: function (res) {
        console.log("@@@@");
        console.log(res);
        if (res.data.flag) {
          app.UserAccount = res.data.model.UserAccount;
          app.UserPwd = res.data.model.UserPwd;
          picture = res.data.model.HeadUrl == null ? '' : res.data.model.HeadUrl;
          var list = that.data.info_li;
          for (var i = 0; i < list.length; i++) {
            if (list[i]['jf'] == "积分") {
              list[i]['jf_a'] = res.data.model.Integral;
            }
            else if (list[i]['jf'] == "佣金") {
              list[i]['jf_a'] = res.data.model.Bonus.toFixed(2);
            }
            else if (list[i]['jf'] == "余额") {
              list[i]['jf_a'] = res.data.model.Money.toFixed(2); 
              list[i]['status'] = true;
            }
            that.setData({
              usetId: res.data.model.Id,
              magesstye:false,
              name: res.data.model.Name,
              id: res.data.model.CodeNumber == null ? '' : res.data.model.CodeNumber,
              referrer: res.data.model.RecommendName == null ? '无' : res.data.model.RecommendName,
              info_li: list,
              fk_a_Num: res.data.model.PayCount,
              fk_b_Num: res.data.model.SendCount,
              fk_c_Num: res.data.model.DeliveryCount,
              fk_d_Num: res.data.model.AllCount, 
              SaleStatus: res.data.model.SaleStatus,    
              ApplyRepository: res.data.model.ApplyRepository,
              UserEnterprise: res.data.model.UserEnterprise,      
            })
          }
          if (picture == '') {
            wx.getUserInfo({
              success: function (res) {
                var userInfo = res.userInfo
                that.setData({
                  my_tx_img: userInfo.avatarUrl,
                })
                if (that.data.name == null || that.data.name == '') {
                  that.setData({
                    name: userInfo.nickName == null ? '' : userInfo.nickName,
                  })
                }
              }
            })
          }
          else {
            that.setData({
              my_tx_img: picture,
            })
          }
        }
      }
    })
   
  },
  code:function(){
    wx.navigateTo({
      url: '../../pages/my/enconde/enconde?path=scene'
    })
  },
  qing: function () {
    wx.navigateTo({
      url: '../../pages/my/qing/qing'
    })
  },
  // 下拉刷新  
  onPullDownRefresh: function () {
    var that = this
    // 显示导航栏loading  
    wx.showNavigationBarLoading();
    // 调用接口加载数据  
    that.onLoad();
    // 隐藏导航栏loading  
    wx.hideNavigationBarLoading();
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新  
    wx.stopPullDownRefresh();

  },
  makePhoneCall:function(){
    wx.makePhoneCall({
      phoneNumber: '400-180-6050' // 仅为示例，并非真实的电话号码
    })
  },
  my_xiaJi: function () {
    wx.navigateTo({
      url: '/pages/my/my_xiaJi/my_xiaJi'
    })
  }, 
  //修改用户端口
  ApplyType:function(e){

    var that = this;
    if (that.data.logdig){
      var tid = e.currentTarget.dataset.tid;
      console.log("tid=" + tid);
      console.log("111");
      that.setData({
        logdig:false
      });

      wx.request({
        url: app.name + 'api/User/Repository?userid=' + that.data.usetId+'&typeid='+tid,
        method: 'GET',
        data: {},
        success: function (res) {
          that.setData({
            logdig: true
          });
          if (res.data.flag) {
            if (tid==1){
              app.appUserType =2
            }else{
              app.appUserType = 1
            }
            
            wx.switchTab({
              url: '/pages/index/index'
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
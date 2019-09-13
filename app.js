
App({
  name: 'https://www.yongbox.com:88/',//'http://localhost:15536/',//
  // name: 'http://localhost:15536/',
  appid: 'wx8afdcd6176506fd7', //appid需自己提供
  secret: '54b84f7210f7077eb4c5d96ad917ec87', //secret需自己提供
  openid: '',
  WX: 900,
  WY: 900,
  Activity:0,//分享开关
  appUserType:1,//1 一般用户 2 企业用户
  storeId:0,
  IsBooths:0,
  Market:{},//当前市场
  Store:{},
  HomeStore:{},//商户后台
  HomSelectPordt:[],//后台批量选择产品
  HomCouponPordt:[],//优惠产品
  HomEntity:{},//资金明细
  customerId: '1',
  ISoptions: true,
  Details: false,
  AreaId: "510903", //所在地区编号
  avatarUrl: '',
  Distribution: { id: 1, name: "立即配送" },//下单时间
  subOrderDate: "请选择预约日期",
  OrderTimeStr: "选择时间",
  nuber: "0", //是否是第一次登陆
  SUSname: "", //产品列表搜索名称
  SUStypeId: 0, //产品列表搜索类型编号
  SUSpromotionId: 0, //产品列表搜索活动编号
  tapLogId: "",
  ZF_list: [],
  ISorederid: 0, //占用订单ID
  IS_Masge: true,
  SHDZ_id: 0, //收货地址
  SHDZ_name: "", //收货地址
  SHDZ_hp: "", //收货地址
  SHDZ_ard: "", //收货地址
  PreferentialId: 0, //优惠券id
  PreferentialPrice: 0, //优惠券金额
  couponList: [],
  couponMoney: 0,//优惠金额
  OrdeText: "",
  latitudet: "30.527223", //店铺所在经纬度
  longitudet: "105.594149", //店铺所在经纬度
  coupon: {
    Id: "",
    price: ""
  },
  couponFrom:false,//是否来自优惠券列表
  OrderConfirmId:0,
  UserAccount:"",//后台账号
  UserPwd:"",//后台密码
  IsCode: false,
  apiAcessToken: '', //认证token,每次请求api需加上
  onLaunch: function(ops) {
    if (ops.scene == 1044) {
      console.log("shareTicket:" + ops.shareTicket)
    }
    if (ops.shareTickets) {
      //
      // 获取转发详细信息
      wx.getShareInfo({
        shareTicket: res.shareTickets[0],
        success(res) {
          res.errMsg; //
          //错误信息
          res.encryptedData; //
          //解密后为一个 JSON 结构（openGId  群对当前小程序的唯一 ID）
          res.iv; //
          //加密算法的初始向量
        },
        fail() {},
        complete() {}
      });
    }
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        
      }
    })
  },
  onShow:function(){
    console.log("是否执行");
   
  },
  UserType:function(){
    if (this.appUserType==2){
      //企业版
      wx.setTabBarItem({
        index: 0,
        selectedIconPath: '/images/icon_homea_lan.png'
      })
      wx.setTabBarItem({
        index: 1,
        selectedIconPath: '/images/icon_typea_lan.png'
      })
      wx.setTabBarItem({
        index: 2,
        selectedIconPath: '/images/icon_shopa_lan.png'
      })
      wx.setTabBarItem({
        index: 3,
        selectedIconPath: '/images/icon_mya_lan.png'
      })
      wx.setTabBarStyle({
        "color": "#666666",
        "selectedColor": "#0066FF",
      })
      wx.setBackgroundColor({
        backgroundColor: '#0066FF', // 窗口的背景色为白色
      })

    }else{
      //个人版
      wx.setTabBarItem({
        index: 0,
        selectedIconPath: '/images/icon_homea.png'
      })
      wx.setTabBarItem({
        index: 1,
        selectedIconPath: '/images/icon_typea.png'
      })
      wx.setTabBarItem({
        index: 2,
        selectedIconPath: '/images/icon_shopa.png'
      })
      wx.setTabBarItem({
        index: 3,
        selectedIconPath: '/images/icon_mya.png'
      })
      wx.setTabBarStyle({
        "color": "#666666",
        "selectedColor": "#47b34e",
      })

    }

  },
  globalData: {
    userInfo: null
  },
  //app.js
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.personInfo) {
      typeof cb == "function" && cb(this.globalData.personInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function() {
          wx.getUserInfo({
            success: function(res) {
              that.globalData.personInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.personInfo)
            }
          })
        }
      })
    }
  },
  getToken: function(openid, next) { //获取api的token
    var basicStr = this.Base64Encode(openid + ":" + 'hello');
    wx.request({
      url: this.name + 'token',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "Authorization": "Basic " + basicStr
      },
      data: {
        "grant_type": "client_credentials"
      },
      method: 'POST',
      success: function(res) {
        next(res.data.access_token);
      }
    })
  },
  request: function(url, data, method, success, error) {
    wx.request({
      url: this.name + url,
      header: {
        'Content-Type': 'application/json;charset=utf-8',
        "Authorization": "Bearer " + this.apiAcessToken
      },
      data: data,
      method: method,
      success: function(res) {
        if (res.statusCode == 200) {
          success(res); //成功回调
        } else {
          error(res); //失败回调
        }
      },
      fail: function(res) {
        console.log(res);
        error(); //失败回调
      }
    })
  },
  //加入购物车
  joinCart: function(pid, unitid, error) {
    var that = this;
    wx.request({
      url: that.name + 'api/Product/GetInventory?id=' + unitid,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + that.apiAcessToken
      },
      data: {},
      success: function(res) {
        if (res.data.msg <= 0) {
          wx.showToast({
            title: '库存不足',
            icon: 'loading',
            duration: 2000
          });
          return;
        } else {
          wx.request({
            url: that.name + 'api/Cart',
            data: {
              pid: pid,
              unitid: unitid,
              openid: that.openid
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + that.apiAcessToken
            },
            success: function(res) {
              wx.showToast({
                title: '已加入购物车',
                icon: 'success',
                duration: 2000
              })
            }
          })
        }
      },
      fail: function(res) {

      }
    })

  },
  //加入我的收藏
  joinCollect: function(pid) {
    var that = this
    var url = 'api/Collect'
    this.request(url, {
      openid: that.openid,
      pid: pid
    }, 'POST', function(res) {
      wx.showToast({
        title: '已加入收藏',
        icon: 'success',
        duration: 2000
      })
    }, function() {

    })
  },
  //取消收藏
  cancelCollect: function(pid) {
    var url = 'api/Collect?pid=' + pid + '&openid=' + this.openid
    this.request(url, {}, 'DELETE', function(res) {
      wx.showToast({
        title: '已取消收藏',
        icon: 'success',
        duration: 2000
      })
    }, function() {})
  },
  //加入我的收藏
  joinCollect: function(pid, success) {
    var url = 'api/Collect'
    this.request(url, {
      pid: pid,
      openid: this.openid
    }, 'POST', function(res) {
      if (res.data.flag) {
        success();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
      }
    }, function() {
      wx.showToast({
        title: '加入收藏失败',
        icon: 'success',
        duration: 2000
      })
    })
  },
  //取消收藏
  cancelCollect: function(pid, success) {
    var url = 'api/Collect?pid=' + pid + '&openid=' + this.openid
    this.request(url, {}, 'DELETE', function(res) {
      success();
    }, function() {

    })
  },
  SetCartNum: function(id, num, success) { //更新购物车数据量
    var url = 'api/Cart';
    this.request(url, {
      "num": num,
      "id": id
    }, 'PUT', function(res) {
      success();
    }, function() {
      return 'false';
    })
  },
  Base64Encode: function(str) {
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var i = 0,
      len = str.length,
      string = '';

    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i === len) {
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt((c1 & 0x3) << 4);
        string += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i === len) {
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        string += base64EncodeChars.charAt((c2 & 0xF) << 2);
        string += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      string += base64EncodeChars.charAt(c1 >> 2);
      string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      string += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return string;
  },
  //产品批量上下架，单个也可以
  //pid:产品id以逗号分开
  //status：1上架 2下架
  UpLowProduct: function (pid, status) {
    var url = 'api/Product/SetListUpperDownShelf'
    this.request(url, {
      pid: pid,
      status: status
    }, 'GET', function (res) {
      wx.showToast({
        title: res.data.msg,
        icon: 'success',
        duration: 2000
      })
    }, function () {
     
    })
  },
})
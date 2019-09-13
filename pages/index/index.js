  //index.js
  //获取应用实例
  const app = getApp()
  var code;
  var city;
  Page({
    data: {
      Activity:0,//分享开关
      dcostvery:0,//配送距离
      QYdcostvery:0,//企业距离
      appUserType: 1,
      distance: 0, //市场距离
      IsOrderBy: 2,
      array: [],
      current:0,
      index: 0,
      _num:3, //变色
      IsBooths: 0,
      isLogin: false,
      stall_lists: [],
      logfig: true,
      IStaype: false,
      init: false,
      init_a: false,
      ptflag: true,
      scene: '',
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏  
      IsLog: true,
      storeList: [], //市场集合
      cscname: '', //市场名称
      cscId: '', //市场ID
      page: 1,
      TopStyp: true, //回到顶
      scrollValue: 1,
      isHideLoadMore: true,
      modal_style: "display:none", //授权弹窗
      hidden: true,
      intnuber: 0, //无数据
      indett: 0, //三级分类ID值
      CategoryList: [], //所有三级分类
      HD_style: "height:auto",
      SS_type: "display:none", //时蔬样式
      HX_type: "display:none", //海鲜样式
      TS_type: "display:none", //特色样式
      YZ_type: "display:none", //一周样式
      windowHeight: 0,
      windowHeightTT: "",
      address: "遂宁市",
      addressCode: "510903",
      addressText: "遂宁市船山区",
      TextName: "", //搜索内容
      TeTuiTime: "-",
      TeTuiImag: "",
      TeTuiImagId: 0,
      SSHD_id: 0,
      JRHX_id: 0,
      TSCP_id: 0,
      YZRM_id: 0,
      modal_style: "display:none",
      ani_style: "display:none",
      animation: '',
      location: "../../images/my_la.png",
      huodong_img: "../../images/image_activity.png",
      more_img: "../../images/but_more.png",
      shiling_img: "../../images/image_vegetables.png",
      SC_name: "", //蔬菜标题
      SC_img: "", //蔬菜图片
      SC_id: "",
      hx_img: "../../images/image_seafood.png",
      haixian_img: "",
      tese_img: "../../images/image_tese.png",
      rm_img: "../../images/image_hot.png",
      jia_img: "../../images/icon_add.png", //+
      hodong_img: [], //活动
      hodong_products:[],//具体活动产品
      Category: [], //产品类型
      Movies: [], //轮播图
      SLProduct: [], //时蔬
      HXProduct: [], //海鲜
      TeTuili: [], //特推
      More: [], //特色商品
      Remai: [], //一周热卖
      remaitype: true, //上滑
      nickName: "",
      avatarUrl: '',
      latitudet: 0,
      longitudet: 0,
      SdataList: [],
      Typelist: [],
      TypeName: '全部',
      TypeId: 0,
      txtName: "",
      loadNum: 0, //首页前三项加载
      loadShow: true,
      outpopSH: true, //提示距离
      outpopGGa: false,
      GGMsg: "",
      locationPoppSH: true,
      isBusiness: false,
      init: false,
      state: false,
      newCouponList: [], //新手优惠券
      isFirstLogin: true,
      IsUpAble: "ptHomeShow",
      // boxHeight: ''
    },

    clickNum: function(e) {

      var IsOrderBy = 0;
      if (e.target.dataset.num > 1) {
        IsOrderBy = e.target.dataset.num - 1;
      }
      this.setData({
        IsOrderBy: IsOrderBy,
        _num: e.target.dataset.num
      })
      if (e.target.dataset.num > 1) {
        this.GetGetStoreList(1);
      }
    },
    bindPickerChange(e) {
      var that = this;
      var typeid = that.data.Typelist[e.detail.value].Id;
      that.setData({
        TypeId: typeid,
        index: e.detail.value
      })
      that.GetGetStoreList(1);
    },
    mjToggle: function(e) {
      var that = this;
      var init = e.currentTarget.dataset.init;
      var list = that.data.SdataList;
      if (list[init].init == undefined) {
        list[init].init = true;
      } else {
        if (list[init].init) {
          list[init].init = false;
        } else {
          list[init].init = true;
        }

      }

      that.setData({
        SdataList: list
      });

    },
    closewSubmit: function(e) {

      this.setData({
        outpopGG:false,
        outpopSH: true,
        IsUpAble: "",
        locationPoppSH: true
      })

      var fId = e.detail.formId;
      console.log('--2019 zdh fId' + fId + 'openId:' + app.openid);
      app.request('api/User/SaveFromId?fromId=' + fId + '&openId=' + app.openid, {}, "GET",
        function(res) {
          console.log(res);
          console.log("formId添加成功");
        },
        function(error) { //error

        }
      );
    },

    
    bindSubmit: function(e) {

      var fId = e.detail.formId;

      var sid = e.currentTarget.dataset.bid;
      app.request('api/User/SaveFromId?fromId=' + fId + '&openId=' + app.openid, {}, "GET",
        function(res) {
          console.log("formId添加成功");
        },
        function(error) { //error

        }
      );

      wx.navigateTo({
        url: '/pages/index/merchartYellowPage/myp?sid=' + sid
      })

    },
    //跳转到商家详情
    GoShopDetail: function(e) {
      var that = this;
      var sid = e.currentTarget.dataset.bid;
      wx.navigateTo({
        url: '/pages/index/merchartYellowPage/myp?sid=' + sid
      })
    },

    icon_closew: function() {
      this.setData({
        outpopSH: true,
        IsUpAble: "",
        locationPoppSH: true
      })
    },

    icon_closegg:function(){
      console.log("11111111");
      this.setData({
        outpopGG:false,
      })
    },
    // 下拉刷新  
    onPullDownRefresh: function() {
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
    //转发
    onShareAppMessage: function(res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      return {
        title: '吉牛到家-手机上的菜场',
        desc: '最具人气的小程序商城!',
        path: '/pages/index/index',
        success: function(res) {
          // 转发成功
          //wx.showToast({ title: '转发成功！', icon: 'loading', duration: 2000 });
          //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android
          //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets

          var shareTickets = res.shareTickets;

          if (shareTickets != undefined) {
            console.log("转发群");
            wx.getSystemInfo({
              success: function(d) {
                if (d.platform == 'android' && (res.shareTickets.length > 0)) {
                  wx.getShareInfo({
                    shareTicket: res.shareTickets,
                    success: function() {
                      wx.showToast({
                        title: "转发成功！",
                        duration: 2000
                      });
                    },
                    fail: function() {
                      wx.showToast({
                        title: "转发群失败",
                        duration: 2000
                      });
                    }
                  })
                }
                if (d.platform == 'ios' && (res.shareTickets.length > 0)) {
                  wx.showToast({
                    title: "转发成功！",
                    duration: 2000
                  });
                }
              },
              fail: function(res) {
                wx.showToast({
                  title: "转发失败",
                  duration: 2000
                });
              }
            })
          } else {
            console.log("转发个人");
            wx.showToast({
              title: '转发成功！',
              duration: 2000
            });
          }
        },
        fail: function(res) {
          // 转发失败
        },

      }
    },
    //选择弹窗
    ptPop: function(e) {
      var that = this;
      var num = e.target.dataset.num
      var list = that.data.storeList;

      that.setData({
        SdataList: [],
        cscId: list[num].Id,
        cscname: list[num].Name,
        ptflag: true
      })
      app.storeId = that.data.cscId;

      //加载 数据
      that.GetBannerlist();
      that.GetCategory();
      that.GetPromotionDucks(true);
      that.GetPromotionT(true, that.data.cscId);
      that.IsShowGG();
      console.log("选择加载1111");
      that.GetTypelist();
      that.GetGetStoreList(1);

    },
    ptPopShow: function() {
      this.setData({
        ptflag: false
      })
    },
    ptPopHide: function() {
      this.setData({
        ptflag: true
      })
    },
    onShow: function() {
      var that = this;
      console.log("app.appUserType=" + app.appUserType);
      that.setData({
        appUserType: app.appUserType
      });
      
      if (app.appUserType == 2) {
        wx.setNavigationBarTitle({
          title: '吉牛到家 企业用户'
        })
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
        wx.setNavigationBarTitle({
          title: '吉牛到家'
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#47b34e',
          animation: {
            duration: 40,
            timingFunc: 'easeIn'
          }
        })
      }
      app.UserType();
      console.log("app.Market");
      console.log(app.Market);
      if (app.Market.Id > 0) {
        console.log("市场");
        app.Store = app.Market;

        app.storeId = app.Market.Id;
        that.setData({
          cscId: app.Market.Id,
          cscname: app.Market.Name,
          isLogin: false,
          distance: app.Market.distance,
        });
        console.log("app.Market.distance=" + app.Market.distance );
        if (that.data.dcostvery>0){
          console.log("dcostvery=" + (that.data.dcostvery / 1000));
          if (app.appUserType == 1) {
            if (app.Market.distance > (that.data.dcostvery / 1000)) {

              console.log("超出范围1");
              //提示
              that.setData({
                outpopSH: false,
                IsUpAble: "ptHomeShow",
              });
            }
          } else {
            if (app.Market.distance > (that.data.QYdcostvery / 1000)) {
              console.log("超出范围2");
              //提示
              that.setData({
                outpopSH: false,
                IsUpAble: "ptHomeShow",
              });
            }
          }
        }
       
        

        console.log("数据加载");
        //加载 数据
        that.GetBannerlist();
        that.GetCategory();
        that.GetPromotionT(true, that.data.cscId);
        that.GetPromotionDucks(true);
        that.GetGetStoreList(1);
        that.GetTypelist();
        that.IsShowGG();

      } else {
        console.log("自动加载");
        if (that.data.isLogin) {
          that.setData({
            isLogin: false
          });
          that.onLoad()

        } else {
          //这里是为了分享群可以获取群信息，比如shareTickets
          wx.showShareMenu({
            withShareTicket: true
          });
          that.IsShowCoupon();
          app.SUStypeId = 0;
          app.SUSpromotionId = 0;
          app.SUSname = "";
          if (app.IsCode) {
            app.IsCode = false;
            that.onLoad(null);
          }
        
          that.setData({
            scrollValue: 1,
            TopStyp: true,
            hidden: false,
            init: false,
          });


          //特推提示
          var nuber = app.nuber;
          console.log("nuber:" + nuber);
          console.log("进入页面=" + that.data.cscId)
          console.log("hed=" + that.data.hidden)
          if (that.data.cscId > 0) {
            console.log("进入" + that.data.cscId)
            that.GetGetStoreList(1);
          }
        }

      }



    },
    onLoad: function(options) {

      var that = this;
      
      
      if (app.appUserType == 2) {
        wx.setNavigationBarTitle({
          title: '吉牛到家 企业用户'
        })


        //设置背景颜色
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#0066FF',
          animation: {
            duration: 40,
            timingFunc: 'easeIn'
          }
        })

      }

      if (app.IsFirstLoad) {
        var isGet = false;
        wx.getStorage({
          key: 'JiNiuHomeData',
          success(res) {
            console.log("获取缓存")
            console.log(res.data)
            var list = res.data;
            console.log(111)
            isGet = true;
            that.setData({
              Movies: list.Movies,
              HD_style: list.HD_style,
              hodong_img: list.hodong_img,
              Category: list.Category,
            })

          }
        })
      }
      
     
      // 引入SDK核心类
      var QQMapWX = require('/../../utils/qqmap-wx-jssdk.js');
      var latitudet;
      var longitudet;
      // 实例化API核心类
      var demo = new QQMapWX({
        key: '2FABZ-QNAWX-QBV4I-7U2QC-D3RTQ-BTB7O' // 必填
      });
      if (options != null) {
        if (options.scene != undefined) {
          console.log("我是二维码");
          //二维码信息
          var scene = decodeURIComponent(options.scene)

          that.setData({
            scene: scene
          });

        }
      }

    
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            windowHeight: res.windowHeight,
            windowHeightTT: "height:" + (res.windowHeight - 50) + "px"
          });
        }
      });

     
      wx.login({
        success: function (loginCode) {
          console.log("code=" + loginCode.code);
          console.log("appid=" + app.appid);
          console.log("appsecret=" + app.secret);
          wx.request({
            url: app.name + 'api/User/reg',
            method: 'POST',
            data: {
              code: loginCode.code,
              appid: app.appid,
              appsecret: app.secret
            },
            success: function (res) {
              console.log("更新用户3");
              console.log(res);
              if (res.data.flag) {
                app.openid = res.data.openId;
                app.Activity = res.data.Activity;
                if (res.data.user != null) {
                  console.log("企业用户");
                 
                  if (res.data.user.UserEnterprise) {
                    console.log("//设置为企业用户");
                    that.setData({
                      appUserType: 2
                    });
                    //设置为企业用户
                    app.appUserType = 2;

                    app.UserType();
                    wx.setNavigationBarTitle({
                      title: '吉牛到家 企业用户'
                    })
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
                    that.GetFirstCoupon();
                  }
                }
               

                that.setData({
                  Activity: res.data.Activity,
                  dcostvery: res.data.dcostvery,
                  QYdcostvery : res.data.QYdcostvery,
                });
                that.IsShowCoupon();
              }

              //获取地址
              wx.getLocation({
                type: 'wgs84', //返回可以用于wx.openLocation的经纬度
                success: function (res) {
                  latitudet = res.latitude
                  longitudet = res.longitude
                  that.setData({
                    latitudet: res.latitude,
                    longitudet: res.longitude
                  });
                  var speed = res.speed; // 速度，以米/每秒计
                  var accuracy = res.accuracy; // 位置精度
                  // 调用接口
                  demo.reverseGeocoder({
                    location: {
                      latitude: latitudet,
                      longitude: longitudet
                    },
                    coord_type: 5,
                    success: function (res) {

                      var city = res.result.address_component.city; //城市名称
                      var city_code = res.result.ad_info.adcode; //城市CODE
                      var dis = res.result.address_component.district;
                      var text = city + dis; //所在地址
                      // city_code = '330212'; //测试用
                      that.setData({
                        addressCode: city_code
                      });
                      //判断是否有用户权限
                      wx.getSetting({
                        withCredentials: true,
                        success: function (res) {
                          if (res.authSetting['scope.userInfo']) {
                            console.log("有权限");
                            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                            wx.getUserInfo({
                              success: function (res) {

                                var userInfo = res.userInfo
                                that.setUser(userInfo.nickName, userInfo.avatarUrl);
                              }
                            });



                          } else {
                            console.log("没有权限");
                            that.setData({
                              modal_style: "display:block"
                            });
                          }
                        },
                        fail: function () {
                          console.log("权限报错");
                        }
                      })
                      //city_code ='330203';
                      //获取最近 市场
                      console.log(app.Market);
                      if (app.Market.Id > 0) {
                        console.log("有市场");
                        //加载 数据
                        that.GetBannerlist();
                        that.GetCategory();
                        that.GetPromotionT(true, that.data.cscId);
                        that.GetPromotionDucks(true);
                        that.GetGetStoreList(1);
                        that.IsShowGG();
                        that.GetTypelist();
                        that.setData({
                          logfig: false
                        });
                      } else {
                        console.log("没有市场");
                        that.GetCiyName(city_code);
                      }



                    }

                  })
                  that.setData({
                    locationPoppSH: true
                  });
                },
                fail: function (trs) {
                  console.log("111222211");

                  that.setData({
                    locationPoppSH: false
                  });
                }

              })



            },
            fail: function (fes) {
              console.log("获取openid报错");
              console.log(fes);
            }
          });
        }
      })
        

     

      


      

     
    },
    openSetting: function() {
      this.setData({
        isLogin: true
      });
      wx.openSetting({
        success: function(res) {
          console.log(res)
        },
        fail: function(res) {
          console.log('openSetting.failed')
        }
      })

    },
    getoptions: function(scene) {
      var that = this
      //处理二维码信息
      var url = 'api/User/DealEncond?code=' + scene;
      app.request(url, {}, 'POST', function(res) {
        if (res.data.flag) {
          var userId = res.data.msg.userId;
          //跳转产品详情页
          if (res.data.msg.position == 5) {
            wx.navigateTo({
              url: '../../pages/shop_list/shop_page/shop_pege?id=' + res.data.msg.productId,
            })
            return;
          }
          //积分兑换
          else if (res.data.msg.position == 2) {
            var url = 'api/user/IntegralOrder?orderNo=' + res.data.msg.OrderNo;
            app.request(url, {}, 'PUT', function(res1) {
              wx.navigateTo({
                url: '../../pages/my/enconde/enconde?id=' + res1.data.msg,
              })
              return;
            })
          } else if (res.data.msg.position == 1) {


          }


          //处理逻辑
          //1我的推广
          if (res.data.msg.position == 1) {
            // 引入SDK核心类
            var QQMapWX = require('/../../utils/qqmap-wx-jssdk.js');
            var latitudet;
            var longitudet;
            var usernames = '';
            // 实例化API核心类
            var demo = new QQMapWX({
              key: '2FABZ-QNAWX-QBV4I-7U2QC-D3RTQ-BTB7O' // 必填
            });

            //获取城市代码
            wx.getLocation({
              type: 'wgs84', //返回可以用于wx.openLocation的经纬度
              success: function(res) {
                latitudet = res.latitude
                longitudet = res.longitude
                // 调用接口
                demo.reverseGeocoder({
                  location: {
                    latitude: latitudet,
                    longitude: longitudet,
                  },
                  success: function(res) {
                    var city_code = res.result.ad_info.adcode; //城市CODE
                    app.AreaId = "510903" //city_code;
                    wx.getUserInfo({
                      success: function(res) {
                        var that = this;
                        var userInfo = res.userInfo
                        var usernames = userInfo.nickName
                        var avatarUrl = userInfo.avatarUrl
                        var gender = userInfo.gender //性别 0：未知、1：男、2：女 
                        var province = userInfo.province
                        var city = userInfo.city
                        var country = userInfo.country
                      }
                    });

                    //获取用户信息
                    wx.login({
                      success: function(loginCode) {
                        wx.request({
                          url: app.name + 'api/User/reg',
                          method: 'POST',
                          data: {
                            code: loginCode.code,
                            appid: app.appid,
                            appsecret: app.secret
                          },
                          success: function(res) {
                            if (res.data.flag) {
                              app.openid = res.data.openId;
                              // nickName: nickName,
                              //   avatarUrl: avatarUrl,
                              //用户注册及绑定
                              app.request('api/User', {
                                  name: that.data.nickName,
                                  avatarUrl: that.data.avatarUrl,
                                  lng: longitudet,
                                  lat: latitudet,
                                  code: app.AreaId,
                                  openid: app.openid,
                                  customerId: userId,
                                }, "POST",
                                function(res) {

                                  if (res.data.flag) {
                                    console.log("更新用户1");
                                    console.log(res.data);
                                    //跳转首页
                                    that.IsShowCoupon();

                                  } else {

                                  }
                                },
                                function() { //error
                                  wx.showToast({
                                    title: '用户注册失败',
                                    icon: 'loading',
                                    duration: 2000
                                  });
                                  return;
                                });

                            }
                          }
                        })
                      }
                    })

                  },
                  fail: function(res) {
                    console.log(res);
                  }
                })
              }
            })
          }
          if (res.data.msg.position == 7) {
            // 引入SDK核心类
            var QQMapWX = require('/../../utils/qqmap-wx-jssdk.js');
            var latitudet;
            var longitudet;
            var usernames = '';
            // 实例化API核心类
            var demo = new QQMapWX({
              key: '2FABZ-QNAWX-QBV4I-7U2QC-D3RTQ-BTB7O' // 必填
            });

            //获取城市代码
            wx.getLocation({
              type: 'wgs84', //返回可以用于wx.openLocation的经纬度
              success: function(res) {
                latitudet = res.latitude
                longitudet = res.longitude
                // 调用接口
                demo.reverseGeocoder({
                  location: {
                    latitude: latitudet,
                    longitude: longitudet,
                  },
                  success: function(res) {
                    var city_code = res.result.ad_info.adcode; //城市CODE
                    app.AreaId = "510903" //city_code;
                    wx.getUserInfo({
                      success: function(res) {
                        var that = this;
                        var userInfo = res.userInfo
                        var usernames = userInfo.nickName
                        var avatarUrl = userInfo.avatarUrl
                        var gender = userInfo.gender //性别 0：未知、1：男、2：女 
                        var province = userInfo.province
                        var city = userInfo.city
                        var country = userInfo.country
                      }
                    });

                    //获取用户信息
                    wx.login({
                      success: function(loginCode) {
                        wx.request({
                          url: app.name + 'api/User/reg',
                          method: 'POST',
                          data: {
                            code: loginCode.code,
                            appid: app.appid,
                            appsecret: app.secret
                          },
                          success: function(res) {
                            if (res.data.flag) {
                              app.openid = res.data.openId;
                              // nickName: nickName,
                              //   avatarUrl: avatarUrl,
                              //用户注册及绑定
                              app.request('api/User', {
                                  name: that.data.nickName,
                                  avatarUrl: that.data.avatarUrl,
                                  lng: longitudet,
                                  lat: latitudet,
                                  code: app.AreaId,
                                  openid: app.openid,
                                  customerId: 0,
                                }, "POST",
                                function(res) {
                                  console.log("更新用户2");
                                  console.log(res);
                                  that.setData({
                                    scene: ""
                                  })
                                  //绑定业务员
                                  if (!res.data.IsFirst) {                                  
                                    wx.showModal({
                                      title: '提示',
                                      content: '您已访问过小程序，无法被推广了！',
                                      success: function(res) { 
                                        return;
                                      }
                                    })
                                    return;
                                  }
                                  app.request('api/User/SaleBinding', {
                                      openid: app.openid,
                                      userId: userId,
                                    }, "POST",
                                    function(res) {
                                      if (res.data.flag) {
                                        //跳转首页
                                        wx.showToast({
                                          title: "推荐成功",
                                        })
                                        that.IsShowCoupon();

                                      } else {

                                        wx.showModal({
                                          title: '提示',
                                          content: res.data.msg,
                                          success: function(res) {

                                          }
                                        })

                                      }
                                    },
                                    function() {

                                    }
                                  )


                                },
                                function() { //error
                                  wx.showToast({
                                    title: '用户注册失败',
                                    icon: 'loading',
                                    duration: 2000
                                  });
                                  return;
                                });

                            }
                          }
                        })
                      }
                    })

                  },
                  fail: function(res) {
                    console.log(res);
                  }
                })
              }
            })
          }

        }
      }, function() {});

    },
    //获取OpenId
    GetOpenId: function() {
      var that = this
      console.log("获取OpenId");
      wx.login({
        success: function(loginCode) {
          console.log("code=" + loginCode.code);
          console.log("appid=" + app.appid);
          console.log("appsecret=" + app.secret);
          wx.request({
            url: app.name + 'api/User/reg',
            method: 'POST',
            data: {
              code: loginCode.code,
              appid: app.appid,
              appsecret: app.secret
            },
            success: function(res) {
              console.log("更新用户3");
              console.log(res);
              if (res.data.flag) {
                app.openid = res.data.openId;
                if (res.data.user != null) {
                  console.log("企业用户");
                  if (res.data.user.UserEnterprise) {
                    console.log("//设置为企业用户");
                    that.setData({
                      appUserType: 2
                    });
                    //设置为企业用户
                    app.appUserType = 2;

                    app.UserType();
                    wx.setNavigationBarTitle({
                      title: '吉牛到家 企业用户'
                    })
                    //设置背景颜色
                    wx.setNavigationBarColor({
                      frontColor: '#ffffff',
                      backgroundColor: '#0066FF',
                      animation: {
                        duration: 40,
                        timingFunc: 'easeIn'
                      }
                    })

                  }
                }
                that.IsShowCoupon();
              }
              

             


            },
            fail: function(fes) {
              console.log("获取openid报错");
              console.log(fes);
            }
          });
        }
      })
    },
    //获取市场集合
    GetCiyName: function(citycode) {
      var that = this;
      // 引入SDK核心类
      var QQMapWX = require('/../../utils/qqmap-wx-jssdk.js');
      // 实例化API核心类
      var demo = new QQMapWX({
        key: '2FABZ-QNAWX-QBV4I-7U2QC-D3RTQ-BTB7O' // 必填
      });
      console.log("typid=" + that.data.appUserType);
      console.log("citycode=" + citycode);
      app.request('api/Store/GetStoreList?AreaCode=' + citycode + '&typid=' + that.data.appUserType, {}, "GET",
        function(res) {
          console.log(res);
          console.log("获取市场集合");
          that.setData({
            IsBooths: res.data.IsBooths
          })
          app.IsBooths = res.data.IsBooths;
          if (res.data.flag) {
            var list = res.data.list;
            that.setData({
              storeList: list
            });
            console.log("市场集合");
            console.log(list);
            var loatlist = [];
            for (var i = 0; i < list.length; i++) {
              loatlist[i] = {
                latitude: parseFloat(list[i].Lat),
                longitude: parseFloat(list[i].Lng),
              };
            }

            // 调用接口
            demo.calculateDistance({
              to: loatlist,
              success: function(res) {
                console.log("**************");
                console.log(res);

                var elements = res.result.elements;

                var nuber = 0;
                var Tnuber = 0;
                for (var y = 0; y < elements.length; y++) {
                  if (Tnuber == 0) {
                    Tnuber = elements[y].distance;
                    nuber = y;

                  } else {
                    if (Tnuber > elements[y].distance) {
                      Tnuber = elements[y].distance;
                      nuber = y;
                    }
                  }
                  console.log("Tnuber=" + Tnuber);
                }
                if (app.appUserType == 1) {
                  console.log("elements[nuber].distance=" + elements[nuber].distance);
                  console.log("that.data.dcostvery" + that.data.dcostvery);
                  if (elements[nuber].distance > that.data.dcostvery) {
                    console.log("超出范围3");
                    
                    //提示
                    that.setData({
                      outpopSH: false,
                      IsUpAble: "ptHomeShow",
                    });
                  }

                }else{
                  if (elements[nuber].distance > that.data.QYdcostvery) {
                    console.log("超出范围4");
                    //提示
                    that.setData({
                      outpopSH: false,
                      IsUpAble: "ptHomeShow",
                    });
                  }
                }
                
                var cscname = list[nuber].Name;
                var cscId = list[nuber].Id;
                Tnuber = parseFloat(Tnuber) / 1000;
                console.log("市场距离Tnuber=" + Tnuber);
                list[nuber].distance = Tnuber
                app.Market = list[nuber];
                app.Store = list[nuber];

                that.setData({
                  cscId: cscId,
                  cscname: cscname,
                  distance: Tnuber.toFixed(2)
                });
                app.storeId = cscId;
                //加载 数据
                that.GetBannerlist();
                that.GetCategory();
                that.GetPromotionT(true, that.data.cscId);
                that.GetPromotionDucks(true);
                that.GetGetStoreList(1);
                that.IsShowGG();
                that.GetTypelist();
                that.setData({
                  logfig: false
                });


              },
              fail: function(res) {
                console.log(res);
              }
              
            });
          } else {
            that.setData({
              cscname: "无"
            });
          }
        },
        function() { //error
          console.log("获取市场错误");
        });

    },
    OnclickSubmit: function() { //搜索方法
      wx.showToast({
        title: '搜索',
        duration: 2000
      });
    },
    tapLogs: function(e) { //产品类型点击事件
      console.log(e);
      app.tapLogId = e.currentTarget.dataset.id;
      var pid = e.currentTarget.dataset.id;
      var pname = e.currentTarget.dataset.pname;

      wx.navigateTo({
        url: '/pages/logs/logs?pid=' + pid + '&pname=' + pname
      })



    },
    ClessiconTT: function() { //特推关闭事件
      app.nuber = "1";
      this.setData({
        modal_style: "display:none;"
      });
    },
    setUser: function(nickName, avatarUrl) { //注册用户

      var that = this;
      that.setData({
        nickName: nickName,
        avatarUrl: avatarUrl,
      })
      if (app.openid.length > 1) {
        var scene = that.data.scene;
        if (scene != null && scene.length > 1) {
          //处理二维码
          that.getoptions(scene);
        } else {
          app.request('api/User', {
              name: nickName,
              avatarUrl: avatarUrl,
              lng: that.data.longitudet,
              lat: that.data.latitudet,
              code: that.data.addressCode,
              openid: app.openid,
              customerId: 0
            },
            "POST",
            function(res) {

              if (res.data.flag) {


              } else {

                wx.showToast({
                  title: '用户获取失败',
                  icon: 'loading',
                  duration: 2000
                });
              }
            },
            function() { //error

              wx.showToast({
                title: '用户注册失败',
                icon: 'loading',
                duration: 2000
              });
            });
        }


      } else {
        console.log("openid为空");
      }




    },
    //关闭授权弹窗
    bindGetUserInfo: function(e) {
      var that = this;
      console.log("获取用户信息")
      var user = e.detail.userInfo
      if (user != undefined) {
        //如果获取用户后隐藏弹窗
        that.setData({
          modal_style: "display:none"
        });
        that.onLoad();
      }
    },
    GetCategory: function() { //获取产品类型
      var that = this

      app.request('api/Category?typeid=' + that.data.appUserType, {}, "GET",
        function(res) {
          console.log(res);
          console.log("获取产品类型");
          if (res.data.flag) {
            var lists = [];
            for (var i = 0; i < res.data.category.length; i++) {
              lists.push(
                res.data.category[i]
              )
            }
            that.setData({
              Category: lists
            })
          } else {
            that.setData({
              Category: []
            })
          }
          var num = that.data.loadNum;
          num++;
          console.log("num：" + num)
          that.setData({
            loadNum: num
          })
          if (num >= 3) {
            setTimeout(function() {
              that.setData({
                loadShow: false
              })
            }, 100)
            var obj = {
              Movies: that.data.Movies,
              HD_style: that.data.HD_style,
              hodong_img: that.data.hodong_img,
              Category: that.data.Category
            }
            wx.setStorage({
              key: 'JiNiuHomeData',
              data: obj
            })
            console.log("已加载数据")
          }


        },
        function() { //error
          wx.showToast({
            title: '产品类型无数据',
            icon: 'loading',
            duration: 2000
          });
          that.setData({
            intnuber: intnuber + 1
          });

          var intnuber = that.data.intnuber;
          if (intnuber > 2) {
            wx.showModal({
              title: '提示',
              content: '该区域暂未开通',
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            return;
          }

        });
    },
    //获取轮播图
    GetBannerlist: function() {
      console.log("获取轮播图");
      var that = this
      var storeId = that.data.cscId;
      console.log("storeId=" + storeId);
      app.request('api/Banner/GetStoreBanner?storeId=' + storeId + "&openid=" + app.openid, {}, "GET",
        function(res) {
          console.log("轮播图");
          console.log(res);
          if (res.data.flag) {
            if (res.data.list.length == 0) {
              that.setData({
                Movies: [],
                current:0
              })
            } else {
              that.setData({
                Movies: res.data.list,
                current: 0
              })
            }

            console.log(that.data.Movies);

          } else {
            that.setData({
              Movies: []
            })
          }
          var num = that.data.loadNum;
          num++;
          console.log("num：" + num)
          that.setData({
            loadNum: num
          })
          if (num >= 3) {
            setTimeout(function() {
              that.setData({
                loadShow: false
              })
            }, 100)
            var obj = {
              Movies: that.data.Movies,
              HD_style: that.data.HD_style,
              hodong_img: that.data.hodong_img,
              Category: that.data.Category
            }
            wx.setStorage({
              key: 'JiNiuHomeData',
              data: obj
            })
            console.log("已加载数据")
          }

        },
        function() { //error
          wx.showToast({
            title: '轮播图无数据',
            icon: 'loading',
            duration: 2000
          });
        }
      );
    },
    GetPromotionlist: function(tid, marketId) { //获取活动
      var that = this
      app.request('api/Promotion/GetIndexPromotion', {
          type: tid,
          marketId: marketId
        }, "GET",
        function(res) {
          if (res.data.flag == true) {
            var pid = res.data.model.Id;
            if (tid == 1) {
              that.setData({
                SC_name: res.data.model.Title,
                SC_img: res.data.model.Picture,
                SSHD_id: res.data.model.Id,
              })
              that.GetPromotionProduct(tid, pid);
            }
            if (tid == 2) {
              that.setData({
                haixian_img: res.data.model.Picture,
                JRHX_id: res.data.model.Id,
              })
              that.GetPromotionProduct(tid, pid);
            }
            if (tid == 3) {
              that.GetPromotionProduct(tid, pid);
              that.setData({
                TSCP_id: res.data.model.Id,
              })
            }
          }



        },
        function() { //error
          wx.showToast({
            title: '活动无数据',
            icon: 'loading',
            duration: 2000
          });
        }
      );
    },

    GetPromotionDucks:function(show){
      var that = this
      app.request('api/Product/SearchList', { page: 1, pageSize: 10, typeId: 0, promotionId: 53, openid: app.openid, name: '', storeId: 1153}, "Post",
      function(res){
        console.log("具体活动产品！！！！");
        console.log(res);
        if (res.data.flag == true) {
          that.setData({
            HD_style: "height:auto",
            hodong_products: res.data.list
          })
        }
      }
      );
      console.log("--------zdh index.js 1473-------")
      console.log(that.data.hodong_products);
   
    },

    GetPromotionT: function(show, marketId) { //常规活动
      var that = this
      app.request('api/Promotion/GetNormal', {
          show: show,
          marketId: marketId
        }, "GET",
        function(res) { //hodong_img
        console.log("活动！！！！！");
          console.log(res);
          if (res.data.flag == true) {
            that.setData({
              HD_style: "height:auto",
              hodong_img: res.data.list
            })
          } else {
            that.setData({
              HD_style: "height:160px",
              hodong_img: []
            })

          }
          var num = that.data.loadNum;
          num++;
          console.log("num：" + num)
          that.setData({
            loadNum: num
          })
          if (num >= 3) {
            setTimeout(function() {
              that.setData({
                loadShow: false
              })
            }, 100)
            var obj = {
              Movies: that.data.Movies,
              HD_style: that.data.HD_style,
              hodong_img: that.data.hodong_img,
              Category: that.data.Category
            }
            wx.setStorage({
              key: 'JiNiuHomeData',
              data: obj
            })
            console.log("已加载数据")
          }


        },
        function() { //error
          wx.showToast({
            title: '常规活动无数据',
            icon: 'loading',
            duration: 2000
          });
        }
      );

      that.setData({
        hidden: false
      });
    },
    GetPromotionProduct: function(tid, pid) { //获取活动商品
      var that = this
      app.request('api/Promotion/Product/' + pid, {}, "GET",
        function(res) {
          if (res.data.flag) {
            var list = []
            if (res.data.list.length == 0) {
              console.log("没有数据");
              return;
            }
            if (res.data.list != null) {
              for (var i = 0; i < res.data.list.length; i++) {
                list[i] = ({
                  Id: res.data.list[i].Id,
                  Title: res.data.list[i].Title,
                  Deputy: res.data.list[i].Deputy,
                  Picture: res.data.list[i].Picture,
                  Price: res.data.list[i].Price.toFixed(2),
                  UnitId: res.data.list[i].UnitId,
                  Unit: res.data.list[i].Unit,
                  IsCollect: res.data.list[i].IsCollect,
                })
              }
              if (tid == 1) {
                that.setData({
                  SLProduct: list
                })
              }
              if (tid == 2) {
                that.setData({
                  HXProduct: list
                })
              }
              if (tid == 3) {
                that.setData({
                  More: list
                })
              }
            }

          }
        },
        function() {
          wx.showToast({
            title: '活动商品无数据',
            icon: 'loading',
            duration: 2000
          });
        }
      );
    },
    GetHotSale: function(indett) { //一周热卖
      var that = this
      var show = true;
      console.log("进入热卖")


    },
    //热卖数据
    GetYZRM: function() {
      console.log("进入")
      let that = this;
      var page = that.data.page;
      var pageSize = 10;
      var typeId = 0;
      var namet = "";

      //常规
      app.request('api/Product/Search?page=' + page + '&pageSize=' + pageSize + '&typeId=' + typeId + '&promotionId=0&openid=' + app.openid + '&storeId=' + app.storeId + '&name=' + namet, {}, "GET",
        function(res) {
          console.log("page=" + that.data.page);
          console.log(res.data);
          if (res.data.flag) {
            var list = that.data.Remai;
            var index = list.length;
            var datd = res.data.list;
            if (that.data.page > 1) {
              for (var i = 0; i < datd.length; i++) {
                list[index + i] = datd[i];
                list[index + i].Price = datd[i].Price.toFixed(2);

              }
            } else {
              if (that.data.indett == 0) {
                list = res.data.list;
                for (var i = 0; i < datd.length; i++) {
                  list[index + i].Price = datd[i].Price.toFixed(2);
                }
              } else {
                for (var i = 0; i < datd.length; i++) {
                  list[index + i] = datd[i];
                  list[index + i].Price = datd[i].Price.toFixed(2);
                }
              }
            }
            console.log("list");
            console.log(list);
            that.setData({
              remaitype: true,
              Remai: list,
              searchLoading: false,
            });
            // setTimeout(function () {
            //   wx.hideLoading()
            // }, 2000)
          } else {
            that.setData({
              remaitype: false,
            });


          }
        },
        function() { //error
          that.setData({
            Msage: "没有数据",
            systle: "display:block",
            searchLoading: false,
          })
        }
      );
    },
    joinCart: function(e) { //加入购物车
      var pid = e.currentTarget.dataset.id;
      var unitid = e.currentTarget.dataset.uit;
      app.joinCart(pid, unitid, function() { //error
        wx.showToast({
          title: '数据错误',
          icon: 'loading',
          duration: 2000
        });
      });
    },
    OnSearch: function() { //搜索
      var texte = this.data.TextName;
      app.SUSname = texte;
      app.SUStypeId = 0;
      app.SUSpromotionId = 0;
      wx.navigateTo({
        url: '../../pages/shop_list/shop_list'
      })

    },
    GetText: function(e) { //获取搜索内容
      var texte = e.detail.value;
      this.setData({
        TextName: texte
      });
    },
    OnclickGo: function(e) { //点击一周热卖
      app.SUSpromotionId = 0;
      wx.navigateTo({
        url: '../../pages/shop_list/shop_list'
      })
    },
    OnclickHD: function(e) {
      app.SUSpromotionId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../../pages/shop_list/shop_list'
      })
    },
    OnclickType: function(e) {
      app.SUSpromotionId = e.currentTarget.dataset.typid;
      console.log("Type=" + app.SUSpromotionId);
      wx.navigateTo({
        url: '../../pages/shop_list/shop_list'
      })
    },
    //上拉加载
    onReachBottom(e) {
      let that = this;
      console.log("上拉加载");
      console.log("33333");
      that.lower();

    },
    //热卖更多
    lower: function() {
      let that = this;
      console.log("remaitype=" + that.data.remaitype);
      if (that.data.remaitype) {
        that.setData({
          searchLoading: true,
          searchLoadingComplete: false,
          remaitype: false,
          TopStyp: false,
          page: that.data.page + 1
        });
        that.GetGetStoreList(that.data.page);
      } else {
        console.log("没有了");

        that.setData({
          searchLoading: false,
          searchLoadingComplete: true,
        });
      }
    },
    //回到顶部
    GoTop: function() {
      let that = this;
      wx.pageScrollTo({
        scrollTop: 0
      })
      that.setData({
        TopStyp: true,
      });
    },
    //滚动事件
    onPageScroll: function(e) {
      let that = this;
      var scroll = e.scrollTop;
      if (scroll < 300) {
        that.setData({
          TopStyp: true,
        });
      } else {
        that.setData({
          TopStyp: false,
        });
      }
    },
    //跳转
    shang: function() {
      wx.navigateTo({
        url: '/pages/index/shang/shang',
      })
    },
    GetGetStoreList(page) {
      console.log("获取店铺");
      var that = this
      var storeId = that.data.cscId;

      app.request('api/Store/GetStoreListById?pageIndex=' + page + '&pageSize=10&storeId=' + storeId + '&typeId=' + that.data.TypeId + '&name=' + that.data.txtName + '&IsOrderBy=' + that.data.IsOrderBy, {}, "GET",
        function(res) {
          console.log("店铺");

          if (res.data.flag) {
            console.log(res.data.list);
            var list = res.data.list;
            if (list.length > 0) {
              if (page > 1) {
                var slist = that.data.SdataList;
                var inde = slist.length;
                for (var i = 0; i < list.length; i++) {
                  slist[inde + i] = list[i];
                }
                that.setData({
                  page: page,
                  remaitype: true,
                  SdataList: slist
                });
              } else {
                that.setData({
                  page: page,
                  remaitype: true,
                  IStaype: false,
                  SdataList: list
                });
              }
            } else {
              if (page > 1) {
                that.setData({
                  remaitype: false,
                  IStaype: false,
                });
              } else {
                that.setData({
                  remaitype: false,
                  IStaype: true,
                  SdataList: []
                });
              }
            }
          } else {
            if (page > 1) {
              that.setData({
                remaitype: false,
                IStaype: false,
              });
            } else {
              that.setData({
                remaitype: false,
                IStaype: true,
                SdataList: []
              });
            }
          }
        },
        function() { //error
          console.log("无店铺数据");
        }
      );
    },
    //分类标签
    GetTypelist: function() {
      console.log("进入分类");
      var that = this
      app.request('api/Category/GetCategoryList?pid=0&page=1&typeid=' + that.data.appUserType, {}, "GET",
        function(res) {
          console.log(res);
          console.log("分类标签");

          if (res.data.flag) {
            var list = res.data.list;
            var itemtype = {
              Id: 0,
              Name: "全部分类"
            };
            var array = [];
            list.unshift(itemtype);

            for (var i = 0; i < list.length; i++) {
              array.push(list[i].Name);
            };
            that.setData({
              Typelist: list,
              array: array
            });
          } else {
            console.log("分类标签2222");
            var itemtype = {
              Id: 0,
              Name: "全部分类"
            };
            var array = [];
            array.push("全部分类");

            that.setData({
              Typelist: itemtype,
              array: array
            });
            console.log(array);
            console.log(that.data.Typelist);
            console.log("%%%%%%%%%%%%%");
          }

        },
        function() {

        })
    },
    business: function(e) {

      var sid = e.currentTarget.dataset.bid;
      wx.navigateTo({
        // url: '/pages/business/business?id=' + sid,
        url: '/pages/index/merchartYellowPage/myp?sid=' + sid
      })
    },
    GetTypelistData: function(e) {
      let that = this;
      var yid = e.currentTarget.dataset.yid;
      console.log(yid);
      var list = that.data.Typelist;
      that.setData({
        TypeId: yid,
        Typelist: list
      });
      that.GetGetStoreList(1);
    },
    setText: function(e) {
      var txt = e.detail.value;
      console.log(txt);
      this.setData({
        txtName: txt
      });
    },
    OnlickeBtu: function(e) {
      console.log("点击完成");
      this.GetGetStoreList(1);
    },
    //获取新手优惠券
    GetFirstCoupon: function() {
      console.log("获取新手优惠券");
      var that = this;
      app.request('api/Coupon/GetProfitCoupon', {
          types: 1
        }, "GET",
        function(res) {
          console.log("获取新手优惠券");

          if (res.data.flag) {
            var list = res.data.list;
            var newList = [];
            for (var i = 0; i < list.length; i++) {
              newList.push({
                Id: list[i].Id,
                Price: parseFloat(list[i].Price).toFixed(2),
                Title: list[i].Title,
                BeginTime: list[i].BeginTime,
                IsPublish: list[i].IsPublish,
                Num: list[i].Num,
                ProductId: list[i].ProductId,
                CouponSendType: list[i].CouponSendType,
                CouponType: list[i].CouponType,
                Endline: list[i].Endline,
                Explanation: list[i].Explanation,
                FullNum: list[i].FullNum,
                FullPrice: parseFloat(list[i].FullPrice).toFixed(2),
                ProductType: list[i].ProductType,
                IsUsed: list[i].IsUsed
              })
            }


            that.setData({
              newCouponList: newList
            })
          }

        },
        function() {

        })

    },
    //领取新手优惠券
    GetUserCoupon: function(e) {
      console.log("领取新手优惠券");
      var that = this
      let Id = e.currentTarget.dataset.couponid;

      var url = 'api/Coupon'
      app.request(url, {
        id: Id,
        openid: app.openid
      }, 'POST', function(res) {

        if (res.data.flag) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
          var list = that.data.newCouponList
          for (var i = 0; i < list.length; i++) {
            if (list[i].Id == Id) {
              if (list[i].FullNum == 1) {
                list[i].IsUsed = true;
                list[i].FullNum--;
              } else {
                list[i].FullNum--;
              }

            }

          }
          that.setData({
            newCouponList: list
          })
        } else {
          wx.showToast({
            title: '已达到领取上限！',
            icon: 'success',
            duration: 2000
          })
          var list = that.data.newCouponList
          for (var i = 0; i < list.length; i++) {
            if (list[i].Id == Id) {
              list[i].IsUsed = true;
            }
          }
          that.setData({
            newCouponList: list
          })


        }

      }, function() {})

    },
    //关闭优惠券窗口
    CloseCoupon: function() {

      this.setData({
        isFirstLogin: true
      })

    },
    fen: function() {
      wx.navigateTo({
        url: '/pages/index/fen/fen',
      })
    },
    //是否弹窗显示优惠券
    IsShowCoupon: function() {
      var that = this;
      if (app.openid.length == 0) {
        return;
      }
      app.request('api/Coupon/IsCouponShow', {
          openId: app.openid
        }, "GET",
        function(res) {
          console.log("是否弹窗显示优惠券");
          console.log(res);
          if (res.data.flag) {
            that.setData({
              isFirstLogin: false
            })

          }

        },
        function() {

        })

    },

    Gocity: function(e) {

      wx.navigateTo({
        url: '/pages/index/city/city',
      })
    },

    IsShowGG: function () {
      var that = this;

      console.log("--------111111111---------" + !true);
      wx.request({
        url: 'https://www.yongbox.com:88/api/User/MarketsNews',
        data: {

        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res);
          that.setData({
            outpopGGa: res.data.flag,
            GGMsg: res.data.msg,
          })
        }

      }
      );
    },

    IsShowGGClose: function (e){
     
      var that = this;
      that.setData({
        outpopGGa: false,
      })
    },
  })
const app = getApp()
Page({
  data: {
    appUserType:1,
    cityTrue:false,
    cityName: "宁波",
    cityCode: "",
    longitude:"",
    latitude:"",
    name:"",//输入名称
    markers: [],
    li: [],
    showView: false
  },
  onLoad: function(options) {
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
    console.log(options);
    if (options.city){
      that.setData({
        cityName: options.city,
        cityCode: options.code,
      }); 
      console.log("执行查询城市");
      that.GetDataList(options.city, options.code);


    }else{
      // 生命周期函数--监听页面加载
      showView: (options.showView == "true" ? true : false)
      var Market = app.Market;
      console.log("加载市场");
      console.log(Market);
      that.setData({
        longitude: Market.Lng,
        latitude: Market.Lat,
      });
      that.GetCiyName();
    }
   
  },
  onChangeShowState: function() {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  markertap(e) {
    console.log(e.markerId)
    var that = this;
    var Market = that.data.li[e.markerId];
    console.log(Market)
    app.Market = Market
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //选择
  setCaty:function(e){
    var that = this;
    console.log(e.currentTarget.dataset.idx);
    var idx = e.currentTarget.dataset.idx;
    var Market = that.data.li[idx];
    console.log(Market)
    console.log("*******************************************")
    app.Market = Market
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  setNameText:function(e){
    console.log(e.detail.value);
    this.setData({
      name: e.detail.value
    });
  },
  setcity:function(e){
    this.GetCiyName();

  },
  bindcallouttap(e){
    console.log(e.markerId)
    var that = this;
    var Market = that.data.li[e.markerId];
    console.log(Market)
    app.Market = Market
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //获取市场集合
  GetCiyName: function () {
    var that = this;
    // 引入SDK核心类
    var QQMapWX = require('/../../../utils/qqmap-wx-jssdk.js');
    // 实例化API核心类
    var demo = new QQMapWX({
      key: '2FABZ-QNAWX-QBV4I-7U2QC-D3RTQ-BTB7O' // 必填
    });
   
    var lat = parseFloat(that.data.latitude);
    var lon = parseFloat(that.data.longitude);
    // 调用接口
    demo.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lon
      },
      coord_type: 5,
      success: function (res) {
        console.log(res)
        console.log("&&&&&&&&&&")
        var city = res.result.address_component.city; //城市名称
        var city_code = res.result.ad_info.adcode; //城市CODE
        city_code = city_code.slice(0,-2);
        console.log("city_code=" + city_code)
        city_code = city_code+"00";
        that.setData({
          cityName: city,
          cityCode: city_code,
        });

        app.request('api/Store/GetAllStoreList?AreaCode=' + city_code + '&name=' + that.data.name + '&typeid=' + app.appUserType, {}, "GET",
          function (res) {
            console.log("获取市场列表");
            console.log(res);

            if (res.data.flag) {
              var list = res.data.list;
              that.setData({
                storeList: list
              });
              var loatlist = [];
              for (var i = 0; i < list.length; i++) {
                loatlist[i] = {
                  latitude: parseFloat(list[i].Lat),
                  longitude: parseFloat(list[i].Lng),
                };
              }
              console.log("||||||||||");
              console.log(loatlist);
              // 调用接口
              demo.calculateDistance({
                to: loatlist,
                success: function (res) {
                  console.log(res);
                  var elements = res.result.elements;
                  console.log(elements);
                  var markers= [];
                  for (var y = 0; y < elements.length; y++) {
                    
                    list[y].distance = (parseFloat(elements[y].distance) / 1000).toFixed(2);
                    markers[y] = {
                      iconPath: '/images/ptDing.png',
                      id: y,
                      latitude: list[y].Lat,
                      longitude: list[y].Lng,
                      width: 25,
                      height: 25,
                      callout: {
                        content: "    " + list[y].Name+"   ",
                        color: "#eeeee",
                        fontSize: "16",
                        borderRadius: "50",
                        bgColor: "#ffffff",
                        padding: "20",
                        display: "ALWAYS"
                       }

                    }
                  }

                  that.setData({
                    markers: markers,
                    li: list
                  });

                  console.log(list);



                },
                fail: function (res) {
                  console.log(res);
                }
              });
            } else {
              that.setData({
                cscname: "无",
                markers: [],
                li: []
              });
            }
          },
          function () { //error
            console.log("获取市场错误");
          });



      }

    })


   
  },
  //加载数据
  GetDataList: function (city, city_code){
    var that = this;
    // 引入SDK核心类
    var QQMapWX = require('/../../../utils/qqmap-wx-jssdk.js');
    // 实例化API核心类
    var demo = new QQMapWX({
      key: '2FABZ-QNAWX-QBV4I-7U2QC-D3RTQ-BTB7O' // 必填
    });
    demo.geocoder({
      //获取表单传入地址
      address: city, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log("功后的回调");
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //地图定位
        that.setData({
          longitude: longitude,
          latitude: latitude,
        });

        app.request('api/Store/GetAllStoreList?AreaCode=' + city_code + '&name=' + that.data.name + '&typeid=' + app.appUserType, {}, "GET",
          function (res) {
            console.log("获取市场列表");
            console.log(res);
            if (res.data.flag) {
              var list = res.data.list;
              that.setData({
                storeList: list
              });
              var loatlist = [];
              for (var i = 0; i < list.length; i++) {
                loatlist[i] = {
                  latitude: parseFloat(list[i].Lat),
                  longitude: parseFloat(list[i].Lng),
                };
              }
              console.log("||||||||||");
              console.log(loatlist);
              // 调用接口
              demo.calculateDistance({
                to: loatlist,
                success: function (res) {
                  console.log(res);
                  var elements = res.result.elements;
                  console.log(elements);
                  var markers = [];
                  for (var y = 0; y < elements.length; y++) {

                    list[y].distance = (parseFloat(elements[y].distance) / 1000).toFixed(2);
                    markers[y] = {
                      iconPath: '/images/ptDing.png',
                      id: y,
                      latitude: list[y].Lat,
                      longitude: list[y].Lng,
                      width: 25,
                      height: 25,
                      callout: {
                        content: "    " + list[y].Name + "   ",
                        color: "#eeeee",
                        fontSize: "16",
                        borderRadius: "50",
                        bgColor: "#ffffff",
                        padding: "20",
                        display: "ALWAYS"
                      }

                    }
                  }

                  that.setData({
                    markers: markers,
                    li: list,
                    cityTrue: false
                  });

                  console.log(list);



                },
                fail: function (res) {
                  console.log(res);
                }
              });
            } else {
              that.setData({
                cscname: "无",
                markers: [],
                li: [],
                cityTrue:true
              });
            }
          },
          function () { //error
            console.log("获取市场错误");
          });


        
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })


  },
  //转到地图点
  getaddd:function(e){
    console.log(e);
    var that = this;
    that.setData({
      longitude: e.currentTarget.dataset.lng,
      latitude: e.currentTarget.dataset.lat,
    });
  },
  switchcity:function(){
    var cityName = this.data.cityName;
    var cityCode = this.data.cityCode;

    wx.navigateTo({
      url: '/pages/index/switchcity/switchcity?cityName=' + cityName + '&cityCode=' + cityCode,
    })
  }

})
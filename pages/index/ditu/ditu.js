const app = getApp()
Page({
  data: {
    latitude: '',
    longitude: '',
    winWidth: "",
    winHeight: "",
    markers: [],
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  shang:function(){
    wx.navigateTo({
      url: '/pages/index/shang/shang',
    })
  },
  onShow:function(){
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    // 引入SDK核心类
    var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
    var latitudet;
    var longitudet;
    var usernames = '';
    // 实例化API核心类
    var demo = new QQMapWX({
      key: '2FABZ-QNAWX-QBV4I-7U2QC-D3RTQ-BTB7O' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res);
        latitudet = res.latitude
        longitudet = res.longitude
        that.setData({
          latitude: latitudet,
          longitude: longitudet,
        });
        that.GetData(1, latitudet, longitudet);
      }
    })
  },
  markertap: function (e) {
    console.log(e);
    var that = this
    var markerId = e.markerId;
    if (markerId > 0) {
    
    }

  },
  callouttap:function(e){
    console.log(e);
    var that = this
    var markerId = e.markerId;
    if (markerId > 0) {
      wx.navigateTo({
        url: '/pages/business/business?id=' + markerId,
      })
    }
  },
  //获取数据
  GetData: function (page, lat, lng) {
    var that = this;
    app.request('api/Store', {
      lat: lat,
      lng: lng,
      pageIndex: page,
      pageSize: 20
    }, "GET",
      function (res) {
        if (res.data.flag) {
          var list = res.data.list
          console.log("数据");
          console.log(list);
          if (list.length > 0) {
            that.DataSet(page, list);
          }

        }
        else {

        }
      }, function () {//error
        wx.showToast({ title: '暂无商家信息', icon: 'loading', duration: 2000 });
      }
    );
  },
  //赋值
  DataSet: function (page,list) {
    var that = this; 

    var markers = that.data.markers;
    if (page==1){
      markers=[];
    }
    console.log(list.length);
    console.log(markers);
    var mindex = markers.length;
    for (var i = 0; i < list.length; i++) {
      markers[i + mindex] = {
        iconPath: "/images/my_l.png",
        id: list[i].Id,
        latitude: parseFloat(list[i].Lat) ,
        longitude: parseFloat(list[i].Lng),
        width: 30,
        height: 35,
        callout:{
          content: list[i].Name,
          color:'#FF9900',
          fontSize:16,
          borderRadius:12,
          padding:2,
          textAlign:'center',
        }
      };
    }
    console.log("$$$$$$$$$$");
    console.log(markers);
    that.setData({
      markers: markers
    });


  },

})
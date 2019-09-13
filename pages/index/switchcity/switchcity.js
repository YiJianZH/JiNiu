var city = require('../../../utils/city.js');
var app = getApp()
Page({
  data: {
    appUserType:1,
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    // tHeight: 0,
    // bHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "上海市",
    cityId:"",
    textName:"",//搜素的名称
  },
  onLoad: function (options) {
    console.log(options);
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
      this.setData({
        appUserType: app.appUserType
      });
    }
    // 生命周期函数--监听页面加载
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList,
      city: options.cityName,
      cityId: options.cityCode,
    })

  },

  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  clickLetter: function (e) {
    console.log(e.currentTarget.dataset.letter)
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      //isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  //搜素城市
  setNameText:function(e){
    console.log(e);
    this.setData({
      textName: e.detail.value
    });
  },
  //搜索城市
  getCity:function(){
    var that = this;
    var isBot=false;//默认未未找到
    var showLetter="";//滚动ID
    var name = that.data.textName;
    var list = that.data.cityList;
    
    console.log(list);
    //查找城市
    for (var i = 0; i < list.length;i++){
      var tlist = list[i].cityInfo;
      for (var t = 0; t < tlist.length; t++){
       
        var stringText = tlist[t].city;
        if (stringText.indexOf(name) != -1) {
          isBot = true;
          showLetter = 'T'+tlist[t].code;
          console.log("ID:" + showLetter);
          console.log("查到城市：" + tlist[t].city);  
        }
      }
      

    }
    if (isBot){

      that.setData({
        showLetter: city,
        //isShowLetter: true,
        scrollTopId: showLetter,
       
      })
      
      setTimeout(function () {
        that.setData({
          isShowLetter: false
        })
      }, 1000)
    }else{
      wx.showToast({title: '未找到相关城市', icon: 'none',duration: 2000})
    }
  },
  //选择城市
  bindCity: function (e) {
    console.log("bindCity")
    console.log(e)
    this.setData({ city: e.currentTarget.dataset.city })

    var city = e.currentTarget.dataset.city;
    var code = e.currentTarget.dataset.citycode;
    //跳转
    wx.navigateTo({
      url: '/pages/index/city/city?city=' + city + '&code=' + code,
    })
  },
  //选择热门城市
  bindHotCity: function (e) {
    console.log("bindHotCity")
    this.setData({
      cityId: e.currentTarget.dataset.citycode,
      city: e.currentTarget.dataset.city
    })
  },
  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  }
})
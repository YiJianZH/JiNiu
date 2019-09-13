//获取应用实例
const app = getApp()
Page({
  data: {
    appUserType:1,
    cglist:[],
    image:"",
    page:1,
    loading:true,//加载
    loadingComplete:true,//没有了
  },
  onLoad: function (options) {
    var that = this
    that.setData({
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
   
  },
  onShow: function () {
    var that = this;
    that.setData({
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
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#47b34e',
        animation: {
          duration: 40,
          timingFunc: 'easeIn'
        }
      })
    }

    that.getImage();
    that.getDatalist(1);
  },
  getImage: function (){
    var that = this;
    console.log("storeId=" + app.storeId);
    app.request('api/Banner/Type?storeId=' + app.storeId + "&openid=" + app.openid, {}, "GET",
      function (res) {
        console.log("广告");
        console.log(res);
        if (res.data.flag){
          var image = res.data.list;
          that.setData({
            image: image[0].Picture
          });

        }
        
      }, function () {

      })
  },
  getDatalist:function(page){
    var that = this
    that.setData({
      loadingComplete: true,
      loading: false
    });
    app.request('api/Category/GetCategoryList?pid=0&page=' + page + '&typeid=' + app.appUserType, {}, "GET",
      function (res) {
        console.log("列表");
        console.log(res);
        var list = res.data.list;
        if (list.length>0){
          
          if (page == 1){
            that.setData({
              cglist: list,
            });
          }else{
            var Tlist = that.data.cglist;
            var index = Tlist.length;
            for (var i = 0; i < list.length;i++){
              Tlist[index + i] = list[i];
            }
            that.setData({
              cglist: Tlist,
            });
          }
          that.setData({
            loading: true,
            loadingComplete: true,
          });
          
        }else{
          //没有数据
          if (page==1){
            that.setData({
              cglist: [],
            });
          }
          that.setData({
            loading: true,
            loadingComplete: false,
          });
        }
      },function(){
      })

  },
  //分页
  onReachBottom: function () {

  },
  onClicke:function(e){
    
    var pid = e.currentTarget.dataset.pid;
    var pname = e.currentTarget.dataset.pname;
    console.log("pid=" + pid);
    console.log("pname=" + pname);
    wx.navigateTo({
      url: '/pages/logs/logs?pid=' + pid + '&pname=' + pname
    })



  }
})
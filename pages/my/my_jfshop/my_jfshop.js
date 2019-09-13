const app = getApp()
Page({ 
  data: {
    pic: 'http://211.149.244.171:8083/',
    banner: [{ Picture:"",Url:"",IsJump:false,Id:""}],
    li:[
      { Id: "0", Picture: "", Name: "", Integral: "" }
    ],
    isrtenbat:true,
    isNull:true,
    currIndex:"1",
    MyIntegral:"0",
    searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: true,  //“没有数据”的变量，默认false，隐藏  
    Integral: "1000",
  },

  //事件处理函数  
  changToTest: function () {
    wx.navigateTo({
      url: '../../pages/my_bj/my_bj'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    that.setData({
      li:null,
      banner:null,
      isNull:true
    })
    that.bangdata(1);
    //获取积分
    var jfurl = 'api/User/' + app.openid + '?marketId=' + app.Market.Id;
    app.request(jfurl, {}, 'GET', function (res) {
      if (res.data.flag) {
        that.setData({
          Integral: res.data.model.Integral,
        })
      }
     
    }, function () { })  
      //获取轮播图
    var bannerUrl ='api/Banner'
    app.request(bannerUrl,{},'Get',function(res){
      if(res.data.flag)
      {
        that.setData({
          banner:res.data.list,
        })
        
      }

    },function(){})
  },

  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    var that = this
    //重新请求初始数据
    that.onLoad();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  // 上拉加载回调接口
  onReachBottom: function () {
    var that = this
    if (that.data.isrtenbat){
      //请求数据
      var totle = this.data.currIndex;
      totle++;
      if (that.data.li == null) {
        totle = 1
      }
      that.setData({
        currIndex: totle,
        isrtenbat:false
      })
      //显示页面提示
      that.setData({
        searchLoading: false,
      });
      that.bangdata(totle);
    }
   
  },
  //积分兑换
  exchange: function (event){
    var that = this   
    let Id = event.currentTarget.dataset.id;
    var url ='api/Integral/InsertINter?productid='+Id+'&openid='+app.openid
    app.request(url, {},'POST',function(res){
      if(res.data.flag)
      {
        wx.showToast({
          title: '兑换成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function(){
          wx.navigateTo({
            url: '/pages/my/my_dh/my_dh'
          })
        }, 2000)
        
      }
      else
      {
        wx.showToast({
          title: '积分不足',
          icon: 'loading0',
          duration: 2000
        })
      }
    },function(){})
   
  },
  //绑定数据
  bangdata:function(page){
    var that = this  
    that.setData({
      isNull: true
    }); 
    var url = 'api/Integral/Product';
    app.request(url, {
      page: page,
      pageSize: 10
    }, 'GET', function (res) {
      var list = [];
      if (res.data.flag) {
        if (page==1){
          list = res.data.list;
       }else{
          var GstList = that.data.ContenList;
          for (var t = 0; t < GstList.length; t++) {
            list.push(GstList[t])
          }   
       }
        that.setData({
          li: list,
        })
      }else{
        if(page==1){
          that.setData({
            isNull:false,
          });
        }else{
          //提示
          //显示页面提示
          that.setData({
            searchLoadingComplete: false,
            searchLoading: true,
          });
        }
      }
      //关闭提示
      setTimeout(function () {
        that.setData({
          searchLoadingComplete: true
        });
      }, 3000);
      that.setData({
        isrtenbat: true
      })
    }, function () {
    })
  }
})  
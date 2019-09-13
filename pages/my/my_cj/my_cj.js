const app = getApp()
Page({
  data: {
    Recommend: "",
    ha: "我的下级",
    first: "0",
    second: "0",
    third: "0",
    IsNAN: true,
  },

  jumpto: function () {

  },
  //事件处理函数  
  changToTest: function () {
    wx.navigateTo({
      url: 'test?id=1'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this

    //获取层级
    var url = 'api/User/Level?openid=' + app.openid
    app.request(url, {}, 'GET', function (res) {
      //是否有下级用户
      if (res.data.flag) {
        var first = '';
        var second = '';
        var third = '';
        var Recommend = res.data.level.RecommendName == null ? "无" : res.data.level.RecommendName;
        var list = res.data.level.NextLevel;
        //层级数量
        if (list!=null)
        {

        for (var i = 0; i < list.length; i++) {
          //一级
          if (list[i].Level == 1) {
            first = list[i].Num;
          }
          //二级
          else if (list[i].Level == 2) {
            second =  list[i].Num;
          }
          //三级
          else if (list[i].Level == 3) {
            third = list[i].Num;
          }
        }
        that.setData({
          first: first == "" ? 0 : first,
          second: second == "" ? 0 : second,
          third: third == "" ? 0:third,
          IsNAN:false,
          Recommend: Recommend == null ? "无" : Recommend
        })
      }
      }
      else {

      }

    }, function () { })
  }
})  

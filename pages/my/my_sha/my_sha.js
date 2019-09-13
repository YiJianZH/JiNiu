Page({
  data: {
  




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
  }
})  
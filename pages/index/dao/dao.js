Page({
  data: {
    lat: "29.82816935207553",
    lng: "121.52521324704604",
    markers: [{
      iconPath: '/images/song.png',
      id: 2,
      latitude: "29.82816935207553",
      longitude: "121.52521324704604",
      width: 50,
      height: 50
    }],
   
  },
  onLoad: function (options) {
    console.log(options);
    var UserLat = options.UserLat;
    var UserLng = options.UserLng;
    var RiderLat = "29.82816935207553";//options.RiderLat;
    var RiderLng = "121.52521324704604";//options.RiderLng;
    if (UserLat.length==0){
      wx.showToast({
        title: '用户坐标错误！',
        duration: 2000
      })
      return;
    }
    if (RiderLat.length == 0) {
      wx.showToast({
        title: '骑手坐标错误！',
        duration: 2000
      })
      return;
    }

    var markers=[];
      markers.push(
      {
        iconPath: '/images/song.png',
        id: 2,
        latitude: RiderLat,
        longitude: RiderLng,
        width: 50,
        height: 50
      }
      );
    console.log(markers);

      this.setData({
        lat: RiderLat,
        lng: RiderLng,
        markers: markers
      });


   
  },

  markertap(e) {
    console.log(e.markerId)
  },

})
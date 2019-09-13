const app = getApp()
Page({
  data: {
    tx:"头像",
    bj_li_img:"",
    bj_li_img_id: "0",
    my_list_img:"/images/shop_xq_b.png",
    name:"",
    tel:"",
    pictuerId:"",
    appUserType:1,
  },


  //事件处理函数  
  changToTest: function () {
    wx.navigateTo({
      url: '../../pages/my_bj/my_bj'
    })
  },
  onLoad: function () {
    
    var that = this


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
    var openid=app.openid
    //获取用户信息
    wx.request({
      url: app.name + 'api/User/' + app.openid + '?marketId=' + app.Market.Id, //仅为示例，非真实的接口地址
      method:'GET',
      success:function(res){
       
        var pictuer='';
        pictuer = res.data.model.HeadUrl == null ? '' : res.data.model.HeadUrl,
        that.setData({
          name: res.data.model.RealName == null ? res.data.model.Name : res.data.model.RealName,
          tel: res.data.model.Phone == null ? '' : res.data.model.Phone,
          
        pictuerId: '0',
        bj_li_img: pictuer,
      })
        if (pictuer == '' ) {
          //获取微信头像
          wx.getUserInfo({
            success: function (res) {

              var userInfo = res.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              var gender = userInfo.gender //性别 0：未知、1：男、2：女
              var province = userInfo.province
              var city = userInfo.city
              var country = userInfo.country
              app.avatarUrl = userInfo.avatarUrl
              that.setData({
                bj_li_img: avatarUrl,
              })
            }
          })
        }
        else {
          that.setData({
            bj_li_img: pictuer,
          })
        }
        
      }
      
    })
   
    
   
  },



   //头像上传
  
     updatePicture: function () {
       var that = this;
       wx.chooseImage({
         count: 1, // 最多可以选择的图片张数，默认9
         sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
         sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
         success: function (res) {
           wx.uploadFile({
             url: app.name + 'api/User/AsyncUpload',
             filePath: res.tempFilePaths[0],
             name: 'file',
             header: { "Content-Type": "multipart/form-data" },
             success: function (res1) {
               var res2=JSON.parse(res1.data)
               console.log(res2);
               console.log(res2.flag);
               console.log(res2.result);
               that.setData({
                 bj_li_img: res2.result
               });
               if (res2.flag)
               {
                 that.setData({
                   bj_li_img: res2.result
                 });
                
               }
               else
               {
                 wx.showToast({
                   title:'上传失败',
                   icon: 'fail',
                   duration: 2000
                 })

               }
              
             }
           })

         },
         fail: function (res1) {
           console.log(res1);
         },
         complete: function (res1) {
           console.log(res1);
         }
       })
},

     formSubmit:function(e){
       var that=this;
       var myreg = /^1[345789]\d{9}$/;
       var tel = e.detail.value.Integral;
       var name = e.detail.value.RealName;
       var HeadUrls = that.data.bj_li_img;
       //手机号判定
       if (tel.length == 0) {
         wx.showToast({
           title: '手机号为空',
           icon: 'success',
           duration: 1500
         })
         return;
       }
       else if (!myreg.test(tel))
       {
         wx.showToast({
           title: '手机号错误',
           icon: 'success',
           duration: 1500
         })
         return;
       }
      //姓名判定
       if (name.length == 0) {
         wx.showToast({
           title: '用户名未填写',
           icon: 'success',
           duration: 1500
         })
         return;
       }
     var url='api/User';
     app.request(url, { name: name, phone: tel, openid: app.openid, HeadUrl: HeadUrls},'PUT',function(res){
      if (res.data.flag) {
        setTimeout(function () {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          });
          wx.navigateBack({
            delta: 1
          }), 4000
        })
      }
      else {
        wx.showToast({
          title: '提交失败',
          icon: 'fail',
          duration: 2000
        })
      }
    },function(){})
   
  }

})  
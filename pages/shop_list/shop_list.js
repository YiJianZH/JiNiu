 //获取应用实例
const app = getApp()

Page({
  data: {
    IsBooths:1,
    appUserType:1,
    Page:1,
    curNav: 1,
    curIndex: 0,
    TextName:"",
    systle: "display:none",
    Msage:"",
    ContenList:[],
    windowHeight:0,
    IsRunt:true,
    //addImg
    addImg:true
  },
  //事件处理函数  
  changToTest:function(){
     wx.navigateTo({
       url: '../../pages/shop_page/shop_page'
     })
  },
  onLoad: function (options){
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
      this.setData({
        appUserType: app.appUserType
      });
    }
    console.log("1")
    console.log(options)
    if (options.id != undefined) {
      console.log("id=" + options.id)
      app.SUSpromotionId = options.id;
    }
    if (options.typeid != undefined){
      console.log("typeid=" + options.typeid)
      app.SUStypeId = options.typeid;
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    
    that.setData({
      IsBooths: app.IsBooths,
      TextName: app.SUSname
    });
    that.GetList();
  },
  GetList: function (){//获取数据列表
    var that = this
    // wx.showLoading({
    //   title: '产品检索中',
    //   icon: 'loading',
    // });
    var typeId = app.SUStypeId;
    var promotionId = app.SUSpromotionId;
    console.log("promotionId=" + app.SUSpromotionId)
    var namet = that.data.TextName;//名称
    var page = that.data.Page;
    var pageSize=10;
    console.log("page=" + page)
    console.log("pageSize=" + pageSize)
    console.log("typeId=" + typeId)
    console.log("promotionId=" + promotionId)
    console.log("openid=" + app.openid)
    console.log("name=" + namet)
    console.log("storeId=" + app.storeId)
    app.request('api/Product/SearchList', { page: page, pageSize: pageSize, typeId: typeId, promotionId: promotionId, openid: app.openid, name: namet, storeId: app.storeId}, "Post",
      function (res) {//hodong_img
        console.log(res);
        if (res.data.flag) {
          var list = [];
          for (var i = 0; i < res.data.list.length; i++) {
            list[i] = ({
              Id: res.data.list[i].Id,
              UnitId: res.data.list[i].UnitId,
              Deputy: res.data.list[i].Deputy,
              IsCollect: res.data.list[i].IsCollect,
              Picture: res.data.list[i].Picture,
              Price: res.data.list[i].Price.toFixed(2),
              OldPrice: res.data.list[i].OldPrice.toFixed(2),
              Title: res.data.list[i].Title,
              Unit: res.data.list[i].Unit,
              Inventory: res.data.list[i].Inventory,
              Collimg: '../../images/sp_a.png',
              SupplierId: res.data.list[i].SupplierId,
              SupplierName: res.data.list[i].SupplierName,
              IsStoreBusiness: res.data.list[i].IsStoreBusiness
            });
            if (list[i].IsCollect) {
              if (app.appUserType==2){
                list[i].Collimg = "../../images/sp_b_lan.png";
              }else{
                list[i].Collimg = "../../images/sp_b.png";
              }
              
            } else {
              list[i].Collimg = "../../images/sp_a.png";
            }
          }
          if (page != 1) {
            var GstList = that.data.ContenList;
            var Gstlength = GstList.length;
            for (var t = 0; t < list.length; t++) {
              GstList.push(list[t])
            }
            list = GstList;
          }
          that.setData({
            ContenList: list,
            systle: "display:none",
            Msage: "",
            IsRunt: true
          });
          console.log("***********");
          console.log(list);

        } else {
          if (page>1){
            that.setData({
              Msage: "没有更多了",
              systle: "display:block",
            })
          }else{
            that.setData({
              ContenList: [],
              Msage: res.data.msg,
              systle: "display:block",
            })
          }
          

        }
        setTimeout(function () {
          wx.hideLoading()
        }, 1000);
      }, function () {//error

        that.setData({ Msage: "没有数据", systle: "display:block", })

      }
    );





  },
  OnSearch:function(){//搜索
    this.GetList();
  },
  GetText: function(e){//获取搜索内容
    app.SUStypeId=0;
    app.SUSpromotionId=0;
    var texte = e.detail.value;
    this.setData({
      TextName: texte
    });
    app.SUSname = texte;
  },
  OnclickSC :function(e){//收藏
    var that = this
    var id = e.currentTarget.dataset.id;
    var indx = e.currentTarget.dataset.indx;
    if (that.data.ContenList[indx].IsCollect){
      app.cancelCollect(id, function () {//error
        var list = that.data.ContenList;
        list[indx].IsCollect=false;
        list[indx].Collimg = "../../images/sp_a.png";
        that.setData({
          ContenList: list
        });
      });
    }else{
      app.joinCollect(id, function () {//error
        var list = that.data.ContenList;
        list[indx].IsCollect = true;
        if (app.appUserType == 2) {
          list[indx].Collimg  = "../../images/sp_b_lan.png";
        } else {
          list[indx].Collimg  = "../../images/sp_b.png";
        }
      
        that.setData({
          ContenList: list
        });
      });
    }
  },
  joinCart: function (e) {//加入购物车
    var pid = e.currentTarget.dataset.id;
    var isb = e.currentTarget.dataset.isb;
    if (isb){
      var unitid = e.currentTarget.dataset.uit;
      console.log("pid=" + pid + ",uid=" + unitid);
      app.joinCart(pid, unitid, function () {//error
        wx.showToast({ title: '数据错误', icon: 'loading', duration: 2000 });
      });
    }
    
  },
  lower: function (e) {//上拉加载

    //设置参数
    var that = this
   
    if (that.data.IsRunt){
 
      var page = that.data.Page;
      page = page + 1;
      that.setData({
        Page: page,
        IsRunt: false
      });
      //加载数据
      that.GetList();
    }

    
  },
 
})

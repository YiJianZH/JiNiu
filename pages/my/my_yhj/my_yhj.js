const app = getApp()
Page({
  data: {
    mages:"display:none",
    //未使用
    YHJ:[ ],
    currIndex:1,
    orderId:0,
    winWidth: 0,
    winHeight: 0,
    magestye:true,
    couponList:[],//所有优惠券
    useCoupon:[],//可用优惠券
    unuseCoupon:[],//不可用优惠券
    IsSelected: true,
    // tab切换
    currentTab: 0,
    orderList:[],//订单信息
  },
  
  set_selected: function () {
    var that = this;
    this.setData({
      IsSelected: !that.data.IsSelected
    })
  },
  onShow:function(){
    if (app.ISorederid!=0){
      this.getCoupon(app.ISorederid)
    }
    
  },
  onLoad: function (options) {
    var that = this;
    var orderId = options.orderId;
    app.ISorederid = orderId;
    that.getCoupon(orderId)

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

  },
  getCoupon: function (orderId){
    var that=this
    var url = 'api/Order/OrderCoupon?orderId=' + orderId+'&openid='+app.openid
    app.request(url,{},'GET',function(res){
      console.log(res);
      if (res.data.flag) {
        var list = res.data.list;
        var newList=[];
        if (list.length>0)
        {
          for(var i=0;i<list.length;i++)
          {
            var IsSelect=false;
            var lists = app.couponList;
            if (lists.length>0)
            {
              for(var j=0;j<lists.length;j++)
              {
                if(list[i].Id==lists[j].Id)
                {
                  IsSelect=true;
                }
              }
            }
            newList.push({
              Id: list[i].Id,
              Deadline: list[i].Deadline,
              PublishTime: list[i].PublishTime,
              Price: list[i].Price.toFixed(2),
              Title: list[i].Title,
              Select: IsSelect,
              CouponSendType: list[i].CouponSendType,
              CanUse:false,
              FullPrice: list[i].FullPrice,
              CouponType: list[i].CouponType,
              ShopId: list[i].ShopId,
              ProductType: list[i].ProductType,
              ProductId: list[i].ProductId,
              ShopName: list[i].ShopName,
            })

            // newList[0].Select = true
          }
        }
        that.setData({
          YHJ: newList,
          couponList: newList,
          orderId: orderId,
          magestye: true,
          orderList: res.data.order
        });
        that.DealCouponList();
      }else{
        that.setData({
          magestye: false
        });
      }
    },function(){})
  },
 //点击使用
  OnclickSY:function(){
    var that = this
    // var id = e.currentTarget.dataset.id; 
    var list = that.data.YHJ
    var newList = [];
    var couponId="";
    if (list.length==0){
      wx.showToast({
        title: '请选择优惠劵',
        icon: 'none'
      }, 2000)
      return ;

    }
    for (var i = 0; i < list.length; i++) {
      if (list[i].Select) {
        list[i].Price = list[i].Price;
        newList.push(list[i]);
        if (couponId.length==0)
        {
          couponId = list[i].Id;
        }
        else
        {
          couponId = couponId + "," + list[i].Id;
        }
      }
    }
   

   //判断是否可使用
    app.request('api/Order/GetCouponOrder', { CouponId: couponId, OrderId: that.data.orderId,}, 'POST', function (res) {
      if (res.data.flag) {
       // app.PreferentialId = id;
       // app.PreferentialPrice = e.currentTarget.dataset.price;
        app.couponMoney = res.data.money;
        var list = res.data.backlist;
        var currList = that.data.YHJ;
        for (var i = 0; i < currList.length;i++)
        {
          currList[i].Select=false;
          var newList = [];
          for (var j = 0; j < list.length;j++)
          {
            if (currList[i].Id==list[j])
            {
              currList[i].Select = true;
              newList.push(currList[i]);
            }
          }
          app.couponList = newList;
          that.setData({
            YHJ: currList
          })
        }
        wx.navigateTo({
          url: '../../shop_list/shop_order/shop_order?id=' + that.data.orderId
        })
      } else {
        // wx.showToast({
        //   title: '不满足使用条件！',
        //   icon: 'loading',
        //   duration: 2000
        // })
        if (res.data.msg =="获取成功")
        {
          app.couponList = newList;
          app.couponMoney = res.data.money;
          var list = res.data.backlist;
          var currList = that.data.YHJ;
          var newList=[];
          for (var i = 0; i < currList.length; i++) {
            currList[i].Select = false;
            for (var j = 0; j < list.length; j++) {
              if (currList[i].Id == list[j]) {
                currList[i].Select = true;
                newList.push(currList[i]);
              }
            }
            app.couponList = newList;
            that.setData({
              YHJ: currList
            })
          }
          wx.navigateTo({
            url: '../../shop_list/shop_order/shop_order?id=' + that.data.orderId
          })
          app.couponFrom=true;
        }
        else
        {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function (res1) {
            }
          })
          setTimeout(function () {
            that.getCoupon(that.data.orderId)
          }, 2000);
        }
       
      }
    }, function () { })

    /*//判断是否可使用
    var url = 'api/Coupon/GetCouponIS?id=' + id + '&ordid=' + that.data.orderId
    app.request(url, {}, 'GET', function (res) {
      if (res.data.flag) {
        app.PreferentialId = id;
        app.PreferentialPrice = e.currentTarget.dataset.price;
        wx.navigateTo({
          url: '../../shop_list/shop_order/shop_order?id=' + that.data.orderId
        })
      } else {
        wx.showToast({
          title: '不满足使用条件！',
          icon: 'loading',
          duration: 2000
        })
        setTimeout(function () {
          that.getCoupon(that.data.orderId)
        }, 2000);
      }
    }, function () { })*/
   
  },
  Gomy_yhj:function(){//跳转我的优惠劵
 
    wx.navigateTo({
      url: '../../../pages/my/my_yh/my_yh'
    })
  },
  selectCoupon:function(e){
    var that=this;
    var id = e.currentTarget.dataset.id;
    var list = that.data.YHJ;
    for(var i=0;i<list.length;i++)
    {
      if (list[i].Id==id)
      {
        list[i].Select = !list[i].Select
      }
    }
    that.setData({
      YHJ: list,
      couponList: list,
    })
    that.DealCouponList();
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //处理优惠券为可用和不可用
  DealCouponList:function(){
    var that=this;
    var list = that.data.couponList
    var order = that.data. orderList;
    var useCoupon=[];
    var unuseCoupon=[];
     var couponMoney=0;
     var totleMoney=0;
    for (var i = 0; i < list.length;i++)
    {
      list[i].CanUse = false;
    }
    for (var i = 0; i < order.length;i++)
    {
      totleMoney += parseFloat(order[i].TotalMoney);
      for (var j = 0; j < list.length;j++)
      {
       
        //店铺优惠券
        if (list[j].CouponSendType==3)
        {
          //匹配店铺
          if (list[j].ShopId == order[i].SupplierId)
          {
             //店铺满减
            if (list[j].CouponType == 1)
            {
              if (parseFloat(list[j].FullPrice) <= parseFloat(order[i].TotalMoney) )
              {
                list[j].CanUse=true;
                if (list[j].Select) {
                couponMoney += parseFloat(list[j].Price) > parseFloat(order[i].TotalMoney) ? parseFloat(order[i].TotalMoney) : parseFloat(list[j].Price);
                }
              }
            
            }
             //优惠分类
            else if (list[j].CouponType == 2) {
              var money=0;
              for (var z = 0; z < order[i].Detail.length;z++)
              {
                if (order[i].Detail[z].ProductTypeId == list[j].ProductType)
                {
                  money += parseFloat(order[i].Detail[z].ProductPrice) * parseFloat(order[i].Detail[z].ProductNum)
                }
              }
              if (money>0) {
                list[j].CanUse = true;
                if (list[j].Select) {
                couponMoney += parseFloat(list[j].Price) > parseFloat(order[i].TotalMoney) ? parseFloat(order[i].TotalMoney) : parseFloat(list[j].Price);
                }
              }
            
            }
            //优惠产品
            else if (list[j].CouponType == 3) {
              var money = 0;
              var productList = list[j].ProductId.split(',')
              for (var z = 0; z < order[i].Detail.length; z++) {
                for (var m = 0; m < productList.length;m++)
                {
                  if (order[i].Detail[z].ProductId == productList[m]) {
                    money += parseFloat(order[i].Detail[z].ProductPrice) * parseFloat(order[i].Detail[z].ProductNum)
                  }
                }
               
              }
              if (money > 0) {
                list[j].CanUse = true;
                if (list[j].Select) {
                couponMoney += parseFloat(list[j].Price) > parseFloat(order[i].TotalMoney) ? parseFloat(order[i].TotalMoney) : parseFloat(list[j].Price);
                }
              }
             
            }
             //店铺优惠产品满减
            else if (list[j].CouponType == 4) {
              var money = 0;
              var productList = list[j].ProductId.split(',')
              for (var z = 0; z < order[i].Detail.length; z++) {
                for (var m = 0; m < productList.length; m++) {
                  if (order[i].Detail[z].ProductId == productList[m]) {
                    money += parseFloat(order[i].Detail[z].ProductPrice) * parseFloat(order[i].Detail[z].ProductNum)
                  }
                }

              }
              if (money > parseFloat(list[j].FullPrice)) {
                list[j].CanUse = true;
                if (list[j].Select)
                {
                  couponMoney += parseFloat(list[j].Price) > parseFloat(order[i].TotalMoney) ? parseFloat(order[i].TotalMoney) : parseFloat(list[j].Price);
                }
              
              }
             
            }
          }
         

        }
       
      }
    }
    //处理完了店铺优惠券，再来处理平台优惠券，这样才能知道最后除了店铺还要支付的金额，用来匹配平台优惠券
     //平台优惠券
    var finishMoney = totleMoney - couponMoney;
    for (var j = 0; j < list.length; j++) {
      var isSelect = list[j].Select;
      if (parseFloat(list[j].FullPrice) <= finishMoney && list[j].CouponSendType!=3) {
        list[j].CanUse = true;
      }
     
    }
      //处理完了优惠券，再来把优惠券分成可用和不可用两砣
    for (var i = 0; i < list.length;i++)
    {
      if (list[i].CanUse)
      {
        useCoupon.push(list[i])
      }
      else
      {
        unuseCoupon.push(list[i])
      }
    }
    //最终赋值
    that.setData({
      YHJ: list,
      couponList: list,//所有优惠券
      useCoupon: useCoupon,//可用优惠券
      unuseCoupon: unuseCoupon,//不可用优惠券
    })
    that.UpdateCouponSelect();

  },
  //更新优惠券被选中的状态
  UpdateCouponSelect:function(){
    var that=this;
    var couponList = that.data.couponList;//所有优惠券
    var unuseCoupon = that.data.unuseCoupon;//不可用优惠券
    for (var i = 0; i < couponList.length;i++)
    {
      for (var j = 0; j < unuseCoupon.length;j++)
      {
        console.log("i:"+i+",j:"+j)
        if (couponList[i].Id == unuseCoupon[j].Id)
        {
          couponList.Select=false;
        }
      }
    }
    that.setData({
      couponList: couponList,
      YHJ: couponList,
    })
  }


})



const app = getApp()
Page({
  data: {
    nuber:0,
    stop:0,
    scrollTop:0,//距离
    isScrollTop:false,//是否翻页
    toView: "",
    sid:0,//店铺ID
    right_lists: [],
    currentTab: 0,
    storeData:{},//店铺信息
    typeName:"",
    totime:0,
    PromotList: [],
    TypeList: [],
    ProductList:[],//产品列表
    StoreCoupon:[],//店铺优惠券
    CurrPage:1,//优惠券页数
    msgejz: true,
    msgemy: true,
    IsRunt:true,
    tpage:1,
    SearchName:"",
    CouponsPopSH: true,
    hasGetCoupon: false,
    x: 0,
    y: 0,
    isSelling: true,
    isBusiness: false,
    init: false,
    state: false,
    onclik:false,
    Islogin:true,
    appUserType:1,
  },

  mjToggle: function () {
    var that = this;
    if (!that.data.init) {
      this.setData({
        init: true
      })
    }
    if (!that.data.state) {
      this.setData({
        state: true
      })
    } else {
      this.setData({
        state: false
      })
    }
  },
  getCarNuber: function () {
    var that = this
    app.request('api/Cart/GetUserCartNuberList', {
      page: 0,
      pageSize: 0,
      openid: app.openid,
      marketid: app.storeId
    }, "POST",
      function (res) {
        console.log("数量");
        console.log(res);
        if (res.data.flag) {
          that.setData({
            nuber: res.data.Nuber
          });
        }
      },
      function () {
        wx.showToast({
          title: '获取类型失败',
          icon: 'success',
          duration: 2000
        })
      })
  },

  showCouponsPop: function () {
    this.setData({
      CouponsPopSH: false
    })
  },
  hideCouponsPop: function () {
    this.setData({
      CouponsPopSH: true
    })
  },
  to_new: function () {
    wx.navigateTo({
      url: '/pages/home/new_goods/nd',
    })
  },
  to_goods_man: function () {
    wx.navigateTo({
      url: '/pages/home/batchMan/bm',
    })
  },
  switchRightNav: function (e) {
    console.log(e)
    var that = this;
    
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,
        onclik:false,
      })
      var index = e.currentTarget.dataset.index;
      var plist = that.data.ProductList;
      console.log("点击事件");
      console.log("index="+index);
      console.log(plist[index]);
      if (plist.length>0){
        that.setData({
          toView: 'pt' + e.currentTarget.dataset.current,
        })
        if (plist[index].Page == 0) {
          //获取产品
          console.log("获取产品");
          that.getPctDataList(that.data.currentTab, 1,1);

        } else {
          console.log("拦截");
          that.setData({
            scrollTop: plist[index].ScrollTop,
          
          })

          console.log('pt' + e.currentTarget.dataset.current);

        }
      }else{
        console.log("获取产品");
        that.getPctDataList(that.data.currentTab, 1,1);
      }
      

      
    }

    
  },
  onLoad(option) {
    var that = this;
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
    console.log("加载")
    console.log(option)
    var sid = option.sid;
    that.setData({
      sid:sid,
    });
     that.getDataInfor();
     that.GetStoreCoupon(1);
     that.getCarNuber();
    
    that.setData({
      x: app.WX,
      y: app.WY
    });
  },
  onShow:function(){
    var that = this;

  },
  //店铺信息
  getDataInfor:function(){
    var that = this;
    var sid = that.data.sid;
    app.request('api/Store/GetDetailInfor?id='+sid, {}, "GET",
      function (res) {
        console.log("获取商家");
        console.log(res);
        if (res.data.flag){
          var storeData = res.data.obj;
          console.log(storeData);
          var ProductList=[];
          for (var i = 0; i < storeData.TypeList.length;i++){
            ProductList.push({ Id: storeData.TypeList[i].Id, Name: storeData.TypeList[i].Name, Page: 0, ScrollTop: 0, ProductList: [], Islogin:true});
          }

          that.setData({
            storeData: storeData,
            PromotList: storeData.PromotList,
            ProductList: ProductList,
            TypeList: storeData.TypeList,
            typeName: storeData.TypeList.length > 0 ? storeData.TypeList[0].Name : "",
            currentTab: storeData.TypeList.length>0? storeData.TypeList[0].Id:0
          });
          
          console.log("获取商家1");
          console.log(ProductList);
          if (storeData.Lng>0){
            that.getDistance(storeData.Lng, storeData.Lat);//计算
          }
          
          console.log("获取商家2");
          // //获取产品
          console.log(storeData.TypeList);
          console.log(that.data.ProductList);
          console.log("********************");
          for (var i = 0; i < storeData.TypeList.length; i++) {
            console.log("循环获取产品:" + storeData.TypeList[i].Name); 
            that.getPctDataList(storeData.TypeList[i].Id, 1,0);
            
          }
         
         
        

        }
       

      },
      function () {
        wx.showToast({
          title: '获取商家无效',
          icon: 'loading',
          duration: 2000
        });
      })

  },
  //计算距离
  getDistance:function( log, lat){
    var that = this;
    // 引入SDK核心类
    var QQMapWX = require('/../../../utils/qqmap-wx-jssdk.js');
    var latitudet;
    var longitudet;
    // 实例化API核心类
    var demo = new QQMapWX({
      key: '2FABZ-QNAWX-QBV4I-7U2QC-D3RTQ-BTB7O' // 必填
    });

    // 计算距离调用接口
    demo.calculateDistance({
      mode: 'driving',
      to: [{
        latitude: lat,
        longitude: log
      }],
      success: function (res) {
        console.log(res)
        if (res.status == 0) {
          var duration = res.result.elements[0].duration;
          var timeda = parseInt(duration / 60);
          console.log(timeda);
          that.setData({
            totime: timeda
          });
         
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });

  },
  //获取产品列表
  getPctDataList: function (tid,page,isol) {
    console.log("获取产品");
    var that = this
    that.setData({
      isScrollTop:false
    });
    wx.showLoading({
      title: '加载中',
    })
    console.log("TypeId=" + tid);
    console.log("page=" + page);
    console.log("OpenId=" + app.openid);
    console.log("StoreId=" + that.data.sid);
    app.request('api/Product/GetStoreProductModelByType', { 
      pageIndex: page, 
      pageSize: 8, 
      TypeId: tid,
      OpenId: app.openid,
      StoreId: that.data.sid,
      Name: that.data.SearchName, 
      }, "Post",
      function (res) {
       
        if (res.data.flag) {
          var prodList = res.data.list;
          var prolist=[];
          //整合列表
          for (var y = 0; y < prodList.length; y++) {
            prodList[y].Price = prodList[y].Price.toFixed(2);
            prodList[y].OldPrice = prodList[y].OldPrice.toFixed(2);
            prolist.push(prodList[y]);
          }
          console.log("获取产品列表");
          console.log(prolist);

          var plist = that.data.ProductList;
          console.log("已得产品列表");
          console.log(plist);
          var scrollTop=0;//产品当前距离--判断翻页
       
          if (page>1){
            //循环判断哪个分类在添加产品
            for (var p = 0; p < plist.length; p++) {
              if (plist[p].Id == tid) {
                //循环添加产品
                for (var r = 0; r < prolist.length; r++) {
                  plist[p].ProductList.push(prolist[r]);
                }
                plist[p].Page = page;
                if (prolist.length<8){//判断是否还有数据
                  plist[p].Islogin = false

                  //添加距离ScrollTop
                  console.log("原ScrollTop=" + plist[p].ScrollTop);
                  console.log("加=" + ((prolist.length * 20)));
                  //第一个赋值0
                  if (prolist.length>4){
                    plist[p].ScrollTop += ((prolist.length * 20) + (((page - 1) * 150)));
                  }else{
                    plist[p].ScrollTop += ((prolist.length * 20) );
                  }
                  

                }else{
                  plist[p].Islogin = true

                  //添加距离ScrollTop
                  console.log("原ScrollTop=" + plist[p].ScrollTop);
                  console.log("加=" + ((prolist.length * 20) + ((page-1) * 120)));
                  //第一个赋值0
                  plist[p].ScrollTop += ((prolist.length * 20) + ((page - 1)  * 120));
                }
                //获取距离
                scrollTop = plist[p].ScrollTop;
              }
              console.log("scrollTop###=" + scrollTop);
            }
          }else{
            //循环判断哪个分类在添加产品
            for (var p = 0; p < plist.length; p++) {
              console.log("tid=" + tid);
              if (plist[p].Id == tid) {
                plist[p].ProductList = prolist;
                plist[p].Page = page;

                console.log("判断是否还有数据");

                if (prolist.length < 8) {//判断是否还有数据
                  plist[p].Islogin = false
                  console.log("Islogin=" + false);
                } else {
                  plist[p].Islogin = true
                  console.log("Islogin=" + true);
                }
                

                console.log("p=" + p);
                //添加距离ScrollTop
                if(p>0){
                  //如果不是第一个咋在前一个基础上加距离
                  console.log("其他分类");
                  console.log("原：" + plist[p - 1].ScrollTop);
                  if (prolist.length < 8){
                    //判断前一个是否有数据
                    if (plist[p - 1].ScrollTop>0){
                      //如果不够数据
                      plist[p].ScrollTop = plist[p - 1].ScrollTop + (prolist.length * 20) + ((page-1)*150);
                    }else{
                      //如果不够数据
                      plist[p].ScrollTop = plist[p - 1].ScrollTop + (prolist.length * 10) + ((page - 1) * 150);
                    }

                    
                    console.log("如果不够数据：" + plist[p].ScrollTop);
                  }else{
                    //数据多
                    if (plist[p - 1].ProductList.length>=8){
                      plist[p].ScrollTop = plist[p - 1].ScrollTop + (prolist.length * 20) + 400;
                      console.log("如果数据多1：" + plist[p].ScrollTop);
                    }else{
                      if (plist[p - 1].ProductList.length >= 5){
                        plist[p].ScrollTop = plist[p - 1].ScrollTop + (prolist.length * 20) + 400;
                      }else{
                        if (plist[p - 1].ScrollTop>0){
                          plist[p].ScrollTop = plist[p - 1].ScrollTop + (prolist.length * 20) + 250;
                        }else{
                          console.log("前面没有");
                          plist[p].ScrollTop =  (prolist.length * 20);
                        }
                       
                      }
                     
                      console.log("如果数据多2：" + plist[p].ScrollTop);
                    }
                   
                  }
                  
                  console.log("现在=" + plist[p].ScrollTop);

                  // if (page == 1) {
                  //   console.log("22第一页");
                  //   var lengths=0;
                  //   for (var f = 0; f < plist.length;f++){
                  //     lengths += plist[f].ProductList.length;

                  //   }
                  //   if (lengths < 8) {
                  //     console.log("22下一页");
                  //     that.getPctDataList(plist[p + 1].Id, 1);
                  //   }

                  // } else {
                  //   console.log("第N页");
                  // }
                 
                }else{
                  console.log("第一个赋值0");
                  //第一个赋值0
                  plist[p].ScrollTop = prolist.length*20;
                  // if (page==1){
                  //   console.log("第一页");
                  //   if (prolist.length<8){
                  //     console.log("下一页");
                  //     if (p < plist.length-1){
                  //       that.getPctDataList(plist[p + 1].Id, 1);
                  //     }
                      

                  //   }

                  // }else{
                  //   console.log("第N页");
                  // }
                 
                }
                //获取距离
                scrollTop = plist[p].ScrollTop;
              }
            }
          }
          console.log("_______");
          console.log(plist);

          if (isol==0){
            scrollTop = plist[0].ScrollTop;
          }
          that.setData({
            scrollTop: scrollTop,
            isScrollTop: true,
            msgejz: true,
            msgemy: true,
            IsRunt: true,
            ProductList: plist,
          });
      
        
        } else {
          console.log("没有数据");
            that.setData({
              msgejz: true,
              msgemy: false,
              isScrollTop: true,
            });




            
              console.log("加载下个分类");
          if (isol>0){
            // //加载下个分类
            var obj = that.data.ProductList;//产品集合
            var tyid = that.data.currentTab;//当前选择分类ID
            var isfan = 0;
            console.log("tyid=" + tyid);
            console.log(obj);
            for (var i = 0; i < obj.length; i++) {
              if (tyid == obj[i].Id) {
                if (i < obj.length - 1) {
                  isfan = i + 1;
                }
              }
            }
            console.log("判断是否可以下个分类");
            console.log("isfan=" + isfan);
            ///判断是否可以下个分类
            if (isfan > 0) {
              console.log("22下个分类");
              //that.getPctDataList(obj[isfan].Id, 1);
              that.setData({
                currentTab: obj[isfan].Id,
              });

            }


          }
          
             

        }

        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }, function () {
        wx.showToast({
          title: '获取产品失败',
          icon: 'success',
          duration: 2000
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      })


  },
  gobromm:function(e){
    console.log("或其要");
    console.log(e);
    var sid = e.currentTarget.dataset.sid;
    wx.navigateTo({
      url: '/pages/index/merchartYellowPage/merchartIntro/mi?sid=' + sid
    })
  },
  //翻页
  lower:function(){
   
    // //设置参数
    // var that = this
    // console.log("加载")
    // if (that.data.IsRunt) {
    //   var page = that.data.tpage;
    //   page = page + 1;
    //   that.setData({
    //     IsRunt: false,
    //     msgejz: false,
    //   });
    //   //获取产品
    //   that.getPctDataList(that.data.currentTab, page);
    // }
  },
  //滚动触发
  scroll:function(e){
    var that = this;
    if (that.data.onclik){
      if (that.data.isScrollTop) {
        
        var stop = e.detail.scrollTop;
        var scrollTop = that.data.scrollTop;
        console.log("stop=" + e.detail.scrollTop);
        console.log("scrollTop=" + scrollTop);
        
        if (scrollTop < stop){
          //翻页
          var obj = that.data.ProductList;//产品集合
          var tyid = that.data.currentTab;//当前选择分类ID
          for (var i = 0; i < obj.length; i++) {
            if (tyid == obj[i].Id) {
              obj[i].ScrollTop = stop;
              that.setData({
                ProductList: obj
              });

              
              console.log(obj);
              if (obj[i].Islogin) {
                //还有
                console.log("当前分类翻页");
                console.log("下一翻页" + obj[i].Name);
                console.log("下一翻页=" + (obj[i].Page + 1));
                that.getPctDataList(that.data.currentTab, obj[i].Page + 1,1);
                
              } else {
                //加载下一个分类
                console.log("加载下一个分类");
                //判断是否是最后一个分类,最后一个不加载
                if (i< obj.length-1){
                  that.setData({
                    currentTab: obj[i + 1].Id
                  });

                  console.log("加载=" + obj[i + 1].Name);
                  that.getPctDataList(obj[i+1].Id, 1,1);
                }else{
                  console.log("加载下一个分类,没有了");
                  that.setData({
                    msgemy:false
                  });
                }

                

              }

            }

          }

        }else{
          console.log("向上翻");
          //判断是否上个分类
          console.log("判断是否上个分类");
          var obj = that.data.ProductList;//产品集合
          var tyid = that.data.currentTab;//当前选择分类ID
          console.log(obj);
          for (var i = 0; i < obj.length; i++) {
           
            if (tyid == obj[i].Id) {
              console.log("obj[i].Id=" + obj[i].Id);
              console.log("obj[i].Name=" + obj[i].Name);
              console.log("判断是否第一个个分类");
              if(i>0){
                console.log("不是第一个分类，判断距离");
                console.log("上个分类=" + obj[i - 1].ScrollTop);
                if (stop < obj[i-1].ScrollTop){
                  //上个分类
                  console.log("上个分类");
                  that.setData({
                    currentTab: obj[i-1].Id,
                    scrollTop: obj[i - 1].ScrollTop
                  });

                }

              }

            }
          }
        }
         
    
      }
    } else {
      that.setData({
        onclik: true
      });
    }
    
    
    
  },
  joinCart: function (e) {//加入购物车
    console.log(e);
    var that = this
    var pid = e.currentTarget.dataset.id;
    var isb = e.currentTarget.dataset.isb;
    if (isb){
      var unitid = e.currentTarget.dataset.uid;
      console.log("pid=" + pid + ",uid=" + unitid);

      app.request('api/Product/GetInventory?id=' + unitid, {}, "GET",
        function (res) {
          if (res.data.msg <= 0) {
            wx.showToast({
              title: '库存不足',
              icon: 'loading',
              duration: 2000
            });
            return;
          } else {
            app.request('api/Cart', {
              pid: pid,
              unitid: unitid,
              openid: app.openid
            }, "POST", function (res) {
              wx.showToast({
                title: '已加入购物车',
                icon: 'success',
                duration: 2000
              })
              that.getCarNuber();
            })
          }
        }, function (res) {


        })

    }
   


  },
  setSearchName:function(e){
    console.log(e);
    var name = e.detail.value;
    this.setData({
      SearchName: name
    });

  },
  //搜索
  goSearchName:function(){
    var that = this;
    //获取产品
    that.getPctDataList(that.data.currentTab,1,1);
  },
  productDeil: function (e) {
    console.log("获取数据");
    console.log(e);
    var pid = e.currentTarget.dataset.pid;
    var isb = e.currentTarget.dataset.isb;
    if (isb){
      wx.navigateTo({
        url: '/pages/shop_list/shop_page/shop_pege?id=' + pid
      })
    }
    

  },
  //获取店铺优惠券
  GetStoreCoupon:function(page){
    console.log("page=" + page);
  var that=this;
    app.request('api/Store/GetStoreCoupon', {
      page:page, 
      pageSize:5, 
      storeId: that.data.sid,
      openid: app.openid
    }, "POST",
      function (res) {
        console.log("获取店铺优惠券");
        console.log(res.data);
        if (res.data.flag) {
          var list = res.data.list;
         var newList=[];
         that.setData({
           CurrPage:page
         })
         if(page>1)
         {
           newList = that.data.StoreCoupon;
          //  StoreCoupon: [],//店铺优惠券
          //    CurrPage: 1,//优惠券页数
         }
          for (var i = 0; i < list.length; i++) {
            newList.push({
              Id: list[i].Id,
              Deadline: list[i].Deadline,
              IsDelete: list[i].IsDelete,
              IsGet: list[i].IsGet,
              IsOverdue: list[i].IsOverdue,
              IsUse: list[i].IsUse,
              FullPrice: parseFloat(list[i].FullPrice).toFixed(2),
              Price: parseFloat(list[i].Price).toFixed(2) ,
              PublishTime: list[i].PublishTime,
              Title: list[i].Title,
              Explanation: list[i].Explanation,
            })
          }
         
          console.log(list);

          that.setData({
            // msgejz: true,
            // msgemy: true,
            StoreCoupon: newList
          });
        
        } else {
          console.log("没有数据");
          // if (tpage > 1) {
          //   that.setData({
          //     msgejz: true,
          //     msgemy: false,
          //   });
          // } else {
          //   that.setData({
          //     msgejz: true,
          //     msgemy: false,
          //     ProductList: []
          //   });
          // }
        }

        setTimeout(function () {
          wx.hideLoading()
        }, 200)
      }, function () {
        wx.showToast({
          title: '获取优惠券失败',
          icon: 'success',
          duration: 2000
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 200)
      })

  },
  //获取更多优惠券
  GetMoreCoupon:function()
  {
    var that=this;
    var page = that.data.CurrPage;
    page++;
    console.log("currPage=" + that.data.CurrPage);
    console.log("page=" + page);
    that.GetStoreCoupon(page);
  },

  //领用优惠券
  AddCoupon: function (e) {
    console.log("领取优惠劵");
    var that = this
    let Id = e.currentTarget.dataset.addid;
    /*let price = event.currentTarget.dataset.price;
    app.coupon[0]['Id']=Id
    app.coupon[0]['price'] = price*/


    console.log("id=" + Id);
    console.log("openid=" + app.openid);
    var url = 'api/Coupon'
    app.request(url, {
      id: Id,
      openid: app.openid
    }, 'POST', function (res) {
      if (res.data.flag) {       
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
        //完成后关闭 弹窗
        // that.setData({
        //   CouponsPopSH: true
        // })


      }
      else {
        wx.showToast({
          title: '已达到领取上限！',
          icon: 'success',
          duration: 2000
        })
      }
      // that.setData({
      //   CouponsPopSH: true
      // })
      that.GetStoreCoupon(1)
    }, function () { })

  },
  cart_show: function () {
    var that = this
    console.log("跳转购物车");
    wx.switchTab({
      url: '/pages/shop_list/shop_cart/shop_cart'
    })
  }


  

 
})
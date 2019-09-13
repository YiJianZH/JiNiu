//获取应用实例
const app = getApp()

Page({
  data: {
    appUserType:1,
    scrollTop:0,
    toView: "",
    tpage: 1,
    nuber: 0,
    state: false,
    first_click: false,
    IsRunt: true,
    msgejz: true,
    msgemy: true,
    CateItemsList: [], //类型2
    TypeList: [], //三级分类
    PList: [],
    curNav: 1,
    HtmlStyle: "display:none",
    mesgastype: "display: none",
    saNuber: 0, //三级点击ID
    saName: '全部',
    Isleve: 3,
    x: 0,
    y: 0,
    isSelling: false,
    isBusiness: false,
    islogin: true,
  },
  setpidlist: function(e) {
    var that = this
    var tid = e.currentTarget.dataset.tid;
    var PList = that.data.PList;
    var nbuer=0;
    for (var i = 0; i < PList.length;i++){
      if (PList[i].Id == tid){
        nbuer=i;
      }
    }
    that.setData({
      saNuber: tid, //三级点击ID

    });
    if (PList[nbuer].Page>0){
      console.log("锁定滚动");
      that.setData({
        isScrollTop: false
      });
      console.log("有数据直接跳转");
      that.setData({
        saNuber: tid, //三级点击ID
        toView: 'sit' + tid,
      });
      setTimeout(function(){
        console.log("打开锁定");
        that.setData({
          isScrollTop: true
        });
      },1000);

    }else{
      console.log("没有数据加载");
      that.getPctDataList(tid,1,1);
     
    }

    

  },
  
  toggle: function(e) {
    var that = this
    var tid = e.currentTarget.dataset.tid;
    var tname = e.currentTarget.dataset.tname;
    if (tid != undefined) {
      that.setData({
        saNuber: tid, //三级点击ID
        saName: tname,
        toView: 'sit' + tid
      });
      console.log("tid=" + that.data.toView);
    }
    var list_state = this.data.state,
      first_state = this.data.first_click;
    if (!first_state) {
      that.setData({
        first_click: true
      });
    }
    if (list_state) {

      that.setData({
        state: false,
      });
    } else {
      that.setData({
        state: true
      });
    }
  },
  //事件处理函数  
  switchRightTab: function(e) { //點擊類型方法
    var that = this
   
      console.log("點擊類型方法");
      // 获取item项的id，和数组的下标值  
      let id = e.target.dataset.id;

      if (that.data.curNav != id) {
        console.log("id=" + id);
        that.setData({
          curNav: id,
          soltop: 0,
          sctopnuber: 0,
          toView: "",
        });
        // 把点击到的某一项，设为当前index  
        var CateItemsList = that.data.CateItemsList;
        console.log(CateItemsList);
        console.log("777");
        for (var i = 0; i < CateItemsList.length; i++) {

          console.log("CateItemsList_id=" + CateItemsList[i].Id);
          if (id == CateItemsList[i].Id) {
            console.log("id=" + id);
            console.log(CateItemsList[i].ChildCategory);
            var TypeList = CateItemsList[i].ChildCategory;
            if (TypeList.length > 0) {
              var tindex = 0;
              for (var r = 0; r < TypeList.length; r++) {
                if (TypeList[r].Id == CateItemsList[i].Id) {
                  tindex++
                }

              }
              if (tindex == 0) {
                TypeList.unshift({
                  Id: CateItemsList[i].Id,
                  Name: CateItemsList[i].Name,
                });
              }

            } else {
              TypeList.unshift({
                Id: CateItemsList[i].Id,
                Name: CateItemsList[i].Name,
              });
            }


            var Plist = [];


            for (var u = 0; u < TypeList.length; u++) {
              Plist.push({
                Id: TypeList[u].Id,
                Name: TypeList[u].Name,
                ProductList: [],
                Page: 0,
                Isover: false,
                ScrollTop: 0
              });
            }

            that.setData({
              PList: Plist,
              TypeList: TypeList,
            });
            console.log("***************");
            console.log(Plist);
            console.log(TypeList);
            if (Plist.length > 0) {
              that.setData({
                saNuber: Plist[0].Id, //三级点击ID
              });
              console.log("三级：" + Plist[0].Id);
              console.log("Plist");
              console.log(Plist)
              console.log("TypeList");
              console.log(TypeList);

              that.getPctDataList(Plist[0].Id, 1, 0);
            }

          }
        }
      }
    
    
  },
  //滚动监听
  scroll: function(e) {
    var that = this
    
    if (that.data.isScrollTop){
      console.log("滚动scrollTop：" + e.detail.scrollTop)
      var stop = e.detail.scrollTop;
      var scrollTop = that.data.scrollTop;
      console.log("分类：scrollTop=" + scrollTop)
      
      if (scrollTop < stop) {
        console.log("向下滚动");
        if (scrollTop>0){
          var saNuber = that.data.saNuber;//当前分类
          //翻页操作
          var PList = that.data.PList;
          var xnuber = -1;
          console.log("判断是否翻页操作");
          console.log("saNuber=" + saNuber);
          console.log(PList);
          for (var i = 0; i < PList.length; i++) {
            if (PList[i].Id == saNuber) {
              if (PList.length - 1 >= i) {
                if (PList[i].Isover) {
                  console.log("下个分类");
                  xnuber = i + 1;
                } else {
                  console.log("下一页");
                  xnuber = i;
                }
              }
            }
          }
          
          console.log("判断是否下个分类");
          console.log("xnuber=" + xnuber);
          //判断是否下个分类
          if (xnuber > -1) {
            console.log("执行翻页");
            if (PList.length > xnuber){
              //2019-04-01
              that.setData({
                saNuber: PList[xnuber].Id
              });
              //获取产品
              that.getPctDataList(PList[xnuber].Id, PList[xnuber].Page + 1, 0);
            }else{
              //本格分类没有数据了、
              console.log("本格分类没有数据了、");
              that.setData({
                msgemy:false
              });
            }
            
          }
        }
        
      } else {
        //判断是否上个分类
        console.log("向上滚动");
        var PList = that.data.PList;
        var saNuber = that.data.saNuber;//当前分类
        var scrTop = 0;//上一个分类距离
        console.log("saNuber=" + saNuber);
        var xiunuber=0;
        var tnuber=0;//index
        for (var t = 0; t < PList.length;t++){
          if (PList[t].Id == saNuber ) {
            if(t>0){
              if (PList[t - 1].IsHidden){
                if (t>1){
                  that.setData({
                    saNuber: PList[t - 2].Id
                  })
                }
                

                }else{
                tnuber = t - 1;
                console.log("上个分类77=" + PList[t - 1].ScrollTop);
                scrTop = PList[t - 1].ScrollTop;//赋值上分类
                xiunuber = PList[t - 1].Id;
                console.log("上个分类555=" + PList[t - 1].Name);
                }
                
              
              
            }else{
              console.log("没有分类了" );
                tnuber = t;
                console.log("上个分类788=" + PList[t].ScrollTop);
                scrTop = PList[t].ScrollTop;//赋值上分类
                xiunuber = PList[t].Id;
                console.log("上个分类5995=" + PList[t].Name);
                
            }
            
          }
        }
        console.log("上个分类距离：" + scrTop);
        console.log("这个距离修改距离：" + (scrTop + 20));
        if (stop < (scrTop + 20)){
          var TyList = that.data.TypeList;
          console.log(TyList);
          console.log(TyList[tnuber]);
          console.log("IsHidden="+TyList[tnuber].IsHidden);
          if (!TyList[tnuber].IsHidden){
            console.log("上个分类666666666");
            that.setData({
              saNuber: xiunuber,
              scrollTop: scrTop
            });
          }else{
            console.log("上个分类没数据");
            //判断是否有上上个分类，有就加载
            if (tnuber>0){
              console.log("上上个分类666666666");
              that.setData({
                saNuber: TyList[tnuber-1].Id,
                scrollTop: scrTop
              });
            }

            
          }
        }

      }
    }
    
  },
  onLoad: function(options) {
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
      that.setData({
        appUserType: app.appUserType
      });
    }
    console.log("onload")
    console.log(options)
    var pid = options.pid;
    var pname = options.pname;
    //设置当前标题
    wx.setNavigationBarTitle({
      title: pname
    })

    //获取二级菜单
    that.getDetaList(pid, 1);

    that.setData({
      IsBooths: app.IsBooths,
      x: app.WX,
      y: app.WY
    });
  },
  onShow: function() {
    var that = this
    app.SUStypeId = 0;
    app.SUSpromotionId = 0;
    app.SUSname = "";
    that.getCarNuber();
  },
  getCarNuber: function() {
    var that = this
    app.request('api/Cart/GetUserCartNuberList', {
        page: 0,
        pageSize: 0,
        openid: app.openid,
        marketid: app.storeId
      }, "POST",
      function(res) {
        console.log("数量");
        console.log(res);
        if (res.data.flag) {
          
          that.setData({
            nuber: res.data.Nuber
          });
          console.log("-------------zdh nuber-----" + that.data.nuber);
        }
      },
      function() {
        wx.showToast({
          title: '获取类型失败',
          icon: 'success',
          duration: 2000
        })
      })
  },
  // 下拉刷新  
  onPullDownRefresh: function() {
    var that = this
    // 显示导航栏loading  
    wx.showNavigationBarLoading();
    // 调用接口加载数据  
    that.onLoad();
    // 隐藏导航栏loading  
    wx.hideNavigationBarLoading();
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新  
    wx.stopPullDownRefresh();

  },
  //根据级别获取类型
  getDetaList: function(pid, page) {
    var that = this
    app.request('api/Category/GetCategoryList?pid=' + pid + '&page=' + page + '&typeid=' + app.appUserType, {}, "GET",
      function(res) {
        console.log(res);
        console.log("获取三级分类列表");
        if (res.data.flag) {
          var list = res.data.list;
          console.log(list);
          console.log("数据----");
          var TypeList = list[0].ChildCategory;
          TypeList.unshift({
            Id: list[0].Id,
            Name: list[0].Name,
            IsHidden:false
          });
          var Plist = [];
          
          console.log(Plist);
          for (var i = 0; i < TypeList.length; i++) {
            Plist.push({
              Id: TypeList[i].Id,
              Name: TypeList[i].Name,
              ProductList: [],
              Page: 0,
              Isover: false,//是否加载完
              ScrollTop:0
            });
          }
          console.log("11");
          console.log(list);
          console.log(Plist);
          console.log("22");
          that.setData({
            CateItemsList: list,
            TypeList: TypeList,
            curNav: list[0].Id,
            saNuber: TypeList[0].Id,
            PList: Plist
          });
          
          console.log(Plist);
          that.setData({
            islogin: false,
            HtmlStyle: "display:block"
          });
          console.log(TypeList[0].Id);
          console.log(TypeList);
          console.log("^^^^^^^^^^^");
          if (TypeList.length > 0) {
            //获取产品
            that.getPctDataList(TypeList[0].Id, 1,0);
          }

        } else {

        }
      },
      function() {
        wx.showToast({
          title: '获取类型失败',
          icon: 'success',
          duration: 2000
        })
      })

  },
  //获取产品列表
  getPctDataList: function(tid, page,tiao) {
    console.log("tid=" + tid);
    console.log("page=" + page);
    console.log("tiao=" + tiao);
    console.log("openid=" + app.openid);
    console.log("storeId=" + app.storeId);
    var that = this
    that.setData({
      isScrollTop: false
    });
    wx.showLoading({
      title: '更新中',
    })

    app.request('api/Product/StoreTypeSearchList', {
        page: page,
        pageSize: 8,
        typeId: tid,
        promotionId: 0,
        openid: app.openid,
        name: "",
        storeId: app.storeId
      }, "Post",
      function(res) {
        console.log("page=" + page);
        console.log("tid=" + tid);
        console.log("获取产品列表");
        console.log(res.data);
        console.log(that.data.saNuber);
        if (that.data.saNuber == tid){
          if (res.data.flag) {
            var scrollTop = 0;//当前距离
            var list = res.data.list;
            var Plist = that.data.PList;
            var pindex = 0;
            for (var p = 0; p < Plist.length; p++) {
              if (Plist[p].Id == tid) {
                pindex = p;
              }
            }
            console.log("pindex=" + pindex);
            console.log("得到产品列表");
            console.log(list);
            for (var i = 0; i < list.length; i++) {
              list[i].Price = list[i].Price.toFixed(2);
              list[i].OldPrice = list[i].OldPrice.toFixed(2);
              Plist[pindex].ProductList.push(list[i])
            }
            //赋值
            Plist[pindex].Page = page;
            console.log("赋值列表");
            console.log(Plist);
            //添加距离
            if (list.length < 8) {
              Plist[pindex].Isover = true;

              console.log("数据少");
              if (page == 1) {

                if (pindex == 0) {
                  console.log("第一个分类");
                  Plist[pindex].ScrollTop = list.length * 20;
                } else {
                  console.log("pindex=" + pindex);
                  console.log("原ScrollTop=" + Plist[pindex - 1].ScrollTop);
                  console.log("后面分类");

                  Plist[pindex].ScrollTop = Plist[pindex - 1].ScrollTop + list.length * 20;
                }
              } else {
               
                console.log("pindex=" + pindex);
                console.log("原ScrollTop=" + Plist[pindex].ScrollTop);
                if (list.length < 3) {
                  console.log("原jia=" + ((list.length * 20) + (page * 50)));
                  Plist[pindex].ScrollTop = Plist[pindex].ScrollTop + ((list.length * 20) + (page * 50));

                } else {
                  console.log("原jia=" + ((list.length * 20) + (page * 100)));
                  Plist[pindex].ScrollTop = Plist[pindex].ScrollTop + ((list.length * 20) + (page * 100));

                }
              }
              scrollTop = Plist[pindex].ScrollTop;

              console.log("现在ScrollTop=" + Plist[pindex].ScrollTop);
            } else {
              console.log("数据多");
              if (page == 1) {
                console.log("第一页");
                if (pindex == 0) {
                  console.log("第一个分类");
                  Plist[pindex].Isover = false;
                  Plist[pindex].ScrollTop = list.length;
                  console.log("ScrollTop=" + Plist[pindex].ScrollTop);
                } else {
                  console.log("第N个分类");
                  Plist[pindex].Isover = false;
                  console.log("原：" + Plist[pindex - 1].ScrollTop);
                  Plist[pindex].ScrollTop = Plist[pindex - 1].ScrollTop + list.length * 10;
                  console.log();
                  if (Plist[pindex - 1].ScrollTop > 0) {
                    if (Plist[pindex - 1].ScrollTop > 100) {
                      //判断是否跳转过来
                      if (tiao == 1) {
                        console.log("是跳转");
                        Plist[pindex].ScrollTop += 400
                      } else {
                        console.log("不是跳转");
                        Plist[pindex].ScrollTop += 600
                      }

                    }

                  }
                  console.log("现在N-ScrollTop=" + Plist[pindex].ScrollTop);
                }
              } else {
                console.log("同一个分类第" + page + "页");
                Plist[pindex].Isover = false;
                console.log("原：" + Plist[pindex].ScrollTop);
                console.log("jia：" + (list.length * 20));
                Plist[pindex].ScrollTop = Plist[pindex].ScrollTop + (list.length * 20);
                if (pindex > 0) {
                  console.log("aaa");
                  if (Plist[pindex - 1].ScrollTop > 0) {
                    console.log("bbbb");
                    Plist[pindex].ScrollTop += +((page * 150) - (page * 20))
                  } else {
                    console.log("cccc");
                    Plist[pindex].ScrollTop += +(page * 150)
                  }
                } else {
                  console.log("ddd");
                  Plist[pindex].ScrollTop += +(page * 150)
                }

                console.log("现在ScrollTop=" + Plist[pindex].ScrollTop);

              }


              scrollTop = Plist[pindex].ScrollTop;
            }
            console.log("最后=" + scrollTop);
            console.log(Plist);

            that.setData({
              scrollTop: scrollTop,
              islogin: true,
              saNuber: tid,
              msgejz: true,
              msgemy: true,
              IsRunt: true,
              PList: Plist,
              isScrollTop: true
            });
            //如果判断数据少加载下一个
            if (page == 1) {
              if (list.length < 8) {
                //判断总数据是否有8个
                var znuber = 0;
                for (var z = 0; z < Plist.length; z++) {

                  znuber += Plist[z].ProductList.length;
                }
                console.log("总个数=" + znuber);
                if (znuber<8){

                //下一个
                var xnuber = 0;//选择分类
                var TypeList = that.data.TypeList;
                for (var i = 0; i < TypeList.length; i++) {
                  if (TypeList[i].Id == tid) {
                    if (TypeList.length - 1 > i) {
                      xnuber = i + 1;
                    }

                  }
                }
                //判断是否下个分类
                console.log("判断是否下个分类");
                if (xnuber > 0) {
                  console.log("展示下个分类" + TypeList[xnuber].Id);
                  console.log("展示下个分类" + TypeList[xnuber].Name);
                  that.setData({
                    saNuber: TypeList[xnuber].Id
                  });

                  // //获取产品
                  that.getPctDataList(TypeList[xnuber].Id, 1, 0);
                }

                 }




              }

            }


            setTimeout(function () {
              wx.hideLoading()
            }, 1000)
            //判断是否跳转
            if (tiao == 1) {
              console.log("执行跳转");
              setTimeout(function () {
                that.setData({
                  toView: 'sit' + tid,
                });
              }, 2000)



            }


          } else {
            setTimeout(function () {
              wx.hideLoading()
            }, 1000)
            console.log("没有数据");
            //下一个
            var xnuber = 0;//选择分类
            var TypeList = that.data.TypeList;
            for (var i = 0; i < TypeList.length; i++) {
              if (TypeList[i].Id == tid) {
                if (TypeList.length - 1 > i) {
                  xnuber = i + 1;
                }

              }
            }
            //判断是否下个分类
            console.log("判断是否下个分类");
            console.log("xnuber=" + xnuber);
            if (xnuber > 0) {
              var Plist = that.data.PList;

              console.log(Plist);
              //判断是否隐藏分类
              if (page == 1) {
                TypeList[xnuber - 1].IsHidden = true;
                if (xnuber>1){
                  Plist[xnuber - 1].ScrollTop = Plist[xnuber - 2].ScrollTop;
                }
                
                that.setData({
                  TypeList: TypeList,
                  Plist: Plist
                });
              }
              console.log("隐藏当前分类展示下个分类");
              //判断下个数据是否有数据
             
              if (Plist[xnuber].Page == 0) {
                that.setData({
                  saNuber: TypeList[xnuber].Id,
                
                });
                // //获取产品
                that.getPctDataList(TypeList[xnuber].Id, 1, 0);
              } else {
                console.log("有数据");
                console.log("saNuber=" + Plist[xnuber].Id);
                that.setData({
                  saNuber: Plist[xnuber].Id,
                  isScrollTop: true,
                  scrollTop: Plist[xnuber].ScrollTop
                });
                console.log("isScrollTop=" + that.data.isScrollTop);
                console.log("赋值scrollTop=" + that.data.scrollTop);
              }

            } else {
              if (page > 1) {
                console.log("后面没有了，但要加载本分类");
                that.setData({
                  msgemy: false,
                  isScrollTop: true,  
                });
                // console.log("tid=" + tid);
                // var Plist = that.data.PList;
                // console.log(Plist);
                // for (var i = 0; i < Plist.length; i++) {
                //   if (Plist[i].Id == tid) {
                //     if (Plist.length - 1 == i) {
                //       that.setData({
                //         msgemy: false,
                //       });
                //     }
                //     console.log("saNuber=" + Plist[i].Id);

                //     that.setData({

                //       saNuber: Plist[i].Id,
                //       isScrollTop: true,
                //       scrollTop: Plist[i].ScrollTop
                //     });
                //   }
                // }

              }
            }







          }
        }
        

      },
      function() {
        wx.hideLoading()
        wx.showToast({
          title: '获取产品失败',
          icon: 'success',
          duration: 2000
        })
      })
  },


  //获取产品列表
  getAddPctDataList: function (tid, page) {
    var that = this
    console.log("追加");
    app.request('api/Product/SearchList', {
      page: page,
      pageSize: 8,
      typeId: tid,
      promotionId: 0,
      openid: app.openid,
      name: "",
      storeId: app.storeId

    }, "Post",
      function (res) {
        console.log("page=" + page);
        console.log("tid=" + tid);
        console.log("获取产品列表");
        console.log(res.data);
        if (res.data.flag) {
          var list = res.data.list;
          var Plist = that.data.PList;
          var pindex = 0;
          for (var p = 0; p < Plist.length; p++) {
            if (Plist[p].Id == tid) {
              pindex = p;
            }
          }
          console.log("pindex=" + pindex);
          for (var i = 0; i < list.length; i++) {
            Plist[pindex].ProductList.push(list[i])
          }
          if (list.length < 8) {
            Plist[pindex].Isover = true;
          }
          console.log(Plist);
          Plist[pindex].Page = page;
          that.setData({
            islogin: true,
            saNuber: tid,
            msgejz: true,
            msgemy: true,
            IsRunt: true,
            PList: Plist
          });


          console.log("333");
          console.log(that.data.CateItemsList);
          setTimeout(function () {
            wx.hideLoading()
          }, 200)




        } else {
          console.log("没有数据");
          var PList = that.data.PList
          var index = -1;
          console.log("saNuber=" + that.data.saNuber);
          for (var i = 0; i < PList.length; i++) {
            if (PList[i].Id == that.data.saNuber) {
              if (PList[i].Isover) {
                if (i < PList.length - 1) {
                  index = i + 1;
                } else {
                  index = -2;
                }
              } else {
                index = i;
              }
            }
          }

          if (index == -2) {
            that.setData({
              msgejz: true,
              msgemy: false,
            });
            setTimeout(function () {
              wx.hideLoading()
            }, 200)
          } else {
            console.log("$$$$$$$$");
            console.log(PList);
            console.log(PList.length);
            console.log(index);
            PList[index].Isover = true;
            that.setData({
              PList: PList
            });

            // //获取产品
            that.getPctDataList(PList[index].Id, 1,0);

          }

          //判断是否选手分类
          if (page == 1) {
            var tnbu=0;
            var typelist = that.data.TypeList
            console.log("tid=" + tid);
            for (var t = 0; t < typelist.length; t++) {
              if (typelist[t].Id == tid) {
                typelist[t].IsHidden = true;
                if (t == typelist.length-1){
                  tnbu=t-1;
                }
              }
            }
            that.setData({
              TypeList: typelist
            });
            console.log("分类后数据");
            console.log(that.data.TypeList);
            console.log("tnbu=" + tnbu);
            //后面没有数据了加载前一个分类
            if (tnbu>0){
              that.setData({
                saNuber: TypeList[tnbu].Id
              });

            }


          }


        }

      },
      function () {
        wx.hideLoading()
        wx.showToast({
          title: '获取产品失败',
          icon: 'success',
          duration: 2000
        })
      })
  },


  //点击收藏
  onColikSC: function(e) {
    var that = this
    var isc = e.currentTarget.dataset.isc;
    var pid = e.currentTarget.dataset.pid;
    if (isc) {
      console.log("不收藏");
      app.request('api/Collect?pid=' + pid + '&openid=' + app.openid, {}, "DELETE",
        function(res) {
          console.log(res);
          if (res.data.flag) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            var PList = that.data.PList;
            for (var i = 0; i < PList.length; i++) {
              var ProductList = PList[i].ProductList;
              for (var t = 0; t < ProductList.length; t++) {
                if (ProductList[t].Id == pid) {
                  ProductList[t].IsCollect = false;
                }
              }
            }
            that.setData({
              PList: PList
            });

          } else {
            wx.showToast({
              title: '失败',
              icon: 'success',
              duration: 2000
            })
          }
        },
        function() {
          wx.showToast({
            title: '删除收藏产品失败',
            icon: 'success',
            duration: 2000
          })
        })


    } else {
      console.log("收藏");
      app.request('api/Collect', {
          pid: pid,
          openid: app.openid
        }, "POST",
        function(res) {
          console.log(res);
          if (res.data.flag) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            var PList = that.data.PList;
            for (var i = 0; i < PList.length; i++) {
              var ProductList = PList[i].ProductList;
              for (var t = 0; t < ProductList.length; t++) {
                if (ProductList[t].Id == pid) {
                  ProductList[t].IsCollect = true;
                }
              }
            }
            that.setData({
              PList: PList
            });

          } else {
            wx.showToast({
              title: '失败',
              icon: 'success',
              duration: 2000
            })
          }


        },
        function() {
          wx.showToast({
            title: '收藏产品失败',
            icon: 'success',
            duration: 2000
          })
        })
    }

  },
  //加入购物车
  joinCart: function(e) {
    var that = this
    console.log("加入购物车");
    var pid = e.currentTarget.dataset.id;
    var isb = e.currentTarget.dataset.isb;
    if (isb){
      var uit = e.currentTarget.dataset.uit;

      app.request('api/Product/GetInventory?id=' + uit, {}, "GET",
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
              unitid: uit,
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
        },
        function (res) {


        })

    }
    


  },
  productDeil: function(e) {
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
  cart_show: function() {
    var that = this
    console.log("跳转购物车");
    wx.switchTab({
      url: '/pages/shop_list/shop_cart/shop_cart'
    })

    console.log("----zdh  ---nuber:"+that.nuber);
    wx.setTabBarBadge({
      index: 2,
      text: that.data.nuber.toString()
    })
  },


})
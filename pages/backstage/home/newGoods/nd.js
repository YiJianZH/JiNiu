const app = getApp()
// pages/wx-cropper/index.js
// 手机的宽度
var windowWRPX = 750
// 拖动时候的 pageX
var pageX = 0
// 拖动时候的 pageY
var pageY = 0

var pixelRatio = wx.getSystemInfoSync().pixelRatio

// 调整大小时候的 pageX
var sizeConfPageX = 0
// 调整大小时候的 pageY
var sizeConfPageY = 0

var initDragCutW = 0
var initDragCutL = 0
var initDragCutH = 0
var initDragCutT = 0

// 移动时 手势位移与 实际元素位移的比
var dragScaleP = 2
Page({
  data: {
    Onetext: "", //选择一级
    Oneid: 0, //选择一级
    goods_primary: [], //一级
    Twotext: "", //选择二级
    Twoid: 0, //选择二级
    goods_second: [], //二级
    Threetext: "", //选择三级
    Threeid: 0, //选择三级
    goods_third: [], //三级
    ProductPic: {},
    SlidePicList: [],
    SlidePicIndex: 0,
    GoodsSizeList: [],
    GoodsSizeIndex: 0,
    date: '',
    select_sh: false,
    storeName: "",
    storeId: 0,
    title: "", //标题
    deputy: "", //副标题
    picture: "", //轮播图
    isAdd: true,
    imgeidx: 0,
    uidtName: "", //规格值
    price: 0, //价格
    inPrice: 0, //进价
    inventory: 0, //库存
    safeStock: 0, //安全库存
    restNuber:0,//批发起始量
    isPublish: true,
    isRestaurant: false,
    imageFixed: false, //裁剪浮层
    imageSrc: '', //要裁剪的图片
    inageNuber: 0, //类型1轮播 2产品
    returnImage: '',
    isShowImg: false,
    // 初始化的宽高
    cropperInitW: windowWRPX,
    cropperInitH: windowWRPX,
    // 动态的宽高
    cropperW: windowWRPX,
    cropperH: windowWRPX,
    // 动态的left top值
    cropperL: 0,
    cropperT: 0,

    // 图片缩放值
    scaleP: 0,
    imageW: 0,
    imageH: 0,

    // 裁剪框 宽高
    cutW: 400,
    cutH: 400,
    cutL: 0,
    cutT: 0,
  },
  onLoad: function() {
    var that = this;
    that.setData({
      storeName: app.HomeStore.Name,
      storeId: app.HomeStore.Id,
    });
    that.GetOneList();
  },
  setTitle: function(e) {
    console.log(e);
    this.setData({
      title: e.detail.value
    });
  },
  setDeputy: function(e) {
    console.log(e);
    this.setData({
      deputy: e.detail.value
    });
  },
  setRestNuber: function (e) {
    console.log(e);
    this.setData({
      restNuber: e.detail.value
    });
  },

  SetSelectSh: function() {
    var that = this;
    that.setData({
      select_sh: !that.data.select_sh
    })
  },
  bindPickerChange: function(e) {
    console.log(e);
    var index = e.detail.value;
    var entity = this.data.goods_primary[index];
    this.setData({
      Onetext: entity.Name, //选择一级
      Oneid: entity.Id, //选择一级
    });
    this.GetTwoList(entity.Id);

  },
  twoPickerChange: function(e) {
    console.log(e);
    var index = e.detail.value;
    var entity = this.data.goods_second[index];
    this.setData({
      Twotext: entity.Name, //选择一级
      Twoid: entity.Id, //选择一级
    });
    this.GetThreeList(entity.Id);
  },
  threePickerChange: function(e) {
    console.log(e);
    var index = e.detail.value;
    var entity = this.data.goods_third[index];
    this.setData({
      Threetext: entity.Name, //选择一级
      Threeid: entity.Id, //选择一级
    });
  },
  //获取一级
  GetOneList: function() {
    var that = this;
    app.request('api/Category/GetCategoryList?pid=0&page=1&typeid=0', {}, "GET",
      function(res) {
        console.log("一级分类");
        console.log(res);
        if (res.data.flag) {
          var oneList = res.data.list;
          that.setData({
            Onetext: oneList[0].Name, //选择一级
            Oneid: oneList[0].Id, //选择一级
            goods_primary: oneList
          });
          that.GetTwoList(oneList[0].Id);
        }else{
          that.setData({
            Onetext:"", //选择一级
            Oneid:0, //选择一级
            goods_primary: []
          });
          that.GetTwoList(0);
        }
      },
      function() {
        wx.showToast({
          title: '获取分类错误',
          icon: 'loading',
          duration: 2000
        });
      }
    )
  },
  //获取二级
  GetTwoList: function(pid) {
    var that = this;
    app.request('api/Category/GetCategoryList?pid=' + pid + '&page=1&typeid=0', {}, "GET",
      function(res) {
        console.log("二级分类");
        console.log(res);
        if (res.data.flag) {
          var twoList = res.data.list;
          that.setData({
            Twotext: twoList[0].Name, //选择二级
            Twoid: twoList[0].Id, //选择二级
            goods_second: twoList
          });
          that.GetThreeList(twoList[0].Id);

        }else{
          that.setData({
            Twotext: "", //选择二级
            Twoid:0, //选择二级
            goods_second: []
          });
          that.GetThreeList(0);
        }
      },
      function() {
        wx.showToast({
          title: '获取分类错误',
          icon: 'loading',
          duration: 2000
        });
      }
    )
  },
  //获取三级
  GetThreeList: function(pid) {
    var that = this;
    app.request('api/Category/GetCategoryList?pid=' + pid + '&page=1&typeid=0', {}, "GET",
      function(res) {
        console.log("三级分类");
        console.log(res);
        if (res.data.flag) {
          var threeList = res.data.list;
          that.setData({
            Threetext: threeList[0].Name, //选择三级
            Threeid: threeList[0].Id, //选择三级
            goods_third: threeList
          });

        }else{
          that.setData({
            Threetext: "", //选择三级
            Threeid: 0, //选择三级
            goods_third: []
          });
        }
      },
      function() {
        wx.showToast({
          title: '获取分类错误',
          icon: 'loading',
          duration: 2000
        });
      }
    )
  },

  // 添加商品图片
  // 点击添加
  AddProductPic: function() {
    var that = this;
    var list = that.data.ProductPic;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;

        console.log('shangchuan:' + tempFilePaths)

        that.setData({
          imageFixed: true,
          imageSrc: tempFilePaths.join(),
          inageNuber: 2,
        })
        console.log('imageSrc:' + tempFilePaths.join())
        wx.getImageInfo({
          src: that.data.imageSrc,
          success: function success(res) {
            console.log(res);
            var width = res.width;
            var height = res.height;

            console.log('width' + res.width)
            console.log('height' + res.height)
            var innerAspectRadio = res.width / res.height;
            if (innerAspectRadio<1) {
               width = width/2;
               height = height/2;
            }
            
            console.log('bili' + innerAspectRadio)
            
            // 根据图片的宽高显示不同的效果   保证图片可以正常显示
            if (innerAspectRadio == '1') {
              console.log('zhengfangxingtu')
              that.setData({
                imageFixed: false,
              })

              that.setData({
                headImg: tempFilePaths.join()
              })


             } else if (innerAspectRadio > 1) {
              that.setData({
                cropperW: windowWRPX,
                cropperH: windowWRPX / innerAspectRadio,
                // 初始化left right
                cropperL: Math.ceil((windowWRPX - windowWRPX) / 2),
                cropperT: Math.ceil((windowWRPX - windowWRPX / innerAspectRadio) / 2),
                // 裁剪框  宽高 
                // cutW: windowWRPX - 200,
                // cutH: windowWRPX / innerAspectRadio - 200,
                cutL: Math.ceil((windowWRPX - windowWRPX + 340) / 2),
                cutT: Math.ceil((windowWRPX / innerAspectRadio - (windowWRPX / innerAspectRadio - 20)) / 2),
                // 图片缩放值
                scaleP: width * pixelRatio / windowWRPX,
                // 图片原始宽度 rpx
                imageW: width * pixelRatio,
                imageH: height * pixelRatio
              })
            } else {


              console.log("宽高");
              console.log(windowWRPX * innerAspectRadio);
              that.setData({
                cropperW: windowWRPX * innerAspectRadio,
                cropperH: windowWRPX,
                // 初始化left right
                cropperL: Math.ceil((windowWRPX - windowWRPX * innerAspectRadio) / 2),
                cropperT: Math.ceil((windowWRPX - windowWRPX) / 2),
                // 裁剪框的宽高
                // cutW: windowWRPX * innerAspectRadio-66,
                // cutH: 400,
                cutL: Math.ceil((windowWRPX * innerAspectRadio - (windowWRPX * innerAspectRadio - 20)) / 2),
                cutT: Math.ceil((windowWRPX - 340) / 2),
                // 图片缩放值
                scaleP: width * pixelRatio / windowWRPX,
                // 图片原始宽度 rpx
                imageW: width * pixelRatio,
                imageH: height * pixelRatio
              })

             
            }
            console.log("cropperW=" + that.data.cropperW);
            console.log("cropperH=" + that.data.cropperH);
            console.log("cropperL=" + that.data.cropperL);
            console.log("cropperT=" + that.data.cropperT);
            console.log("cutW=" + that.data.cutW);
            console.log("cutH=" + that.data.cutH);
            console.log("cutL=" + that.data.cutL);
            console.log("cutT=" + that.data.cutT);
            console.log("scaleP=" + that.data.scaleP);
            console.log("imageW=" + that.data.imageW);
            console.log("imageH=" + that.data.imageH);
            console.log("pixelRatio=" + pixelRatio);
            console.log("完成");
            console.log("headImg=" + that.data.headImg);


            that.setData({
              isShowImg: true
            })
            wx.hideLoading()
          }
        })
      }
    })
  },


  // 添加轮播图片
  // 点击添加
  AddSlidePic: function() {
    console.log("添加轮播图");
    var that = this;
    var list = that.data.SlidePicList;
    var index = that.data.SlidePicIndex;
    if (list.length >= 3) return;
    index++;
    that.setData({
      SlidePicIndex: index
    })
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        console.log('shangchuan:' + tempFilePaths)
        that.setData({
          imageFixed: true,
          imageSrc: tempFilePaths.join(),
          inageNuber: 1,
          isAdd: true
        })
        wx.getImageInfo({
          src: that.data.imageSrc,
          success: function success(res) {
            var innerAspectRadio = res.width / res.height;
            console.log('bili' + innerAspectRadio)
            // 根据图片的宽高显示不同的效果   保证图片可以正常显示
            if (innerAspectRadio == '1') {
              console.log('zhengfangxingtu')
              that.setData({
                imageFixed: false,
              })

              that.setData({
                headImg: tempFilePaths.join()
              })


            } else if (innerAspectRadio > 1) {
              that.setData({
                cropperW: windowWRPX,
                cropperH: windowWRPX / innerAspectRadio,
                // 初始化left right
                cropperL: Math.ceil((windowWRPX - windowWRPX) / 2),
                cropperT: Math.ceil((windowWRPX - windowWRPX / innerAspectRadio) / 2),
                // 裁剪框  宽高 
                // cutW: windowWRPX - 200,
                // cutH: windowWRPX / innerAspectRadio - 200,
                cutL: Math.ceil((windowWRPX - windowWRPX + 340) / 2),
                cutT: Math.ceil((windowWRPX / innerAspectRadio - (windowWRPX / innerAspectRadio - 20)) / 2),
                // 图片缩放值
                scaleP: res.width * pixelRatio / windowWRPX,
                // 图片原始宽度 rpx
                imageW: res.width * pixelRatio,
                imageH: res.height * pixelRatio
              })
            } else {
              that.setData({
                cropperW: windowWRPX * innerAspectRadio,
                cropperH: windowWRPX,
                // 初始化left right
                cropperL: Math.ceil((windowWRPX - windowWRPX * innerAspectRadio) / 2),
                cropperT: Math.ceil((windowWRPX - windowWRPX) / 2),
                // 裁剪框的宽高
                // cutW: windowWRPX * innerAspectRadio - 66,
                // cutH: 400,
                cutL: Math.ceil((windowWRPX * innerAspectRadio - (windowWRPX * innerAspectRadio - 20)) / 2),
                cutT: Math.ceil((windowWRPX - 340) / 2),
                // 图片缩放值
                scaleP: res.width * pixelRatio / windowWRPX,
                // 图片原始宽度 rpx
                imageW: res.width * pixelRatio,
                imageH: res.height * pixelRatio
              })
            }
            that.setData({
              isShowImg: true
            })
            wx.hideLoading()
          }
        })
      }
    })
  },
  // 点击更新替换轮播图片
  UpdateSlidePic: function(e) {
    console.log("修改轮播图");
    var that = this;
    var list = that.data.SlidePicList;
    var id = e.currentTarget.dataset.id;
    var index = that.data.SlidePicIndex;
    index++;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        console.log('shangchuan:' + tempFilePaths)
        that.setData({
          imageFixed: true,
          imageSrc: tempFilePaths.join(),
          inageNuber: 1,
          isAdd: false,
          imgeidx: e.currentTarget.dataset.id
        })
        wx.getImageInfo({
          src: that.data.imageSrc,
          success: function success(res) {
            var innerAspectRadio = res.width / res.height;
            console.log('bili' + innerAspectRadio)
            // 根据图片的宽高显示不同的效果   保证图片可以正常显示
            if (innerAspectRadio == '1') {
              console.log('zhengfangxingtu')
              that.setData({
                imageFixed: false,
              })

              that.setData({
                headImg: tempFilePaths.join()
              })


            } else if (innerAspectRadio > 1) {
              that.setData({
                cropperW: windowWRPX,
                cropperH: windowWRPX / innerAspectRadio,
                // 初始化left right
                cropperL: Math.ceil((windowWRPX - windowWRPX) / 2),
                cropperT: Math.ceil((windowWRPX - windowWRPX / innerAspectRadio) / 2),
                // 裁剪框  宽高 
                // cutW: windowWRPX - 200,
                // cutH: windowWRPX / innerAspectRadio - 200,
                cutL: Math.ceil((windowWRPX - windowWRPX + 340) / 2),
                cutT: Math.ceil((windowWRPX / innerAspectRadio - (windowWRPX / innerAspectRadio - 20)) / 2),
                // 图片缩放值
                scaleP: res.width * pixelRatio / windowWRPX,
                // 图片原始宽度 rpx
                imageW: res.width * pixelRatio,
                imageH: res.height * pixelRatio
              })
            } else {
              that.setData({
                cropperW: windowWRPX * innerAspectRadio,
                cropperH: windowWRPX,
                // 初始化left right
                cropperL: Math.ceil((windowWRPX - windowWRPX * innerAspectRadio) / 2),
                cropperT: Math.ceil((windowWRPX - windowWRPX) / 2),
                // 裁剪框的宽高
                // cutW: windowWRPX * innerAspectRadio - 66,
                // cutH: 400,
                cutL: Math.ceil((windowWRPX * innerAspectRadio - (windowWRPX * innerAspectRadio - 20)) / 2),
                cutT: Math.ceil((windowWRPX - 340) / 2),
                // 图片缩放值
                scaleP: res.width * pixelRatio / windowWRPX,
                // 图片原始宽度 rpx
                imageW: res.width * pixelRatio,
                imageH: res.height * pixelRatio
              })
            }
            that.setData({
              isShowImg: true
            })
            wx.hideLoading()
          }
        })

      }
    })
  },

  // 添加规格
  // 新增
  AddPics: function() {
    var that = this;
    var list = that.data.GoodsSizeList;
    var index = that.data.GoodsSizeIndex;
    index++;
    that.setData({
      GoodsSizeIndex: index
    })
    list.push({
      id: index,
      pic: ""
    })
    that.setData({
      GoodsSizeList: list
    })
  },
  setUidtName: function(e) {
    this.setData({
      uidtName: e.detail.value
    });
  },
  setPrice: function(e) {
    this.setData({
      price: e.detail.value
    });
  },
  setInPrice: function(e) {
    this.setData({
      inPrice: e.detail.value
    });
  },
  setInventory: function(e) {
    this.setData({
      inventory: e.detail.value
    });
  },
  setSafeStock: function(e) {
    this.setData({
      safeStock: e.detail.value
    });
  },
  switch1Change: function(e) {
    console.log(e)
    if (e.detail.value) {
      this.setData({
        isPublish: true
      });
    } else {
      this.setData({
        isPublish: false
      });
    }
  },
  switchPf: function (e) {
    console.log(e)
    if (e.detail.value) {
      this.setData({
        isRestaurant: true
      });
    } else {
      this.setData({
        isRestaurant: false
      });
    }
  },
  OnlicSave: function() {
    var that = this;
    console.log("保存");
    var storeId = that.data.storeId;
    var title = that.data.title;
    if (title.length == 0) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var deputy = that.data.deputy;
    if (deputy.length == 0) {
      wx.showToast({
        title: '请输入副标题',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    //判断三级和二级是否==0
    var typeId = that.data.Threeid;
    if (typeId==0){
      typeId = that.data.Twoid;
    }


    if (typeId == 0) {
      wx.showToast({
        title: '请选择二级或三级分类',
        icon: 'none',
        duration: 2000
      });
      return false;
    }


    var picture = "";
    var SlidePicList = that.data.SlidePicList;
    if (SlidePicList.length == 0) {
      wx.showToast({
        title: '请上传轮播图',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var cover = 0;
    for (var i = 0; i < SlidePicList.length; i++) {
      if (picture == "") {
        picture += SlidePicList[i].pid;
        cover = SlidePicList[i].pid;
      } else {
        picture += "," + SlidePicList[i].pid;
      }
    }

    var pictureId = that.data.ProductPic.pid;
    if (pictureId == 0) {
      wx.showToast({
        title: '请上规格图片',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var uidtName = that.data.uidtName;
    if (uidtName.length == 0) {
      wx.showToast({
        title: '请输入规格值',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var price = that.data.price;
    if (price.length == 0) {
      wx.showToast({
        title: '请输入价格',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var inPrice = that.data.inPrice;
    var inventory = that.data.inventory;
    if (inventory.length == 0) {
      wx.showToast({
        title: '请输入库存',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var safeStock = that.data.safeStock;
    console.log("safeStock=" + safeStock);
    var isPublish = that.data.isPublish;

    var isRestaurant = that.data.isRestaurant;
    var restNuber = that.data.restNuber;
    if (isRestaurant){
      if (restNuber <= 0) {
        wx.showToast({
          title: '请输入批发起始量',
          icon: 'none',
          duration: 2000
        });
        return false;
      }

    }


    ///新增产品接口
    app.request("api/Product/AddNewProduct", {
      MarketId: 0,
      StoreId: storeId,
      Title: title,
      Cover: cover,
      Deputy: deputy,
      IsPublish: isPublish,
      Picture: picture,
      TypeId: typeId,
      UidtName: uidtName,
      Price: price,
      InPrice: inPrice,
      Inventory: inventory,
      SafeStock: safeStock,
      PictureId: pictureId,
      IsRestaurant: isRestaurant,
      RestNuber: restNuber,
      Id: 0
    }, 'POST', function(res) {
      console.log("添加");
      console.log(res);
      if (res.data.flag) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        });
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)

      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        });
      }

    }, function(tes) {
      console.log("接口错误");
    });


  },
  // 拖动时候触发的touchStart事件
  contentStartMove(e) {
    pageX = e.touches[0].pageX
    pageY = e.touches[0].pageY
  },

  // 拖动时候触发的touchMove事件
  contentMoveing(e) {
    var _this = this
    var dragLengthX = (pageX - e.touches[0].pageX) * dragScaleP
    var dragLengthY = (pageY - e.touches[0].pageY) * dragScaleP
    var minX = Math.max(_this.data.cutL - (dragLengthX), 0)
    var minY = Math.max(_this.data.cutT - (dragLengthY), 0)
    var maxX = _this.data.cropperW - _this.data.cutW
    var maxY = _this.data.cropperH - _this.data.cutH
    this.setData({
      cutL: Math.min(maxX, minX),
      cutT: Math.min(maxY, minY),
    })
    console.log(`${maxX} ----- ${minX}`)
    pageX = e.touches[0].pageX
    pageY = e.touches[0].pageY
  },

  // 获取图片
  getImageInfo() {
    var _this = this
    console.log('shengcheng:' + _this.data.imageSrc)
    wx.showLoading({
      title: '图片生成中...',
    })

    // 将图片写入画布             
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.drawImage(_this.data.imageSrc)
    ctx.draw(true, () => {
      var canvasW = (_this.data.cutW / _this.data.cropperW) * (_this.data.imageW / pixelRatio)
      var canvasH = (_this.data.cutH / _this.data.cropperH) * (_this.data.imageH / pixelRatio)
      var canvasL = (_this.data.cutL / _this.data.cropperW) * (_this.data.imageW / pixelRatio)
      var canvasT = (_this.data.cutT / _this.data.cropperH) * (_this.data.imageH / pixelRatio)
      console.log(`canvasW:${canvasW} --- canvasH: ${canvasH} --- canvasL: ${canvasL} --- canvasT: ${canvasT} -------- _this.data.imageW: ${_this.data.imageW}  ------- _this.data.imageH: ${_this.data.imageH} ---- pixelRatio ${pixelRatio}`)
      wx.canvasToTempFilePath({
        x: canvasL,
        y: canvasT,
        width: canvasW,
        height: canvasH,
        destWidth: canvasW,
        destHeight: canvasH,
        canvasId: 'myCanvas',
        success: function(res) {
          wx.hideLoading()
          // 成功获得地址的地方
          console.log('end:' + res.tempFilePath)
          // 判断时上传头像还是二维码
          _this.setData({
            imageFixed: false,
          })
          console.log("获取图片");
          // _this.setData({
          //   headImg: res.tempFilePath
          // })

          if (_this.data.inageNuber == 1) {
            //轮播
            if (_this.data.isAdd) {
              //新增
              var list = _this.data.SlidePicList;
              var index = _this.data.SlidePicIndex;
              if (list.length >= 3) return;
              index++;
              _this.setData({
                SlidePicIndex: index
              })
              wx.uploadFile({
                url: app.name + 'api/Banner/UploadPicture',
                filePath: res.tempFilePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: function(res1) {
                  var res2 = JSON.parse(res1.data)
                  console.log(res2);
                  if (res2.success) {
                    list.push({
                      id: index,
                      pid: res2.pictureId,
                      pic: res2.imageUrl
                    })
                    _this.setData({
                      SlidePicList: list
                    })
                  } else {
                    wx.showToast({
                      title: '上传失败',
                      icon: 'fail',
                      duration: 2000
                    })

                  }

                }
              })


            } else {
              //修改
              var list = _this.data.SlidePicList;
              var imgeidx = _this.data.imgeidx;
              var index = _this.data.SlidePicIndex;
              index++;
              wx.uploadFile({
                url: app.name + 'api/Banner/UploadPicture',
                filePath: res.tempFilePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: function(res1) {
                  var res2 = JSON.parse(res1.data)
                  console.log(res2);
                  if (res2.success) {

                    for (var i = 0; i < list.length; i++) {
                      if (list[i].id == imgeidx) {
                        list[i].pid = res2.pictureId;
                        list[i].pic = res2.imageUrl;
                      }
                    }
                    _this.setData({
                      SlidePicList: list
                    })
                  } else {
                    wx.showToast({
                      title: '上传失败',
                      icon: 'fail',
                      duration: 2000
                    })

                  }

                }
              })

            }

          } else {
            var list = _this.data.ProductPic;
            //产品
            wx.uploadFile({
              url: app.name + 'api/Banner/UploadPicture',
              filePath: res.tempFilePath,
              name: 'file',
              header: {
                "Content-Type": "multipart/form-data"
              },
              success: function(res1) {
                var res2 = JSON.parse(res1.data)
                console.log(res2);
                if (res2.success) {
                  list = {
                    pid: res2.pictureId,
                    pic: res2.imageUrl
                  }
                  _this.setData({
                    ProductPic: list
                  })
                } else {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'fail',
                    duration: 2000
                  })

                }

              }
            })

          }



        }
      })
    })
  },


  // 设置大小的时候触发的touchStart事件
  dragStart(e) {
    var _this = this
    sizeConfPageX = e.touches[0].pageX
    sizeConfPageY = e.touches[0].pageY
    initDragCutW = _this.data.cutW
    initDragCutL = _this.data.cutL
    initDragCutT = _this.data.cutT
    initDragCutH = _this.data.cutH
  },

  // 设置大小的时候触发的touchMove事件
  dragMove(e) {
    var _this = this
    var dragType = e.target.dataset.drag
    switch (dragType) {
      case 'right':
        var dragLength = (sizeConfPageX - e.touches[0].pageX) * dragScaleP
        if (initDragCutW >= dragLength) {
          // 如果 移动小于0 说明是在往下啦  放大裁剪的高度  这样一来 图片的高度  最大 等于 图片的top值加 当前图片的高度  否则就说明超出界限
          if (dragLength < 0 && _this.data.cropperW > initDragCutL + _this.data.cutW) {
            this.setData({
              cutW: initDragCutW - dragLength
            })
          }
          // 如果是移动 大于0  说明在缩小  只需要缩小的距离小于原本裁剪的高度就ok
          if (dragLength > 0) {
            this.setData({
              cutW: initDragCutW - dragLength
            })
          } else {
            return
          }
        } else {
          return
        }
        break;
      case 'left':
        var dragLength = (dragLength = sizeConfPageX - e.touches[0].pageX) * dragScaleP
        console.log(dragLength)
        if (initDragCutW >= dragLength && initDragCutL > dragLength) {
          if (dragLength < 0 && Math.abs(dragLength) >= initDragCutW) return
          this.setData({
            cutL: initDragCutL - dragLength,
            cutW: initDragCutW + dragLength
          })
        } else {
          return;
        }
        break;
      case 'top':
        var dragLength = (sizeConfPageY - e.touches[0].pageY) * dragScaleP
        if (initDragCutH >= dragLength && initDragCutT > dragLength) {
          if (dragLength < 0 && Math.abs(dragLength) >= initDragCutH) return
          this.setData({
            cutT: initDragCutT - dragLength,
            cutH: initDragCutH + dragLength
          })
        } else {
          return;
        }
        break;
      case 'bottom':
        var dragLength = (sizeConfPageY - e.touches[0].pageY) * dragScaleP
        // console.log(_this.data.cropperH > _this.data.cutT + _this.data.cutH)
        console.log(dragLength)
        console.log(initDragCutH >= dragLength)
        console.log(_this.data.cropperH > initDragCutT + _this.data.cutH)
        // 必须是 dragLength 向上缩小的时候必须小于原本的高度
        if (initDragCutH >= dragLength) {
          // 如果 移动小于0 说明是在往下啦  放大裁剪的高度  这样一来 图片的高度  最大 等于 图片的top值加 当前图片的高度  否则就说明超出界限
          if (dragLength < 0 && _this.data.cropperH > initDragCutT + _this.data.cutH) {
            this.setData({
              cutH: initDragCutH - dragLength
            })
          }
          // 如果是移动 大于0  说明在缩小  只需要缩小的距离小于原本裁剪的高度就ok
          if (dragLength > 0) {
            this.setData({
              cutH: initDragCutH - dragLength
            })
          } else {
            return
          }
        } else {
          return
        }
        break;
      case 'rightBottom':
        var dragLengthX = (sizeConfPageX - e.touches[0].pageX) * dragScaleP
        var dragLengthY = (sizeConfPageY - e.touches[0].pageY) * dragScaleP
        if (initDragCutH >= dragLengthY && initDragCutW >= dragLengthX) {
          // bottom 方向的变化
          if ((dragLengthY < 0 && _this.data.cropperH > initDragCutT + _this.data.cutH) || (dragLengthY > 0)) {
            this.setData({
              cutH: initDragCutH - dragLengthY
            })
          }

          // right 方向的变化
          if ((dragLengthX < 0 && _this.data.cropperW > initDragCutL + _this.data.cutW) || (dragLengthX > 0)) {
            this.setData({
              cutW: initDragCutW - dragLengthX
            })
          } else {
            return
          }
        } else {
          return
        }
        break;
      default:
        break;
    }
  },




})
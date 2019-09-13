//shop_cart.js
//获取应用实例
const app = getApp()

Page({
  data: {
    islogin:true,
    appUserType: 1,
    isThis: 0,
    ispicker: true,
    DiscountMoney: 0, //折扣优惠金额
    IsRestaurant: false,
    SDText: "",
    PFPStartTime: "", //现在下单时间
    PFPEndTime: "", //现在送达时间
    PFPStartTime2: "", //第二天下单时间
    PFPEndTime2: "", //第二天送达时间
    PEndTime: 0,
    PStartTime: 0,
    PEndTime2: 0,
    PStartTime2: 0,
    DeliveryText: "预约时间",
    startDate: "",
    endDate: "",
    sidStr: "",
    SelfShop: "",
    MarketName: "",
    MarketPhone: "",
    IsStoreBusiness: false,
    StoreBusiness: true, //店铺是否打烊
    Onclick: true,
    OnclickTJ: true,
    pstypeid: 0,
    ContenLlist: [],
    flag: true,
    payType: true,
    magess: true,
    IsPublish: true, //是否有下架产品
    flag1: true,
    IsStock: true, //判断
    TextST: "", //备注
    Conat: 0,
    paytype: 0,
    OrderNo: "",
    newOrderId: "",
    orderId: '0',
    AddressId: 0, //地址编号
    back_img: "/images/xd_back.png",
    Distribution: {
      id: 1,
      name: "立即配送"
    },
    Payment: {
      id: 1,
      name: "在线支付"
    },
    AmountPayable: 0.00, //应付金额
    PreferentialAmount: 0.00, //优惠金useCoupon额
    PreferentialId: null, //优惠编号
    PreferentialBool: false,
    DistributionCost: 0.00, //配送金额
    MinPs: 0, //最低配送费
    PSJE: 0.00,
    PSYS: true,
    YJPayable: 0, //佣金金额
    YEPayable: 0, //余额金额
    payTypeYJ: true,
    payTypeYE: false,
    IsPay: false,
    IsbT3: false,
    distance: 0,
    Detail: [],
    selectCoupon: [], //选择的优惠券
    couponMoney: 0, //优惠券合计金额
    subOrderDate: "请选择预约日期",
    OrderTimeStr: "07:00",
    otiem1: "07:00",
    otiem2: "20:00",
    index: 0,
    tc_li: [{
        id: 1,
        li_b: "立即配送",
        li_img: "/images/cart_b.png"
      },
      {
        id: 2,
        li_b: "预约配送",
        li_img: "/images/cart_a.png"
      },
      {
        id: 3,
        li_b: "门店自提",
        li_img: "/images/cart_a.png"
      },
      {
        id: 4,
        li_b: "免费配送",
        li_img: "/images/cart_a.png"
      },

    ],
    tc_lia: [{
      id: 2,
      zf_zx: "/images/xd_ye.png",
      info_text: "余额",
      tc_img: "/images/cart_b.png"
    }],

    dt_index: [0, 0, 0],
    dt_array: [
      ['今天', '明天', '后天'],
      ['10点', '15点', '18点'],
      ['00分', '10分', '20分', '30分', '40分', '50分']
    ],

    dayPt: [0, 0],
    dayPtArray: [
      ['今天', '明天'],
      ['上午09:00点前送达', '下午16:30前送达']
    ]
  },

  one: function(e) {
    console.log(e)
    var that = this;
    if (this.data.isThis === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        isThis: e.currentTarget.dataset.current
      })
    }
  },
  //时间选择方法
  bindMultiPickerColumnChange: function(e) {
    var that = this
    console.log("*********");
    console.log(e);
    var column = e.detail.column;
    var now = new Date();
    console.log("now=" + now);
    var hours = now.getHours();
    var minutes = now.getMinutes() + 30;
    //天
    if (column == 0) {
      var dayindex = e.detail.value;
      console.log("dayindex=" + dayindex);
      console.log("PEndTime=" + that.data.PEndTime);
      console.log("PStartTime=" + that.data.PStartTime);
      console.log("PEndTime2=" + that.data.PEndTime2);
      console.log("PStartTime2=" + that.data.PStartTime2);
      var PEndTime = that.data.PEndTime;
      var PStartTime = that.data.PStartTime;
      var PEndTime2 = that.data.PEndTime2;
      var PStartTime2 = that.data.PStartTime2;
      var timlist = that.data.dt_array;
      var dt_index = that.data.dt_index;
      var trylist = [];
      //时间修改
      if (dayindex == 0) {
        console.log("今天");



        //判断小时是否大于当前时间
        var sjt = PEndTime2.split(':')[0];
        console.log("hours=" + hours);
        console.log("sjt=" + sjt);
        if (hours > sjt) {
          console.log("大于时间333");

          dt_index[0] = 1
        } else {
          console.log("小于等于时间");

          if (hours == sjt) {
            if (minutes >= 50) {
              dt_index[0] = 1
            } else {
              //判断分中
              var time3 = timlist[2];
              var mietlist = [];
              for (var t = 0; t < time3.length; t++) {
                console.log(time3[t]);
                var itemss = time3[t].split("分")[0];
                if (itemss >= minutes) {
                  mietlist.push(time3[t])
                }

              }
              timlist[2] = mietlist;
            }

            that.setData({
              dt_index: dt_index
            });
          } else {
            //今天
            if (PStartTime.length > 1) {
              console.log(timlist);
              console.log("时间");
              console.log("PStartTime=" + PStartTime);
              var pstime = PStartTime.split(':');
              var petime = PEndTime.split(':');
              var trynew = [];
              for (var i = parseInt(pstime[0]); i <= parseInt(petime[0]); i++) {
                var nuser = i;
                if (hours <= nuser) {
                  if (i < 10) {
                    nuser = "0" + nuser + "时"
                    trynew.push(nuser)
                  } else {
                    nuser = nuser + "时"
                    trynew.push(nuser)
                  }

                }

              }
              var pstime2 = PStartTime2.split(':');
              var petime2 = PEndTime2.split(':');

              for (var p = parseInt(pstime2[0]); p <= parseInt(petime2[0]); p++) {
                var nuser = p;
                if (hours <= nuser) {
                  if (i < 10) {
                    nuser = "0" + nuser + "时"
                    trynew.push(nuser)
                  } else {
                    nuser = nuser + "时"
                    trynew.push(nuser)
                  }
                }


              }
              console.log("**&&&&&&&&&&**");
              console.log(trynew);
              timlist[1] = trynew
              console.log("**&&&&&&&&&&**");
              console.log(trynew);
              console.log(timlist[1]);
            }
            var ioutli = timlist[1];
            console.log(ioutli[0].split('时')[0]);

            console.log("****");
            console.log(ioutli);
            console.log("minutes=" + minutes);
            if (minutes >= 50) {

              var synew = ioutli;
              if (hours == 11) {
                console.log("11点在减去12点");
                synew = synew.slice(1);
              }
              console.log("小时相同?");
              console.log(hours);
              console.log(synew[0].split('时')[0]);
              if (hours == synew[0].split('时')[0]) {
                console.log("小时相同减去一个小时");
                synew = synew.slice(1);
              }

              console.log(synew);
              timlist[1] = synew;
              timlist[2] = ['00分', '10分', '20分', '30分', '40分', '50分']


            } else {
              //判断分中
              console.log("判断分中");
              var time3 = timlist[2];
              var mietlist = [];
              for (var t = 0; t < time3.length; t++) {
                console.log(time3[t]);
                var itemss = time3[t].split("分")[0];
                if (itemss >= minutes) {
                  mietlist.push(time3[t])
                }

              }
              timlist[2] = mietlist;
            }
          }
        }
        if (that.data.Distribution.id == 2) {
          console.log("预约单");
          var timylist = timlist[1];
          var istime = false;
          for (var t = 0; t < timylist.length; t++) {
            if (timylist[t] == "13时") {
              istime = true;
            }
          }
          if (!istime) { //没有
            var stime = timylist[0].split("时")[0];
            console.log("开始时间" + stime);
            if (hours < 11) {
              // var nuber = 12 - stime;
              // console.log(timylist[nuber]);
              // timylist.splice(nuber, 1, '12时','13时', '14时', timylist[nuber])
            } else {
              //判断分中
              console.log("判断分中");
              var time3 = ['00分', '10分', '20分', '30分', '40分', '50分'];
              console.log(time3);
              console.log(minutes);
              var synew = timlist[1];
              if (synew[0].split("时")[0] == hours) {
                console.log("小时相同加一个小时");
                if (minutes > 50) {
                  //加一个小时
                  console.log("加一个小时");
                  console.log(timlist[1]);
                  synew = timlist[1].slice(1);
                  console.log(synew);
                  timlist[1] = synew;
                  if (minutes > 60) {
                    minutes = minutes - 60;
                  } else {
                    minutes = 0;
                  }
                }

              }

              if (synew.length == 0) {
                var mietlist = ["00"];

                timlist[2] = mietlist;
                console.log(mietlist);
              } else {
                console.log("&&&&&&&&&&&&");
                console.log(synew);
                if (synew[0] == "15时") {
                  console.log("15时");
                  minutes = 30
                }
                var mietlist = [];
                for (var t = 0; t < time3.length; t++) {
                  console.log(time3[t]);
                  var itemss = time3[t].split("分")[0];
                  if (itemss >= minutes) {
                    mietlist.push(time3[t])
                  }

                }
                timlist[2] = mietlist;
                console.log(mietlist);
              }


            }

            console.log(timylist);
            timlist[1] = timylist;

            //判断时间





          } else { //有
            var timylist = timlist[1];

            for (var t = 0; t < timylist.length; t++) {
              if (timylist[t] == "13时") {
                timylist.splice(t, 2);
              }
            }

            timlist[1] = timylist;
          }

          that.setData({
            dt_array: timlist
          });

        } else {
          console.log("自提单");
          var timtlist = timlist;
          var istime = false;
          for (var t = 0; t < timtlist.length; t++) {
            if (timtlist[t] == "13时") {
              istime = true;
            }
            if (timtlist[t] == "12时") {
              timtlist.splice(t, 1);
            }
          }
          if (istime) {

            var timtlist = timlist[1];

            for (var t = 0; t < timtlist.length; t++) {
              if (timtlist[t] == "13时") {
                timtlist.splice(t, 2);
              }
            }

            timlist[1] = timtlist;
          }
          //第一个时间判断

          if (minutes > 60) {
            minutes = minutes - 60;
            //判断分钟显示
            var ftimlist = timlist[2];
            var fenlist = [];
            console.log(ftimlist);
            console.log(minutes);
            for (var f = 0; f < ftimlist.length; f++) {
              var fen = ftimlist[f].split('分');
              if (minutes < fen[0]) {
                console.log(fen[0]);
                fenlist.push(ftimlist[f]);
              }

            }
            timlist[2] = fenlist


          } else {
            console.log("加载分钟");
            var ftimlist = timlist[2];
            var fenlist = [];
            console.log(ftimlist);
            console.log(minutes);
            for (var f = 0; f < ftimlist.length; f++) {
              var fen = ftimlist[f].split('分');
              if (minutes < fen[0]) {
                console.log(fen[0]);
                fenlist.push(ftimlist[f]);
              }

            }
            timlist[2] = fenlist
          }

          that.setData({
            dt_array: timlist
          });

        }
        console.log("dt_index=");
        console.log(dt_index);
      } else {
        //明天和后天
        console.log("明天和后天");
        console.log("that.data.PStartTime=" + that.data.PStartTime);
        var PStfz = that.data.PStartTime.split(':')[1];
        console.log("第一个小时");
        timlist[2] = ['00分', '10分', '20分', '30分', '40分', '50分']
        var time4 = [];
        console.log("PStfz=" + PStfz);
        for (var f = 0; f < timlist[2].length; f++) {
          var itemss = timlist[2][f].split("分")[0];
          console.log(itemss);
          if (parseInt(itemss) >= parseInt(PStfz)) {
            console.log(timlist[2][f]);
            time4.push(timlist[2][f])
          }

        }
        timlist[2] = time4;
        if (PStartTime.length > 1) {


          console.log(timlist);
          console.log("时间");
          console.log("PStartTime=" + PStartTime);
          var pstime = PStartTime.split(':');
          var petime = PEndTime.split(':');

          console.log(parseInt(pstime[0]));
          console.log(parseInt(petime[0]));
          var trynew = [];
          for (var i = parseInt(pstime[0]); i <= parseInt(petime[0]); i++) {
            var nuser = i;

            if (i < 10) {
              nuser = "0" + nuser + "时"
              trynew.push(nuser)
            } else {
              nuser = nuser + "时"
              trynew.push(nuser)
            }



          }
          var pstime2 = PStartTime2.split(':');
          var petime2 = PEndTime2.split(':');

          for (var p = parseInt(pstime2[0]); p <= parseInt(petime2[0]); p++) {
            var nuser = p;

            if (i < 10) {
              nuser = "0" + nuser + "时"
              trynew.push(nuser)
            } else {
              nuser = nuser + "时"
              trynew.push(nuser)
            }



          }
          console.log(trynew);
          timlist[1] = trynew

        }
        console.log("13he 14");
        console.log(that.data.Distribution);
        if (that.data.Distribution.id == 2) {
          console.log("预约单");
          var timylist = timlist[1];
          var istime = false;
          for (var t = 0; t < timylist.length; t++) {
            if (timylist[t] == "13时") {
              istime = true;
            }
          }
          if (!istime) { //没有
            var stime = timylist[0].split("时")[0];
            console.log("开始时间" + stime);

            // var nuber = 13 - stime;
            // console.log(timylist[nuber]);
            // timylist.splice(nuber, 1, '13时', '14时', timylist[nuber])


            console.log(timylist);
            timlist[1] = timylist;
          }

        } else {
          console.log("自提单22");
          var timtlist = timlist[1];
          var istime = false;
          for (var t = 0; t < timtlist.length; t++) {
            if (timtlist[t] == "13时") {
              istime = true;
            }
            if (timtlist[t] == "12时") {
              timtlist.splice(t, 1);
            }
          }
          if (istime) {
            for (var l = 0; l < timtlist.length; l++) {
              if (timtlist[l] == "13时") {
                timtlist.splice(l, 2);
              }
            }

            timlist[1] = timtlist;
          }



          console.log(timlist[2]);






        }

        that.setData({
          dt_index: [dayindex, 0, 0],
        });
      }
      that.setData({
        dt_array: timlist,
      });
    }
    //小时
    if (column == 1) {
      var xs = that.data.dt_array[1];
      console.log(xs);
      console.log("后小时");
      var dayindex = e.detail.value;
      console.log("dayindex=" + dayindex);
      var dt_index = that.data.dt_index;
      var timlist = that.data.dt_array;
      if (xs.length - 1 == dayindex) {
        console.log("最後igeshij ");

        console.log("最后时间");
        var ftimlitt = ['00分', '10分', '20分', '30分', '40分', '50分']
        //最后的分钟
        var zuim = that.data.PEndTime2.split(':');
        var zui1 = zuim[1];
        var fenlrr = [];
        console.log(zui1);
        for (var f = 0; f < ftimlitt.length; f++) {
          var fen = ftimlitt[f].split('分');
          if (zui1 >= fen[0]) {
            console.log(fen[0]);
            fenlrr.push(ftimlitt[f]);
          }

        }
        timlist[2] = fenlrr
      } else {

        console.log("dt_index=" + dt_index);
        if (dayindex == 0) {
          var PStfz = that.data.PStartTime.split(':')[1];

          console.log("第一个小时");

          //判断是否等于第一个小时
          var xs = that.data.dt_array[1];
          console.log("判断是否等于第一个小时");
          var xsii = xs[0].split("时")[0];
          console.log(xsii);
          console.log(hours);
          var time3 = ['00分', '10分', '20分', '30分', '40分', '50分'];
          var ftime = 50;
          //如果是上午最后时间修改分钟
          var zhxs = that.data.PEndTime.split(':')[0];
          console.log("修改分钟");
          console.log(zhxs);
          if (zhxs == hours) {
            var zhfz = that.data.PEndTime.split(':')[1];
            console.log("zhfz=" + zhfz);
            var time33 = [];
            for (var e = 0; e < time3.length; e++) {
              console.log(time3[e]);
              var itemss = time3[e].split("分")[0];
              if (itemss <= zhfz) {
                time33.push(time3[e])
              }
            }
            console.log(time33);
            time3 = time33;
            ftime = zhfz;
          }




          if (hours == xsii) {

            //判断分中
            //判断分中
            console.log("判断分中");

            console.log(time3);
            console.log(minutes);
            console.log(ftime);
            if (minutes > ftime) {
              //加一个小时
              console.log("加一个小时");
              console.log(timlist[1]);
              var synew = timlist[1].slice(1);
              console.log(synew);
              timlist[1] = synew;
              if (minutes > 60) {
                minutes = minutes - 60;
              } else {
                minutes = 0;
              }
            }
            var mietlist = [];
            for (var t = 0; t < time3.length; t++) {
              console.log(time3[t]);
              var itemss = time3[t].split("分")[0];
              if (itemss >= minutes) {
                mietlist.push(time3[t])
              }

            }

          }
          var time4 = [];
          console.log("PStfz=" + PStfz);
          console.log("第一个=" + timlist[1][0].split("时")[0]);
          console.log("xsii=" + xsii);
          if (15 == timlist[1][0].split("时")[0]) {

            PStfz = 30
          } else {
            if (minutes > 60) {
              minutes = minutes - 60
            }
            PStfz = minutes
          }
          console.log("PStfz=" + PStfz);
          for (var f = 0; f < time3.length; f++) {
            var itemss = time3[f].split("分")[0];
            console.log(itemss);
            if (parseInt(itemss) >= parseInt(PStfz)) {
              console.log(time3[f]);
              time4.push(time3[f])
            }

          }


          timlist[2] = time4;
          console.log(time4);

        } else {

          console.log("后小时");
          //大于等于
          var xst = xs[e.detail.value].split('时');
          console.log("xst=" + xst[0]);
          console.log("hours=" + hours);
          if (hours < xst[0]) {
            //等不等于最后时间
            console.log(xs);
            console.log(xs[xs.length - 1]);
            var zuitim = xs[xs.length - 1].split('时');
            if (zuitim[0] == xst[0]) {
              console.log("最后时间");
              var ftimlitt = ['00分', '10分', '20分', '30分', '40分', '50分']



              //最后的分钟
              var zuim = that.data.PEndTime2.split(':');
              var zui1 = zuim[1];
              var fenlrr = [];
              console.log(zui1);
              for (var f = 0; f < ftimlitt.length; f++) {
                var fen = ftimlitt[f].split('分');
                if (zui1 > fen[0]) {
                  console.log(fen[0]);
                  fenlrr.push(ftimlitt[f]);
                }

              }
              timlist[2] = fenlrr

            } else {
              console.log("不是最后时间");
              //大于
              timlist[2] = ['00分', '10分', '20分', '30分', '40分', '50分']
            }

          } else {
            //等于
            console.log("加载分钟");
            timlist[2] = ['00分', '10分', '20分', '30分', '40分', '50分']
          }
          console.log("上午最后时间判断分钟1");
          console.log(that.data.PEndTime.split(':')[0]);
          if (parseInt(xst[0]) == that.data.PEndTime.split(':')[0]) {
            //上午最后时间判断分钟
            var zui2 = that.data.PEndTime.split(':')[1];
            console.log("上午最后时间判断分钟2");
            console.log(timlist[2]);
            var timefzlist = timlist[2];
            var timey = [];
            for (var f = 0; f < timefzlist.length; f++) {
              var fen = timefzlist[f].split('分');
              if (zui2 >= fen[0]) {
                console.log(fen[0]);
                timey.push(timefzlist[f]);
              }

            }
            console.log(timey);
            console.log("timey");
            timlist[2] = timey


          }








        }
      }


      that.setData({
        dt_array: timlist
      });

    }



  },
  chooseDeliveryTime: function(e) {
    var that = this
    console.log(e);
    console.log("选择时间");

    var dt_index = e.detail.value
    var indx1 = dt_index[0];
    var indx2 = dt_index[1];
    var indx3 = dt_index[2];
    var time1 = that.data.dt_array[0];
    var time2 = that.data.dt_array[1];
    var time3 = that.data.dt_array[2];

    if (indx1 == 0) {
      //获取时间
      var now = new Date();
      var hours = now.getHours(); //测试
      var minute = now.getMinutes() + 20;
      if (minute > 59) {
        hours = hours + 1;

      }
      console.log("hours=" + hours);
      console.log("minute=" + minute);
      var hout = parseInt(time2[indx2]);

      if (hout < hours) {
        //赋值
        var lindex = -1;
        var fengzheng = 0;
        for (var sj = 0; sj < time2.length; sj++) {
          if (time2[sj].indexOf(hours) != -1) {
            lindex = sj;
            dt_index[1] = sj;
            //分钟
            for (var f = 0; f < time3.length; f++) {
              console.log(parseInt(time3[f]));

              if (parseInt(time3[f]) > minute) {
                if (fengzheng == 0) {
                  fengzheng = f;
                }
              }
            }
            dt_index[2] = fengzheng;
          }
        }
        console.log("出现" + lindex);
        if (lindex < 0) {
          dt_index[0] = 1;
        }


      } else {
        console.log("hours=" + hours);
        if (hout == hours) {
          var fengzheng = -1;
          console.log("小时相等");
          // //分钟
          if (minute > 50) {
            minute = minute - 60;
          }
          if (hout.length == 1) {
            var mut = that.data.PEndTime2.split(':')[1];
            if (minute > mut) {
              minute = mut
            }
          }
          for (var f = 0; f < time3.length; f++) {
            console.log(parseInt(time3[f]));
            console.log("minute=" + minute);

            if (parseInt(time3[f]) > minute) {
              if (fengzheng < 0) {
                fengzheng = f;
              }
            }
          }
          console.log(parseInt(time3[fengzheng]));
          console.log(parseInt(time3[indx3]));
          console.log("fengzheng=" + fengzheng);
          console.log("indx3=" + indx3);
          console.log("minute=" + minute);
          console.log(time3);
          //判断最低分钟要求
          if (parseInt(time3[indx3]) > parseInt(time3[fengzheng])) {
            dt_index[2] = indx3;
          } else {
            dt_index[2] = fengzheng;
          }
          if (fengzheng == -1) {
            var datalistF = [];
            var pstime = that.data.PStartTime.split(':');
            var petime = that.data.PEndTime.split(':');
            var pstime2 = that.data.PStartTime2.split(':');
            var petime2 = that.data.PEndTime2.split(':');
            console.log("111=" + parseInt(pstime[0]));
            console.log("222=" + parseInt(petime[0]));
            for (var i = parseInt(pstime[0]); i <= parseInt(petime[0]); i++) {
              var nuser = i;
              if (i < 10) {
                nuser = "0" + nuser + "时"
                datalistF.push(nuser)
              } else {
                nuser = nuser + "时"
                datalistF.push(nuser)
              }
            }
            for (var i = parseInt(pstime2[0]); i <= parseInt(petime2[0]); i++) {
              var nuser = i;
              if (i < 10) {
                nuser = "0" + nuser + "时"
                datalistF.push(nuser)
              } else {
                nuser = nuser + "时"
                datalistF.push(nuser)
              }
            }

            var dt_array = that.data.dt_array;
            dt_array[1] = datalistF
            that.setData({
              dt_array: dt_array
            });
            dt_index[0] = 1;
            dt_index[1] = 0;
            dt_index[2] = 0;
          }




        }

      }

    }
    console.log("dt_index=33");
    console.log(dt_index);
    that.setData({
      dt_index: dt_index
    })
  },

  bindOrderTime: function(e) {
    var time = e.detail.value;
    var tm = time.split(':');
    if (parseInt(tm[0]) > 12 && parseInt(tm[0]) < 15) {
      time = "15:00"
    }
    console.log(tm[0]);
    if (parseInt(tm[0]) >= 18) {
      if (parseInt(tm[0]) == 18 && parseInt(tm[1]) <= 30) {

      } else {
        time = "07:00"
        //加一天
        var subOrderDate = this.data.subOrderDate;
        console.log(subOrderDate);
        var daytm = subOrderDate.split('-');
        console.log(daytm);
        daytm[2] = parseInt(daytm[2]) + 1;
        if (parseInt(daytm[2]) < 10) {
          daytm[2] = "0" + daytm[2];
        }

        console.log(daytm[2]);
        var day = daytm[0] + "-" + daytm[1] + "-" + daytm[2]
        console.log(day);
        this.setData({
          subOrderDate: day
        })
      }

    }
    this.setData({
      OrderTimeStr: time
    })
    app.OrderTimeStr = time
  },
  bindSubOrderDate: function(e) {
    this.setData({
      subOrderDate: e.detail.value
    })
    app.subOrderDate = e.detail.value
  },
  a: function() {
    this.setData({
      flag: false
    })
  },
  b: function() {
    this.setData({
      flag: true
    })
  },
  c: function() {
    this.setData({
      flag1: false
    })
  },
  d: function() {
    this.setData({
      flag1: true
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  GetTxt: function(e) {
    console.log(e)
    this.setData({
      TextST: e.detail.value
    });
  },
  //内部点击
  btaB3: function() {
    this.setData({
      IsbT3: false
    });
  },
  calling: function() {
    wx.makePhoneCall({
      phoneNumber: '08258191116', //真实电话号码 
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },
  getPhone: function() {
    var phone = this.data.MarketPhone;
    if (phone.length > 1) {
      wx.makePhoneCall({
        phoneNumber: phone // 仅为示例，并非真实的电话号码
      })

    }

  },
  ///隐藏
  Hiedbta: function() {
    if (this.data.IsbT3) {
      this.setData({
        flag1: true
      })
    } else {
      this.setData({
        IsbT3: true
      })
    }
  },
  onPullDownRefresh: function() {
    this.onLoad()
  },
  onShow: function() {
    var that = this
    that.setData({
      OnclickTJ: true
    });

    if (app.Distribution.id > 1) {
      that.setData({
        Distribution: app.Distribution,
        subOrderDate: app.subOrderDate,
        OrderTimeStr: app.OrderTimeStr,
      });


    }

    console.log(that.data.Distribution);

    console.log("onShow");
    var list = that.data.ContenLlist;
    var txx = app.OrdeText;
    console.log("SHDZ_id=" + app.SHDZ_id);
    console.log("SHDZ_ard=" + app.SHDZ_ard);
    if (app.SHDZ_id != 0) {
      list.UserName = app.SHDZ_name;
      list.UserAddress = app.SHDZ_ard;
      list.UserPhone = app.SHDZ_hp;
    } else {
      list.UserName = "";
      list.UserAddress = "";
      list.UserPhone = "";
    }
    console.log("list");
    console.log(list);
    that.setData({
      ContenLlist: list,
      TextST: txx,
      magess: true,
      selectCoupon: app.couponList,
      couponMoney: app.couponMoney, //优惠金额
    })
    app.couponFrom = false;
    if (app.appUserType==2){
      that.GetDistance();
    }
    
  },
  onLoad: function(option) {
    console.log("onLoad");
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
    //获取市场信心
    app.Distribution = {
      id: 1,
      name: "立即配送"
    }; //下单时间
    app.subOrderDate = "请选择预约日期";
    app.OrderTimeStr = "选择时间";
    //获取时间
    var now = new Date();
    console.log("now=" + now);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    console.log("month=" + month);
    var day = now.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    var enday = day + 2;
    if (day < 10) {
      day = '0' + day;
    };
    if (enday < 10) {
      enday = '0' + enday;
    }

    var endDate = year + '-' + month + '-' + enday;
    var startDate = year + '-' + month + '-' + day;
    that.setData({
      TextST: "",
      MarketName: app.Market.Name,
      MarketPhone: app.Market.Phone,
      subOrderDate: startDate,
      startDate: startDate,
      endDate: endDate
    });


    var orderId = option.id == null ? "" : option.id;
    var newOrderId = option.orderNo == null ? "" : option.orderNo;


    that.setData({
      orderId: orderId,
      magess: true,
      newOrderId: newOrderId
    })
    console.log("orderId=" + orderId);
    app.ISorederid = newOrderId.length <= 0 ? orderId : newOrderId;
    if (app.ZF_list.length == 0) {
      app.ZF_list = that.data.tc_lia;
    } else {
      that.setData({
        tc_lia: app.ZF_list,
      })
      var list = app.ZF_list;
      for (var i = 0; i < list.length; i++) {
        if (list[i].tc_img == "/images/cart_b.png") {
          if (i == 0) {
            that.setData({
              payTypeYJ: true
            })
          }
          if (i == 0) {
            that.setData({
              payTypeYE: true
            })
          }

        } else {
          if (i == 0) {
            that.setData({
              payTypeYJ: false
            })
          }
          if (i == 0) {
            that.setData({
              payTypeYE: false
            })
          }
        }

      }
    }
    orderId = newOrderId.length <= 0 ? orderId : newOrderId
    // if (!app.couponFrom) {
    //   that.GetOrderCoupon(orderId);
    // }
    // else {
    //   app.couponFrom = false;

    // }
    this.BangData(orderId);
  },
  BangData: function(orderId) {
    var that = this
    app.request('api/Order/Detail?id=' + that.data.orderId + '&openid=' + app.openid + "&orderNo=" + that.data.newOrderId, {}, "GET",
      function(res) {
        console.log("**内容**")
        //获取时间
        var now = new Date();
        console.log("获取时间now=" + now);
        var timeDay = now.getDate();
        var hours = now.getHours();
        console.log("获取时间day=" + now.getDate());
   
        if (res.data.flag == true) {
          console.log(res.data)
          var conat = res.data.model.Detail.length;
          var StoreDetail = res.data.model.StoreDetail;


          var sidStr = that.data.sidStr;
          if (res.data.IsRestaurant){
            console.log("企业免费配送");
            that.setData({
              Distribution: {
                id: 4,
                name: '免费配送'
              },
            });
            if (res.data.IsRestaurant) { //判断时间多久送达
              var PFPStartTime = res.data.PFPStartTime;
              var PFPEndTime = res.data.PFPEndTime;
              var PFPStartTime2 = res.data.PFPStartTime2;
              var PFPEndTime2 = res.data.PFPEndTime2;
              console.log("PFPStartTime=" + PFPStartTime);
              console.log("PFPEndTime=" + PFPEndTime);
              console.log("PFPStartTime2=" + PFPStartTime2);
              console.log("PFPEndTime2=" + PFPEndTime2);
              //判断今天时间
              var hs = PFPStartTime.split(":")[0];
              var fs = PFPStartTime.split(":")[1];
              var hs2 = PFPStartTime2.split(":")[0];
              var fs2 = PFPStartTime2.split(":")[1];
              console.log("上午hs=" + hs);
              console.log("fs=" + fs);
              console.log("下午hs2=" + hs2);
              console.log("fs2=" + fs2);

              var dayPt = [0, 0];
              var dayPtArray = that.data.dayPtArray;

              dayPtArray[1][0] = "上午" + PFPEndTime+"点前送达";
              dayPtArray[1][1] = "下午" + PFPEndTime2 +"点前送达";
              console.log("默认数据");
              console.log(dayPtArray);
              console.log(hours);
              if (hours > hs) {
                if (hours > hs2) {
                  dayPtArray[0] = ['明天'];
                  //第二天时间
                  that.setData({
                    dayPtArray: dayPtArray
                  });
                } else {
                  if (hours == hs2) {
                    if (fs2 > minute) {
                      dayPtArray[0] = ['明天'];
                      //第二天时间
                      that.setData({
                        dayPtArray: dayPtArray
                      });
                    } else {
                      dayPtArray[0] = ['今天', '明天'];
                      dayPtArray[1] = ["下午" + PFPStartTime2 + "前送达"];
                      //第二天时间
                      that.setData({
                        dayPtArray: dayPtArray
                      });
                    }
                  } else {
                    console.log("正确");
                    dayPtArray[0] = ['今天', '明天'];
                    dayPtArray[1] = ["下午" + PFPEndTime2 + "前送达"];
                    //第二天时间
                    that.setData({
                      dayPtArray: dayPtArray
                    });
                    console.log(dayPtArray);

                  }


                }

              } else {
                if (hs == hours) {
                  //判断分钟
                  if (fs > minute) {
                    //今天
                    that.setData({
                      dayPtArray: dayPtArray
                    });
                  } else {
                    dayPtArray[0] = ['今天', '明天'];
                    dayPtArray[1] = ["下午" + PFPEndTime2 + "前送达"];
                    //第二天时间
                    that.setData({
                      dayPtArray: dayPtArray
                    });
                  }

                } else {
                  that.setData({
                    dayPtArray: dayPtArray
                  });
                }
              }
             
              var userDTime = res.data.model.UserDeliveryTime.split(' ');
              console.log(userDTime);
              var yestime = userDTime[0].split('-');
              var hetime = userDTime[1].split(':');
              console.log(yestime);
              console.log(hetime);
              var bday = yestime[2];
              console.log(bday);
              var daynuber = parseInt(bday) - parseInt(timeDay);
              if (daynuber>0){
               
                dayPtArray[0] = ['明天'];
                dayPtArray[1] = ["上午" + PFPEndTime + "点前送达", "下午" + PFPEndTime2 + "点前送达"];
                if (hetime == hs){
                  dayPt = [0, 0];
                }else{
                  dayPt = [0, 1];
                }
                //第二天时间
                that.setData({
                  dayPt: dayPt,
                  dayPtArray: dayPtArray
                });

              }




            }
          }
          for (var y = 0; y < StoreDetail.length; y++) {
            if (sidStr == "") {
              sidStr += StoreDetail[y].StoreId;
            } else {
              sidStr += "," + StoreDetail[y].StoreId;
            }

          }
          that.setData({
            sidStr: sidStr,
            SelfShop: res.data.SelfShop
          });
         
          
          var PEndTime = res.data.PEndTime;
          var PStartTime = res.data.PStartTime;
          var PEndTime2 = res.data.PEndTime2;
          var PStartTime2 = res.data.PStartTime2;
          console.log("PEndTime2=" + PEndTime2);
          var jst = PEndTime2.split(':')[0];
          console.log("jst=" + jst);

          if (PStartTime.length > 1) {
            var timlist = that.data.dt_array;
            var trylist = timlist[1];
            console.log(timlist);
            console.log("时间");
            console.log("PStartTime=" + PStartTime);
            var pstime = PStartTime.split(':');
            var petime = PEndTime.split(':');
            var trynew = [];
            var datalistF = [];
            console.log("111=" + parseInt(pstime[0]));
            console.log("222=" + parseInt(petime[0]));
            for (var i = parseInt(pstime[0]); i <= parseInt(petime[0]); i++) {
              var nuser = i;

              if (hours <= nuser) {
                if (i < 10) {
                  nuser = "0" + nuser + "时"
                  trynew.push(nuser)
                } else {
                  nuser = nuser + "时"
                  trynew.push(nuser)
                }

              }
              if (i < 10) {
                nuser = "0" + nuser + "时"
                datalistF.push(nuser)
              } else {
                nuser = nuser + "时"
                datalistF.push(nuser)
              }


            }
            console.log("trynew");
            console.log(trynew);
            console.log("datalistF");
            console.log(datalistF);
            var pstime2 = PStartTime2.split(':');
            var petime2 = PEndTime2.split(':');
            console.log("333=" + parseInt(pstime2[0]));
            console.log("444=" + parseInt(petime2[0]));
            for (var p = parseInt(pstime2[0]); p <= parseInt(petime2[0]); p++) {
              var nuser = p;

              if (hours <= nuser) {
                if (i < 10) {
                  nuser = "0" + nuser + "时"
                  trynew.push(nuser)
                } else {
                  nuser = nuser + "时"
                  trynew.push(nuser)
                }
              }
              if (i < 10) {
                nuser = "0" + nuser + "时"
                datalistF.push(nuser)
              } else {
                nuser = nuser + "时"
                datalistF.push(nuser)
              }


            }
            console.log("trynew");
            console.log(trynew);
            console.log("datalistF");
            console.log(datalistF);
            console.log("^^^^");
            console.log(trynew);
            timlist[1] = trynew
            that.setData({
              PEndTime: PEndTime,
              PStartTime: PStartTime,
              PEndTime2: PEndTime2,
              PStartTime2: PStartTime2,
              dt_array: timlist,
            });
            var dt_index = that.data.dt_index;
            var indx1 = dt_index[0];
            var indx2 = dt_index[1];
            var indx3 = dt_index[2];
            var time1 = that.data.dt_array[0];
            var time2 = that.data.dt_array[1];
            var time3 = that.data.dt_array[2];
            var dt_array = that.data.dt_array;
            console.log("加载时间");
            console.log(dt_array);

            var userDTime = res.data.model.UserDeliveryTime.split(' ');
            console.log(userDTime);
            var yestime = userDTime[0].split('-');
            var hetime = userDTime[1].split(':');
            console.log(yestime);
            console.log(hetime);
            var bday = yestime[2];
            console.log(bday);
            var daynuber = parseInt(bday) - parseInt(timeDay);
            console.log(daynuber);
            if (daynuber == 0) {
              console.log("今天==");
              dt_index[0] = 0;
            }
            if (daynuber == 1) {
              console.log("明天==");
              dt_index[0] = 1;
            }
            if (daynuber == 2) {
              console.log("后天==");
              dt_index[0] = 2;
            }
            indx1 = dt_index[0]
            if (indx1 == 0) {

              //判断是否上午最后时间
              //如果是上午最后时间修改分钟
              var zhxs = that.data.PEndTime.split(':')[0];
              console.log("修改分钟");
              console.log(zhxs);
              if (zhxs == hours) {
                var zhfz = that.data.PEndTime.split(':')[1];
                console.log("zhfz=" + zhfz);
                var time33 = [];
                for (var e = 0; e < time3.length; e++) {
                  console.log(time3[e]);
                  var itemss = time3[e].split("分")[0];
                  if (itemss <= zhfz) {
                    time33.push(time3[e])
                  }
                }
                time3 = time33;



              }
              //获取时间
              var now = new Date();
              var hours = now.getHours();
              var minute = now.getMinutes() + 30;
              var sjt = petime2[0];
              console.log("hours" + hours);
              console.log("sjt=" + sjt);
              if (hours > sjt) {

                dt_index[0] = 1
                var timlist = that.data.dt_array;
                var trylist = timlist[1];
                console.log(timlist);
                console.log("时间");
                console.log("PStartTime=" + PStartTime);
                var pstime = PStartTime.split(':');
                var petime = PEndTime.split(':');
                var trynew = [];
                for (var i = parseInt(pstime[0]); i <= parseInt(petime[0]); i++) {
                  var nuser = i;

                  if (i < 10) {
                    nuser = "0" + nuser + "时"
                    trynew.push(nuser)
                  } else {
                    nuser = nuser + "时"
                    trynew.push(nuser)
                  }



                }
                var pstime2 = PStartTime2.split(':');
                var petime2 = PEndTime2.split(':');

                for (var p = parseInt(pstime2[0]); p <= parseInt(petime2[0]); p++) {
                  var nuser = p;

                  if (i < 10) {
                    nuser = "0" + nuser + "时"
                    trynew.push(nuser)
                  } else {
                    nuser = nuser + "时"
                    trynew.push(nuser)
                  }

                }
                console.log(trynew);
                dt_array[1] = trynew

              } else {
                //判断小时是否等
                console.log("判断小时是否等");
                console.log(time2[0]);
                console.log(time2[0].split("时")[0]);
                if (time2[0].split("时")[0] == that.data.PEndTime2.split(':')[0]) {
                  dt_index[0] = 1;
                  dt_index[1] = 0;
                  dt_index[2] = 0;
                  dt_array[1] = datalistF;
                  console.log("最后一个");
                } else {
                  if (time2[0].split("时")[0] <= hours) {

                    var timefz = that.data.PEndTime.split(':')[1];
                    console.log("timefz=" + timefz);
                    console.log("minute=" + minute);
                    if (minute > timefz) {
                      //减去一个小时
                      console.log(time2);
                      if (time2.length > 1) {
                        console.log("减去一个小时");


                        var synew = time2.slice(1);
                        //判断是否是11点
                        console.log("判断是否是11点");

                        console.log(synew);
                        dt_array[1] = synew;


                        if (minute > 60) {
                          var mietlist = dt_array[2]
                          var mut = minute - 60;
                          console.log("判断分钟555");
                          console.log(synew[0].split("时")[0]);
                          console.log(that.data.PEndTime2.split(':')[0]);
                          if (synew[0].split("时")[0] == that.data.PEndTime2.split(':')[0]) {
                            console.log("PEndTime2===" + that.data.PEndTime2.split(':')[1]);

                            mut = that.data.PEndTime2.split(':')[1]
                            console.log("mut=" + mut);

                            var mites = [];
                            for (var t = 0; t < mietlist.length; t++) {
                              console.log(mietlist[t]);
                              var itemss = mietlist[t].split("分")[0];
                              console.log("itemss=" + itemss);

                              if (itemss < mut) {
                                mites.push(mietlist[t])
                              }

                            }
                            console.log(mites);
                            if (mites.length > 0) {

                              dt_array[2] = mites
                            }

                          } else {
                            console.log("mut=" + mut);
                            var mites = [];
                            for (var t = 0; t < mietlist.length; t++) {
                              console.log(mietlist[t]);
                              var itemss = mietlist[t].split("分")[0];
                              console.log("itemss=" + itemss);

                              if (itemss >= mut) {
                                mites.push(mietlist[t])
                              }

                            }
                            console.log(mites);
                            dt_array[2] = mites
                          }


                        }


                      } else {
                        console.log("加一天");
                        dt_index[0] = 1;
                        var timlist = that.data.dt_array;
                        var trylist = timlist[1];
                        console.log(timlist);
                        console.log("时间");
                        console.log("PStartTime=" + PStartTime);
                        var pstime = PStartTime.split(':');
                        var petime = PEndTime.split(':');
                        var trynew = [];
                        for (var i = parseInt(pstime[0]); i <= parseInt(petime[0]); i++) {
                          var nuser = i;

                          if (i < 10) {
                            nuser = "0" + nuser + "时"
                            trynew.push(nuser)
                          } else {
                            nuser = nuser + "时"
                            trynew.push(nuser)
                          }



                        }
                        var pstime2 = PStartTime2.split(':');
                        var petime2 = PEndTime2.split(':');

                        for (var p = parseInt(pstime2[0]); p <= parseInt(petime2[0]); p++) {
                          var nuser = p;

                          if (i < 10) {
                            nuser = "0" + nuser + "时"
                            trynew.push(nuser)
                          } else {
                            nuser = nuser + "时"
                            trynew.push(nuser)
                          }

                        }
                        console.log(trynew);
                        dt_array[1] = trynew
                      }

                      if (res.data.model.DeliveryType == 2) {
                        //预约单
                        var timtlist = dt_array[1];
                        var istime = false;
                        for (var t = 0; t < timtlist.length; t++) {
                          if (timtlist[t] == "13时") {
                            istime = true;
                          }
                        }
                        if (!istime) { //没有
                          var stime = timtlist[0].split("时")[0];
                          console.log("开始时间" + stime);
                          if (hours < 11) {
                            // var nuber = 13 - stime;
                            // console.log(timtlist[nuber]);
                            // timtlist.splice(nuber, 1, '13时', '14时', timtlist[nuber])
                          }

                          console.log(timtlist);
                          dt_array[1] = timtlist;
                        } else { //有
                          var timtlist = dt_array[1];

                          for (var t = 0; t < timtlist.length; t++) {
                            if (timtlist[t] == "13时") {
                              timtlist.splice(t, 2);
                            }
                          }

                          dt_array[1] = timtlist;
                        }

                        that.setData({
                          dt_array: dt_array
                        });



                      }
                      if (res.data.model.DeliveryType == 3) {
                        //自提单
                        var timtlist = dt_array[1];
                        var istime = false;
                        for (var t = 0; t < timtlist.length; t++) {
                          if (timtlist[t] == "13时") {
                            istime = true;
                          }
                        }
                        if (istime) {

                          var timtlist = dt_array[1];

                          for (var t = 0; t < timtlist.length; t++) {
                            if (timtlist[t] == "13时") {
                              timtlist.splice(t, 2);
                            }
                          }

                          dt_array[1] = timtlist;
                        }

                        that.setData({
                          dt_array: dt_array
                        });

                      }

                    } else {
                      //加载分钟
                      console.log("加载分钟");
                      if (res.data.model.DeliveryType == 2) {
                        //预约单
                        var timtlist = dt_array[1];
                        var istime = false;
                        for (var t = 0; t < timtlist.length; t++) {
                          if (timtlist[t] == "13时") {
                            istime = true;
                          }
                        }
                        if (!istime) { //没有
                          var stime = timtlist[0].split("时")[0];
                          console.log("hours=" + hours);
                          console.log("开始时间" + stime);
                          if (hours < 11) {
                            // var nuber = 13 - hours;
                            // console.log(nuber);
                            // console.log(timtlist[nuber]);
                            // timtlist.splice(nuber, 1, '13时', '14时', timtlist[nuber])
                          }

                          console.log(timtlist);
                          dt_array[1] = timtlist;
                        } else { //有
                          var timtlist = dt_array[1];

                          for (var t = 0; t < timtlist.length; t++) {
                            if (timtlist[t] == "13时") {
                              timtlist.splice(t, 2);
                            }
                          }

                          dt_array[1] = timtlist;
                        }

                        that.setData({
                          dt_array: dt_array
                        });



                      }
                      if (res.data.model.DeliveryType == 3) {
                        //自提单
                        var timtlist = dt_array[1];
                        var istime = false;
                        for (var t = 0; t < timtlist.length; t++) {
                          if (timtlist[t] == "13时") {
                            istime = true;
                          }
                        }
                        if (istime) {

                          var timtlist = dt_array[1];

                          for (var t = 0; t < timtlist.length; t++) {
                            if (timtlist[t] == "13时") {
                              timtlist.splice(t, 2);
                            }
                          }

                          dt_array[1] = timtlist;
                        }

                        that.setData({
                          dt_array: dt_array
                        });

                      }



                      console.log("minute=" + minute);
                      var mietlist = [];
                      for (var t = 0; t < time3.length; t++) {
                        console.log(time3[t]);
                        var itemss = time3[t].split("分")[0];
                        console.log("itemss=" + itemss);

                        if (itemss >= minute) {
                          mietlist.push(time3[t])
                        }

                      }
                      console.log(mietlist);
                      if (mietlist.length > 0) {
                        dt_array[2] = mietlist
                      } else {
                        var zhxs = that.data.PEndTime.split(':')[0];
                        if (hours == zhxs) {
                          console.log("分钟不够，加一个小时");
                          dt_array[1] = dt_array[1].splice(0, 1);
                        }

                      }

                    }
                  }
                }


              }



              that.setData({
                dt_array: dt_array
              });

            } else {
              console.log("*****明天和后天");
              console.log(datalistF);

              dt_array[1] = datalistF;
              dt_array[2] = ['00分', '10分', '20分', '30分', '40分', '50分'];
              that.setData({
                dt_array: dt_array
              });

            }

            //判断时间333
            console.log("判断时间H333");
            console.log(dt_array);
            console.log(hetime[0]);
            console.log(hetime[1]);
            var dthlit = dt_array[1];
            var mthlit = dt_array[2];
            for (var f = 0; f < dthlit.length; f++) {
              if (dthlit[f].split('时')[0] == hetime[0]) {
                dt_index[1] = f;
              }
            }
            console.log("判断分钟===" + hetime[1]);
            for (var g = 0; g < mthlit.length; g++) {
              console.log(mthlit[g].split('分')[0]);
              if (mthlit[g].split('分')[0] == hetime[1]) {
                console.log("fff=" + g);
                dt_index[2] = g;
              }
            }

            if (dthlit[0].split("时")[0] == that.data.PEndTime2.split(':')[0]) {
              console.log("*****明天和后天");
              console.log(datalistF);

              dt_array[1] = datalistF;
              dt_array[2] = ['00分', '10分', '20分', '30分', '40分', '50分'];
              that.setData({
                dt_array: dt_array
              });
              dt_index[0] = 1;
              dt_index[1] = 0;
              dt_index[2] = 0;
            }

            that.setData({
              dt_index: dt_index
            })
            console.log("dt_index赋值");
            console.log(dt_index);

          }
          var Detaillist = res.data.model.Detail;
          //判断是否下架
          for (var i = 0; i < Detaillist.length; i++) {
            var IsPublish = Detaillist[i].IsPublish;
            console.log(Detaillist[i].ProductName + "-IsPublish=" + IsPublish);
            if (!IsPublish) {
              that.setData({
                IsPublish: false
              });
            }
          }

          var ContenLlist = res.data.model;
          console.log(ContenLlist.UserAddress);
          console.log("||||||||||||");
          console.log(app.SHDZ_ard);
          if (ContenLlist.UserAddress != null) {
            ContenLlist.UserAddress = ContenLlist.UserAddress
          }
          console.log(res.data.model)

          var AmountPayable = ((res.data.model.TotalMoney * 1) + (res.data.money * 1)).toFixed(2);
          console.log("IsStoreBusiness=" + res.data.IsStoreBusiness);
          if (!res.data.IsStoreBusiness) {
            res.data.model.DeliveryType = 2;
          }

          //判断当前时间是否在时间内
          console.log("判断当前时间是否在时间内");
          console.log("DeliveryType=" + res.data.model.DeliveryType);
          if (res.data.model.DeliveryType > 1) {

            console.log("当前时间：" + hours);
            var minut = now.getMinutes();
            console.log("当前分钟：" + minut);
            var ks1 = PStartTime.split(':')[0];
            var ks2 = PStartTime.split(':')[1];
            console.log(ks1);
            var ka1 = PEndTime.split(':')[0];
            var ka2 = PEndTime.split(':')[1];
            console.log(ka1);
            var js1 = PStartTime2.split(':')[0];
            var js2 = PStartTime2.split(':')[1];
            console.log(js1);
            var ja1 = PEndTime2.split(':')[0];
            var ja2 = PEndTime2.split(':')[1];
            console.log(ja1);
            if (hours < 12) { //判断开始时间
              console.log("判断开始时间");
              console.log("ks1=" + ks1);
              if (hours < ks1) {
                console.log("不能立即配送");
                res.data.model.DeliveryType = 2;
              } else {
                if (hours == ks1) {
                  //判断分钟
                  console.log("判断分钟");
                  if (minut < ks2) {
                    console.log("不能立即配送");
                    res.data.model.DeliveryType = 2;
                  }
                }
              }
            } else { //判断结束时间
              if (hours < 15) {
                console.log("不能立即配送");
                res.data.model.DeliveryType = 2;
              } else {
                //判断结束时间
                if (hours > ja1) {
                  console.log("不能立即配送");
                  res.data.model.DeliveryType = 2;
                } else {
                  if (hours == ja1) {
                    //判断分钟
                    console.log("判断分钟");
                    if (minut > ja2) {
                      console.log("不能立即配送");
                      res.data.model.DeliveryType = 2;
                    }
                  }

                }

              }

            }



          }


          //判断是否选择配送
          if (res.data.model.DeliveryType > 0) {
            var dtpid = res.data.model.DeliveryType;
            if (dtpid == 2) {
              that.setData({
                DeliveryText: "预约时间",
              });

            }
            if (dtpid == 3) {
              that.setData({
                DeliveryText: "自提时间",
              });

            }
            if (dtpid > 1) {
              AmountPayable = (res.data.model.TotalMoney * 1).toFixed(2);
              console.log("時間");
              console.log(res.data.model.UserDeliveryTime);
              var userDTime = res.data.model.UserDeliveryTime.split(' ');
              console.log(userDTime);
              //赋值时间
              var ftime = userDTime[1].split(':');
              console.log(ftime);

              that.setData({
                subOrderDate: userDTime[0],
                OrderTimeStr: userDTime[1],
              });

            }
            var clist = that.data.tc_li;
            console.log("3333");
            console.log(clist);
            for (var i = 0; i < clist.length; i++) {
              if (clist[i].id == dtpid) {
                clist[i].li_img = "/images/cart_b.png"; //选中
                if (dtpid < 3) {
                  that.setData({
                    DistributionCost: 0.00,
                    PSYS: false,
                  });
                } else {
                  that.setData({
                    DistributionCost: res.data.money,
                    PSYS: true,
                  });

                }
                that.setData({
                  Distribution: {
                    id: clist[i].id,
                    name: clist[i].li_b
                  },
                });
              } else {
                clist[i].li_img = "/images/cart_a.png";
              }

            }
            console.log("修改后");
            console.log(clist);
            that.setData({
              tc_li: clist,
            });

          }
          console.log("计算金额");
          console.log((AmountPayable * 1));
          console.log((res.data.model.DiscountMoney * 1));
          AmountPayable = ((AmountPayable * 1) - (res.data.model.DiscountMoney * 1)).toFixed(2)
          console.log((AmountPayable * 1));
          that.setData({
            IsRestaurant: res.data.IsRestaurant, //false显示
            PFPStartTime: res.data.PFPStartTime,
            PFPEndTime: res.data.PFPEndTime,
            PFPStartTime2: res.data.PFPStartTime2,
            PFPEndTime2: res.data.PFPEndTime2,
            IsStoreBusiness: res.data.IsStoreBusiness,
            StoreBusiness: res.data.StoreBusiness,
            distance: res.data.distance,
            ContenLlist: res.data.model,
            Conat: conat,
            Detail: Detaillist,
            AmountPayable: AmountPayable,
            DiscountMoney: res.data.model.DiscountMoney.toFixed(2),
            orderId: orderId,
            OrderNo: res.data.model.OrderNo,
            PSJE: res.data.money.toFixed(2),
            MinPs: res.data.minmoney.toFixed(2),
          })

          console.log("%%%%%%5");
          console.log(app.couponFrom);
          if (!app.couponFrom) {
            that.GetOrderCoupon(orderId);
          } else {
            app.couponFrom = false;

          }


        }



        //*********** */
        console.log("distance=" + that.data.distance);
        var list = that.data.ContenLlist;
        if (app.couponMoney != 0) {
          list.CouponMoney = app.couponMoney
          that.setData({
            PreferentialBool: true,
            tc_lia: app.ZF_list,
            selectCoupon: app.couponList,
            couponMoney: app.couponMoney, //优惠金额
          })


        }
        var psmoney = res.data.money;
        console.log("TotalMoney=" + list.TotalMoney);
        console.log("MinPs=" + that.data.MinPs);
        console.log("PSJE=" + that.data.PSJE);
        if ((list.TotalMoney * 1) >= (that.data.MinPs * 1)) {
          that.setData({
            PSJE: 0.00,
          })
        }



        var psj = that.data.PSJE;

        if (that.data.Distribution.id > 2) {
          psj = 0;
        }

        console.log("PSJE=" + that.data.PSJE);
        // var pay = (list.TotalMoney * 1) + (that.data.PSJE * 1) - (app.PreferentialPrice * 1);
        var pay = (list.TotalMoney * 1) + (psj * 1) - (parseFloat(that.data.couponMoney) * 1) - (parseFloat(that.data.DiscountMoney) * 1);

        console.log("psj+" + psj);
        console.log("pay+" + pay);
        if (pay < 0) {
          pay = 0;
        }


        list.TotalMoney = parseFloat(list.TotalMoney).toFixed(2);
        list.CouponMoney = parseFloat(list.CouponMoney).toFixed(2);
        that.setData({
          ContenLlist: list,
          DistributionCost: psj,
          //parseFloat(app.couponMoney)
          PreferentialAmount: parseFloat(that.data.couponMoney).toFixed(2),
          // PreferentialAmount: app.PreferentialPrice.toFixed(2),
          AmountPayable: pay.toFixed(2)
        })
        app.SHDZ_id = list.UserAddressId;
        console.log("UserAddressId=" + list.UserAddressId);
        if (app.appUserType==2){
          that.GetDistance();
        }
        
      },
      function(error) { //error
        wx.showToast({
          title: '下单失败',
          icon: 'loading',
          duration: 2000
        });
      }
    );

  },
  textTob: function(event) { //修改备注
    var txt = event.detail.value;
    app.OrdeText = txt;
  },
  PSclick: function(e) { //配送方式
    var that = this
    var id = e.currentTarget.dataset.id;
    //立即配送
    if (id == 1) {
      //判断是否能立即配送
      var now = new Date();
      console.log("now=" + now);
      var hours = now.getHours();
      console.log("判断当前时间是否在时间内");
      console.log("当前时间：" + hours);
      var minut = now.getMinutes();
      console.log("当前分钟：" + minut);
      var ks1 = that.data.PStartTime.split(':')[0];
      var ks2 = that.data.PStartTime.split(':')[1];
      console.log(ks1);
      var ka1 = that.data.PEndTime.split(':')[0];
      var ka2 = that.data.PEndTime.split(':')[1];
      console.log(ka1);
      var js1 = that.data.PStartTime2.split(':')[0];
      var js2 = that.data.PStartTime2.split(':')[1];
      console.log(js1);
      var ja1 = that.data.PEndTime2.split(':')[0];
      var ja2 = that.data.PEndTime2.split(':')[1];
      console.log(ja1);
      if (hours < 12) { //判断开始时间
        if (hours < ks1) {
          console.log("不能立即配送");
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '早上' + that.data.PStartTime + '-' + that.data.PEndTime + '，下午' + that.data.PStartTime2 + '-' + that.data.PEndTime2 + '点。其它时间段，请选择预约配送',
            success: function(res) {

            }
          })
          return;
        } else {
          if (hours == ks1) {
            //判断分钟
            console.log("判断分钟");
            if (minut < ks2) {
              console.log("不能立即配送");
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '早上' + that.data.PStartTime + '-' + that.data.PEndTime + '，下午' + that.data.PStartTime2 + '-' + that.data.PEndTime2 + '点。其它时间段，请选择预约配送',
                success: function(res) {

                }
              })
              return;
            }
          }
        }
      } else { //判断结束时间
        if (hours < 15) {
          console.log("不能立即配送");
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '早上' + that.data.PStartTime + '-' + that.data.PEndTime + '，下午' + that.data.PStartTime2 + '-' + that.data.PEndTime2 + '点。其它时间段，请选择预约配送',
            success: function(res) {

            }
          })
          return;
        } else {
          //判断结束时间
          if (hours > ja1) {
            console.log("不能立即配送");
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '早上' + that.data.PStartTime + '-' + that.data.PEndTime + '，下午' + that.data.PStartTime2 + '-' + that.data.PEndTime2 + '点。其它时间段，请选择预约配送',
              success: function(res) {

              }
            })
            return;
          } else {
            if (hours == ja1) {
              //判断分钟
              console.log("判断分钟");
              if (minut > ja2) {
                console.log("不能立即配送");
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: '早上' + that.data.PStartTime + '-' + that.data.PEndTime + '，下午' + that.data.PStartTime2 + '-' + that.data.PEndTime2 + '点。其它时间段，请选择预约配送',
                  success: function(res) {

                  }
                })
                return;
              }
            }

          }

        }

      }



    }
    var list = that.data.tc_li;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        var dt_array = that.data.dt_array;
        var column = e.detail.column;
        var now = new Date();

        var hours = now.getHours();
        var minute = now.getMinutes();
        //判断分钟
        console.log("hours=" + hours);
        console.log(dt_array);

        if (hours == 11) {
          console.log("判断分钟");

          console.log("minute=" + minute);
          if (minute > 40) {
            //刪除12點
            var dt_array = that.data.dt_array;
            var dt_hours = dt_array[1];
            for (var h = 0; h < dt_hours.length; h++) {
              console.log(dt_hours[h]);
              if (dt_hours[h] == "12时") {
                dt_hours.splice(h, 1);
              }
            }
            console.log(dt_hours);
            dt_array[1] = dt_hours;
            that.setData({
              dt_array: dt_array
            });

          }

        }
        if (id == 2) {
          //预约单
          var timtlist = dt_array[1];
          var istime = false;
          for (var t = 0; t < timtlist.length; t++) {
            if (timtlist[t] == "13时") {
              istime = true;
            }
          }
          if (!istime) { //没有
            var stime = timtlist[0].split("时")[0];
            console.log("开始时间" + stime);

            if (hours < 11) {
              if (stime < 11) {
                // var nuber = 12 - stime;
                // console.log(nuber);
                // console.log(timtlist[nuber]);
                // timtlist.splice(nuber, 1, '12时','13时', '14时', timtlist[nuber])
              }

            }

            console.log(timtlist);
            dt_array[1] = timtlist;
          } else { //有
            var timtlist = dt_array[1];

            for (var t = 0; t < timtlist.length; t++) {
              if (timtlist[t] == "12时") {
                timtlist.splice(t, 3);
              }
            }

            dt_array[1] = timtlist;
          }
          //判断时间
          if (minute > 60) {
            console.log("处理分钟中");
            var fztime = minute - 60;
            var time3 = dt_array[2];
            var mietlist = [];
            for (var t = 0; t < time3.length; t++) {
              console.log(time3[t]);
              var itemss = time3[t].split("分")[0];
              if (itemss >= fztime) {
                mietlist.push(time3[t])
              }

            }
            dt_array[2] = mietlist;

          }


          that.setData({
            dt_array: dt_array
          });



        }
        if (id == 3) {
          //自提单
          console.log("自提单");
          var timtlist = dt_array[1];
          var istime = false;
          console.log(timtlist);
          for (var t = 0; t < timtlist.length; t++) {
            if (timtlist[t] == "13时") {
              istime = true;
            }
            if (timtlist[t] == "12时") {
              timtlist.splice(t, 1);
            }
          }
          if (istime) {

            var timtlist = dt_array[1];
            console.log(timtlist);
            for (var t = 0; t < timtlist.length; t++) {
              if (timtlist[t] == "13时") {
                timtlist.splice(t, 2);
              }
            }

            dt_array[1] = timtlist;
          }
          console.log(dt_array);
          that.setData({
            dt_array: dt_array
          });


        }
        if (id == 4) { //判断时间多久送达
          var PFPStartTime = that.data.PFPStartTime;
          var PFPEndTime = that.data.PFPEndTime;
          var PFPStartTime2 = that.data.PFPStartTime2;
          var PFPEndTime2 = that.data.PFPEndTime2;
          console.log("PFPStartTime=" + PFPStartTime);
          console.log("PFPEndTime=" + PFPEndTime);
          console.log("PFPStartTime2=" + PFPStartTime2);
          console.log("PFPEndTime2=" + PFPEndTime2);
          //判断今天时间
          var hs = PFPStartTime.split(":")[0];
          var fs = PFPStartTime.split(":")[1];
          var hs2 = PFPStartTime2.split(":")[0];
          var fs2 = PFPStartTime2.split(":")[1];
          console.log("hs=" + hs);
          console.log("fs=" + fs);
          console.log("hs2=" + hs2);
          console.log("fs2=" + fs2);
          if (hours > hs) {
            if (hours > hs2) {
              //第二天时间
              that.setData({
                SDText: "明天" + PFPEndTime2
              });
            } else {
              if (hours == hs2) {
                if (fs2 > minute) {
                  //第二天时间
                  that.setData({
                    SDText: "明天" + PFPEndTime2
                  });
                } else {
                  //第二天时间
                  that.setData({
                    SDText: "明天" + PFPEndTime
                  });
                }
              } else {
                //第二天时间
                that.setData({
                  SDText: "明天" + PFPEndTime2
                });

              }


            }

          } else {
            if (hs == hours) {
              //判断分钟
              if (fs > minute) {
                //今天
                that.setData({
                  SDText: "今天" + PFPEndTime
                });
              } else {
                //第二天时间
                that.setData({
                  SDText: "明天" + PFPEndTime2
                });
              }

            } else {
              //今天
              that.setData({
                SDText: "今天" + PFPEndTime
              });
            }
          }
        }

        list[i].li_img = "/images/cart_b.png"; //选中
        var menoy = 0.00;
        if (id == 2 || id == 1) {
          menoy = that.data.PSJE;
          console.log("menoy=" + that.data.PSJE);
          that.setData({
            PSYS: true,
          });
        } else {
          menoy = 0.00
          that.setData({
            PSYS: false
          });
        }
        console.log("menoy=" + menoy);
        console.log("PSYS=" + that.data.PSYS);
        var TotalMoney = that.data.ContenLlist.TotalMoney;
        if (parseFloat(that.data.couponMoney) > 0) {
          TotalMoney = (TotalMoney * 1) - (parseFloat(that.data.couponMoney) * 1)
        }
        console.log();
        app.Distribution = {
          id: id,
          name: list[i].li_b
        }
        that.setData({
          pstypeid: id,
          Distribution: {
            id: id,
            name: list[i].li_b
          },
          DistributionCost: menoy,
          AmountPayable: ((menoy * 1) + (TotalMoney * 1) - (that.data.DiscountMoney)).toFixed(2)
        });
      } else {
        list[i].li_img = "/images/cart_a.png";
      }
    }
    that.setData({
      tc_li: list
    });

    that.setData({
      flag1: true
    })
  },
  ZFclick: function(e) { //支付方式
    var id = e.currentTarget.dataset.id;
    var list = this.data.tc_lia;

    this.OnlickZF(id);
  },
  OnlickZF: function(id) {
    var list = this.data.tc_lia;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        if (list[i].tc_img == "/images/cart_a.png") {
          list[i].tc_img = "/images/cart_b.png"; //选中
          if (id == 1) {
            this.setData({
              payTypeYJ: true
            });
          } else {
            this.setData({
              payTypeYE: true
            });
          }
          this.setData({
            payType: true,
          });
        } else {
          this.setData({
            payType: false,
          });
          list[i].tc_img = "/images/cart_a.png";
          if (id == 1) {
            this.setData({
              payTypeYJ: false
            });
          } else {
            this.setData({
              payTypeYE: false
            });
          }
        }
      }
    }
    this.setData({
      tc_lia: list
    });
    app.ZF_list = list;

  },
  OnClickTab: function(fid) { //确认支付
    console.log("获取的大大大");
    var that = this

    //判断库存
    var Detaillist = that.data.Detail;
    var nbueddd = 0;
    that.IsStock(function() {
      wx.showToast({
        title: '下单中',
        icon: 'loading'
      }, 5000)
      console.log(that.data.IsPay);
      if (that.data.IsPay) {
        return;
      }
      that.setData({
        IsPay: true
      })

      if (that.data.ContenLlist.UserAddress == null) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'loading',
          duration: 2000
        });
        that.setData({
          IsPay: false
        })
        return;
      }
      if (that.data.ContenLlist.UserPhone == "") {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'loading',
          duration: 2000
        });
        that.setData({
          IsPay: false
        })
        return;
      }
      var Onclick = that.data.Onclick;
      if (Onclick) {
        that.setData({
          Onclick: false
        });
        var OrderNo = that.data.OrderNo;
        var payType = that.data.Payment.id; //支付方式
        console.log("payType=" + payType)
        console.log(app.ZF_list)
        var addressId = app.SHDZ_id; //收货地址id
        //配送方式 1.门店自提 2.送货上门 3.配送卡配送 4货到付款
        var deliveryType = that.data.Distribution.id;
        var remark = that.data.TextST; //备注
        var useCoupon = that.data.PreferentialBool; //是否使用优惠券
        var userCouponId = ""; //优惠券id
        //判断是否使用优惠劵
        var selectCoupon = app.couponList;
        if (selectCoupon.length > 0) {
          useCoupon = true;

          for (var c = 0; c < selectCoupon.length; c++) {
            if (userCouponId.length == 0) {
              userCouponId = selectCoupon[c].Id
            } else {
              userCouponId += "," + selectCoupon[c].Id
            }

          }

        } else {
          useCoupon = false;
          userCouponId = "";
        }

        var id = that.data.orderId; //编号
        var AmountPayable = that.data.AmountPayable;
        var openid = app.openid;
        console.log(deliveryType);
        if (deliveryType > 1) {
          console.log("111=" + that.data.subOrderDate);
          if (that.data.subOrderDate == "请选择预约时间") {
            wx.showToast({
              title: '请选择预约时间',
              icon: 'loading',
              duration: 2000
            });
            that.setData({
              OnclickTJ: true,
              IsPay: false,
              Onclick: true
            })
            return;
          }
          if (that.data.OrderTimeStr == "选择时间") {
            wx.showToast({
              title: '请选择预约时间',
              icon: 'loading',
              duration: 2000
            });
            that.setData({
              OnclickTJ: true,
              IsPay: false,
              Onclick: true
            })
            return;
          }


        }


        if (deliveryType > 2) {
          //获取用户佣金和余额
          app.request('api/User/' + openid + '?marketId=' + app.Market.Id, {}, "GET",
            function(res) {
              if (res.data.flag == true) {
                that.setData({
                  YJPayable: res.data.model.Bonus,
                  YEPayable: res.data.model.Money
                });
                var YJPayable = that.data.YJPayable;
                var YEPayable = that.data.YEPayable;
                if (YJPayable == undefined) {
                  YJPayable = 0;
                }
                if (YEPayable == undefined) {
                  YEPayable = 0;
                }
                // var payTypeYJ = that.data.payTypeYJ;
                var payTypeYJ = false;
                //var payTypeYE = that.data.payTypeYE;
                var payTypeYE = true;
                app.request('api/Order/OrderIsBusinesStr?sidStr=' + that.data.sidStr, {}, "GET",
                  function(res) {
                    console.log("执行中");
                    console.log(res);
                    if (res.data.flag) {
                      console.log("成功");
                      console.log("that.ZFMoney1");
                      that.ZFMoney(payTypeYJ, payTypeYE, addressId, deliveryType, remark, useCoupon, userCouponId, id, openid, OrderNo, AmountPayable, fid);

                    } else {
                      console.log("失败");
                      if (deliveryType == 1) {
                        wx.showModal({
                          title: '提示',
                          content: '该店非营业时间,要等待营业时间开始配送,是否继续购卖?',
                          success: function(res) {
                            if (res.confirm) {
                              console.log('用户点击确定')
                              console.log("that.ZFMoney2");
                              that.ZFMoney(payTypeYJ, payTypeYE, addressId, deliveryType, remark, useCoupon, userCouponId, id, openid, OrderNo, AmountPayable, fid);
                            } else if (res.cancel) {
                              console.log('用户点击取消')
                              that.setData({
                                OnclickTJ: true,
                                IsPay: false,
                                Onclick: true
                              });
                            }
                          }
                        })
                      } else if (deliveryType == 2) {
                        wx.showModal({
                          title: '提示',
                          content: '该店铺未营业,营业时间:' + res.data.msgTime + '。预约单将在店家营业后配送！',
                          success: function(res) {
                            if (res.confirm) {
                              console.log('用户点击确定')
                              console.log("that.ZFMoney3");
                              that.ZFMoney(payTypeYJ, payTypeYE, addressId, deliveryType, remark, useCoupon, userCouponId, id, openid, OrderNo, AmountPayable, fid);
                            } else if (res.cancel) {
                              console.log('用户点击取消')
                              that.setData({
                                OnclickTJ: true,
                                Onclick: true,
                                IsPay: false
                              });
                            }
                          }
                        })

                      } else {
                        console.log("that.ZFMoney4");
                        that.ZFMoney(payTypeYJ, payTypeYE, addressId, deliveryType, remark, useCoupon, userCouponId, id, openid, OrderNo, AmountPayable, fid);
                      }

                    }
                  },
                  function() {
                    wx.showToast({
                      title: '扫码失败',
                      icon: 'loading',
                      duration: 2000
                    });
                  }
                );

              } else {
                that.setData({
                  IsPay: false
                })
                wx.showToast({
                  title: '获取用户失败！',
                  icon: 'loading',
                  duration: 2000
                });
              }
            },
            function(error) { //error
              that.setData({
                IsPay: false
              })
              wx.showToast({
                title: '获取用户失败！',
                icon: 'loading',
                duration: 2000
              });
            }
          );
        } else {
          if (!that.data.IsStoreBusiness && deliveryType == 1) {
            wx.showModal({
              title: '提示',
              content: '非营业时间请使用预约订单！',
              success: function(res) {
                that.setData({
                  OnclickTJ: true,
                  IsPay: false,
                  Onclick: true
                })
                return;

              }

            });
          } else {
            //获取用户佣金和余额
            app.request('api/User/' + openid + '?marketId=' + app.Market.Id, {}, "GET",
              function(res) {
                if (res.data.flag == true) {
                  that.setData({
                    YJPayable: res.data.model.Bonus,
                    YEPayable: res.data.model.Money
                  });
                  var YJPayable = that.data.YJPayable;
                  var YEPayable = that.data.YEPayable;
                  if (YJPayable == undefined) {
                    YJPayable = 0;
                  }
                  if (YEPayable == undefined) {
                    YEPayable = 0;
                  }
                  // var payTypeYJ = that.data.payTypeYJ;
                  var payTypeYJ = false;
                  //var payTypeYE = that.data.payTypeYE;
                  var payTypeYE = true;
                  app.request('api/Order/OrderIsBusinesStr?sidStr=' + that.data.sidStr, {}, "GET",
                    function(res) {
                      console.log("执行中");
                      console.log(res);
                      if (res.data.flag) {
                        console.log("成功");
                        console.log("that.ZFMoney5");
                        that.ZFMoney(payTypeYJ, payTypeYE, addressId, deliveryType, remark, useCoupon, userCouponId, id, openid, OrderNo, AmountPayable, fid);

                      } else {
                        console.log("失败");
                        if (deliveryType == 1) {
                          wx.showModal({
                            title: '提示',
                            content: '该店非营业时间,要等待营业时间开始配送,是否继续购卖?',
                            success: function(res) {
                              if (res.confirm) {
                                console.log('用户点击确定')
                                console.log("that.ZFMoney6");
                                that.ZFMoney(payTypeYJ, payTypeYE, addressId, deliveryType, remark, useCoupon, userCouponId, id, openid, OrderNo, AmountPayable, fid);
                              } else if (res.cancel) {
                                console.log('用户点击取消')
                                that.setData({
                                  OnclickTJ: true,
                                  IsPay: false,
                                  Onclick: true
                                });
                              }
                            }
                          })
                        }
                        if (deliveryType == 2) {
                          wx.showModal({
                            title: '提示',
                            content: '该店铺未营业,营业时间:' + res.data.msgTime + '。预约单将在店家营业后配送！',
                            success: function(res) {
                              if (res.confirm) {
                                console.log('用户点击确定')
                                console.log("that.ZFMoney7");
                                that.ZFMoney(payTypeYJ, payTypeYE, addressId, deliveryType, remark, useCoupon, userCouponId, id, openid, OrderNo, AmountPayable, fid);
                              } else if (res.cancel) {
                                console.log('用户点击取消')
                                that.setData({
                                  OnclickTJ: true,
                                  Onclick: true,
                                  IsPay: false
                                });
                              }
                            }
                          })

                        }

                      }
                    },
                    function() {
                      wx.showToast({
                        title: '扫码失败',
                        icon: 'loading',
                        duration: 2000
                      });
                    }
                  );

                } else {
                  that.setData({
                    IsPay: false
                  })
                  wx.showToast({
                    title: '获取用户失败！',
                    icon: 'loading',
                    duration: 2000
                  });
                }
              },
              function(error) { //error
                that.setData({
                  IsPay: false
                })
                wx.showToast({
                  title: '获取用户失败！',
                  icon: 'loading',
                  duration: 2000
                });
              }
            );
          }

        }

      }

    });
  },
  WXpany: function(OrderNo, money, fid) {
    var that = this;
    money = parseFloat(money) == 0 ? 0.01 : money;
    app.request('api/Order/PrePay', {
        openId: app.openid,
        payMoney: money,
        orderIds: OrderNo,
        frimd: fid
      }, "GET",
      function(res) {
        var nonceStr = res.data.nonceStr;
        if (res.data.flag) {
          console.log("微信支付");
          console.log("OrderNo:" + OrderNo);
          wx.requestPayment({
            'nonceStr': res.data.prepay.nonceStr,
            'package': res.data.prepay.package,
            'signType': 'MD5',
            'timeStamp': res.data.prepay.timeStamp,
            'paySign': res.data.prepay.paySign,
            success: function(res) {
              if (res.errMsg == "requestPayment:ok") {
                //跳转
                wx.navigateTo({
                  url: '../shop_money/shop_money?orderId=' + OrderNo + '&AmountPayable=' + money
                })

              } else {
                wx.showToast({
                  title: '支付失败',
                  icon: 'loading',
                  duration: 2000
                });

              }
            },
            fail: function(er) {

              console.log(er);
              console.log("关闭")
              wx.redirectTo({
                url: '../shop_order/shop_order?id=' + app.ISorederid
              })
            }
          })
        } else {
          wx.showToast({
            title: '支付失败',
            icon: 'loading',
            duration: 2000
          });
        }
      },
      function() { //error
        wx.showToast({
          title: '支付失败！',
          icon: 'loading',
          duration: 2000
        });
      });

  },
  ZFMoney: function(payTypeYJ, payTypeYE, addressId, deliveryType, remark, useCoupon, userCouponId, id, openid, OrderNo, AmountPayable, fid) {
    var that = this
    console.log("支付");
    console.log("deliveryType：" + deliveryType);
    
    var OrderTimeStr = "";
    var TimeStr = "";
    if (deliveryType==4){
      var indx1 = that.data.dayPt[0];
      var indx2 = that.data.dayPt[1];
      var PFPStartTime = that.data.PFPStartTime;
      var PFPEndTime = that.data.PFPEndTime;
      var PFPStartTime2 = that.data.PFPStartTime2;
      var PFPEndTime2 = that.data.PFPEndTime2;
      if (indx1==0){
        OrderTimeStr = "今天";
       
      }else{
        OrderTimeStr ="明天";
      
      }
      if (indx2==0){
        TimeStr = PFPEndTime;
      }else{
        TimeStr = PFPEndTime2;
      }
     
      
    }else{
      var indx1 = that.data.dt_index[0];
      var indx2 = that.data.dt_index[1];
      var indx3 = that.data.dt_index[2];
      var time1 = that.data.dt_array[0];
      var time2 = that.data.dt_array[1];
      var time3 = that.data.dt_array[2];
       OrderTimeStr = time1[indx1];
       TimeStr = time2[indx2].split("时").join("") + ":" + time3[indx3].split("分").join("");
    }
    console.log("选择时间：" + OrderTimeStr + "-" + TimeStr);

    console.log("userCouponId" + userCouponId);
    var Payable = 0;
    app.request('api/Order/Pay', {
        "payTypeYJ": payTypeYJ,
        "payTypeYE": payTypeYE,
        "addressId": addressId,
        "deliveryType": deliveryType,
      "delivery": that.data.DistributionCost,//配送费
        "remark": remark,
        "useCoupon": useCoupon,
        "userCouponId": userCouponId,
        "storeId": app.storeId,
        "makeTime": OrderTimeStr,
        "makeNuber": TimeStr,
        "id": id,
        "openid": openid
      }, "POST",
      function(res) {
        console.log("订单修改完成");
        console.log(res);
        if (res.data.flag == true) {
          //微信支付
          console.log("微信支付payType=" + that.data.payType);
          console.log("AmountPayable=" + AmountPayable);
          console.log("Payable=" + Payable);
          var money = AmountPayable - Payable;

          if (!that.data.payType) {
            money = AmountPayable;
          }
          console.log("money=" + money);
          // money=0.01;
          console.log("that.WXpany1");
          that.WXpany(OrderNo, money, fid);

        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg
          });
          console.log("重置页面");
          //重置页面
          that.setData({
            OnclickTJ: true,
            Onclick: true,
            IsPay: false
          });


        }
      },
      function(error) { //error
        wx.showToast({
          title: '支付失败',
          icon: 'loading',
          duration: 2000
        });
      }
    );
  },
  WXZFMoney: function(OrderNo, AmountPayable) {
    var that = this
    //数据清空
    app.PreferentialId = 0;
    app.PreferentialPrice = 0;

    app.couponList = [], //选择的优惠券
      app.couponMoney = 0, //优惠金额
      that.setData({
        paytype: 1
      });
    wx.redirectTo({
      url: '../shop_money/shop_money?orderId=' + OrderNo + '&AmountPayable=' + AmountPayable
    })
  },
  //form 提交
  orderSign: function(e) {
    var that = this
    if (that.data.Distribution.id==4){
      if (that.data.islogin) {
        wx.showToast({
          title: '请选择送达时间！',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    }
    
    if (!that.data.StoreBusiness) {
      wx.showToast({
        title: '有打烊店铺产品，不能下单哦！请重新下单。',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (that.data.IsPublish) {
      if (that.data.OnclickTJ) {
        that.setData({
          OnclickTJ: false
        });
        console.log("0000000");
        var fId = e.detail.formId;
        var fObj = e.detail.value;
        var orderId = that.data.newOrderId == null ? that.data.orderId : that.data.newOrderId;
        var OrderNo = "";
        var AmountPayable = "";
        console.log(e.detail.formId);
        //判断是否在配送距离
        console.log("判断是否在配送距离");

        that.SelectDistance(
          function() {
            that.OnClickTab(fId)
          }
        );
      }
    } else {
      wx.showToast({
        title: '有下架产品不能购买！',
        icon: 'loading',
        duration: 2000
      });
    }



  },
  //判断配送距离
  SelectDistance(next) {
    var that = this
    // 引入SDK核心类
    var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
    var latitudet;
    var longitudet;
    // 实例化API核心类
    var demo = new QQMapWX({
      key: '2FABZ-QNAWX-QBV4I-7U2QC-D3RTQ-BTB7O' // 必填
    });
    var store = app.Store; //市场
    var AddressId = app.SHDZ_id; //收货地址id
    console.log("AddressId=" + AddressId);
    app.request("api/Address/" + AddressId, {}, 'GET', function(res) {
      console.log(res);
      if (res.data.flag) {
        console.log("!!!!!!!1");
        var userAddre = res.data.model;

        var DLat = userAddre.Lat;
        var DLng = userAddre.Lng;
        var QLat = store.Lat;
        var QLng = store.Lng;

        demo.calculateDistance({
          from: {
            latitude: parseFloat(QLat),
            longitude: parseFloat(QLng)
          },
          to: [{
            latitude: parseFloat(DLat),
            longitude: parseFloat(DLng)
          }],
          success: function(res) {
            console.log("比较距离");
            console.log(res);
            var distance = 0;
            if (res.result != undefined) {
              distance = res.result.elements[0].distance;
            }
            console.log("距离=" + distance + "m");
            console.log("distance" + that.data.distance + "m");
            var deliveryType = that.data.Distribution.id;
            console.log("deliveryType=" + deliveryType);
            if (deliveryType < 3) {
              if (that.data.distance > distance) {
                //继续下单
                next();
              } else {
                //提示
                wx.showToast({
                  title: '超出配送范围！',
                  icon: 'none',
                  duration: 2000
                });
                that.setData({
                  OnclickTJ: true
                });
              }
            } else {
              //继续下单
              next();
            }

          }
        });
      } else {

        wx.showToast({
          title: '请选择地址',
          icon: 'loading',
          duration: 2000
        });
      }
    }, function() {})
  },
  //判断配送距离
  GetDistance() {
    console.log("计算配送金额" );
    var that = this
    // 引入SDK核心类
    var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
    var latitudet;
    var longitudet;
    // 实例化API核心类
    var demo = new QQMapWX({
      key: '2FABZ-QNAWX-QBV4I-7U2QC-D3RTQ-BTB7O' // 必填
    });
    var store = app.Store; //市场
    var AddressId = app.SHDZ_id; //收货地址id
    console.log("AddressId=" + AddressId);
    if (AddressId>0){
      console.log("获取地址距离");
      app.request("api/Address/" + AddressId, {}, 'GET', function (res) {
        console.log(res);
        if (res.data.flag) {
          console.log("!!!!!!!1");
          var userAddre = res.data.model;
          var DLat = userAddre.Lat;
          var DLng = userAddre.Lng;
          var QLat = store.Lat;
          var QLng = store.Lng;
          demo.calculateDistance({
            from: {
              latitude: parseFloat(QLat),
              longitude: parseFloat(QLng)
            },
            to: [{
              latitude: parseFloat(DLat),
              longitude: parseFloat(DLng)
            }],
            success: function (res) {
              console.log("比较距离");
              console.log(res);
              var distance = 0;
              if (res.result != undefined) {
                distance = res.result.elements[0].distance;
              }
              console.log("距离=" + distance + "m");
              console.log("distance" + that.data.distance + "m");
              var gl = parseInt(parseFloat(distance) / 1000);
              //计算配送费
              console.log("公里=" + gl);
              var DistributionCost=0;
              if (gl>3){
                var PSJE=6;
                var psnub = parseInt((gl - 3)*2)  ;
                console.log("psnub=" + psnub);
                PSJE = PSJE + psnub

              }else{
                var PSJE = gl <= 1 ? 4 : gl == 2 ? 5 : gl == 3 ? 6 :0;
              }

              // wx.showToast({
              //   title: gl + '公里' + ',费用：' + PSJE,
              //   icon: 'none',
              //   duration: 2000
              // });
              if (that.data.Distribution.id<3){
                psmoney: PSJE
              }

              var AmountPayable = parseFloat(that.data.ContenLlist.TotalMoney) 
              if (that.data.Distribution.id<3){
                DistributionCost = PSJE;
                AmountPayable += + parseFloat(DistributionCost)
              }
             
              that.setData({
                PSJE: PSJE.toFixed(2),
                AmountPayable: AmountPayable.toFixed(2),
                DistributionCost: DistributionCost.toFixed(2)
              });
              

            }
          });
        } else {
          wx.showToast({
            title: '请选择地址',
            icon: 'loading',
            duration: 2000
          });
        }
      }, function () { })
    }
  },
  //选择优惠券
  chooseCoupon: function(event) {

    let Id = event.currentTarget.dataset.orderid;
    console.log("Id=" + Id);
    console.log("newOrderId=" + this.data.newOrderId);
    wx.navigateTo({
      url: '../../../pages/my/my_yhj/my_yhj?orderId=' + this.data.orderId
    })
  },
  //选择收货地址
  GoToAdress: function() {
    var id = this.data.orderId
    wx.navigateTo({
      url: '../../../pages/my/my_shdz/my_shdz?id=' + id,
    })
  },
  //判定库存是否足够
  IsStock: function(next) {
    var that = this;
    //判断库存
    var mage = true;
    var Detaillist = that.data.Detail;
    var nbueddd = 0;
    for (var p = 0; p < Detaillist.length; p++) {
      var UnitId = Detaillist[p].UnitId;
      var Uname = Detaillist[p].ProductName;
      wx.request({
        url: app.name + 'api/Product/GetInventory?id=' + UnitId,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + that.apiAcessToken
        },
        data: {},
        success: function(res) {
          if (res.data.msg <= 0) {
            that.setData({
              IsStock: false
            })
            wx.showToast({
              title: '有产品库存不足',
              icon: 'loading',
              duration: 2000
            });
            that.setData({
              magess: false
            })

            return false;
          } else {
            next();
          }

        },
        fail: function(res) {}
      })
    }

  },
  //获取最高优惠券
  GetOrderCoupon: function(id) {
    var that = this;
    if (app.appUserType == 1) {
      wx.request({
        url: app.name + 'api/Order/OrderCouponSelect?id=' + id,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + that.apiAcessToken
        },
        data: {},
        success: function (res) {
          console.log("&&&&&&&&&&&&&&&7");
          console.log(res);
          var list = res.data.list;
          var money = res.data.couponMoney;
          var AmountPayable = parseFloat(that.data.ContenLlist.TotalMoney) + parseFloat(that.data.DistributionCost) - parseFloat(money) - parseFloat(that.data.DiscountMoney);
          that.setData({
            selectCoupon: list,
            couponMoney: money,
            PreferentialAmount: parseFloat(money).toFixed(2),
            AmountPayable: AmountPayable.toFixed(2)
          })
          app.couponList = list;
          app.couponMoney = money;
          app.couponFrom = false;
        },
        fail: function (res) { }
      })
    }
    

  },
  bindDayChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dayPt: e.detail.value,
      islogin:false
    })

  },
  bindMulDay: function (e) {
    var that = this
    //获取时间
    var now = new Date();
    var hours = now.getHours();
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var PFPStartTime = that.data.PFPStartTime;
    var PFPEndTime = that.data.PFPEndTime;
    var PFPStartTime2 = that.data.PFPStartTime2;
    var PFPEndTime2 = that.data.PFPEndTime2;
    if (parseInt(e.detail.column)==0){
      var dayPtArray = [];
      dayPtArray[0] = ['今天', '明天'];
      dayPtArray[1] = ["上午" + PFPEndTime + "点前送达", "下午" + PFPEndTime2 + "点前送达"] ;

      //今天
      if (parseInt(e.detail.value)==0){
        //判断今天时间
        var hs = PFPStartTime.split(":")[0];
        var fs = PFPStartTime.split(":")[1];
        var hs2 = PFPStartTime2.split(":")[0];
        var fs2 = PFPStartTime2.split(":")[1];
        if (hours > hs) {
          if (hours > hs2) {
            dayPtArray[0] = ['明天'];
            //第二天时间
            that.setData({
              dayPtArray: dayPtArray
            });
          } else {
            if (hours == hs2) {
              if (fs2 > minute) {
                dayPtArray[0] = ['明天'];
                //第二天时间
                that.setData({
                  dayPtArray: dayPtArray
                });
              } else {
                dayPtArray[0] = ['今天', '明天'];
                dayPtArray[1] = ["下午" + PFPStartTime2 + "前送达"];
                //第二天时间
                that.setData({
                  dayPtArray: dayPtArray
                });
              }
            } else {
              console.log("正确");
              dayPtArray[0] = ['今天', '明天'];
              dayPtArray[1] = ["下午" + PFPEndTime2 + "前送达"];
              //第二天时间
              that.setData({
                dayPtArray: dayPtArray
              });
              console.log(dayPtArray);

            }


          }

        } else {
          if (hs == hours) {
            //判断分钟
            if (fs > minute) {
              //今天
              that.setData({
                dayPtArray: dayPtArray
              });
            } else {
              dayPtArray[0] = ['今天', '明天'];
              dayPtArray[1] = ["下午" + PFPEndTime2 + "前送达"];
              //第二天时间
              that.setData({
                dayPtArray: dayPtArray
              });
            }

          } else {
            that.setData({
              dayPtArray: dayPtArray
            });
          }
        }
      }else{
        //明天
        that.setData({
          dayPtArray: dayPtArray
        });

        
      }

    }
  },






})
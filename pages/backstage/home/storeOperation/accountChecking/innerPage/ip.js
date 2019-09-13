const app = getApp()
Page({
  data: {
    HomEntity:{},
  },
  onLoad: function (options) {
    console.log("获取数据");
    console.log(app.HomEntity);
    var HomEntity = app.HomEntity;
    HomEntity.Turnover = parseFloat(HomEntity.Turnover).toFixed(2);
    HomEntity.Profit = parseFloat(HomEntity.Profit).toFixed(2);
    HomEntity.Activity = parseFloat(HomEntity.Activity).toFixed(2);
    HomEntity.Payment = parseFloat(HomEntity.Payment).toFixed(2);
    HomEntity.MarketMoney = parseFloat(HomEntity.MarketMoney).toFixed(2);
    this.setData({
      HomEntity: HomEntity
    });
  },
})
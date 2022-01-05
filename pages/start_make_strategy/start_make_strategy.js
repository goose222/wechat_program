// pages/start_make_strategy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  start:function(){
    wx.navigateTo({
      url: 'make_strategy/make_strategy'
    })
    },

    holding:function(){
      wx.navigateTo({
        url: "/pages/hold_shares/hold_shares"
      })
      },
  
    working:function(){
    wx.navigateTo({
      url: "/pages/strategy_working/strategy_working"
    })
    },

  strategy:function(){
    wx.navigateTo({
      url: "/pages/buy_sell/buy_sell"
    })
  },

})
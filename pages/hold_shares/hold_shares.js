// pages/hold_shares/hold_shares.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[{'symbol':'ag101','price':0,'direction':'null','volume':0,'exchange':'SHFE'},
          {'symbol':'ag102','price':0,'direction':'null','volume':0,'exchange':'SHFE'}]
  },

  close_position: function(){
    let info = this.data.info;
    //用来保存选中的答案
    let answerSelected = null;
    let isSelected = false;
    for (let item of info) {
      if (item.selected) {
        //答案被选中
        isSelected = true;
        answerSelected=item;
        var that=this;
        wx.request({
          url: 'http://127.0.0.1:5000/close_position/'+that.data.user,//对应url 提交平仓对象 后台根据数据进行操作 
          data: {'info':answerSelected},
          method:'POST',
          success:function(res){//返回值为成功操作后的持仓情况,更新展示
            console.log(res)
            that.setData({
              info:res.data.info
            });
          }
        })
      }
    }
    console.log(answerSelected);
    wx.request({
      url: 'http://127.0.0.1:5000/get_holding/'+that.data.user,//对应url
      data: {},
      method:'GET',
      success:function(res){
        console.log(res);
        that.setData({
          info: res.data.info
        });
      }
    })
  },

  answerSelected(e) {
    let index = e.currentTarget.dataset.index;
    console.log(index)
    let info = this.data.info;
    for (let item of info) {
      item.selected = false;
    }
    info[index].selected = true;
    this.setData({
      info: this.data.info
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: 'http://127.0.0.1:5000/get_holding/'+that.data.user,//对应url
      data: {},
      method:'GET',
      success:function(res){
        console.log(res);
        that.setData({
          info: res.data.info
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
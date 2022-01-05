// pages/start_make_strategy/make_strategy/finish_strategy/finish_strategy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'',
    answerSelected:'',
    id_list:''
  },

  start_strategy: function (){
    wx.request({
      url: 'http://127.0.0.1:5000/finish_strategy/'+this.data.user,
      data: {'answerSelected':this.data.answerSelected,'id_list':this.data.id_list},
      method:'POST',
      success:function(res){
        console.log(res)
      }
    })
    wx.navigateTo({
      url: "/pages/start_make_strategy/start_make_strategy"
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'user',
      success: function(res) {
        console.log(res.data)
        that.setData({
          user: res.data.user
        })
      }
    })
    wx.getStorage({
      key: 'answer',
      success: function(res) {
        console.log(res.data)
        that.setData({
          answerSelected:res.data.answerSelected,
          id_list:res.data.id_list
        })
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
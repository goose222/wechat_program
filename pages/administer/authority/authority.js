// pages/administer/authority/authority.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input_name:'',
    select_name: [],
    user_info:[],
    btns: [{'content':'一般用户'}, {'content':'管理员'}],     
    active:0,   
  },

  toggle:function(e){
    console.log(e.currentTarget.dataset.index)
    this.setData({
      //设置active的值为用户点击按钮的索引值
      active:e.currentTarget.dataset.index,
    })
    var that=this
    wx.request({
      url: 'http://127.0.0.1:5000/administer_authority_get',
      data: {user_id:'',authority:that.data.active.toString()},
      method:'POST',
      success:function(res){
        console.log(res);
        that.setData({
          user_info: res.data.result,
          select_name: []
        })
      }
    })
  },

  bindKeyInput_name: function (e) {
    this.setData({
      input_name:e.detail.value,
    })
  },
  
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    const user_info = this.data.user_info
    const values = e.detail.value
    var that=this;
    for (let i = 0, lenI = user_info.length; i < lenI; ++i) {
      user_info[i].checked = false
      that.setData({
        select_name: []
      }); 
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (user_info[i].value === values[j]) {
          user_info[i].checked = true
          break
        }
      that.setData({
        select_name: e.detail.value
      }); 
      console.log(that.data.select_name)
      }
    }
  },

  search: function(){
    var that=this
    wx.request({
      url: 'http://127.0.0.1:5000/administer_authority_get',
      data: {user_id:this.data.input_name,authority:this.data.active.toString()},
      method:'POST',
      success:function(res){
        console.log(res.data);
        that.setData({
          user_info: res.data.result,
        })
      }
    })
  },

  showall: function(){
    var that=this
    wx.request({
      url: 'http://127.0.0.1:5000/administer_authority_get',
      data: {user_id:'',authority:this.data.active.toString()},
      method:'POST',
      success:function(res){
        console.log(res.data);
        that.setData({
          user_info: res.data.result,
          input_name: ''
        })
      }
    })
  },
  
  modify1: function(){
    var that=this
    wx.request({
      url: 'http://127.0.0.1:5000/administer_authority_set',
      data: {user_id:this.data.select_name,authority:'1'},
      method:'POST',
      success:function(res){
        console.log(res);
        for (let i = 0, lenI = that.data.user_info.length; i < lenI; ++i) {
          that.data.user_info[i].checked = false
        }
        that.setData({
          user_info: res.data.result,
          select_name: []
        })
      }
    })
  },

  modify2: function(){
    var that=this
    wx.request({
      url: 'http://127.0.0.1:5000/administer_authority_set',
      data: {user_id:this.data.select_name,authority:'0'},
      method:'POST',
      success:function(res){
        console.log(res);
        if (res.data.result==[]){
          console.log('没有人');
        }
        else{
          for (let i = 0, lenI = that.data.user_info.length; i < lenI; ++i) {
            that.data.user_info[i].checked = false
          }
          that.setData({
            user_info: res.data.result,
            select_name: []
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this
    wx.request({
      url: 'http://127.0.0.1:5000/administer_authority_get',
      data: {user_id:this.data.input_name,authority:this.data.active.toString()},
      method:'POST',
      success:function(res){
        console.log(res);
        that.setData({
          user_info: res.data.result,
        })
      }
    })
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
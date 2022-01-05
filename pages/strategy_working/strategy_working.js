// pages/strategy_working/strategy_working.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],
    subscribe:["fu2102.SHFE"],

    array: ['买入', '卖出', '平仓'],
    index: 0,

    minusStatus: true,
    count: 1,

    showModal_delete:false,
    user: ''
  },

  bindKeyInput: function (e) {
    this.setData({
      count:e.detail.value,
    })
  },

  //数字加1
  addNum: function() {
    var count = this.data.count;
    count++;
    console.log(count)
    this.setData({
      count: count,
      minusStatus: false
    })
  },
  //数字减1
  minusNum: function() {
    var count = this.data.count;
    if (count > 1) {
      count--;
    }
    //数字<=1时，开启 - 按钮的disable状态
    var minusStatus = count <= 1 ? true : false; 
    this.setData({
      count: count,
      minusStatus: minusStatus
    });
  },
  
  buy_sell: function() {
    var direction=this.data.array[this.data.index]
    var volume=this.data.count

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
          url: 'http://127.0.0.1:6000/buy_sell_cover/'+that.data.user,//对应url 提交交易对象及操作 后台根据数据进行操作 
          data: {'vt_symbol':answerSelected.vtSymbol,"volume":volume,'direction':direction},//需要在后台处理direction，即操作类型。有买卖平仓三种
          method:'POST',
          success:function(res){//返回值为操作信息（是否成功）
            console.log(res.data)
          }
        })
      }
    }
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  add: function(){
    wx.closeSocket()
    wx.navigateTo({
      url: "/pages/strategy_working/subscribe/subcribe"
    })
  },

  delete:function(){
    this.setData({
      showModal_delete:true,
    })
  },

  modalCancel_delete:function(){
    this.setData({
      showModal_delete:false,
    })
  },

  modalConfirm_delete:function(){
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
        that.setData({
          showModal_delete:false,
        })
        wx.request({
          url: 'http://127.0.0.1:5000/delete_subscribe/'+that.data.user,//对应url 提交平仓对象 后台根据数据进行操作 
          data: {'vtSymbol':answerSelected.vtSymbol},
          method:'POST',
          success:function(res){//返回值为成功操作后的订阅情况,更新展示（返回更新后的subscribe）
            wx.showToast({
              title: res.data.info,
              icon: 'none',
              duration: 1500
            })
            that.setData({
              subscribe:res.data.subscribe
            });
          }
        })
      }
    }
    console.log(answerSelected);
  },


  all:function(){
    wx.closeSocket()
    wx.navigateTo({
      url: "/pages/strategy_working/all_info/all_info"
    })
  },

  k_line:function(){
    wx.closeSocket()
    wx.navigateTo({
      url: "/pages/k_line/k_line"
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
      info: info,
    });
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
         wx.request({
          url: 'http://127.0.0.1:5000/get_subscribe/'+res.data.user,//对应url 获取后台从数据库抓取的用户订阅信息
          data: {},
          method:'GET',
          success:function(res){//返回值为用户订阅信息,更新展示
            console.log(res.data)
            wx.showToast({
              title: res.data.info,
              icon: 'none',
              duration: 1500
            })
            that.setData({
              subscribe:res.data.subscribe
            });
          }
        })
      }
    })
    wx.onSocketOpen(function (res) {
      console.log("socket打开");
      wx.sendSocketMessage({
        success: function (res) {
        },
        fail: function (res) {
        }
      });
      wx.onSocketMessage(function (res) {
        console.log('接收到信息',res);
        var old=that.data.info;
        //console.log('first old'+old)
        var data=JSON.parse(res.data)
        var flag1=false
        //console.log('subscribe '+that.data.subscribe)
        for(let i of that.data.subscribe){
          //console.log('i'+i)
          //console.log('vtsymbol'+data.vtSymbol)
          if (i==data.vtSymbol){//是否是订阅？
            flag1=true
          }
        }
        console.log(flag1)
        if(flag1){
          var flag=false
          data.dateTime=data.dateTime.substring(10, 19)
          for(let x of old){
            if(data.vtSymbol==x.vtSymbol){
              x.lastPrice = data.lastPrice;
              x.dateTime = data.dateTime;
              flag=true
              break
            }
          }
          if (!flag){
            old.push(data)
          }
        }
        console.log('old'+old)
        that.setData({
          info:old
        })
        console.log('infomation',that.data.info);
      }),
        wx.onSocketClose(function (data) {
          console.log('已经退出成功');
        })
    })
    wx.connectSocket({
      url:"ws://127.0.0.1:7000/test",
      success: res => {
        console.log('小程序连接成功：', res);
      },
      fail: err => {
        console.log('出现错误啦！！' + err);
        wx.showToast({
          title: '网络异常！',
        })
      }
    });
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
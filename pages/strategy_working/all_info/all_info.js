// pages/strategy_working/all_info/all_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],
    select:[],

    multiArray: [['SHFE', 'DCE','INE','CZCE'], ['ag', 'al', 'au', 'bu', 'cu','fu','hc','ni','pb','rb','ru','sn','sp','ss','wr','zn']],
    multiIndex: [0, 0],
    
    array: ['买入', '卖出', '平仓'],
    index: 0,

    minusStatus: true,
    count: 1,
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
  
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value,
      select:[this.data.multiArray[1][e.detail.value[1]]+'.'+this.data.multiArray[0][e.detail.value[0]]]
    })
    console.log(this.data.select)
  },

  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['ag', 'al', 'au', 'bu', 'cu','fu','hc','ni','pb','rb','ru','sn','sp','ss','wr','zn'];
            break;
          case 1:
            data.multiArray[1] = ['a', 'b', 'bb','c','cs','eb','eg','fb','i','j','jd','jm','l','lh','m','p','pg','pp','rr','v','y'];
            break;
          case 2:
            data.multiArray[1] = ['sc'];
            break;
          case 3:
            data.multiArray[1] = ['AP','CF','CJ','CY'];
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
    console.log(data.multiArray[0][data.multiIndex[0]],data.multiArray[1][data.multiIndex[1]]);
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
        var data=JSON.parse(res.data)
        var flag=false
        var flag1=false
        for(let i of that.data.select){
          if (i[0]+i[1]==data.vtSymbol[0]+data.vtSymbol[1]){//是否是订阅？
            flag1=true
          }
        }
        if(flag1){
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
      url:"ws://127.0.0.1:5000/test",
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
  
  answerSelected(e) {
    let index = e.currentTarget.dataset.index;
    console.log(index)
    let info = this.data.info;info
    info[index].selected = !info[index].selected;
    this.setData({
      info: info
    });
  },

  submit:function(){
    let info = this.data.info;
    //用来保存选中的答案
    let multiAnswer = [];
    for (let item of info) {
      if (item.selected) {
        //答案被选中
        multiAnswer.push(item.vtSymbol);
      }
    }
    console.log(multiAnswer)
    var that=this
    wx.request({
      url: 'http://127.0.0.1:5000/add_subscribe/'+that.data.user,//对应url 提交添加
      data: {'vtSymbollist':multiAnswer},
      method:'POST',
      success:function(res){//返回值为成功操作后的订阅
        that.setData({
          info:res.data
        });
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
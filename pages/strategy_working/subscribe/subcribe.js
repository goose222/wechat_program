Page({
  data: {
    multiArray: [['SHFE', 'DCE','INE','CZCE'], ['ag', 'al', 'au', 'bu', 'cu','fu','hc','ni','pb','rb','ru','sn','sp','ss','wr','zn'], ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201']],
    multiIndex: [0, 0, 0],
    select:[],
    num:1,
    info:[],
    user:''
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    var vt=this.data.multiArray[1][e.detail.value[1]]+this.data.multiArray[2][e.detail.value[2]]+'.'+this.data.multiArray[0][e.detail.value[0]];
    var selection= this.data.select;
    selection.push(vt);
    this.setData({
      num: this.data.num+1,
      select: selection,
    })
    console.log(vt,selection)

  },

  submit:function(){
    var that=this
    console.log(that.data.select)
    if(that.data.select==[]){
      wx.showToast({
        title: '添加订阅为空',
        icon: 'none',
        duration: 1500
      })
    }else{
      wx.getStorage({
        key: 'user',
        success: function(res) {
          console.log(res.data)
          that.setData({
            user: res.data.user
          })
        }
      })
      wx.request({
        url: 'http://127.0.0.1:5000/add_subscribe/'+that.data.user,//对应url 提交添加
        data: {'vtSymbollist':that.data.select},
        method:'POST',
        success:function(res){//返回值为成功操作后的订阅
          that.setData({
            info:res.data
          });
        }
      });
      wx.navigateTo({
        url: "/pages/strategy_working/strategy_working"
      })
    }
  },

  back:function(){
    wx.navigateTo({
      url: "/pages/strategy_working/strategy_working"
    })
  },

  delInput:function(e){
    var nowidx=e.currentTarget.dataset.idx;//当前索引
    var oldarr=this.data.select;//循环内容
    oldarr.splice(nowidx,1);    //删除当前索引的内容，这样就能删除view了
    if (oldarr.length < 1) {
        oldarr = []  //如果循环内容长度为0即删完了，必须要留一个默认的。这里oldarr只要是数组并且长度为1，里面的值随便是什么
    }
    this.setData({
        select: oldarr,
    })
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
            data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
            break;
          case 1:
            data.multiArray[1] = ['a', 'b', 'bb','c','cs','eb','eg','fb','i','j','jd','jm','l','lh','m','p','pg','pp','rr','v','y'];
            data.multiArray[2] = [ '2103','2105','2107','2109','2111','2201'];
            break;
          case 2:
            data.multiArray[1] = ['sc'];
            data.multiArray[2] = ['103', '105','110','111','112','201'];
            break;
          case 3:
            data.multiArray[1] = ['AP','CF','CJ','CY'];
            data.multiArray[2] = ['103', '105','110','111','112','201'];
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 1:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 2:
                data.multiArray[2] = ['2102', '2103','2104','2106','2108','2110','2112','2202'];
                break;
              case 3:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2109','2112','2203','2206','2209','2212'];
                break;
              case 4:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 5:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 6:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 7:
                data.multiArray[2] =['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 8:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 9:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 10:
                data.multiArray[2] = [ '2103','2104','2105','2106','2107','2108','2109','2110','2111','2201'];
                break;
              case 11:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 12:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 13:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 14:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 15:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = [ '2103','2105','2107','2109','2111','2201'];
                break;
              case 1:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
              case 2:
                data.multiArray[2] = ['2102', '2103','2104','2105','2106','2107','2108','2109','2110','2111','2112','2201'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
    console.log(data.multiArray[0][data.multiIndex[0]],data.multiArray[1][data.multiIndex[1]],data.multiArray[2][data.multiIndex[2]]);
  },

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
    
  },

})
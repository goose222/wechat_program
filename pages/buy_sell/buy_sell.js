// pages/strategy_working/buy_sell/buy_sell.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    strategy_array: ['策略1', '策略2', '策略3', '策略4','全部'],
    object_array:[{'obj_name':'对象名称','state':'状态'}],
    index: 0,
    obj_info:[],
    showModal:false,
    showModal_delete:false,
    obj_name:'',
    strategy_parameter:[{'name':'价差','data':'30'},{'name':'合约名称','data':'ag2102'}],
    input_index:0,
    user:''
  },

  bindPickerChange: function(e) {
    var that=this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      index: e.detail.value
    })
    wx.request({
      url: 'http://127.0.0.1:5000/get_obj/'+that.data.user,//对应url 提交查询策略及操作 后台根据数据进行操作 
      data: {'strategy':this.data.strategy_array[that.data.index]},
      method:'POST',
      success:function(res){//返回值为策略对应的对象列表
        console.log(res.data)
        that.setData({
          object_array:res.data.objs
        })
        console.log(that.data.object_array)
      }
    })
    wx.request({
      url: 'http://127.0.0.1:5000/get_strategy_parameter/'+that.data.user,//对应url 提交获取策略 后台根据数据进行操作 
      data: {'strategy':that.data.strategy_array[that.data.index]},
      method:'POST',
      success:function(res){//返回值为操作信息 策略列表）
        console.log(res.data)
        that.setData({
          strategy_parameter:res.data.strategy_parameters,
        })
      }
    })
    
  },

  start:function(){
    let object_array = this.data.object_array;
    //用来保存选中的答案
    let answerSelected = null;
    let isSelected = false;
    for (let item of object_array) {
      if (item.selected) {
        //答案被选中
        isSelected = true;
        answerSelected=item;
        var that=this;
        wx.request({
          url: 'http://127.0.0.1:5000/start_obj/'+that.data.user,//对应url 提交开始的对象 
          data: {'obj':answerSelected.obj_name,'strategy':that.data.strategy_array[that.data.index]},
          method:'POST',
          success:function(res){//返回值操作是否成功，并在数据库修改数据状态，将新的修改后的obj返回
            console.log(res.data)
            that.setData({
              object_array:res.data
            })
            wx.showToast({
              title: res.data,
              icon: 'none',
              duration: 1500
            })
            wx.request({
              url: 'http://127.0.0.1:5000/get_obj/'+that.data.user,//对应url 提交查询策略及操作 后台根据数据进行操作 
              data: {'strategy':that.data.strategy_array[that.data.index]},
              method:'POST',
              success:function(res){//返回值为策略对应的对象列表
                console.log(res.data)
                that.setData({
                  object_array:res.data.objs
                })
                console.log(that.data.object_array)
              }
            })
          }
        })
      }
    }
  },

  stop:function(){
    let object_array = this.data.object_array;
    //用来保存选中的答案
    let answerSelected = null;
    let isSelected = false;
    for (let item of object_array) {
      if (item.selected) {
        //答案被选中
        isSelected = true;
        answerSelected=item;
        var that=this;
        wx.request({
          url: 'http://127.0.0.1:5000/stop_obj/'+that.data.user,//对应url 提交结束的对象 
          data: {'obj':answerSelected.obj_name,'strategy':that.data.strategy_array[that.data.index]},
          method:'POST',
          success:function(res){//返回值操作是否成功，并在数据库修改数据状态，将新的修改后的obj返回
            console.log(res.data)
            that.setData({
              obj_info:res.data
            })
            wx.showToast({
              title: res.data,
              icon: 'none',
              duration: 1500
            })
          }
        })
        wx.request({
          url: 'http://127.0.0.1:5000/get_obj/'+that.data.user,//对应url 提交查询策略及操作 后台根据数据进行操作 
          data: {'strategy':this.data.strategy_array[that.data.index]},
          method:'POST',
          success:function(res){//返回值为策略对应的对象列表
            console.log(res.data)
            that.setData({
              object_array:res.data.objs
            })
            console.log(that.data.object_array)
          }
        })
      }
    }
  },

  add:function(){
    var that=this
    this.setData({
      showModal:true
    })

  },

  delete:function(){
    var that=this
    this.setData({
      showModal_delete:true
    })
    
  },

  modalCancel_delete:function(){
    this.setData({
      showModal_delete:false,
    })
  },

  modalConfirm_delete:function(){
    let object_array = this.data.object_array;
    //用来保存选中的答案
    let answerSelected = null;
    let isSelected = false;
    for (let item of object_array) {
      if (item.selected) {
        //答案被选中
        isSelected = true;
        answerSelected=item;
        var that=this;
        that.setData({
          showModal:false,
          obj_name:''
        })
        wx.request({
          url: 'http://127.0.0.1:5000/delete_obj/'+that.data.user,//对应url 提交删除的对象 
          data: {'obj':answerSelected.obj_name,'strategy':that.data.strategy_array[that.data.index]},
          method:'POST',
          success:function(res){//返回值操作是否成功，并在数据库修改数据状态，将新的修改后的obj返回
            console.log(res.data)
            that.setData({
              obj_info:res.data
            })
            wx.showToast({
              title: res.data,
              icon: 'none',
              duration: 1500
            })
            wx.request({
              url: 'http://127.0.0.1:5000/get_obj/'+that.data.user,//对应url 提交查询策略及操作 后台根据数据进行操作 
              data: {'strategy':that.data.strategy_array[that.data.index]},
              method:'POST',
              success:function(res){//返回值为策略对应的对象列表
                console.log(res.data)
                that.setData({
                  object_array:res.data.objs
                })
                console.log(that.data.object_array)
              }
            })
          }
        })

        wx.request({
          url: 'http://127.0.0.1:5000/get_obj/'+that.data.user,//对应url 提交查询策略及操作 后台根据数据进行操作 
          data: {'strategy':this.data.strategy_array[that.data.index]},
          method:'POST',
          success:function(res){//返回值为策略对应的对象列表
            console.log(res.data)
            that.setData({
              object_array:res.data.objs
            })
            console.log(that.data.object_array)
          }
        })
        
      }
    }
  },

  modalCancel :function(){
    this.setData({
      showModal:false,
      obj_name:''
    })
  },

  modalConfirm  :function(){
    var that=this
    console.log(that.data.obj_name)
    wx.request({
      url: 'http://127.0.0.1:5000/add_obj/'+that.data.user,//对应url 提交添加的对象 
      data: {'obj_name':that.data.obj_name,'strategy':that.data.strategy_array[that.data.index],'input_param':that.data.strategy_parameter},
      method:'POST',
      success:function(res){//返回值操作是否成功，并在数据库修改数据状态，将新的修改后的obj返回
        console.log(res.data)
        if(res.data=='对象名已存在'){
          wx.showToast({
            title: res.data,
            icon: 'none',
            duration: 1000
          })
        }
        else{
          wx.showToast({
            title: '成功创建',
            icon: 'none',
            duration: 1000
          })
          
        that.setData({
          showModal:false,
          obj_name:''
        })

        wx.request({
          url: 'http://127.0.0.1:5000/get_obj/'+that.data.user,//对应url 提交查询策略及操作 后台根据数据进行操作 
          data: {'strategy':that.data.strategy_array[that.data.index]},
          method:'POST',
          success:function(res){//返回值为策略对应的对象列表
            console.log(res.data)
            that.setData({
              object_array:res.data.objs
            })
            console.log(that.data.object_array)
          }
        })

        }
      }
    })
  },

  bindKeyInput_name: function (e) {
    this.setData({
      obj_name:e.detail.value,
    })
  },

  getindex:function(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      input_index:index,
    })
  },

  bindKeyInput_param: function (e) {
    let input_index = this.data.input_index;
    console.log(input_index)
    var tmp=this.data.strategy_parameter
    tmp[input_index].data=e.detail.value
    this.setData({
      strategy_parameter:tmp,
    })
    console.log(this.data.strategy_parameter)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      showModal:false
    })
    wx.getStorage({
      key: 'user',
      success: function(res) {
        console.log(res.data)
        that.setData({
          user: res.data.user
        })
        wx.request({
          url: 'http://127.0.0.1:5000/get_strategy/'+res.data.user,//对应url 提交获取策略 后台根据数据进行操作 
          data: {},
          method:'GET',
          success:function(res){//返回值为操作信息 策略列表）
            console.log(res.data)
            that.setData({
              strategy_array:res.data.result
            })
          }
        })

      }
    })
  },

  answerSelected(e) {
    var that=this
    let index = e.currentTarget.dataset.index;
    console.log(index)
    let object_array = that.data.object_array;
    for (let item of object_array) {
      item.selected = false;
    }
    console.log(index,that.data.strategy_array[that.data.index])
    object_array[index].selected = true;
    that.setData({
      object_array: object_array
    });
    wx.request({
      url: 'http://127.0.0.1:5000/get_obj_info/'+that.data.user,//对应url 提交查询对象及操作 后台根据数据进行操作 
      data: {'obj':object_array[index].obj_name,'strategy':that.data.strategy_array[that.data.index]},
      method:'POST',
      success:function(res){//返回值为对象信息
        console.log(res.data)
        that.setData({
          obj_info:res.data
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
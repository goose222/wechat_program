// pages/start_make_strategy/make_strategy/make_strategy.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    quest: [{
      id: 1,
      question: "是否计算资金利息？",
      checked:'',
      answers: [{
        id: 1,
        index: 'A',
        content: '是',
        next_id:'2'
      }, {
        id: 1,
        index: 'B',
        content: '否',
        next_id:'3'
      }]
    }],
    user:'',
    isFinish: false
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

  finish:function(){
    //用来保存选中的答案
    let answerSelected = [];
    let id_list=[];
    for(let qs of this.data.quest){
      id_list.push(qs.id)
      answerSelected.push(qs.checked)
    }
    console.log(answerSelected,id_list);
    // wx.request({
    //   url: 'http://127.0.0.1:5000/finish_strategy/'+this.data.user,
    //   data: {'answerSelected':answerSelected,'id_list':id_list},
    //   method:'POST',
    //   success:function(res){
    //     console.log(res)
    //   }
    // })
    wx.setStorage({
      key: 'answer',
      data: {'answerSelected':answerSelected,'id_list':id_list }
    })
    wx.navigateTo({
      url: 'finish_strategy/finish_strategy'
    })
  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var that=this
    wx.request({
      url: 'http://127.0.0.1:5000/make_stratergy/'+that.data.user,
      data: {'value':e.detail.value},
      method:'POST',
      success:function(res){
        let outidx=res.data.id
        that.data.quest.splice(outidx, that.data.quest.length-outidx+1)
        var index=that.data.quest.length-1
        var lastchecked='quest['+index+'].checked';
        that.setData({
          quest: that.data.quest,
          [lastchecked]: res.data.checked
        })
        console.log(lastchecked)

        if(res.data.quest!="finish"){
          console.log(res.data)
          var oldquest = that.data.quest;
          oldquest.push(res.data.quest);
          that.setData({
            quest: oldquest
        }); 
        }
        else{
          console.log("finish")
          that.setData({
            quest: that.data.quest,
            isFinish: true
          }); 
        }
      }
    }) 
  }
  
})
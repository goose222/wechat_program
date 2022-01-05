var wxCharts = require('/../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
Page({
    data: {
      line_data:{},
      loanTime: ''
    },

    back: function(){
      var that = this;
      clearInterval(this.data.loanTime)
      wx.navigateTo({
        url: "/pages/strategy_working/strategy_working"
      })
    },

    touchHandler: function (e) {
        console.log(lineChart.getCurrentDataIndex(e));
        lineChart.showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data 
            }
        });
    },    
    
    show:function(){
      var that=this
      var windowWidth = 320;
      try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
      } catch (e) {
          console.error('getSystemInfoSync failed!');
      }

      lineChart = new wxCharts({
          canvasId: 'lineCanvas',
          type: 'line',
          categories: that.data.line_data.categories,
          animation: false,
          // background: '#f5f5f5',
          series: [{
              name: 'price',
              data: that.data.line_data.data,
              format: function (val, name) {
                  return val.toFixed(1) ;
              }
            }//, {
          //     name: '平均值',
          //     data: that.data.line_data.average,
          //     format: function (val, name) {
          //         return val.toFixed(1) ;
          //     }
          // }
        ],
          xAxis: {
              disableGrid: true
          },
          yAxis: {
              title: 'time',
              format: function (val) {
                  return val.toFixed(1);
              },
              min: 0
          },
          width: windowWidth,
          height: 150,
          dataLabel: false,
          dataPointShape: true,
          extra: {
              lineStyle: 'curve'
          }
      });
    },

    onLoad: function (e) {
      let pages = getCurrentPages();// 获取页面栈
      let prevpage= pages[pages.length - 2]// 上一个页面
      var info
      if(prevpage){//存在上一页
        info = prevpage.data.info.vtSymbol // 获取上一页data里的数据
      }
      console.log(info)
      var that = this;
      wx.request({
        url: 'http://127.0.0.1:5000/get_k_line',
        data: {'data':info},
        method:'POST',
        success:(res)=>{
            console.log(res.data)
            that.setData({
              line_data:{'categories':res.data.time , 'data':res.data.price}
            })
            that.data.line_data={'categories':res.data.time , 'data':res.data.price}
            console.log(that.data.line_data)
            that.show()
        }
    })
    that.data.loanTime =setInterval(function () {
        console.log('timeout');
            //获取数据 request从数据库中获取
        wx.request({
          url: 'http://127.0.0.1:5000/get_k_line',
          data: {data:'ag2102.shfe'},
          method:'POST',
          success:(res)=>{
              console.log(res.data)
              that.setData({
                line_data:{'categories':res.data.time , 'data':res.data.price}
              })
              that.data.line_data={'categories':res.data.time , 'data':res.data.price}
              console.log(that.data.line_data)
              that.show()
          }
      })
        }, 1000)

    }
});
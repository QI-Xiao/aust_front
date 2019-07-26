Page({
  data: {
    sucinfo: ''
  },
  
  onLoad: function (options) {
    console.log('options', options)
    this.setData({
      sucinfo: options.sucinfo
    })
  },

  returnindex: function(){
    console.log('return index')
    wx.switchTab({
      url: '../index/index',
    })
  },
})
Page({
  data: {
    text0: "",
    text1: "",
    text2: "",
  },

  onLoad: function (options) {
    this.setData({
      text0: options.text0,
      text1: options.text1,
      text2: options.text2,
    })
  },

  copyit: function (e) {
    var data = this.data.text0 + '\n' + this.data.text1 + '\n' + this.data.text2
    wx.setClipboardData({
      data: data,
      success(res) {
        wx.getClipboardData({
          success(res) {
            // console.log(res.data) // data
          }
        })
      }
    })
  },

  returnback: function () {
    wx.navigateBack({
      delta: 1
    })
  },
})
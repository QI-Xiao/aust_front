Page({
  data: {
    errorinfo: '',
    primary: '',
    dft_butt: '',
  },

  onLoad: function (options) {
    console.log('options', options)
    var primary = options.primary
    if (primary) {
      this.setData({
        errorinfo: options.error,
        primary: primary,
        dft_butt: options.dft_butt,
      })
    } else {
      this.setData({
        errorinfo: options.error,
      })
    }
    console.log(this.data.errorinfo, this.data.primary, this.data.dft_butt)
  },

  returnindex: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },

  // toupdate: function () {
  //   wx.redirectTo({
  //     url: '/pages/setting/updateinfo/updateinfo',
  //   })
  // },
})
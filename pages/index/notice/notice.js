const app = getApp()
var common = require('../../../utils/common.js')
Page({

  data: {
    notice_content: '',
    Hrpxleft: app.globalData.Hrpxleft,
  },

  onLoad: function (options) {
    common.req_com.post(
      'notice/', { 'item': options.item}
    ).then(res => {
      console.log(res)
      this.setData({
        notice_content: res.data,
      })
    }).catch(e => {
      wx.navigateTo({
        url: '/pages/error/error?error=' + e.error,
      })
    })
  },

  returnindex: function () {
    wx.navigateBack({
      url: '/pages/index/index',
    })
  },
})
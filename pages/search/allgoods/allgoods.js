const app = getApp()
var common = require('../../../utils/common.js')
Page({
  data: {
    goods_list: [],
  },

  onLoad: function (options) {
    var refresh = options.refresh
    common.req_com.post(
      'goods/all/', { 'cookie': app.globalData.cookie }
    ).then(res => {
      console.log(res)
      this.setData({
        goods_list: res.goods_list,
      })
      if (refresh === true) {
        wx.showToast({
          title: '数据已更新',
          icon: 'success',
          duration: 2000
        })
      }
    }).catch(e => {
      wx.navigateTo({
        url: '/pages/error/error?error=' + e.error,
      })
    })
  },

  onPullDownRefresh: function () {
    this.onLoad({ 'refresh': true })
    wx.stopPullDownRefresh()
  },
})
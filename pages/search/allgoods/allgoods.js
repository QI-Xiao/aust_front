const app = getApp()
var common = require('../../../utils/common.js')
Page({
  data: {
    goods_list: [],
  },

  onLoad: function (options) {
    common.req_com.post(
      'goods/all/', { 'cookie': app.globalData.cookie }
    ).then(res => {
      console.log(res)
      this.setData({
        goods_list: res.goods_list,
      })
    }).catch(e => {
      wx.navigateTo({
        url: '/pages/error/error?error=' + e.error,
      })
    })
  },
})
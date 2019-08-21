const app = getApp()
var common = require('../../../utils/common.js')
Page({
  data: {
    goods_list: [],
  },

  onLoad: function () {
    var data = {
      'cookie': app.globalData.cookie,
      'all': true,
    }
    common.req_com.post(
      'goods/list/refund/', data
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
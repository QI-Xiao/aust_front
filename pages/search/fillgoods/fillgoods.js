const app = getApp()
var common = require('../../../utils/common.js')
Page({
  data: {
    goods_list: [],
  },

  onLoad: function (options) {
    // console.log(options)
    // if (options.completed) {
    //   console.log('aaaaaaaaaaaaaaaa')
    // } else {
      this.item_list()
    // }
  },

  item_list: function () {
    var data = {
      'cookie': app.globalData.cookie,
    }

    common.req_com.post(
      'goods/fill/', data
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

  fillitem: function (e) {
    var code = e.target.dataset.code
    var index = e.target.dataset.index
    console.log(code, index)
    wx.redirectTo({
      url: '/pages/index/scanitem/scanitem?fillit=true&code=' + code,
    })
  }
})
const app = getApp()
var common = require('../../../utils/common.js')
Page({
  data: {
    goods_list: [],
    q_search: [],  // 搜索返回的问答列表
    search: false, // 是否在搜索的条目中
    search_data: '', // 搜索的关键词
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })

    var refresh = options.refresh
    common.req_com.post(
      'goods/all/', { 'cookie': app.globalData.cookie }
    ).then(res => {
      console.log(res)
      this.setData({
        goods_list: res.goods_list,
        q_search: [],  // 搜索返回的问答列表
        search: false, // 是否在搜索的条目中
        search_data: '', // 搜索的关键词
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
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

  returnall: function() {
    this.setData({
      q_search: [],  // 搜索返回的问答列表
      search: false, // 是否在搜索的条目中
      search_data: '', // 搜索的关键词
    })
  },

  formSubmit: function (e) {
    // common.template_info({'form_id': e.detail.formId, 'source': 3})
    this.search(e.detail.value.input)
  },

  search: function (content) {
    // 判断为空
    if (content == '') {
      wx.showModal({
        title: '提示',
        content: '请输入搜索关键词',
        showCancel: false,
        confirmText: '确定',
        cancelText: '哈哈',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    } else {
      wx.showLoading({
        title: '加载中',
      })

      common.req_com.post(
        'goods/search/', { 'cookie': app.globalData.cookie, 'content': content }
      ).then(res => {
        this.setData({
          q_search: res.goods_list,
          search: true,
          search_data: content
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      }).catch(e => {
        wx.navigateTo({
          url: '/pages/error/error?error=' + e.error,
        })
      })
    }
  },
})
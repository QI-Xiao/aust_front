const app = getApp()
var common = require('../../utils/common.js')
Page({
  data: {
    // userInfo: {},
    hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is_identified: '',
    is_staff: '',
    goods_list: [],
  },

  // onLoad: function () {
  // },

  onShow: function(options) {
    if (options) {
      console.log('refresh', options, options.refresh)
      var refresh = options.refresh
    }
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true,
        is_identified: app.globalData.is_identified,
        is_staff: app.globalData.is_staff,
      })
      this.item_list(app.globalData.cookie, app.globalData.is_staff)
      if (refresh === true) {
        wx.showToast({
          title: '数据已更新',
          icon: 'success',
          duration: 2000
        })
      }
    }
  },

  item_list: function(cookie, is_staff) {
    if (!is_staff) {
      common.req_com.post(
        'goods/list/', { 'cookie': cookie }
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
    }
  },

  deleteitem: function(e) {
    wx.showModal({
      content: '确认不再显示此记录？',
      showCancel: true,
      confirmText: "确定",
      success: res => {
        if (res.confirm) {

          var index = e.target.dataset.index
          console.log(e.target.dataset.id)

          common.req_com.post(
            'goods/delete/', { 'g_id': e.target.dataset.id, 'cookie': app.globalData.cookie }
          ).then(res => {
            console.log(res)
            var goods_list = this.data.goods_list;
            goods_list.splice(index, 1);
            this.setData({
              goods_list: goods_list,
            })
          }).catch(e => {
            wx.navigateTo({
              url: '/pages/error/error?error=' + e.error,
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },

  overview: function () {
    wx.navigateTo({
      url: 'overview/overview',
    })
  },
  oneuser: function () {
    wx.navigateTo({
      url: 'oneuser/oneuser',
    })
  },
  refund: function () {
    wx.navigateTo({
      url: 'refund/refund',
    })
  },

  all_goods: function() {
    wx.navigateTo({
      url: 'allgoods/allgoods',
    })
  },

  onPullDownRefresh: function () {
    this.onShow({ 'refresh': true })
    wx.stopPullDownRefresh()
  },
})
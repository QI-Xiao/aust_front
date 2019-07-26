const app = getApp()
var common = require('../../utils/common.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is_identified: '',
    is_staff: '',
    goods_list: [],
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        is_identified: app.globalData.is_identified,
        is_staff: app.globalData.is_staff,
      })
      this.item_list(app.globalData.cookie, app.globalData.is_staff)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          is_identified: res.is_identified,
          is_staff: res.is_staff,
        })
        this.item_list(res.cookie, res.is_staff)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            is_identified: res.is_identified,
            is_staff: res.is_staff,
          })
          this.item_list(res.cookie, res.is_staff)
        }
      })
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

  getUserInfo: function (e) {
    app.requestinf()
    this.onLoad()
  },
})
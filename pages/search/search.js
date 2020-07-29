const app = getApp()
var common = require('../../utils/common.js')
Page({
  data: {
    // userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is_identified: -2,
    is_staff: '',
    goods_list: [],
    text_list: null,
    notice_title: '',

    q_search: [],  // 搜索返回的问答列表
    search: false, // 是否在搜索的条目中
    search_data: '', // 搜索的关键词
  },

  onLoad: function () {
    console.log('type 222222222222222222222222222222222')
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
    app.userInfoReadyCallback = res => {
      var userinfo = res.userInfo
      console.log('userinfo', userinfo)
      if (userinfo && userinfo !== true) {
        this.setData({
          hasUserInfo: true,
        })
      }
    }
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  onShow: function(options) {
    if (options) {
      console.log('refresh', options, options.refresh)
      var refresh = options.refresh
    }
    var userinfo = app.globalData.userInfo
    if (userinfo) {
      if (userinfo !== true) {
        this.setData({
          hasUserInfo: true,
        })
      }
      var is_identified = app.globalData.is_identified
      var is_staff = app.globalData.is_staff
      this.setData({
        is_identified: is_identified,
        is_staff: is_staff,
      })
      if (!is_staff && is_identified === 2) {
        this.item_list(app.globalData.cookie)
      }
      if (refresh === true) {
        wx.showToast({
          title: '数据已更新',
          icon: 'success',
          duration: 2000
        })
      }
    }
  },

  getUserInfo: function (e) {
    app.requestinf()
    this.onShow()
  },

  item_list: function(cookie) {
    common.req_com.post(
      'goods/list/', { 'cookie': cookie }
    ).then(res => {
      console.log(res)
      this.setData({
        goods_list: res.goods_list,
        text_list: res.text_list,
        notice_title: res.notice_title,
        q_search: [],  // 搜索返回的问答列表
        search: false, // 是否在搜索的条目中
        search_data: '', // 搜索的关键词
      })
    }).catch(e => {
      wx.navigateTo({
        url: '/pages/error/error?error=' + e.error,
      })
    })
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
  depot_address: function () {
    var t_l = this.data.text_list
    if (t_l) {
      wx.navigateTo({
        url: 'address/address?text0=' + t_l[0] + '&text1=' + t_l[1] + '&text2=' + t_l[2],
      })
    }
  },

  notice: function () {
    wx.navigateTo({
      url: 'notice/notice',
    })
  },

  good_fill: function() {
    wx.navigateTo({
      url: 'fillgoods/fillgoods',
    })
  },

  onPullDownRefresh: function () {
    this.onShow({ 'refresh': true })
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
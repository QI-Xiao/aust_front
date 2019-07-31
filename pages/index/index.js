const app = getApp()
var common = require('../../utils/common.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is_identified: '',
    is_staff: '',
    user_number: '',

    oldtime: '',
    oldcategory: '',
    oldcode: '',
    oldcompany: '',
    oldstatus: '',

    remind_text: '',
  },

  onLoad: function (options) {
    var refresh = options.refresh // 判断是否是下拉更新的
    if (options.oldcode){
      this.setData({
        oldtime: options.time,
        oldcategory: options.category,
        oldcode: options.oldcode,
        oldcompany: options.company,
        oldstatus: options.status,
      })
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        is_identified: app.globalData.is_identified,
        is_staff: app.globalData.is_staff,
        user_number: app.globalData.user_number,
        remind_text: app.globalData.remind_text,
      })
      if (refresh === true) {
        wx.showToast({
          title: '数据已更新',
          icon: 'success',
          duration: 2000
        })
      }
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          is_identified: res.is_identified,
          is_staff: res.is_staff,
          user_number: res.user_number,
          remind_text: res.remind_text,
        })
        if (refresh === true) {
          wx.showToast({
            title: '数据已更新',
            icon: 'success',
            duration: 2000
          })
        }
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
            user_number: res.user_number,
            remind_text: res.remind_text,
          })
          if (refresh === true) {
            wx.showToast({
              title: '数据已更新',
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
    }
  },

  onShow: function() {
    var is_identified = app.globalData.is_identified
    if (is_identified) {
      this.setData({
        is_identified: is_identified,
      })
    }
  },

  getUserInfo: function(e) {
    app.requestinf()
    this.onLoad({})
  },

  toform: function() {
    wx.navigateTo({
      url: 'newform/new_old',
    })
  },

  usescan: function() {
    wx.scanCode({
      success: function (res) {
        wx.navigateTo({
          url: 'scanitem/scanitem?code=' + res['result'],
        })
      },
    })
  },

  refresh: function() {
    app.requestinf()
    this.onLoad({ 'refresh': true })
  },

  formSubmit: function (e) {
    common.req_com.get(
      'time/get/', {}
    ).then(res => {
      console.log(res)
      var notice_time = res.notice_time
      wx.showModal({
        content: '（北京时间）' + notice_time + '前，如有包裹到仓，我们将通过微信“服务通知”发送消息提示',
        showCancel: true,
        confirmText: "确定",
        success: res => {
          if (res.confirm) {
            this.template_get(e.form_id, notice_time)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    }).catch(e => {
      wx.navigateTo({
        url: '/pages/error/error?error=' + e.error,
      })
    })
  },

  template_get: function (form_id, notice_time) {
    common.req_com.post(
      'template/get/', { 'cookie': app.globalData.cookie, 'form_id': form_id, 'source': 1, 'notice_time': notice_time }
    ).then(res => {
      console.log(res)
      this.setData({
        remind_text: res.remind_text,
      })
    }).catch(e => {
      wx.navigateTo({
        url: '/pages/error/error?error=' + e.error,
      })
    })
  },

  cencel_remind: function () {
    common.req_com.post(
      'template/cencel/', { 'cookie': app.globalData.cookie, 'source': 1 }
    ).then(res => {
      console.log(res)
      this.setData({
        remind_text: res.remind_text,
      })
    }).catch(e => {
      wx.navigateTo({
        url: '/pages/error/error?error=' + e.error,
      })
    })
  },

  copyit: function() {
    wx.setClipboardData({
      data: '浙江省金华市义乌市后宅街道下畈新村群英二区',
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
})

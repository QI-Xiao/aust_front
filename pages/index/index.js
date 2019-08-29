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
    
    oldbelong: '',
    oldtime: '',
    oldcategory: '',
    oldcode: '',
    oldcompany: '',
    oldstatus: '',

    info_address: '',
    info_person: [],
    info_phone: '',
    info_ZIPcode: '',
    info_text: '',

    // remind_text: '',
  },

  onLoad: function (options) {
    var refresh = options.refresh // 判断是否是下拉更新的
    if (options.oldcode){
      this.setData({
        oldbelong: options.belong,
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
        // remind_text: app.globalData.remind_text,

        info_address: app.globalData.info_address,
        info_person: app.globalData.info_person,
        info_phone: app.globalData.info_phone,
        info_ZIPcode: app.globalData.info_ZIPcode,
        info_text: app.globalData.info_text,
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
          // remind_text: res.remind_text,

          info_address: res.info_address,
          info_person: res.info_person,
          info_phone: res.info_phone,
          info_ZIPcode: res.info_ZIPcode,
          info_text: res.info_text,
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
            // remind_text: res.remind_text,

            info_address: res.info_address,
            info_person: res.info_person,
            info_phone: res.info_phone,
            info_ZIPcode: res.info_ZIPcode,
            info_text: res.info_text,
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
      this.setData({ // 用户注册完成后，更新用户状态
        is_identified: is_identified,
      })
    }
    // if (this.data.is_identified === 2 && !this.data.is_staff) {
    //   common.req_com.post(
    //     'template/update/', { 'cookie': app.globalData.cookie }
    //   ).then(res => {
    //     console.log(res)
    //     this.setData({
    //       remind_text: res.remind_text,
    //     })
    //   }).catch(e => {
    //     console.log('error', e)
    //   })
    // }
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

  tonotice: function() {
    wx.navigateTo({
      url: 'notice/notice?item=mianze',
    })
  },

  usescan: function() {
    wx.scanCode({
      scanType: ['barCode'],
      success: res => {
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

  // formSubmit: function (e) {
  //   common.req_com.get(
  //     'time/get/', {}
  //   ).then(res => {
  //     console.log(res)
  //     var notice_time = res.notice_time
  //     wx.showModal({
  //       content: res.notice_content,
  //       showCancel: true,
  //       confirmText: "确定",
  //       success: res => {
  //         if (res.confirm) {
  //           this.template_get(e.detail.formId, notice_time)
  //         } else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     });
  //   }).catch(e => {
  //     wx.navigateTo({
  //       url: '/pages/error/error?error=' + e.error,
  //     })
  //   })
  // },

  // template_get: function (form_id, notice_time) {
  //   console.log({ 'cookie': app.globalData.cookie, 'form_id': form_id, 'source': 1, 'notice_time': notice_time })
  //   common.req_com.post(
  //     'template/get/', { 'cookie': app.globalData.cookie, 'form_id': form_id, 'source': 1, 'notice_time': notice_time }
  //   ).then(res => {
  //     console.log(res)
  //     this.setData({
  //       remind_text: res.remind_text,
  //     })
  //   }).catch(e => {
  //     wx.navigateTo({
  //       url: '/pages/error/error?error=' + e.error,
  //     })
  //   })
  // },

  // cencel_remind: function () {
  //   common.req_com.post(
  //     'template/cencel/', { 'cookie': app.globalData.cookie, 'source': 1 }
  //   ).then(res => {
  //     console.log(res)
  //     this.setData({
  //       remind_text: res.remind_text,
  //     })
  //   }).catch(e => {
  //     wx.navigateTo({
  //       url: '/pages/error/error?error=' + e.error,
  //     })
  //   })
  // },

  copyit: function(e) {
    // console.log(e.target.dataset.content)
    var data = '地址：' + this.data.info_address + '\n收件人：' + this.data.info_person.join('') + '\n电话：' + this.data.info_phone + '\n邮编：' + this.data.info_ZIPcode
    wx.setClipboardData({
      data: data,
      success(res) {
        wx.getClipboardData({
          success(res) {
            // console.log(res.data) // data
          }
        })
      }
    })
  },

  // onPullDownRefresh: function () {
  //   app.requestinf()
  //   this.onLoad({ 'refresh': true })
  //   wx.stopPullDownRefresh()
  // },
})

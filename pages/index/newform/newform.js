const app = getApp()
var common = require('../../../utils/common.js')
Page({
  data: {
    showmodel: {
      'phone': '请输入悉尼本地电话',
      'user_name': '请输入姓名',
      'wx_id': '请输入微信号（非昵称）',
      'address': '请输入悉尼地址',
      'user_number': '请输入用户4位编号',
      'agree': '同意条款后才可完成注册',
    },
    old_new: 'new',
    is_cheaked: false,
  },

  onLoad: function (options) {
    console.log(options.user)
    this.setData({
      old_new: options.user,
    })
  },

  formSubmit: function (e) {
    var obj = e.detail.value

    for (var i in obj) {
      if (!obj[i].trim()) {
        wx.showModal({
          content: this.data.showmodel[i],
          showCancel: false,
          confirmText: "确定",
          success: function (res) {
          }
        });
        return
      }
    }

    obj['cookie'] = app.globalData.cookie;
    obj['old_new'] = this.data.old_new;

    console.log(obj)

    common.req_com.post(
      'register/', obj
    ).then(res => {
      app.globalData.is_identified = res.is_identified
      wx.navigateTo({
        url: '/pages/success/success?sucinfo=' + res.status,
      })
      console.log(res)
    }).catch(e => {
      wx.showModal({
        content: e.error,
        showCancel: false,
        confirmText: "确定",
      });
    })
  },

  tonotice: function(e) {
    console.log(e, e.target.dataset.item)
    wx.navigateTo({
      url: '../notice/notice?item=' + e.target.dataset.item,
    })
  },

  cheakit: function() {
    this.setData({
      is_cheaked: !this.data.is_cheaked,
    })
  }
})
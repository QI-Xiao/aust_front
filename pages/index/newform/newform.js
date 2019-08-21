const app = getApp()
var common = require('../../../utils/common.js')
Page({
  data: {
    showmodel: {
      'phone': '请输入悉尼本地电话',
      'user_name': '请输入与澳洲ID相符的姓名',
      'wx_id': '请输入微信号（非昵称）',
      'address': '请输入悉尼地址',
      'user_number': '请输入用户4位编号',
      'agree': '同意《免责声明》后才可完成注册',
    },
    old_new: 'new',
    is_cheaked: false,
    holder: {
      'phone': '请输入悉尼本地电话',
      'user_name': '请填写中文，与澳洲ID相符即可',
      'wx_id': '请输入微信号（非昵称）',
      'address': '请输入悉尼地址',
      'user_number': '请输入原有4位用户编号',
    }
  },

  onLoad: function (options) {
    var old_new = options.user
    console.log(old_new)
    this.setData({
      old_new: old_new,
    })
    if (old_new === "old") {
      this.setData({
        holder: {
          'phone': '请输入悉尼本地电话',
          'user_name': '请填写澳洲驾驶证上的姓名，提货需出示该ID',
          'wx_id': '请输入微信号（非昵称）',
          'address': '请填写澳洲驾驶证上的地址，提货需出示该ID',
          'user_number': '请输入原有4位用户编号',
        }
      })
    }
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
    obj['version'] = app.globalData.version;

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
      url: '../notice/notice?item=mianze',
    })
  },

  cheakit: function() {
    this.setData({
      is_cheaked: !this.data.is_cheaked,
    })
  }
})
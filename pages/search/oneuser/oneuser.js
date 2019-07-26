const app = getApp()
var common = require('../../../utils/common.js')
Page({
  data: {               
    date1: '',
    date2: '',
    goods_list: [],
  },

  onLoad: function (options) {
    this.setData({
      date1: app.globalData.date1,
      date2: app.globalData.date2,
    })
  },

  DateChange1(e) {
    this.setData({
      date1: e.detail.value
    })
  },
  DateChange2(e) {
    this.setData({
      date2: e.detail.value
    })
  },

  formSubmit: function (e) {
    var obj = e.detail.value
    if (obj.date1 > obj.date2) {
      wx.showModal({
        content: '开始日期不能大于结束日期',
        showCancel: false,
        confirmText: "确定",
        success: function (res) {
        }
      });
      return
    }

    obj['cookie'] = app.globalData.cookie;
    obj['source'] = 'staff';

    common.req_com.post(
      'goods/all/', obj
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
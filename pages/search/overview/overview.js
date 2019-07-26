const app = getApp()
var common = require('../../../utils/common.js')
Page({
  data: {
    date1: '',
    date2: '',
    count_list: [],
  },

  onLoad: function (options) {
    this.setData({
      date1: app.globalData.date1,
      date2: app.globalData.date2,
    })
    this.item_list()
  },

  item_list: function () {
    var data = {
      'cookie': app.globalData.cookie,
      'date1': this.data.date1,
      'date2': this.data.date2,
    }
    console.log(data)
    common.req_com.post(
      'goods/overview/', data
    ).then(res => {
      console.log(res)
      this.setData({
        count_list: res.count_list,
      })
    }).catch(e => {
      wx.navigateTo({
        url: '/pages/error/error?error=' + e.error,
      })
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
      });
    } else {
      this.item_list()
    }
  },
})
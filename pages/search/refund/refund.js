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
    this.item_list()
  },

  item_list: function () {
    var data = {
      'cookie': app.globalData.cookie,
      'date1': this.data.date1,
      'date2': this.data.date2,
    }

    common.req_com.post(
      'goods/list/refund/', data
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

  all_goods: function () {
    wx.navigateTo({
      url: 'allrefund',
    })
  },

  deleteitem: function (e) {
    wx.showModal({
      content: '确认不再显示此记录？',
      showCancel: true,
      confirmText: "确定",
      success: res => {
        if (res.confirm) {

          var index = e.target.dataset.index
          console.log(e.target.dataset.id)

          common.req_com.post(
            'goods/delete/', { 'g_id': e.target.dataset.id, 'cookie': app.globalData.cookie, 'refund': true }
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
})
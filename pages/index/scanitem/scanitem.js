const app = getApp()
var common = require('../../../utils/common.js')
Page({
  data: {
    cookie: '',
    code: '',
    picker: [],
    noticetext: {
      'user_number': '请输入用户4位编号',
      'code': '请输入订单号',
      'company': '请输入快递公司名称',
      // 'category': '请选择快递种类',
      // 'quantity': '请输入数量',
      // 'remarks': '请输入具体的其它种类',
      // 'length1': '请输入长度1',
      // 'width1': '请输入宽度1',
      // 'height1': '请输入高度1',
      // 'weight1': '请输入重量1',
    },
    company_dic: {
      'ane66': '安能快递',
      'debangkuaidi': '德邦快递',
      'ems': 'EMS',
      'guotongkuaidi': '国通快递',
      'huitongkuaidi': '百世快递',
      'jd': '京东物流',
      'kuayue': '跨越速运',
      'pjbest': '品骏快递',
      'shentong': '申通快递',
      'shunfeng': '顺丰速运',
      'suer': '速尔快递',
      'xinfengwuliu': '信丰物流',
      'youshuwuliu': '优速物流',
      'youzhengguonei': '邮政快递包裹',
      'yuantong': '圆通速递',
      'yuantongguoji': '圆通国际',
      'yunda': '韵达快递',
      'zhaijisong': '宅急送',
      'zhongtong': '中通快递',
      'ewe': 'EWE全球快递',
      'quanyikuaidi': '全一快递',
    },
    index: '',
    index_end: '-1',
    company: '',
    oldbelong: '',
    oldtime: '',
    oldcategory: '',
    oldcode: '',
    oldcompany: '',
    oldstatus: '',
    can_auto_identify: false,
    confirm_text: '录入并继续',
    status: 1,
    code_origin: '',
    fillit: '',

    start_number: '',
    start_quantity: 1,
    box_data: [[null, null, null, null]],
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      code: options.code,
      cookie: app.globalData.cookie,
      fillit: options.fillit,
    })

    if (options.oldcode) {
      this.setData({
        oldbelong: options.belong,
        oldtime: options.time,
        oldcategory: options.category,
        oldcode: options.oldcode,
        oldcompany: options.company,
        oldstatus: options.status,
      })
    }

    common.req_com.post(
      'goods/exist/', { 'cookie': this.data.cookie, 'code': this.data.code}
    ).then(res => {
      console.log(res)
      this.setData({
        picker: res.cate_all,
        index_end: res.cate_len,
      })
      var status = res.status
      if (status == 0) {
        this.get_api()
        return
      } else if (status == 1 || status == 2) {
        this.setData({
          confirm_text: '修改并继续',
        })
        this.data.status = 2
        this.data.code_origin = options.code

        this.setData({
          company: res.company,
          start_quantity: res.quantity,
          start_number: res.user1,
          index: res.cate_index,
          box_data: res.box_data,
        })
        return
        // wx.showModal({
        //   content: '用户：' + res.user1 + '，订单号：' + res.code + ' 的包裹已经入库，是否需要继续操作？',
        //   showCancel: true,
        //   cancelText: '继续操作',
        //   cancelColor: '#ff0000',
        //   confirmText: "取消",
        //   success:res => {
        //     if (res.confirm) {
        //       wx.reLaunch({
        //         url: '/pages/index/index',
        //       })
        //     } else if (res.cancel) {
        //       this.data.status = 2
        //       this.data.code_origin = options.code
        //       return
        //     }
        //   }
        // });
      } else if (status == 4) {
        wx.showModal({
          content: '用户：' + res.user1 + '，订单号：' + res.code + ' 的包裹已经退货，请勿重复操作',
          showCancel: false,
          confirmText: "确定",
          success: function (res) {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
        });
      }
    }).catch(e => {
      wx.showModal({
        content: e.error,
        showCancel: false,
        confirmText: "确定",
        success: function (res) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      });
    })
  },

  get_api: function() {
    wx.request({
      url: 'https://www.kuaidi100.com/autonumber/autoComNum?text=' + this.data.code,
      // url: 'https://www.kuaidi100.com/autonumber/autoComNum?text=' +'SF1000674348493',
      success: res => {
        console.log('res.data', res.data)
        var auto_list = res.data.auto
        if (res.statusCode !== 200 || !auto_list || auto_list.length == 0) {
          this.setData({
            can_auto_identify: false,
          })
        } else {
          var company_en = auto_list[0].comCode
          var company = this.data.company_dic[company_en]
          console.log(company_en, company)
          if (company_en && company) {
            this.setData({
              company: company,
              can_auto_identify: true,
            })
          } else {
            this.setData({
              can_auto_identify: false,
            })
          }
        }
      },
      fail: res => {
        this.setData({
          can_auto_identify: false,
        })
      }
    })
  },

  PickerChange(e) {
    this.setData({
      index: e.detail.value,
    })
  },

  formSubmit: function (e) {
    console.log(e.detail.value)
    
    var obj = e.detail.value
    var refund = e.detail.target.dataset.refund

    // if (!refund || this.data.code_origin !== obj.code) {
      for (var i in this.data.noticetext) {
        if (!obj[i].trim()) {
          wx.showModal({
            content: this.data.noticetext[i],
            showCancel: false,
            confirmText: "确定",
            success: res => {
            }
          });
          return
        }
        console.log(i)
      }
      obj['items'] = this.data.box_data.length
      obj['category'] = this.data.picker[obj['category']]
      var url = 'goods/in/'
    // } else {
    //   var url = 'goods/refund/'
    // }

    obj['cookie'] = app.globalData.cookie
    console.log('obj', obj)

    if (refund == 't') {
      wx.showModal({
        content: '确定要退货吗？',
        showCancel: true,
        confirmText: "确定",
        success: res => {
          if (res.confirm) {
            obj['status'] = 4
            this.goods_in(url, obj)
          }
        }
      });
    } else {
      obj['status'] = this.data.status
      this.goods_in(url, obj)
    }
  },

  goods_in: function (url, obj) {
    common.req_com.post(
      url, obj
    ).then(res => {
      console.log(res)

      if (this.data.fillit) {
        wx.redirectTo({
          url: '/pages/search/fillgoods/fillgoods'
        })
      } else {
        var last_str = 'oldcode=' + res.code + '&time=' + res.time + '&category=' + res.category + '&company=' + res.company + '&status=' + res.status + '&belong=' + res.belong

        wx.scanCode({
          success: res => {
            wx.redirectTo({
              url: 'scanitem?code=' + res['result'] + '&' + last_str,
            })
          },
          fail: res => {
            setTimeout(function () {
              wx.reLaunch({
                url: '/pages/index/index?' + last_str,
              })
            }, 200)
          },
        })
      }
    }).catch(e => {
      wx.showModal({
        content: e.error,
        showCancel: false,
        confirmText: "确定",
      });
    })
  },

  add: function() {
    var box_data_old = this.data.box_data;
    var item_now = box_data_old.push([null, null, null, null]);
    // var textadd = {
    //   ['length' + item_now]: '请输入长度' + item_now,
    //   ['width' + item_now]: '请输入宽度' + item_now,
    //   ['height' + item_now]: '请输入高度' + item_now,
    //   ['weight' + item_now]: '请输入重量' + item_now,
    // }
    this.setData({
      box_data: box_data_old,
      // noticetext: Object.assign(this.data.noticetext, textadd),
    })
  },
  minus: function () {
    var box_data_old = this.data.box_data;
    if (box_data_old.length > 1) {
      box_data_old.pop()
      this.setData({
        box_data: box_data_old,
      })
    } else {
      wx.showModal({
        content: '只有一个尺寸，不能减少',
        showCancel: false,
        confirmText: "确定",
        success: function (res) {
        }
      });
    }
  },

  datain: function (e) {
    var dataset = e.target.dataset
    var box_data_old = this.data.box_data

    box_data_old[dataset.index][dataset.ind2] = e.detail.value

    this.setData({
      box_data: box_data_old,
    })
  },
})
const app = getApp()
var common = require('../../../utils/common.js')
Page({
  data: {
    cookie: '',
    code: '',
    picker: ['图书', '衣物', '化妆品', '其它'],
    noticetext: {
      'user_number': '请输入用户4位编号',
      'code': '请输入订单号',
      'company': '请输入快递公司名称',
      'category': '请选择快递种类',
      'quantity': '请输入数量',
      'remarks': '请输入具体的其它种类',
      'length1': '请输入长度1',
      'width1': '请输入宽度1',
      'height1': '请输入高度1',
      'weight1': '请输入重量1',
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
    add_item: [1],
    oldtime: '',
    oldcategory: '',
    oldcode: '',
    oldcompany: '',
    oldstatus: '',
    can_auto_identify: false,
    confirm_text: '录入并继续',
    status: 1,
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      code: options.code,
      index_end: "" + this.data.picker.length - 1,
      cookie: app.globalData.cookie,
    })

    if (options.oldcode) {
      this.setData({
        oldtime: options.time,
        oldcategory: options.category,
        oldcode: options.oldcode,
        oldcompany: options.company,
        oldstatus: options.status,
      })
    }

    this.get_api()

    common.req_com.post(
      'goods/exist/', { 'cookie': this.data.cookie, 'code': this.data.code}
    ).then(res => {
      console.log(res)
      var status = res.status
      if (status == 0) {
        return
      } else if (status == 1 || status == 2) {
        this.setData({
          confirm_text: '修改并继续',
          status: 2,
        })
        wx.showModal({
          content: '用户：' + res.user1 + '，订单号：' + res.code + ' 的包裹已经入库，是否需要继续操作？',
          showCancel: true,
          cancelText: '继续操作',
          cancelColor: '#ff0000',
          confirmText: "取消",
          success(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            } else if (res.cancel) {
              return
            }
          }
        });
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
    var dataset = e.detail.target.dataset

    if (dataset.refund == 't') {
      wx.showModal({
        content: '确定要退货吗？',
        showCancel: true,
        confirmText: "确定",
        success: function (res) {
          if (res.confirm) {
            console.log(obj.code)

            common.req_com.post(
              'goods/refund/', {'code': obj.code, 'cookie': app.globalData.cookie}
            ).then(res => {
              var last_str = 'oldcode=' + res.code + '&time=' + res.time + '&category=' + res.category + '&company=' + res.company + '&status=' + res.status

              wx.showModal({
                content: res.text,
                showCancel: true,
                confirmText: "继续扫码",
                cancelText: "返回首页",
                success: res2 => {
                  if (res2.confirm) {
                    wx.scanCode({
                      success: function (res) {
                        wx.redirectTo({
                          url: 'scanitem?code=' + res['result'] + '&' + last_str,
                        })
                      },
                    })                   
                  } else if (res2.cancel) {
                    wx.reLaunch({
                      url: '/pages/index/index?' + last_str,
                    })
                  }
                }
              });
            }).catch(e => {
              wx.showModal({
                content: e.error,
                showCancel: false,
                confirmText: "确定",
              });
            })
          } else if (res.cancel) {
            return
          }
        }
      });
    } else {
      for (var i in obj) {
        if (!obj[i].trim()) {
          wx.showModal({
            content: this.data.noticetext[i],
            showCancel: false,
            confirmText: "确定",
            success: function (res) {
            }
          });
          return
        }
      }

      obj['items'] = this.data.add_item.length
      obj['cookie'] = app.globalData.cookie
      obj['category'] = this.data.picker[obj['category']]
      obj['status'] = this.data.status

      console.log(obj)

      common.req_com.post(
        'goods/in/', e.detail.value
      ).then(res => {
        console.log(res)

        var last_str = 'oldcode=' + res.code + '&time=' + res.time + '&category=' + res.category + '&company=' + res.company + '&status=' + res.status

        wx.scanCode({
          success: function (res) {
            wx.redirectTo({
              url: 'scanitem?code=' + res['result'] + '&' + last_str,
            })
          },
          fail: function () {
            wx.reLaunch({
              url: '/pages/index/index?' + last_str,
            })
          },
        })
      }).catch(e => {
        wx.showModal({
          content: e.error,
          showCancel: false,
          confirmText: "确定",
        });
      })
    }
  },

  add: function() {
    var add_item_old = this.data.add_item;
    var item_now = add_item_old.push(add_item_old.length + 1);
    var textadd = {
      ['length' + item_now]: '请输入长度' + item_now,
      ['width' + item_now]: '请输入宽度' + item_now,
      ['height' + item_now]: '请输入高度' + item_now,
      ['weight' + item_now]: '请输入重量' + item_now,
    }
    this.setData({
      add_item: add_item_old,
      noticetext: Object.assign(this.data.noticetext, textadd),
    })
  },
  minus: function () {
    var add_item_old = this.data.add_item;
    if (add_item_old.length > 1) {
      add_item_old.pop()
      this.setData({
        add_item: add_item_old,
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
})
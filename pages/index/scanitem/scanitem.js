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
    company_dic: '',
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
    receiver: '',

    TabCur: -1,
    // scrollLeft: 0,
    num_ABC: '',
    num_all: '',
    show_number: true,

    box_data: [[null, null, null, null]],
  },

  onLoad: function (options) {
    console.log(options)
    this.data.company_dic = app.globalData.company_dic
    this.setData({
      code: options.code,
      cookie: app.globalData.cookie,
      fillit: options.fillit,
      num_ABC: app.globalData.num_ABC,
      num_all: app.globalData.num_all,
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
      'goods/exist/', { 'cookie': this.data.cookie, 'code': this.data.code, 'part': true}
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
          receiver: res.receiver,
          company: res.company,
          start_quantity: res.quantity,
          start_number: res.user1,
          TabCur: this.data.num_ABC.indexOf(res.user1_ABC),
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

  tabSelect(e) {
    var e_id = e.currentTarget.dataset.id
    var one_number = this.data.num_ABC[e_id]
    if (this.data.num_all.includes(one_number)) {
      this.setData({
        show_number: false,
      })
    } else {
      this.setData({
        show_number: true,
      })
    }
    this.setData({
      TabCur: e_id,
      // scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  get_api: function() {
    wx.request({
      url: 'https://www.kuaidi100.com/autonumber/autoComNum?text=' + this.data.code,
      // url: 'https://www.kuaidi100.com/autonumber/autoComNum?text=' +'TT6600279399070',
      success: res => {
        console.log('res.data', res.data)
        var auto_list = res.data.auto
        if (res.statusCode !== 200 || !auto_list || auto_list.length == 0) {
          if (this.data.code.slice(0, 2) === 'JD') {
            this.setData({
              company: '京东物流',
              can_auto_identify: true,
            })
          } else {
            this.setData({
              can_auto_identify: false,
            })
          }
        } else {
          var company_en = auto_list[0].comCode
          var company = this.data.company_dic[company_en]
          console.log(this.data.company_dic, company_en, company)
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

    var TabCur = this.data.TabCur
    if (TabCur === -1) {
      wx.showModal({
        content: '请选择用户编号的首字母',
        showCancel: false,
        confirmText: "确定",
        success: res => {
        }
      });
      return
    }
    
    var obj = e.detail.value
    var refund = e.detail.target.dataset.refund

    console.log('obj1111111111', obj)

    if (this.data.show_number) {
      var user_number = obj['user_number']
      if (user_number.length !== 3) {
        wx.showModal({
          content: '用户编号数字部分的长度不对，请输入用户编号的3位数字',
          showCancel: false,
          confirmText: "确定",
          success: res => {
          }
        });
        return
      }
      obj['user_number'] = this.data.num_ABC[TabCur] + user_number
    } else {
      obj['user_number'] = this.data.num_ABC[TabCur]
    }

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
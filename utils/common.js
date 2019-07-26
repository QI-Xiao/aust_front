const app = getApp()

function stringslice(strin, count) {
  var len = 0;
  for (var i = 0; i < strin.length; i++) {
    if (strin.charCodeAt(i) > 255) {
      len += 2;
    } else {
      len++;
    }
    if (len > count) {
      return strin.slice(0, [i - 1]) + '...'
    }
  }
  return strin;
}

class Req_common {
  constructor(parms) {
    this.withBaseURL = parms.withBaseURL
    this.baseURL = parms.baseURL
    this.stringslice = parms.stringslice
  }
  get(url, data) {
    return this.requestwhat('GET', url, data)
  }
  post(url, data) {
    return this.requestwhat('POST', url, data)
  }
  requestwhat(method, url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.withBaseURL ? this.baseURL + url : url,
        data,
        method,
        success: res => {
          var info = res['data']
          if (typeof info.error !== 'undefined' || res.statusCode !== 200) {
            console.log('common error', info)
            if (info.primary) {
              reject({
                error: info['error'],
                primary: info.primary,
                dft_butt: info.dft_butt,
                msg: '请求失败',
                url: this.withBaseURL ? this.baseURL + url : url,
                method,
                data
              })
            } else {
              reject({
                error: info['error'],
                msg: '请求失败',
                url: this.withBaseURL ? this.baseURL + url : url,
                method,
                data
              })
            }

          } else {
            resolve(info)
          }
        },
        fail: res => {
          reject({
            error: '请求服务器出错',
            msg: '请求失败',
            url: this.withBaseURL ? this.baseURL + url : url,
            method,
            data
          })
        }
      })
    })
  }
}

const req_com = new Req_common({
  baseURL: app.globalData.domain,
  withBaseURL: true,
  stringslice: stringslice
})

function shareinvite(groupinvite, whoinvite) {
  console.log(groupinvite, whoinvite)
  if (whoinvite !== undefined && whoinvite !== '') {
    if (app.globalData.status === 'new') {
      var data = { 'whoinvite': whoinvite, 'cookie': app.globalData.cookie}
      this.req_com.post(
        'sharejoin/', data
      ).then(res => {
        console.log(res.status)
        // wx.redirectTo({
        //   url: '/pages/success/success?sucinfo=' + res.status,
        // })
      }).catch(e => {
        console.log(e.error)
        wx.redirectTo({
          url: '/pages/error/error?error=' + e.error,
        })
      })
    }
    if (groupinvite !== undefined) {
      wx.showModal({
        title: '扫码入库团队邀请',
        content: '是否确认加入' + groupinvite + '团队',
        confirmText: "同意",
        cancelText: "拒绝",
        success: res => {
          if (res.confirm) {
            console.log('同意')
            var data = {}
            data['groupname'] = groupinvite
            data['cookie'] = app.globalData.cookie
            data['fromshare'] = true
            data['remarks'] = ''

            this.req_com.post(
              'group/join/', data
            ).then(res => {
              wx.navigateTo({
                url: '/pages/success/success?sucinfo=' + res.status,
              })
            }).catch(e => {
              wx.navigateTo({
                url: '/pages/error/error?error=' + e.error,
              })
            })

            // var data = {}
            // data['groupname'] = groupinvite
            // data['cookie'] = app.globalData.cookie
            // this.req_com.post(
            //   'group/invite/', data
            // ).then(res => {
            //   console.log(res)
            //   app.globalData.cur_group = res.cur_group
            //   Object.assign(app.globalData.g_and_d, res.add_g_and_d)
            //   Object.assign(app.globalData.isadminList, res.addisadmin)
            //   wx.redirectTo({
            //     url: '/pages/success/success?sucinfo=' + res.status,
            //   })
            // }).catch(e => {
            //   wx.redirectTo({
            //     url: '/pages/error/error?error=' + e.error,
            //   })
            // })
          }
        },
      });
    }
  }
}

function showmodal(title, content, showcancel, confirmText, cancelText) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: '请输入搜索关键词',
      showCancel: true,
      confirmText: '确定',
      cancelText: '哈哈',
      success(res) {
        resolve(res)
        // if (res.confirm) {
        //   resolve('用户点击确定')
        // } else if (res.cancel) {
        //   resolve('用户点击取消')
        // }
      }
    })
  })
}

function template_info(e) {
  if (!app.globalData.cookie) {
    wx.login({
      success: res => {
        if (res.code) {
          this.req_com.post(
            'login/', { code: res.code }
          ).then(res => {
            app.globalData.cookie = res.info.cookie
            this.req_com.post(
              'template/get/', { 'cookie': res.info.cookie, 'form_id': e.form_id, 'source': e.source}
            ).then(res => {
              console.log(res)
            }).catch(e => {
              console.log(e)
            })
          }).catch(e => {
            console.log('请求服务器失败，登录失败！' + e)
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  } else {
    this.req_com.post(
      'template/get/', { 'cookie': app.globalData.cookie, 'form_id': e.form_id, 'source': e.source }
    ).then(res => {
      console.log(res)
    }).catch(e => {
      console.log(e)
    })
  }
}

module.exports = {
  req_com,
  stringslice: stringslice,
  // shareinvite: shareinvite,
  // showmodal: showmodal,
  // template_info: template_info,
}
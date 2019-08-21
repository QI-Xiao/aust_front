App({
  onLaunch: function () {
    this.requestinf()
    wx.getSystemInfo({
      success: res => {
        this.globalData.Hrpxleft = 750 / res['windowWidth'] * res['windowHeight'] - 1110
      }
    })
  },

  requestinf: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.login({
            success: res => {
              if (res.code) {
                var codetobackend = res['code']
                // 获取用户信息，可得到 iv 和 encryptedData
                wx.getUserInfo({
                  success: res => {
                    var thisglobalDatauserInfo = res.userInfo
                    console.log('thisglobalDatauserInfo', thisglobalDatauserInfo)
                    // 请求后端
                    wx.request({
                      url: this.globalData.domain + 'login/',
                      method: 'POST',
                      header: { 'content-type': 'application/json' },
                      data: {
                        code: codetobackend,
                        iv: res['iv'],
                        encryptinput: res['encryptedData'],
                      },
                      success: res => {
                        console.log('request success', res)
                        // 请求成功，返回数据
                        var info = res['data']
                        if (typeof info.error !== 'undefined' || res.statusCode !== 200) {
                          // 与服务器链接失败
                          wx.navigateTo({
                            url: '/pages/error/error?error=' + info.error,
                          })
                        } else {
                          this.globalData.cookie = info.cookie
                          this.globalData.user_id = info.user_id
                          this.globalData.is_staff = info.is_staff
                          this.globalData.is_identified = info.is_identified
                          this.globalData.user_number = info.user_number
                          // this.globalData.remind_text = info.remind_text
                          this.globalData.date1 = info.date1
                          this.globalData.date2 = info.date2
                          if (info.info_address) {
                            this.globalData.info_address = info.info_address
                            this.globalData.info_person = info.info_person
                            this.globalData.info_phone = info.info_phone
                            this.globalData.info_ZIPcode = info.info_ZIPcode
                            this.globalData.info_text = info.info_text
                          }
                          this.globalData.userInfo = thisglobalDatauserInfo

                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                          // 所以此处加入 callback 以防止这种情况
                          if (this.userInfoReadyCallback) {
                            var resadd = {
                              cookie: this.globalData.cookie,
                              user_id: this.globalData.user_id,
                              is_staff: this.globalData.is_staff,
                              is_identified: this.globalData.is_identified,
                              user_number: this.globalData.user_number,
                              // remind_text: this.globalData.remind_text,
                              userInfo: this.globalData.userInfo,
                              info_address: this.globalData.info_address,
                              info_person: this.globalData.info_person,
                              info_phone: this.globalData.info_phone,
                              info_ZIPcode: this.globalData.info_ZIPcode,
                              info_text: this.globalData.info_text,
                            }
                            this.userInfoReadyCallback(resadd)
                          }
                        }
                      },
                      fail: function (res) {
                        console.log('fail', res)
                        wx.navigateTo({
                          url: '/pages/error/error?error=' + '请求服务器失败',
                        })
                      }
                    })
                  }
                })
              }
            },
            fail: function (res) {
              console.log('login failed', res)
              wx.navigateTo({
                url: '/pages/error/error?errorinfo=' + '登陆失败',
              })
            }
          })
        }
      }
    })
  },

  globalData: {
    cookie: '',
    user_id: '',
    is_staff: false,
    is_identified: false,
    userInfo: null,
    user_number: '',
    // remind_text: '',
    date1: '',
    date2: '',
    Hrpxleft: 0,
    domain: 'http://127.0.0.1:8000/aust/',
    // domain: 'https://aus.python666.cn/aust/',
    version: '0.9.5',
    info_address: '',
    info_person: [],
    info_phone: '',
    info_ZIPcode: '',
    info_text: '',
  }
})

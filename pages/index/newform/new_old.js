Page({

  data: {
  },

  onLoad: function (options) {
  },

  tonewform: function(options) {
    console.log(options)
    wx.navigateTo({
      url: 'newform?user=' + options.target.dataset.user,
    })
  },
})
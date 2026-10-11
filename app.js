App({
  onLaunch() {
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    const sugarRecords = wx.getStorageSync('sugarRecords') || []
    const medicineReminders = wx.getStorageSync('medicineReminders') || [
      { id: 1, time: '08:00', name: '降糖药', enabled: true },
      { id: 2, time: '12:30', name: '早餐后药', enabled: true }
    ]
    const activityRecords = wx.getStorageSync('activityRecords') || []

    this.globalData = {
      sugarRecords,
      medicineReminders,
      activityRecords,
      userInfo: null
    }
  },
  globalData: {
    sugarRecords: [],
    medicineReminders: [],
    activityRecords: [],
    userInfo: null
  }
})

Page({
  data: {
    userInfo: {},
    goal: '血糖控制目标：空腹 4.4-7.0 mmol/L',
    stats: {
      average: 0,
      days: 0,
      reminders: 0,
      activity: 0
    }
  },
  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || { name: '糖友' }
    const reminders = wx.getStorageSync('medicineReminders') || []
    const activity = wx.getStorageSync('activityRecords') || []
    const records = wx.getStorageSync('sugarRecords') || []

    const values = records.map(r => Number(r.value))
    const average = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0
    const sumMinutes = activity.reduce((acc, item) => acc + Number(item.minutes || 0), 0)

    this.setData({
      userInfo,
      stats: {
        average,
        days: records.length,
        reminders: reminders.filter(r => r.enabled).length,
        activity: sumMinutes
      }
    })
  },
  editGoal() {
    wx.showModal({
      title: '设置目标',
      content: '建议：空腹控制在 4.4-7.0 mmol/L',
      showCancel: false,
      confirmText: '知道了'
    })
  }
})

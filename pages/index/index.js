Page({
  data: {
    todaySugar: '7.6',
    averageSugar: '7.1',
    reminderCount: 2,
    goal: '保持血糖稳定，步行30分钟',
    recentRecords: [
      { time: '早餐前', value: 6.8 },
      { time: '午餐后', value: 8.1 },
      { time: '晚餐后', value: 7.4 },
      { time: '睡前', value: 7.0 }
    ]
  },
  onShow() {
    const records = wx.getStorageSync('sugarRecords') || []
    const reminders = wx.getStorageSync('medicineReminders') || []
    const activityRecords = wx.getStorageSync('activityRecords') || []

    if (records.length > 0) {
      const latest = records[records.length - 1]
      const values = records.map(item => Number(item.value))
      const avg = (values.reduce((sum, item) => sum + item, 0) / values.length).toFixed(1)

      this.setData({
        todaySugar: latest.value,
        averageSugar: avg,
        reminderCount: reminders.filter(item => item.enabled).length,
        goal: activityRecords.length > 0 ? `今日步数 ${activityRecords[activityRecords.length - 1].minutes} 分钟` : '保持血糖稳定，步行30分钟'
      })
    } else {
      this.setData({
        reminderCount: reminders.filter(item => item.enabled).length,
        goal: activityRecords.length > 0 ? `今日步数 ${activityRecords[activityRecords.length - 1].minutes} 分钟` : '保持血糖稳定，步行30分钟'
      })
    }
  }
})

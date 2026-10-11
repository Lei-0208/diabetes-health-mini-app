Page({
  data: {
    reminders: [],
    isNotificationReady: false,
    selectedTime: '08:00'
  },
  onLoad() {
    this.loadReminders()
  },
  onShow() {
    this.loadReminders()
  },
  loadReminders() {
    const reminders = wx.getStorageSync('medicineReminders') || []
    this.setData({ reminders })
  },
  addReminder() {
    const list = this.data.reminders
    list.push({
      id: Date.now(),
      time: '09:00',
      name: '新用药提醒',
      enabled: true
    })
    wx.setStorageSync('medicineReminders', list)
    this.setData({ reminders: list })
  },
  toggleReminder(e) {
    const { index } = e.currentTarget.dataset
    const list = this.data.reminders
    list[index].enabled = !list[index].enabled
    wx.setStorageSync('medicineReminders', list)
    this.setData({ reminders: list })
  },
  changeTime(e) {
    const { index } = e.currentTarget.dataset
    const time = e.detail.value
    const list = this.data.reminders
    list[index].time = time
    wx.setStorageSync('medicineReminders', list)
    this.setData({ reminders: list })
  },
  setNotification() {
    const { reminders } = this.data
    wx.showToast({ title: '提醒设置已保存', icon: 'success' })
    wx.setStorageSync('medicineReminders', reminders)
  }
})

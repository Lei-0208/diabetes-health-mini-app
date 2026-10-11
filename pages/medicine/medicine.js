Page({
  data: {
    reminders: []
  },
  onLoad() {
    this.loadData()
  },
  onShow() {
    this.loadData()
  },
  loadData() {
    const reminders = wx.getStorageSync('medicineReminders') || [
      { id: 1, time: '08:00', name: '降糖药', enabled: true },
      { id: 2, time: '12:30', name: '早餐后药', enabled: true }
    ]
    this.setData({ reminders })
  },
  addReminder() {
    const reminder = {
      id: Date.now(),
      time: '09:00',
      name: '新提醒',
      enabled: true
    }
    const list = this.data.reminders
    list.push(reminder)
    wx.setStorageSync('medicineReminders', list)
    this.setData({ reminders: list })
  },
  toggleReminder(e) {
    const { index } = e.currentTarget.dataset
    const list = this.data.reminders
    list[index].enabled = !list[index].enabled
    wx.setStorageSync('medicineReminders', list)
    this.setData({ reminders: list })
  }
})

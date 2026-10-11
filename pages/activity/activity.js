Page({
  data: {
    type: '快走',
    minutes: 30,
    records: []
  },
  onLoad() {
    const records = wx.getStorageSync('activityRecords') || []
    this.setData({ records })
  },
  bindTypeChange(e) {
    this.setData({ type: e.detail.value })
  },
  bindMinutesInput(e) {
    this.setData({ minutes: e.detail.value })
  },
  saveRecord() {
    const record = {
      id: Date.now(),
      type: this.data.type,
      minutes: Number(this.data.minutes),
      date: new Date().toLocaleDateString()
    }

    const list = wx.getStorageSync('activityRecords') || []
    list.push(record)
    wx.setStorageSync('activityRecords', list)
    this.setData({ records: list, type: '快走', minutes: 30 })
    wx.showToast({ title: '运动记录已保存' })
  }
})

Page({
  data: {
    typeIndex: 0,
    time: '08:00',
    value: '',
    records: [],
    types: ['空腹', '早餐后', '午餐后', '晚餐后', '睡前']
  },
  onLoad() {
    this.loadData()
  },
  onShow() {
    this.loadData()
  },
  loadData() {
    const records = wx.getStorageSync('sugarRecords') || []
    this.setData({ records: records.slice().reverse() })
  },
  bindTypeChange(e) {
    this.setData({ typeIndex: e.detail.value })
  },
  bindTimeChange(e) {
    this.setData({ time: e.detail.value })
  },
  bindValueInput(e) {
    this.setData({ value: e.detail.value })
  },
  addRecord() {
    const { value, time, typeIndex, types } = this.data
    if (!value) {
      wx.showToast({ title: '请输入血糖值', icon: 'none' })
      return
    }

    const record = {
      id: Date.now(),
      time,
      type: types[typeIndex],
      value: Number(value),
      date: new Date().toLocaleDateString()
    }

    const oldRecords = wx.getStorageSync('sugarRecords') || []
    const newRecords = [...oldRecords, record]
    wx.setStorageSync('sugarRecords', newRecords)

    wx.showToast({ title: '记录成功' })
    this.setData({ value: '', time: '08:00', typeIndex: 0 })
    this.loadData()
  }
})

Page({
  data: {
    userInfo: null,
    todayStats: {
      averageSugar: 0,
      sugarTimes: 0,
      highestSugar: 0,
      lowestSugar: 0,
      status: '正常'
    },
    weekStats: {
      averageSugar: 0,
      days: 0
    },
    monthStats: {
      averageSugar: 0,
      days: 0
    },
    activityToday: 0,
    medicineCount: 0,
    recentRecords: []
  },
  onShow() {
    this.loadUserInfo()
    this.calculateStats()
  },
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.redirectTo({ url: '/pages/login/login' })
      return
    }
    this.setData({ userInfo })
  },
  calculateStats() {
    const records = wx.getStorageSync('sugarRecords') || []
    const reminders = wx.getStorageSync('medicineReminders') || []
    const activities = wx.getStorageSync('activityRecords') || []

    const today = new Date().toLocaleDateString()
    const todayRecords = records.filter(r => r.date === today)

    let todayAvg = 0
    let highest = 0
    let lowest = 0

    if (todayRecords.length > 0) {
      const sum = todayRecords.reduce((acc, r) => acc + Number(r.value), 0)
      todayAvg = (sum / todayRecords.length).toFixed(1)
      highest = Math.max(...todayRecords.map(r => Number(r.value))).toFixed(1)
      lowest = Math.min(...todayRecords.map(r => Number(r.value))).toFixed(1)
    }

    let status = '未记录'
    if (todayRecords.length > 0) {
      const lastValue = Number(todayRecords[todayRecords.length - 1].value)
      if (lastValue < 5.6) status = '偏低 ⚠️'
      else if (lastValue <= 7.0) status = '正常 ✓'
      else if (lastValue <= 10.0) status = '轻微升高 ⚠️'
      else status = '升高 🔴'
    }

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const weekRecords = records.filter(r => new Date(r.date) >= weekAgo)
    const monthRecords = records.filter(r => new Date(r.date) >= monthAgo)

    let weekAvg = 0
    if (weekRecords.length > 0) {
      const sum = weekRecords.reduce((acc, r) => acc + Number(r.value), 0)
      weekAvg = (sum / weekRecords.length).toFixed(1)
    }

    let monthAvg = 0
    if (monthRecords.length > 0) {
      const sum = monthRecords.reduce((acc, r) => acc + Number(r.value), 0)
      monthAvg = (sum / monthRecords.length).toFixed(1)
    }

    const totalMinutes = activities
      .filter(a => a.date === today)
      .reduce((acc, a) => acc + Number(a.minutes || 0), 0)

    this.setData({
      todayStats: {
        averageSugar: todayAvg,
        sugarTimes: todayRecords.length,
        highestSugar: highest,
        lowestSugar: lowest,
        status
      },
      weekStats: {
        averageSugar: weekAvg,
        days: weekRecords.length
      },
      monthStats: {
        averageSugar: monthAvg,
        days: monthRecords.length
      },
      activityToday: totalMinutes,
      medicineCount: reminders.filter(r => r.enabled).length,
      recentRecords: todayRecords.slice(-3).reverse()
    })
  },
  navigateToRecord() {
    wx.navigateTo({ url: '/pages/record/record' })
  },
  navigateToChart() {
    wx.navigateTo({ url: '/pages/chart/chart' })
  },
  navigateToProfile() {
    wx.navigateTo({ url: '/pages/profile/profile' })
  }
})

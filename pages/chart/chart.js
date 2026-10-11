Page({
  data: {
    timeRange: 7,
    chartData: {
      dates: [],
      values: [],
      average: 0,
      highest: 0,
      lowest: 0
    }
  },
  onLoad() {
    this.loadChartData()
  },
  onShow() {
    this.loadChartData()
  },
  loadChartData() {
    const { timeRange } = this.data
    const records = wx.getStorageSync('sugarRecords') || []
    const cutoffDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000)
    const filtered = records.filter(r => new Date(r.date) >= cutoffDate)

    const grouped = {}
    filtered.forEach(r => {
      if (!grouped[r.date]) grouped[r.date] = []
      grouped[r.date].push(Number(r.value))
    })

    const dates = []
    const values = []
    const validValues = []

    for (let i = timeRange - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toLocaleDateString()
      dates.push(`${date.getMonth() + 1}/${date.getDate()}`)

      if (grouped[dateStr]) {
        const avg = grouped[dateStr].reduce((a, b) => a + b, 0) / grouped[dateStr].length
        values.push(avg)
        validValues.push(avg)
      } else {
        values.push(null)
      }
    }

    this.setData({
      'chartData.dates': dates,
      'chartData.values': values,
      'chartData.average': validValues.length ? (validValues.reduce((a, b) => a + b, 0) / validValues.length).toFixed(1) : 0,
      'chartData.highest': validValues.length ? Math.max(...validValues).toFixed(1) : 0,
      'chartData.lowest': validValues.length ? Math.min(...validValues).toFixed(1) : 0
    })

    this.drawChart()
  },
  drawChart() {
    const ctx = wx.createCanvasContext('sugarChart')
    const width = 700
    const height = 360
    const padding = 36
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const values = this.data.chartData.values.filter(v => v !== null)

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#f9fff9'
    ctx.fillRect(0, 0, width, height)

    // draw grid
    ctx.strokeStyle = '#e6f4ea'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    if (values.length === 0) {
      ctx.fillStyle = '#999'
      ctx.font = '26px sans-serif'
      ctx.fillText('暂无数据', width / 2 - 50, height / 2)
      ctx.draw()
      return
    }

    const minY = 3
    const maxY = 12

    ctx.strokeStyle = '#4CAF50'
    ctx.lineWidth = 3
    ctx.beginPath()
    let started = false

    this.data.chartData.values.forEach((value, index) => {
      if (value === null) return
      const x = padding + (chartWidth / (this.data.chartData.values.length - 1 || 1)) * index
      const y = padding + chartHeight - ((value - minY) / (maxY - minY)) * chartHeight
      if (!started) {
        ctx.moveTo(x, y)
        started = true
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // draw points
    this.data.chartData.values.forEach((value, index) => {
      if (value === null) return
      const x = padding + (chartWidth / (this.data.chartData.values.length - 1 || 1)) * index
      const y = padding + chartHeight - ((value - minY) / (maxY - minY)) * chartHeight
      ctx.beginPath()
      ctx.fillStyle = '#4CAF50'
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
    })

    // draw x labels
    ctx.fillStyle = '#7a8a7a'
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'center'
    this.data.chartData.dates.forEach((date, index) => {
      const x = padding + (chartWidth / (this.data.chartData.dates.length - 1 || 1)) * index
      if (index % Math.ceil(this.data.chartData.dates.length / 5) === 0 || index === this.data.chartData.dates.length - 1) {
        ctx.fillText(date, x, height - 10)
      }
    })

    ctx.draw()
  },
  switchTimeRange(e) {
    const range = Number(e.currentTarget.dataset.range)
    this.setData({ timeRange: range })
    this.loadChartData()
  }
})

class DashboardController {
  constructor(dashboardService) {
    this.dashboardService = dashboardService
  }

  summary = async (req, res) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().setDate(1))
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date()

    const summary = await this.dashboardService.getSummary(startDate, endDate)
    res.json(summary)
  }
}

module.exports = DashboardController

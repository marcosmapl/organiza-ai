const serialize = require('../utils/serialize')

class DashboardService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async getSummary(startDate, endDate) {
    const [expectedIncome, expectedExpenses, completedTransfers, accounts] = await Promise.all([
      this.prisma.income.aggregate({
        _sum: { expectedAmount: true },
        where: {
          scheduledDate: {
            gte: startDate,
            lte: endDate
          }
        }
      }),
      this.prisma.expense.aggregate({
        _sum: { expectedAmount: true },
        where: {
          scheduledDate: {
            gte: startDate,
            lte: endDate
          }
        }
      }),
      this.prisma.transfer.findMany({
        where: {
          effectiveDate: { not: null },
          scheduledDate: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          sourceAccount: { select: { id: true, title: true } },
          destinationAccount: { select: { id: true, title: true } }
        }
      }),
      this.prisma.account.findMany({
        select: {
          id: true,
          code: true,
          title: true,
          currentBalance: true,
          color: true,
          active: true
        }
      })
    ])

    return serialize({
      expectedIncome: expectedIncome._sum.expectedAmount ?? 0,
      expectedExpenses: expectedExpenses._sum.expectedAmount ?? 0,
      completedTransfers,
      accounts
    })
  }
}

module.exports = DashboardService

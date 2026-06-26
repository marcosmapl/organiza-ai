import { useCallback, useEffect, useMemo, useState } from 'react'
import client from '../api/client'
import { money } from '../utils/formatters'

const monthRange = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10)
  }
}

const DashboardPage = () => {
  const [range, setRange] = useState(monthRange)
  const [summary, setSummary] = useState({ expectedIncome: 0, expectedExpenses: 0, completedTransfers: [], accounts: [] })

  const loadSummary = useCallback(async () => {
    const { data } = await client.get('/dashboard/summary', { params: range })
    setSummary(data)
  }, [range])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  const net = useMemo(() => Number(summary.expectedIncome) - Number(summary.expectedExpenses), [summary])

  return (
    <section className="dashboard">
      <h2>Dashboard</h2>
      <div className="filters">
        <label>Start <input type="date" value={range.startDate} onChange={(event) => setRange({ ...range, startDate: event.target.value })} /></label>
        <label>End <input type="date" value={range.endDate} onChange={(event) => setRange({ ...range, endDate: event.target.value })} /></label>
      </div>
      <div className="cards">
        <article><h3>Expected Income</h3><strong>{money(summary.expectedIncome)}</strong></article>
        <article><h3>Expected Expenses</h3><strong>{money(summary.expectedExpenses)}</strong></article>
        <article><h3>Net Forecast</h3><strong>{money(net)}</strong></article>
        <article><h3>Completed Transfers</h3><strong>{summary.completedTransfers.length}</strong></article>
      </div>
      <div className="panel">
        <h3>Current Account Balances</h3>
        <ul>
          {summary.accounts.map((account) => (
            <li key={account.id}><span>{account.title}</span><strong>{money(account.currentBalance)}</strong></li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default DashboardPage

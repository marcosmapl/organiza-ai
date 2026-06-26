import { useEffect, useState } from 'react'
import CrudPage from '../components/CrudPage'
import client from '../api/client'
import { dateTime, money } from '../utils/formatters'

const IncomePage = () => {
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    client.get('/accounts').then(({ data }) => {
      setAccounts(data.map((account) => ({ label: account.title, value: account.id })))
    })
  }, [])

  return (
    <CrudPage
      title="Income"
      endpoint="/incomes"
      fields={[
        { name: 'description', label: 'Description', required: true },
        { name: 'expectedAmount', label: 'Expected Amount', type: 'number', required: true },
        { name: 'actualAmount', label: 'Actual Amount', type: 'number' },
        { name: 'scheduledDate', label: 'Scheduled Date', type: 'datetime-local', required: true },
        { name: 'effectiveDate', label: 'Effective Date', type: 'datetime-local' },
        { name: 'relatedAccountId', label: 'Account', type: 'select', required: true, options: accounts }
      ]}
      columns={[
        { key: 'description', label: 'Description' },
        { key: 'expectedAmount', label: 'Expected', render: (item) => money(item.expectedAmount) },
        { key: 'scheduledDate', label: 'Scheduled', render: (item) => dateTime(item.scheduledDate) },
        { key: 'relatedAccount', label: 'Account', render: (item) => item.relatedAccount?.title }
      ]}
    />
  )
}

export default IncomePage

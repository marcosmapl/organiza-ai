import { useEffect, useState } from 'react'
import CrudPage from '../components/CrudPage'
import client from '../api/client'
import { dateTime, money } from '../utils/formatters'

const TransfersPage = () => {
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    client.get('/accounts').then(({ data }) => {
      const options = data.map((account) => ({ label: account.title, value: account.id }))
      setAccounts(options)
    })
  }, [])

  return (
    <CrudPage
      title="Transfers"
      endpoint="/transfers"
      fields={[
        { name: 'description', label: 'Description', required: true },
        { name: 'amount', label: 'Amount', type: 'number', required: true },
        { name: 'sourceAccountId', label: 'Source Account', type: 'select', required: true, options: accounts },
        { name: 'destinationAccountId', label: 'Destination Account', type: 'select', required: true, options: accounts },
        { name: 'scheduledDate', label: 'Scheduled Date', type: 'datetime-local', required: true },
        { name: 'effectiveDate', label: 'Effective Date', type: 'datetime-local' }
      ]}
      columns={[
        { key: 'description', label: 'Description' },
        { key: 'amount', label: 'Amount', render: (item) => money(item.amount) },
        { key: 'sourceAccount', label: 'Source', render: (item) => item.sourceAccount?.title },
        { key: 'destinationAccount', label: 'Destination', render: (item) => item.destinationAccount?.title },
        { key: 'scheduledDate', label: 'Scheduled', render: (item) => dateTime(item.scheduledDate) }
      ]}
    />
  )
}

export default TransfersPage

import { useEffect, useState } from 'react'
import CrudPage from '../components/CrudPage'
import client from '../api/client'
import { money } from '../utils/formatters'

const AccountsPage = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    client.get('/users').then(({ data }) => {
      setUsers(data.map((user) => ({ label: user.username, value: user.id })))
    })
  }, [])

  return (
    <CrudPage
      title="Accounts"
      endpoint="/accounts"
      fields={[
        { name: 'code', label: 'Code', required: true },
        { name: 'title', label: 'Title', required: true },
        { name: 'active', label: 'Active', type: 'checkbox' },
        { name: 'color', label: 'Color', type: 'color' },
        { name: 'initialBalance', label: 'Initial Balance', type: 'number', required: true },
        { name: 'currentBalance', label: 'Current Balance', type: 'number', required: true },
        { name: 'userId', label: 'User', type: 'select', required: true, options: users }
      ]}
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'title', label: 'Title' },
        { key: 'currentBalance', label: 'Current Balance', render: (item) => money(item.currentBalance) },
        { key: 'active', label: 'Status', render: (item) => (item.active ? 'Active' : 'Inactive') }
      ]}
    />
  )
}

export default AccountsPage

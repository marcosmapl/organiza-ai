import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/income', label: 'Income' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/transfers', label: 'Transfers' }
]

const Layout = () => {
  const { logout } = useAuth()

  return (
    <div className="layout">
      <header>
        <h1>Organiza AI</h1>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={logout}>Logout</button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

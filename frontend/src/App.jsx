import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AccountsPage from './pages/AccountsPage'
import IncomePage from './pages/IncomePage'
import ExpensesPage from './pages/ExpensesPage'
import TransfersPage from './pages/TransfersPage'

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/"
      element={(
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      )}
    >
      <Route index element={<DashboardPage />} />
      <Route path="accounts" element={<AccountsPage />} />
      <Route path="income" element={<IncomePage />} />
      <Route path="expenses" element={<ExpensesPage />} />
      <Route path="transfers" element={<TransfersPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default App

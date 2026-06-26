import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/useAuth'

const LoginPage = () => {
  const navigate = useNavigate()
  const { token, login, register } = useAuth()
  const [form, setForm] = useState({ identity: '', password: '', username: '', email: '' })
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState('')

  if (token) {
    return <Navigate to="/" replace />
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      if (registering) {
        await register({ username: form.username, email: form.email, password: form.password })
      } else {
        await login({ identity: form.identity, password: form.password })
      }
      navigate('/')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Authentication failed')
    }
  }

  return (
    <section className="auth">
      <h1>Organiza AI</h1>
      <form onSubmit={onSubmit}>
        {registering ? (
          <>
            <label>Username <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required /></label>
            <label>Email <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          </>
        ) : (
          <label>Username or Email <input value={form.identity} onChange={(event) => setForm({ ...form, identity: event.target.value })} required /></label>
        )}
        <label>Password <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
        <button type="submit">{registering ? 'Create Account' : 'Login'}</button>
        <button type="button" onClick={() => setRegistering((current) => !current)}>
          {registering ? 'I already have an account' : 'Create new account'}
        </button>
        {error && <p className="feedback error">{error}</p>}
      </form>
    </section>
  )
}

export default LoginPage

import { useCallback, useMemo, useState } from 'react'
import client from '../api/client'
import { AuthContext } from './AuthContextValue'

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = useCallback(async (payload) => {
    const { data } = await client.post('/auth/login', payload)
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await client.post('/auth/register', payload)
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

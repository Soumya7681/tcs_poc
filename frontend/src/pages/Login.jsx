import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { clearError, loginUser } from '../redux/authSlice'
import './Login.css'

export default function Login() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setFormError('Email and password are required')
      return
    }
    setFormError('')
    dispatch(loginUser({ email: email.trim(), password }))
  }

  const message = formError || error

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1>Login</h1>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {message && <p className="login-error" role="alert">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

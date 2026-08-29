import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './LoginPage.css'
import { useLanguage } from '../context/LanguageContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function LoginPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData)

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      setMessage(t('loginSuccess'))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || t('loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-badge">{t('loginBadge')}</div>
        <h1>{t('loginTitle')}</h1>
        <p>{t('loginDescription')}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            {t('email')}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('emailPlaceholder')}
              required
            />
          </label>

          <label>
            {t('password')}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('passwordPlaceholder')}
              required
            />
          </label>

          {error ? <p className="form-message error">{error}</p> : null}
          {message ? <p className="form-message success">{message}</p> : null}

          <button type="submit" disabled={loading}>
            {loading ? t('loggingIn') : t('loginButton')}
          </button>
        </form>

        <p className="switch-link">
          {t('registerPrompt')} <Link to="/register">{t('registerLink')}</Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage

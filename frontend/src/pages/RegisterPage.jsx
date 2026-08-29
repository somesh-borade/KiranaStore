import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './RegisterPage.css'
import { useLanguage } from '../context/LanguageContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function RegisterPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await axios.post(`${API_URL}/auth/register`, formData)

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      setMessage(t('registrationSuccess'))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || t('registrationFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-badge">{t('registerBadge')}</div>
        <h1>{t('registerTitle')}</h1>
        <p>{t('registerDescription')}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            {t('fullName')}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('fullNamePlaceholder')}
              required
            />
          </label>

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
            {loading ? t('registering') : t('registerButton')}
          </button>
        </form>

        <p className="switch-link">
          {t('alreadyHaveAccount')} <Link to="/login">{t('loginButton')}</Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage

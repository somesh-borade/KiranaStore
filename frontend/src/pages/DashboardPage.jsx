import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './DashboardPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUser(response.data.user)
      } catch (err) {
        setError('Session expired. Please login again.')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      }
    }

    fetchUser()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-card">
        <div className="dashboard-topbar">
          <div>
            <p className="eyebrow">Kirana & General Store Management</p>
            <h1>Dashboard</h1>
          </div>
          <button type="button" onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {error ? <p className="dashboard-message error">{error}</p> : null}

        {user ? (
          <div className="welcome-box">
            <h2>Welcome, {user.name}</h2>
            <p>
              You are logged in as <strong>{user.role}</strong> with email{' '}
              <strong>{user.email}</strong>.
            </p>
            <p>
              Step 1 is ready. In the next step, we will add products and inventory
              management.
            </p>
          </div>
        ) : (
          <p className="dashboard-message">Loading your account...</p>
        )}
      </section>
    </main>
  )
}

export default DashboardPage

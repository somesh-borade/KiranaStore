import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './DashboardPage.css'
import {
  translateProductName,
  useLanguage,
} from '../context/LanguageContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_BASE_URL = API_URL.replace(/\/api$/, '')

const emptyForm = {
  name: '',
  brand: '',
  unit: '',
  purchasePrice: '',
  sellingPrice: '',
  sellingPrice50g: '',
  sellingPrice250g: '',
  currentStockQuantity: '',
  minimumStockQuantity: '',
}

function DashboardPage() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    lowStock: 0,
    outOfStock: 0,
  })
  const [formData, setFormData] = useState(emptyForm)
  const [productImage, setProductImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [statusInput, setStatusInput] = useState('all')
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    status: 'all',
  })
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [statusModal, setStatusModal] = useState('')
  const [statusProducts, setStatusProducts] = useState([])
  const [statusLoading, setStatusLoading] = useState(false)

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  })

  const openCreateForm = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setProductImage(null)
    setImagePreview('')
    setMessage('')
    setError('')
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setFormData(emptyForm)
    setProductImage(null)
    setImagePreview('')
    setEditingId(null)
  }

  const fetchDashboardData = useCallback(
    async () => {
      try {
        setLoading(true)
        const [productsResponse, statsResponse, userResponse] = await Promise.all([
          axios.get(`${API_URL}/products`, {
            headers: getHeaders(),
          }),
          axios.get(`${API_URL}/products/stats`, {
            headers: getHeaders(),
          }),
          axios.get(`${API_URL}/auth/me`, {
            headers: getHeaders(),
          }),
        ])

        setProducts(productsResponse.data.products)
        setStats(statsResponse.data.stats)
        setUser(userResponse.data.user)
      } catch {
        setError(t('sessionExpired'))
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    },
    [navigate, t],
  )

  useEffect(() => {
    // Load the dashboard data once the component is ready.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData()
  }, [fetchDashboardData])

  const hasFormImage = Boolean(imagePreview)
  const formTitle = useMemo(
    () => (editingId ? t('editProduct') : t('addProduct')),
    [editingId, t],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null
    setProductImage(file)

    if (file) {
      setImagePreview(URL.createObjectURL(file))
      return
    }

    setImagePreview('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormLoading(true)
    setMessage('')
    setError('')

    try {
      const payload = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value)
      })

      if (productImage) {
        payload.append('image', productImage)
      }

      const config = {
        headers: {
          ...getHeaders(),
        },
      }

      if (editingId) {
        await axios.put(`${API_URL}/products/${editingId}`, payload, config)
        setMessage(t('productUpdated'))
      } else {
        await axios.post(`${API_URL}/products`, payload, config)
        setMessage(t('productAdded'))
      }

      closeForm()
      await fetchDashboardData(appliedFilters)
    } catch (err) {
      setError(err.response?.data?.message || t('somethingWentWrong'))
    } finally {
      setFormLoading(false)
    }
  }

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchInput.trim(),
      status: statusInput,
    })
  }

  const handleResetFilters = () => {
    setSearchInput('')
    setStatusInput('all')
    setAppliedFilters({
      search: '',
      status: 'all',
    })
  }

  const closeStatusModal = () => {
    setStatusModal('')
    setStatusProducts([])
    setStatusLoading(false)
  }

  const openStatusModal = async (status) => {
    try {
      setStatusModal(status)
      setStatusLoading(true)
      setStatusProducts([])

      const response = await axios.get(`${API_URL}/products`, {
        headers: getHeaders(),
        params: { status },
      })

      setStatusProducts(response.data.products || [])
    } catch {
      setError(t('somethingWentWrong'))
    } finally {
      setStatusLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const displayProducts = useMemo(() => {
    const searchTerm = appliedFilters.search.toLowerCase()

    return products.filter((product) => {
      const localizedName = translateProductName(product.name, language).toLowerCase()
      const brand = (product.brand || '').toLowerCase()
      const unit = (product.unit || '').toLowerCase()
      const matchesSearch =
        !searchTerm ||
        localizedName.includes(searchTerm) ||
        product.name.toLowerCase().includes(searchTerm) ||
        brand.includes(searchTerm) ||
        unit.includes(searchTerm)

      const matchesStatus =
        appliedFilters.status === 'all' || product.status === appliedFilters.status

      return matchesSearch && matchesStatus
    })
  }, [appliedFilters.search, appliedFilters.status, products, language])

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">{t('appName')}</p>
            <h1>{t('dashboardTitle')}</h1>
            <p className="subtext">{t('dashboardDescription')}</p>
          </div>

          <div className="header-actions">
            <button type="button" className="add-product-btn" onClick={openCreateForm}>
              {t('addProduct')}
            </button>
            {user ? (
              <div className="user-pill">
                {t('loggedInAs')} <strong>{user.name}</strong>
              </div>
            ) : null}
            <button type="button" className="logout-btn" onClick={handleLogout}>
              {t('logout')}
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card total">
            <span>{t('totalProducts')}</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card available">
            <span>{t('available')}</span>
            <strong>{stats.available}</strong>
          </div>
          <button
            type="button"
            className="stat-card stat-card-button low"
            onClick={() => openStatusModal('low-stock')}
          >
            <span>{t('lowStock')}</span>
            <strong>{stats.lowStock}</strong>
          </button>
          <button
            type="button"
            className="stat-card stat-card-button out"
            onClick={() => openStatusModal('out-of-stock')}
          >
            <span>{t('outOfStock')}</span>
            <strong>{stats.outOfStock}</strong>
          </button>
        </section>

        <section className="panel">
          <div className="panel-title">
            <h2>{t('searchFilter')}</h2>
          </div>

          <div className="filters">
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t('searchPlaceholder')}
            />

            <select
              value={statusInput}
              onChange={(event) => setStatusInput(event.target.value)}
            >
              <option value="all">{t('allStatus')}</option>
              <option value="available">{t('availableStatus')}</option>
              <option value="low-stock">{t('lowStockStatus')}</option>
              <option value="out-of-stock">{t('outOfStockStatus')}</option>
            </select>

            <button type="button" className="primary-btn" onClick={handleApplyFilters}>
              {t('applyFilters')}
            </button>
            <button type="button" className="secondary-btn" onClick={handleResetFilters}>
              {t('reset')}
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <h2>{t('products')}</h2>
            <span className="count-pill">
              {displayProducts.length} {t('shown')}
            </span>
          </div>

          {loading ? <p className="loading-text">{t('loadingProducts')}</p> : null}

          {!loading && displayProducts.length === 0 ? (
            <div className="empty-gallery">
              <p className="empty-state">{t('noProductsFound')}</p>
            </div>
          ) : null}

          {displayProducts.length > 0 ? (
            <div className="product-grid">
              {displayProducts.map((product) => {
                const productName = translateProductName(product.name, language)

                return (
                  <article key={product._id} className="product-card">
                    <button
                      type="button"
                      className="product-card-image-button"
                      onClick={() => navigate(`/products/${product._id}`)}
                      aria-label={`${t('openProductDetails')}: ${productName}`}
                    >
                      <div className="product-card-image-frame">
                        {product.imageUrl ? (
                          <img
                            className="product-card-image"
                            src={`${API_BASE_URL}${product.imageUrl}`}
                            alt={productName}
                          />
                        ) : (
                          <div className="product-card-placeholder">
                            <span>{productName.slice(0, 1).toUpperCase() || 'K'}</span>
                          </div>
                        )}
                        <span className="product-card-overlay">
                          {t('openProductDetails')}
                        </span>
                      </div>
                    </button>

                    <div className="product-card-body">
                      <h3 className="product-card-title">{productName}</h3>
                      <p className="product-card-subtitle">{product.brand || t('brandOptional')}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : null}
        </section>
      </section>

      {isFormOpen ? (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeForm()
            }
          }}
        >
          <section className="modal-card" role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <p className="eyebrow">{t('productForm')}</p>
                <h2>{formTitle}</h2>
              </div>
              <button type="button" className="secondary-btn" onClick={closeForm}>
                {t('close')}
              </button>
            </div>

            <form className="product-form modal-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('productName')}
                required
              />

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder={t('brandOptional')}
              />
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder={t('unit')}
                required
              />
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                placeholder={t('purchasePrice')}
                min="0"
                step="0.01"
                required
              />
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder={t('sellingPrice')}
                min="0"
                step="0.01"
                required
              />
              <input
                type="number"
                name="sellingPrice50g"
                value={formData.sellingPrice50g}
                onChange={handleChange}
                placeholder={t('sellingPrice50g')}
                min="0"
                step="0.01"
              />
              <input
                type="number"
                name="sellingPrice250g"
                value={formData.sellingPrice250g}
                onChange={handleChange}
                placeholder={t('sellingPrice250g')}
                min="0"
                step="0.01"
              />
              <input
                type="number"
                name="currentStockQuantity"
                value={formData.currentStockQuantity}
                onChange={handleChange}
                placeholder={t('currentStock')}
                min="0"
                required
              />
              <input
                type="number"
                name="minimumStockQuantity"
                value={formData.minimumStockQuantity}
                onChange={handleChange}
                placeholder={t('minimumStock')}
                min="0"
                required
              />

              <div className="image-upload-box">
                <label className="file-label">
                  {t('productImage')}
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </label>

                {hasFormImage ? (
                  <img className="image-preview" src={imagePreview} alt="Preview" />
                ) : (
                  <div className="image-placeholder">{t('noImageSelected')}</div>
                )}
              </div>

              {error ? <p className="form-message error">{error}</p> : null}
              {message ? <p className="form-message success">{message}</p> : null}

              <button type="submit" className="primary-btn" disabled={formLoading}>
                {formLoading
                  ? t('saving')
                  : editingId
                    ? t('updateProduct')
                    : t('addProductButton')}
              </button>
            </form>
          </section>
        </div>
      ) : null}

      {statusModal ? (
        <div
          className="status-modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeStatusModal()
            }
          }}
        >
          <section className="status-modal-card" role="dialog" aria-modal="true">
            <div className="status-modal-header">
              <div>
                <p className="eyebrow">{t('dashboardTitle')}</p>
                <h2>
                  {statusModal === 'low-stock' ? t('lowStockStatus') : t('outOfStockStatus')}
                </h2>
              </div>
              <button type="button" className="close-icon-btn" onClick={closeStatusModal}>
                ×
              </button>
            </div>

            {statusLoading ? <p className="loading-text">{t('loadingProducts')}</p> : null}

            {!statusLoading && statusProducts.length === 0 ? (
              <p className="empty-state">{t('noProductsFound')}</p>
            ) : null}

            {!statusLoading && statusProducts.length > 0 ? (
              <div className="status-product-list">
                {statusProducts.map((product) => {
                  const productName = translateProductName(product.name, language)

                  return (
                    <article key={product._id} className="status-product-row">
                      <button
                        type="button"
                        className="status-product-image-button"
                        onClick={() => navigate(`/products/${product._id}`)}
                        aria-label={`${t('openProductDetails')}: ${productName}`}
                      >
                        {product.imageUrl ? (
                          <img
                            className="status-product-image"
                            src={`${API_BASE_URL}${product.imageUrl}`}
                            alt={productName}
                          />
                        ) : (
                          <div className="status-product-placeholder">
                            {productName.slice(0, 1).toUpperCase() || 'K'}
                          </div>
                        )}
                      </button>

                      <div className="status-product-info">
                        <button
                          type="button"
                          className="status-product-name"
                          onClick={() => navigate(`/products/${product._id}`)}
                        >
                          {productName}
                        </button>
                        <p className="status-product-meta">
                          {t('currentStock')}: <strong>{product.currentStockQuantity}</strong>
                        </p>
                        <p className="status-product-meta">
                          {t('minimumStock')}: <strong>{product.minimumStockQuantity}</strong>
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </main>
  )
}

export default DashboardPage

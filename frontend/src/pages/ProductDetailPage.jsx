import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './ProductDetailPage.css'
import { translateProductName, useLanguage } from '../context/LanguageContext.jsx'

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

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [productImage, setProductImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  })

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/products/${id}`, {
        headers: getHeaders(),
      })
      setProduct(response.data.product)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || t('somethingWentWrong'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load the product details once the page is ready.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, t])

  const productTitle = useMemo(() => {
    if (!product) {
      return ''
    }

    return translateProductName(product.name, language)
  }, [language, product])

  const hasOptionalPrice = (value) => value !== null && value !== undefined && value !== ''

  const openEditForm = () => {
    if (!product) {
      return
    }

    setFormData({
      name: product.name,
      brand: product.brand || '',
      unit: product.unit,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      sellingPrice50g: product.sellingPrice50g ?? '',
      sellingPrice250g: product.sellingPrice250g ?? '',
      currentStockQuantity: product.currentStockQuantity,
      minimumStockQuantity: product.minimumStockQuantity,
    })
    setProductImage(null)
    setImagePreview(product.imageUrl ? `${API_BASE_URL}${product.imageUrl}` : '')
    setMessage('')
    setError('')
    setIsEditOpen(true)
  }

  const closeEditForm = () => {
    setIsEditOpen(false)
    setFormData(emptyForm)
    setProductImage(null)
    setImagePreview('')
  }

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

    setImagePreview(product?.imageUrl ? `${API_BASE_URL}${product.imageUrl}` : '')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
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

      const response = await axios.put(`${API_URL}/products/${id}`, payload, {
        headers: getHeaders(),
      })

      setProduct(response.data.product)
      setMessage(t('productUpdated'))
      closeEditForm()
    } catch (err) {
      setError(err.response?.data?.message || t('somethingWentWrong'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?',
    )

    if (!confirmDelete) {
      return
    }

    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: getHeaders(),
      })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || t('somethingWentWrong'))
    }
  }

  return (
    <main className="detail-page">
      <section className="detail-shell">
        <div className="detail-topbar">
          <Link to="/dashboard" className="back-link">
            {t('backToDashboard')}
          </Link>
          <span className="detail-badge">{t('productDetails')}</span>
        </div>

        {loading ? <p className="detail-message">{t('loadingProducts')}</p> : null}
        {error ? <p className="detail-message error">{error}</p> : null}

        {product ? (
          <article className="detail-card">
            <div className="detail-hero">
              <button
                type="button"
                className="detail-image-button"
                onClick={() => {
                  if (product.imageUrl) {
                    window.open(
                      `${API_BASE_URL}${product.imageUrl}`,
                      '_blank',
                      'noopener,noreferrer',
                    )
                  }
                }}
                aria-label={t('openProductDetails')}
              >
                {product.imageUrl ? (
                  <img
                    className="detail-image"
                    src={`${API_BASE_URL}${product.imageUrl}`}
                    alt={productTitle || product.name}
                  />
                ) : (
                  <div className="detail-image empty">{productTitle || product.name}</div>
                )}
              </button>

              <div className="detail-heading">
                <p className="eyebrow">{t('productInfo')}</p>
                <h1>{productTitle}</h1>
                <div className="detail-tags">
                  <span className={`status-pill ${product.status}`}>{product.status}</span>
                  <span className="detail-tag">{product.brand || '-'}</span>
                </div>
                <div className="detail-actions">
                  <button
                    type="button"
                    className="detail-action-btn primary"
                    onClick={openEditForm}
                  >
                    {t('editProduct')}
                  </button>
                  <button
                    type="button"
                    className="detail-action-btn danger"
                    onClick={handleDelete}
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-panel">
                <h2>{t('productInfo')}</h2>
                <dl>
                  <div>
                    <dt>{t('productName')}</dt>
                    <dd>{productTitle}</dd>
                  </div>
                  <div>
                    <dt>{t('brandOptional')}</dt>
                    <dd>{product.brand || '-'}</dd>
                  </div>
                  <div>
                    <dt>{t('unit')}</dt>
                    <dd>{product.unit}</dd>
                  </div>
                </dl>
              </div>

              <div className="detail-panel">
                <h2>{t('stockInfo')}</h2>
                <dl>
                  <div>
                    <dt>{t('purchasePrice')}</dt>
                    <dd>{product.purchasePrice}</dd>
                  </div>
                  <div>
                    <dt>{t('sellingPrice')}</dt>
                    <dd>{product.sellingPrice}</dd>
                  </div>
                  {hasOptionalPrice(product.sellingPrice50g) ? (
                    <div>
                      <dt>{t('sellingPrice50g')}</dt>
                      <dd>{product.sellingPrice50g}</dd>
                    </div>
                  ) : null}
                  {hasOptionalPrice(product.sellingPrice250g) ? (
                    <div>
                      <dt>{t('sellingPrice250g')}</dt>
                      <dd>{product.sellingPrice250g}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>{t('currentStock')}</dt>
                    <dd>{product.currentStockQuantity}</dd>
                  </div>
                  <div>
                    <dt>{t('minimumStock')}</dt>
                    <dd>{product.minimumStockQuantity}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </article>
        ) : null}
      </section>

      {isEditOpen ? (
        <div
          className="detail-modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeEditForm()
            }
          }}
        >
          <section className="detail-modal-card" role="dialog" aria-modal="true">
            <div className="detail-modal-header">
              <div>
                <p className="eyebrow">{t('productForm')}</p>
                <h2>{t('editProduct')}</h2>
              </div>
              <button type="button" className="secondary-btn" onClick={closeEditForm}>
                {t('close')}
              </button>
            </div>

            <form className="detail-form" onSubmit={handleSubmit}>
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

              <div className="detail-image-upload-box">
                <label className="file-label">
                  {t('productImage')}
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </label>

                {imagePreview ? (
                  <img className="detail-image-preview" src={imagePreview} alt="Preview" />
                ) : (
                  <div className="image-placeholder">{t('noImageSelected')}</div>
                )}
              </div>

              {message ? <p className="form-message success">{message}</p> : null}
              {error ? <p className="form-message error">{error}</p> : null}

              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? t('saving') : t('updateProduct')}
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  )
}

export default ProductDetailPage

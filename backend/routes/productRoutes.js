const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const {
  getProductById,
  getProducts,
  getProductStats,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
} = require('../controllers/productController')

const router = express.Router()

router.use(protect)

router.get('/stats', getProductStats)
router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', upload.single('image'), createProduct)
router.put('/:id', upload.single('image'), updateProduct)
router.patch('/:id/stock', updateProductStock)
router.delete('/:id', deleteProduct)

module.exports = router

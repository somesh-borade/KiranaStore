const Product = require('../models/Product')

const getStockStatus = (stockQuantity, minimumStockQuantity) => {
  if (stockQuantity <= 0) {
    return 'out-of-stock'
  }

  if (stockQuantity <= minimumStockQuantity) {
    return 'low-stock'
  }

  return 'available'
}

const buildQueryFilters = (query) => {
  const filters = {}

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i')
    filters.$or = [
      { name: searchRegex },
      { brand: searchRegex },
      { unit: searchRegex },
    ]
  }

  return filters
}

const buildImageUrl = (req) => {
  if (!req.file) {
    return ''
  }

  return `/uploads/${req.file.filename}`
}

const parseOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return null
  }

  return Number(value)
}

const getProducts = async (req, res) => {
  try {
    const filters = buildQueryFilters(req.query)
    const products = await Product.find(filters).sort({ createdAt: -1 })

    const status = req.query.status
    const filteredProducts =
      status && status !== 'all'
        ? products.filter((product) => product.status === status)
        : products

    res.json({ products: filteredProducts })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ product })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getProductStats = async (req, res) => {
  try {
    const products = await Product.find({})

    const stats = products.reduce(
      (result, product) => {
        result.total += 1

        if (product.currentStockQuantity <= 0) {
          result.outOfStock += 1
        } else if (product.currentStockQuantity <= product.minimumStockQuantity) {
          result.lowStock += 1
          result.available += 1
        } else {
          result.available += 1
        }

        return result
      },
      {
        total: 0,
        available: 0,
        lowStock: 0,
        outOfStock: 0,
      },
    )

    res.json({ stats })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      unit,
      purchasePrice,
      sellingPrice,
      sellingPrice50g,
      sellingPrice250g,
      currentStockQuantity,
      minimumStockQuantity,
    } = req.body

    if (
      !name ||
      !unit ||
      purchasePrice === undefined ||
      sellingPrice === undefined ||
      currentStockQuantity === undefined ||
      minimumStockQuantity === undefined
    ) {
      return res.status(400).json({ message: 'All product fields are required' })
    }

    const stock = Number(currentStockQuantity)
    const minStock = Number(minimumStockQuantity)

    const product = await Product.create({
      name,
      brand: brand || '',
      unit,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      sellingPrice50g: parseOptionalNumber(sellingPrice50g),
      sellingPrice250g: parseOptionalNumber(sellingPrice250g),
      currentStockQuantity: stock,
      minimumStockQuantity: minStock,
      status: getStockStatus(stock, minStock),
      imageUrl: buildImageUrl(req),
    })

    res.status(201).json({
      message: 'Product added successfully',
      product,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const incomingStock =
      req.body.currentStockQuantity !== undefined
        ? Number(req.body.currentStockQuantity)
        : product.currentStockQuantity

    const incomingMinimumStock =
      req.body.minimumStockQuantity !== undefined
        ? Number(req.body.minimumStockQuantity)
        : product.minimumStockQuantity

    product.name = req.body.name ?? product.name
    product.brand = req.body.brand !== undefined ? req.body.brand : product.brand
    product.unit = req.body.unit ?? product.unit
    product.purchasePrice =
      req.body.purchasePrice !== undefined
        ? Number(req.body.purchasePrice)
        : product.purchasePrice
    product.sellingPrice =
      req.body.sellingPrice !== undefined
        ? Number(req.body.sellingPrice)
        : product.sellingPrice
    product.sellingPrice50g =
      req.body.sellingPrice50g !== undefined
        ? parseOptionalNumber(req.body.sellingPrice50g)
        : product.sellingPrice50g
    product.sellingPrice250g =
      req.body.sellingPrice250g !== undefined
        ? parseOptionalNumber(req.body.sellingPrice250g)
        : product.sellingPrice250g
    product.currentStockQuantity = incomingStock
    product.minimumStockQuantity = incomingMinimumStock
    product.status = getStockStatus(incomingStock, incomingMinimumStock)

    if (req.file) {
      product.imageUrl = buildImageUrl(req)
    }

    const updatedProduct = await product.save()

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    await product.deleteOne()

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateProductStock = async (req, res) => {
  try {
    const { action, amount } = req.body
    const quantity = Number(amount) || 1

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (action === 'increase') {
      product.currentStockQuantity += quantity
    } else if (action === 'decrease') {
      product.currentStockQuantity = Math.max(
        0,
        product.currentStockQuantity - quantity,
      )
    } else {
      return res.status(400).json({ message: 'Invalid stock action' })
    }

    product.status = getStockStatus(
      product.currentStockQuantity,
      product.minimumStockQuantity,
    )

    const updatedProduct = await product.save()

    res.json({
      message: 'Stock updated successfully',
      product: updatedProduct,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  getProductById,
  getProducts,
  getProductStats,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
}

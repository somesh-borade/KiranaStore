const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice50g: {
      type: Number,
      min: 0,
      default: null,
    },
    sellingPrice250g: {
      type: Number,
      min: 0,
      default: null,
    },
    currentStockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    minimumStockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 5,
    },
    status: {
      type: String,
      enum: ['available', 'low-stock', 'out-of-stock'],
      default: 'out-of-stock',
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Product', productSchema)

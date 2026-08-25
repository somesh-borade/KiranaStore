const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'kirana_secret_key', {
    expiresIn: '7d',
  })
}

module.exports = generateToken

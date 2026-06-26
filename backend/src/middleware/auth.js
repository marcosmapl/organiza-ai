const jwt = require('jsonwebtoken')
const ApiError = require('../utils/apiError')
const { jwtSecret } = require('../config/env')

const auth = (req, _res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Missing authorization token')
  }

  const token = header.replace('Bearer ', '')

  try {
    req.user = jwt.verify(token, jwtSecret)
    next()
  } catch {
    throw new ApiError(401, 'Invalid token')
  }
}

module.exports = auth

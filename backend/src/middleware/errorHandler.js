const { ZodError } = require('zod')

const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.issues
    })
  }

  const statusCode = error.statusCode || 500
  return res.status(statusCode).json({
    message: error.message || 'Unexpected error',
    details: error.details || null
  })
}

module.exports = errorHandler

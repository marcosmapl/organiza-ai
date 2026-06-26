const validate = (schema) => (req, _res, next) => {
  req.validated = schema.parse(req.body)
  next()
}

module.exports = validate

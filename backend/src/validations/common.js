const { z } = require('zod')

const numeric = z.coerce.number()
const dateValue = z.coerce.date()

const atLeastOne = (schema) => schema.refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided'
})

module.exports = { z, numeric, dateValue, atLeastOne }

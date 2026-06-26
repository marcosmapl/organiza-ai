const { Prisma } = require('@prisma/client')

const serialize = (value) => {
  if (value instanceof Prisma.Decimal) {
    return Number(value)
  }

  if (Array.isArray(value)) {
    return value.map(serialize)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, serialize(nested)]))
  }

  return value
}

module.exports = serialize

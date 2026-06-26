const express = require('express')
const asyncHandler = require('../utils/asyncHandler')
const validate = require('../middleware/validate')

const createEntityRouter = (controller, createSchema, updateSchema) => {
  const router = express.Router()

  router.get('/', asyncHandler(controller.list))
  router.get('/:id', asyncHandler(controller.getById))
  router.post('/', validate(createSchema), asyncHandler(controller.create))
  router.put('/:id', validate(updateSchema), asyncHandler(controller.update))
  router.delete('/:id', asyncHandler(controller.delete))

  return router
}

module.exports = createEntityRouter

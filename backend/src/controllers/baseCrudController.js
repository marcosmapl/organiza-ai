const serialize = require('../utils/serialize')

class BaseCrudController {
  constructor(service, filtersBuilder) {
    this.service = service
    this.filtersBuilder = filtersBuilder
  }

  list = async (req, res) => {
    const filters = this.filtersBuilder ? this.filtersBuilder(req.query) : {}
    const records = await this.service.list(filters)
    res.json(serialize(records))
  }

  getById = async (req, res) => {
    const record = await this.service.getById(Number(req.params.id))
    res.json(serialize(record))
  }

  create = async (req, res) => {
    const record = await this.service.create(req.validated)
    res.status(201).json(serialize(record))
  }

  update = async (req, res) => {
    const record = await this.service.update(Number(req.params.id), req.validated)
    res.json(serialize(record))
  }

  delete = async (req, res) => {
    await this.service.delete(Number(req.params.id))
    res.status(204).send()
  }
}

module.exports = BaseCrudController

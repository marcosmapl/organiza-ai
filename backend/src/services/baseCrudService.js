const ApiError = require('../utils/apiError')

class BaseCrudService {
  constructor(repository, options = {}) {
    this.repository = repository
    this.options = options
  }

  list(filters = {}) {
    return this.repository.findMany({
      where: filters.where,
      include: this.options.include
    })
  }

  async getById(id) {
    const entity = await this.repository.findUnique(id, { include: this.options.include })
    if (!entity) {
      throw new ApiError(404, `${this.options.label || 'Entity'} not found`)
    }
    return entity
  }

  create(payload) {
    return this.repository.create(payload, { include: this.options.include })
  }

  async update(id, payload) {
    await this.getById(id)
    return this.repository.update(id, payload, { include: this.options.include })
  }

  async delete(id) {
    await this.getById(id)
    return this.repository.delete(id)
  }
}

module.exports = BaseCrudService

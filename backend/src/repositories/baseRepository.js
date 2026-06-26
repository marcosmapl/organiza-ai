class BaseRepository {
  constructor(model) {
    this.model = model
  }

  findMany(params = {}) {
    return this.model.findMany(params)
  }

  findUnique(id, params = {}) {
    return this.model.findUnique({ where: { id }, ...params })
  }

  create(data, params = {}) {
    return this.model.create({ data, ...params })
  }

  update(id, data, params = {}) {
    return this.model.update({ where: { id }, data, ...params })
  }

  delete(id) {
    return this.model.delete({ where: { id } })
  }
}

module.exports = BaseRepository

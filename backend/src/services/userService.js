const bcrypt = require('bcryptjs')
const BaseCrudService = require('./baseCrudService')

class UserService extends BaseCrudService {
  async create(payload) {
    return super.create({ ...payload, password: await bcrypt.hash(payload.password, 10) })
  }

  async update(id, payload) {
    if (payload.password) {
      return super.update(id, { ...payload, password: await bcrypt.hash(payload.password, 10) })
    }

    return super.update(id, payload)
  }
}

module.exports = UserService

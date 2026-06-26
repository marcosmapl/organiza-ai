const BaseRepository = require('./baseRepository')

class UserRepository extends BaseRepository {
  findByUsernameOrEmail(value) {
    return this.model.findFirst({
      where: {
        OR: [{ username: value }, { email: value }]
      }
    })
  }
}

module.exports = UserRepository

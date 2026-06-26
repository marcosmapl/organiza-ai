const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ApiError = require('../utils/apiError')
const { jwtExpiresIn, jwtSecret } = require('../config/env')

class AuthService {
  constructor(userRepository, userStatusRepository) {
    this.userRepository = userRepository
    this.userStatusRepository = userStatusRepository
  }

  issueToken(user) {
    return jwt.sign({ sub: user.id, username: user.username }, jwtSecret, { expiresIn: jwtExpiresIn })
  }

  sanitizeUser(user) {
    const { password, ...safeUser } = user
    return safeUser
  }

  async register(payload) {
    const existing = await this.userRepository.findByUsernameOrEmail(payload.username)
    const existingEmail = await this.userRepository.findByUsernameOrEmail(payload.email)

    if (existing || existingEmail) {
      throw new ApiError(409, 'Username or email already exists')
    }

    let userStatusId = payload.userStatusId
    if (!userStatusId) {
      const active = await this.userStatusRepository.model.findFirst({ where: { code: 'ACTIVE' } })
      userStatusId = active ? active.id : null
    }

    const user = await this.userRepository.create({
      username: payload.username,
      email: payload.email,
      password: await bcrypt.hash(payload.password, 10),
      userStatusId
    }, {
      include: { userStatus: true }
    })

    return {
      token: this.issueToken(user),
      user: this.sanitizeUser(user)
    }
  }

  async login(payload) {
    const user = await this.userRepository.findByUsernameOrEmail(payload.identity)

    if (!user || !(await bcrypt.compare(payload.password, user.password))) {
      throw new ApiError(401, 'Invalid credentials')
    }

    return {
      token: this.issueToken(user),
      user: this.sanitizeUser(user)
    }
  }
}

module.exports = AuthService

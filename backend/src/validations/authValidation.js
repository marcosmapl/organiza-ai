const { z } = require('./common')

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  userStatusId: z.coerce.number().int().positive().optional()
})

const loginSchema = z.object({
  identity: z.string().min(1),
  password: z.string().min(1)
})

module.exports = { registerSchema, loginSchema }

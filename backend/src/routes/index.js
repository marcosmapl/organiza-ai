const express = require('express')
const { rateLimit } = require('express-rate-limit')
const prisma = require('../lib/prisma')
const BaseRepository = require('../repositories/baseRepository')
const UserRepository = require('../repositories/userRepository')
const BaseCrudService = require('../services/baseCrudService')
const UserService = require('../services/userService')
const AuthService = require('../services/authService')
const DashboardService = require('../services/dashboardService')
const BaseCrudController = require('../controllers/baseCrudController')
const AuthController = require('../controllers/authController')
const DashboardController = require('../controllers/dashboardController')
const createEntityRouter = require('./entityRoutes')
const auth = require('../middleware/auth')
const validate = require('../middleware/validate')
const asyncHandler = require('../utils/asyncHandler')
const { loginSchema, registerSchema } = require('../validations/authValidation')
const {
  userCreateSchema,
  userUpdateSchema,
  userStatusCreateSchema,
  userStatusUpdateSchema,
  accountCreateSchema,
  accountUpdateSchema,
  incomeCreateSchema,
  incomeUpdateSchema,
  expenseCreateSchema,
  expenseUpdateSchema,
  transferCreateSchema,
  transferUpdateSchema
} = require('../validations/entityValidation')

const buildDateFilters = (field) => (query) => {
  const where = {}

  if (query.startDate || query.endDate) {
    where[field] = {}
    if (query.startDate) where[field].gte = new Date(query.startDate)
    if (query.endDate) where[field].lte = new Date(query.endDate)
  }

  if (query.completed === 'true') {
    where.effectiveDate = { not: null }
  }

  return { where }
}

const buildRouter = () => {
  const router = express.Router()

  const userRepository = new UserRepository(prisma.user)
  const userStatusRepository = new BaseRepository(prisma.userStatus)
  const accountRepository = new BaseRepository(prisma.account)
  const incomeRepository = new BaseRepository(prisma.income)
  const expenseRepository = new BaseRepository(prisma.expense)
  const transferRepository = new BaseRepository(prisma.transfer)

  const authService = new AuthService(userRepository, userStatusRepository)
  const authController = new AuthController(authService)
  const authRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false
  })

  router.post('/auth/register', authRateLimit, validate(registerSchema), asyncHandler(authController.register))
  router.post('/auth/login', authRateLimit, validate(loginSchema), asyncHandler(authController.login))

  router.use(auth)

  const usersController = new BaseCrudController(
    new UserService(userRepository, { label: 'User', include: { userStatus: true } })
  )
  const userStatusController = new BaseCrudController(new BaseCrudService(userStatusRepository, { label: 'User status' }))
  const accountController = new BaseCrudController(
    new BaseCrudService(accountRepository, { label: 'Account', include: { user: { select: { id: true, username: true } } } })
  )
  const incomeController = new BaseCrudController(
    new BaseCrudService(incomeRepository, { label: 'Income', include: { relatedAccount: { select: { id: true, title: true } } } }),
    buildDateFilters('scheduledDate')
  )
  const expenseController = new BaseCrudController(
    new BaseCrudService(expenseRepository, { label: 'Expense', include: { relatedAccount: { select: { id: true, title: true } } } }),
    buildDateFilters('scheduledDate')
  )
  const transferController = new BaseCrudController(
    new BaseCrudService(transferRepository, {
      label: 'Transfer',
      include: {
        sourceAccount: { select: { id: true, title: true } },
        destinationAccount: { select: { id: true, title: true } }
      }
    }),
    buildDateFilters('scheduledDate')
  )

  const dashboardController = new DashboardController(new DashboardService(prisma))

  router.use('/users', createEntityRouter(usersController, userCreateSchema, userUpdateSchema))
  router.use('/user-statuses', createEntityRouter(userStatusController, userStatusCreateSchema, userStatusUpdateSchema))
  router.use('/accounts', createEntityRouter(accountController, accountCreateSchema, accountUpdateSchema))
  router.use('/incomes', createEntityRouter(incomeController, incomeCreateSchema, incomeUpdateSchema))
  router.use('/expenses', createEntityRouter(expenseController, expenseCreateSchema, expenseUpdateSchema))
  router.use('/transfers', createEntityRouter(transferController, transferCreateSchema, transferUpdateSchema))

  router.get('/dashboard/summary', asyncHandler(dashboardController.summary))

  return router
}

module.exports = buildRouter

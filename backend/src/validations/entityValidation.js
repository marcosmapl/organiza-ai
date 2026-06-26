const { z, numeric, dateValue, atLeastOne } = require('./common')

const userCreateSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  userStatusId: z.coerce.number().int().positive().optional()
})
const userUpdateSchema = atLeastOne(userCreateSchema.partial())

const userStatusCreateSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1)
})
const userStatusUpdateSchema = atLeastOne(userStatusCreateSchema.partial())

const accountCreateSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  active: z.coerce.boolean().optional(),
  color: z.string().optional().nullable(),
  initialBalance: numeric,
  currentBalance: numeric,
  userId: z.coerce.number().int().positive()
})
const accountUpdateSchema = atLeastOne(accountCreateSchema.partial())

const incomeCreateSchema = z.object({
  description: z.string().min(1),
  expectedAmount: numeric,
  actualAmount: numeric.optional().nullable(),
  scheduledDate: dateValue,
  effectiveDate: dateValue.optional().nullable(),
  relatedAccountId: z.coerce.number().int().positive()
})
const incomeUpdateSchema = atLeastOne(incomeCreateSchema.partial())

const expenseCreateSchema = z.object({
  description: z.string().min(1),
  expectedAmount: numeric,
  actualAmount: numeric.optional().nullable(),
  scheduledDate: dateValue,
  effectiveDate: dateValue.optional().nullable(),
  relatedAccountId: z.coerce.number().int().positive()
})
const expenseUpdateSchema = atLeastOne(expenseCreateSchema.partial())

const transferBaseSchema = z.object({
  description: z.string().min(1),
  amount: numeric,
  sourceAccountId: z.coerce.number().int().positive(),
  destinationAccountId: z.coerce.number().int().positive(),
  scheduledDate: dateValue,
  effectiveDate: dateValue.optional().nullable()
})

const transferCreateSchema = transferBaseSchema.refine(({ sourceAccountId, destinationAccountId }) => sourceAccountId !== destinationAccountId, {
  message: 'Source and destination accounts must be different',
  path: ['destinationAccountId']
})
const transferUpdateSchema = atLeastOne(transferBaseSchema.partial()).refine(
  ({ sourceAccountId, destinationAccountId }) => sourceAccountId === undefined || destinationAccountId === undefined || sourceAccountId !== destinationAccountId,
  {
    message: 'Source and destination accounts must be different',
    path: ['destinationAccountId']
  }
)

module.exports = {
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
}

const { transferCreateSchema } = require('../entityValidation')

describe('transferCreateSchema', () => {
  test('rejects transfers where source and destination are equal', () => {
    const result = transferCreateSchema.safeParse({
      description: 'invalid transfer',
      amount: 25,
      sourceAccountId: 1,
      destinationAccountId: 1,
      scheduledDate: '2026-06-01'
    })

    expect(result.success).toBe(false)
  })
})

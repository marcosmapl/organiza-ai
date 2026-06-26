const express = require('express')
const cors = require('cors')
const buildRouter = require('./routes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())
app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api', buildRouter())
app.use(errorHandler)

module.exports = app

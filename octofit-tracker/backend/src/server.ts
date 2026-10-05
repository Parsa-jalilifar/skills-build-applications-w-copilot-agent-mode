import cors from 'cors'
import express from 'express'
import db from './config/database.js'

const app = express()
const port = Number(process.env.PORT ?? 8000)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: db.readyState === 1 ? 'connected' : 'connecting',
  })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`OctoFit API listening on port ${port}`)
})
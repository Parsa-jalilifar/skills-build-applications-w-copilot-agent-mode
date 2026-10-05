import cors from 'cors'
import express from 'express'
import db from './config/database.js'
import Activity from './models/Activity.js'
import Leaderboard from './models/Leaderboard.js'
import Team from './models/Team.js'
import User from './models/User.js'
import Workout from './models/Workout.js'

const app = express()
const port = Number(process.env.PORT ?? 8000)
const codespaceName = process.env.CODESPACE_NAME
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: db.readyState === 1 ? 'connected' : 'connecting',
  })
})

app.get('/api/users/', async (_request, response) => {
  response.json(await User.find().lean())
})

app.get('/api/teams/', async (_request, response) => {
  response.json(await Team.find().populate('members', 'displayName email').lean())
})

app.get('/api/activities/', async (_request, response) => {
  response.json(await Activity.find().sort({ completedAt: -1 }).populate('user', 'displayName').lean())
})

app.get('/api/leaderboard/', async (_request, response) => {
  response.json(await Leaderboard.find().sort({ rank: 1, points: -1 }).populate('user team').lean())
})

app.get('/api/workouts/', async (_request, response) => {
  response.json(await Workout.find().lean())
})

app.listen(port, '0.0.0.0', () => {
  console.log(`OctoFit API listening at ${baseUrl}`)
})

export { app, baseUrl }
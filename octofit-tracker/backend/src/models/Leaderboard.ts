import mongoose, { Schema } from 'mongoose'

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    points: { type: Number, required: true, min: 0, default: 0 },
    rank: { type: Number, min: 1 },
    period: { type: String, default: 'all-time', trim: true },
  },
  { timestamps: true },
)

leaderboardSchema.index({ user: 1, period: 1 }, { unique: true })

const Leaderboard = mongoose.models.Leaderboard ?? mongoose.model('Leaderboard', leaderboardSchema)

export default Leaderboard
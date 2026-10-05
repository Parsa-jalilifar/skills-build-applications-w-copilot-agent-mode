import mongoose, { Schema } from 'mongoose'

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: {
      type: String,
      enum: ['running', 'walking', 'cycling', 'strength', 'other'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 0 },
    distanceKm: { type: Number, min: 0, default: 0 },
    notes: { type: String, default: '', trim: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

const Activity = mongoose.models.Activity ?? mongoose.model('Activity', activitySchema)

export default Activity
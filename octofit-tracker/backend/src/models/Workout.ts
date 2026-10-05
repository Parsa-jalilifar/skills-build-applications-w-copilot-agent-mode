import mongoose, { Schema } from 'mongoose'

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    category: {
      type: String,
      enum: ['strength', 'cardio', 'mobility', 'recovery', 'other'],
      default: 'other',
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    difficulty: { type: String, enum: ['easy', 'moderate', 'hard'], default: 'moderate' },
    exercises: [{ type: String, trim: true }],
  },
  { timestamps: true },
)

const Workout = mongoose.models.Workout ?? mongoose.model('Workout', workoutSchema)

export default Workout
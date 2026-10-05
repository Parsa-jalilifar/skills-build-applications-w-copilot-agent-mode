import mongoose, { Schema } from 'mongoose'

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '', trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
)

const Team = mongoose.models.Team ?? mongoose.model('Team', teamSchema)

export default Team
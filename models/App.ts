
import mongoose from 'mongoose'

const UserReviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
})

const AppSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviews: { type: String, required: true },
  downloads: { type: String, required: true },
  size: { type: String, required: true },
  version: { type: String, required: true },
  developer: { type: String, required: true },
  lastUpdated: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String, required: true },
  screenshots: [{ type: String }],
  downloadUrl: { type: String, required: true },
  trending: { type: Boolean, default: false },
  userReviews: [UserReviewSchema],
  features: [{ type: String }],
  modFeatures: [{ type: String }]
}, { 
  timestamps: true,
  versionKey: false,
  id: false,
  collection: 'apps'
})

// Remove any existing indexes and only keep the title index
AppSchema.index({ title: 1 }, { unique: true })

export default mongoose.models.App || mongoose.model('App', AppSchema)

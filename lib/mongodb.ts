import mongoose from 'mongoose'

const MONGODB_URI = 'mongodb+srv://amzilmhand2003:rhlTONpMpduucvOa@alienmods.u2gkz5x.mongodb.net/?retryWrites=true&w=majority&appName=Alienmods'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return
    }

    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export default connectDB

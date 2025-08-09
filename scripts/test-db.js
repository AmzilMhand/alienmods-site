const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = 'mongodb+srv://amzilmhand2003:rhlTONpMpduucvOa@alienmods.u2gkz5x.mongodb.net/?retryWrites=true&w=majority&appName=Alienmods'

// Define the Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

// Add the comparePassword method
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')
    
    // Register the model with schema
    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)
    
    const admin = await Admin.findOne({ username: 'admin' })
    console.log('Admin found:', {
      exists: !!admin,
      username: admin?.username,
      isActive: admin?.isActive,
      password: admin?.password // This will show the hashed password
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
  }
}

testConnection()
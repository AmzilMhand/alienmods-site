
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = 'mongodb+srv://amzilmhand2003:rhlTONpMpduucvOa@alienmods.u2gkz5x.mongodb.net/?retryWrites=true&w=majority&appName=Alienmods'

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    const adminData = {
      username: 'admin',
      email: 'admin@alienmods.com',
      password: 'admin123'
    }

    const existingAdmin = await Admin.findOne({ username: adminData.username })
    
    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    const admin = new Admin(adminData)
    await admin.save()
    
    console.log('Admin user created successfully!')
    console.log('Username:', adminData.username)
    console.log('Password:', adminData.password)
    console.log('Email:', adminData.email)
    
  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await mongoose.disconnect()
  }
}

createAdmin()

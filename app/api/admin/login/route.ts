import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { username, password } = body
    
    console.log('Login attempt for username:', username)
    
    if (!username || !password) {
      console.log('Missing credentials:', { username: !!username, password: !!password })
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    const admin = await Admin.findOne({ username })  // Remove isActive filter temporarily
    console.log('Full admin document:', {
      found: !!admin,
      username: admin?.username,
      isActive: admin?.isActive,
      _id: admin?._id,
    })

    console.log('Debug login:', {
      adminExists: !!admin,
      providedPassword: password,
      storedHash: admin?.password,
    })
    
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValidPassword = await admin.comparePassword(password)
    console.log('Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ 
      id: admin._id, 
      username: admin.username,
      email: admin.email 
    })

    const response = NextResponse.json({ 
      success: true, 
      admin: { 
        id: admin._id, 
        username: admin.username, 
        email: admin.email 
      } 
    })
    
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    console.log('Login successful for:', username)
    return response

  } catch (error: any) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

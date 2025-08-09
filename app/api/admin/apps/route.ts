
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import App from '@/models/App'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const apps = await App.find().sort({ createdAt: -1 })
    return NextResponse.json({ apps })
  } catch (error) {
    console.error('Get apps error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const appData = await request.json()
    const app = new App(appData)
    await app.save()
    
    return NextResponse.json({ success: true, app })
  } catch (error) {
    console.error('Create app error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

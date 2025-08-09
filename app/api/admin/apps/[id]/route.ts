
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import App from '@/models/App'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const appData = await request.json()
    const app = await App.findByIdAndUpdate(params.id, appData, { new: true })
    
    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, app })
  } catch (error) {
    console.error('Update app error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const app = await App.findByIdAndDelete(params.id)
    
    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete app error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

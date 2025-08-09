
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
    
    // Clean the data to remove any problematic fields
    const cleanAppData = {
      title: appData.title,
      icon: appData.icon,
      category: appData.category,
      rating: appData.rating,
      reviews: appData.reviews,
      downloads: appData.downloads,
      size: appData.size,
      version: appData.version,
      developer: appData.developer,
      lastUpdated: appData.lastUpdated,
      description: appData.description,
      fullDescription: appData.fullDescription,
      screenshots: appData.screenshots || [],
      downloadUrl: appData.downloadUrl,
      trending: appData.trending || false,
      userReviews: appData.userReviews || [],
      features: appData.features || [],
      modFeatures: appData.modFeatures || []
    }
    
    // Check for existing app with same title
    const existingApp = await App.findOne({ title: cleanAppData.title })
    if (existingApp) {
      return NextResponse.json({ error: 'App with this title already exists' }, { status: 409 })
    }
    
    const app = new App(cleanAppData)
    await app.save()
    
    return NextResponse.json({ success: true, app })
  } catch (error) {
    console.error('Create app error:', error)
    if (error.code === 11000) {
      // Check if it's the id field causing the issue
      if (error.keyPattern && error.keyPattern.id) {
        return NextResponse.json({ error: 'Database index conflict. Please contact administrator.' }, { status: 500 })
      }
      return NextResponse.json({ error: 'Duplicate app detected' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

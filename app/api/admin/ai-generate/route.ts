
import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { generateAppData, generateAppIcon, generateScreenshots, fetchPopularApps } from '@/lib/aiService'
import { connectDB } from '@/lib/connectDB'
import App from '@/models/App'

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { appName, isModded = false } = await request.json()
    
    if (!appName) {
      return NextResponse.json({ error: 'App name is required' }, { status: 400 })
    }

    // Generate app data using AI
    const appData = await generateAppData(appName, isModded)
    const icon = await generateAppIcon(appName)
    const screenshots = await generateScreenshots(appName)

    // Create the complete app object - use generated data, don't override
    const completeAppData = {
      ...appData, // This already includes downloadUrl from AI service
      icon,
      screenshots
    }

    return NextResponse.json({ 
      success: true, 
      appData: completeAppData 
    })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate app data' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'popular-apps') {
      const limit = Number.parseInt(searchParams.get('limit') || '20')
      const popularApps = await fetchPopularApps(limit)
      return NextResponse.json({ success: true, apps: popularApps })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Bulk generate apps from popular list
export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { appNames, isModded = false } = await request.json()
    
    if (!Array.isArray(appNames) || appNames.length === 0) {
      return NextResponse.json({ error: 'App names array is required' }, { status: 400 })
    }

    const results = []
    
    for (const appName of appNames) {
      try {
        // Check if app already exists
        const existingApp = await App.findOne({ 
          title: new RegExp(`^${appName}$`, 'i') 
        })
        
        if (existingApp) {
          results.push({ appName, status: 'exists', id: existingApp._id })
          continue
        }

        // Generate app data
        const appData = await generateAppData(appName, isModded)
        const icon = await generateAppIcon(appName)
        const screenshots = await generateScreenshots(appName)

        const completeAppData = {
          ...appData, // This already includes all required fields from AI service
          icon,
          screenshots
        }

        // Save to database
        const app = new App(completeAppData)
        await app.save()
        
        results.push({ 
          appName, 
          status: 'created', 
          id: app._id,
          data: completeAppData 
        })
      } catch (error) {
        results.push({ 
          appName, 
          status: 'error', 
          error: error.message 
        })
      }
    }

    return NextResponse.json({ 
      success: true, 
      results 
    })
  } catch (error) {
    console.error('Bulk generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to bulk generate apps' 
    }, { status: 500 })
  }
}

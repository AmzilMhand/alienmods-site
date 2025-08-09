
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/connectDB'
import App from '@/models/App'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ success: false, message: 'Query parameter is required' }, { status: 400 })
    }

    await connectDB()
    
    const apps = await App.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).limit(5).lean()

    return NextResponse.json({
      success: true,
      apps
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

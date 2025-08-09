import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'AIzaSyDhZlOTdFwoSV8bXBI1DzwOtrlqlGOTytM')

export interface AppData {
  title: string
  category: string
  description: string
  fullDescription: string
  developer: string
  version: string
  rating: number
  size: string
  features: string[]
  modFeatures?: string[]
}

export async function generateAppData(appName: string, isModded: boolean = false): Promise<AppData> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
Generate detailed information for the mobile app "${appName}" ${isModded ? '(MOD APK version)' : ''}.
Provide the following information in JSON format:

{
  "title": "App name",
  "category": "App category (Games, Social, Entertainment, Productivity, etc.)",
  "description": "Brief 2-3 sentence description",
  "fullDescription": "Detailed description (200-300 words)",
  "developer": "Developer name",
  "version": "Latest version number",
  "rating": "Rating out of 5 (number)",
  "size": "App size (e.g., 150MB)",
  "features": ["feature1", "feature2", "feature3"],
  ${isModded ? '"modFeatures": ["Unlimited coins", "Premium unlocked", "Ad-free", "etc"],' : ''}
}

${isModded ? 'For MOD APK, include typical modded features like unlimited resources, premium unlocked, ad-free experience, etc.' : ''}
Make sure all information is realistic and matches the actual app if it exists.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const appData = JSON.parse(jsonMatch[0])
      // Add default values for required fields not provided by AI
    const completeAppData = {
      ...appData,
      icon: await generateAppIcon(appData.title),
      screenshots: await generateScreenshots(appData.title),
      downloads: `${Math.floor(Math.random() * 9000 + 1000)}K+`,
      reviews: `${Math.floor(Math.random() * 900 + 100)}K`,
      lastUpdated: new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      downloadUrl: `https://download.alienmods.com/apps/${appData.title.toLowerCase().replace(/\s+/g, '-')}.apk`,
      trending: Math.random() > 0.7,
      userReviews: [
        {
          username: "TechUser2024",
          rating: 5,
          comment: "Amazing app! Works perfectly and the interface is very user-friendly."
        },
        {
          username: "AppLover99",
          rating: 4,
          comment: "Great features and regular updates. Highly recommended!"
        },
        {
          username: "MobileGamer",
          rating: 5,
          comment: "Best app in its category. Love all the features!"
        }
      ]
    }
      return completeAppData
    }
    throw new Error('Failed to parse AI response')
  } catch (error) {
    console.error('AI generation error:', error)
    throw new Error('Failed to generate app data')
  }
}

export async function generateAppIcon(appName: string): Promise<string> {
  // For now, return a placeholder. You can integrate with image generation APIs later
  return `/placeholder.svg?height=120&width=120&text=${encodeURIComponent(appName)}`
}

export async function generateScreenshots(appName: string, count: number = 4): Promise<string[]> {
  // For now, return placeholders. You can integrate with image generation APIs later
  return Array.from({ length: count }, (_, i) => 
    `/placeholder.svg?height=400&width=200&text=${encodeURIComponent(appName + ' ' + (i + 1))}`
  )
}

// Fetch popular apps from a public API
export async function fetchPopularApps(limit: number = 20): Promise<string[]> {
  try {
    // This is a mock list of popular apps. You can replace with actual API calls
    const popularApps = [
      'WhatsApp', 'Instagram', 'TikTok', 'Spotify', 'Netflix', 'YouTube',
      'Clash of Clans', 'Candy Crush Saga', 'Pokemon GO', 'Among Us',
      'PUBG Mobile', 'Call of Duty Mobile', 'Fortnite', 'Minecraft',
      'Roblox', 'Zoom', 'Discord', 'Telegram', 'Twitter', 'Facebook',
      'Snapchat', 'LinkedIn', 'Uber', 'Amazon', 'PayPal'
    ]

    return popularApps.slice(0, limit)
  } catch (error) {
    console.error('Error fetching popular apps:', error)
    return []
  }
}
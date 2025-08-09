import type { Metadata } from "next"
import CategoryChips from "@/components/CategoryChips"
import AppCard from "@/components/AppCard"
import AdBanner from "@/components/AdBanner"
import { apps } from "@/data/apps"
import { TrendingUp, Clock, Download } from "lucide-react"

export const metadata: Metadata = {
  title: "AlienMods - Premium Mobile Apps & Games Download",
  description: "Download trending mobile apps and games. Get premium apps for free with our secure download system.",
}

export default function HomePage() {
  const trendingApps = apps.filter((app) => app.trending).slice(0, 6)
  const recentApps = apps.slice(0, 8)
  const topDownloads = apps
    .sort(
      (a, b) => Number.parseInt(b.downloads.replace(/[^\d]/g, "")) - Number.parseInt(a.downloads.replace(/[^\d]/g, "")),
    )
    .slice(0, 6)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Premium Mobile Apps & Games
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Download the latest trending apps and modded games for free
        </p>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <CategoryChips />
      </div>

      {/* Ad Banner */}
      <div className="mb-8">
        <AdBanner className="h-32" />
      </div>

      {/* Trending Apps */}
      <section className="mb-12">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      {/* Top Downloads */}
      <section className="mb-12">
        <div className="flex items-center space-x-2 mb-6">
          <Download className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Most Downloaded</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topDownloads.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      {/* Recent Uploads */}
      <section className="mb-12">
        <div className="flex items-center space-x-2 mb-6">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recently Added</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>
    </div>
  )
}

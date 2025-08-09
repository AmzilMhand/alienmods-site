import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, Download, Shield, Smartphone, Calendar, Users } from "lucide-react"
import ContentLocker from "@/components/ContentLocker"
import AdBanner from "@/components/AdBanner"
import { apps } from "@/data/apps"

interface AppPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const app = apps.find((a) => a.id === params.id)

  if (!app) {
    return {
      title: "App Not Found - AlienMods",
    }
  }

  return {
    title: `${app.title} - Download Free | AlienMods`,
    description: `Download ${app.title} for free. ${app.description}`,
    keywords: `${app.title}, ${app.category}, mobile app, download, free`,
  }
}

export async function generateStaticParams() {
  return apps.map((app) => ({
    id: app.id,
  }))
}

export default function AppPage({ params }: AppPageProps) {
  const app = apps.find((a) => a.id === params.id)

  if (!app) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* App Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <Image
            src={app.icon || "/placeholder.svg"}
            alt={app.title}
            width={120}
            height={120}
            className="rounded-2xl"
          />
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{app.title}</h1>
            <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{app.category}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{app.rating}</span>
                <span>({app.reviews} reviews)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>{app.downloads}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Smartphone className="w-4 h-4" />
                <span>{app.size}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Shield className="w-3 h-3 mr-1" />
                Verified Safe
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Calendar className="w-3 h-3 mr-1" />
                Updated {app.lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Download</h2>
        <ContentLocker downloadUrl={app.downloadUrl} appTitle={app.title} />
      </div>

      {/* Ad Banner */}
      <div className="mb-6">
        <AdBanner className="h-40" />
      </div>

      {/* Screenshots */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Screenshots</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {app.screenshots.map((screenshot, index) => (
            <Image
              key={index}
              src={screenshot || "/placeholder.svg"}
              alt={`${app.title} screenshot ${index + 1}`}
              width={200}
              height={400}
              className="rounded-lg border border-gray-200 dark:border-gray-700"
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About {app.title}</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{app.fullDescription || app.description}</p>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">App Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Version</h3>
            <p className="text-gray-600 dark:text-gray-400">{app.version}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Developer</h3>
            <p className="text-gray-600 dark:text-gray-400">{app.developer}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Size</h3>
            <p className="text-gray-600 dark:text-gray-400">{app.size}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Last Updated</h3>
            <p className="text-gray-600 dark:text-gray-400">{app.lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reviews</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-900 dark:text-white">{app.rating}</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">({app.reviews} reviews)</span>
          </div>
        </div>

        <div className="space-y-4">
          {app.userReviews?.map((review, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{review.username}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                </div>
              </div>
            </div>
          )) || (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No reviews yet. Be the first to review this app!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

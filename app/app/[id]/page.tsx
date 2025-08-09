import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, Download, Shield, Smartphone, Calendar, Users } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import ContentLocker from "@/components/ContentLocker"
import AdBanner from "@/components/AdBanner"
import { connectDB } from "@/lib/connectDB"
import App from "@/models/App"
import mongoose from "mongoose"

interface AppPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return {
      title: "App Not Found - AlienMods",
    }
  }

  await connectDB()
  const app = await App.findById(params.id).lean()

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
  await connectDB()
  const apps = await App.find({}).lean()
  return apps.map((app) => ({
    id: app._id.toString(),
  }))
}

export default async function AppPage({ params }: AppPageProps) {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    notFound()
  }

  await connectDB()
  const app = await App.findById(params.id).lean()

  if (!app) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* App Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-row items-start space-y-4 space-x-4 sm:space-x-6 mb-4">
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
            <div className="hidden sm:flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{app.rating}</span>
            <span>({app.reviews} reviews)</span>
          </div>
          <div className="flex items-center space-x-1">
            <Smartphone className="w-4 h-4" />
            <span>{app.size}</span>

          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>{app.downloads}</span>
          </div>
        </div>
          </div>
          </div>
        <div className="flex sm:hidden justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{app.rating}</span>
            <span>({app.reviews} reviews)</span>
          </div>
          <div className="flex items-center space-x-1">
            <Smartphone className="w-4 h-4" />
            <span>{app.size}</span>

          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>{app.downloads}</span>
          </div>
        </div>
      {/* Download Section */}
        <ContentLocker downloadUrl={app.downloadUrl} appTitle={app.title} />

      </div>



      {/* Ad Banner */}
      <div className="mb-6">
        <AdBanner className="h-40" />
      </div>

      {/* Screenshots */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Screenshots</h2>
        <Carousel
  opts={{
    align: "start",
    loop: false,
  }}
  className="w-full"
>
  <CarouselContent className="-ml-2 md:-ml-4">
    {app.screenshots.map((screenshot, index) => (
      <CarouselItem key={index} className="pl-2 md:pl-4 basis-auto">
        <div className="p-1">
          {/* Fixed height, width adjusts automatically */}
          <div className="flex items-center justify-center overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-black h-80 md:h-96">
            <Image
              src={screenshot || "/placeholder.svg"}
              alt={`${app.title} screenshot ${index + 1}`}
              width={300} // just a placeholder for Next.js (keeps aspect ratio)
              height={600}
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>

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
                          className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
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
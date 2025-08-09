import Image from "next/image"
import Link from "next/link"
import { Star, Download } from "lucide-react"

interface AppCardProps {
  app: {
    id: string
    title: string
    icon: string
    category: string
    rating: number
    downloads: string
    size: string
    description: string
  }
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <Link href={`/app/${app.id}`} className="block">
      <div className="app-card p-4 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-start space-x-3">
          <Image
            src={app.icon || "/placeholder.svg"}
            alt={app.title}
            width={64}
            height={64}
            className="rounded-xl flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{app.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{app.category}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{app.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="w-3 h-3" />
                <span>{app.downloads}</span>
              </div>
              <span>{app.size}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{app.description}</p>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors">
            Get
          </button>
        </div>
      </div>
    </Link>
  )
}

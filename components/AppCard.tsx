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
      <div className="  hover:scale-[1.02] transition-transform duration-200">
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
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1  rounded-full">{app.category}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
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
          </div>
        </div>
        
      </div>
    </Link>
  )
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import AppCard from "@/components/AppCard"
import CategoryChips from "@/components/CategoryChips"
import AdBanner from "@/components/AdBanner"
import { apps } from "@/data/apps"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

const categoryNames: { [key: string]: string } = {
  action: "Action Games",
  racing: "Racing Games",
  strategy: "Strategy Games",
  "premium-apps": "Premium Apps",
  productivity: "Productivity Apps",
  entertainment: "Entertainment Apps",
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = categoryNames[params.slug]

  if (!categoryName) {
    return {
      title: "Category Not Found - AlienMods",
    }
  }

  return {
    title: `${categoryName} - AlienMods`,
    description: `Download the best ${categoryName.toLowerCase()} for mobile. Premium apps and games available for free.`,
  }
}

export async function generateStaticParams() {
  return Object.keys(categoryNames).map((slug) => ({
    slug,
  }))
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = categoryNames[params.slug]

  if (!categoryName) {
    notFound()
  }

  const categoryApps = apps.filter((app) => app.category.toLowerCase().replace(/\s+/g, "-") === params.slug)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{categoryName}</h1>
        <p className="text-gray-600 dark:text-gray-400">{categoryApps.length} apps available</p>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <CategoryChips activeCategory={params.slug} />
      </div>

      {/* Ad Banner */}
      <div className="mb-8">
        <AdBanner className="h-32" />
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>

      {categoryApps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No apps found in this category yet.</p>
        </div>
      )}
    </div>
  )
}

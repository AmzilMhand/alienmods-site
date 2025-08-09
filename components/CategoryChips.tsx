import Link from "next/link"

const categories = [
  { name: "All", slug: "" },
  { name: "Action", slug: "action" },
  { name: "Racing", slug: "racing" },
  { name: "Strategy", slug: "strategy" },
  { name: "Premium", slug: "premium-apps" },
  { name: "Productivity", slug: "productivity" },
]

interface CategoryChipsProps {
  activeCategory?: string
}

export default function CategoryChips({ activeCategory = "" }: CategoryChipsProps) {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={category.slug ? `/category/${category.slug}` : "/"}
          className={`category-chip whitespace-nowrap ${
            activeCategory === category.slug ? "bg-blue-600 text-white" : ""
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}

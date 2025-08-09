"use client"

import { useState, useRef, useEffect } from "react"
import { SearchIcon, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface SearchResult {
  id: string
  title: string
  icon: string
  category: string
  rating: number
}

export default function SearchComponent() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.trim() === "") {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchApps = async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()

        if (data.success) {
          const mappedResults = data.apps.map((app: any) => ({
            id: app.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
            title: app.title,
            icon: app.icon,
            category: app.category,
            rating: app.rating
          }))
          setResults(mappedResults)
          setIsOpen(true)
        } else {
          setResults([])
          setIsOpen(false)
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
        setIsOpen(false)
      }
    }

    const debounceTimer = setTimeout(searchApps, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search apps and games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="py-2">
              {results.map((app) => (
                <Link
                  key={app.id}
                  href={`/app/${app.id}`}
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Image
                    src={app.icon || "/placeholder.svg"}
                    alt={app.title}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{app.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.category}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-yellow-500">★</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{app.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
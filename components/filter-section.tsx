"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const popularTags = ["javascript", "webdev", "react", "beginners", "programming", "python", "typescript", "css"]

function FilterSectionInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const currentTag = searchParams.get("tag")
  const currentQuery = searchParams.get("query")

  useEffect(() => {
    if (currentQuery) {
      setSearchQuery(currentQuery)
    }
  }, [currentQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set("query", searchQuery.trim())
      if (currentTag) {
        params.set("tag", currentTag)
      }
      router.push(`/?${params.toString()}`)
    } else if (currentTag) {
      router.push(`/?tag=${currentTag}`)
    } else {
      router.push("/")
    }
  }

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams()
    params.set("tag", tag)
    if (currentQuery) {
      params.set("query", currentQuery)
    }
    router.push(`/?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchQuery("")
    router.push("/")
  }

  const hasActiveFilters = currentTag || currentQuery

  return (
    <section className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <form onSubmit={handleSearch} className="w-full md:w-auto flex-1 md:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>
        </form>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            Clear filters
          </Button>
        )}
      </div>

      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {popularTags.map((tag) => (
          <Badge
            key={tag}
            variant={currentTag === tag ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/90 transition-colors"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </motion.div>
    </section>
  )
}

export default function FilterSection() {
  return (
    <Suspense fallback={null}>
      <FilterSectionInner />
    </Suspense>
  )
}
